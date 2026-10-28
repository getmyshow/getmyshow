"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarBlank,
  MapPinLine,
  BookmarkSimple,
  Sparkle,
  Ticket,
} from "@phosphor-icons/react";
import { EventItem } from "@/types";
import { formatINR } from "@/lib/utils";

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const isAlmostFull =
    event.total_capacity > 0 &&
    (event.total_capacity - event.tickets_sold) / event.total_capacity < 0.25;

  const eventDateObj = new Date(event.event_date);
  const formattedDate = eventDateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  }).toUpperCase();

  const formattedTime = eventDateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  return (
    <article className="group bg-white rounded-xl border border-[#DBDAE3] overflow-hidden hover:border-[#BEC0C6] hover:shadow-[0_6px_24px_-4px_rgba(30,10,60,0.08)] transition-all duration-200 flex flex-col h-full">
      {/* 16:9 Poster Image Container with Modern 12px Radius Top */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#EEEDF2]">
        {event.poster_url ? (
          <Image
            src={event.poster_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#dee5ff] to-[#eeedf2] text-[#6F7287]">
            <span className="text-xs font-bold uppercase tracking-wider">GetMyShow Event</span>
          </div>
        )}

        {/* Ambient Dark Gradient for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Floating Top Left Badge (City & Status) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white/95 backdrop-blur-md text-[#39364F] shadow-xs border border-[#DBDAE3]/60">
            {event.city}
          </span>
          {isAlmostFull && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[#F05537] text-white flex items-center gap-1 shadow-xs">
              <Sparkle size={12} weight="fill" />
              Fast Filling
            </span>
          )}
        </div>

        {/* Floating Top Right Bookmark Button (Rectangular with curved radius - No Ovals) */}
        <button
          type="button"
          aria-label="Save this event"
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-md flex items-center justify-center transition-all shadow-xs border ${
            isSaved
              ? "bg-[#F05537] text-white border-[#F05537]"
              : "bg-white/95 text-[#39364F] hover:text-[#F05537] hover:bg-white border-[#DBDAE3]/80"
          }`}
        >
          <BookmarkSimple size={18} weight={isSaved ? "fill" : "bold"} />
        </button>

        {/* Seats Capacity Badge (Bottom Left) */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-[11px] text-white font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{event.tickets_sold} / {event.total_capacity} Passes Sold</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          {/* Date & Time in Electric Iris */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3659E3] uppercase tracking-wide">
            <CalendarBlank size={14} weight="bold" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>

          {/* Event Title in Plum Depth */}
          <h3 className="text-base font-bold text-[#1E0A3C] leading-snug line-clamp-2 group-hover:text-[#3659E3] transition-colors">
            <Link href={`/e/${event.slug}`}>{event.title}</Link>
          </h3>

          {/* Venue Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#6F7287]">
            <MapPinLine size={14} className="shrink-0 text-[#6F7287]" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Card Footer: Organizer & Ticket Price with Action CTA */}
        <div className="pt-3 border-t border-[#EEEDF2] flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#6F7287]">Starting from</span>
            <span className="text-base font-extrabold text-[#1E0A3C] tabular-nums">
              {event.ticket_price === 0 ? "FREE" : formatINR(event.ticket_price)}
            </span>
          </div>

          <Link
            href={`/e/${event.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#F05537] hover:bg-[#D94428] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Ticket size={14} weight="bold" />
            <span>Get Passes</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
