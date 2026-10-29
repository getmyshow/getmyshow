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

      // Query organizer events strictly for the logged-in user
      const res = await getOrganizerEvents({ email, phone });
      if (res.success) {
        setEvents(res.data || []);
      } else {
        setEvents([]);
        setErrorMsg(res.error || "Failed to load events.");
      }
    } catch (err) {
      setEvents([]);
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
            <div className="py-12 px-4 text-center max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-[#3659E3]/10 border border-[#3659E3]/20 flex items-center justify-center text-[#3659E3] mx-auto shadow-xs">
                <Ticket size={32} weight="duotone" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  0% Commission for Bihar Creators
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#1E0A3C]">
                  Welcome to GetMyShow Organizer Studio
                </h3>
                <p className="text-xs sm:text-sm text-[#6F7287] leading-relaxed">
                  You haven&apos;t published any events yet. Launch your first event in Sasaram, Dehri, Patna, or anywhere in Bihar in 60 seconds with instant UPI ticketing and dedicated gate bouncer scanners.
                </p>
              </div>

              {/* 4 Feature Highlights Grid (pricingpages.design) */}
              <div className="grid grid-cols-2 gap-3 text-left pt-2">
                <div className="p-3 rounded-xl bg-[#F8F7FA] border border-[#EEEDF2] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E0A3C]">
                    <Lightning size={14} className="text-[#F05537]" weight="fill" />
                    <span>Instant UPI</span>
                  </div>
                  <p className="text-[11px] text-[#6F7287]">Google Pay, PhonePe, Paytm with 0% gateway dropoff.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F7FA] border border-[#EEEDF2] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E0A3C]">
                    <QrCode size={14} className="text-[#3659E3]" weight="bold" />
                    <span>Gate Scanner PWA</span>
                  </div>
                  <p className="text-[11px] text-[#6F7287]">Dedicated bouncer portal with 3-credential security.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F7FA] border border-[#EEEDF2] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E0A3C]">
                    <ShieldCheck size={14} className="text-emerald-600" weight="bold" />
                    <span>Anti-Counterfeit</span>
                  </div>
                  <p className="text-[11px] text-[#6F7287]">Cryptographic HMAC-signed QR passes with live holograms.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F7FA] border border-[#EEEDF2] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E0A3C]">
                    <Wallet size={14} className="text-[#3659E3]" weight="bold" />
                    <span>T+2 Settlements</span>
                  </div>
                  <p className="text-[11px] text-[#6F7287]">Direct bank transfer with verified 12-digit Indian UTR.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/organizer/create"
                  className="px-6 py-3 rounded-xl bg-[#F05537] hover:bg-[#D94428] text-white text-xs sm:text-sm font-bold transition shadow-md inline-flex items-center gap-2 active:scale-95"
                >
                  <Plus size={18} weight="bold" />
                  <span>Create Your First Event Now</span>
                </Link>
              </div>
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
