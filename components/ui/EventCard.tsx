"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarBlank,
  MapPinLine,
  Heart,
  CurrencyInr,
  Sparkle,
  UsersThree,
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
    <article className="group bg-white rounded-[40px] border border-[#DBDAE3] overflow-hidden hover:border-[#BEC0C6] hover:shadow-[0_4px_24px_-4px_rgba(30,10,60,0.08)] transition-all duration-300 flex flex-col h-full">
      {/* 16:9 Poster Image Container with 40px Top Radius */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#EEEDF2]">
        {event.poster_url ? (
          <Image
            src={event.poster_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#dee5ff] to-[#eeedf2] text-[#6F7287]">
            <span className="text-xs font-bold uppercase tracking-wider">GetMyShow Event</span>
          </div>
        )}

        {/* Ambient Gradient for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Floating Top Left Badge (City / Status) */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
          <span className="px-3 py-1 rounded-[20px] text-xs font-bold bg-white/95 backdrop-blur-md text-[#39364F] shadow-xs border border-[#DBDAE3]/60">
            {event.city}
          </span>
          {isAlmostFull && (
            <span className="px-2.5 py-0.5 rounded-[20px] text-[10px] font-extrabold uppercase bg-[#F05537] text-white flex items-center gap-1 shadow-xs">
              <Sparkle size={12} weight="fill" />
              Fast Filling
            </span>
          )}
        </div>

        {/* Floating Top Right Save Heart Button */}
        <button
          type="button"
          aria-label="Save this event"
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className={`absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xs ${
            isSaved
              ? "bg-[#F05537] text-white"
              : "bg-white/95 text-[#39364F] hover:text-[#F05537] hover:bg-white"
          }`}
        >
          <Heart size={18} weight={isSaved ? "fill" : "bold"} />
        </button>

        {/* Seats Capacity Pill (Bottom Left) */}
        <div className="absolute bottom-3 left-3.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-white font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{event.tickets_sold} / {event.total_capacity} Passes</span>
          </div>
        </div>
      </div>

      {/* Pillow-Soft Card Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          {/* Date & Time in Electric Iris */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3659E3] uppercase tracking-wide">
            <CalendarBlank size={15} weight="bold" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>

          {/* Event Title in Plum Depth */}
          <h3 className="text-base font-bold text-[#1E0A3C] leading-snug line-clamp-2 group-hover:text-[#3659E3] transition-colors">
            <Link href={`/e/${event.slug}`}>{event.title}</Link>
          </h3>

          {/* Venue Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#6F7287]">
            <MapPinLine size={15} className="shrink-0 text-[#6F7287]" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Card Footer: Organizer & Ticket Price */}
        <div className="pt-3 border-t border-[#EEEDF2] flex items-center justify-between gap-2 mt-auto">
          <span className="text-xs text-[#6F7287] truncate max-w-[150px]">
            By <strong className="text-[#39364F] font-semibold">{event.organizer_name}</strong>
          </span>

          <div className="flex items-center font-bold text-sm text-[#1E0A3C] shrink-0">
            {event.ticket_price === 0 ? (
              <span className="text-emerald-600 font-extrabold uppercase text-xs">Free Admission</span>
            ) : (
              <span>From {formatINR(event.ticket_price)}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
