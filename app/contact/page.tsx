import React from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, EnvelopeSimple, PhoneCall, ChatCircleDots, Buildings, UserCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Contact Us & Grievance Redressal — GetMyShow Platform",
  description: "Official contact information, registered address, WhatsApp support, and statutory Grievance Officer details for GetMyShow.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition mb-4"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Back to GetMyShow</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Contact & Support Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            We are locally rooted in Sasaram, Bihar. Get in touch with our operations desk or connect with our statutory officers.
          </p>
        </div>

        {/* 3-Column Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#DBDAE3] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
              <ChatCircleDots size={22} weight="duotone" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">WhatsApp Quick Help</h3>
            <p className="text-xs text-[#6F7287] leading-relaxed">
              Instant assistance for ticket downloads, UPI double debits, and gate scanner guidance.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210?text=Hi%20GetMyShow%20Support"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#DBDAE3] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#3659E3]/10 text-[#3659E3] flex items-center justify-center">
              <EnvelopeSimple size={22} weight="duotone" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">Email Support</h3>
            <p className="text-xs text-[#6F7287] leading-relaxed">
              For event organizers, sponsorships, ticket verification disputes, and partnerships.
            </p>
            <div className="pt-2">
              <a
                href="mailto:support@getmyshow.com"
                className="text-xs font-bold text-[#4F46E5] hover:underline block"
              >
                support@getmyshow.com
              </a>
              <span className="text-[11px] text-[#94A3B8]">Response within 24 hours</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#DBDAE3] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Buildings size={22} weight="duotone" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">Registered Office</h3>
            <p className="text-xs text-[#6F7287] leading-relaxed">
              GetMyShow Platform (MSME)<br />
              GT Road / Post Office Chowk<br />
              Sasaram, Rohtas District<br />
              Bihar, PIN 821115, India
            </p>
            <div className="text-[11px] font-semibold text-[#0F172A] pt-1">
              Mon – Sat: 9:00 AM – 7:00 PM IST
            </div>
          </div>
        </div>

        {/* Mandatory Grievance Officer Section (Indian IT Rules 2021 Compliance) */}
        <div className="bg-white rounded-2xl border border-[#DBDAE3] p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <UserCircle size={22} weight="duotone" className="text-[#4F46E5]" />
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
              Statutory Grievance Officer (IT Rules, 2021)
            </h2>
          </div>
          <p className="text-xs text-[#6F7287] leading-relaxed">
            In accordance with the Information Technology Act, 2000 and rules made thereunder, as well as the Consumer Protection (E-Commerce) Rules, 2020, the name and contact details of the Grievance Officer are provided below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
            <div>
              <span className="text-[#64748B] block">Officer Name:</span>
              <strong className="text-[#0F172A]">Aarav Soni</strong>
            </div>
            <div>
              <span className="text-[#64748B] block">Designation:</span>
              <strong className="text-[#0F172A]">Nodal Grievance Officer</strong>
            </div>
            <div>
              <span className="text-[#64748B] block">Official Email:</span>
              <a href="mailto:grievance@getmyshow.com" className="font-bold text-[#4F46E5] hover:underline">
                grievance@getmyshow.com
              </a>
            </div>
            <div>
              <span className="text-[#64748B] block">Grievance Redressal SLA:</span>
              <span className="text-[#0F172A] font-medium">Acknowledgment within 24h • Resolution within 15 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

