"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkle,
  ShieldCheck,
  Lightning,
  Ticket,
  MapPin,
  ArrowRight,
  QrCode,
  CalendarBlank,
  UsersThree,
  CheckCircle,
  TrendUp,
  Buildings,
  DeviceMobile,
  CurrencyInr,
  Plus,
} from "@phosphor-icons/react";
import EventCard from "@/components/ui/EventCard";
import CategoryCircleRow from "@/components/discovery/CategoryCircleRow";
import EmptyEventsIllustration from "@/components/illustrations/EmptyEventsIllustration";
import OrganizerHostIllustration from "@/components/illustrations/OrganizerHostIllustration";
import { EventItem } from "@/types";

// High-fidelity demo events representing Sasaram & Bihar target verticals with rich stock photography
const DEMO_EVENTS: EventItem[] = [
  {
    id: "1",
    slug: "sasaram-jee-neet-scholarship-seminar-2026",
    title: "Super 50 Talent Scholarship Test & Career Seminar",
    description: "Annual career seminar and scholarship test for Class 10th, 11th & 12th aspirants in Sasaram & Rohtas. Meet ex-IITians & top educators.",
    venue: "Sardar Patel Hall, Gaurakshani, Sasaram",
    city: "Sasaram",
    event_date: "2026-11-15T10:00:00.000Z",
    ticket_price: 100,
    pass_fee_to_buyer: true,
    total_capacity: 500,
    tickets_sold: 382,
    poster_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    organizer_name: "Apex Career Institute Sasaram",
    organizer_whatsapp: "919876543210",
    wallet_pending_settlement: 35526,
    wallet_available: 0,
    wallet_total_withdrawn: 0,
    scanner_pin: "4321",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "rohtas-dandiya-mahotsav-2026",
    title: "Sasaram Grand Dandiya & Cultural Night 2026",
    description: "The biggest Navratri Garba & Dandiya celebration in Rohtas. Live regional singer, DJ sound, food court, and cash prizes for best traditional dress.",
    venue: "Maurya Royal Resort, GT Road, Sasaram",
    city: "Sasaram",
    event_date: "2026-10-31T18:30:00.000Z",
    ticket_price: 500,
    pass_fee_to_buyer: false,
    total_capacity: 800,
    tickets_sold: 694,
    poster_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    organizer_name: "Rohtas Cultural Youth Club",
    organizer_whatsapp: "919876543211",
    wallet_pending_settlement: 322710,
    wallet_available: 0,
    wallet_total_withdrawn: 0,
    scanner_pin: "9988",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "sp-jain-college-annual-cultural-fest-2026",
    title: "SP Jain College Annual Tarang Youth Fest",
    description: "Inter-college youth festival featuring battle of bands, dance competitions, poetry slam, and food stalls. Open to all students.",
    venue: "SP Jain College Auditorium, Sasaram",
    city: "Sasaram",
    event_date: "2026-12-05T11:00:00.000Z",
    ticket_price: 250,
    pass_fee_to_buyer: true,
    total_capacity: 1200,
    tickets_sold: 450,
    poster_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    organizer_name: "Student Welfare Committee",
    organizer_whatsapp: "919876543212",
    wallet_pending_settlement: 104625,
    wallet_available: 0,
    wallet_total_withdrawn: 0,
    scanner_pin: "1234",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    slug: "dehri-on-sone-marathon-2026",
    title: "Rohtas 10K Monsoon Run & Health Marathon",
    description: "Official 10km and 5km road race along the scenic Sone river bank. Finisher medal, dry-fit t-shirt, breakfast, and timing bib included.",
    venue: "Sone Riverfront Promenade, Dehri-on-Sone",
    city: "Dehri-on-Sone",
    event_date: "2026-11-29T06:00:00.000Z",
    ticket_price: 350,
    pass_fee_to_buyer: true,
    total_capacity: 600,
    tickets_sold: 512,
    poster_url: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800&auto=format&fit=crop",
    organizer_name: "Rohtas Runners Association",
    organizer_whatsapp: "919876543213",
    wallet_pending_settlement: 166656,
    wallet_available: 0,
    wallet_total_withdrawn: 0,
    scanner_pin: "5678",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    slug: "bhojpuri-kavi-sammelan-sasaram-2026",
    title: "All-Bihar Bhojpuri Sahitya & Hasya Kavi Sammelan",
    description: "An evening of humorous Bhojpuri poetry and classical recitation by renowned state poets. Family seating and refreshment coupon included.",
    venue: "Town Hall Auditorium, Post Office Chowk, Sasaram",
    city: "Sasaram",
    event_date: "2026-11-22T17:00:00.000Z",
    ticket_price: 150,
    pass_fee_to_buyer: true,
    total_capacity: 400,
    tickets_sold: 210,
    poster_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    organizer_name: "Sasaram Kala & Sanskriti Parishad",
    organizer_whatsapp: "919876543214",
    wallet_pending_settlement: 29300,
    wallet_available: 0,
    wallet_total_withdrawn: 0,
    scanner_pin: "2468",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    slug: "rohtas-startup-pitch-fest-2026",
    title: "Bihar Tier-2/3 Student Entrepreneurship Pitch Fest",
    description: "Showcase your technology or local business idea to angel investors from Patna and Delhi. 10 Lakhs seed grant prize pool.",
    venue: "Hotel Maurya Royal Conference Hall, Sasaram",
    city: "Sasaram",
    event_date: "2026-12-12T09:30:00.000Z",
    ticket_price: 200,
    pass_fee_to_buyer: true,
    total_capacity: 300,
    tickets_sold: 140,
    poster_url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    organizer_name: "Rohtas Tech Incubator",
    organizer_whatsapp: "919876543215",
    wallet_pending_settlement: 26040,
    wallet_available: 0,
    wallet_total_withdrawn: 0,
    scanner_pin: "1357",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Rich city discovery cards for Bihar
const BIHAR_REGIONAL_CITIES = [
  {
    name: "Sasaram",
    tagline: "Historic Rohtas Capital",
    imageUrl: "https://images.unsplash.com/photo-1590053303498-356b57953ea6?auto=format&fit=crop&w=600&q=80",
    eventsCount: 14,
  },
  {
    name: "Patna",
    tagline: "State Cultural Hub",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    eventsCount: 28,
  },
  {
    name: "Gaya",
    tagline: "International Heritage & Arts",
    imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80",
    eventsCount: 19,
  },
  {
    name: "Dehri-on-Sone",
    tagline: "Sone Riverfront Festivals",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    eventsCount: 8,
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const filteredEvents = useMemo(() => {
    if (!selectedCategory) return DEMO_EVENTS;
    return DEMO_EVENTS.filter((e) => {
      if (selectedCategory === "coaching") return e.slug.includes("scholarship") || e.slug.includes("seminar");
      if (selectedCategory === "dandiya") return e.slug.includes("dandiya");
      if (selectedCategory === "college") return e.slug.includes("college") || e.slug.includes("fest");
      if (selectedCategory === "sports") return e.slug.includes("marathon");
      if (selectedCategory === "standup") return e.slug.includes("kavi");
      if (selectedCategory === "workshops") return e.slug.includes("startup") || e.slug.includes("pitch");
      return true;
    });
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#39364F]">
      {/* 1. Eventbrite Full-Bleed Hero Banner with Rich Stock Image */}
      <section className="relative w-full bg-[#1E0A3C] overflow-hidden">
        <div className="relative max-w-[1340px] mx-auto min-h-[420px] sm:min-h-[460px] flex items-center px-4 sm:px-6 py-12">
          {/* Background Stage Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop"
              alt="Live event celebration and crowd"
              fill
              priority
              className="object-cover opacity-40 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E0A3C] via-[#1E0A3C]/80 to-transparent" />
          </div>

          {/* Eventbrite Floating Overlay Card (Rectangular with 12px Curved Radius) */}
          <div className="relative z-10 max-w-lg bg-white/95 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-2xl border border-white/40">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#F05537] uppercase mb-2">
              <Sparkle size={14} weight="fill" />
              <span>GetMyShow • Bihar Event Box-Office</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E0A3C] tracking-tight leading-tight">
              From Coaching Seminars to Cultural Nights.
            </h1>

            <p className="mt-2.5 text-sm sm:text-base text-[#6F7287] leading-relaxed">
              Book verified passes in under 10 seconds via Google Pay & PhonePe UPI. Zero app download, zero password hassle.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="#events"
                className="px-6 py-3 rounded-lg bg-[#F05537] hover:bg-[#D94428] text-white text-sm font-bold transition-all shadow-xs active:scale-95 flex items-center gap-2"
              >
                <Ticket size={16} weight="bold" />
                <span>Explore Events</span>
              </Link>
              <Link
                href="/organizer/create"
                className="px-6 py-3 rounded-lg border border-[#DBDAE3] hover:border-[#1E0A3C] bg-white text-[#1E0A3C] hover:bg-[#F8F7FA] text-sm font-semibold transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus size={16} weight="bold" />
                <span>List Event (0% Fee)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Eventbrite Rectangular Visual Category Cards Grid */}
      <section className="border-b border-[#DBDAE3] bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
          <CategoryCircleRow
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => setSelectedCategory(id)}
          />
        </div>
      </section>

      {/* 3. Main Discovery Feed */}
      <main id="events" className="max-w-[1340px] mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Curated Grid Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-bold text-[#3659E3] uppercase tracking-wider">
                {selectedCategory ? `Filtered by ${selectedCategory}` : "Discover in Sasaram & Rohtas"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E0A3C] tracking-tight mt-0.5">
                Popular Events Near You
              </h2>
            </div>

            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className="text-xs font-bold text-[#F05537] hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* 4-Column Modern Eventbrite 16px Cards Grid or Empty State with unDraw Illustration */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#DBDAE3] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
              <EmptyEventsIllustration className="w-56 h-40 sm:w-64 sm:h-48" />
              <div className="max-w-md space-y-1">
                <h3 className="text-lg font-bold text-[#1E0A3C]">No events found in this category</h3>
                <p className="text-sm text-[#6F7287]">
                  There are no scheduled events matching your filter right now. Explore other categories or create your own event!
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("")}
                  className="px-5 py-2.5 rounded-lg bg-[#3659E3] hover:bg-[#2B47B8] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Show All Events
                </button>
                <Link
                  href="/organizer/create"
                  className="px-5 py-2.5 rounded-lg border border-[#DBDAE3] hover:border-[#1E0A3C] bg-white text-[#1E0A3C] text-xs font-bold transition-all"
                >
                  Host an Event
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 4. Explore Cities in Bihar (Rich Photographic Cards) */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-bold text-[#3659E3] uppercase tracking-wider">
              Regional Box-Office
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E0A3C] tracking-tight mt-0.5">
              Explore Events by City
            </h2>
            <p className="text-sm text-[#6F7287] mt-1">
              Connect with college fests, coaching seminars, and celebrations across Bihar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BIHAR_REGIONAL_CITIES.map((city) => (
              <Link
                key={city.name}
                href={`/?city=${encodeURIComponent(city.name)}#events`}
                className="group relative h-48 rounded-xl overflow-hidden border border-[#DBDAE3] shadow-xs hover:border-[#1E0A3C] hover:shadow-md transition-all block"
              >
                <Image
                  src={city.imageUrl}
                  alt={city.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E0A3C]/90 via-[#1E0A3C]/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-lg font-bold leading-tight">{city.name}</div>
                  <div className="text-xs text-white/80 mt-0.5">{city.tagline}</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#F97316]">
                    <span>{city.eventsCount} upcoming events</span>
                    <ArrowRight size={12} weight="bold" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 5. Why GetMyShow: The Bihar Hyperlocal Superpower Banner with Custom Vector Art */}
        <section className="bg-white rounded-2xl border border-[#DBDAE3] p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-extrabold text-[#F05537] uppercase tracking-widest">
              The Hyperlocal Ticketing Revolution
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E0A3C] tracking-tight mt-1">
              Why Tier-2 & Tier-3 Bihar Chooses GetMyShow
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6F7287]">
              We stripped away corporate 80MB app downloads, 15% commissions, and mandatory account creation to build the fastest box-office platform in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#EEEDF2]">
            <div className="space-y-3 bg-[#F8F7FA] p-5 rounded-xl border border-[#DBDAE3]/80">
              <div className="w-10 h-10 rounded-lg bg-[#3659E3]/10 text-[#3659E3] flex items-center justify-center">
                <Lightning size={22} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-[#1E0A3C]">2-Click No-Login UPI</h3>
              <p className="text-xs sm:text-sm text-[#6F7287] leading-relaxed">
                Enter your Name + WhatsApp and pay in 10 seconds with Google Pay or PhonePe. No password to forget.
              </p>
            </div>

            <div className="space-y-3 bg-[#F8F7FA] p-5 rounded-xl border border-[#DBDAE3]/80">
              <div className="w-10 h-10 rounded-lg bg-[#F05537]/10 text-[#F05537] flex items-center justify-center">
                <Ticket size={22} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-[#1E0A3C]">35mm Scalloped Passes</h3>
              <p className="text-xs sm:text-sm text-[#6F7287] leading-relaxed">
                Download authentic cinema ticket passes with tamper-proof HMAC cryptographic QR codes and local shop sponsor coupons.
              </p>
            </div>

            <div className="space-y-3 bg-[#F8F7FA] p-5 rounded-xl border border-[#DBDAE3]/80">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck size={22} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-[#1E0A3C]">0% Cost for Organizers</h3>
              <p className="text-xs sm:text-sm text-[#6F7287] leading-relaxed">
                Pass the platform fee to ticket buyers to host free or paid fests at ₹0 cost. Payouts settled in T+2 business days.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Organizer CTA Section (Rectangular 16px Radius with Custom Vector Art) */}
        <section className="bg-[#1E0A3C] rounded-2xl text-white p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkle size={14} weight="fill" />
              For Coaches, Colleges & Clubs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Host Your Next Event in Sasaram in 60 Seconds
            </h2>
            <p className="text-sm text-[#DBDAE3] leading-relaxed">
              Launch your seminar or fest, accept UPI payments, issue instant digital passes, and scan attendees at the gate with your phone.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <Link
                href="/organizer/create"
                className="px-6 py-3.5 rounded-lg bg-[#F05537] hover:bg-[#D94428] text-white text-sm font-bold text-center transition-all shadow-md active:scale-95"
              >
                Create Free Event
              </Link>
              <Link
                href="/organizer"
                className="px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold text-center transition-all active:scale-95 border border-white/20"
              >
                Organizer Dashboard
              </Link>
            </div>
          </div>

          <div className="relative z-10 hidden sm:flex shrink-0 items-center justify-center">
            <OrganizerHostIllustration className="w-64 h-48 sm:w-72 sm:h-52" />
          </div>
        </section>
      </main>
    </div>
  );
}
