"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Download, Share2, ShieldCheck, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { formatINR, formatDateIST } from "@/lib/utils";

interface QrPassCardProps {
  ticketNumber: string;
  qrToken: string;
  eventName: string;
  venue: string;
  eventDate: string;
  buyerName: string;
  quantity: number;
  amountPaid: number;
}

export default function QrPassCard({
  ticketNumber,
  qrToken,
  eventName,
  venue,
  eventDate,
  buyerName,
  quantity,
  amountPaid,
}: QrPassCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    // Generate high-resolution QR with Error Correction Level 'H'
    QRCode.toDataURL(qrToken, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 280,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Generation error", err));
  }, [qrToken]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Entry Pass: ${eventName}`,
        text: `Here is my verified GetMyShow pass for ${eventName}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Ticket pass link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Success Badge */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Pass Confirmed & Verified</span>
        </div>
        <p className="text-xs text-text-dim">Show this QR pass at the entrance gate</p>
      </div>

      {/* 35mm Scalloped Cinema Pass Card */}
      <div
        id="ticket-pass-element"
        className="ticket-scallop-card bg-surface-card border border-surface-border rounded-ticket shadow-2xl relative overflow-hidden"
      >
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />

        {/* Pass Header */}
        <div className="bg-brand-indigo px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-base">GetMyShow</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold uppercase">
              Gate Pass
            </span>
          </div>
          <span className="font-mono text-xs font-bold tracking-wider opacity-90">
            {ticketNumber}
          </span>
        </div>

        {/* Event Meta Body */}
        <div className="p-6 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-brand-saffron uppercase tracking-wider">
              {quantity} Pass(es) Confirmed
            </span>
            <h2 className="text-xl font-extrabold text-white mt-0.5 line-clamp-1">{eventName}</h2>
          </div>

          <div className="space-y-1.5 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
              <span>{formatDateIST(eventDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-saffron shrink-0" />
              <span className="line-clamp-1">{venue}</span>
            </div>
          </div>

          {/* Attendee Details Grid */}
          <div className="pt-3 border-t border-surface-border/70 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-text-dim uppercase tracking-wider block">Attendee</span>
              <span className="font-bold text-white">{buyerName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-text-dim uppercase tracking-wider block">Amount Paid</span>
              <span className="font-mono font-bold text-emerald-400">{formatINR(amountPaid)}</span>
            </div>
          </div>

          {/* Perforation Line */}
          <div className="relative py-2">
            <div className="border-t-2 border-dashed border-slate-700/80 w-full" />
          </div>

          {/* High-Contrast QR Code Stub */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white text-slate-900 shadow-inner">
            {qrDataUrl ? (
              <Image
                src={qrDataUrl}
                alt="Gate QR Code"
                width={200}
                height={200}
                className="w-48 h-48 object-contain"
                priority
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400 animate-pulse">
                Generating Secure Pass...
              </div>
            )}
            <span className="mt-2 font-mono text-[11px] font-bold text-slate-600 tracking-wider">
              {qrToken}
            </span>
          </div>

          {/* Hyperlocal Sponsor Ad Banner (Add-On #2) */}
          <div className="p-3 rounded-button bg-surface-elevated border border-surface-border/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-saffron/20 flex items-center justify-center text-brand-saffron font-bold text-xs shrink-0">
                15%
              </div>
              <div>
                <p className="font-bold text-white">Cafe Royale Sasaram</p>
                <p className="text-[10px] text-text-muted">Show this pass for 15% OFF your food bill</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-brand-saffron bg-brand-saffron/10 px-2 py-1 rounded">
              Partner Offer
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-surface-elevated/80 px-6 py-2.5 border-t border-surface-border flex items-center justify-between text-[11px] text-text-dim">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-indigo" />
            <span>Cryptographic HMAC Verified</span>
          </div>
          <span>Sasaram, Bihar</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.print()}
          className="flex-1 py-3 rounded-button font-bold text-xs bg-surface-card hover:bg-surface-elevated border border-surface-border text-white transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-brand-indigo" />
          <span>Save Pass</span>
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3 rounded-button font-bold text-xs bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-glow transition flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share WhatsApp</span>
        </button>
      </div>
    </div>
  );
}

