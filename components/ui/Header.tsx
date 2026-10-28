"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  CalendarBlank,
} from "@phosphor-icons/react";

const BIHAR_CITIES = [
  { name: "Sasaram", region: "Rohtas (HQ)", isPrimary: true },
  { name: "Dehri-on-Sone", region: "Rohtas", isPrimary: false },
  { name: "Patna", region: "Capital", isPrimary: false },
  { name: "Gaya", region: "Magadh", isPrimary: false },
  { name: "Bhabua", region: "Kaimur", isPrimary: false },
  { name: "Ara", region: "Bhojpur", isPrimary: false },
  { name: "Aurangabad", region: "Bihar", isPrimary: false },
];

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Sasaram");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#DBDAE3] transition-colors print:hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo (Enlarged prominent size) & Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#39364F] hover:bg-[#F8F7FA] transition-colors border border-transparent hover:border-[#DBDAE3]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>

          <Link href="/" className="flex items-center group transition-transform active:scale-98">
            <Image
              src="/brand/logos/wordmark-cropped.svg"
              alt="GetMyShow — Hyperlocal Bihar Event Ticketing"
              width={220}
              height={58}
              priority
              className="h-10 sm:h-12 md:h-13 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Eventbrite-Style Rectangular Search Bar (Anti-Slop 8px Radius) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center bg-white border border-[#DBDAE3] rounded-lg h-11 px-2.5 shadow-xs hover:border-[#BEC0C6] focus-within:border-[#3659E3] focus-within:shadow-[0_0_0_2px_rgba(54,89,227,0.12)] transition-all max-w-xl w-full"
        >
          {/* Query Input */}
          <div className="flex items-center gap-2 flex-1 px-2">
            <MagnifyingGlass size={18} weight="bold" className="text-[#6F7287] shrink-0" />
            <input
              type="text"
              placeholder="Search events, seminars, concerts in Bihar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#39364F] placeholder-[#6F7287] outline-none font-medium"
            />
          </div>

          <div className="h-5 w-px bg-[#DBDAE3]" />

          {/* Location Selector Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1 text-sm font-semibold text-[#39364F] hover:text-[#1E0A3C] transition-colors"
            >
              <MapPin size={17} weight="fill" className="text-[#3659E3] shrink-0" />
              <span className="truncate max-w-[110px]">{selectedCity}</span>
              <CaretDown size={12} weight="bold" className="text-[#6F7287] shrink-0" />
            </button>

            {/* City Dropdown Menu */}
            {isCityDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCityDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl border border-[#DBDAE3] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-xs font-bold text-[#6F7287] uppercase tracking-wider">
                    Select Your City
                  </div>
                  <div className="space-y-0.5">
                    {BIHAR_CITIES.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleSelectCity(c.name)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-semibold flex items-center justify-between transition-colors ${
                          selectedCity === c.name
                            ? "bg-[#3659E3]/10 text-[#3659E3]"
                            : "text-[#39364F] hover:bg-[#F8F7FA] hover:text-[#1E0A3C]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin size={15} weight={selectedCity === c.name ? "fill" : "regular"} />
                          <span>{c.name}</span>
                        </div>
                        <span className="text-xs text-[#6F7287] font-normal">{c.region}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Rectangular Search Submit Button */}
          <button
            type="submit"
            aria-label="Submit search"
            className="h-8 px-3 rounded-md bg-[#F05537] hover:bg-[#D94428] text-white flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 ml-1 shrink-0"
          >
            <MagnifyingGlass size={14} weight="bold" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* Right Navigation Suite */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/#events"
            className="text-sm font-semibold text-[#39364F] hover:text-[#1E0A3C] transition-colors hidden lg:block"
          >
            Find Events
          </Link>

          <Link
            href="/organizer"
            className="text-sm font-semibold text-[#39364F] hover:text-[#1E0A3C] transition-colors hidden sm:block"
          >
            Organizer Portal
          </Link>

          {/* Rectangular Create Event CTA (8px radius) */}
          <Link
            href="/organizer/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#F05537] hover:bg-[#D94428] text-white text-sm font-bold transition-all shadow-xs active:scale-95"
          >
            <Plus size={16} weight="bold" />
            <span>Create Event</span>
          </Link>

          {/* Rectangular Sign In (8px radius) */}
          <Link
            href="/organizer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#DBDAE3] hover:border-[#39364F] text-sm font-semibold text-[#39364F] hover:text-[#1E0A3C] transition-all bg-white hover:bg-[#F8F7FA]"
          >
            <UserCheck size={16} weight="bold" className="text-[#3659E3]" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#DBDAE3] bg-white px-4 py-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-[#F8F7FA] border border-[#DBDAE3] rounded-lg px-3 py-2">
            <MagnifyingGlass size={18} weight="bold" className="text-[#6F7287]" />
            <input
              type="text"
              placeholder="Search events in Bihar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#39364F] outline-none font-medium"
            />
            <button type="submit" className="h-8 px-3 rounded-md bg-[#F05537] text-white flex items-center justify-center text-xs font-bold shrink-0">
              <MagnifyingGlass size={14} weight="bold" />
            </button>
          </form>

          {/* City Selector */}
          <div>
            <div className="text-xs font-bold text-[#6F7287] uppercase tracking-wider mb-2">
              Popular Cities
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
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                    selectedCity === c.name
                      ? "bg-[#3659E3] text-white border-[#3659E3]"
                      : "bg-[#F8F7FA] text-[#39364F] border-[#DBDAE3]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#DBDAE3]" />

          {/* Mobile Links (Rectangular 8px) */}
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <Link
              href="/#events"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#F8F7FA] hover:bg-slate-100 text-[#39364F] flex items-center gap-2 border border-[#DBDAE3]"
            >
              <Ticket size={18} weight="duotone" className="text-[#3659E3]" />
              <span>Browse Events</span>
            </Link>
            <Link
              href="/organizer/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#F05537]/10 hover:bg-[#F05537]/20 text-[#F05537] flex items-center gap-2 border border-[#F05537]/20"
            >
              <Plus size={18} weight="bold" />
              <span>Create Event</span>
            </Link>
            <Link
              href="/organizer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#F8F7FA] hover:bg-slate-100 text-[#39364F] flex items-center gap-2 col-span-2 border border-[#DBDAE3]"
            >
              <Buildings size={18} weight="duotone" className="text-[#4F46E5]" />
              <span>Organizer Portal & Wallet</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
