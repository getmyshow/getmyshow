"use client";

import Link from "next/link";
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
} from "@phosphor-icons/react";

const ACTIVE_EVENTS = [
  {
    id: "1",
    slug: "sasaram-jee-neet-scholarship-seminar-2026",
    title: "Super 50 Talent Scholarship Test & Career Seminar",
    venue: "Sardar Patel Hall, Gaurakshani, Sasaram",
    date: "15 Nov 2026",
    sold: 382,
    capacity: 500,
    revenue: "₹38,200",
    status: "Live & Selling",
  },
  {
    id: "2",
    slug: "rohtas-dandiya-mahotsav-2026",
    title: "Sasaram Grand Dandiya & Cultural Night 2026",
    venue: "Maurya Royal Resort, GT Road, Sasaram",
    date: "31 Oct 2026",
    sold: 694,
    capacity: 800,
    revenue: "₹3,47,000",
    status: "Fast Filling",
  },
  {
    id: "3",
    slug: "sp-jain-college-annual-cultural-fest-2026",
    title: "SP Jain College Annual Tarang Youth Fest",
    venue: "SP Jain College Auditorium, Sasaram",
    date: "05 Dec 2026",
    sold: 450,
    capacity: 1200,
    revenue: "₹1,12,500",
    status: "Live & Selling",
  },
];

export default function OrganizerLandingPage() {
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
              Welcome Back, Organizer
            </h1>
            <p className="text-sm text-[#6F7287] mt-1">
              Manage your live ticket sales, gate scanning crew, and T+2 wallet settlements.
            </p>
          </div>

          <Link
            href="/organizer/create"
            className="px-5 py-3 rounded-lg bg-[#F05537] hover:bg-[#D94428] text-white font-bold text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus size={18} weight="bold" />
            <span>Create New Event</span>
          </Link>
        </div>

        {/* 3 Metric Cards with Phosphor Duotone Icons (12px Radius) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Gross GMV</span>
              <div className="w-9 h-9 rounded-md bg-[#3659E3]/10 text-[#3659E3] flex items-center justify-center">
                <ChartLineUp size={22} weight="duotone" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1E0A3C]">₹4,97,700</div>
            <p className="text-xs text-[#6F7287]">Across 3 active events in Sasaram</p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Tickets Issued</span>
              <div className="w-9 h-9 rounded-md bg-[#F05537]/10 text-[#F05537] flex items-center justify-center">
                <Ticket size={22} weight="duotone" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1E0A3C]">1,526 / 2,500</div>
            <p className="text-xs text-emerald-600 font-semibold">61% overall occupancy rate</p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Wallet Balance</span>
              <div className="w-9 h-9 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Wallet size={22} weight="duotone" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1E0A3C]">₹4,62,861</div>
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

          <div className="divide-y divide-[#EEEDF2]">
            {ACTIVE_EVENTS.map((ev) => (
              <div
                key={ev.id}
                className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      {ev.status}
                    </span>
                    <span className="text-xs text-[#6F7287]">{ev.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1E0A3C]">{ev.title}</h3>
                  <p className="text-xs text-[#6F7287]">{ev.venue}</p>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-[10px] text-[#6F7287] block uppercase font-bold">Passes Sold</span>
                    <span className="font-bold text-[#1E0A3C]">{ev.sold} / {ev.capacity}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#6F7287] block uppercase font-bold">Gross Sales</span>
                    <span className="font-bold text-[#1E0A3C]">{ev.revenue}</span>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
