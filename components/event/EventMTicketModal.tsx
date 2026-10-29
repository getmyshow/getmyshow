"use client";

import React, { useState } from "react";
import {
  X,
  CaretLeft,
  CaretRight,
  DeviceMobile,
  QrCode,
  WhatsappLogo,
  ShieldCheck,
  Lightning,
  Sparkle,
} from "@phosphor-icons/react";

interface EventMTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
}

export default function EventMTicketModal({
  isOpen,
  onClose,
  eventTitle,
}: EventMTicketModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      stepNum: 1,
      badgeText: "1",
      title: "Book passes in 30 seconds from your mobile browser",
      description:
        "Select your ticket tier, enter your WhatsApp number, and complete payment via Google Pay, PhonePe, or Paytm UPI. Zero app download or account hassle required.",
      mockup: (
        <div className="w-full max-w-[240px] mx-auto bg-slate-900 rounded-[28px] p-2.5 shadow-xl border-4 border-slate-800">
          <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-2" />
          <div className="bg-white rounded-2xl p-3 text-slate-800 space-y-2 text-[10px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="font-bold text-[#0F172A] truncate">GetMyShow UPI</span>
              <span className="text-[#10B981] font-extrabold">Instant</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-[9px] text-slate-400">Total Payable</div>
              <div className="text-sm font-black text-[#0F172A]">₹100.00</div>
            </div>
            <div className="space-y-1 pt-1">
              <div className="py-1.5 px-2 rounded-lg bg-[#4F46E5] text-white font-bold text-center">
                Pay via PhonePe / GPay
              </div>
              <div className="text-[8px] text-center text-slate-400">
                🔒 256-bit Bank Grade Security
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNum: 2,
      badgeText: "2",
      title: "Instant delivery to WhatsApp & your GetMyShow Passes",
      description:
        "Your official booking confirmation and tamper-proof HMAC-SHA256 digital entry pass arrives immediately on WhatsApp and stays accessible offline in 'Passes'.",
      mockup: (
        <div className="w-full max-w-[240px] mx-auto bg-slate-900 rounded-[28px] p-2.5 shadow-xl border-4 border-slate-800">
          <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-2" />
          <div className="bg-[#0B141A] rounded-2xl p-2.5 text-white space-y-2 text-[10px]">
            <div className="flex items-center gap-1.5 pb-1 border-b border-white/10">
              <WhatsappLogo size={14} weight="fill" className="text-[#25D366]" />
              <span className="font-bold text-xs">GetMyShow Alerts</span>
            </div>
            <div className="bg-[#202C33] p-2 rounded-xl rounded-tl-none space-y-1 text-[9px] text-slate-200">
              <div className="font-bold text-[#25D366]">✅ Ticket Confirmed!</div>
              <p className="line-clamp-2">Your pass for {eventTitle} is ready.</p>
              <div className="mt-1 p-1 bg-white/10 rounded font-mono text-[8px] text-slate-300">
                GMS-TKT-2026-VERIFIED
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNum: 3,
      badgeText: "3",
      title: "Show your M-ticket QR code at the venue gate",
      description:
        "At the gate, simply show the cryptographic QR code on your phone screen. Staff scan it in under 0.5s for instant contactless entry.",
      mockup: (
        <div className="w-full max-w-[240px] mx-auto bg-slate-900 rounded-[28px] p-2.5 shadow-xl border-4 border-slate-800">
          <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-2" />
          {/* Authentic Scalloped Ticket with Waist Cutouts */}
          <div className="relative bg-white rounded-2xl p-3 text-slate-800 text-[10px] shadow-sm">
            <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-slate-200">
              <span className="font-bold text-[#0F172A] truncate">ENTRY PASS</span>
              <span className="text-[8px] font-black uppercase text-[#F05537]">M-TICKET</span>
            </div>
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-900 rounded-xl p-1.5 flex items-center justify-center">
                <QrCode size={64} className="text-white" />
              </div>
              <span className="font-mono text-[8px] text-slate-500 mt-1 font-bold">
                TAP FOR FULLSCREEN
              </span>
            </div>
            <div className="py-1 px-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-center text-[8px] font-bold">
              ✓ Fast-Track Turnstile Valid
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[1100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="How to use M-ticket"
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200"
      >
        {/* Header Bar */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">
            How to use M-ticket for Live Events
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 flex flex-col items-center justify-between space-y-4">
          {/* Step Number Badge */}
          <div className="w-8 h-8 rounded-lg bg-[#F05537] text-white flex items-center justify-center font-black text-sm shadow-sm shadow-orange-500/30">
            {current.badgeText}
          </div>

          {/* Title & Description */}
          <div className="text-center space-y-1.5">
            <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
              {current.title}
            </h4>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-[280px] mx-auto">
              {current.description}
            </p>
          </div>

          {/* Device Mockup Illustration */}
          <div className="py-2 w-full">{current.mockup}</div>

          {/* Step Segment Indicators */}
          <div className="flex items-center justify-center gap-1.5 w-full pt-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep === idx
                    ? "w-8 bg-[#F05537]"
                    : "w-4 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Controls: Next / Prev / Got It */}
          <div className="w-full flex items-center gap-2 pt-2">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition active:scale-95 flex items-center justify-center gap-1"
              >
                <CaretLeft size={14} weight="bold" />
                <span>Previous</span>
              </button>
            ) : null}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="flex-1 py-2.5 rounded-xl bg-[#F05537] hover:bg-[#E04426] text-white text-xs font-bold transition shadow-xs active:scale-95 flex items-center justify-center gap-1"
              >
                <span>Next Step</span>
                <CaretRight size={14} weight="bold" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold transition shadow-xs active:scale-95"
              >
                Got It, Thanks!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
