"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import {
  DownloadSimple,
  ShareNetwork,
  ShieldCheck,
  MapPinLine,
  CalendarBlank,
  CheckCircle,
  Ticket,
  Printer,
  Sparkle,
  WhatsappLogo,
  Tag,
} from "@phosphor-icons/react";
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
    QRCode.toDataURL(qrToken, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 320,
      color: {
        dark: "#1E0A3C",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Generation error", err));
  }, [qrToken]);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `Entry Pass: ${eventName}`,
        text: `Here is my verified GetMyShow pass for ${eventName}!`,
        url: window.location.href,
      });
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Ticket pass link copied to clipboard!");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Success Confirmation Banner (12px Radius) */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
          <CheckCircle size={22} weight="fill" />
        </div>
        <div className="text-xs">
          <h4 className="font-bold text-emerald-950 text-sm">Pass Confirmed & Active!</h4>
          <p className="text-emerald-800 mt-0.5">
            Cryptographically signed HMAC pass ready for gate entry.
          </p>
        </div>
      </div>

      {/* Modern Card Container holding 35mm Cinema Pass (16px Radius - No Ovals) */}
      <div className="bg-white rounded-2xl border border-[#DBDAE3] shadow-md overflow-hidden relative p-5 sm:p-6 space-y-6">
        {/* Scalloped Pass Container */}
        <div className="ticket-scallop-card bg-[#F8F7FA] border border-[#DBDAE3] rounded-xl overflow-hidden relative">
          <div className="ticket-notch-left" />
          <div className="ticket-notch-right" />

          {/* Top Brand Header */}
          <div className="p-4 bg-white border-b border-[#DBDAE3] flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/brand/logos/wordmark-cropped.svg"
                alt="GetMyShow"
                width={140}
                height={38}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white">
              Official Admit
            </span>
          </div>

          {/* Event Information */}
          <div className="p-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                Event
              </span>
              <h2 className="text-base font-extrabold text-[#1E0A3C] mt-0.5 leading-snug">
                {eventName}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                  Date
                </span>
                <p className="font-semibold text-[#1E0A3C] mt-0.5 flex items-center gap-1">
                  <CalendarBlank size={14} weight="bold" className="text-[#3659E3]" />
                  <span>{formatDateIST(eventDate)}</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                  Passes
                </span>
                <p className="font-mono font-bold text-[#1E0A3C] mt-0.5 flex items-center gap-1">
                  <Ticket size={14} weight="bold" className="text-[#F05537]" />
                  <span>{quantity} Person{quantity > 1 ? "s" : ""}</span>
                </p>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                Venue
              </span>
              <p className="font-medium text-[#39364F] mt-0.5 flex items-center gap-1">
                <MapPinLine size={14} className="text-[#F05537]" />
                <span>{venue}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-[#DBDAE3] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#6F7287] block font-medium">Attendee</span>
                <span className="font-bold text-[#1E0A3C]">{buyerName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#6F7287] block font-medium">Pass ID</span>
                <span className="font-mono font-bold text-[#3659E3]">{ticketNumber}</span>
              </div>
            </div>
          </div>

          {/* Perforation Line */}
          <div className="ticket-perforation my-1" />

          {/* QR Stub & Quiet Zone */}
          <div className="p-6 bg-white flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-white border border-[#DBDAE3] rounded-xl shadow-xs">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code Pass for ${ticketNumber}`}
                  className="w-48 h-48 rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 bg-[#F8F7FA] animate-pulse rounded-lg flex items-center justify-center text-xs text-[#6F7287]">
                  Generating Secure QR...
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <span className="font-mono text-xs font-bold text-[#1E0A3C] tracking-widest block">
                {qrToken.slice(0, 24)}...
              </span>
              <p className="text-[11px] text-[#6F7287] flex items-center justify-center gap-1">
                <ShieldCheck size={14} weight="fill" className="text-emerald-600" />
                <span>Show this QR at gate entrance for instant scan</span>
              </p>
            </div>

            {/* Hyperlocal Local Sponsor Ad Banner */}
            <div className="w-full mt-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#F97316] text-white flex items-center justify-center shrink-0">
                <Tag size={16} weight="fill" />
              </div>
              <div className="text-[11px] leading-tight flex-1">
                <span className="font-bold text-amber-950 block">Exclusive Event Partner Offer:</span>
                <span className="text-amber-800">Flat 15% off at Maurya Royal Cafe, Sasaram on showing this pass!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Suite Buttons (Rectangular 8px Curved Radius - No Ovals) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleShare}
            className="py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <WhatsappLogo size={16} weight="fill" />
            <span>Share Ticket</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-3 px-4 rounded-lg border border-[#DBDAE3] hover:border-[#1E0A3C] text-[#39364F] hover:text-[#1E0A3C] text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 bg-white shadow-xs"
          >
            <Printer size={16} weight="bold" />
            <span>Save / Print</span>
          </button>
        </div>
      </div>
    </div>
  );
}
