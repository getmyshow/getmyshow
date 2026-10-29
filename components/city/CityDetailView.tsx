"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  CalendarBlank,
  Ticket,
  Plus,
  Sparkle,
  ArrowRight,
  CaretRight,
  ShieldCheck,
  Lightning,
  Buildings,
} from "@phosphor-icons/react";
import EventCard from "@/components/ui/EventCard";
import EmptyEventsIllustration from "@/components/illustrations/EmptyEventsIllustration";
import { getEvents } from "@/actions/events";
import { EventItem } from "@/types";
import { getSubdomainUrl } from "@/lib/domains";

interface CityMeta {
  name: string;
  region: string;
  tagline: string;
  description: string;
  imageUrl: string;
}

const CITY_METADATA: Record<string, CityMeta> = {
  sasaram: {
    name: "Sasaram",
    region: "Rohtas Headquarters",
    tagline: "Historic Rohtas Capital & Educational Center",
    description: "Hub for top coaching institutes, medical/engineering scholarship seminars, cultural Dandiya fests, and youth summits in South-West Bihar.",
    imageUrl: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80",
  },
  patna: {
    name: "Patna",
    region: "State Capital",
    tagline: "State Cultural & Startup Epicenter",
    description: "Capital city gatherings, university cultural fests, live acoustic concerts, standup comedy tours, and statewide educational seminars.",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
  },
  gaya: {
    name: "Gaya",
    region: "Magadh Region",
    tagline: "International Heritage & Arts Destination",
    description: "International spiritual festivals, classical music baithaks, heritage exhibitions, and collegiate sports fests in ancient Magadh.",
    imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
  },
  "dehri-on-sone": {
    name: "Dehri-on-Sone",
    region: "Rohtas Industrial Belt",
    tagline: "Sone Riverfront Festivals & Technical Summits",
    description: "Technical college fests, riverfront cultural nights, talent hunts, and coaching workshops along the historic Grand Trunk Road.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  bhabua: {
    name: "Bhabua",
    region: "Kaimur District",
    tagline: "Scenic Kaimur Hills & Cultural Melas",
    description: "District sports marathons, eco-tourism summits, student competitions, and local melas in the scenic Kaimur region.",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
  },
  ara: {
    name: "Ara",
    region: "Bhojpur Region",
    tagline: "Bhojpur Heritage & Collegiate Celebrations",
    description: "Folk music celebrations, university youth fests, debate competitions, and regional theatre in the heart of Bhojpur.",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  },
  aurangabad: {
    name: "Aurangabad",
    region: "South Bihar",
    tagline: "Historic Temple Melas & Educational Hubs",
    description: "Surya Mahotsav celebrations, coaching talent tests, food melas, and cultural evenings in South Bihar.",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
  },
};

const CATEGORY_CHIPS = [
  { id: "all", label: "All Categories" },
  { id: "coaching", label: "Seminars" },
  { id: "music", label: "Concerts" },
  { id: "dandiya", label: "Cultural" },
  { id: "college", label: "College Fests" },
  { id: "sports", label: "Sports" },
  { id: "standup", label: "Comedy" },
  { id: "workshops", label: "Workshops" },
];

export default function CityDetailView({ citySlug }: { citySlug: string }) {
  const normalizedSlug = (citySlug || "sasaram").toLowerCase();
  const cityInfo = CITY_METADATA[normalizedSlug] || {
    name: normalizedSlug.charAt(0).toUpperCase() + normalizedSlug.slice(1).replace(/-/g, " "),
    region: "Bihar Region",
    tagline: "Upcoming Events & Celebrations",
    description: "Discover verified coaching seminars, college fests, cultural nights, and concerts in " + normalizedSlug + ".",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  };

  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow" | "weekend">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getEvents().then((res) => {
      if (mounted && res.success && res.data) {
        setEvents(res.data);
      }
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Filter events matching this city
  const cityEvents = useMemo(() => {
    const cityNameLower = cityInfo.name.toLowerCase();
    const citySlugClean = normalizedSlug.replace(/-/g, " ");

    let list = events.filter((e) => {
      const evCity = (e.city || "").toLowerCase();
      const evVenue = (e.venue || "").toLowerCase();
      return (
        evCity.includes(cityNameLower) ||
        cityNameLower.includes(evCity) ||
        evCity.includes(citySlugClean) ||
        evVenue.includes(cityNameLower)
      );
    });

    // Date filtering
    if (dateFilter !== "all") {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().slice(0, 10);

      list = list.filter((e) => {
        const evDate = new Date(e.event_date);
        const evDateStr = evDate.toISOString().slice(0, 10);
        if (dateFilter === "today") return evDateStr === todayStr;
        if (dateFilter === "tomorrow") return evDateStr === tomorrowStr;
        if (dateFilter === "weekend") {
          const day = evDate.getDay();
          return day === 5 || day === 6 || day === 0;
        }
        return true;
      });
    }

    // Category filtering
    if (selectedCategory !== "all") {
      list = list.filter((e) => {
        const slug = (e.slug || "").toLowerCase();
        const title = (e.title || "").toLowerCase();
        if (selectedCategory === "coaching") return slug.includes("scholarship") || slug.includes("seminar") || title.includes("seminar");
        if (selectedCategory === "music") return slug.includes("concert") || title.includes("concert") || title.includes("music") || slug.includes("dandiya");
        if (selectedCategory === "dandiya") return slug.includes("dandiya") || title.includes("cultural") || title.includes("garba");
        if (selectedCategory === "college") return slug.includes("college") || slug.includes("fest") || title.includes("fest");
        if (selectedCategory === "sports") return slug.includes("marathon") || title.includes("marathon") || title.includes("run");
        if (selectedCategory === "standup") return slug.includes("kavi") || title.includes("comedy") || title.includes("poetry");
        if (selectedCategory === "workshops") return slug.includes("startup") || slug.includes("pitch");
        return true;
      });
    }

    return list;
  }, [events, cityInfo.name, normalizedSlug, dateFilter, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#39364F]">
      {/* 1. Breadcrumbs */}
      <div className="border-b border-[#DBDAE3] bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-[#6F7287]">
            <Link href="/" className="hover:text-[#1E0A3C] transition">
              Home
            </Link>
            <CaretRight size={12} />
            <Link href="/#events" className="hover:text-[#1E0A3C] transition">
              Bihar Cities
            </Link>
            <CaretRight size={12} />
            <span className="font-bold text-[#1E0A3C]">{cityInfo.name}</span>
          </nav>
        </div>
      </div>

      {/* 2. City Visual Hero Banner */}
      <section className="relative w-full bg-[#1E0A3C] text-white overflow-hidden">
        {/* Photographic Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={cityInfo.imageUrl}
            alt={cityInfo.name}
            fill
            priority
            className="object-cover filter brightness-40 md:brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#1E0A3C] via-[#1E0A3C]/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#F97316] text-white shadow-xs inline-flex items-center gap-1">
                <MapPin size={13} weight="fill" />
                <span>{cityInfo.region}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                {cityEvents.length} Event{cityEvents.length !== 1 ? "s" : ""} Available
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Events in {cityInfo.name}
            </h1>

            <p className="text-sm sm:text-base text-[#DBDAE3] leading-relaxed drop-shadow-xs">
              {cityInfo.description}
            </p>

            {/* Quick Action CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={getSubdomainUrl("org", "/create")}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <Plus size={16} weight="bold" />
                <span>Host Event in {cityInfo.name}</span>
              </Link>

              <a
                href="#city-events"
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all border border-white/20"
              >
                <span>Browse Passes Below</span>
                <ArrowRight size={14} weight="bold" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. City Events Main Discovery Container */}
      <main id="city-events" className="max-w-[1340px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Filter Toolbar: Categories + Date Quick Chips */}
        <div className="bg-white rounded-2xl border border-[#DBDAE3] p-4 sm:p-5 shadow-xs space-y-4">
          {/* Row 1: Category Pills */}
          <div>
            <div className="text-[11px] font-bold text-[#6F7287] uppercase tracking-wider mb-2">
              Filter by Event Type
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
              {CATEGORY_CHIPS.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 snap-start active:scale-95 ${
                      isActive
                        ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs"
                        : "bg-[#F8F7FA] text-[#39364F] border-[#DBDAE3] hover:border-slate-400"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[#EEEDF2]" />

          {/* Row 2: Date Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x">
              {(
                [
                  { id: "all", label: "All Dates" },
                  { id: "today", label: "Today" },
                  { id: "tomorrow", label: "Tomorrow" },
                  { id: "weekend", label: "This Weekend" },
                ] as const
              ).map((chip) => {
                const isActive = dateFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setDateFilter(chip.id)}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 snap-start active:scale-95 ${
                      isActive
                        ? "bg-[#1E0A3C] text-white border-[#1E0A3C] shadow-xs"
                        : "bg-white text-[#39364F] border-[#DBDAE3] hover:border-[#1E0A3C]/40"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}

              {(selectedCategory !== "all" || dateFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setDateFilter("all");
                  }}
                  className="text-xs font-bold text-[#4F46E5] hover:underline whitespace-nowrap ml-2 shrink-0"
                >
                  Reset Filters
                </button>
              )}
            </div>

            <div className="text-xs text-[#6F7287] font-semibold">
              Showing <strong>{cityEvents.length}</strong> event{cityEvents.length !== 1 ? "s" : ""} in {cityInfo.name}
            </div>
          </div>
        </div>

        {/* 4. Events Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-white border border-slate-200 p-4 animate-pulse space-y-3">
                  <div className="h-44 bg-slate-200 rounded-lg" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : cityEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {cityEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#DBDAE3] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
              <EmptyEventsIllustration className="w-56 h-40 sm:w-64 sm:h-48" />
              <div className="max-w-md space-y-1">
                <h3 className="text-lg font-bold text-[#1E0A3C]">
                  No upcoming events in {cityInfo.name} right now
                </h3>
                <p className="text-sm text-[#6F7287]">
                  Be the first organizer or college club to host a seminar, fest, or concert in {cityInfo.name} with 0% commission!
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={getSubdomainUrl("org", "/create")}
                  className="px-5 py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Host an Event in {cityInfo.name}
                </Link>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-lg border border-[#DBDAE3] hover:border-[#1E0A3C] bg-white text-[#1E0A3C] text-xs font-bold transition-all"
                >
                  Browse All Bihar Events
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 5. Hyperlocal Organizer Box-Office Guarantee */}
        <section className="bg-white rounded-2xl border border-[#DBDAE3] p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">
              Local Box-Office Support
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#1E0A3C] tracking-tight">
              Are you an event organizer, coaching teacher, or college club in {cityInfo.name}?
            </h3>
            <p className="text-xs sm:text-sm text-[#6F7287] leading-relaxed">
              GetMyShow offers ₹0 listing fees, instant T+2 settled bank payouts, mobile phone camera gate scanning, and student cash promoter desks for all events in {cityInfo.name}.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={getSubdomainUrl("org", "/create")}
              className="px-5 py-2.5 rounded-lg bg-[#1E0A3C] hover:bg-black text-white text-xs font-bold transition"
            >
              List Event (Free)
            </Link>
            <Link
              href={getSubdomainUrl("org")}
              className="px-5 py-2.5 rounded-lg border border-[#DBDAE3] hover:border-slate-400 text-[#1E0A3C] text-xs font-bold transition"
            >
              Open Organizer Studio
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
