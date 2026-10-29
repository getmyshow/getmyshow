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
} from "@clerk/nextjs";
import {
  User,
  PencilSimple,
  Bag,
  Heart,
  Headset,
  MapPin,
  WhatsappLogo,
  ShieldCheck,
  SignOut,
  CaretRight,
  Sparkle,
  EnvelopeSimple,
  Ticket,
  X,
  ShareNetwork,
  Buildings,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react";
import { checkUserRole, getEvents } from "@/actions/events";
import { getSubdomainUrl } from "@/lib/domains";
import { getUserStoredCity, openPickRegionModal } from "@/lib/geo";
import { EventItem } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentCity, setCurrentCity] = useState("Sasaram");
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  // Wishlist state (reading event slugs/ids that user marked "Interested")
  const [wishlistEvents, setWishlistEvents] = useState<EventItem[]>([]);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);

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

  // Fetch events to resolve wishlist slugs into full event cards
  useEffect(() => {
    getEvents().then((res) => {
      if (res.success && res.data) {
        setAllEvents(res.data);
      }
    });
  }, []);

  // Sync wishlist from localStorage
  useEffect(() => {
    if (typeof window === "undefined" || allEvents.length === 0) return;

    try {
      const savedWishlist: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("gms_interested_") && localStorage.getItem(key) === "true") {
          savedWishlist.push(key.replace("gms_interested_", ""));
        }
      }

      // Also check explicit gms_wishlist array
      const rawArray = localStorage.getItem("gms_wishlist");
      if (rawArray) {
        const parsed = JSON.parse(rawArray);
        if (Array.isArray(parsed)) {
          parsed.forEach((id: string) => {
            if (!savedWishlist.includes(id)) savedWishlist.push(id);
          });
        }
      }

      const matched = allEvents.filter(
        (ev) => savedWishlist.includes(ev.id) || savedWishlist.includes(ev.slug)
      );
      setWishlistEvents(matched);
    } catch {}
  }, [allEvents]);

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

  const handleRemoveFromWishlist = (eventIdentifier: string) => {
    try {
      localStorage.removeItem(`gms_interested_${eventIdentifier}`);
      const rawArray = localStorage.getItem("gms_wishlist");
      if (rawArray) {
        const parsed = JSON.parse(rawArray).filter((id: string) => id !== eventIdentifier);
        localStorage.setItem("gms_wishlist", JSON.stringify(parsed));
      }
      setWishlistEvents((prev) => prev.filter((ev) => ev.id !== eventIdentifier && ev.slug !== eventIdentifier));
    } catch {}
  };

  const displayName = user?.firstName || (user?.fullName ? user.fullName.split(" ")[0] : null);

  return (
    <div className="min-h-screen bg-[#F4F5FA] pb-24 md:pb-16 font-sans">
      <div className="max-w-xl mx-auto px-4 pt-6 space-y-4">
        {/* 1. Profile Header Card matching reference */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.fullName || "User"}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                <User size={30} weight="regular" />
              </div>
            )}

            <div>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tight">
                {displayName ? `Hey, ${displayName}!` : "Hey!"}
              </h1>

              {isSignedIn ? (
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:underline mt-0.5"
                >
                  <span>Edit Profile</span>
                  <PencilSimple size={13} weight="bold" />
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button className="text-xs font-bold text-[#4F46E5] hover:underline mt-0.5">
                    Sign in to your account →
                  </button>
                </SignInButton>
              )}
            </div>
          </div>

          {!isSignedIn && (
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-xs transition-all active:scale-95">
                Login
              </button>
            </SignInButton>
          )}
        </div>

        {/* 2. "Never lose a ticket" Notification Card */}
        {isSignedIn && !user?.primaryEmailAddress?.emailAddress && (
          <div className="bg-gradient-to-r from-indigo-50 to-orange-50/50 rounded-2xl border border-indigo-100 p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-800">
                Never lose a ticket
              </h3>
              <p className="text-[11px] text-slate-500">
                Add your email address to receive pass confirmations & backups.
              </p>
            </div>
            <Link
              href="/profile/edit"
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#4F46E5] shadow-2xs hover:bg-slate-50 transition shrink-0"
            >
              Add Email
            </Link>
          </div>
        )}

        {/* 3. Core Activity Group: Bookings & Wishlist */}
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {/* Your Bookings & Purchases */}
          <Link
            href="/my-tickets"
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Bag size={20} weight="regular" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-slate-800 group-hover:text-[#4F46E5] transition-colors">
                  Your Bookings & Purchases
                </span>
                <span className="block text-[11px] text-slate-400">
                  Instant access to HMAC QR entry passes
                </span>
              </div>
            </div>
            <CaretRight size={18} className="text-slate-400 group-hover:text-slate-700 transition" />
          </Link>

          {/* Your Wishlist */}
          <button
            type="button"
            onClick={() => setIsWishlistModalOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart size={20} weight="regular" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-[#4F46E5] transition-colors">
                    Your Wishlist
                  </span>
                  {wishlistEvents.length > 0 && (
                    <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-600 text-[10px] font-extrabold">
                      {wishlistEvents.length}
                    </span>
                  )}
                </div>
                <span className="block text-[11px] text-slate-400">
                  Events you marked &ldquo;Interested?&rdquo;
                </span>
              </div>
            </div>
            <CaretRight size={18} className="text-slate-400 group-hover:text-slate-700 transition" />
          </button>
        </div>

        {/* 4. Organizer Studio Banner (Role-Aware) */}
        {isOrganizer ? (
          <div className="bg-gradient-to-tr from-[#0F172A] to-[#1E293B] rounded-2xl border border-slate-800 p-5 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F97316]/20 text-[#F97316] flex items-center justify-center">
                  <Sparkle size={15} weight="fill" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#F97316]">
                  Verified Organizer Studio
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Active Host
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Manage your live fests, gate staff scanner PINs, attendee lists, and T+2 wallet bank settlements.
            </p>

            <div className="pt-1 flex gap-2.5">
              <Link
                href={getSubdomainUrl("org")}
                className="flex-1 py-2 px-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold text-center transition"
              >
                Organizer Studio →
              </Link>
              <Link
                href={getSubdomainUrl("org", "/create")}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition border border-white/15"
              >
                + New Event
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
                <Buildings size={20} weight="regular" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-slate-800">
                  List Your Show on GetMyShow
                </span>
                <span className="block text-[11px] text-slate-400">
                  Host seminars & fests with ₹0 platform cost
                </span>
              </div>
            </div>
            <Link
              href={getSubdomainUrl("org", "/create")}
              className="text-xs font-bold text-[#4F46E5] hover:underline"
            >
              List Free →
            </Link>
          </div>
        )}

        {/* 5. Account & Location Settings Group */}
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {/* Active City Location */}
          <button
            type="button"
            onClick={openPickRegionModal}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
                <MapPin size={20} weight="regular" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-slate-800">
                  My Location ({currentCity})
                </span>
                <span className="block text-[11px] text-slate-400">
                  Tap to change your active Bihar city
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#4F46E5] group-hover:underline">
              Change →
            </span>
          </button>

          {/* WhatsApp Ticket Notifications Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <WhatsappLogo size={20} weight="regular" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-slate-800">
                  WhatsApp Ticket Notifications
                </span>
                <span className="block text-[11px] text-slate-400">
                  Instant HMAC QR entry passes sent to your WhatsApp
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={whatsappNotifications}
              onChange={(e) => setWhatsappNotifications(e.target.checked)}
              className="w-5 h-5 accent-[#4F46E5] rounded cursor-pointer"
            />
          </div>

          {/* 24/7 Help Centre */}
          <a
            href="https://wa.me/919876543210?text=Hi%20GetMyShow%20Grievance%20Desk%2C%20I%20need%20help"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Headset size={20} weight="regular" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-slate-800 group-hover:text-[#4F46E5] transition-colors">
                  Help Centre & Grievance Desk
                </span>
                <span className="block text-[11px] text-slate-400">
                  24/7 live assistance on WhatsApp
                </span>
              </div>
            </div>
            <CaretRight size={18} className="text-slate-400 group-hover:text-slate-700 transition" />
          </a>
        </div>

        {/* 6. Legal & Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
          <Link
            href="/terms"
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <span className="text-xs font-medium text-slate-700 group-hover:text-[#4F46E5]">
              Terms & Conditions
            </span>
            <CaretRight size={16} className="text-slate-400" />
          </Link>
          <Link
            href="/privacy"
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <span className="text-xs font-medium text-slate-700 group-hover:text-[#4F46E5]">
              Privacy Policy (DPDP Act)
            </span>
            <CaretRight size={16} className="text-slate-400" />
          </Link>
        </div>

        {/* 7. Sign Out Action */}
        {isSignedIn && (
          <div className="pt-2">
            <SignOutButton>
              <button className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200/80 text-rose-600 hover:bg-rose-50/50 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs">
                <SignOut size={16} weight="bold" />
                <span>Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        )}
      </div>

      {/* WISHLIST MODAL DIALOG */}
      {isWishlistModalOpen && (
        <div className="fixed inset-0 z-[1100] bg-black/65 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg h-[100dvh] sm:h-[85vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="h-14 px-5 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setIsWishlistModalOpen(false)}
                className="p-1.5 -ml-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100"
              >
                <X size={20} weight="bold" />
              </button>
              <h2 className="text-base font-extrabold text-[#0F172A]">
                Your Wishlist ({wishlistEvents.length})
              </h2>
              <div className="w-6" />
            </div>

            {/* Wishlist Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {wishlistEvents.length > 0 ? (
                wishlistEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex gap-3 relative group"
                  >
                    {/* Poster */}
                    <div className="w-20 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                      <Image
                        src={ev.poster_url || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400"}
                        alt={ev.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-2 pr-6">
                          <h3 className="text-xs font-bold text-[#0F172A] line-clamp-2">
                            {ev.title}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          📍 {ev.venue}, {ev.city}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                          ₹{ev.ticket_price} onwards
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        <Link
                          href={`/e/${ev.slug}`}
                          onClick={() => setIsWishlistModalOpen(false)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold text-center transition"
                        >
                          Book Now
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: ev.title,
                                url: `${window.location.origin}/e/${ev.slug}`,
                              });
                            } else {
                              navigator.clipboard.writeText(`${window.location.origin}/e/${ev.slug}`);
                              alert("Event link copied to clipboard!");
                            }
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                          aria-label="Share"
                        >
                          <ShareNetwork size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFromWishlist(ev.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-100 transition"
                      aria-label="Remove from wishlist"
                    >
                      <X size={15} weight="bold" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
                    <Heart size={32} weight="regular" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">
                    Your Wishlist is Empty
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Tap the &ldquo;Interested?&rdquo; button on any seminar, fest or concert to save it here for quick access.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsWishlistModalOpen(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-bold transition"
                  >
                    Explore Events
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
