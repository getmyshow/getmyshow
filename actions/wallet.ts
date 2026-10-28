"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { ActionResult, WithdrawalRequest } from "@/types";

interface WithdrawalParams {
  eventId: string;
  amount: number;
  payoutDestination: string; // UPI ID or Bank A/C + IFSC
}

export async function requestWithdrawal(
  params: WithdrawalParams
): Promise<ActionResult<WithdrawalRequest>> {
  try {
    const { eventId, amount, payoutDestination } = params;

    if (!eventId || !amount || amount <= 0 || !payoutDestination) {
      return {
        success: false,
        error: "Invalid withdrawal parameters. Amount and payout destination are required.",
      };
    }

    const supabase = createAdminClient();

    // 1. Fetch live event and wallet balances
    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      return {
        success: false,
        error: "Event not found.",
      };
    }

    const availableBalance = Number(event.wallet_available) || 0;
    const now = new Date();
    const eventDate = new Date(event.event_date);
    const isPostEvent = now.getTime() > eventDate.getTime() + 8 * 60 * 60 * 1000; // Post 8:00 AM after event

    // 2. Rule 2.1: Never pay out unsettled funds
    if (amount > availableBalance) {
      return {
        success: false,
        error: `Insufficient settled funds. Available for withdrawal: ₹${availableBalance.toLocaleString("en-IN")}. Pending T+2 settlements cannot be disbursed early.`,
      };
    }

    // 3. Rule 2.2: 15% Event-Completion Holdback Rule
    // Before event finishes, maximum withdrawable is 85% of total earnings
    if (!isPostEvent) {
      const totalSettledEarnings = availableBalance + Number(event.wallet_total_withdrawn || 0);
      const maxAllowedPreEvent = Math.floor(totalSettledEarnings * 0.85);
      const remainingAllowed = Math.max(0, maxAllowedPreEvent - Number(event.wallet_total_withdrawn || 0));

      if (amount > remainingAllowed) {
        return {
          success: false,
          error: `Event-Completion Holdback Policy (Rule 2.2): Up to 85% can be withdrawn before the event date. 15% (₹${Math.round(totalSettledEarnings * 0.15).toLocaleString("en-IN")}) remains locked until 8:00 AM the morning after the event concludes. Maximum you can withdraw right now: ₹${remainingAllowed.toLocaleString("en-IN")}.`,
        };
      }
    }

    // 4. Create withdrawal request
    const { data: request, error: insertErr } = await supabase
      .from("withdrawal_requests")
      .insert({
        event_id: eventId,
        amount,
        payout_destination: payoutDestination,
        status: "REQUESTED",
      })
      .select()
      .single();

    if (insertErr || !request) {
      return {
        success: false,
        error: "Failed to create withdrawal request.",
      };
    }

    // 5. Deduct from wallet_available
    await supabase
      .from("events")
      .update({
        wallet_available: availableBalance - amount,
      })
      .eq("id", eventId);

    return {
      success: true,
      data: request as WithdrawalRequest,
      message: "Withdrawal request submitted successfully. Payout will be processed with verified 12-digit UTR.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal error processing withdrawal request.",
    };
  }
}

