"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Ticket, MapPin, CalendarBlank } from "@phosphor-icons/react";
import { EventItem } from "@/types";
import { formatINR } from "@/lib/utils";

interface SimilarEventsCarouselProps {
  currentEventId: string;
  currentCity: string;
  allEvents: EventItem[];
}

export default function SimilarEventsCarousel({
  currentEventId,
  currentCity,
  allEvents,
}: SimilarEventsCarouselProps) {
  // Find related events in the same city or neighboring Bihar regions, excluding current event
  const similarEvents = allEvents
    .filter((e) => e.id !== currentEventId)
    .sort((a, b) => {
      // Prioritize same city first
      if (a.city.toLowerCase() === currentCity.toLowerCase()) return -1;
      if (b.city.toLowerCase() === currentCity.toLowerCase()) return 1;
      return 0;
    })
    .slice(0, 6);

  if (similarEvents.length === 0) return null;

  return (
    <div className="space-y-3 pt-2">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
          You May Also Like
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Events around you in {currentCity} & Bihar, book now
        </p>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-1 snap-x">
        {similarEvents.map((ev) => {
          const dateStr = new Date(ev.event_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            timeZone: "Asia/Kolkata",
          });

          return (
            <Link
              key={ev.id}
              href={`/e/${ev.slug}`}
              className="group shrink-0 w-36 sm:w-44 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#4F46E5]/40 transition-all flex flex-col snap-start active:scale-95"
            >
              {/* Vertical 3:4 Poster Banner */}
              <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden">
                {ev.poster_url ? (
                  <Image
                    src={ev.poster_url}
                    alt={ev.title}
                    fill
                    sizes="(max-width: 640px) 144px, 176px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                    <Ticket size={28} />
                  </div>
                )}

                {/* City Tag on Top */}
                <span className="absolute top-2 left-2 bg-[#0F172A]/85 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                  {ev.city}
                </span>

                {/* Price Tag on Bottom */}
                <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[10px] font-black text-[#0F172A] shadow-xs">
                  {ev.ticket_price === 0 ? "FREE" : formatINR(ev.ticket_price)}
                </div>
              </div>

              {/* Event Details */}
              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-1">
                <h3 className="text-xs font-bold text-[#0F172A] line-clamp-2 leading-snug group-hover:text-[#4F46E5] transition-colors">
                  {ev.title}
                </h3>
                <div className="space-y-0.5 pt-1 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1 truncate">
                    <CalendarBlank size={11} className="shrink-0 text-slate-400" />
                    <span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <MapPin size={11} className="shrink-0 text-slate-400" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
