"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Compass,
  MagnifyingGlass,
  Plus,
  Ticket,
  User,
} from "@phosphor-icons/react";
import { getSubdomainUrl } from "@/lib/domains";
import { checkUserRole } from "@/actions/events";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const [isOrganizer, setIsOrganizer] = useState(false);

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

  // Hide on event detail checkout pages (so sticky "Book Passes" bar gets full prominence)
  // and on gate scanner pages (so camera viewport has 100% space)
  if (
    pathname.startsWith("/e/") ||
    pathname.startsWith("/scan") ||
    pathname.startsWith("/poll/")
  ) {
    return null;
  }

  const isExploreActive = pathname === "/";
  const isSearchActive = pathname.startsWith("/search");
  const isPassesActive = pathname.startsWith("/my-tickets") || pathname.startsWith("/ticket");
  const isProfileActive = pathname.startsWith("/profile") || pathname.startsWith("/account");

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none px-3 pb-2"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      {/* Floating Glassmorphic Dock (navbar.gallery + animos.app) */}
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto max-w-md mx-auto bg-[#0F172A]/92 backdrop-blur-xl border border-white/12 rounded-2xl h-14 flex items-center justify-around px-2 shadow-2xl shadow-black/40 text-slate-400"
      >
        {/* 1. Explore (Home) */}
        <Link
          href="/"
          onClick={() => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className={`flex flex-col items-center justify-center min-w-[54px] py-1 transition-transform active:scale-90 ${
            isExploreActive ? "text-[#4F46E5] font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <Compass size={20} weight={isExploreActive ? "fill" : "regular"} />
          <span className="text-[10px] mt-0.5 tracking-tight">Explore</span>
        </Link>

        {/* 2. Search (Dedicated Search Page) */}
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center min-w-[54px] py-1 transition-transform active:scale-90 ${
            isSearchActive ? "text-[#4F46E5] font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <MagnifyingGlass size={20} weight={isSearchActive ? "bold" : "regular"} />
          <span className="text-[10px] mt-0.5 tracking-tight">Search</span>
        </Link>

        {/* 3. Host (Elevated Saffron/Indigo Action) */}
        <Link
          href={getSubdomainUrl("org", "/create")}
          className="flex flex-col items-center justify-center min-w-[54px] py-1 text-white font-bold transition-transform active:scale-90 -mt-5"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#F05537] to-[#F97316] text-white flex items-center justify-center shadow-lg shadow-orange-500/35 border-2 border-[#0F172A]">
            <Plus size={20} weight="bold" />
          </div>
          <span className="text-[10px] mt-0.5 font-extrabold text-[#F97316] tracking-tight">Host</span>
        </Link>

        {/* 4. Passes (My Tickets) */}
        <Link
          href="/my-tickets"
          className={`flex flex-col items-center justify-center min-w-[54px] py-1 transition-transform active:scale-90 ${
            isPassesActive ? "text-[#10B981] font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <Ticket size={20} weight={isPassesActive ? "fill" : "regular"} />
          <span className="text-[10px] mt-0.5 tracking-tight">Passes</span>
        </Link>

        {/* 5. Profile (User Profile, Wishlist & Settings) */}
        <Link
          href="/profile"
          className={`relative flex flex-col items-center justify-center min-w-[54px] py-1 transition-transform active:scale-90 ${
            isProfileActive ? "text-[#4F46E5] font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <div className="relative">
            <User size={20} weight={isProfileActive ? "fill" : "regular"} />
            {isOrganizer && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#4F46E5] ring-2 ring-[#0F172A]" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
