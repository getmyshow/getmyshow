import Link from "next/link";
import Image from "next/image";
import { MapPin, PlusCircle, Ticket } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface-bg/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <Image
            src="/brand/logos/wordmark-primary.svg"
            alt="GetMyShow Logo"
            width={140}
            height={36}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Hyperlocal City Selector */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card border border-surface-border text-xs text-text-muted">
          <MapPin className="w-3.5 h-3.5 text-brand-saffron" />
          <span className="font-semibold text-text-primary">Sasaram</span>
          <span className="text-text-dim">• Rohtas</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/organizer"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-white px-3 py-2 transition"
          >
            <Ticket className="w-4 h-4 text-brand-indigo" />
            Organizer Portal
          </Link>
          <Link
            href="/organizer/create"
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-indigo hover:bg-brand-indigo-dark px-4 py-2 rounded-button shadow-glow transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Event</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

