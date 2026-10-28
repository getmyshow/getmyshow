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
  PlusCircle,
  CalendarBlank,
  Buildings,
  UserCheck,
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#DBDAE3] transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#39364F] hover:bg-[#F8F7FA] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>

          <Link href="/" className="flex items-center group transition-transform active:scale-95">
            <Image
              src="/brand/logos/wordmark-tilted-black-text-transparent.svg"
              alt="GetMyShow Logo"
              width={140}
              height={38}
              priority
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Eventbrite-Style 100px Pill Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center bg-white border border-[#DBDAE3] rounded-[100px] h-12 px-3 shadow-xs hover:border-[#BEC0C6] focus-within:border-[#3659E3] focus-within:shadow-[0_0_0_2px_rgba(54,89,227,0.15)] transition-all max-w-xl w-full"
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

          <div className="h-6 w-px bg-[#DBDAE3]" />

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
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-[#DBDAE3] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-xs font-bold text-[#6F7287] uppercase tracking-wider">
                    Select Your City
                  </div>
                  <div className="space-y-0.5">
                    {BIHAR_CITIES.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleSelectCity(c.name)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
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

          {/* Ember Orange Circular Search Submit Button */}
          <button
            type="submit"
            aria-label="Submit search"
            className="w-8 h-8 rounded-full bg-[#F05537] hover:bg-[#D94428] text-white flex items-center justify-center transition-transform active:scale-95 ml-1 shrink-0"
          >
            <MagnifyingGlass size={15} weight="bold" />
          </button>
        </form>

        {/* Right Navigation Suite */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/#events"
            className="text-sm font-semibold text-[#39364F] hover:text-[#1E0A3C] transition-colors hidden lg:block"
          >
            Find Events
          </Link>

          <Link
            href="/organizer/create"
            className="text-sm font-semibold text-[#39364F] hover:text-[#1E0A3C] transition-colors hidden sm:block"
          >
            Create Event
          </Link>

          <Link
            href="/organizer"
            className="text-sm font-semibold text-[#39364F] hover:text-[#1E0A3C] transition-colors hidden sm:block"
          >
            Organizer Portal
          </Link>

          {/* Pill Action Button */}
          <Link
            href="/organizer"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-[360px] border border-[#DBDAE3] hover:border-[#39364F] text-sm font-semibold text-[#39364F] hover:text-[#1E0A3C] transition-all bg-white hover:bg-[#F8F7FA]"
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
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-[#F8F7FA] border border-[#DBDAE3] rounded-full px-3 py-2">
            <MagnifyingGlass size={18} weight="bold" className="text-[#6F7287]" />
            <input
              type="text"
              placeholder="Search events in Bihar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#39364F] outline-none font-medium"
            />
            <button type="submit" className="w-7 h-7 rounded-full bg-[#F05537] text-white flex items-center justify-center shrink-0">
              <MagnifyingGlass size={14} weight="bold" />
            </button>
          </form>

          {/* City Chips */}
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
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
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

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <Link
              href="/#events"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-[#F8F7FA] hover:bg-slate-100 text-[#39364F] flex items-center gap-2"
            >
              <Ticket size={18} weight="duotone" className="text-[#3659E3]" />
              <span>Browse Events</span>
            </Link>
            <Link
              href="/organizer/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-[#F8F7FA] hover:bg-slate-100 text-[#39364F] flex items-center gap-2"
            >
              <PlusCircle size={18} weight="duotone" className="text-[#F05537]" />
              <span>Create Event</span>
            </Link>
            <Link
              href="/organizer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-[#F8F7FA] hover:bg-slate-100 text-[#39364F] flex items-center gap-2 col-span-2"
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
