"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MagnifyingGlass,
  Crosshair,
  CaretLeft,
  X,
  CheckCircle,
} from "@phosphor-icons/react";
import {
  BIHAR_CITIES,
  ALL_BIHAR_DISTRICTS,
  getUserStoredCity,
  setUserStoredCity,
  hasUserChosenCity,
  findNearestBiharCity,
} from "@/lib/geo";

// Authentic BookMyShow-style architectural line-art heritage icons
function LandmarkIcon({ citySlug }: { citySlug: string }) {
  switch (citySlug) {
    case "sasaram":
      // Sher Shah Suri Tomb octagonal mausoleum dome with chhatris & water plinth
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-800">
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

    // Listen to open-modal event dispatched from Header or Account
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
    <div className="fixed inset-0 z-[1050] bg-black/65 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pick A Region"
        className="w-full max-w-xl h-[100dvh] sm:h-[90vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 font-sans"
      >
        {/* 1. Header Bar matching BookMyShow exactly: Back arrow on left, Title centered */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#E5E5E5] shrink-0 bg-white">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 -ml-1.5 text-[#222222] hover:text-[#000000] rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Back"
          >
            <CaretLeft size={22} weight="bold" />
          </button>

          <h2 className="text-base font-bold text-[#222222] tracking-tight">
            Pick A Region
          </h2>

          {/* Symmetrical placeholder for visual center balance, plus subtle close on desktop */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 -mr-1.5 text-transparent sm:text-slate-400 sm:hover:text-slate-700 rounded-full sm:hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* 2. Search & Detect Location Area matching BookMyShow screenshot */}
        <div className="bg-white shrink-0">
          {/* Search Box */}
          <div className="px-4 pt-3.5 pb-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#888888]">
                <MagnifyingGlass size={18} weight="regular" />
              </div>
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your city"
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E5E5E5] focus:border-[#F84464] focus:ring-1 focus:ring-[#F84464] rounded-lg text-sm text-[#222222] placeholder-[#888888] outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#888888] hover:text-[#333333]"
                >
                  <X size={16} weight="bold" />
                </button>
              )}
            </div>
          </div>

          {/* Detect my location row (coral/pink #F84464 crosshair and text) */}
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isGpsLoading}
            className="w-full px-4 py-3 flex items-center gap-2.5 text-[#F84464] hover:bg-slate-50 transition-colors cursor-pointer text-left disabled:opacity-50"
          >
            <Crosshair
              size={18}
              weight="bold"
              className={isGpsLoading ? "animate-spin text-[#F84464]" : "text-[#F84464]"}
            />
            <span className="text-sm font-medium">
              {isGpsLoading ? "Detecting nearest city..." : "Detect my location"}
            </span>
          </button>
        </div>

        {/* 3. Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* POPULAR CITIES Header Strip */}
          <div className="bg-[#F2F2F2] px-4 py-2 border-t border-[#EAEAEA]">
            <span className="text-[11px] font-semibold text-[#666666] tracking-wider uppercase">
              POPULAR CITIES
            </span>
          </div>

          {/* POPULAR CITIES Grid: 4 columns with interconnected 1px divider lines */}
          {filteredPopularCities.length > 0 ? (
            <div className="grid grid-cols-4 bg-white border-b border-[#EAEAEA]">
              {filteredPopularCities.map((city, idx) => {
                const isSelected = currentCity.toLowerCase() === city.name.toLowerCase();
                const isRightCol = (idx + 1) % 4 === 0;

                return (
                  <button
                    key={city.slug}
                    type="button"
                    onClick={() => handleSelectCity(city.name)}
                    className={`flex flex-col items-center justify-center py-4 px-1 text-center transition-colors cursor-pointer hover:bg-slate-50 border-b border-[#EAEAEA] ${
                      !isRightCol ? "border-r border-[#EAEAEA]" : ""
                    } ${isSelected ? "bg-red-50/40 text-[#F84464]" : "text-[#222222]"}`}
                  >
                    {/* Architectural Landmark Line-art Icon */}
                    <div className="w-11 h-11 flex items-center justify-center transition-transform hover:scale-105">
                      <LandmarkIcon citySlug={city.slug} />
                    </div>

                    <span
                      className={`text-xs mt-2 tracking-tight ${
                        isSelected ? "font-bold text-[#F84464]" : "font-normal text-[#222222]"
                      }`}
                    >
                      {city.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 bg-white">
              No popular cities matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}

          {/* OTHER CITIES Header Strip */}
          <div className="bg-[#F2F2F2] px-4 py-2 border-t border-[#EAEAEA]">
            <span className="text-[11px] font-semibold text-[#666666] tracking-wider uppercase">
              OTHER CITIES
            </span>
          </div>

          {/* OTHER CITIES Alphabetical List with 1px divider lines */}
          <div className="bg-white">
            {filteredOtherDistricts.map((district) => {
              const isSelected = currentCity.toLowerCase() === district.toLowerCase();

              return (
                <button
                  key={district}
                  type="button"
                  onClick={() => handleSelectCity(district)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between border-b border-[#EAEAEA] hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <span
                    className={`text-sm ${
                      isSelected ? "text-[#F84464] font-bold" : "text-[#333333] group-hover:text-[#F84464]"
                    }`}
                  >
                    {district}
                  </span>
                  {isSelected && (
                    <CheckCircle size={16} weight="fill" className="text-[#F84464]" />
                  )}
                </button>
              );
            })}

            {filteredOtherDistricts.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No cities found matching &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
