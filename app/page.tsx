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
} from "@phosphor-icons/react";
import EventCard from "@/components/ui/EventCard";
import CategoryCircleRow from "@/components/discovery/CategoryCircleRow";
import { EventItem } from "@/types";

// High-fidelity demo events representing Sasaram & Bihar target verticals
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
      return true;
    });
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#39364F]">
      {/* 1. Eventbrite Full-Bleed Hero Banner */}
      <section className="relative w-full bg-[#1E0A3C] overflow-hidden">
        <div className="relative max-w-[1280px] mx-auto min-h-[360px] sm:min-h-[420px] flex items-center px-4 sm:px-6 py-12">
          {/* Background Stage Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop"
              alt="Concert stage in Bihar"
              fill
              priority
              className="object-cover opacity-35 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E0A3C] via-[#1E0A3C]/85 to-transparent" />
          </div>

          {/* Eventbrite Floating Overlay Card (4px border-radius) */}
          <div className="relative z-10 max-w-lg bg-white/95 backdrop-blur-md rounded-lg p-6 sm:p-8 shadow-2xl border border-white/40">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#F05537] uppercase mb-2">
              <Sparkle size={14} weight="fill" />
              <span>GetMyShow • Sasaram & Rohtas</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E0A3C] tracking-tight leading-tight">
              FROM COACHING SEMINARS TO CULTURAL NIGHTS.
            </h1>

            <p className="mt-2.5 text-sm sm:text-base text-[#6F7287] leading-relaxed">
              Book verified passes in under 10 seconds via UPI. Zero app download, zero password hassle.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="#events"
                className="px-6 py-3 rounded-[360px] border-2 border-[#3659E3] bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-sm font-semibold transition-all shadow-sm active:scale-95"
              >
                Explore Events
              </Link>
              <Link
                href="/organizer/create"
                className="px-6 py-3 rounded-[360px] border border-[#DBDAE3] hover:border-[#39364F] bg-white text-[#39364F] hover:text-[#1E0A3C] text-sm font-semibold transition-all active:scale-95"
              >
                List Your Event (0% Fee)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Eventbrite 80px Circular Category Row */}
      <section className="border-b border-[#DBDAE3] bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <CategoryCircleRow
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => setSelectedCategory(id)}
          />
        </div>
      </section>

      {/* 3. Main Discovery Feed */}
      <main id="events" className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Curated Grid Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
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

          {/* 4-Column Pillow-Soft 40px Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* 4. Why GetMyShow: The Bihar Hyperlocal Superpower Banner */}
        <section className="bg-white rounded-[40px] border border-[#DBDAE3] p-8 sm:p-12 shadow-xs">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 pt-8 border-t border-[#EEEDF2]">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#3659E3]/10 text-[#3659E3] flex items-center justify-center">
                <Lightning size={24} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-[#1E0A3C]">2-Click No-Login UPI</h3>
              <p className="text-xs sm:text-sm text-[#6F7287] leading-relaxed">
                Enter your Name + WhatsApp and pay in 10 seconds with Google Pay or PhonePe. No password to forget.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#F05537]/10 text-[#F05537] flex items-center justify-center">
                <Ticket size={24} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-[#1E0A3C]">35mm Scalloped Passes</h3>
              <p className="text-xs sm:text-sm text-[#6F7287] leading-relaxed">
                Download authentic cinema ticket passes with tamper-proof HMAC cryptographic QR codes and local shop sponsor coupons.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck size={24} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-[#1E0A3C]">0% Cost for Organizers</h3>
              <p className="text-xs sm:text-sm text-[#6F7287] leading-relaxed">
                Pass the platform fee to ticket buyers to host free or paid fests at ₹0 cost. Payouts settled in T+2 business days.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Organizer CTA Section */}
        <section className="bg-[#1E0A3C] rounded-[40px] text-white p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
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
          </div>

          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/organizer/create"
              className="px-6 py-3.5 rounded-[360px] bg-[#F05537] hover:bg-[#d94428] text-white text-sm font-bold text-center transition-all shadow-md active:scale-95"
            >
              Create Free Event
            </Link>
            <Link
              href="/organizer"
              className="px-6 py-3.5 rounded-[360px] bg-white/10 hover:bg-white/20 text-white text-sm font-semibold text-center transition-all active:scale-95 border border-white/20"
            >
              Organizer Dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
