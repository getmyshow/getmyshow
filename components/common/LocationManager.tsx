"use client";

import { useEffect, useState } from "react";
import {
  findNearestBiharCity,
  getUserStoredCity,
  setUserStoredCity,
  GEO_PROMPTED_KEY,
} from "@/lib/geo";
import { MapPin, X, CheckCircle } from "@phosphor-icons/react";

export default function LocationManager() {
  const [notification, setNotification] = useState<{
    visible: boolean;
    cityName: string;
    isAutoDetected: boolean;
  }>({
    visible: false,
    cityName: "",
    isAutoDetected: false,
  });

  useEffect(() => {
    // Only run in client browser
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    const hasPrompted = localStorage.getItem(GEO_PROMPTED_KEY);

    // If user hasn't been prompted yet, request browser location access
    if (!hasPrompted) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const nearest = findNearestBiharCity(latitude, longitude);
            
            setUserStoredCity(nearest.name);
            localStorage.setItem(GEO_PROMPTED_KEY, "granted");

            // Show friendly notification pill
            setNotification({
              visible: true,
              cityName: nearest.name,
              isAutoDetected: true,
            });

            // Auto-hide toast after 6 seconds
            setTimeout(() => {
              setNotification((prev) => ({ ...prev, visible: false }));
            }, 6000);
          } catch (e) {
            console.warn("Failed to set geo location:", e);
            localStorage.setItem(GEO_PROMPTED_KEY, "error");
          }
        },
        (error) => {
          // User denied or timed out; mark prompted so we don't spam browser prompt
          console.log("Geolocation permission status:", error.message);
          localStorage.setItem(GEO_PROMPTED_KEY, "denied");
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000, // 5 min cache
        }
      );
    }
  }, []);

  if (!notification.visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none"
    >
      <div className="pointer-events-auto bg-[#0F172A]/95 text-white backdrop-blur-md border border-white/15 px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center shrink-0">
            <MapPin size={15} weight="fill" className="text-white" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1 font-bold tracking-tight">
              <span>Location: {notification.cityName}</span>
              <CheckCircle size={12} weight="fill" className="text-[#10B981]" />
            </div>
            <p className="text-[10px] text-slate-300 truncate">
              Showing events near you in Bihar
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setNotification((prev) => ({ ...prev, visible: false }))}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss location banner"
        >
          <X size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}
