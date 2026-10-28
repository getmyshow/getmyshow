import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QrPassCard from "@/components/ticket/QrPassCard";

export const metadata: Metadata = {
  title: "Your Verified Pass — GetMyShow",
  description: "Download or share your verified GetMyShow QR admission pass.",
};

export default async function TicketConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="py-10 px-4">
      <div className="max-w-md mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to GetMyShow</span>
        </Link>
      </div>

      <QrPassCard
        ticketNumber="GMS-SAS-8421"
        qrToken={token || "GMS-DEMO-998877"}
        eventName="Super 50 Talent Scholarship Test & Seminar"
        venue="Sardar Patel Hall, Gaurakshani, Sasaram"
        eventDate="2026-11-15T10:00:00.000Z"
        buyerName="Aarav Soni"
        quantity={1}
        amountPaid={107}
      />
    </div>
  );
}

