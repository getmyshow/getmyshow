import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { EventItem } from "@/types";
import { formatINR, formatDateIST } from "@/lib/utils";

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  const isAlmostFull =
    event.total_capacity > 0 &&
    (event.total_capacity - event.tickets_sold) / event.total_capacity < 0.2;

  return (
    <div className="ticket-scallop-card group transition-all duration-300 hover:border-brand-indigo/50 hover:shadow-glow flex flex-col">
      <div className="ticket-notch-left" />
      <div className="ticket-notch-right" />

      {/* Poster Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        {event.poster_url ? (
          <Image
            src={event.poster_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-elevated to-surface-card text-text-dim">
            <span className="text-sm font-semibold tracking-wide">GetMyShow Event</span>
          </div>
        )}

        {/* Category / Status Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-bg/80 backdrop-blur-md text-white border border-surface-border">
            {event.city}
          </span>
          {isAlmostFull && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-saffron text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Fast Filling
            </span>
          )}
        </div>

        {/* Pricing Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-button bg-surface-bg/90 backdrop-blur-md border border-brand-indigo/40 text-brand-indigo-dark font-mono font-bold text-sm shadow-md">
          {event.ticket_price === 0 ? "FREE" : formatINR(event.ticket_price)}
        </div>
      </div>

      {/* Ticket Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-brand-indigo transition-colors line-clamp-1">
            {event.title}
          </h3>

          <div className="mt-3 space-y-1.5 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
              <span>{formatDateIST(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-saffron shrink-0" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between gap-3">
          <div className="text-xs text-text-dim font-medium">
            <span>By </span>
            <span className="text-text-muted font-semibold">{event.organizer_name}</span>
          </div>

          <Link
            href={`/e/${event.slug}`}
            className="px-4 py-2 rounded-button text-xs font-bold bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-glow transition active:scale-95"
          >
            Get Pass
          </Link>
        </div>
      </div>
    </div>
  );
}

