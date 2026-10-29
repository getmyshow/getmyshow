"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  DownloadSimple,
  ShareNetwork,
  MapPin,
  Question,
  Printer,
  Copy,
  CheckCircle,
  CaretRight,
  Gift,
  X,
  Sparkle,
  ShieldCheck,
  Ticket,
  Scissors,
} from "@phosphor-icons/react";
import { formatINR } from "@/lib/utils";
import { QRCode } from "@/components/ui/qr-code";

interface QrPassCardProps {
  ticketNumber: string;
  qrToken: string;
  eventName: string;
  venue: string;
  eventDate: string;
  buyerName: string;
  quantity: number;
  amountPaid: number;
  tierName?: string;
  posterUrl?: string | null;
  city?: string;
  organizerName?: string;
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
  tierName = "General Admission",
  posterUrl,
  city = "Sasaram",
  organizerName = "Verified Organizer",
}: QrPassCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [liveIstTime, setLiveIstTime] = useState<string>("");
  const ticketRef = useRef<HTMLDivElement>(null);

  // Live anti-screenshot clock running in Asia/Kolkata (IST)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveIstTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Full verification URL so scanning with ANY smartphone camera opens the live pass
  const [verificationUrl, setVerificationUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : "";
      const protocol = window.location.protocol;

      if (hostname === "localhost" || hostname === "127.0.0.1") {
        const localIp = process.env.NEXT_PUBLIC_LOCAL_IP || "192.168.29.227";
        return `http://${localIp}${port || ":3000"}/ticket/${qrToken}`;
      }
      return `${protocol}//${window.location.host}/ticket/${qrToken}`;
    }
    return `https://getmyshow.in/ticket/${qrToken}`;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : "";
      const protocol = window.location.protocol;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        const localIp = process.env.NEXT_PUBLIC_LOCAL_IP || "192.168.29.227";
        setVerificationUrl(`http://${localIp}${port || ":3000"}/ticket/${qrToken}`);
      } else {
        setVerificationUrl(`${protocol}//${window.location.host}/ticket/${qrToken}`);
      }
    }
  }, [qrToken]);

  // Format date and time strictly in BookMyShow standard: "Sat, 29 Mar | 05:30 PM"
  const eventDateObj = new Date(eventDate);
  const formattedDateBMS = eventDateObj.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
  const formattedTimeBMS = eventDateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
  const bmsDateTimeString = `${formattedDateBMS} | ${formattedTimeBMS}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue}, ${city}, Bihar`
  )}`;

  const handleCopyPassId = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(ticketNumber);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleCopyVoucher = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText("GMS-MAURYA-15");
      setCopiedVoucher(true);
      setTimeout(() => setCopiedVoucher(false), 2000);
    }
  };

  const handleShare = () => {
    const shareText = `🎟️ Verified GetMyShow M-Ticket for ${eventName}\nBooking ID: ${ticketNumber}\nDate: ${bmsDateTimeString}\nVenue: ${venue}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `M-Ticket: ${eventName}`,
        text: shareText,
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

  /**
   * High-Resolution 2X PNG Ticket Generator for Offline Storage
   */
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 800;
      const height = 1220;
      canvas.width = width;
      canvas.height = height;

      // 1. Background
      ctx.fillStyle = "#ECECEF";
      ctx.fillRect(0, 0, width, height);

      // 2. White Card Base
      const cardX = 40;
      const cardY = 40;
      const cardW = 720;
      const cardH = 1140;
      const r = 24;

      ctx.save();
      ctx.shadowColor = "rgba(15, 23, 42, 0.08)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, r);
      ctx.fill();
      ctx.restore();

      // Card border
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, r);
      ctx.stroke();

      // Hologram Banner on PNG
      ctx.fillStyle = "#4F46E5";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, 44, [r, r, 0, 0]);
      ctx.fill();

      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("LIVE VERIFIED CRYPTOGRAPHIC PASS • GETMYSHOW", cardX + 32, cardY + 28);

      // 3. Event Header Section (Poster + Title + Date)
      const posterX = cardX + 32;
      const posterY = cardY + 70;
      const posterSize = 130;

      if (posterUrl) {
        const posterImg = new window.Image();
        posterImg.crossOrigin = "anonymous";
        posterImg.src = posterUrl;
        await new Promise((resolve) => {
          posterImg.onload = resolve;
          posterImg.onerror = resolve;
        });

        if (posterImg.complete && posterImg.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(posterX, posterY, posterSize, posterSize, 16);
          ctx.clip();
          ctx.drawImage(posterImg, posterX, posterY, posterSize, posterSize);
          ctx.restore();
        }
      } else {
        ctx.fillStyle = "#F1F5F9";
        ctx.beginPath();
        ctx.roundRect(posterX, posterY, posterSize, posterSize, 16);
        ctx.fill();
      }

      // Title & Event Meta (Right of Poster)
      const textX = posterX + posterSize + 24;
      ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#0F172A";
      const titleLines = eventName.length > 28 ? [eventName.slice(0, 26) + "...", ""] : [eventName];
      ctx.fillText(titleLines[0], textX, posterY + 32);

      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#64748B";
      ctx.fillText("Live Event • " + city, textX, posterY + 62);

      ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#334155";
      ctx.fillText(bmsDateTimeString, textX, posterY + 90);

      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#64748B";
      const venueShort = venue.length > 34 ? venue.slice(0, 32) + "..." : venue;
      ctx.fillText(venueShort, textX, posterY + 116);

      // 4. Tap for QR pill bar
      const pillY = posterY + posterSize + 28;
      ctx.fillStyle = "#F1F5F9";
      ctx.beginPath();
      ctx.roundRect(cardX + 32, pillY, cardW - 64, 40, 20);
      ctx.fill();

      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#475569";
      ctx.textAlign = "center";
      ctx.fillText("Digital M-Ticket • Tap for QR code & details", cardX + cardW / 2, pillY + 25);
      ctx.textAlign = "left";

      // 5. QR Code Box
      const qrBoxY = pillY + 56;
      const qrBoxH = 260;
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX + 32, qrBoxY, cardW - 64, qrBoxH, 20);
      ctx.fill();
      ctx.stroke();

      // Render QR inside canvas with full verification URL
      const qrcodeLib = await import("qrcode");
      const qrData = await qrcodeLib.default.toDataURL(verificationUrl, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 320,
        color: { dark: "#0b0b0c", light: "#FFFFFF" },
      });

      const qrImg = new window.Image();
      qrImg.src = qrData;
      await new Promise((resolve) => {
        qrImg.onload = resolve;
        qrImg.onerror = resolve;
      });

      const qrDrawX = cardX + 54;
      const qrDrawY = qrBoxY + 30;
      const qrDrawSize = 200;
      ctx.drawImage(qrImg, qrDrawX, qrDrawY, qrDrawSize, qrDrawSize);

      // Ticket meta on right side of QR
      const metaX = qrDrawX + qrDrawSize + 32;
      ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#334155";
      ctx.fillText(`${tierName.toUpperCase()} ${quantity} ticket(s)`, metaX, qrDrawY + 60);

      ctx.font = "bold 18px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#0F172A";
      ctx.fillText(`BOOKING ID: ${ticketNumber}`, metaX, qrDrawY + 95);

      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#64748B";
      ctx.fillText(`Total ticket(s) ${quantity}`, metaX, qrDrawY + 125);

      // 6. Cancellation Strip
      const cancelY = qrBoxY + qrBoxH + 28;
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(cardX, cancelY, cardW, 44);
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cardX, cancelY);
      ctx.lineTo(cardX + cardW, cancelY);
      ctx.moveTo(cardX, cancelY + 44);
      ctx.lineTo(cardX + cardW, cancelY + 44);
      ctx.stroke();

      ctx.font = "13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.textAlign = "center";
      ctx.fillText("Cancellation unavailable for Live Events", cardX + cardW / 2, cancelY + 27);
      ctx.textAlign = "left";

      // 7. Total Amount Row
      const amountY = cancelY + 44;
      ctx.font = "15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#475569";
      ctx.fillText("Total Amount", cardX + 36, amountY + 45);

      ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#0F172A";
      ctx.textAlign = "right";
      ctx.fillText(amountPaid === 0 ? "FREE" : formatINR(amountPaid), cardX + cardW - 36, amountY + 45);
      ctx.textAlign = "left";

      // 8. Yellow Bottom Stub
      const stubY = cardY + cardH - 64;
      ctx.fillStyle = "#FEF3C7";
      ctx.beginPath();
      ctx.roundRect(cardX, stubY, cardW, 64, [0, 0, r, r]);
      ctx.fill();

      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cardX, stubY);
      ctx.lineTo(cardX + cardW, stubY);
      ctx.stroke();

      ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#92400E";
      ctx.textAlign = "center";
      ctx.fillText("Scan QR code at the entrance to gain entry.", cardX + cardW / 2, stubY + 38);

      // Trigger download
      const pngUrl = canvas.toDataURL("image/png");
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = pngUrl;
      downloadAnchor.download = `GetMyShow-Pass-${ticketNumber}.png`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    } catch (err) {
      console.error("Error generating ticket image:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="ticket-print-wrapper max-w-sm sm:max-w-md mx-auto space-y-4 print:m-0 print:p-0 print:max-w-none">
      {/* 
        ========================================================================
        BOOKMYSHOW-STYLE DIGITAL M-TICKET CARD (Authentic 35mm Scalloped Geometry)
        ========================================================================
      */}
      <div
        ref={ticketRef}
        className="relative bg-white rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50 overflow-hidden print:border-2 print:border-slate-900 print:shadow-none"
      >
        {/* Live Anti-Screenshot Dynamic Hologram Ribbon */}
        <div className="relative overflow-hidden bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs border-b border-slate-800">
          <div className="absolute inset-0 opacity-25 animate-hologram-sheen pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
              Live Verified Pass
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <ShieldCheck size={14} weight="bold" className="text-indigo-400" />
            <span>{liveIstTime || "IST"}</span>
          </div>
        </div>

        {/* Authentic 35mm Film Pin-Feed Sprocket Scallops (Top Edge) */}
        <div className="h-2 w-full bg-slate-100/60 border-b border-slate-200/60 flex justify-between px-3 items-center overflow-hidden" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300/80" />
          ))}
        </div>

        {/* Symmetrical Semicircular Cutout Notches */}
        <div
          className="absolute -left-3.5 top-[215px] sm:top-[225px] w-7 h-7 rounded-full bg-slate-100 border border-slate-300/80 z-20 shadow-inner"
          aria-hidden="true"
        />
        <div
          className="absolute -right-3.5 top-[215px] sm:top-[225px] w-7 h-7 rounded-full bg-slate-100 border border-slate-300/80 z-20 shadow-inner"
          aria-hidden="true"
        />

        {/* 1. Top Event Presentation Section (BookMyShow Split View) */}
        <div className="p-4 sm:p-5 flex items-start gap-3.5 relative">
          {/* Poster thumbnail */}
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={eventName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-xs font-bold">
                Pass
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0 pr-6 space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight line-clamp-2">
              {eventName}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Live Event • {city}
            </p>
            <p className="text-xs font-bold text-slate-700">
              {bmsDateTimeString}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {venue}
            </p>
          </div>

          {/* Vertical 'M-Ticket' Stamp (Right Edge) */}
          <div
            aria-hidden="true"
            className="absolute right-2.5 top-6 bottom-6 flex items-center justify-center select-none pointer-events-none"
          >
            <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-bold text-slate-400/80 uppercase tracking-widest font-mono">
              M-Ticket
            </span>
          </div>
        </div>

        {/* 2. Tap for QR code & more details pill */}
        <div className="px-4 pb-2">
          <div className="w-full py-2 px-3 rounded-full bg-slate-100/90 text-center text-xs font-semibold text-slate-600 shadow-2xs">
            Tap for QR code &amp; more details
          </div>
        </div>

        {/* 
          3. Core QR Code & Booking Details Box
          Left: Crisp SVG QR Code (Dots variant, no icon in center per user preference)
          Right: Tier, Booking ID, Quantity, Attendee Name
        */}
        <div className="px-4 py-2">
          <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 bg-white flex items-center gap-3.5 sm:gap-4 shadow-2xs">
            {/* QR Code Container with 12px Quiet Zone */}
            <div className="relative inline-flex items-center justify-center p-2.5 rounded-xl bg-white border border-slate-100 shrink-0 shadow-xs">
              <QRCode
                value={verificationUrl}
                size={112}
                variant="dots"
                errorCorrection="M"
                margin={2}
                color="#0b0b0c"
                background="#FFFFFF"
                reveal="load"
              />
            </div>

            {/* Ticket Info (Right side) */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-tight truncate">
                {tierName} {quantity} ticket(s)
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono tracking-tight">
                  BOOKING ID: {ticketNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPassId}
                  className="text-slate-400 hover:text-indigo-600 transition p-0.5"
                  title="Copy Booking ID"
                >
                  <Copy size={14} weight="bold" className={copiedToken ? "text-emerald-600" : ""} />
                </button>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Total ticket(s) {quantity}
              </div>
              <div className="text-[11px] text-slate-500 truncate pt-0.5 font-medium">
                Pass for <strong className="text-slate-700">{buyerName}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Perforated Divider Line */}
        <div className="px-4 py-1" aria-hidden="true">
          <div className="border-b border-dashed border-slate-300 w-full" />
        </div>

        {/* 4. Cancellation unavailable for Live Events Strip */}
        <div className="bg-slate-50/90 py-2 px-4 text-center border-t border-b border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium tracking-tight">
            Cancellation unavailable for Live Events
          </p>
        </div>

        {/* 5. Total Amount Row */}
        <div className="py-3 px-5 flex items-center justify-between text-xs bg-white">
          <span className="font-medium text-slate-600">Total Amount</span>
          <span className="font-bold text-slate-900 text-sm sm:text-base">
            {amountPaid === 0 ? "FREE" : formatINR(amountPaid)}
          </span>
        </div>

        {/* 6. BookMyShow Warm Yellow Bottom Stub */}
        <div className="bg-amber-100/90 border-t border-amber-200/80 py-2.5 px-4 text-center rounded-b-3xl">
          <p className="text-xs font-semibold text-amber-900">
            Scan QR code at the entrance to gain entry.
          </p>
        </div>
      </div>

      {/* 
        ========================================================================
        ACTION & CONVENIENCE BUTTONS (BookMyShow M-Ticket Standard)
        ========================================================================
      */}
      <div className="space-y-3 pt-1 print:hidden">
        {/* 1. Primary "Find Venue" Button */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-800 shadow-xs transition active:scale-[0.99]"
        >
          <MapPin size={18} weight="bold" className="text-slate-800" />
          <span>Find Venue</span>
        </a>

        {/* 2. Need Help / Visit Help Centre */}
        <Link
          href="/contact"
          className="w-full py-1.5 text-center text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center justify-center gap-1 transition"
        >
          <Question size={15} weight="bold" />
          <span>Need help? • Visit help centre</span>
          <CaretRight size={13} weight="bold" />
        </Link>

        {/* 3. Local Sponsor Partner Tear-Away Voucher */}
        <div className="w-full rounded-2xl p-4 bg-indigo-900 text-white shadow-md relative overflow-hidden border border-indigo-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Scissors size={14} weight="bold" className="text-amber-400 rotate-90" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                  Exclusive Partner Voucher
                </span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Flat 15% OFF at Maurya Royal Cafe
              </h4>
              <p className="text-[11px] text-indigo-200 mt-0.5">
                GT Road, Sasaram • Show digital pass at billing
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowRewardModal(true)}
              className="flex flex-col items-center justify-center shrink-0 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-xs">
                🎁
              </div>
              <span className="text-[10px] font-bold text-indigo-200 mt-1 group-hover:text-white transition">
                Tap to open
              </span>
            </button>
          </div>
        </div>

        {/* 4. Secondary Action Row: Share, Save Image, Print */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-3 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs active:scale-95 cursor-pointer"
          >
            <ShareNetwork size={16} weight="bold" />
            <span>Share Pass</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex-1 py-3 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <DownloadSimple size={16} weight="bold" />
            <span>{isDownloading ? "Saving..." : "Save Image"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-11 h-11 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-center shadow-2xs transition active:scale-95 cursor-pointer"
            title="Print or Save PDF"
          >
            <Printer size={16} weight="bold" />
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        INTERACTIVE REWARD MODAL (When attendee taps "Tap to open")
        ========================================================================
      */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowRewardModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} weight="bold" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 mx-auto flex items-center justify-center text-3xl">
              🎉
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600">
                Unlocked Event Reward
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Flat 15% OFF at Maurya Royal Cafe
              </h3>
              <p className="text-xs text-slate-500">
                Present your GetMyShow digital pass at the billing counter in Sasaram to redeem this exclusive festival discount.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 font-mono text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Code: <strong>GMS-MAURYA-15</strong></span>
              <button
                type="button"
                onClick={handleCopyVoucher}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1"
              >
                {copiedVoucher ? "Copied!" : "Copy"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowRewardModal(false)}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
            >
              Awesome, Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
