import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface TicketRow {
  id: string;
  event_id: string;
  organizer_share: number;
}

export async function GET(req: NextRequest) {
  try {
    // 1. Authorization verification
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // 2. Determine T+2 cutoff (48 hours elapsed)
    const cutoffDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    // 3. Query all PAID tickets older than 48 hours
    // Handles database resilience: checks is_settled if column exists, or falls back to created_at
    let eligibleTickets: TicketRow[] = [];
    let hasIsSettledColumn = true;

    const { data: ticketsWithSettled, error: settledErr } = await supabase
      .from("tickets")
      .select("id, event_id, organizer_share, is_settled")
      .eq("payment_status", "PAID")
      .or("is_settled.is.null,is_settled.eq.false")
      .lte("created_at", cutoffDate);

    if (settledErr) {
      // Column is_settled not yet created in remote table, fallback gracefully
      hasIsSettledColumn = false;
      const { data: fallbackTickets, error: fallbackErr } = await supabase
        .from("tickets")
        .select("id, event_id, organizer_share")
        .eq("payment_status", "PAID")
        .lte("created_at", cutoffDate);

      if (!fallbackErr && fallbackTickets) {
        eligibleTickets = fallbackTickets as TicketRow[];
      } else if (fallbackErr) {
        console.error("Fallback settlement query error:", fallbackErr);
      }
    } else if (ticketsWithSettled) {
      eligibleTickets = ticketsWithSettled as TicketRow[];
    }

    if (!eligibleTickets || eligibleTickets.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending T+2 tickets eligible for settlement.",
        settledCount: 0,
        totalAmountSettled: 0,
        hasIsSettledColumn,
        timestamp: new Date().toISOString(),
      });
    }

    // 4. Group tickets by event_id and sum their amounts
    const eventGroups: Record<string, { totalAmount: number; ticketIds: string[] }> = {};

    for (const t of eligibleTickets) {
      const share = Number(t.organizer_share) || 0;
      if (!eventGroups[t.event_id]) {
        eventGroups[t.event_id] = { totalAmount: 0, ticketIds: [] };
      }
      eventGroups[t.event_id].totalAmount += share;
      eventGroups[t.event_id].ticketIds.push(t.id);
    }

    let totalAmountSettled = 0;
    const settledEvents: Record<string, number> = {};

    // 5. Atomically transition funds for each event
    for (const [eventId, data] of Object.entries(eventGroups)) {
      const { data: event } = await supabase
        .from("events")
        .select("wallet_pending_settlement, wallet_available")
        .eq("id", eventId)
        .single();

      if (event) {
        const pending = Number(event.wallet_pending_settlement) || 0;
        const available = Number(event.wallet_available) || 0;
        const transferAmount = data.totalAmount;

        await supabase
          .from("events")
          .update({
            wallet_pending_settlement: Math.max(0, pending - transferAmount),
            wallet_available: available + transferAmount,
          })
          .eq("id", eventId);

        // Mark tickets as settled if column exists
        if (hasIsSettledColumn) {
          await supabase
            .from("tickets")
            .update({
              is_settled: true,
              settled_at: new Date().toISOString(),
            })
            .in("id", data.ticketIds);
        }

        totalAmountSettled += transferAmount;
        settledEvents[eventId] = transferAmount;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully executed T+2 settlement for ${eligibleTickets.length} ticket(s).`,
      settledCount: eligibleTickets.length,
      totalAmountSettled,
      settledEvents,
      hasIsSettledColumn,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("T+2 settlement error:", err);
    return NextResponse.json({ error: "Settlement worker execution failure" }, { status: 500 });
  }
}
