"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarBlank,
  MapPinLine,
  ShareNetwork,
  Ticket,
  CaretLeft,
  UsersThree,
  ShieldCheck,
  Lightning,
  Clock,
  Sparkle,
  Info,
  ArrowSquareOut,
  WhatsappLogo,
  SealCheck,
  Minus,
  Plus,
} from "@phosphor-icons/react";
import { EventItem } from "@/types";
import { formatINR } from "@/lib/utils";
import CheckoutModal from "@/components/checkout/CheckoutModal";

interface EventDetailViewProps {
  event: EventItem;
}

export default function EventDetailView({ event }: EventDetailViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const isAlmostFull =
    event.total_capacity > 0 &&
    (event.total_capacity - event.tickets_sold) / event.total_capacity < 0.25;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: event.title,
        text: `Book passes for ${event.title} in ${event.city} on GetMyShow!`,
        url: window.location.href,
      });
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  };

  const eventDateObj = new Date(event.event_date);
  const formattedDate = eventDateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const formattedTime = eventDateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  const monthShort = eventDateObj.toLocaleDateString("en-US", { month: "short", timeZone: "Asia/Kolkata" }).toUpperCase();
  const dayNum = eventDateObj.toLocaleDateString("en-US", { day: "2-digit", timeZone: "Asia/Kolkata" });

  const subtotal = event.ticket_price * ticketQuantity;
  const platformFee = event.pass_fee_to_buyer ? Math.round(subtotal * 0.07) : 0;
  const totalPayable = subtotal + platformFee;

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#39364F] pb-32">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Breadcrumb Navigation & Share Button */}
        <div className="flex items-center justify-between text-xs text-[#6F7287]">
          <div className="flex items-center gap-2 overflow-hidden">
            <Link
              href="/"
              className="hover:text-[#3659E3] transition flex items-center gap-1 font-semibold text-[#39364F]"
            >
              <CaretLeft size={16} weight="bold" />
              <span>Back to Events</span>
            </Link>
            <span>/</span>
            <span className="font-medium">{event.city}</span>
            <span>/</span>
            <span className="text-[#1E0A3C] font-semibold truncate max-w-[200px] sm:max-w-md">
              {event.title}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-[360px] bg-white border border-[#DBDAE3] text-[#39364F] hover:text-[#3659E3] hover:border-[#3659E3] transition shadow-xs flex items-center gap-1.5 font-semibold text-xs"
            title="Share Event"
          >
            <ShareNetwork size={16} weight="bold" />
            <span>Share</span>
          </button>
        </div>

        {/* 16:9 Widescreen Hero Media Banner */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#EEEDF2] rounded-[40px] overflow-hidden border border-[#DBDAE3] shadow-xs">
          {event.poster_url ? (
            <Image
              src={event.poster_url}
              alt={event.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#dee5ff] to-[#eeedf2] text-[#6F7287]">
              <Ticket size={48} weight="duotone" />
            </div>
          )}

          {/* Floating Eventbrite Date Callout Badge */}
          <div className="absolute top-5 left-5 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-md border border-[#DBDAE3] text-center min-w-[56px]">
            <span className="block text-xs font-black text-[#3659E3] uppercase tracking-wider">
              {monthShort}
            </span>
            <span className="block text-xl font-black text-[#1E0A3C] leading-none mt-0.5">
              {dayNum}
            </span>
          </div>
        </div>

        {/* 2-Column Content Layout (Eventbrite Standard) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {/* Left Column (Main Details) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Metadata */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-[20px] text-xs font-bold bg-white text-[#3659E3] border border-[#DBDAE3]">
                  {event.city}
                </span>
                {isAlmostFull && (
                  <span className="px-3 py-1 rounded-[20px] text-xs font-extrabold uppercase bg-[#F05537] text-white flex items-center gap-1">
                    <Sparkle size={13} weight="fill" />
                    Fast Filling
                  </span>
                )}
                <span className="px-3 py-1 rounded-[20px] text-xs font-semibold bg-white text-[#6F7287] border border-[#DBDAE3]">
                  {event.tickets_sold} / {event.total_capacity} Passes Claimed
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1E0A3C] tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Date, Time & Venue Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-[24px] bg-white border border-[#DBDAE3] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#3659E3]/10 text-[#3659E3] flex items-center justify-center shrink-0">
                  <CalendarBlank size={20} weight="bold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#6F7287] uppercase tracking-wide">Date and Time</h4>
                  <p className="text-sm font-bold text-[#1E0A3C] mt-0.5">{formattedDate}</p>
                  <p className="text-xs text-[#6F7287]">{formattedTime} IST</p>
                </div>
              </div>

              <div className="p-5 rounded-[24px] bg-white border border-[#DBDAE3] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#F05537]/10 text-[#F05537] flex items-center justify-center shrink-0">
                  <MapPinLine size={20} weight="bold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#6F7287] uppercase tracking-wide">Location</h4>
                  <p className="text-sm font-bold text-[#1E0A3C] mt-0.5">{event.venue}</p>
                  <p className="text-xs text-[#6F7287]">{event.city}, Bihar</p>
                </div>
              </div>
            </div>

            {/* Organizer Profile Card */}
            <div className="p-6 rounded-[32px] bg-white border border-[#DBDAE3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#1E0A3C] text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {event.organizer_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-[#1E0A3C]">{event.organizer_name}</h3>
                    <SealCheck size={18} weight="fill" className="text-[#3659E3]" />
                  </div>
                  <p className="text-xs text-[#6F7287]">Verified Host • Sasaram & Rohtas</p>
                </div>
              </div>

              <a
                href={`https://wa.me/${event.organizer_whatsapp}?text=${encodeURIComponent(`Hi, I have a question regarding ${event.title} on GetMyShow`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-[360px] border border-[#DBDAE3] hover:border-[#25D366] text-[#39364F] hover:text-[#25D366] text-xs font-bold transition flex items-center gap-1.5 bg-white"
              >
                <WhatsappLogo size={16} weight="fill" className="text-[#25D366]" />
                <span>Contact Host</span>
              </a>
            </div>

            {/* About This Event Description */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#DBDAE3] space-y-4">
              <h2 className="text-xl font-bold text-[#1E0A3C]">About This Event</h2>
              <div className="text-sm text-[#39364F] leading-relaxed whitespace-pre-line space-y-3">
                {event.description}
              </div>
            </div>

            {/* Tags Row */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Tags</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-[20px] bg-white border border-[#DBDAE3] text-xs font-semibold text-[#39364F]">
                  #{event.city}
                </span>
                <span className="px-3 py-1 rounded-[20px] bg-white border border-[#DBDAE3] text-xs font-semibold text-[#39364F]">
                  #LivePass
                </span>
                <span className="px-3 py-1 rounded-[20px] bg-white border border-[#DBDAE3] text-xs font-semibold text-[#39364F]">
                  #UPIFastCheckout
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 p-6 sm:p-7 rounded-[40px] bg-white border border-[#DBDAE3] shadow-card space-y-6">
              <div>
                <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Pass Pricing</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#1E0A3C]">
                    {event.ticket_price === 0 ? "FREE" : formatINR(event.ticket_price)}
                  </span>
                  {event.ticket_price > 0 && (
                    <span className="text-xs text-[#6F7287]">/ person</span>
                  )}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="p-4 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#39364F]">Select Quantity</span>
                  <div className="flex items-center gap-3 bg-white border border-[#DBDAE3] rounded-full px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      disabled={ticketQuantity <= 1}
                      className="p-1 text-[#39364F] hover:text-[#1E0A3C] disabled:opacity-30"
                    >
                      <Minus size={14} weight="bold" />
                    </button>
                    <span className="text-sm font-bold text-[#1E0A3C] min-w-[16px] text-center">
                      {ticketQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                      disabled={ticketQuantity >= 10}
                      className="p-1 text-[#39364F] hover:text-[#1E0A3C] disabled:opacity-30"
                    >
                      <Plus size={14} weight="bold" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6F7287] pt-2 border-t border-[#DBDAE3]/60">
                  <span>Subtotal ({ticketQuantity} pass{ticketQuantity > 1 ? "es" : ""})</span>
                  <span className="font-bold text-[#1E0A3C]">{formatINR(subtotal)}</span>
                </div>
              </div>

              {/* Primary Book CTA */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 rounded-[360px] bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Ticket size={20} weight="bold" />
                <span>Book Passes via UPI</span>
              </button>

              {/* Buyer Guarantees */}
              <div className="space-y-2.5 pt-2 text-xs text-[#6F7287]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>Instant WhatsApp Ticket with HMAC QR Pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightning size={18} weight="fill" className="text-[#F05537] shrink-0" />
                  <span>2-Click No-Login UPI Checkout (under 10 sec)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Checkout Bar (Screens < 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DBDAE3] p-4 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-[#6F7287] font-semibold block">Total Price</span>
            <span className="text-lg font-black text-[#1E0A3C]">
              {event.ticket_price === 0 ? "FREE" : formatINR(event.ticket_price * ticketQuantity)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 py-3.5 px-6 rounded-[360px] bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Ticket size={18} weight="bold" />
            <span>Book Passes Now</span>
          </button>
        </div>
      </div>

      {/* 2-Step No-Login Checkout Modal */}
      <CheckoutModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialQuantity={ticketQuantity}
      />
    </div>
  );
}
