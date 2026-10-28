import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay/client";
import { createAdminClient } from "@/lib/supabase/server";
import { releaseSeatReservation } from "@/lib/upstash/client";
import { dispatchTicketConfirmation } from "@/lib/notifications/dispatcher";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Verify cryptographic HMAC-SHA256 signature if secret configured
    if (webhookSecret && !webhookSecret.includes("placeholder")) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.warn("Invalid Razorpay webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // 2. Handle successful payment capture / order fulfillment
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (!orderId) {
        return NextResponse.json({ received: true });
      }

      const supabase = createAdminClient();

      // Retrieve ticket order
      const { data: ticket, error: ticketErr } = await supabase
        .from("tickets")
        .select("id, event_id, quantity, organizer_share, payment_status")
        .eq("razorpay_order_id", orderId)
        .single();

      if (ticketErr || !ticket) {
        console.warn(`No ticket found for razorpay_order_id: ${orderId}`);
        return NextResponse.json({ received: true });
      }

      // Idempotency check: prevent duplicate crediting
      if (ticket.payment_status === "PAID") {
        return NextResponse.json({ received: true, message: "Already settled" });
      }

      // Mark ticket as PAID
      await supabase
        .from("tickets")
        .update({
          payment_status: "PAID",
          razorpay_payment_id: paymentId,
        })
        .eq("id", ticket.id);

      // Trigger asynchronous transactional notification dispatch (WhatsApp & Email)
      dispatchTicketConfirmation(ticket.id).catch((err) =>
        console.error("Async notification dispatch error:", err)
      );

      // Release temporary seat lock from Redis
      await releaseSeatReservation(ticket.event_id, ticket.id);

      // Atomically increment tickets_sold and credit wallet_pending_settlement
      const { error: rpcErr } = await supabase.rpc("increment_tickets_sold", {
        event_id_param: ticket.event_id,
        qty_param: ticket.quantity || 1,
        organizer_share_param: Number(ticket.organizer_share) || 0,
      });

      if (rpcErr) {
        // Fallback manual increment if RPC is missing
        const { data: eventData } = await supabase
          .from("events")
          .select("tickets_sold, wallet_pending_settlement")
          .eq("id", ticket.event_id)
          .single();

        if (eventData) {
          await supabase
            .from("events")
            .update({
              tickets_sold: (eventData.tickets_sold || 0) + (ticket.quantity || 1),
              wallet_pending_settlement:
                (eventData.wallet_pending_settlement || 0) + Number(ticket.organizer_share || 0),
            })
            .eq("id", ticket.event_id);
        }
      }
    }

    // 3. Handle payment failure or user drop-off
    if (event === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;

      if (orderId) {
        const supabase = createAdminClient();
        const { data: ticket } = await supabase
          .from("tickets")
          .select("id, event_id")
          .eq("razorpay_order_id", orderId)
          .eq("payment_status", "PENDING")
          .single();

        if (ticket) {
          await supabase
            .from("tickets")
            .update({ payment_status: "CANCELLED" })
            .eq("id", ticket.id);

          await releaseSeatReservation(ticket.event_id, ticket.id);
        }
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err: unknown) {
    console.error("Razorpay webhook error:", err);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
