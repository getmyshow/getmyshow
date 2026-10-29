"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SignInButton, Show, UserButton, useUser } from "@clerk/nextjs";
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
  Compass,
  Crosshair,
} from "@phosphor-icons/react";
import { getEvents, checkUserRole } from "@/actions/events";
import { EventItem } from "@/types";
import { formatINR } from "@/lib/utils";
import { getSubdomainUrl } from "@/lib/domains";
import {
  BIHAR_CITIES,
  getUserStoredCity,
  setUserStoredCity,
  findNearestBiharCity,
  openPickRegionModal,
} from "@/lib/geo";

const DISCOVERY_CATEGORIES = [
  { id: "all", label: "For You" },
  { id: "coaching", label: "Seminars" },
  { id: "music", label: "Concerts" },
  { id: "dandiya", label: "Cultural" },
  { id: "college", label: "College Fests" },
  { id: "sports", label: "Sports" },
  { id: "standup", label: "Comedy" },
  { id: "workshops", label: "Workshops" },
];

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const { user, isSignedIn } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Sasaram");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check dynamic role: isOrganizer is true ONLY if user has hosted >= 1 events
  useEffect(() => {
    let active = true;
    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const phone = user.primaryPhoneNumber?.phoneNumber;
      checkUserRole({ email, phone }).then((res) => {
        if (active && res.success && res.data) {
          setIsOrganizer(res.data.isOrganizer);
        }
      });
    } else {
      setIsOrganizer(false);
    }
    return () => {
      active = false;
    };
  }, [isSignedIn, user]);

  // Set mounted state for React Portal teleportation and load stored city
  useEffect(() => {
    setIsMounted(true);
    setSelectedCity(getUserStoredCity());

    const onCityChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ city: string }>;
      if (customEvent.detail?.city) {
        setSelectedCity(customEvent.detail.city);
      }
    };

    window.addEventListener("getmyshow:city-changed", onCityChanged);
    return () => window.removeEventListener("getmyshow:city-changed", onCityChanged);
  }, []);

  // Prevent background scroll when mobile navigation drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

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
    setIsSearchFocused(false);
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setUserStoredCity(city);
    setIsCityDropdownOpen(false);
    const citySlug = city.toLowerCase().replace(/\s+/g, "-");
    router.push(`/city/${citySlug}`);
  };

  const handleCategoryClick = (catId: string) => {
    if (catId === "all") {
      router.push("/#events");
    } else {
      router.push(`/?category=${encodeURIComponent(catId)}#events`);
    }
  };

  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      setIsSearchFocused(true);
    }
  };

  return (
    <>
      <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* ROW 1: Logo + Location + Actions */}
        <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Hamburger (Mobile) + Logo + Location Chip */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-[#39364F] hover:bg-[#F8F7FA] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>

            {/* Brand Wordmark Logo */}
            <Link href="/" className="flex items-center group transition-transform active:scale-98 shrink-0">
              <Image
                src="/brand/logos/wordmark-tilted-black-text.svg"
                alt="GetMyShow — Hyperlocal Bihar Event Ticketing"
                width={200}
                height={52}
                priority
                className="h-7 sm:h-9 md:h-10 w-auto object-contain"
              />
            </Link>

            {/* City Location Chip (BookMyShow "Pick A Region" Modal Trigger) */}
            <div className="relative shrink-0 ml-1">
              <button
                type="button"
                onClick={() => openPickRegionModal()}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 hover:bg-slate-200 transition-colors text-left border border-slate-200/60 active:scale-95"
                aria-label="Pick a region"
              >
                <MapPin size={13} weight="fill" className="text-[#F05537] shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] tracking-tight truncate max-w-[70px] sm:max-w-none">
                  {selectedCity}
                </span>
                <CaretDown size={10} weight="bold" className="text-[#64748B]" />
              </button>
            </div>
          </div>

          {/* Center Nav: Desktop Categories */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto no-scrollbar py-1">
            {DISCOVERY_CATEGORIES.map((cat) => {
              const isSelected =
                activeCategory === cat.id || (cat.id === "all" && !searchParams.get("category"));
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap shrink-0 ${
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

          {/* Desktop Search Bar */}
          <div ref={searchContainerRef} className="hidden md:block relative flex-1 max-w-xs xl:max-w-sm">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-[#F8F7FA] hover:bg-slate-100/90 focus-within:bg-white focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/15 border border-[#E2E8F0] rounded-full h-9 px-3 w-full transition-all"
            >
              <MagnifyingGlass size={15} weight="bold" className="text-[#64748B] shrink-0 mr-1.5" />
              <input
                ref={searchInputRef}
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

            {/* Desktop Predictive Dropdown */}
            {isSearchFocused && searchQuery.trim().length >= 1 && (
              <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <span>Matching Events</span>
                  <span className="text-[#4F46E5]">{matchingEvents.length} found</span>
                </div>

                {matchingEvents.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#64748B] space-y-1">
                    <p>No direct matches for &ldquo;{searchQuery}&rdquo;</p>
                    <p className="text-[11px] text-slate-400">Press Enter to run global search</p>
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
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {ev.poster_url ? (
                            <img
                              src={ev.poster_url}
                              alt={ev.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Ticket size={14} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-[#4F46E5] uppercase">
                            {ev.city}
                          </span>
                          <h4 className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#4F46E5] transition-colors mt-0.5">
                            {ev.title}
                          </h4>
                          <span className="text-[11px] font-bold text-[#0F172A] font-mono block">
                            {formatINR(ev.ticket_price)}
                          </span>
                        </div>
                        <ArrowRight size={13} className="text-slate-300 group-hover:text-[#4F46E5]" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* My Passes Desktop Link */}
            <Link
              href="/my-tickets"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#4F46E5] transition-colors px-2.5 py-1.5 rounded-full hover:bg-indigo-50/60"
            >
              <Ticket size={15} weight="duotone" className="text-[#4F46E5]" />
              <span>Passes</span>
            </Link>

            {/* Organizer Studio Desktop Link (Visible ONLY if user has hosted >= 1 events) */}
            {isOrganizer && (
              <Link
                href={getSubdomainUrl("org")}
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] hover:text-indigo-700 transition-colors px-2.5 py-1.5 rounded-full bg-indigo-50/80 hover:bg-indigo-100/80"
              >
                <Buildings size={15} weight="duotone" />
                <span>Studio</span>
              </Link>
            )}

            {/* Host Event Button (Visible from tablet up) */}
            <Link
              href={getSubdomainUrl("org", "/create")}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F05537] hover:bg-[#D94428] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <Plus size={13} weight="bold" />
              <span>Host</span>
            </Link>

            {/* Clerk Universal Auth Suite */}
            <Suspense fallback={<div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse" />}>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-300 hover:border-slate-800 text-[11px] sm:text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition-all bg-white"
                  >
                    <UserCheck size={13} weight="bold" className="text-[#4F46E5]" />
                    <span>Sign In</span>
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center gap-1.5">
                  <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="My Booked Passes"
                        labelIcon={<Ticket size={16} weight="duotone" />}
                        href="/my-tickets"
                      />
                      {isOrganizer && (
                        <UserButton.Link
                          label="Organizer Dashboard"
                          labelIcon={<Buildings size={16} weight="duotone" />}
                          href={getSubdomainUrl("org")}
                        />
                      )}
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </Show>
            </Suspense>
          </div>
        </div>

        {/* ROW 2 (MOBILE ONLY): Dedicated Full-Width Search Tap Target */}
        <div className="md:hidden pb-2.5">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-[#F8F7FA] focus-within:bg-white focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/15 border border-[#E2E8F0] rounded-full h-10 px-3.5 w-full transition-all shadow-2xs"
          >
            <MagnifyingGlass size={16} weight="bold" className="text-[#64748B] shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search events, artists, venues in Bihar..."
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
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={14} weight="bold" />
              </button>
            )}
          </form>

          {/* Mobile Predictive Dropdown */}
          {isSearchFocused && searchQuery.trim().length >= 1 && (
            <div className="mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                <span>Matching Events</span>
                <span className="text-[#4F46E5]">{matchingEvents.length} found</span>
              </div>

              {matchingEvents.length === 0 ? (
                <div className="p-3 text-center text-xs text-[#64748B]">
                  No events found matching &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {matchingEvents.map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/e/${ev.slug}`}
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition"
                    >
                      <div className="relative w-9 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {ev.poster_url ? (
                          <img
                            src={ev.poster_url}
                            alt={ev.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Ticket size={13} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-indigo-50 text-[#4F46E5] uppercase">
                          {ev.city}
                        </span>
                        <h4 className="text-xs font-bold text-[#0F172A] truncate mt-0.5">
                          {ev.title}
                        </h4>
                        <span className="text-[11px] font-bold text-[#0F172A] font-mono block">
                          {formatINR(ev.ticket_price)}
                        </span>
                      </div>
                      <ArrowRight size={13} className="text-slate-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 60% Left Slide-Over Navigation Drawer (Rendered via Portal into body to escape header stacking context) */}
      {isMounted && isMobileMenuOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[999] md:hidden">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300 z-[1000]"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* 60% Left Slide-Over Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="fixed inset-y-0 left-0 w-[70%] sm:w-[60%] min-w-[280px] max-w-[340px] h-[100dvh] bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-250 border-r border-[#DBDAE3] z-[1001] p-4 space-y-4"
            style={{
              paddingTop: "max(1rem, env(safe-area-inset-top))",
              paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
            }}
          >
            <div>
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEDF2]">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center"
                >
                  <Image
                    src="/brand/logos/wordmark-tilted-black-text.svg"
                    alt="GetMyShow"
                    width={140}
                    height={36}
                    className="h-7 w-auto object-contain"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#6F7287] hover:bg-[#F8F7FA] hover:text-[#1E0A3C] transition"
                  aria-label="Close menu"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Quick Search Inside Drawer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  } else {
                    router.push("/search");
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="mt-3.5 flex items-center bg-[#F8F7FA] border border-[#DBDAE3] rounded-full h-9 px-3 focus-within:border-[#4F46E5] focus-within:bg-white"
              >
                <MagnifyingGlass size={15} weight="bold" className="text-[#64748B] mr-1.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search events in Bihar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#0F172A] outline-none font-medium placeholder-[#94A3B8]"
                />
              </form>

              {/* Navigation Links */}
              <div className="mt-4 space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#1E0A3C] transition"
                >
                  <Compass size={16} weight="duotone" className="text-[#4F46E5]" />
                  <span>Explore Home</span>
                </Link>

                <Link
                  href="/search"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#1E0A3C] transition"
                >
                  <MagnifyingGlass size={16} weight="bold" className="text-[#4F46E5]" />
                  <span>Search Events</span>
                </Link>

                <Link
                  href="/my-tickets"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#1E0A3C] transition"
                >
                  <Ticket size={16} weight="bold" className="text-[#10B981]" />
                  <span>My Passes</span>
                </Link>

                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#1E0A3C] transition"
                >
                  <UserCheck size={16} weight="duotone" className="text-[#4F46E5]" />
                  <span>My Account</span>
                </Link>

                <Link
                  href={getSubdomainUrl("org", "/create")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#F05537]/10 hover:bg-[#F05537]/20 text-xs font-bold text-[#F05537] transition"
                >
                  <Plus size={16} weight="bold" />
                  <span>Host an Event (0% Fee)</span>
                </Link>

                {/* Organizer Studio: Rendered ONLY if user has hosted >= 1 events */}
                {isOrganizer && (
                  <Link
                    href={getSubdomainUrl("org")}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#1E0A3C] transition"
                  >
                    <Buildings size={16} weight="duotone" className="text-[#4F46E5]" />
                    <span>Organizer Studio</span>
                  </Link>
                )}
              </div>

              {/* Popular Cities in Bihar */}
              <div className="mt-4 pt-3 border-t border-[#EEEDF2]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    Cities in Bihar
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openPickRegionModal();
                    }}
                    className="text-[11px] font-bold text-[#F05537] hover:underline"
                  >
                    Pick Region →
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {BIHAR_CITIES.map((c) => {
                    const citySlug = c.name.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <Link
                        key={c.name}
                        href={`/city/${citySlug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                          selectedCity === c.name
                            ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                            : "bg-[#F8F7FA] text-[#39364F] border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        {c.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Categories */}
              <div className="mt-4 pt-3 border-t border-[#EEEDF2]">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  Event Types
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
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                        activeCategory === cat.id
                          ? "bg-[#1E0A3C] text-white border-[#1E0A3C]"
                          : "bg-[#F8F7FA] text-[#39364F] border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Profile / Sign-in */}
            <div className="pt-3 border-t border-[#EEEDF2]">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-lg bg-[#4F46E5] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <UserCheck size={14} weight="bold" />
                    <span>Sign In to Account</span>
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-[#1E0A3C]">Account</span>
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-colors print:hidden">
      <Suspense fallback={<div className="h-14 sm:h-16 w-full" />}>
        <HeaderContent />
      </Suspense>
    </header>
  );
}
