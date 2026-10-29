"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Ticket,
  Plus,
  QrCode,
  ChartLineUp,
  ShieldCheck,
  Lightning,
  UsersThree,
  Wallet,
  ArrowRight,
  ArrowSquareOut,
  Sparkle,
  ArrowsClockwise,
  CalendarBlank,
  MapPinLine,
} from "@phosphor-icons/react";
import { getOrganizerEvents } from "@/actions/events";
import { EventItem } from "@/types";
import { formatINR } from "@/lib/utils";
import EmptyEventsIllustration from "@/components/illustrations/EmptyEventsIllustration";

export default function OrganizerLandingPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const phone = user?.primaryPhoneNumber?.phoneNumber;

      // Query organizer events
      const res = await getOrganizerEvents({ email, phone });
      if (res.success) {
        setEvents(res.data);
      } else {
        // Fallback: load all events if filtered returns empty
        const fallbackRes = await getOrganizerEvents();
        if (fallbackRes.success) {
          setEvents(fallbackRes.data);
        } else {
          setErrorMsg(fallbackRes.error || res.error || "Failed to load events.");
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error loading events.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchEvents();
    }
  }, [isLoaded, user]);

  // Aggregate Metrics Across Organizer Events
  const totalGMV = events.reduce((sum, ev) => {
    const directSales = (Number(ev.tickets_sold) || 0) * (Number(ev.ticket_price) || 0);
    const ledgerTotal =
      Number(ev.wallet_available || 0) +
      Number(ev.wallet_pending_settlement || 0) +
      Number(ev.wallet_total_withdrawn || 0);
    return sum + Math.max(directSales, ledgerTotal);
  }, 0);

  const totalTicketsIssued = events.reduce((sum, ev) => sum + (Number(ev.tickets_sold) || 0), 0);
  const totalCapacity = events.reduce((sum, ev) => sum + (Number(ev.total_capacity) || 0), 0);
  const overallOccupancy = totalCapacity > 0 ? Math.min(100, Math.round((totalTicketsIssued / totalCapacity) * 100)) : 0;
  const totalWalletAvailable = events.reduce((sum, ev) => sum + (Number(ev.wallet_available) || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#39364F]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#DBDAE3]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#3659E3]/10 text-[#3659E3] text-xs font-bold mb-2">
              <Ticket size={16} weight="duotone" />
              <span>Organizer Studio & Box-Office</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E0A3C]">
              {user?.fullName ? `Welcome Back, ${user.firstName || user.fullName}` : "Welcome Back, Organizer"}
            </h1>
            <p className="text-sm text-[#6F7287] mt-1">
              Manage your live ticket sales, gate scanning crew, and T+2 wallet settlements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchEvents}
              className="p-3 rounded-lg border border-[#DBDAE3] hover:bg-slate-50 text-[#1E0A3C] transition shadow-xs"
              title="Refresh events"
            >
              <ArrowsClockwise size={18} weight="bold" className={isLoading ? "animate-spin text-[#3659E3]" : ""} />
            </button>

            <Link
              href="/organizer/create"
              className="px-5 py-3 rounded-lg bg-[#F05537] hover:bg-[#D94428] text-white font-bold text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus size={18} weight="bold" />
              <span>Create New Event</span>
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards with Live Aggregates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Gross GMV</span>
              <div className="w-9 h-9 rounded-md bg-[#3659E3]/10 text-[#3659E3] flex items-center justify-center">
                <ChartLineUp size={22} weight="duotone" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1E0A3C]">{formatINR(totalGMV)}</div>
            <p className="text-xs text-[#6F7287]">
              Across {events.length} {events.length === 1 ? "event" : "events"} in your studio
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Tickets Issued</span>
              <div className="w-9 h-9 rounded-md bg-[#F05537]/10 text-[#F05537] flex items-center justify-center">
                <Ticket size={22} weight="duotone" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1E0A3C]">
              {totalTicketsIssued} / {totalCapacity}
            </div>
            <p className="text-xs text-emerald-600 font-semibold">{overallOccupancy}% overall occupancy rate</p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Wallet Balance</span>
              <div className="w-9 h-9 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Wallet size={22} weight="duotone" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1E0A3C]">{formatINR(totalWalletAvailable)}</div>
            <p className="text-xs text-[#6F7287]">T+2 Bank Settlement Automated</p>
          </div>
        </div>

        {/* Active Events Table in Modern 16px Card */}
        <div className="bg-white rounded-2xl border border-[#DBDAE3] shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1E0A3C]">Your Active Events</h2>
              <p className="text-xs text-[#6F7287]">Click any event to open its live analytics dashboard & wallet ledger.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-[#F8F7FA] rounded-xl border border-[#EEEDF2]" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="py-14 text-center space-y-4">
              <EmptyEventsIllustration className="w-56 h-40 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-[#1E0A3C]">No Events Published Yet</h3>
                <p className="text-xs text-[#6F7287] mt-1 max-w-sm mx-auto">
                  Get your first event live in Sasaram or anywhere in Bihar within 60 seconds with 0% organizer platform fees.
                </p>
              </div>
              <Link
                href="/organizer/create"
                className="px-5 py-2.5 rounded-lg bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus size={16} weight="bold" />
                <span>Create Your First Event</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#EEEDF2]">
              {events.map((ev) => {
                const isPast = new Date(ev.event_date) < new Date();
                const isSoldOut = (ev.tickets_sold || 0) >= (ev.total_capacity || 0);
                const statusLabel = isSoldOut ? "Sold Out" : isPast ? "Concluded" : "Live & Selling";
                const statusColor = isSoldOut
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : isPast
                  ? "bg-slate-100 text-[#6F7287] border-slate-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200";

                const formattedDate = new Date(ev.event_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                });

                const eventGrossSales = (ev.tickets_sold || 0) * (ev.ticket_price || 0);

                return (
                  <div
                    key={ev.id}
                    className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-1 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${statusColor}`}>
                          {statusLabel}
                        </span>
                        <span className="text-xs text-[#6F7287]">{formattedDate}</span>
                        <span className="text-xs text-[#6F7287]">•</span>
                        <span className="text-xs text-[#3659E3] font-medium">{ev.city}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#1E0A3C]">
                        <Link href={`/organizer/dashboard/${ev.id}`} className="hover:text-[#3659E3] transition">
                          {ev.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#6F7287]">{ev.venue}</p>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-[10px] text-[#6F7287] block uppercase font-bold">Passes Sold</span>
                        <span className="font-bold text-[#1E0A3C]">
                          {ev.tickets_sold} / {ev.total_capacity}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#6F7287] block uppercase font-bold">Ticket Price</span>
                        <span className="font-bold text-[#1E0A3C]">{formatINR(ev.ticket_price)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/scan/${ev.id}`}
                          className="px-3.5 py-2 rounded-lg border border-[#DBDAE3] hover:border-[#3659E3] text-[#39364F] hover:text-[#3659E3] text-xs font-bold transition flex items-center gap-1.5 bg-white shadow-xs"
                          title="Open Gate Scanner"
                        >
                          <QrCode size={16} weight="bold" />
                          <span className="hidden sm:inline">Gate Scanner</span>
                        </Link>

                        <Link
                          href={`/organizer/dashboard/${ev.id}`}
                          className="px-4 py-2 rounded-lg bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                        >
                          <span>Dashboard</span>
                          <ArrowRight size={14} weight="bold" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
