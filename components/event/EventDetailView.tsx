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
  CheckCircle,
  Heart,
  Car,
  IdentificationCard,
  ForkKnife,
} from "@phosphor-icons/react";
import { EventItem, TicketTier } from "@/types";
import { formatINR } from "@/lib/utils";
import CheckoutModal from "@/components/checkout/CheckoutModal";

interface EventDetailViewProps {
  event: EventItem;
}

export default function EventDetailView({ event }: EventDetailViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  // Synthesize available ticket tiers (multi-tier support with single-price fallback)
  const availableTiers: TicketTier[] =
    event.ticket_tiers && event.ticket_tiers.length > 0
      ? event.ticket_tiers
      : [
          {
            id: "tier-ga",
            name: "General Admission",
            price: event.ticket_price,
            capacity: event.total_capacity,
            tickets_sold: event.tickets_sold,
            perks: "Standard entry • Open seating access",
            badge_color: "indigo",
          },
        ];

  const [selectedTier, setSelectedTier] = useState<TicketTier>(availableTiers[0]);

  // BookMyShow-style Social Hype Interest Counter
  const initialInterested = 180 + (event.tickets_sold || 0) * 2;
  const [isInterested, setIsInterested] = useState(false);
  const [interestedCount, setInterestedCount] = useState(initialInterested);

  // Lineup synthesis
  const getLineup = () => {
    if (event.performers && event.performers.length > 0) return event.performers;
    const t = (event.title + " " + (event.slug || "")).toLowerCase();
    if (t.includes("dandiya") || t.includes("garba") || t.includes("cultural")) {
      return [
        { name: "DJ Aakash Verma", role: "Resident DJ & Electronic Beats", avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80" },
        { name: "Pooja Trivedi", role: "Traditional Garba Vocalist", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
        { name: "Sasaram Dhol Tasha Troupe", role: "Live Brass & Percussion Ensemble", avatar_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=160&q=80" },
      ];
    }
    if (t.includes("scholarship") || t.includes("seminar") || t.includes("jee") || t.includes("neet")) {
      return [
        { name: "Er. Anand Shekhar", role: "Keynote Mentor (Ex-IIT Delhi)", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" },
        { name: "Dr. Rashmi Sinha", role: "Senior Academic Counselor", avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80" },
        { name: "Prof. Vikramaditya", role: "Super 50 Mathematics Lead", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80" },
      ];
    }
    if (t.includes("fest") || t.includes("college") || t.includes("band") || t.includes("music")) {
      return [
        { name: "The Rohtas Echoes", role: "Headlining Indie Rock Band", avatar_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=160&q=80" },
        { name: "RJ Ankit (Radio Mirchi)", role: "Celebrity Stage Host & Emcee", avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80" },
        { name: "DJ Rhythm", role: "EDM Stage Closer", avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&q=80" },
      ];
    }
    return [
      { name: event.organizer_name, role: "Official Event Host", avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" },
      { name: "Special Keynote Guest", role: "Industry Expert Speaker", avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80" },
    ];
  };

  const performers = getLineup();

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

  const subtotal = selectedTier.price * ticketQuantity;
  const platformFee = event.pass_fee_to_buyer ? Math.round(subtotal * 0.07) : 0;
  const totalPayable = subtotal + platformFee;

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#39364F] pb-32">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
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
            className="px-3.5 py-1.5 rounded-lg bg-white border border-[#DBDAE3] text-[#39364F] hover:text-[#3659E3] hover:border-[#3659E3] transition shadow-xs flex items-center gap-1.5 font-semibold text-xs active:scale-95"
            title="Share Event"
          >
            <ShareNetwork size={16} weight="bold" />
            <span>Share</span>
          </button>
        </div>

        {/* 16:9 Widescreen Hero Media Banner (Eventbrite 16px Modern Radius) */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#EEEDF2] rounded-2xl overflow-hidden border border-[#DBDAE3] shadow-xs">
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
          <div className="absolute top-5 left-5 z-10 bg-white/95 backdrop-blur-md rounded-lg p-2.5 shadow-md border border-[#DBDAE3] text-center min-w-[56px]">
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
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white text-[#3659E3] border border-[#DBDAE3]">
                  {event.city}
                </span>
                {isAlmostFull && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase bg-[#F05537] text-white flex items-center gap-1">
                    <Sparkle size={13} weight="fill" />
                    Fast Filling
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-[#6F7287] border border-[#DBDAE3]">
                  {event.tickets_sold} / {event.total_capacity} Passes Claimed
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isInterested;
                    setIsInterested(next);
                    setInterestedCount((prev) => (next ? prev + 1 : prev - 1));
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                    isInterested
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-white text-[#39364F] hover:text-rose-600 border border-[#DBDAE3]"
                  }`}
                  title="Mark yourself as interested in this event"
                >
                  <Heart
                    size={14}
                    weight={isInterested ? "fill" : "bold"}
                    className={isInterested ? "text-rose-600" : "text-[#6F7287]"}
                  />
                  <span>{interestedCount} Interested</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1E0A3C] tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Date, Time & Venue Info Cards (12px Radius) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white border border-[#DBDAE3] flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#3659E3]/10 text-[#3659E3] flex items-center justify-center shrink-0">
                  <CalendarBlank size={20} weight="bold" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-[#6F7287] uppercase tracking-wide">Date and Time</h4>
                  <p className="text-sm font-bold text-[#1E0A3C] mt-0.5">{formattedDate}</p>
                  <p className="text-xs text-[#6F7287]">{formattedTime} IST</p>
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${eventDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(eventDateObj.getTime() + 3*60*60*1000).toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(`${event.venue}, ${event.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#3659E3] hover:underline mt-1.5 inline-flex items-center gap-1"
                  >
                    + Add to Google Calendar
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-[#DBDAE3] flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#F05537]/10 text-[#F05537] flex items-center justify-center shrink-0">
                  <MapPinLine size={20} weight="bold" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-[#6F7287] uppercase tracking-wide">Location</h4>
                  <p className="text-sm font-bold text-[#1E0A3C] mt-0.5">{event.venue}</p>
                  <p className="text-xs text-[#6F7287]">{event.city}, Bihar</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.city}, Bihar`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#F05537] hover:underline mt-1.5 inline-flex items-center gap-1"
                  >
                    Get Directions in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Organizer Profile Card */}
            <div className="p-6 rounded-xl bg-white border border-[#DBDAE3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-lg bg-[#1E0A3C] text-white flex items-center justify-center font-bold text-lg shrink-0">
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
                className="px-4 py-2.5 rounded-lg border border-[#DBDAE3] hover:border-[#25D366] text-[#39364F] hover:text-[#25D366] text-xs font-bold transition flex items-center gap-1.5 bg-white shadow-xs"
              >
                <WhatsappLogo size={16} weight="fill" className="text-[#25D366]" />
                <span>Contact Host</span>
              </a>
            </div>

            {/* About This Event Description */}
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#DBDAE3] space-y-4 shadow-xs">
              <h2 className="text-xl font-bold text-[#1E0A3C]">About This Event</h2>
              <div className="text-sm text-[#39364F] leading-relaxed whitespace-pre-line space-y-3">
                {event.description}
              </div>
            </div>

            {/* BookMyShow Standard: Featured Artists & Guest Lineup Section */}
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#DBDAE3] space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#1E0A3C]">Artists & Key Guests</h2>
                  <p className="text-xs text-[#6F7287] mt-0.5">
                    Confirmed performers, keynote mentors, and stage headliners.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#3659E3] bg-[#3659E3]/10 px-2.5 py-1 rounded-md">
                  {performers.length} Confirmed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {performers.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#DBDAE3] bg-[#F8F7FA] flex items-center gap-3.5 hover:border-[#3659E3]/50 transition shadow-2xs"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 bg-slate-200">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#1E0A3C]">
                          {p.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-[#1E0A3C] truncate">{p.name}</h4>
                        <SealCheck size={14} weight="fill" className="text-[#3659E3] shrink-0" />
                      </div>
                      <span className="text-[11px] text-[#6F7287] block truncate">{p.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BookMyShow Standard: Venue Amenities & Gate Entry Guidelines */}
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1E0A3C] flex items-center gap-1.5">
                <Info size={16} weight="bold" className="text-[#3659E3]" />
                <span>Venue Amenities & Gate Protocol</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#39364F] pt-1">
                <div className="p-3 rounded-lg bg-[#F8F7FA] border border-[#EEEDF2] flex items-center gap-2">
                  <Car size={16} className="text-[#3659E3] shrink-0" />
                  <span className="font-semibold text-[11px]">Free Parking</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F8F7FA] border border-[#EEEDF2] flex items-center gap-2">
                  <IdentificationCard size={16} className="text-[#F05537] shrink-0" />
                  <span className="font-semibold text-[11px]">Photo ID Req.</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F8F7FA] border border-[#EEEDF2] flex items-center gap-2">
                  <ForkKnife size={16} className="text-[#F97316] shrink-0" />
                  <span className="font-semibold text-[11px]">Food Stalls</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F8F7FA] border border-[#EEEDF2] flex items-center gap-2">
                  <Clock size={16} className="text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[11px]">Gate: 45m Prior</span>
                </div>
              </div>
            </div>

            {/* BookMyShow Standard: Multi-Tier Pass Selection Section */}
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#DBDAE3] space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-[#1E0A3C]">Select Ticket Tier</h2>
                  <p className="text-xs text-[#6F7287] mt-0.5">
                    Choose your admission category. All passes include a verified HMAC QR code.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#4F46E5] bg-indigo-50 px-2.5 py-1 rounded-md self-start sm:self-auto">
                  {availableTiers.length} Option{availableTiers.length > 1 ? "s" : ""} Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {availableTiers.map((tier) => {
                  const isSelected = selectedTier.id === tier.id;
                  const remaining = Math.max(0, tier.capacity - tier.tickets_sold);
                  const isSoldOut = tier.capacity > 0 && remaining === 0;

                  return (
                    <button
                      key={tier.id}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => setSelectedTier(tier)}
                      className={`text-left p-4 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? "border-[#4F46E5] bg-indigo-50/30 shadow-xs ring-2 ring-[#4F46E5]/10"
                          : "border-[#DBDAE3] bg-white hover:border-[#4F46E5]/40"
                      } ${isSoldOut ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                                tier.badge_color === "saffron"
                                  ? "bg-orange-100 text-[#F97316]"
                                  : tier.badge_color === "emerald"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-indigo-100 text-[#4F46E5]"
                              }`}
                            >
                              {tier.badge_color === "saffron"
                                ? "VIP Pass"
                                : tier.badge_color === "emerald"
                                ? "Discount"
                                : "Standard Entry"}
                            </span>
                            <h3 className="text-base font-bold text-[#1E0A3C] mt-1.5">
                              {tier.name}
                            </h3>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? "border-[#4F46E5] bg-[#4F46E5]"
                                : "border-[#DBDAE3]"
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle size={18} weight="fill" className="text-white" />
                            )}
                          </div>
                        </div>

                        {tier.perks && (
                          <p className="text-xs text-[#6F7287] leading-relaxed">
                            ★ {tier.perks}
                          </p>
                        )}
                      </div>

                      <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-black text-[#1E0A3C]">
                            {tier.price === 0 ? "FREE" : formatINR(tier.price)}
                          </span>
                          <span className="text-[10px] text-[#6F7287] block">per person</span>
                        </div>

                        <span
                          className={`text-xs font-semibold ${
                            isSoldOut
                              ? "text-red-500 font-bold"
                              : remaining < 15
                              ? "text-amber-600 font-bold"
                              : "text-[#6F7287]"
                          }`}
                        >
                          {isSoldOut ? "Sold Out" : `${remaining} passes left`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BookMyShow Standard: Event Guidelines & FAQs */}
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#DBDAE3] space-y-5 shadow-xs">
              <h2 className="text-lg font-bold text-[#1E0A3C]">Venue Guidelines & FAQs</h2>
              <div className="divide-y divide-slate-100 text-xs text-[#39364F] space-y-3">
                <div className="pt-2">
                  <strong className="text-sm font-bold text-[#0F172A] block mb-1">How will I receive my ticket pass?</strong>
                  <p className="text-[#6F7287] leading-relaxed">
                    Your digital pass renders immediately on-screen after payment. You can download it as a high-resolution PNG image or save as PDF. It also remains permanently accessible on your GetMyShow account under &ldquo;My Tickets&rdquo;.
                  </p>
                </div>
                <div className="pt-3">
                  <strong className="text-sm font-bold text-[#0F172A] block mb-1">What is the gate admission process?</strong>
                  <p className="text-[#6F7287] leading-relaxed">
                    Simply show the cryptographic QR code on your phone screen at the venue gate. The security team will scan it using the GetMyShow camera scanner in under 50 milliseconds.
                  </p>
                </div>
                <div className="pt-3">
                  <strong className="text-sm font-bold text-[#0F172A] block mb-1">What if the event is cancelled or rescheduled?</strong>
                  <p className="text-[#6F7287] leading-relaxed">
                    You are protected under GetMyShow&rsquo;s 100% Buyer Refund Guarantee. If an organizer cancels or postpones, full refunds are processed back to your original UPI account within 5–7 business days.
                  </p>
                </div>
                <div className="pt-3">
                  <strong className="text-sm font-bold text-[#0F172A] block mb-1">Can I transfer my pass to a friend?</strong>
                  <p className="text-[#6F7287] leading-relaxed">
                    Yes. Each pass is valid for the specified headcount. You may share your pass QR link or downloaded image via WhatsApp to the person attending in your place.
                  </p>
                </div>
              </div>
            </div>

            {/* Tags Row */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Event Highlights</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-md bg-white border border-[#DBDAE3] text-xs font-semibold text-[#39364F]">
                  #{event.city}
                </span>
                <span className="px-3 py-1 rounded-md bg-white border border-[#DBDAE3] text-xs font-semibold text-[#39364F]">
                  #DigitalPass
                </span>
                <span className="px-3 py-1 rounded-md bg-white border border-[#DBDAE3] text-xs font-semibold text-[#39364F]">
                  #UPIFastCheckout
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 p-6 sm:p-7 rounded-xl bg-white border border-[#DBDAE3] shadow-md space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Pass Pricing</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-[#4F46E5]">
                    {selectedTier.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#1E0A3C]">
                    {selectedTier.price === 0 ? "FREE" : formatINR(selectedTier.price)}
                  </span>
                  {selectedTier.price > 0 && (
                    <span className="text-xs text-[#6F7287]">/ person</span>
                  )}
                </div>
                {selectedTier.perks && (
                  <p className="text-xs text-[#6F7287] mt-1.5 flex items-center gap-1">
                    <Sparkle size={13} weight="fill" className="text-[#F97316] shrink-0" />
                    <span className="truncate">{selectedTier.perks}</span>
                  </p>
                )}
              </div>

              {/* Quantity Counter */}
              <div className="p-4 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#39364F]">Select Quantity</span>
                  <div className="flex items-center gap-3 bg-white border border-[#DBDAE3] rounded-md px-2 py-1">
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

              {/* Primary Book CTA (Rectangular 8px Curved Radius - Ember Orange) */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 rounded-lg bg-[#F05537] hover:bg-[#D94428] text-white text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DBDAE3] px-4 py-3 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-[#4F46E5] shrink-0">
                {selectedTier.name}
              </span>
              <span className="text-xs text-[#6F7287] font-semibold truncate">
                {ticketQuantity} pass{ticketQuantity > 1 ? "es" : ""}
              </span>
            </div>
            <span className="text-lg font-black text-[#1E0A3C] block leading-tight mt-0.5">
              {selectedTier.price === 0 ? "FREE" : formatINR(selectedTier.price * ticketQuantity)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-5 rounded-lg bg-[#F05537] hover:bg-[#D94428] text-white text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
          >
            <Ticket size={18} weight="bold" />
            <span>Book Passes →</span>
          </button>
        </div>
      </div>

      {/* 2-Step No-Login Checkout Modal */}
      <CheckoutModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialQuantity={ticketQuantity}
        selectedTier={selectedTier}
      />
    </div>
  );
}
