"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useUser,
  SignInButton,
  SignUpButton,
  SignOutButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import {
  User,
  Ticket,
  Buildings,
  MapPin,
  Crosshair,
  WhatsappLogo,
  ShieldCheck,
  SignOut,
  CaretRight,
  Sparkle,
  Phone,
  EnvelopeSimple,
  Plus,
  ArrowSquareOut,
  Info,
} from "@phosphor-icons/react";
import { checkUserRole } from "@/actions/events";
import { getSubdomainUrl } from "@/lib/domains";
import {
  BIHAR_CITIES,
  getUserStoredCity,
  setUserStoredCity,
  findNearestBiharCity,
  openPickRegionModal,
} from "@/lib/geo";

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentCity, setCurrentCity] = useState("Sasaram");
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentCity(getUserStoredCity());

    const onCityChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ city: string }>;
      if (customEvent.detail?.city) {
        setCurrentCity(customEvent.detail.city);
      }
    };
    window.addEventListener("getmyshow:city-changed", onCityChanged);
    return () => window.removeEventListener("getmyshow:city-changed", onCityChanged);
  }, []);

  // Check role: isOrganizer is true ONLY if user has hosted >= 1 events
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

  const handleDetectGps = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGpsMessage("Geolocation is not supported by your browser");
      return;
    }

    setIsGpsLoading(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = findNearestBiharCity(pos.coords.latitude, pos.coords.longitude);
        setUserStoredCity(nearest.name);
        setCurrentCity(nearest.name);
        setIsGpsLoading(false);
        setGpsMessage(`Location updated to ${nearest.name}, Bihar!`);
        setTimeout(() => setGpsMessage(null), 4000);
      },
      (err) => {
        setIsGpsLoading(false);
        setGpsMessage("Location access denied. Please select city manually.");
        setTimeout(() => setGpsMessage(null), 4000);
      },
      { timeout: 8000 }
    );
  };

  const handleCitySelect = (cityName: string) => {
    setUserStoredCity(cityName);
    setCurrentCity(cityName);
    setGpsMessage(`Location set to ${cityName}`);
    setTimeout(() => setGpsMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FA] py-6 sm:py-10 pb-28 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            My Account
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage your booked passes, organizer status, location preferences, and account settings.
          </p>
        </div>

        {/* 1. Identity & Profile Card */}
        {isSignedIn && user ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#4F46E5]/10 border-2 border-[#4F46E5]/20 flex items-center justify-center shrink-0">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || "User profile"}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={28} weight="bold" className="text-[#4F46E5]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A] truncate">
                    {user.fullName || "GetMyShow Member"}
                  </h2>
                  {isOrganizer && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#4F46E5]/10 text-[#4F46E5] uppercase tracking-wide">
                      Organizer
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 mt-1 text-xs text-[#64748B]">
                  {user.primaryEmailAddress && (
                    <div className="flex items-center gap-1.5 truncate">
                      <EnvelopeSimple size={13} className="shrink-0" />
                      <span className="truncate">{user.primaryEmailAddress.emailAddress}</span>
                    </div>
                  )}
                  {user.primaryPhoneNumber && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="shrink-0" />
                      <span>{user.primaryPhoneNumber.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:self-center shrink-0">
              <UserButton />
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-3xl p-6 shadow-xl border border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F97316]/20 text-[#F97316] uppercase tracking-wide border border-[#F97316]/30">
                  Guest User
                </span>
                <h2 className="text-xl font-bold mt-2 tracking-tight">Sign In to Your Account</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Log in to access your booked passes, offline QR code passes, and manage events.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <User size={24} className="text-white" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/20 active:scale-95"
                >
                  Create Free Account
                </button>
              </SignUpButton>
            </div>
          </div>
        )}

        {/* 2. My Booked Passes Hub */}
        <Link
          href="/my-tickets"
          className="group block bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-[#4F46E5]/50 hover:shadow-md transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Ticket size={24} weight="fill" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                  My Event Passes
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  View booked passes, show gate QR at the venue, and view offline tickets
                </p>
              </div>
            </div>
            <CaretRight size={20} weight="bold" className="text-slate-400 group-hover:text-[#4F46E5] transition-colors shrink-0" />
          </div>
        </Link>

        {/* 3. Role-Adaptive Organizer Card */}
        {isOrganizer ? (
          <div className="bg-gradient-to-br from-[#1E1B4B] to-[#0F172A] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-500/20 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] uppercase tracking-wide border border-[#10B981]/30">
                  Verified Host
                </span>
                <h3 className="text-lg font-bold mt-1.5 tracking-tight flex items-center gap-2">
                  <span>Organizer Studio</span>
                  <Buildings size={20} weight="duotone" className="text-indigo-400" />
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Manage your live events, attendees, and settlement wallet (85% pre-event withdrawable).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={getSubdomainUrl("org")}
                className="px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>Open Studio Dashboard</span>
                <CaretRight size={14} weight="bold" />
              </Link>
              <Link
                href={getSubdomainUrl("org", "/create")}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/20 active:scale-95 flex items-center gap-1.5"
              >
                <Plus size={14} weight="bold" />
                <span>Host Another Event</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#F05537]/10 text-[#F05537] flex items-center justify-center shrink-0">
                  <Sparkle size={24} weight="fill" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Host an Event on GetMyShow
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    0% platform fee on free seminars and cultural fests. Instant UPI payouts and automated QR gate scanner.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={getSubdomainUrl("org", "/create")}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F05537] hover:bg-[#E04426] text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Plus size={14} weight="bold" />
                <span>Host Your First Event (Free)</span>
              </Link>
            </div>
          </div>
        )}

        {/* 4. Location & Area Preferences */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0">
                <MapPin size={20} weight="fill" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Location & Area</h3>
                <p className="text-xs text-[#64748B]">
                  Current: <strong>{currentCity}, Bihar</strong>
                  <button
                    type="button"
                    onClick={() => openPickRegionModal()}
                    className="ml-2 font-bold text-[#F05537] hover:underline"
                  >
                    Change Region →
                  </button>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isGpsLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Crosshair size={14} weight="bold" className={isGpsLoading ? "animate-spin text-[#4F46E5]" : ""} />
              <span>{isGpsLoading ? "Locating..." : "Auto-Detect (GPS)"}</span>
            </button>
          </div>

          {gpsMessage && (
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-[#4F46E5] font-semibold flex items-center gap-2">
              <Info size={14} weight="bold" />
              <span>{gpsMessage}</span>
            </div>
          )}

          {/* Quick City Switcher */}
          <div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Select City in Bihar
            </div>
            <div className="flex flex-wrap gap-1.5">
              {BIHAR_CITIES.map((c) => {
                const isSelected = currentCity.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleCitySelect(c.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#4F46E5] text-white shadow-xs font-bold"
                        : "bg-slate-100 text-[#475569] hover:bg-slate-200"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Hyperlocal Bihar Support Desk */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-[#0F172A]">Need Help or Event Support?</h3>
          <p className="text-xs text-[#64748B]">
            Have an issue with ticket booking, UPI payment, or organizer onboarding? Our Sasaram & Rohtas team is ready to assist.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="https://wa.me/919876543210?text=Hi%20GetMyShow%20Support,%20I%20need%20assistance%20with%20my%20event%20booking"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <WhatsappLogo size={16} weight="fill" />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold transition-colors"
            >
              <span>Contact Desk</span>
            </Link>
          </div>
        </div>

        {/* 6. Legal & Trust Policies */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 divide-y divide-slate-100 shadow-xs text-xs">
          <Link
            href="/terms"
            className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-lg transition-colors text-[#334155] font-medium"
          >
            <span>Terms of Service</span>
            <CaretRight size={14} className="text-slate-400" />
          </Link>
          <Link
            href="/privacy"
            className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-lg transition-colors text-[#334155] font-medium"
          >
            <span>Privacy Policy</span>
            <CaretRight size={14} className="text-slate-400" />
          </Link>
          <Link
            href="/refund-policy"
            className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-lg transition-colors text-[#334155] font-medium"
          >
            <span>Refund & Cancellation Policy</span>
            <CaretRight size={14} className="text-slate-400" />
          </Link>
        </div>

        {/* 7. Sign Out Button */}
        {isSignedIn && (
          <div className="pt-2">
            <SignOutButton>
              <button
                type="button"
                className="w-full py-3 rounded-2xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <SignOut size={16} weight="bold" />
                <span>Log Out of GetMyShow</span>
              </button>
            </SignOutButton>
          </div>
        )}
      </div>
    </div>
  );
}
