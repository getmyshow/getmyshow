"use client";

import { useEffect, useState, useRef } from "react";
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
  CircleNotch,
  Clock,
  User,
  Copy,
  Info,
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
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(qrToken, {
      errorCorrectionLevel: "H", // High error correction (30%) enables clean center logo embedding
      margin: 2,
      width: 480,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Generation error", err));
  }, [qrToken]);

  const handleCopyPassId = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(ticketNumber);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleShare = () => {
    const shareText = `🎟️ Here is my verified GetMyShow pass for ${eventName}!\nPass ID: ${ticketNumber}\nVenue: ${venue}\nDate: ${formatDateIST(eventDate)}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `Entry Pass: ${eventName}`,
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
   * High-Resolution 2X PNG Ticket Generator for Offline Gallery Storage
   * Explicitly embeds official GetMyShow logo image, center QR emblem, and BookMyShow stub
   */
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 840;
      const height = 1380;
      canvas.width = width;
      canvas.height = height;

      // 1. Background Canvas
      ctx.fillStyle = "#F8F7FA";
      ctx.fillRect(0, 0, width, height);

      // Card Geometry
      const cardX = 40;
      const cardY = 40;
      const cardW = 760;
      const cardH = 1300;
      const r = 24;

      // 2. White Card Base with Shadow
      ctx.save();
      ctx.shadowColor = "rgba(15, 23, 42, 0.08)";
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, r);
      ctx.fill();
      ctx.restore();

      // Card Border
      ctx.strokeStyle = "#DBDAE3";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, r);
      ctx.stroke();

      // 3. Top Header: GetMyShow Official Logo & Status Badge
      // Load and draw official GetMyShow Logo image
      const logoImg = new window.Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = "/brand/logos/wordmark-tilted-black-text.png";
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve; // Gracefully continue if network error
      });

      if (logoImg.complete && logoImg.naturalWidth > 0) {
        const logoTargetW = 190;
        const logoTargetH = (logoImg.naturalHeight / logoImg.naturalWidth) * logoTargetW;
        ctx.drawImage(logoImg, cardX + 36, cardY + 28, logoTargetW, logoTargetH);
      } else {
        // Fallback typography if image loading blocked
        ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#4F46E5";
        ctx.fillText("get [my ▶] show", cardX + 36, cardY + 60);
      }

      // Booking Confirmed Pill
      ctx.fillStyle = "#ECFDF5";
      ctx.strokeStyle = "#A7F3D0";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX + cardW - 225, cardY + 30, 185, 38, 20);
      ctx.fill();
      ctx.stroke();

      // Green Dot inside Pill
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.arc(cardX + cardW - 205, cardY + 49, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#065F46";
      ctx.fillText("BOOKING CONFIRMED", cardX + cardW - 192, cardY + 54);

      // Header Divider Line
      ctx.strokeStyle = "#EEEDF2";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cardX + 36, cardY + 84);
      ctx.lineTo(cardX + cardW - 36, cardY + 84);
      ctx.stroke();

      // 4. Event Title & Format Tags
      ctx.fillStyle = "#F97316";
      ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("OFFICIAL PASS • " + city.toUpperCase() + " • " + tierName.toUpperCase(), cardX + 36, cardY + 115);

      ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#1E0A3C";

      // Multi-line event title wrapper
      const words = eventName.split(" ");
      let line = "";
      let titleY = cardY + 148;
      const maxTitleW = posterUrl ? 440 : 660;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTitleW && n > 0) {
          ctx.fillText(line, cardX + 36, titleY);
          line = words[n] + " ";
          titleY += 32;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, cardX + 36, titleY);

      // 5. Left Info Details Grid
      const infoStartY = titleY + 36;

      // Date & Time
      ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#6F7287";
      ctx.fillText("DATE & TIME", cardX + 36, infoStartY);

      ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#1E0A3C";
      ctx.fillText(formatDateIST(eventDate), cardX + 36, infoStartY + 24);

      // Venue
      ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#6F7287";
      ctx.fillText("VENUE LOCATION", cardX + 36, infoStartY + 64);

      ctx.font = "15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#39364F";
      const venueTrim = venue.length > 40 ? venue.slice(0, 38) + "..." : venue;
      ctx.fillText(venueTrim, cardX + 36, infoStartY + 86);

      // Attendee Name & Admit Count
      ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#6F7287";
      ctx.fillText("ATTENDEE", cardX + 36, infoStartY + 126);
      ctx.fillText("PASS IDENTIFIER", cardX + 280, infoStartY + 126);

      ctx.font = "bold 17px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#1E0A3C";
      ctx.fillText(buyerName, cardX + 36, infoStartY + 148);

      ctx.font = "bold 16px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#4F46E5";
      ctx.fillText(ticketNumber, cardX + 280, infoStartY + 148);

      // Optional Poster Thumbnail on Right (BookMyShow style)
      if (posterUrl) {
        const posterImg = new window.Image();
        posterImg.crossOrigin = "anonymous";
        posterImg.src = posterUrl;
        await new Promise((resolve) => {
          posterImg.onload = resolve;
          posterImg.onerror = resolve;
        });

        if (posterImg.complete && posterImg.naturalWidth > 0) {
          const posterW = 160;
          const posterH = 190;
          const posterX = cardX + cardW - 36 - posterW;
          const posterY = cardY + 115;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(posterX, posterY, posterW, posterH, 14);
          ctx.clip();
          ctx.drawImage(posterImg, posterX, posterY, posterW, posterH);
          ctx.restore();

          // Border on poster
          ctx.strokeStyle = "#DBDAE3";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(posterX, posterY, posterW, posterH, 14);
          ctx.stroke();
        }
      }

      // 6. Symmetrical Waist Notches & Dashed Perforation Line
      const perfY = infoStartY + 185;

      // Dashed Line
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "#DBDAE3";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cardX + 26, perfY);
      ctx.lineTo(cardX + cardW - 26, perfY);
      ctx.stroke();
      ctx.restore();

      // Left & Right Semicircular Scallop Notches
      ctx.fillStyle = "#F8F7FA";
      ctx.beginPath();
      ctx.arc(cardX, perfY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cardX + cardW, perfY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Notch inner borders
      ctx.strokeStyle = "#DBDAE3";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cardX, perfY, 20, -Math.PI / 2, Math.PI / 2, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cardX + cardW, perfY, 20, Math.PI / 2, (3 * Math.PI) / 2, false);
      ctx.stroke();

      // 7. Centerpiece QR Code with Brand Emblem in Center
      if (qrDataUrl) {
        const qrImg = new window.Image();
        qrImg.src = qrDataUrl;
        await new Promise((resolve) => {
          qrImg.onload = resolve;
        });

        const qrSize = 250;
        const qrX = cardX + (cardW - qrSize) / 2;
        const qrY = perfY + 36;

        // White Quiet Zone Card
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#EEEDF2";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 16);
        ctx.fill();
        ctx.stroke();

        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        // Center Emblem Badge in QR code
        const centerIcon = new window.Image();
        centerIcon.crossOrigin = "anonymous";
        centerIcon.src = "/brand/icons/symbol-ticket-transparent.png";
        await new Promise((resolve) => {
          centerIcon.onload = resolve;
          centerIcon.onerror = resolve;
        });

        if (centerIcon.complete && centerIcon.naturalWidth > 0) {
          const badgeSize = 46;
          const badgeX = qrX + (qrSize - badgeSize) / 2;
          const badgeY = qrY + (qrSize - badgeSize) / 2;

          // White circular disc background for high contrast
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2 + 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#4F46E5";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.drawImage(centerIcon, badgeX, badgeY, badgeSize, badgeSize);
        }

        // Pass ID & Laser Scan Guidance
        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#1E0A3C";
        ctx.textAlign = "center";
        ctx.fillText(ticketNumber + " • GATE SCAN READY", cardX + cardW / 2, qrY + qrSize + 38);

        ctx.font = "13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#10B981";
        ctx.fillText("✓ Point this QR at venue laser gate for instant check-in", cardX + cardW / 2, qrY + qrSize + 62);
        ctx.textAlign = "left";
      }

      // 8. BookMyShow Signature Colored Stub (Bottom of Pass)
      const stubH = 175;
      const stubY = cardY + cardH - stubH;

      ctx.save();
      ctx.fillStyle = "#4F46E5"; // Signature Electric Indigo Stub
      ctx.beginPath();
      ctx.roundRect(cardX, stubY, cardW, stubH, [0, 0, r, r]);
      ctx.fill();

      // Watermark in bottom right corner of stub
      const watermarkImg = new window.Image();
      watermarkImg.crossOrigin = "anonymous";
      watermarkImg.src = "/brand/icons/symbol-ticket-transparent.png";
      await new Promise((resolve) => {
        watermarkImg.onload = resolve;
        watermarkImg.onerror = resolve;
      });

      if (watermarkImg.complete && watermarkImg.naturalWidth > 0) {
        ctx.globalAlpha = 0.12;
        ctx.drawImage(watermarkImg, cardX + cardW - 190, stubY - 20, 200, 200);
        ctx.globalAlpha = 1.0;
      }

      // Stub Content - Left Column (Event & Date)
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("EVENT DATE & TIME", cardX + 36, stubY + 40);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(formatDateIST(eventDate), cardX + 36, stubY + 64);

      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("LOCATION", cardX + 36, stubY + 104);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      const stubVenue = venue.length > 32 ? venue.slice(0, 30) + "..." : venue;
      ctx.fillText(stubVenue, cardX + 36, stubY + 126);

      // Stub Content - Right Column (Category & Total Admit)
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("ADMISSION TIER", cardX + cardW - 270, stubY + 40);

      ctx.fillStyle = "#F97316"; // Sunset Saffron Accent
      ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("GENERAL ADMISSION", cardX + cardW - 270, stubY + 62);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "extrabold 22px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`${quantity} PASS${quantity > 1 ? "ES" : ""} • ADMIT ALL`, cardX + cardW - 270, stubY + 98);

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.fillText(`TOTAL: ${formatINR(amountPaid)} (PAID)`, cardX + cardW - 270, stubY + 126);

      ctx.restore();

      // 9. Trigger File Download
      const link = document.createElement("a");
      link.download = `GetMyShow-Ticket-${ticketNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Canvas export error", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="ticket-print-wrapper max-w-md mx-auto space-y-6 print:m-0 print:p-0 print:max-w-none">
      {/* Success Confirmation Toast Banner (Hidden in Print) */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3.5 shadow-xs print:hidden">
        <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle size={22} weight="fill" />
        </div>
        <div className="text-xs">
          <h4 className="font-bold text-emerald-950 text-sm">Pass Confirmed & Active!</h4>
          <p className="text-emerald-800 mt-0.5">
            Cryptographically signed HMAC pass ready for gate entry.
          </p>
        </div>
      </div>

      {/* BookMyShow-Inspired 35mm Scalloped Digital Cinema Pass */}
      <div
        ref={ticketRef}
        className="ticket-scallop-card bg-white rounded-2xl border border-[#DBDAE3] shadow-lg overflow-hidden relative print:border-2 print:border-[#1E0A3C] print:shadow-none print:m-0"
      >
        {/* Authentic Symmetrical Semicircular Cutout Notches */}
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />

        {/* 1. Brand Header with Permanent Logo & Confirmed Pill */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#EEEDF2] flex items-center justify-between gap-3">
          {/* Logo container strictly outside any anchor tag that could be caught by print CSS */}
          <div className="flex items-center">
            <img
              src="/brand/logos/wordmark-tilted-black-text.svg"
              alt="GetMyShow"
              className="h-9 sm:h-10 w-auto object-contain block"
              style={{
                printColorAdjust: "exact",
                WebkitPrintColorAdjust: "exact",
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Booking Confirmed</span>
          </div>
        </div>

        {/* 2. Top Event Presentation Section (BookMyShow Split View) */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-100 text-[#F97316]">
                  {city}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                  {tierName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-[#39364F]">
                  Official Seat
                </span>
                <span className="text-[10px] font-medium text-[#6F7287]">
                  • {organizerName}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-[#1E0A3C] leading-snug tracking-tight">
                {eventName}
              </h2>
            </div>

            {/* Poster thumbnail if available */}
            {posterUrl && (
              <div className="relative w-18 h-24 sm:w-20 sm:h-26 rounded-xl overflow-hidden border border-[#DBDAE3] shadow-xs shrink-0">
                <img
                  src={posterUrl}
                  alt={eventName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Details Grid (Date, Time, Venue, Attendee) */}
          <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-[#F1F0F5] text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                Date & Time
              </span>
              <p className="font-semibold text-[#1E0A3C] mt-0.5 flex items-center gap-1.5">
                <CalendarBlank size={15} weight="bold" className="text-[#4F46E5] shrink-0" />
                <span>{formatDateIST(eventDate)}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                Total Admission
              </span>
              <p className="font-bold text-[#1E0A3C] mt-0.5 flex items-center gap-1.5 font-mono">
                <Ticket size={15} weight="bold" className="text-[#F97316] shrink-0" />
                <span>{quantity} Person{quantity > 1 ? "s" : ""}</span>
              </p>
            </div>

            <div className="col-span-2">
              <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                Venue Location
              </span>
              <p className="font-medium text-[#39364F] mt-0.5 flex items-center gap-1.5">
                <MapPinLine size={15} className="text-[#F05537] shrink-0" />
                <span>{venue}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                Attendee
              </span>
              <p className="font-bold text-[#1E0A3C] text-sm mt-0.5 flex items-center gap-1">
                <User size={14} weight="bold" className="text-[#6F7287]" />
                <span>{buyerName}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                Pass ID
              </span>
              <button
                type="button"
                onClick={handleCopyPassId}
                className="inline-flex items-center gap-1 font-mono font-bold text-[#4F46E5] text-sm mt-0.5 hover:underline"
                title="Click to copy pass ID"
              >
                <span>{ticketNumber}</span>
                <Copy size={13} weight="bold" className={copiedToken ? "text-emerald-600" : "text-[#6F7287]"} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Scalloped Perforation Line */}
        <div className="ticket-perforation my-0" />

        {/* 4. Centerpiece High-Density QR Pass with Brand Center Emblem */}
        <div className="p-6 bg-white flex flex-col items-center justify-center space-y-4">
          <div className="relative p-3.5 bg-white border border-[#DBDAE3] rounded-2xl shadow-xs">
            {qrDataUrl ? (
              <div className="relative flex items-center justify-center">
                <img
                  src={qrDataUrl}
                  alt={`QR Code Pass for ${ticketNumber}`}
                  className="w-52 h-52 sm:w-56 sm:h-56 rounded-xl object-contain block"
                  style={{
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact",
                  }}
                />
                {/* Center Brand Emblem Badge inside QR Code */}
                <div className="absolute w-12 h-12 rounded-full bg-white border-2 border-[#4F46E5] shadow-md flex items-center justify-center p-1.5 pointer-events-none">
                  <img
                    src="/brand/icons/symbol-ticket-transparent.png"
                    alt="GetMyShow Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="w-52 h-52 bg-[#F8F7FA] animate-pulse rounded-xl flex items-center justify-center text-xs text-[#6F7287]">
                Generating Secure QR Pass...
              </div>
            )}
          </div>

          <div className="text-center space-y-1">
            <span className="font-mono text-xs font-bold text-[#1E0A3C] tracking-widest block">
              {ticketNumber} • HMAC-SHA256 SIGNED
            </span>
            <p className="text-[11px] text-emerald-700 flex items-center justify-center gap-1.5 font-semibold">
              <ShieldCheck size={16} weight="fill" className="text-emerald-600" />
              <span>Show this QR at gate entrance for instant laser scan</span>
            </p>
          </div>
        </div>

        {/* 5. BookMyShow Signature Colored Stub (Electric Indigo Bottom Section) */}
        <div className="relative bg-[#4F46E5] text-white p-5 sm:p-6 overflow-hidden">
          {/* Subtle Corner Watermark Emblem */}
          <div className="absolute -bottom-6 -right-6 w-36 h-36 opacity-15 pointer-events-none select-none">
            <img
              src="/brand/icons/symbol-ticket-transparent.png"
              alt="Watermark"
              className="w-full h-full object-contain brightness-200"
            />
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200 block">
                Category / Tier
              </span>
              <span className="text-xs font-bold text-amber-300 block">
                GENERAL ADMISSION
              </span>
              <div className="text-xs text-indigo-100 flex items-center gap-1 pt-1">
                <Clock size={13} weight="bold" />
                <span>Gates Open 45m Prior</span>
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200 block">
                Admit Count
              </span>
              <div className="text-xl sm:text-2xl font-black text-white leading-none">
                {quantity} {quantity > 1 ? "PASSES" : "PASS"}
              </div>
              <div className="text-[11px] font-mono font-bold text-emerald-300">
                {formatINR(amountPaid)} PAID
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Below-Pass Local Sponsor Ad Banner (PRD Add-On #2) */}
      <div className="w-full p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center gap-3.5 shadow-2xs print:hidden">
        <div className="w-9 h-9 rounded-lg bg-[#F97316] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Tag size={18} weight="fill" />
        </div>
        <div className="text-xs leading-tight flex-1">
          <span className="font-bold text-amber-950 block">Exclusive Event Partner Voucher:</span>
          <span className="text-amber-800">Flat 15% off at Maurya Royal Cafe, Sasaram on presenting this digital pass!</span>
        </div>
      </div>

      {/* 7. Action Suite: WhatsApp Share, Save Image, Print PDF */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 print:hidden">
        <button
          type="button"
          onClick={handleShare}
          className="py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
        >
          <WhatsappLogo size={18} weight="fill" />
          <span>Share Ticket</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="py-3 px-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <CircleNotch size={18} weight="bold" className="animate-spin" />
              <span>Generating Image...</span>
            </>
          ) : (
            <>
              <DownloadSimple size={18} weight="bold" />
              <span>Save Image</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="py-3 px-3 rounded-xl border border-[#DBDAE3] hover:border-[#0F172A] text-[#0F172A] hover:bg-slate-50 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 bg-white shadow-xs"
        >
          <Printer size={18} weight="bold" className="text-[#4F46E5]" />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* Gate Entry Guidelines */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-[#64748B] space-y-1.5 print:border print:text-black">
        <div className="flex items-center gap-2 font-semibold text-[#0F172A] text-xs mb-1">
          <Info size={15} weight="bold" className="text-[#4F46E5]" />
          <span>Venue Gate Check-In Protocol</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
          <span>Keep your phone screen brightness at 100% for rapid optical scanner reading.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
          <span>Each QR token is single-use and invalidates immediately upon entry scan.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
          <span>Please carry a valid school, college, or government photo ID matching attendee name.</span>
        </div>
      </div>
    </div>
  );
}
