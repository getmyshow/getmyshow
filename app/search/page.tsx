"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MagnifyingGlass,
  X,
  MapPin,
  CalendarBlank,
  Tag,
  Sparkle,
  ArrowLeft,
  Funnel,
  Ticket,
} from "@phosphor-icons/react";
import EventCard from "@/components/ui/EventCard";
import EmptyEventsIllustration from "@/components/illustrations/EmptyEventsIllustration";
import { getEvents } from "@/actions/events";
import { EventItem } from "@/types";
import { BIHAR_CITIES, getUserStoredCity } from "@/lib/geo";

// High-fidelity fallback events representing Sasaram & Bihar
const FALLBACK_EVENTS: EventItem[] = [
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
];

const SEARCH_CATEGORIES = [
  { id: "all", label: "All Events" },
  { id: "coaching", label: "Seminars & Tests" },
  { id: "music", label: "Concerts & Music" },
  { id: "dandiya", label: "Cultural & Dandiya" },
  { id: "college", label: "College Fests" },
  { id: "sports", label: "Sports & Runs" },
  { id: "standup", label: "Comedy & Poetry" },
];

const POPULAR_SEARCH_PROMPTS = [
  "Scholarship Test",
  "Dandiya Night",
  "College Fest",
  "Dehri Marathon",
  "Coding Workshop",
  "Sasaram Concert",
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialCity = searchParams.get("city") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [allEvents, setAllEvents] = useState<EventItem[]>(FALLBACK_EVENTS);
  const [isLoading, setIsLoading] = useState(true);

  // Load live events from Supabase backend
  useEffect(() => {
    let mounted = true;
    getEvents().then((res) => {
      if (mounted) {
        if (res.success && res.data && res.data.length > 0) {
          setAllEvents(res.data);
        }
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Sync state to URL params cleanly
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedCity) params.set("city", selectedCity);

    const queryString = params.toString();
    const newUrl = queryString ? `/search?${queryString}` : "/search";
    window.history.replaceState(null, "", newUrl);
  }, [query, selectedCategory, selectedCity]);

  // Real-time multi-dimensional filter
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      // 1. Text Query Search
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesDesc = (ev.description || "").toLowerCase().includes(q);
        const matchesVenue = ev.venue.toLowerCase().includes(q);
        const matchesCity = ev.city.toLowerCase().includes(q);
        const matchesOrganizer = (ev.organizer_name || "").toLowerCase().includes(q);

        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesCity && !matchesOrganizer) {
          return false;
        }
      }

      // 2. City Filter
      if (selectedCity && selectedCity !== "all") {
        if (!ev.city.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }
      }

      // 3. Category Filter
      if (selectedCategory && selectedCategory !== "all") {
        const slug = (ev.slug || "").toLowerCase();
        const title = (ev.title || "").toLowerCase();

        if (selectedCategory === "coaching") {
          if (!slug.includes("scholarship") && !slug.includes("seminar") && !title.includes("seminar") && !title.includes("test")) return false;
        } else if (selectedCategory === "music") {
          if (!slug.includes("concert") && !title.includes("concert") && !title.includes("music") && !slug.includes("dandiya")) return false;
        } else if (selectedCategory === "dandiya") {
          if (!slug.includes("dandiya") && !title.includes("cultural") && !title.includes("garba")) return false;
        } else if (selectedCategory === "college") {
          if (!slug.includes("college") && !slug.includes("fest") && !title.includes("fest")) return false;
        } else if (selectedCategory === "sports") {
          if (!slug.includes("marathon") && !title.includes("marathon") && !title.includes("run")) return false;
        } else if (selectedCategory === "standup") {
          if (!slug.includes("kavi") && !title.includes("comedy") && !title.includes("poetry")) return false;
        }
      }

      return true;
    });
  }, [allEvents, query, selectedCategory, selectedCity]);

  const handleClearFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedCity("");
  };

  return (
    <div className="min-h-screen bg-[#F8F7FA] pb-24">
      {/* Sticky Search Header Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Top Row: Back button + Large Search Input */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="p-2 -ml-1 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-full transition-colors shrink-0"
              aria-label="Back to home"
            >
              <ArrowLeft size={20} weight="bold" />
            </Link>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                <MagnifyingGlass size={18} weight="bold" />
              </div>
              <input
                type="text"
                value={query}
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, seminars, concerts, venues..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#F1F5F9] border border-transparent focus:border-[#4F46E5] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/15 rounded-full text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all shadow-inner"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A]"
                  aria-label="Clear search input"
                >
                  <X size={16} weight="bold" />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Scroll Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
            {SEARCH_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-[#4F46E5] text-white shadow-xs font-bold"
                      : "bg-[#F1F5F9] text-[#475569] hover:bg-slate-200/80 hover:text-[#0F172A]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Cities Filter Chips Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => setSelectedCity("")}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                !selectedCity
                  ? "bg-[#0F172A] text-white font-bold"
                  : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
              }`}
            >
              <MapPin size={12} weight={!selectedCity ? "fill" : "regular"} />
              <span>All Bihar</span>
            </button>

            {BIHAR_CITIES.map((c) => {
              const isSelected = selectedCity.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setSelectedCity(isSelected ? "" : c.name)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    isSelected
                      ? "bg-[#0F172A] text-white font-bold"
                      : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
                  }`}
                >
                  <MapPin size={12} weight={isSelected ? "fill" : "regular"} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Active Search Context */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-[#64748B] font-medium">
            {query || selectedCategory !== "all" || selectedCity ? (
              <span>
                Found <strong className="text-[#0F172A] font-bold">{filteredEvents.length}</strong> events
                {query && <> matching &ldquo;<span className="text-[#4F46E5] font-semibold">{query}</span>&rdquo;</>}
                {selectedCity && <> in <span className="text-[#0F172A] font-semibold">{selectedCity}</span></>}
              </span>
            ) : (
              <span>Showing all upcoming verified events in Bihar</span>
            )}
          </div>

          {(query || selectedCategory !== "all" || selectedCity) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-[#4F46E5] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Popular Search Suggestions (when search query is blank) */}
        {!query && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] mb-2.5">
              <Sparkle size={15} weight="fill" className="text-[#F97316]" />
              <span>Popular Searches in Bihar</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCH_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setQuery(prompt)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-[#4F46E5] text-xs font-medium text-[#475569] border border-slate-200 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
            <EmptyEventsIllustration className="w-24 h-24 mx-auto mb-4 opacity-75" />
            <h3 className="text-base font-bold text-[#0F172A]">No matching events found</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any events matching your criteria. Try adjusting your search or clear filters to see all available events.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#4338CA] transition-colors"
            >
              View All Events
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F7FA] flex items-center justify-center p-8 text-xs text-slate-400">Loading events...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
