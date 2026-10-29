"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarBlank,
  Clock,
  Hourglass,
  UsersThree,
  MusicNotes,
  MapPinLine,
  ShareNetwork,
  Ticket,
  CaretLeft,
  CaretRight,
  ShieldCheck,
  Lightning,
  Sparkle,
  Info,
  WhatsappLogo,
  SealCheck,
  Minus,
  Plus,
  CheckCircle,
  DeviceMobile,
  ArrowSquareOut,
  ThumbsUp,
} from "@phosphor-icons/react";
import { EventItem, TicketTier } from "@/types";
import { formatINR } from "@/lib/utils";
import { getEvents } from "@/actions/events";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import EventMTicketModal from "@/components/event/EventMTicketModal";
import EventTermsModal from "@/components/event/EventTermsModal";
import SimilarEventsCarousel from "@/components/event/SimilarEventsCarousel";

interface EventDetailViewProps {
  event: EventItem;
}

export default function EventDetailView({ event }: EventDetailViewProps) {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isMTicketModalOpen, setIsMTicketModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);

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

  // BookMyShow-style Social Hype Interest Counter with LocalStorage persistence
  const initialInterested = event.interested_count || 180 + (event.tickets_sold || 0) * 2;
  const [isInterested, setIsInterested] = useState(false);
  const [interestedCount, setInterestedCount] = useState(initialInterested);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`getmyshow_interested_${event.id}`);
      if (stored === "true") {
        setIsInterested(true);
        setInterestedCount((prev) => prev + 1);
      }
    } catch {
      // localStorage may be disabled
    }

    // Load related events for "You May Also Like" carousel
    let mounted = true;
    getEvents().then((res) => {
      if (mounted && res.success && res.data) {
        setAllEvents(res.data);
      }
    });
    return () => {
      mounted = false;
    };
  }, [event.id]);

  const handleToggleInterested = () => {
    const next = !isInterested;
    setIsInterested(next);
    setInterestedCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
    try {
      localStorage.setItem(`getmyshow_interested_${event.id}`, next ? "true" : "false");
    } catch {
      // fallback
    }
  };

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
        { name: "RJ Ankit", role: "Celebrity Stage Host & Emcee", avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80" },
        { name: "DJ Rhythm", role: "EDM Stage Closer", avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&q=80" },
      ];
    }
    return [
      { name: event.organizer_name, role: "Official Event Host", avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" },
      { name: "Keynote Speaker", role: "Industry Expert", avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80" },
    ];
  };

  const performers = getLineup();

  // Genre tags synthesis
  const genreTags = event.genre_tags && event.genre_tags.length > 0
    ? event.genre_tags
    : event.slug.includes("dandiya")
    ? ["Cultural Festivals", "Music & Garba"]
    : event.slug.includes("scholarship")
    ? ["Coaching & Seminars", "Career Guidance"]
    : event.slug.includes("fest")
    ? ["College Fests", "Live Music"]
    : event.slug.includes("marathon")
    ? ["Sports & Marathon", "Health & Fitness"]
    : ["Featured Events", "Bihar Special"];

  // Vibe / musical genre string
  const vibeString = event.slug.includes("dandiya")
    ? "Live Dhol, DJ Beats, Traditional Garba"
    : event.slug.includes("scholarship")
    ? "Educational Blueprint, Interactive Q&A"
    : event.slug.includes("fest")
    ? "Indie Rock, Battle of Bands, Youth Energy"
    : event.slug.includes("marathon")
    ? "Riverfront Run, Timing Bib, Finisher Medal"
    : "Live Entertainment & Stage Showcase";

  // Duration & Age limit
  const durationHours = event.duration_hours || (event.slug.includes("dandiya") ? 6 : event.slug.includes("scholarship") ? 4 : 5);
  const ageLimit = event.age_limit || (event.slug.includes("dandiya") ? "All Ages Welcome" : event.slug.includes("scholarship") ? "Class 10th - 12th Aspirants" : "All Ages Welcome");

  const isAlmostFull =
    event.total_capacity > 0 &&
    (event.total_capacity - event.tickets_sold) / event.total_capacity < 0.25;

  const handleShare = () => {
    const shareData = {
      title: `${event.title} - ${event.city} Event Tickets | GetMyShow`,
      text: `Book passes for ${event.title} in ${event.city} on GetMyShow! 2-click instant UPI checkout.`,
      url: typeof window !== "undefined" ? window.location.href : `https://getmyshow-nine.vercel.app/e/${event.slug}`,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareData.url);
      alert("Event link copied to clipboard!");
    }
  };

  const eventDateObj = new Date(event.event_date);
  const formattedDate = eventDateObj.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const formattedTime = eventDateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  const subtotal = selectedTier.price * ticketQuantity;
  const platformFee = event.pass_fee_to_buyer ? Math.round(subtotal * 0.07) : 0;
  const totalPayable = subtotal + platformFee;

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#0F172A] pb-32">
      {/* 1. Sticky Top Navigation App Bar (BookMyShow standard) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Link
            href="/"
            className="p-1.5 -ml-1 text-slate-700 hover:text-[#0F172A] rounded-full hover:bg-slate-100 transition-colors shrink-0 flex items-center gap-1"
            aria-label="Back to home"
          >
            <CaretLeft size={20} weight="bold" />
          </Link>

          <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate flex-1 text-center sm:text-left">
            {event.title}
          </h2>

          <button
            type="button"
            onClick={handleShare}
            className="p-2 -mr-1 text-slate-700 hover:text-[#F05537] hover:bg-slate-100 rounded-full transition-colors shrink-0"
            aria-label="Share event"
          >
            <ShareNetwork size={20} weight="bold" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
        {/* 2-Column Responsive Layout (Main Details on Left, Booking Widget on Right for Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* 2. 16:9 Widescreen Hero Media Banner */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900">
              {event.poster_url ? (
                <Image
                  src={event.poster_url}
                  alt={event.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 680px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-800">
                  <Ticket size={48} weight="duotone" />
                </div>
              )}

              {/* Bottom-Left Organizer Watermark Badge (AtomX style) */}
              <div className="absolute bottom-3 left-3 bg-[#0F172A]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                <SealCheck size={13} weight="fill" className="text-[#F05537]" />
                <span className="truncate max-w-[130px]">{event.organizer_name}</span>
              </div>
            </div>

            {/* 3. Dark Genre / Category Pill Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {genreTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#0F172A] text-white text-[11px] font-semibold px-3 py-1 rounded-md tracking-tight shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 4. BookMyShow Interactive "Interested" Social Hype Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/90 flex items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <ThumbsUp size={15} weight="fill" className="text-emerald-600 shrink-0" />
                  <span className="truncate">
                    {isInterested ? `You & ${interestedCount} are interested` : `${interestedCount} are interested`}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] truncate">
                  {isInterested
                    ? "We'll update you with all details about this event."
                    : "Mark interested to know more about this event."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleInterested}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 active:scale-95 ${
                  isInterested
                    ? "border border-slate-300 text-slate-600 hover:bg-slate-100 bg-white"
                    : "border-2 border-[#F05537] text-[#F05537] hover:bg-red-50 bg-white shadow-2xs"
                }`}
              >
                {isInterested ? "Undo" : "Interested?"}
              </button>
            </div>

            {/* 5. BookMyShow Event Vitals List */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5 text-xs sm:text-sm text-[#0F172A]">
              {/* Date */}
              <div className="flex items-start gap-3">
                <CalendarBlank size={18} weight="bold" className="text-slate-500 shrink-0 mt-0.5" />
                <span className="font-semibold">{formattedDate}</span>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <Clock size={18} weight="bold" className="text-slate-500 shrink-0 mt-0.5" />
                <span className="font-semibold">{formattedTime} IST</span>
              </div>

              {/* Duration */}
              <div className="flex items-start gap-3">
                <Hourglass size={18} weight="bold" className="text-slate-500 shrink-0 mt-0.5" />
                <span className="font-semibold">{durationHours} Hours</span>
              </div>

              {/* Age Limit */}
              <div className="flex items-start gap-3">
                <UsersThree size={18} weight="bold" className="text-slate-500 shrink-0 mt-0.5" />
                <span className="font-semibold">Age Limit - {ageLimit}</span>
              </div>

              {/* Genre / Vibes */}
              <div className="flex items-start gap-3">
                <MusicNotes size={18} weight="bold" className="text-slate-500 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-700">{vibeString}</span>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-3 pt-1 border-t border-slate-100">
                <MapPinLine size={18} weight="bold" className="text-[#F05537] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">{event.venue}: {event.city}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.city}, Bihar`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[11px] font-bold text-[#4F46E5] hover:underline mt-0.5"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Subtle Divider Strip */}
            <div className="h-1.5 bg-slate-100 rounded-full w-full" />

            {/* 6. Artists & Guest Lineup Section */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
              <h3 className="text-base font-bold text-[#0F172A] tracking-tight">Artists</h3>
              <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1">
                {performers.map((p, idx) => (
                  <div key={idx} className="shrink-0 flex flex-col items-center text-center w-20">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-2xs mb-1.5">
                      {p.avatar_url ? (
                        <Image
                          src={p.avatar_url}
                          alt={p.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-600">
                          {p.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#0F172A] line-clamp-1 w-full">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-[#64748B] line-clamp-1 w-full mt-0.5">
                      {p.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle Divider Strip */}
            <div className="h-1.5 bg-slate-100 rounded-full w-full" />

            {/* 7. "About The Event" with Read More / Read Less Toggle */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
              <h3 className="text-base font-bold text-[#0F172A] tracking-tight">About The Event</h3>
              <div className="relative text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                <div className={!isDescriptionExpanded ? "line-clamp-4" : ""}>
                  {event.description}
                </div>
                {!isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-xs font-bold text-[#F05537] hover:underline transition-colors block pt-1"
              >
                {isDescriptionExpanded ? "Read Less" : "Read More"}
              </button>
            </div>

            {/* 8. Contactless Ticketing & M-Ticket Info Strip */}
            <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white text-[#0F172A] flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
                  <DeviceMobile size={20} weight="bold" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0F172A] leading-tight">
                    Contactless Ticketing & Fast-track Entry with M-ticket.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsMTicketModalOpen(true)}
                    className="text-[11px] font-bold text-[#F05537] hover:underline mt-0.5 inline-block"
                  >
                    Learn How
                  </button>
                </div>
              </div>
            </div>

            {/* 9. Terms & Conditions Card Button */}
            <button
              type="button"
              onClick={() => setIsTermsModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-between shadow-2xs transition-all active:scale-[0.99] text-left"
            >
              <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                Terms & Conditions
              </span>
              <CaretRight size={16} weight="bold" className="text-slate-400" />
            </button>

            {/* 10. You May Also Like Carousel */}
            <SimilarEventsCarousel
              currentEventId={event.id}
              currentCity={event.city}
              allEvents={allEvents}
            />
          </div>

          {/* Desktop Right Column: Sticky Booking Widget */}
          <div className="hidden lg:block">
            <div className="sticky top-20 p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Admission Passes
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-[#4F46E5]">
                    {selectedTier.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#0F172A]">
                    {selectedTier.price === 0 ? "FREE" : formatINR(selectedTier.price)}
                  </span>
                  {selectedTier.price > 0 && (
                    <span className="text-xs text-slate-500">/ person</span>
                  )}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Ticket Quantity</span>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      disabled={ticketQuantity <= 1}
                      className="p-1 text-slate-600 hover:text-black disabled:opacity-30"
                    >
                      <Minus size={14} weight="bold" />
                    </button>
                    <span className="text-sm font-bold text-[#0F172A] min-w-[16px] text-center">
                      {ticketQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                      disabled={ticketQuantity >= 10}
                      className="p-1 text-slate-600 hover:text-black disabled:opacity-30"
                    >
                      <Plus size={14} weight="bold" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                  <span>Subtotal ({ticketQuantity} pass{ticketQuantity > 1 ? "es" : ""})</span>
                  <span className="font-bold text-[#0F172A]">{formatINR(subtotal)}</span>
                </div>
              </div>

              {/* Book Passes Button */}
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#F05537] hover:bg-[#E04426] text-white text-base font-bold shadow-md shadow-orange-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Ticket size={20} weight="bold" />
                <span>Book Now</span>
              </button>

              {/* Guarantees */}
              <div className="space-y-2 pt-2 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>Instant WhatsApp delivery with HMAC QR</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightning size={16} weight="fill" className="text-[#F05537] shrink-0" />
                  <span>2-Click No-Login UPI Checkout (under 10s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 11. Sticky Mobile Checkout Bar (BookMyShow standard) */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-2xl"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-black text-[#0F172A] block leading-tight">
              {selectedTier.price === 0 ? "FREE" : `${formatINR(selectedTier.price)} onwards`}
            </span>
            <span className={`text-[11px] font-bold block ${isAlmostFull ? "text-[#F97316]" : "text-emerald-600"}`}>
              {isAlmostFull ? "Filling Fast" : "Available"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCheckoutModalOpen(true)}
            className="py-3 px-6 rounded-xl bg-[#F05537] hover:bg-[#E04426] text-white text-sm font-bold shadow-md shadow-orange-500/25 transition-all active:scale-95 shrink-0"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* 12. Interactive Modals */}
      <EventMTicketModal
        isOpen={isMTicketModalOpen}
        onClose={() => setIsMTicketModalOpen(false)}
        eventTitle={event.title}
      />

      <EventTermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        eventTitle={event.title}
        ageLimit={ageLimit}
        customTerms={event.terms_and_conditions}
      />

      <CheckoutModal
        event={event}
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        initialQuantity={ticketQuantity}
        selectedTier={selectedTier}
      />
    </div>
  );
}
