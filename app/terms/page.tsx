import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scales, FileText } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Terms and Conditions — GetMyShow Platform",
  description: "User agreement, organizer terms, ticket policies, and governing law for GetMyShow event ticketing.",
};

export default function TermsPage() {
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
              <Scales size={22} weight="duotone" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Terms and Conditions
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Last updated: October 29, 2026 • Governing law: Sasaram, Rohtas District, Bihar, India
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-[#39364F] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">1. Agreement to Terms</h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement between you (whether personally or on behalf of an entity) and <strong>GetMyShow Platform</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), registered under the Micro, Small and Medium Enterprises (MSME) regulatory framework in Sasaram, Bihar, India.
            </p>
            <p>
              By accessing our platform at getmyshow.in (or associated domains), purchasing event passes, or listing events as an organizer, you agree that you have read, understood, and agreed to be bound by all of these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">2. Platform Role & Ticketing Service</h2>
            <p>
              GetMyShow operates as an online technology intermediary and box-office platform enabling event organizers (&ldquo;Organizers&rdquo;) to list coaching seminars, college fests, cultural nights, and regional events, and enabling attendees (&ldquo;Buyers&rdquo;) to purchase digital admission passes.
            </p>
            <p>
              GetMyShow is not the creator, producer, or host of any listed event. The Organizer bears sole legal and operational responsibility for event safety, venue management, artist appearances, scheduled timings, and adherence to local permits and guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">3. Digital Passes & QR Verification</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Each digital pass is generated with a cryptographic HMAC-SHA256 signature to guarantee authenticity.</li>
              <li>A digital pass is valid for entry strictly for the specified capacity and quantity indicated on the pass.</li>
              <li>Once a pass is scanned and validated at the gate scanner, it transitions to <code>CHECKED_IN</code> and cannot be reused or duplicated.</li>
              <li>Commercial reselling, scalping, or counterfeiting of passes is strictly prohibited and constitutes an offence punishable under applicable Indian laws.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">4. Pricing, Platform Fees & Payment Processing</h2>
            <p>
              All ticket prices are listed in Indian Rupees (₹). Payments are securely processed through Reserve Bank of India (RBI) authorized payment aggregators (such as Razorpay).
            </p>
            <p>
              A nominal platform convenience fee (7%) applies to transactions to cover cloud infrastructure, cryptographic security, and gateway charges. Depending on the organizer&rsquo;s listing settings, this fee may be absorbed by the organizer or paid by the buyer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">5. Organizer Settlements & Payout Rules</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>T+2 Settlement:</strong> Payouts to organizers are restricted to settled funds (transferred T+2 business days post-transaction).</li>
              <li><strong>Event Completion Holdback (Rule 2.2):</strong> Organizers may withdraw up to 85% of settled funds prior to the event; 15% is locked until 8:00 AM the morning after the event completes to safeguard buyer refund rights.</li>
              <li><strong>Mandatory UTR Logging:</strong> Payout disbursements are logged with verified 12-digit Indian Bank UTR numbers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">6. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and defined following the laws of India. Any legal dispute, arbitration, or proceedings arising out of or in connection with GetMyShow shall be subject to the exclusive jurisdiction of the competent civil courts at <strong>Sasaram, Rohtas District, Bihar 821115</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

