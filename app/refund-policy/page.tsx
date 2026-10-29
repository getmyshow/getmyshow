import React from "react";
import Link from "next/link";
import { ArrowLeft, CurrencyInr, ClockCounterClockwise, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Cancellation & Refund Policy — GetMyShow Platform",
  description: "Clear refund timelines, event cancellation terms, and dispute procedures on GetMyShow.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#DBDAE3] p-6 sm:p-10 shadow-xs space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition mb-4"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Back to GetMyShow</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shrink-0">
              <CurrencyInr size={22} weight="bold" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Cancellation & Refund Policy
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Standard consumer ticketing terms • Last updated: October 29, 2026
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-[#39364F] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">1. Standard Booking Policy</h2>
            <p>
              Due to fixed venue capacities, stage production reservations, and seat quotas, all confirmed ticket pass bookings on GetMyShow are generally <strong>non-cancellable and non-refundable</strong> once payment has been captured, unless the event itself is cancelled, postponed, or significantly altered by the organizer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">2. Event Cancellation or Major Rescheduling</h2>
            <p>
              In the event that an organizer officially cancels an event, or reschedules the event date/venue such that you cannot attend:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Automatic 100% Refund:</strong> You are entitled to a full refund of the ticket face value.</li>
              <li><strong>Processing Window:</strong> Refunds are initiated within <strong>48 hours</strong> of official cancellation confirmation.</li>
              <li><strong>Credit Timeline:</strong> Under Indian banking regulations, funds reflect back into your original payment source (UPI account, bank account, or card) within <strong>5 to 7 working business days</strong>.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">3. Double Deduction / Payment Failed but Debited</h2>
            <p>
              If your bank account was debited during checkout but the screen did not generate a digital pass or showed a failure state:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The payment aggregator (Razorpay) automatically runs reconciliation cycles.</li>
              <li>Uncaptured funds are auto-reversed by your bank within <strong>24 to 48 hours</strong>.</li>
              <li>If you do not see the reversal after 3 business days, email <code>support@getmyshow.com</code> with your 12-digit Indian Bank UTR number or Razorpay payment reference, and our team will resolve it within 24 hours.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">4. Organizer 15% Holdback Protection (Rule 2.2)</h2>
            <p>
              To protect attendees from fraudulent or abrupt event cancellations, GetMyShow enforces an architectural <strong>15% completion holdback</strong>. Even if an event sells out, 15% of all organizer proceeds remain locked until 8:00 AM the morning after the event takes place, ensuring reserve liquidity to honor attendee claims.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">5. How to Request a Refund</h2>
            <p>
              To report an issue or inquire about a refund, please send a WhatsApp message to our Sasaram support desk at <strong>+91 98765 43210</strong> or email <code>support@getmyshow.com</code> mentioning your Ticket Number (e.g., <code>GMS-SAS-1001</code>) and booking WhatsApp number.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

