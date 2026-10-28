import React from "react";
import Link from "next/link";
import { ArrowLeft, Lightning, CheckCircle, DeviceMobile, QrCode } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Pricing & Digital Delivery Policy — GetMyShow Platform",
  description: "Instant digital pass delivery policy, SMS/WhatsApp dispatch, and pass access terms for GetMyShow.",
};

export default function ShippingPolicyPage() {
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
              <Lightning size={22} weight="fill" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Digital Delivery & Shipping Policy
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Digital fulfillment standards • Last updated: October 29, 2026
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-[#39364F] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">1. Nature of Products (100% Digital Goods)</h2>
            <p>
              GetMyShow exclusively issues <strong>digital admission passes, e-tickets, and cryptographic QR event credentials</strong>. We do not dispatch or deliver physical paper tickets or plastic badges via postal courier or physical shipping services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">2. Instant On-Screen Delivery (&lt; 2 Seconds)</h2>
            <p>
              Upon successful authorization and capture of your payment via UPI, debit card, or net banking:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your browser is immediately redirected to your private ticket confirmation page (<code>/ticket/[qr_token]</code>).</li>
              <li>Your tamper-proof 35mm scalloped cinema ticket with cryptographic HMAC-SHA256 QR code renders on-screen instantly.</li>
              <li>You can download the high-resolution pass as an image (PNG) or print/save as a PDF document directly from the screen.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">3. Zero Shipping Fees</h2>
            <p>
              Because all admission credentials are delivered electronically via the web and instant messaging, <strong>there are zero shipping or courier charges</strong> associated with any ticket purchase on GetMyShow.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">4. Pass Retrieval & Offline Access</h2>
            <p>
              Once issued, your pass remains permanently accessible online. You can also look up all your active tickets by visiting <strong>My Tickets</strong> (<code>/my-tickets</code>).
            </p>
            <p>
              We recommend saving a screenshot or PDF of your ticket pass to your phone gallery prior to arriving at the venue in case of local cellular network congestion.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
