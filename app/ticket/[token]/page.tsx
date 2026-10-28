"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { CaretLeft, CircleNotch, Ticket } from "@phosphor-icons/react";
import QrPassCard from "@/components/ticket/QrPassCard";
import { getTicketByToken, TicketDetails } from "@/actions/tickets";

export default function TicketConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [ticketData, setTicketData] = useState<TicketDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchTicket() {
      if (!token) {
        setLoading(false);
        return;
      }

      // 1. Try fetching from real Supabase database
      const result = await getTicketByToken(token);
      if (mounted && result.success && result.data) {
        setTicketData(result.data);
        setLoading(false);
        return;
      }

      // 2. Fallback to sessionStorage for instant local dev checkout testing
      if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem(`gms_pass_${token}`);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (mounted) {
              setTicketData({
                id: token,
                ticket_number: parsed.ticketNumber || "GMS-SAS-1001",
                qr_token: token,
                buyer_name: parsed.buyerName || "Attendee",
                buyer_whatsapp: parsed.buyerPhone || "",
                tier_name: parsed.tierName || "General Admission",
                quantity: parsed.quantity || 1,
                amount_paid: parsed.amountPaid || 100,
                payment_status: "PAID",
                is_checked_in: false,
                created_at: new Date().toISOString(),
                event: {
                  id: "1",
                  title: parsed.eventName || "GetMyShow Event",
                  venue: parsed.venue || "Sasaram, Bihar",
                  city: "Sasaram",
                  event_date: parsed.eventDate || new Date().toISOString(),
                  organizer_name: "Organizer",
                },
              });
              setLoading(false);
              return;
            }
          } catch {}
        }
      }

      if (mounted) {
        setError(!result.success ? result.error : "Ticket not found");
        setLoading(false);
      }
    }

    fetchTicket();

    return () => {
      mounted = false;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <CircleNotch size={36} className="animate-spin text-[#4F46E5] mb-3" weight="bold" />
        <p className="text-sm font-semibold text-[#0F172A]">Retrieving verified ticket pass...</p>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div className="py-16 px-4 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
          <Ticket size={32} weight="duotone" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A] mb-1">Ticket Pass Not Found</h2>
        <p className="text-xs text-[#64748B] max-w-sm mb-6">
          The requested pass identifier was not located in the verified database.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#4338CA] transition shadow-md"
        >
          Back to All Events
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 min-h-[85vh] bg-[#F8F7FA] print:p-0 print:bg-white print:min-h-0">
      <div className="max-w-md mx-auto mb-6 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] hover:text-[#4F46E5] transition"
        >
          <CaretLeft size={16} weight="bold" />
          <span>Back to All Events</span>
        </Link>
      </div>

      <QrPassCard
        ticketNumber={ticketData.ticket_number}
        qrToken={ticketData.qr_token}
        eventName={ticketData.event.title}
        venue={ticketData.event.venue}
        eventDate={ticketData.event.event_date}
        buyerName={ticketData.buyer_name}
        quantity={ticketData.quantity}
        amountPaid={ticketData.amount_paid}
        tierName={ticketData.tier_name || "General Admission"}
        posterUrl={ticketData.event.poster_url}
        city={ticketData.event.city}
        organizerName={ticketData.event.organizer_name}
      />
    </div>
  );
}
