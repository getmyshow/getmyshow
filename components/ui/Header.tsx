"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";
import {
  MagnifyingGlass,
  MapPin,
  CaretDown,
  List,
  X,
  Ticket,
  Plus,
  Buildings,
  UserCheck,
  ArrowRight,
  Sparkle,
} from "@phosphor-icons/react";
import { getEvents } from "@/actions/events";
import { EventItem } from "@/types";
import { formatINR } from "@/lib/utils";
import { getSubdomainUrl } from "@/lib/domains";

const BIHAR_CITIES = [
  { name: "Sasaram", region: "Rohtas (HQ)", isPrimary: true },
  { name: "Dehri-on-Sone", region: "Rohtas", isPrimary: false },
  { name: "Patna", region: "Capital", isPrimary: false },
  { name: "Gaya", region: "Magadh", isPrimary: false },
  { name: "Bhabua", region: "Kaimur", isPrimary: false },
  { name: "Ara", region: "Bhojpur", isPrimary: false },
  { name: "Aurangabad", region: "Bihar", isPrimary: false },
];

const DISCOVERY_CATEGORIES = [
  { id: "all", label: "For You" },
  { id: "coaching", label: "Seminars" },
  { id: "music", label: "Concerts" },
  { id: "dandiya", label: "Cultural" },
  { id: "college", label: "College Fests" },
  { id: "standup", label: "Comedy" },
  { id: "sports", label: "Sports" },
];

function HeaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Sasaram");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load events for predictive autocomplete search
  useEffect(() => {
    let mounted = true;
    getEvents().then((res) => {
      if (mounted && res.success && res.data) {
        setAllEvents(res.data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const matchingEvents = searchQuery.trim().length >= 1
    ? allEvents
        .filter((e) => {
          const q = searchQuery.toLowerCase();
          return (
            e.title.toLowerCase().includes(q) ||
            (e.description && e.description.toLowerCase().includes(q)) ||
            e.venue.toLowerCase().includes(q) ||
            e.city.toLowerCase().includes(q)
          );
        })
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}#events`);
    } else {
      router.push("/#events");
    }
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
    router.push(`/?city=${encodeURIComponent(city)}#events`);
  };

  const handleCategoryClick = (catId: string) => {
    if (catId === "all") {
      router.push("/#events");
    } else {
      router.push(`/?category=${encodeURIComponent(catId)}#events`);
    }
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-3 lg:gap-5">
      {/* 1. Left Section: Prominent Brand Logo + District-Style Hyperlocal City Selector */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#39364F] hover:bg-[#F8F7FA] transition-colors border border-transparent hover:border-[#DBDAE3]"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>

        {/* Brand Logo (Enlarged & Prominent) */}
        <Link href="/" className="flex items-center group transition-transform active:scale-98 shrink-0">
          <Image
            src="/brand/logos/wordmark-tilted-black-text.svg"
            alt="GetMyShow — Hyperlocal Bihar Event Ticketing"
            width={260}
            height={70}
            priority
            className="h-10 sm:h-11 md:h-12 lg:h-[48px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* District-Style Subtle Vertical Divider */}
        <div className="hidden sm:block h-7 w-[1.5px] bg-slate-200 mx-1 lg:mx-2 shrink-0" />

        {/* District-Style Hyperlocal Location Selector */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/70 transition-colors text-left group"
            aria-label="Select location"
          >
            <div className="w-8 h-8 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5] shrink-0 group-hover:bg-[#4F46E5]/20 transition-colors">
              <MapPin size={18} weight="fill" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-bold text-[#0F172A] tracking-tight">{selectedCity}</span>
                <CaretDown size={12} weight="bold" className="text-[#64748B] group-hover:text-[#0F172A] transition-colors" />
              </div>
              <span className="text-[11px] text-[#64748B] font-medium leading-none block mt-0.5">
                {selectedCity === "Sasaram" ? "Rohtas, Bihar" : "Bihar"}
              </span>
            </div>
          </button>

          {/* City Dropdown Menu */}
          {isCityDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsCityDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  Select Your City in Bihar
                </div>
                <div className="space-y-0.5">
                  {BIHAR_CITIES.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleSelectCity(c.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedCity === c.name
                          ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                          : "text-[#39364F] hover:bg-slate-50 hover:text-[#0F172A]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={14} weight={selectedCity === c.name ? "fill" : "regular"} className={selectedCity === c.name ? "text-[#4F46E5]" : "text-slate-400"} />
                        <span>{c.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">{c.region}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Center Section: District-Style Category Navigation Rhythm */}
      <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto no-scrollbar py-1">
        {DISCOVERY_CATEGORIES.map((cat) => {
          const isSelected =
            activeCategory === cat.id || (cat.id === "all" && !searchParams.get("category"));
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? "bg-[#4F46E5]/10 text-[#4F46E5] font-bold shadow-2xs"
                  : "text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 font-semibold"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </nav>

      {/* 3. Right Section: Compact Search + My Tickets + Host CTA + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Compact Predictive Search Bar (BookMyShow Standard) */}
        <div ref={searchContainerRef} className="relative">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-[#F8F7FA] hover:bg-slate-100/90 focus-within:bg-white focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/15 border border-[#E2E8F0] rounded-full h-9 px-3 w-36 sm:w-48 xl:w-60 transition-all duration-200"
          >
            <MagnifyingGlass size={15} weight="bold" className="text-[#64748B] shrink-0 mr-1.5" />
            <input
              type="text"
              placeholder="Search events, artists..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              className="w-full bg-transparent text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchFocused(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={12} weight="bold" />
              </button>
            )}
          </form>

          {/* Floating Predictive Search Dropdown with Poster Thumbnails */}
          {isSearchFocused && searchQuery.trim().length >= 1 && (
            <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                <span>Matching Events</span>
                <span className="text-[#4F46E5]">{matchingEvents.length} found</span>
              </div>

              {matchingEvents.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#64748B] space-y-1">
                  <p>No direct matches for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-[11px] text-slate-400">Press Enter to run a global search</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto no-scrollbar">
                  {matchingEvents.map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/e/${ev.slug}`}
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="relative w-11 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {ev.poster_url ? (
                          <img
                            src={ev.poster_url}
                            alt={ev.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Ticket size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-[#4F46E5] uppercase">
                            {ev.city}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#4F46E5] transition-colors mt-0.5">
                          {ev.title}
                        </h4>
                        <p className="text-[10px] text-[#64748B] truncate">{ev.venue}</p>
                        <span className="text-[11px] font-bold text-[#0F172A] font-mono block mt-0.5">
                          {formatINR(ev.ticket_price)}
                        </span>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-slate-300 group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    </Link>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full mt-2 py-2 text-center text-xs font-bold text-[#4F46E5] bg-indigo-50/60 hover:bg-indigo-50 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          )}
        </div>

        {/* Universal "My Tickets" Vault Link */}
        <Link
          href="/my-tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#4F46E5] transition-colors px-2.5 py-1.5 rounded-full hover:bg-indigo-50/60 shrink-0"
        >
          <Ticket size={16} weight="duotone" className="text-[#4F46E5]" />
          <span className="hidden xl:inline">My Tickets</span>
        </Link>

        {/* Host Event Primary Button */}
        <Link
          href={getSubdomainUrl("org", "/create")}
          className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-2 rounded-full bg-[#F05537] hover:bg-[#D94428] text-white text-xs font-bold transition-all shadow-xs active:scale-95 shrink-0"
        >
          <Plus size={14} weight="bold" />
          <span>Host</span>
        </Link>

        {/* Clerk Universal Auth Suite */}
        <Suspense fallback={<div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />}>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-300 hover:border-slate-800 text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition-all bg-white shadow-2xs"
              >
                <UserCheck size={14} weight="bold" className="text-[#4F46E5]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center gap-2">
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Booked Passes"
                    labelIcon={<Ticket size={16} weight="duotone" />}
                    href="/my-tickets"
                  />
                  <UserButton.Link
                    label="Organizer Dashboard"
                    labelIcon={<Buildings size={16} weight="duotone" />}
                    href={getSubdomainUrl("org")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </Show>
        </Suspense>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 right-0 border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl z-50">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-[#F8F7FA] border border-[#DBDAE3] rounded-full px-3.5 py-2">
            <MagnifyingGlass size={17} weight="bold" className="text-[#64748B]" />
            <input
              type="text"
              placeholder="Search events in Bihar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-[#0F172A] outline-none font-medium"
            />
            <button type="submit" className="h-7 px-3 rounded-full bg-[#F05537] text-white flex items-center justify-center text-xs font-bold shrink-0">
              Go
            </button>
          </form>

          {/* Quick Categories for Mobile */}
          <div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Explore Categories
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DISCOVERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    handleCategoryClick(cat.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    activeCategory === cat.id
                      ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                      : "bg-[#F8F7FA] text-[#39364F] border-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          {/* City Selector */}
          <div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Popular Cities in Bihar
            </div>
            <div className="flex flex-wrap gap-1.5">
              {BIHAR_CITIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    handleSelectCity(c.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    selectedCity === c.name
                      ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                      : "bg-[#F8F7FA] text-[#39364F] border-slate-200"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              href="/#events"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] flex items-center gap-2 border border-slate-200"
            >
              <Ticket size={17} weight="duotone" className="text-[#4F46E5]" />
              <span>Browse Events</span>
            </Link>
            <Link
              href="/my-tickets"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] flex items-center gap-2 border border-slate-200"
            >
              <Ticket size={17} weight="bold" className="text-[#10B981]" />
              <span>My Passes</span>
            </Link>
            <Link
              href={getSubdomainUrl("org", "/create")}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[#F05537]/10 hover:bg-[#F05537]/20 text-[#F05537] flex items-center gap-2 border border-[#F05537]/20"
            >
              <Plus size={17} weight="bold" />
              <span>Create Event</span>
            </Link>
            <Link
              href={getSubdomainUrl("org")}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] flex items-center gap-2 border border-slate-200"
            >
              <Buildings size={17} weight="duotone" className="text-[#4F46E5]" />
              <span>Host Console</span>
            </Link>
            <Link
              href={getSubdomainUrl("scan", "/login")}
              onClick={() => setIsMobileMenuOpen(false)}
              className="col-span-2 p-2.5 rounded-xl bg-[#F8F7FA] hover:bg-slate-100 text-[#39364F] flex items-center justify-center gap-2 border border-[#DBDAE3] text-[11px] font-semibold"
            >
              <UserCheck size={16} weight="bold" className="text-[#4F46E5]" />
              <span>Scanning Staff Portal (Gate Login)</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-colors print:hidden">
      <Suspense fallback={<div className="h-[72px] w-full" />}>
        <HeaderContent />
      </Suspense>
    </header>
  );
}
