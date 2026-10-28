"use client";

import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react";
import QrPassCard from "@/components/ticket/QrPassCard";
import { use } from "react";

export default function TicketConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  return (
    <div className="py-10 px-4 min-h-[85vh] bg-[#F8F7FA]">
      <div className="max-w-md mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#39364F] hover:text-[#3659E3] transition"
        >
          <CaretLeft size={16} weight="bold" />
          <span>Back to All Events</span>
        </Link>
      </div>

      <QrPassCard
        ticketNumber="GMS-SAS-8421"
        qrToken={token || "GMS-DEMO-998877"}
        eventName="Super 50 Talent Scholarship Test & Career Seminar"
        venue="Sardar Patel Hall, Gaurakshani, Sasaram"
        eventDate="2026-11-15T10:00:00.000Z"
        buyerName="Aarav Soni"
        quantity={1}
        amountPaid={100}
      />
    </div>
  );
}
