import { createAdminClient } from "@/lib/supabase/server";
import { formatDateIST } from "@/lib/utils";

interface DispatchResult {
  whatsappDispatched: boolean;
  emailDispatched: boolean;
  message?: string;
}

/**
 * Transactional Ticket Notification Dispatcher
 * Sends instant confirmation via WhatsApp Business API and Email.
 * Safe fallback: If credentials are not configured, logs payload without throwing.
 */
export async function dispatchTicketConfirmation(ticketId: string): Promise<DispatchResult> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch ticket and event details
    const { data: ticket, error: ticketErr } = await supabase
      .from("tickets")
      .select(`
        id,
        ticket_number,
        buyer_name,
        buyer_whatsapp,
        buyer_email,
        quantity,
        amount_paid,
        qr_token,
        event:events(
          title,
          venue,
          city,
          event_date
        )
      `)
      .eq("id", ticketId)
      .single();

    if (ticketErr || !ticket) {
      console.warn(`[Dispatcher] Ticket not found: ${ticketId}`);
      return { whatsappDispatched: false, emailDispatched: false, message: "Ticket not found" };
    }

    const event = Array.isArray(ticket.event) ? ticket.event[0] : ticket.event;
    const eventTitle = event?.title || "GetMyShow Event";
    const venue = event?.venue || "Sasaram, Bihar";
    const eventDate = event?.event_date ? formatDateIST(event.event_date) : "Upcoming";
    const hostDomain = process.env.NEXT_PUBLIC_APP_URL || "https://getmyshow.in";
    const passUrl = `${hostDomain}/ticket/${ticket.qr_token}`;

    const formattedMessage = [
      `🎟️ *Booking Confirmed — GetMyShow*`,
      ``,
      `Namaste *${ticket.buyer_name}*, your passes for *${eventTitle}* are confirmed!`,
      ``,
      `📍 *Venue:* ${venue}`,
      `📅 *Date & Time:* ${eventDate}`,
      `🎫 *Pass #:* ${ticket.ticket_number}`,
      `👥 *Admit:* ${ticket.quantity} Person(s)`,
      ``,
      `📱 *Instant Digital QR Pass:*`,
      `${passUrl}`,
      ``,
      `_Please present the QR code at the entrance gate for instant camera check-in._`,
    ].join("\n");

    let whatsappDispatched = false;
    let emailDispatched = false;

    // 2. WhatsApp Business API / Twilio Dispatch
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (whatsappToken && whatsappPhoneId && !whatsappToken.includes("placeholder")) {
      try {
        const cleanPhone = ticket.buyer_whatsapp.replace(/\D/g, "");
        const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

        const res = await fetch(`https://graph.facebook.com/v19.0/${whatsappPhoneId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${whatsappToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: formattedPhone,
            type: "text",
            text: { body: formattedMessage },
          }),
        });

        if (res.ok) {
          whatsappDispatched = true;
          console.log(`[Dispatcher] WhatsApp confirmation delivered to ${formattedPhone}`);
        }
      } catch (waErr) {
        console.error("[Dispatcher] WhatsApp send error:", waErr);
      }
    } else {
      console.log(`[Dispatcher: Mock WhatsApp Dispatch] -> ${ticket.buyer_whatsapp}:\n${formattedMessage}`);
    }

    // 3. Email Dispatch via Resend (if email provided)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && ticket.buyer_email && !resendApiKey.includes("placeholder")) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "GetMyShow Passes <tickets@getmyshow.in>",
            to: [ticket.buyer_email],
            subject: `🎟️ Your passes for ${eventTitle} (${ticket.ticket_number})`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 16px;">
                <h1 style="color: #4F46E5; font-size: 20px; margin-bottom: 8px;">GetMyShow Digital Admission Pass</h1>
                <p style="color: #0F172A; font-size: 14px; margin-bottom: 16px;">Hi <strong>${ticket.buyer_name}</strong>, your registration is confirmed.</p>
                <div style="background-color: #F8F7FA; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                  <p style="margin: 4px 0; font-size: 13px;"><strong>Event:</strong> ${eventTitle}</p>
                  <p style="margin: 4px 0; font-size: 13px;"><strong>Venue:</strong> ${venue}</p>
                  <p style="margin: 4px 0; font-size: 13px;"><strong>Date:</strong> ${eventDate}</p>
                  <p style="margin: 4px 0; font-size: 13px;"><strong>Pass #:</strong> <span style="font-family: monospace; color: #4F46E5;">${ticket.ticket_number}</span></p>
                  <p style="margin: 4px 0; font-size: 13px;"><strong>Total Admit:</strong> ${ticket.quantity} Person(s)</p>
                </div>
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${passUrl}" style="background-color: #4F46E5; color: #FFFFFF; padding: 12px 24px; border-radius: 9999px; font-weight: bold; text-decoration: none; display: inline-block;">View & Save QR Pass</a>
                </div>
              </div>
            `,
          }),
        });

        if (res.ok) {
          emailDispatched = true;
          console.log(`[Dispatcher] Confirmation email delivered to ${ticket.buyer_email}`);
        }
      } catch (mailErr) {
        console.error("[Dispatcher] Email send error:", mailErr);
      }
    }

    return {
      whatsappDispatched,
      emailDispatched,
      message: "Notification cycle completed successfully.",
    };
  } catch (err: unknown) {
    console.error("[Dispatcher] Fatal notification error:", err);
    return {
      whatsappDispatched: false,
      emailDispatched: false,
      message: err instanceof Error ? err.message : "Notification processing error",
    };
  }
}

