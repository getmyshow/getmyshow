"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Share2, Ticket, ArrowLeft, Users, ShieldCheck } from "lucide-react";
import { EventItem } from "@/types";
import { formatINR, formatDateIST } from "@/lib/utils";
import CheckoutModal from "@/components/checkout/CheckoutModal";

interface EventDetailViewProps {
  event: EventItem;
}

export default function EventDetailView({ event }: EventDetailViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Get your pass for ${event.title} in ${event.city} on GetMyShow!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  };

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 pt-6 space-y-8">
      {/* Back Navigation & Share */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        <button
          onClick={handleShare}
          className="p-2 rounded-full bg-surface-card border border-surface-border text-text-muted hover:text-white transition"
          title="Share Event"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Scalloped Event Hero Ticket */}
      <div className="ticket-scallop-card">
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />

        {/* Poster */}
        <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
          {event.poster_url ? (
            <Image
              src={event.poster_url}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-elevated to-surface-card text-text-dim">
              <span className="text-base font-semibold">GetMyShow Verified Pass</span>
            </div>
          )}

          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-surface-bg/80 backdrop-blur-md text-white border border-surface-border">
            {event.city}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">
              Official Entry Pass
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              {event.title}
            </h1>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-card bg-surface-elevated/70 border border-surface-border">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-brand-indigo shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-text-dim font-medium uppercase tracking-wide">
                  Date & Time
                </span>
                <p className="text-sm font-semibold text-white">
                  {formatDateIST(event.event_date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-saffron shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-text-dim font-medium uppercase tracking-wide">
                  Venue Location
                </span>
                <p className="text-sm font-semibold text-white">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
              About This Event
            </h3>
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
              {event.description || "Join us for this premier event in Sasaram. Book your passes online to secure admission."}
            </p>
          </div>

          {/* Organizer Meta */}
          <div className="pt-4 border-t border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-indigo/20 flex items-center justify-center text-brand-indigo font-bold text-sm">
                {event.organizer_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-text-dim">Organized by</p>
                <p className="text-sm font-bold text-white">{event.organizer_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Organizer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-card/95 backdrop-blur-md border-t border-surface-border p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-text-dim block">Pass Price</span>
            <span className="text-xl font-extrabold text-white font-mono">
              {event.ticket_price === 0 ? "FREE" : formatINR(event.ticket_price)}
            </span>
            <span className="text-[10px] text-text-muted ml-1.5">/ person</span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 rounded-button font-bold text-sm bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-glow transition active:scale-95 flex items-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Passes</span>
          </button>
        </div>
      </div>

      {/* Checkout Sheet */}
      <CheckoutModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

