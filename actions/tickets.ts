"use server";

import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { generateQrToken } from "@/lib/qr/signer";
import { dispatchTicketConfirmation } from "@/lib/notifications/dispatcher";
import { ActionResult } from "@/types";

export interface TicketDetails {
  id: string;
  ticket_number: string;
  qr_token: string;
  buyer_name: string;
  buyer_whatsapp: string;
  buyer_email?: string | null;
  tier_id?: string | null;
  tier_name?: string | null;
  quantity: number;
  amount_paid: number;
  payment_status: string;
  is_checked_in: boolean;
  checked_in_at?: string | null;
  created_at: string;
  event: {
    id: string;
    title: string;
    venue: string;
    city: string;
    event_date: string;
    poster_url?: string | null;
    organizer_name: string;
  };
}

export async function getTicketByToken(
  qrToken: string
): Promise<ActionResult<TicketDetails>> {
  try {
    if (!qrToken) {
      return { success: false, error: "Missing ticket QR token." };
    }

    const supabase = createAdminClient();

    const { data: ticket, error: ticketErr } = await supabase
      .from("tickets")
      .select(`
        id,
        ticket_number,
        qr_token,
        buyer_name,
        buyer_whatsapp,
        buyer_email,
        quantity,
        amount_paid,
        payment_status,
        is_checked_in,
        checked_in_at,
        created_at,
        events (
          id,
          title,
          venue,
          city,
          event_date,
          poster_url,
          organizer_name
        )
      `)
      .eq("qr_token", qrToken)
      .single();

    if (ticketErr || !ticket) {
      return {
        success: false,
        error: "Ticket pass not found in database.",
      };
    }

    const eventObj = Array.isArray(ticket.events) ? ticket.events[0] : ticket.events;

    return {
      success: true,
      data: {
        id: ticket.id,
        ticket_number: ticket.ticket_number || "GMS-PASS",
        qr_token: ticket.qr_token,
        buyer_name: ticket.buyer_name,
        buyer_whatsapp: ticket.buyer_whatsapp,
        buyer_email: ticket.buyer_email,
        tier_id: (ticket as { tier_id?: string | null }).tier_id || null,
        tier_name: (ticket as { tier_name?: string | null }).tier_name || null,
        quantity: ticket.quantity,
        amount_paid: Number(ticket.amount_paid),
        payment_status: ticket.payment_status,
        is_checked_in: ticket.is_checked_in,
        checked_in_at: ticket.checked_in_at,
        created_at: ticket.created_at,
        event: {
          id: eventObj?.id || "",
          title: eventObj?.title || "GetMyShow Event",
          venue: eventObj?.venue || "Sasaram, Bihar",
          city: eventObj?.city || "Sasaram",
          event_date: eventObj?.event_date || new Date().toISOString(),
          poster_url: eventObj?.poster_url || null,
          organizer_name: eventObj?.organizer_name || "Event Organizer",
        },
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to query ticket pass",
    };
  }
}

/**
 * Retrieves all tickets booked by a user matching their phone number or email address.
 * Enables the industry-standard "My Tickets" hub.
 */
export async function getUserTickets(identifiers: {
  phone?: string;
  email?: string;
}): Promise<ActionResult<TicketDetails[]>> {
  try {
    const { phone, email } = identifiers;
    const cleanPhone = phone ? phone.replace(/\D/g, "").slice(-10) : "";
    const cleanEmail = email ? email.trim().toLowerCase() : "";

    if (!cleanPhone && !cleanEmail) {
      return { success: true, data: [] };
    }

    const supabase = createAdminClient();

    let filterConditions = [];
    if (cleanPhone) {
      filterConditions.push(`buyer_whatsapp.ilike.%${cleanPhone}%`);
    }
    if (cleanEmail) {
      filterConditions.push(`buyer_email.ilike.%${cleanEmail}%`);
    }

    const { data: tickets, error: ticketsErr } = await supabase
      .from("tickets")
      .select(`
        id,
        ticket_number,
        qr_token,
        buyer_name,
        buyer_whatsapp,
        buyer_email,
        quantity,
        amount_paid,
        payment_status,
        is_checked_in,
        checked_in_at,
        created_at,
        events (
          id,
          title,
          venue,
          city,
          event_date,
          poster_url,
          organizer_name
        )
      `)
      .or(filterConditions.join(","))
      .order("created_at", { ascending: false });

    if (ticketsErr) {
      return {
        success: false,
        error: ticketsErr.message,
      };
    }

    const mapped = (tickets || []).map((t) => {
      const eventObj = Array.isArray(t.events) ? t.events[0] : t.events;
      return {
        id: t.id,
        ticket_number: t.ticket_number || "GMS-PASS",
        qr_token: t.qr_token,
        buyer_name: t.buyer_name,
        buyer_whatsapp: t.buyer_whatsapp,
        buyer_email: t.buyer_email,
        quantity: t.quantity,
        amount_paid: Number(t.amount_paid),
        payment_status: t.payment_status,
        is_checked_in: t.is_checked_in,
        checked_in_at: t.checked_in_at,
        created_at: t.created_at,
        event: {
          id: eventObj?.id || "",
          title: eventObj?.title || "GetMyShow Event",
          venue: eventObj?.venue || "Sasaram, Bihar",
          city: eventObj?.city || "Sasaram",
          event_date: eventObj?.event_date || new Date().toISOString(),
          poster_url: eventObj?.poster_url || null,
          organizer_name: eventObj?.organizer_name || "Event Organizer",
        },
      };
    });

    return {
      success: true,
      data: mapped,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load user tickets",
    };
  }
}

export interface IssueCashPassParams {
  eventId: string;
  buyerName: string;
  buyerWhatsapp: string;
  quantity: number;
  tierId?: string;
  tierName?: string;
  amountPaid: number;
  promoterCode?: string;
}

export async function issueCashPass(
  params: IssueCashPassParams
): Promise<ActionResult<{ ticketNumber: string; qrToken: string }>> {
  try {
    const { eventId, buyerName, buyerWhatsapp, quantity, tierId, tierName, amountPaid, promoterCode } = params;

    if (!eventId || !buyerName?.trim() || !buyerWhatsapp?.trim() || quantity < 1) {
      return { success: false, error: "Missing required cash pass details (Name, WhatsApp, Quantity)." };
    }

    const supabase = createAdminClient();

    // 1. Fetch live event
    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      return { success: false, error: "Event not found" };
    }

    // Capacity verification
    if (event.tickets_sold + quantity > event.total_capacity) {
      return {
        success: false,
        error: `Event full! Only ${Math.max(0, event.total_capacity - event.tickets_sold)} seats remaining.`,
      };
    }

    const ticketId = crypto.randomUUID();
    const cityPrefix = (event.city || "SAS").slice(0, 3).toUpperCase();
    const shortRandom = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `GMS-${cityPrefix}-CASH-${shortRandom}`;
    const qrToken = generateQrToken(ticketId, eventId);

    const ticketPayload = {
      id: ticketId,
      event_id: eventId,
      ticket_number: ticketNumber,
      buyer_name: buyerName.trim(),
      buyer_whatsapp: buyerWhatsapp.trim(),
      payment_mode: "CASH_PROMOTER" as const,
      quantity,
      amount_paid: amountPaid,
      organizer_share: amountPaid,
      platform_fee: 0,
      payment_status: "PAID" as const,
      qr_token: qrToken,
      is_checked_in: false,
      is_settled: true, // Cash collected directly at counter
      promoter_code: promoterCode?.trim() || null,
      tier_id: tierId || null,
      tier_name: tierName || "General Admission",
    };

    let { error: insertErr } = await supabase.from("tickets").insert(ticketPayload);

    // Schema resilience fallback if remote schema doesn't have tier columns yet
    if (insertErr && (insertErr.message?.includes("tier_id") || insertErr.code === "42703")) {
      const { tier_id, tier_name, ...resilientPayload } = ticketPayload;
      const fallbackInsert = await supabase.from("tickets").insert(resilientPayload);
      insertErr = fallbackInsert.error;
    }

    if (insertErr) {
      console.error("Cash pass insertion error:", insertErr);
      return { success: false, error: "Failed to persist cash pass in database." };
    }

    // Increment tickets sold on event
    await supabase
      .from("events")
      .update({
        tickets_sold: event.tickets_sold + quantity,
      })
      .eq("id", eventId);

    // Dispatch asynchronous WhatsApp / SMS confirmation
    dispatchTicketConfirmation(ticketId).catch(() => {});

    return {
      success: true,
      data: { ticketNumber, qrToken },
      message: `Offline cash pass ${ticketNumber} issued successfully!`,
    };
  } catch (err: unknown) {
    console.error("Error issuing cash pass:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal error issuing cash pass.",
    };
  }
}
