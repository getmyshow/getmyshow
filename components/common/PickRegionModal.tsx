"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  MagnifyingGlass,
  Crosshair,
  CaretLeft,
  X,
  CheckCircle,
  MapPin,
  Sparkle,
} from "@phosphor-icons/react";
import {
  BIHAR_CITIES,
  ALL_BIHAR_DISTRICTS,
  getUserStoredCity,
  setUserStoredCity,
  hasUserChosenCity,
  findNearestBiharCity,
} from "@/lib/geo";

// Distinctive GetMyShow architectural heritage line-art icons with brand styling
function LandmarkIcon({ citySlug }: { citySlug: string }) {
  switch (citySlug) {
    case "sasaram":
      // Sher Shah Suri Tomb octagonal mausoleum dome with chhatris & water plinth
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M32 6v5" />
          <path d="M22 17c0-5.5 4.5-9 10-9s10 3.5 10 9v3H22v-3z" />
          <path d="M14 24l6-4h24l6 4v28H14V24z" />
          <path d="M26 34h12v18H26z" />
          <path d="M18 20v4M46 20v4" />
          <path d="M8 56h48" />
          <path d="M4 60h56" />
        </svg>
      );
    case "dehri-on-sone":
      // Historic 93-pillar Sone River railway/road truss bridge over river ripples
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M4 34h56" />
          <path d="M10 34l6-16h4l6 16" />
          <path d="M38 34l6-16h4l6 16" />
          <path d="M10 34v18M26 34v18M38 34v18M54 34v18" />
          <path d="M4 52c8-2 16 2 24-1s16 2 24-1" />
          <path d="M8 58c8-2 16 2 24-1s16 2 24-1" />
        </svg>
      );
    case "patna":
      // Iconic Golghar bee-hive dome with outer staircase spiral
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M32 6v6" />
          <path d="M12 48c0-14 9-28 20-28s20 14 20 28H12z" />
          <path d="M16 48v6h32v-6" />
          <path d="M8 58h48" />
          <path d="M20 36c4-6 8-10 12-10s8 4 12 10" />
          <path d="M18 42c4-4 8-6 14-6s10 2 14 6" />
        </svg>
      );
    case "gaya":
      // Mahabodhi Temple stepped pyramidal tower with amalaka and kalasha finial
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M32 4l3 9h-6l3-9z" />
          <path d="M26 13l-4 33h20l-4-33H26z" />
          <path d="M18 46l-4 8h36l-4-8H18z" />
          <path d="M28 42h8v12h-8z" />
          <path d="M24 24h16M23 32h18" />
          <path d="M10 58h44" />
        </svg>
      );
    case "ara":
      // Veer Kunwar Singh fort bastion and flag of 1857
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M12 20h8v4h-8zM28 20h8v4h-8zM44 20h8v4h-8z" />
          <path d="M14 24l2 30h32l2-30" />
          <path d="M26 38h12v16H26z" />
          <path d="M32 8v12" />
          <path d="M32 8l8 4-8 4" />
          <path d="M8 58h48" />
        </svg>
      );
    case "bhabua":
      // Maa Mundeshwari Temple ancient stone shikhara & Kaimur hills
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M32 6v6" />
          <path d="M32 12L20 28h24L32 12z" />
          <path d="M18 28v22h28V28" />
          <path d="M27 38h10v12H27z" />
          <path d="M8 54c8-4 16 2 24-2s16 4 24 0" />
          <path d="M6 58h52" />
        </svg>
      );
    case "aurangabad":
      // Deo Sun Temple chariot spire with Surya sun disc & stone wheels
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <circle cx="32" cy="14" r="5" />
          <path d="M32 4v4M32 20v4M22 14h4M38 14h4" />
          <path d="M24 24h16l-2 26H26l-2-26z" />
          <path d="M14 50l4 6h28l4-6" />
          <path d="M10 58h44" />
        </svg>
      );
    case "buxar":
      // Holy Ramrekha Ghat Ganges river steps & temple shikhara
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M22 14h20v14H22z" />
          <path d="M32 6l5 8h-10l5-8z" />
          <path d="M16 28h32v6H16z" />
          <path d="M12 34h40v6H12z" />
          <path d="M8 40h48v6H8z" />
          <path d="M4 46h56v6H4z" />
          <path d="M2 56c12-3 24 3 36-1s16 2 24-1" />
        </svg>
      );
    case "muzaffarpur":
      // Baba Garibnath Dham temple spire with trishul
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M32 6v6" />
          <path d="M28 8h8M30 6v4M34 6v4" />
          <path d="M20 22l12-10 12 10v28H20V22z" />
          <path d="M27 34h10v16H27z" />
          <path d="M12 50h40" />
          <path d="M8 58h48" />
        </svg>
      );
    case "bhagalpur":
      // Ancient Vikramshila Mahavihara stepped Buddhist stupa
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <circle cx="32" cy="14" r="4" />
          <path d="M24 22h16v6H24z" />
          <path d="M18 28h28v8H18z" />
          <path d="M12 36h40v10H12z" />
          <path d="M8 46h48v8H8z" />
          <path d="M4 58h56" />
        </svg>
      );
    case "darbhanga":
      // Royal Raj Darbhanga Red Fort royal palace gateway
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M14 16h8v8h-8zM42 16h8v8h-8z" />
          <path d="M16 24v28M48 24v28" />
          <path d="M22 24h20v8c0 5-4 10-10 10s-10-5-10-10v-8z" />
          <path d="M8 56h48" />
          <path d="M4 60h56" />
        </svg>
      );
    case "begusarai":
      // Simaria Ghat / Kanwar Lake sanctuary pavilion
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M32 8l16 12H16L32 8z" />
          <path d="M20 20v24M44 20v24M32 20v24" />
          <path d="M12 44h40v8H12z" />
          <path d="M6 56c10-2 20 2 30-1s16 2 22-1" />
          <path d="M4 60h56" />
        </svg>
      );
    default:
      // Standard heritage monument line-art
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800 group-hover:text-[#4F46E5] transition-colors">
          <path d="M32 8v6" />
          <path d="M18 20c0-6 6-10 14-10s14 4 14 10H18z" />
          <path d="M14 26h36" />
          <path d="M20 26v24M32 26v24M44 26v24" />
          <path d="M10 54h44" />
          <path d="M6 58h52" />
        </svg>
      );
  }
}

export default function PickRegionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState("Sasaram");

  useEffect(() => {
    // Open on first visit if user hasn't selected a city yet
    if (!hasUserChosenCity()) {
      setIsOpen(true);
    } else {
      setCurrentCity(getUserStoredCity());
    }

    // Listen to open-modal event dispatched from Header, Drawer, or Profile
    const handleOpen = () => {
      setSearchQuery("");
      setIsOpen(true);
    };

    const handleCityChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ city: string }>;
      if (customEvent.detail?.city) {
        setCurrentCity(customEvent.detail.city);
      }
    };

    window.addEventListener("getmyshow:open-region-modal", handleOpen);
    window.addEventListener("getmyshow:city-changed", handleCityChanged);

    return () => {
      window.removeEventListener("getmyshow:open-region-modal", handleOpen);
      window.removeEventListener("getmyshow:city-changed", handleCityChanged);
    };
  }, []);

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSelectCity = (cityName: string) => {
    setUserStoredCity(cityName);
    setCurrentCity(cityName);
    setIsOpen(false);
  };

  const handleDetectGps = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = findNearestBiharCity(pos.coords.latitude, pos.coords.longitude);
        handleSelectCity(nearest.name);
        setIsGpsLoading(false);
      },
      () => {
        setIsGpsLoading(false);
        handleSelectCity("Sasaram");
      },
      { timeout: 8000 }
    );
  };

  // Filter popular cities
  const filteredPopularCities = useMemo(() => {
    if (!searchQuery.trim()) return BIHAR_CITIES;
    const q = searchQuery.toLowerCase().trim();
    return BIHAR_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.landmark.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter all other districts
  const filteredOtherDistricts = useMemo(() => {
    if (!searchQuery.trim()) return ALL_BIHAR_DISTRICTS;
    const q = searchQuery.toLowerCase().trim();
    return ALL_BIHAR_DISTRICTS.filter((d) => d.toLowerCase().includes(q));
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] bg-black/75 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Select Your City"
        className="w-full max-w-2xl h-[100dvh] sm:h-[88vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 font-sans border-0 sm:border border-slate-100"
      >
        {/* 1. Distinctive GetMyShow Header Bar */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 -ml-2 text-slate-700 hover:text-[#4F46E5] rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Back"
            >
              <CaretLeft size={22} weight="bold" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#F97316]">
                  GetMyShow Region
                </span>
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight">
                Select Your Event Hub
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* 2. Interactive Search & GPS Action Strip */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#F8F9FC] shrink-0 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MagnifyingGlass size={18} weight="bold" />
            </div>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, town or landmark in Bihar..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 rounded-xl text-sm font-medium text-[#0F172A] placeholder-slate-400 outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
              >
                <X size={16} weight="bold" />
              </button>
            )}
          </div>

          {/* Detect my location button with Saffron/Indigo Brand Styling */}
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isGpsLoading}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 text-slate-800 text-xs font-bold transition-all shadow-xs active:scale-[0.99] disabled:opacity-50 group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F97316] flex items-center justify-center">
                <Crosshair
                  size={16}
                  weight="bold"
                  className={isGpsLoading ? "animate-spin text-[#F97316]" : "text-[#F97316]"}
                />
              </div>
              <span className="text-slate-800 group-hover:text-[#4F46E5] transition-colors">
                {isGpsLoading ? "Calculating nearest Bihar hub..." : "Auto-detect nearest city via GPS"}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#4F46E5] group-hover:underline">
              Locate Me →
            </span>
          </button>
        </div>

        {/* 3. Scrollable Cities Grid & List */}
        <div className="flex-1 overflow-y-auto">
          {/* POPULAR CITIES Grid */}
          <div className="p-4 sm:p-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkle size={14} weight="fill" className="text-[#F97316]" />
                <span>Popular Bihar Hubs</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {filteredPopularCities.length} Cities
              </span>
            </div>

            {filteredPopularCities.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
                {filteredPopularCities.map((city) => {
                  const isSelected = currentCity.toLowerCase() === city.name.toLowerCase();

                  return (
                    <button
                      key={city.slug}
                      type="button"
                      onClick={() => handleSelectCity(city.name)}
                      className={`group relative p-3 sm:p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? "border-[#4F46E5] bg-indigo-50/50 shadow-xs ring-2 ring-[#4F46E5]/20"
                          : "border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Architectural Landmark Line-art Icon */}
                      <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                        <LandmarkIcon citySlug={city.slug} />
                      </div>

                      <div className="mt-2.5 w-full">
                        <span className={`block text-xs font-bold tracking-tight ${isSelected ? "text-[#4F46E5]" : "text-slate-800"}`}>
                          {city.name}
                        </span>
                        <span className="block text-[10px] text-slate-400 truncate max-w-full mt-0.5">
                          {city.landmark}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle size={15} weight="fill" className="text-[#4F46E5]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 bg-white">
                No popular cities matching &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>

          {/* ALL 38 BIHAR DISTRICTS Directory */}
          <div className="p-4 sm:p-6 border-t border-slate-100 space-y-3 bg-[#FAFAFC]">
            <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
              All 38 Bihar Districts
            </h3>

            <div className="divide-y divide-slate-200/70 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
              {filteredOtherDistricts.map((district) => {
                const isSelected = currentCity.toLowerCase() === district.toLowerCase();

                return (
                  <button
                    key={district}
                    type="button"
                    onClick={() => handleSelectCity(district)}
                    className="w-full py-3 px-4 text-left flex items-center justify-between hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className={isSelected ? "text-[#4F46E5]" : "text-slate-400 group-hover:text-[#4F46E5]"} />
                      <span className={`text-xs sm:text-sm font-medium ${isSelected ? "text-[#4F46E5] font-bold" : "text-slate-700"}`}>
                        {district}
                      </span>
                    </div>

                    {isSelected && (
                      <CheckCircle size={16} weight="fill" className="text-[#4F46E5]" />
                    )}
                  </button>
                );
              })}

              {filteredOtherDistricts.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No districts found matching &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
