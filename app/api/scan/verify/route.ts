import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isTicketScannedInCache, markTicketScannedCache } from "@/lib/upstash/client";
import { extractTokenFromScan, isValidQrFormat } from "@/lib/qr/signer";
import { recordStaffScan } from "@/actions/scanner-staff";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawScan, eventId, pin, scannerId, gateName } = body;

    if (!rawScan || !eventId) {
      return NextResponse.json(
        { success: false, error: "Missing scan token or event ID" },
        { status: 400 }
      );
    }

    const cleanToken = extractTokenFromScan(rawScan);
    if (!isValidQrFormat(cleanToken)) {
      return NextResponse.json({
        success: false,
        status: "invalid",
        error: "Unrecognized ticket format. Not a GetMyShow cryptographic pass.",
      });
    }

    // 1. Verify Event & Gate Permissions
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (e) {
      console.warn("Supabase admin credentials not set:", e);
      return NextResponse.json({
        success: false,
        error: "Database configuration incomplete on server.",
      }, { status: 500 });
    }

    // Check event and scanner staff credentials
    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("id, title, scanner_pin, scanner_staff")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      // Event not found in DB or mock id
      return NextResponse.json({
        success: false,
        error: "Event record not found.",
      }, { status: 404 });
    }

    // Validate staff activation status if staff scanner ID is supplied
    if (scannerId && scannerId !== "MASTER-PIN" && event.scanner_staff) {
      const staffList = (event.scanner_staff as Array<{ scanner_id: string; is_active: boolean }>) || [];
      const matched = staffList.find((s) => s.scanner_id.toUpperCase() === scannerId.toUpperCase());
      if (matched && !matched.is_active) {
        return NextResponse.json({
          success: false,
          status: "invalid",
          error: `Scanner staff ID ${scannerId} has been revoked by the event organizer. Access denied.`,
        }, { status: 403 });
      }
    }

    if (pin && event.scanner_pin && pin !== event.scanner_pin && (!scannerId || scannerId === "MASTER-PIN")) {
      return NextResponse.json({
        success: false,
        error: "Invalid gate scanner PIN.",
      }, { status: 403 });
    }

    // 2. Check Redis gate cache for ultra-low latency duplicate detection (<50ms)
    const isCachedScanned = await isTicketScannedInCache(eventId, cleanToken);
    if (isCachedScanned) {
      return NextResponse.json({
        success: true,
        status: "duplicate",
        message: "ALREADY SCANNED AT GATE",
        ticket: { qr_token: cleanToken },
      });
    }

    // 3. Query ticket record from Supabase
    const { data: ticket, error: ticketErr } = await supabase
      .from("tickets")
      .select("id, ticket_number, buyer_name, buyer_whatsapp, quantity, is_checked_in, checked_in_at, payment_status, scanned_by, scanned_at_gate")
      .eq("event_id", eventId)
      .eq("qr_token", cleanToken)
      .single();

    if (ticketErr || !ticket) {
      return NextResponse.json({
        success: true,
        status: "invalid",
        error: "Invalid or forged pass. No matching ticket found for this event.",
      });
    }

    if (ticket.payment_status !== "PAID") {
      return NextResponse.json({
        success: true,
        status: "invalid",
        error: `Ticket status is ${ticket.payment_status}. Payment not completed.`,
      });
    }

    if (ticket.is_checked_in) {
      return NextResponse.json({
        success: true,
        status: "duplicate",
        message: "ALREADY SCANNED",
        checked_in_at: ticket.checked_in_at,
        ticket: {
          ticket_number: ticket.ticket_number,
          buyer_name: ticket.buyer_name,
          quantity: ticket.quantity,
          scanned_by: ticket.scanned_by,
          scanned_at_gate: ticket.scanned_at_gate,
        },
      });
    }

    // 4. Atomic check-in update with forensic audit logging (scanned_by, scanned_at_gate)
    const checkInTime = new Date().toISOString();
    const effectiveScannerId = scannerId || "MASTER-PIN";
    const effectiveGate = gateName || "Main Gate Turnstile";

    const { error: updateErr } = await supabase
      .from("tickets")
      .update({
        is_checked_in: true,
        checked_in_at: checkInTime,
        scanned_by: effectiveScannerId,
        scanned_at_gate: effectiveGate,
      })
      .eq("id", ticket.id);

    if (updateErr) {
      return NextResponse.json({
        success: false,
        error: "Failed to record check-in in database.",
      }, { status: 500 });
    }

    // 5. Update Redis check-in set cache
    await markTicketScannedCache(eventId, cleanToken);

    // 6. Asynchronously increment staff member's shift metric
    recordStaffScan(eventId, effectiveScannerId).catch(() => {});

    return NextResponse.json({
      success: true,
      status: "valid",
      message: "ENTRY GRANTED",
      ticket: {
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        buyer_name: ticket.buyer_name,
        quantity: ticket.quantity,
        checked_in_at: checkInTime,
        scanned_by: effectiveScannerId,
        scanned_at_gate: effectiveGate,
      },
    });
  } catch (err: unknown) {
    console.error("Gate scanner verification error:", err);
    return NextResponse.json({
      success: false,
      error: "Internal server error during verification.",
    }, { status: 500 });
  }
}

