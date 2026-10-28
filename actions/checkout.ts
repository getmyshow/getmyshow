"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { getRazorpayClient } from "@/lib/razorpay/client";
import { generateQrToken } from "@/lib/qr/signer";
import { lockSeats, holdSeatReservation } from "@/lib/upstash/client";
import { dispatchTicketConfirmation } from "@/lib/notifications/dispatcher";
import { ActionResult } from "@/types";
import crypto from "crypto";

interface CheckoutParams {
  eventId: string;
  buyerName: string;
  buyerWhatsapp: string;
  buyerEmail?: string;
  quantity: number;
  tierId?: string;
  tierName?: string;
  tierPrice?: number;
  customResponses?: Record<string, string>;
  promoterCode?: string;
}

interface CheckoutResponse {
  ticketId: string;
  ticketNumber: string;
  qrToken: string;
  amount: number;
  tierName?: string | null;
  razorpayOrderId?: string | null;
  razorpayKeyId?: string;
  paymentMode: "ONLINE" | "CASH_PROMOTER";
}

export async function initiateCheckout(
  params: CheckoutParams
): Promise<ActionResult<CheckoutResponse>> {
  try {
    const { eventId, buyerName, buyerWhatsapp, buyerEmail, quantity, tierId, tierName, tierPrice, customResponses, promoterCode } = params;

    if (!eventId || !buyerName || !buyerWhatsapp || quantity < 1) {
      return {
        success: false,
        error: "Missing mandatory checkout parameters (Name, WhatsApp number, quantity).",
      };
    }

    const supabase = createAdminClient();

    // 1. Fetch live event details
    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .eq("is_active", true)
      .single();

    if (eventErr || !event) {
      return {
        success: false,
        error: "Event not found or registration is currently closed.",
      };
    }

    // Capacity verification
    if (event.tickets_sold + quantity > event.total_capacity) {
      return {
        success: false,
        error: `Only ${Math.max(0, event.total_capacity - event.tickets_sold)} pass(es) remaining.`,
      };
    }

    // 2. Concurrency seat reservation via Upstash Redis
    await lockSeats(eventId, quantity);

    // 3. Multi-tier pricing calculations following Hyperlocal financial rules
    let unitPrice = event.ticket_price;
    let resolvedTierName = tierName || null;
    let resolvedTierId = tierId || null;

    if (event.ticket_tiers && Array.isArray(event.ticket_tiers) && event.ticket_tiers.length > 0) {
      const matchedTier = event.ticket_tiers.find((t: { id: string; price: number; name: string }) => t.id === tierId);
      if (matchedTier) {
        unitPrice = matchedTier.price;
        resolvedTierName = matchedTier.name;
        resolvedTierId = matchedTier.id;
      } else if (tierPrice !== undefined) {
        unitPrice = tierPrice;
      }
    } else if (tierPrice !== undefined) {
      unitPrice = tierPrice;
    }

    const basePrice = unitPrice * quantity;
    const platformFee = Math.round(basePrice * 0.07);
    const totalAmount = event.pass_fee_to_buyer ? basePrice + platformFee : basePrice;
    const organizerShare = event.pass_fee_to_buyer ? basePrice : basePrice - platformFee;
    const gatewayFee = Math.round(totalAmount * 0.0236); // 2.36% MDR + GST
    const netPlatformProfit = platformFee - gatewayFee;

    // 4. Generate unique ticket identifier and HMAC-SHA256 QR token
    const ticketId = crypto.randomUUID();
    const cityPrefix = (event.city || "SAS").slice(0, 3).toUpperCase();
    const shortRandom = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `GMS-${cityPrefix}-${shortRandom}`;
    const qrToken = generateQrToken(ticketId, eventId);

    // 5. Razorpay Order Creation
    const rzp = getRazorpayClient();
    let razorpayOrderId: string | null = null;

    if (rzp) {
      try {
        const order = await rzp.orders.create({
          amount: totalAmount * 100, // paise
          currency: "INR",
          receipt: ticketNumber,
          notes: {
            ticketId,
            eventId,
            buyerName,
            buyerWhatsapp,
            tierName: resolvedTierName || "General Admission",
          },
        });
        razorpayOrderId = order.id;
      } catch (rzpErr) {
        console.error("Razorpay order creation error:", rzpErr);
      }
    }

    // 6. Record ticket order in Supabase
    // If Razorpay order created, status is PENDING (awaiting webhook capture)
    // If running in local mock mode without Razorpay credentials, auto-mark PAID
    const isMockPayment = !razorpayOrderId;
    const initialStatus = isMockPayment ? "PAID" : "PENDING";

    // 8-minute seat reservation in Redis
    await holdSeatReservation(eventId, ticketId, quantity, 480);

    const ticketPayload = {
      id: ticketId,
      event_id: eventId,
      ticket_number: ticketNumber,
      buyer_name: buyerName,
      buyer_whatsapp: buyerWhatsapp,
      buyer_email: buyerEmail || null,
      payment_mode: "ONLINE" as const,
      quantity,
      amount_paid: totalAmount,
      organizer_share: organizerShare,
      platform_fee: platformFee,
      gateway_fee: gatewayFee,
      net_platform_profit: netPlatformProfit,
      razorpay_order_id: razorpayOrderId,
      payment_status: initialStatus as "PAID" | "PENDING",
      qr_token: qrToken,
      is_checked_in: false,
      is_settled: false,
      custom_responses: customResponses || {},
      promoter_code: promoterCode || null,
      tier_id: resolvedTierId,
      tier_name: resolvedTierName,
    };

    let { error: insertErr } = await supabase.from("tickets").insert(ticketPayload);

    // Schema-resilient fallback if remote Supabase doesn't have tier_id / tier_name columns yet
    if (insertErr && (insertErr.message?.includes("tier_id") || insertErr.message?.includes("tier_name") || insertErr.code === "42703")) {
      console.warn("Fallback inserting ticket without tier columns due to remote schema:", insertErr.message);
      const { tier_id, tier_name, ...resilientPayload } = ticketPayload;
      const fallbackInsert = await supabase.from("tickets").insert(resilientPayload);
      insertErr = fallbackInsert.error;
    }

    if (insertErr) {
      console.error("Supabase ticket insertion error:", insertErr);
      return {
        success: false,
        error: "Failed to persist ticket order in database.",
      };
    }

    // 7. ONLY increment tickets sold and wallet in mock mode (direct PAID)
    // For live Razorpay orders, crediting is handled EXCLUSIVELY by the webhook upon capture!
    if (isMockPayment) {
      const { error: rpcErr } = await supabase.rpc("increment_tickets_sold", {
        event_id_param: eventId,
        qty_param: quantity,
        organizer_share_param: organizerShare,
      });

      if (rpcErr) {
        await supabase
          .from("events")
          .update({
            tickets_sold: event.tickets_sold + quantity,
            wallet_pending_settlement: (event.wallet_pending_settlement || 0) + organizerShare,
          })
          .eq("id", eventId);
      }

      // Trigger asynchronous confirmation dispatch
      dispatchTicketConfirmation(ticketId).catch(() => {});
    }

    return {
      success: true,
      data: {
        ticketId,
        ticketNumber,
        qrToken,
        amount: totalAmount,
        tierName: resolvedTierName,
        razorpayOrderId,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
        paymentMode: "ONLINE",
      },
    };
  } catch (err: unknown) {
    console.error("Checkout initiation error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal checkout processing failure.",
    };
  }
}
