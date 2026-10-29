"use client";

import React, { useEffect } from "react";
import { X, ShieldCheck, CheckCircle } from "@phosphor-icons/react";

interface EventTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  ageLimit?: string;
  customTerms?: string[];
}

export default function EventTermsModal({
  isOpen,
  onClose,
  eventTitle,
  ageLimit = "All Ages Welcome",
  customTerms,
}: EventTermsModalProps) {
  // Prevent background scrolling when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultTerms = [
    `Age Limit: ${ageLimit}.`,
    "Please remember to carry a valid government-issued identification proof (such as an Aadhar card, School/College ID, or driving license) along with your digital ticket pass.",
    "Rights of admission are reserved for valid ticket holders ONLY. Tickets once booked cannot be exchanged or refunded.",
    "Gate timings: Gate closes 30 minutes prior to headliner performance. Kindly plan your arrival accordingly to avoid missing the main act.",
    "No backpacks, large handbags, or baggage are allowed inside the venue. There is NO luggage storage or cloakroom facility available at the event.",
    "Outside food, beverages, cigarettes, alcohol, and hazardous consumables are strictly prohibited at the venue.",
    "Buy your ticket from official GetMyShow ticketing partners and portals ONLY. Refrain from buying tickets from unauthorized third parties. Management will not be held responsible for fake or duplicate passes.",
  ];

  const termsToDisplay = customTerms && customTerms.length > 0 ? customTerms : defaultTerms;

  return (
    <div className="fixed inset-0 z-[1150] bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Event Terms and Conditions"
        className="w-full max-w-lg max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250 border border-slate-200"
      >
        {/* Header Bar */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
            Terms & Conditions
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Close terms modal"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="font-bold text-[#0F172A] text-xs uppercase tracking-wider text-slate-500">
            {eventTitle} • Admission Rules
          </div>

          <div className="space-y-3.5">
            {termsToDisplay.map((term, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 shrink-0" />
                <p className="flex-1">{term}</p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck size={16} weight="fill" className="text-emerald-600 shrink-0" />
            <span>Official GetMyShow Verified Admission Protocol</span>
          </div>
        </div>

        {/* Sticky Bottom Full-Width "Okay, Got It" Button */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold shadow-md shadow-indigo-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Okay, Got It</span>
          </button>
        </div>
      </div>
    </div>
  );
}
