"use client";

import { useEffect, useState, useRef } from "react";
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
  CircleNotch,
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
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(qrToken, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 400,
      color: {
        dark: "#1E0A3C",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Generation error", err));
  }, [qrToken]);

  const handleShare = () => {
    const shareText = `Here is my verified GetMyShow pass for ${eventName}!\nPass ID: ${ticketNumber}\nVenue: ${venue}\nDate: ${formatDateIST(eventDate)}`;
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

  // High-Resolution 2X PNG Ticket Generator for Offline Gallery Storage
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 800;
      const height = 1260;
      canvas.width = width;
      canvas.height = height;

      // Background Canvas
      ctx.fillStyle = "#F8F7FA";
      ctx.fillRect(0, 0, width, height);

      // Card Body
      const cardX = 40;
      const cardY = 40;
      const cardW = 720;
      const cardH = 1180;
      const r = 24;

      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#DBDAE3";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, r);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Top Header Bar
      ctx.fillStyle = "#1E0A3C";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, 110, [r, r, 0, 0]);
      ctx.fill();

      // Header Brand Text
      ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("get [my ▶] show", cardX + 40, cardY + 68);

      // Status Pill
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.roundRect(cardX + cardW - 200, cardY + 38, 160, 36, 8);
      ctx.fill();

      ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("OFFICIAL ADMIT", cardX + cardW - 180, cardY + 62);

      // Event Title
      ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#F05537";
      ctx.fillText("CONFIRMED TICKET PASS", cardX + 40, cardY + 160);

      ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#1E0A3C";

      // Wrap event name if long
      const words = eventName.split(" ");
      let line = "";
      let titleY = cardY + 195;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 620 && n > 0) {
          ctx.fillText(line, cardX + 40, titleY);
          line = words[n] + " ";
          titleY += 34;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, cardX + 40, titleY);

      // Metadata Divider
      ctx.strokeStyle = "#EEEDF2";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cardX + 40, titleY + 25);
      ctx.lineTo(cardX + cardW - 40, titleY + 25);
      ctx.stroke();

      // Details Grid
      const metaY = titleY + 60;
      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#6F7287";
      ctx.fillText("DATE & TIME", cardX + 40, metaY);
      ctx.fillText("PASSES", cardX + 380, metaY);

      ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#1E0A3C";
      ctx.fillText(formatDateIST(eventDate), cardX + 40, metaY + 26);
      ctx.fillText(`${quantity} Person (${formatINR(amountPaid)})`, cardX + 380, metaY + 26);

      const venueY = metaY + 65;
      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#6F7287";
      ctx.fillText("VENUE LOCATION", cardX + 40, venueY);

      ctx.font = "17px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#39364F";
      ctx.fillText(venue, cardX + 40, venueY + 26);

      const attendeeY = venueY + 65;
      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#6F7287";
      ctx.fillText("ATTENDEE", cardX + 40, attendeeY);
      ctx.fillText("PASS ID", cardX + 380, attendeeY);

      ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#1E0A3C";
      ctx.fillText(buyerName, cardX + 40, attendeeY + 28);

      ctx.font = "bold 20px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#3659E3";
      ctx.fillText(ticketNumber, cardX + 380, attendeeY + 28);

      // Perforation Line with Scallops
      const perfY = attendeeY + 65;
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "#DBDAE3";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cardX + 25, perfY);
      ctx.lineTo(cardX + cardW - 25, perfY);
      ctx.stroke();
      ctx.restore();

      // Scallop notches on sides
      ctx.fillStyle = "#F8F7FA";
      ctx.beginPath();
      ctx.arc(cardX, perfY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cardX + cardW, perfY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw QR Code
      if (qrDataUrl) {
        const qrImg = new window.Image();
        qrImg.src = qrDataUrl;
        await new Promise((resolve) => {
          qrImg.onload = resolve;
        });

        const qrSize = 250;
        const qrX = cardX + (cardW - qrSize) / 2;
        const qrY = perfY + 30;

        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#DBDAE3";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30, 16);
        ctx.fill();
        ctx.stroke();

        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        // Security Notice below QR
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#1E0A3C";
        ctx.textAlign = "center";
        ctx.fillText(qrToken.slice(0, 32) + "...", cardX + cardW / 2, qrY + qrSize + 40);

        ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#10B981";
        ctx.fillText("✓ Show this QR at gate entrance for instant scan", cardX + cardW / 2, qrY + qrSize + 65);
      }

      // Sponsor Offer Box
      const sponsorY = perfY + 375;
      ctx.fillStyle = "#FFFBEB";
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX + 40, sponsorY, cardW - 80, 70, 12);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#92400E";
      ctx.fillText("EXCLUSIVE EVENT PARTNER OFFER:", cardX + 60, sponsorY + 28);
      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#B45309";
      ctx.fillText("Flat 15% off at Maurya Royal Cafe, Sasaram on showing this pass!", cardX + 60, sponsorY + 52);

      // Trigger Download
      const link = document.createElement("a");
      link.download = `GetMyShow-Pass-${ticketNumber}.png`;
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
      {/* Success Confirmation Banner (Hidden in Print) */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3.5 shadow-xs print:hidden">
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

      {/* Modern Card Container holding 35mm Cinema Pass */}
      <div className="bg-white rounded-2xl border border-[#DBDAE3] shadow-md overflow-hidden relative p-5 sm:p-6 space-y-6 print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Scalloped Pass Card (Target for Single-Page Printing) */}
        <div
          ref={ticketRef}
          className="ticket-scallop-card bg-[#F8F7FA] border border-[#DBDAE3] rounded-xl overflow-hidden relative print:border-2 print:border-[#1E0A3C] print:rounded-xl print:m-0"
        >
          {/* Authentic Symmetrical Semicircular Cutout Notches */}
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
                priority
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Official Admit</span>
            </div>
          </div>

          {/* Event Information Block */}
          <div className="p-5 space-y-4 bg-white/60">
            <div>
              <span className="text-[10px] font-bold text-[#F05537] uppercase tracking-wider block">
                Confirmed Entry Pass
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#1E0A3C] mt-0.5 leading-snug">
                {eventName}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                  Date & Time
                </span>
                <p className="font-semibold text-[#1E0A3C] mt-0.5 flex items-center gap-1">
                  <CalendarBlank size={14} weight="bold" className="text-[#3659E3]" />
                  <span>{formatDateIST(eventDate)}</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                  Admit Count
                </span>
                <p className="font-mono font-bold text-[#1E0A3C] mt-0.5 flex items-center gap-1">
                  <Ticket size={14} weight="bold" className="text-[#F05537]" />
                  <span>{quantity} Person{quantity > 1 ? "s" : ""}</span>
                </p>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-[10px] font-bold text-[#6F7287] uppercase tracking-wider block">
                Venue Location
              </span>
              <p className="font-medium text-[#39364F] mt-0.5 flex items-center gap-1">
                <MapPinLine size={14} className="text-[#F05537]" />
                <span>{venue}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-[#DBDAE3] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#6F7287] block font-medium">Attendee</span>
                <span className="font-bold text-[#1E0A3C] text-sm">{buyerName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#6F7287] block font-medium">Pass Identifier</span>
                <span className="font-mono font-bold text-[#3659E3] text-sm">{ticketNumber}</span>
              </div>
            </div>
          </div>

          {/* Scalloped Perforation Line */}
          <div className="ticket-perforation my-0" />

          {/* QR Stub & Quiet Zone */}
          <div className="p-6 bg-white flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-white border border-[#DBDAE3] rounded-xl shadow-xs">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code Pass for ${ticketNumber}`}
                  className="w-48 h-48 rounded-lg object-contain"
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
              <p className="text-[11px] text-[#6F7287] flex items-center justify-center gap-1 font-medium">
                <ShieldCheck size={14} weight="fill" className="text-emerald-600" />
                <span>Show this QR at gate entrance for instant scan</span>
              </p>
            </div>

            {/* Hyperlocal Local Sponsor Ad Banner */}
            <div className="w-full mt-2 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#F97316] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Tag size={16} weight="fill" />
              </div>
              <div className="text-[11px] leading-tight flex-1">
                <span className="font-bold text-amber-950 block">Exclusive Event Partner Offer:</span>
                <span className="text-amber-800">Flat 15% off at Maurya Royal Cafe, Sasaram on showing this pass!</span>
              </div>
            </div>

            {/* Gate Guidelines Checklist */}
            <div className="w-full pt-2 border-t border-[#EEEDF2] text-[10px] text-[#6F7287] space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#3659E3]" />
                <span>Valid for single entry scan at venue gate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#3659E3]" />
                <span>Please carry a valid school or government photo ID</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Suite (Strictly Hidden during Print / PDF generation) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 print:hidden">
          <button
            type="button"
            onClick={handleShare}
            className="py-3 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <WhatsappLogo size={16} weight="fill" />
            <span>Share Ticket</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="py-3 px-3 rounded-lg bg-[#3659E3] hover:bg-[#2B47B8] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <CircleNotch size={16} weight="bold" className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <DownloadSimple size={16} weight="bold" />
                <span>Save Image</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-3 px-3 rounded-lg border border-[#DBDAE3] hover:border-[#1E0A3C] text-[#39364F] hover:text-[#1E0A3C] text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 bg-white shadow-xs"
          >
            <Printer size={16} weight="bold" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
