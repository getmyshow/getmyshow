"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Compass,
  MagnifyingGlass,
  PlusCircle,
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
  const isHostActive = pathname.startsWith("/organizer/create");
  const isPassesActive = pathname.startsWith("/my-tickets") || pathname.startsWith("/ticket");
  const isProfileActive = pathname.startsWith("/profile") || pathname.startsWith("/account");

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EAEAEA] shadow-[0_-2px_10px_rgba(0,0,0,0.04)] select-none"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 6px)" }}
    >
      <div className="grid grid-cols-5 h-14 items-center">
        {/* 1. Explore (Home) */}
        <Link
          href="/"
          onClick={() => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className={`flex flex-col items-center justify-center h-full transition-transform active:scale-95 ${
            isExploreActive ? "text-[#4F46E5]" : "text-[#374151] hover:text-[#0F172A]"
          }`}
        >
          <Compass
            size={22}
            weight={isExploreActive ? "fill" : "regular"}
            className={isExploreActive ? "text-[#4F46E5]" : "text-[#374151]"}
          />
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              isExploreActive ? "font-bold text-[#4F46E5]" : "font-medium text-[#4B5563]"
            }`}
          >
            Explore
          </span>
        </Link>

        {/* 2. Search */}
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center h-full transition-transform active:scale-95 ${
            isSearchActive ? "text-[#4F46E5]" : "text-[#374151] hover:text-[#0F172A]"
          }`}
        >
          <MagnifyingGlass
            size={22}
            weight={isSearchActive ? "bold" : "regular"}
            className={isSearchActive ? "text-[#4F46E5]" : "text-[#374151]"}
          />
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              isSearchActive ? "font-bold text-[#4F46E5]" : "font-medium text-[#4B5563]"
            }`}
          >
            Search
          </span>
        </Link>

        {/* 3. Host */}
        <Link
          href={getSubdomainUrl("org", "/create")}
          className={`flex flex-col items-center justify-center h-full transition-transform active:scale-95 ${
            isHostActive ? "text-[#4F46E5]" : "text-[#374151] hover:text-[#0F172A]"
          }`}
        >
          <PlusCircle
            size={22}
            weight={isHostActive ? "fill" : "regular"}
            className={isHostActive ? "text-[#4F46E5]" : "text-[#374151]"}
          />
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              isHostActive ? "font-bold text-[#4F46E5]" : "font-medium text-[#4B5563]"
            }`}
          >
            Host
          </span>
        </Link>

        {/* 4. Passes */}
        <Link
          href="/my-tickets"
          className={`flex flex-col items-center justify-center h-full transition-transform active:scale-95 ${
            isPassesActive ? "text-[#4F46E5]" : "text-[#374151] hover:text-[#0F172A]"
          }`}
        >
          <Ticket
            size={22}
            weight={isPassesActive ? "fill" : "regular"}
            className={isPassesActive ? "text-[#4F46E5]" : "text-[#374151]"}
          />
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              isPassesActive ? "font-bold text-[#4F46E5]" : "font-medium text-[#4B5563]"
            }`}
          >
            Passes
          </span>
        </Link>

        {/* 5. Profile */}
        <Link
          href="/profile"
          className={`relative flex flex-col items-center justify-center h-full transition-transform active:scale-95 ${
            isProfileActive ? "text-[#4F46E5]" : "text-[#374151] hover:text-[#0F172A]"
          }`}
        >
          <div className="relative">
            <User
              size={22}
              weight={isProfileActive ? "fill" : "regular"}
              className={isProfileActive ? "text-[#4F46E5]" : "text-[#374151]"}
            />
            {isOrganizer && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
            )}
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              isProfileActive ? "font-bold text-[#4F46E5]" : "font-medium text-[#4B5563]"
            }`}
          >
            Profile
          </span>
        </Link>
      </div>

      {/* 
        Solid Pure White Bottom Extension / Skirt
        Hangs 160px below the bottom edge to permanently seal the viewport boundary.
        Guarantees 0% background bleed during overscroll, URL bar collapse,
        gesture navigation, or varying Android device chin heights.
      */}
      <div
        aria-hidden="true"
        className="absolute top-full left-0 right-0 h-40 bg-white pointer-events-none"
      />
    </nav>
  );
}
