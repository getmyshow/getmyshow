"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, MagnifyingGlass, Plus, Ticket, Buildings } from "@phosphor-icons/react";
import { getSubdomainUrl } from "@/lib/domains";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide on event detail checkout pages (so sticky "Book Passes" bar gets full prominence)
  // and on gate scanner pages (so camera viewport has 100% space)
  if (
    pathname.startsWith("/e/") ||
    pathname.startsWith("/scan") ||
    pathname.startsWith("/poll/")
  ) {
    return null;
  }

  const handleSearchClick = () => {
    // If on homepage, scroll to top and focus search, otherwise navigate to search
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement | null;
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 250);
      }
    } else {
      router.push("/#events");
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#DBDAE3] h-14 flex items-center justify-around px-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* 1. Explore */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
          pathname === "/" ? "text-[#4F46E5] font-bold" : "text-[#64748B] font-medium"
        }`}
      >
        <Compass size={20} weight={pathname === "/" ? "fill" : "regular"} />
        <span className="text-[10px] mt-0.5">Explore</span>
      </Link>

      {/* 2. Search */}
      <button
        type="button"
        onClick={handleSearchClick}
        className="flex flex-col items-center justify-center min-w-[56px] py-1 text-[#64748B] font-medium transition-colors"
      >
        <MagnifyingGlass size={20} />
        <span className="text-[10px] mt-0.5">Search</span>
      </button>

      {/* 3. Host (Elevated Saffron Action) */}
      <Link
        href={getSubdomainUrl("org", "/create")}
        className="flex flex-col items-center justify-center min-w-[56px] py-1 text-[#F05537] font-bold transition-transform active:scale-90"
      >
        <div className="w-8 h-8 rounded-full bg-[#F05537] text-white flex items-center justify-center shadow-md -mt-3 border-2 border-white">
          <Plus size={16} weight="bold" />
        </div>
        <span className="text-[10px] mt-0.5">Host</span>
      </Link>

      {/* 4. Passes */}
      <Link
        href="/my-tickets"
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
          pathname.startsWith("/my-tickets") ? "text-[#4F46E5] font-bold" : "text-[#64748B] font-medium"
        }`}
      >
        <Ticket size={20} weight={pathname.startsWith("/my-tickets") ? "fill" : "regular"} />
        <span className="text-[10px] mt-0.5">Passes</span>
      </Link>

      {/* 5. Studio */}
      <Link
        href={getSubdomainUrl("org")}
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
          pathname.startsWith("/organizer") ? "text-[#4F46E5] font-bold" : "text-[#64748B] font-medium"
        }`}
      >
        <Buildings size={20} weight={pathname.startsWith("/organizer") ? "fill" : "regular"} />
        <span className="text-[10px] mt-0.5">Studio</span>
      </Link>
    </nav>
  );
}
