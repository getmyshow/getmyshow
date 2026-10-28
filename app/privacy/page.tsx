import React from "react";
import Link from "next/link";
import { ArrowLeft, LockKey, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Privacy Policy — GetMyShow Platform",
  description: "DPDP Act 2023 compliant privacy policy, data collection, and security practices of GetMyShow.",
};

export default function PrivacyPage() {
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
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
              <LockKey size={22} weight="duotone" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Compliant with India&rsquo;s Digital Personal Data Protection (DPDP) Act 2023 • Last updated: October 29, 2026
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-[#39364F] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">1. Introduction & Commitment</h2>
            <p>
              GetMyShow (&ldquo;Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy and is dedicated to protecting your personal data in strict compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> of India and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contact & Identity Data:</strong> Name, WhatsApp telephone number, and optional email address provided during checkout.</li>
              <li><strong>Coaching / Event-Specific Details:</strong> Custom fields requested by organizers (such as Roll Number, Class, or Target Exam).</li>
              <li><strong>Transaction Data:</strong> Razorpay order ID, payment status, transaction amounts, and ticket timestamps. <em>Note: We never store your UPI PIN, credit card numbers, CVVs, or net banking passwords. All financial details are processed directly on RBI-certified PCI-DSS Level 1 compliant gateway servers.</em></li>
              <li><strong>Gate Verification Logs:</strong> Timestamps and camera scanner check-in records.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">3. Purpose of Processing</h2>
            <p>We process your personal data solely for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Issuing your cryptographic QR digital ticket pass.</li>
              <li>Delivering pass confirmation links via WhatsApp / SMS / Email.</li>
              <li>Enabling gate admission verification at the event venue.</li>
              <li>Facilitating customer support, refunds, and event rescheduling updates.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">4. Strict Non-Disclosure & Zero Sale of Data</h2>
            <p>
              We adhere to a strict <strong>Zero Sale of Data Policy</strong>. We do not sell, rent, monetize, or trade your personal information, phone numbers, or WhatsApp contacts to any third-party marketing brokers, advertisers, or loan aggregators.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">5. Data Security & Storage</h2>
            <p>
              Your data is encrypted in transit using TLS 1.3 encryption and at rest with AES-256 standards on enterprise Supabase PostgreSQL clusters. Access to customer phone numbers is strictly limited to authorized organizers for event coordination purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">6. Contact Our Grievance Officer</h2>
            <p>
              For questions regarding your data or to request deletion of your records, contact our designated Grievance Officer at <code>privacy@getmyshow.com</code> or write to our registered office in Sasaram, Rohtas District, Bihar 821115.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

