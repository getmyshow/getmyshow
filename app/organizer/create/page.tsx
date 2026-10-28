"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  CaretLeft,
  Sparkle,
  CheckCircle,
  Ticket,
  CalendarBlank,
  MapPinLine,
  UsersThree,
  LockKey,
  ShieldCheck,
  Lightning,
  CircleNotch,
} from "@phosphor-icons/react";
import { formatINR } from "@/lib/utils";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("Sasaram");
  const [eventDate, setEventDate] = useState("");
  const [ticketPrice, setTicketPrice] = useState<number>(100);
  const [passFeeToBuyer, setPassFeeToBuyer] = useState(true);
  const [capacity, setCapacity] = useState<number>(500);
  const [scannerPin, setScannerPin] = useState("1234");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerWhatsapp, setOrganizerWhatsapp] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const netPerTicket = passFeeToBuyer
    ? ticketPrice
    : Math.round(ticketPrice * 0.93);

  const buyerPays = passFeeToBuyer
    ? Math.round(ticketPrice * 1.07)
    : ticketPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[85vh] bg-[#F8F7FA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[40px] border border-[#DBDAE3] shadow-card p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle size={36} weight="fill" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1E0A3C]">Event Created Successfully!</h1>
            <p className="text-xs text-[#6F7287] mt-1">
              Your event is now live on GetMyShow. Share the link on WhatsApp to begin selling passes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6F7287]">Title:</span>
              <span className="font-bold text-[#1E0A3C]">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F7287]">Location:</span>
              <span className="font-semibold text-[#39364F]">{city} • {venue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F7287]">Gate PIN:</span>
              <span className="font-mono font-bold text-[#3659E3]">{scannerPin}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/"
              className="w-full py-3.5 rounded-[360px] bg-[#3659E3] hover:bg-[#2b4ac2] text-white font-bold text-xs shadow-md transition-all active:scale-95 text-center"
            >
              View on Homepage
            </Link>
            <Link
              href="/organizer"
              className="w-full py-3.5 rounded-[360px] border border-[#DBDAE3] text-[#39364F] font-bold text-xs transition-all active:scale-95 text-center bg-white hover:bg-[#F8F7FA]"
            >
              Organizer Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#39364F] py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/organizer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#39364F] hover:text-[#3659E3] transition"
        >
          <CaretLeft size={16} weight="bold" />
          <span>Back to Organizer Desk</span>
        </Link>

        <div className="bg-white rounded-[40px] border border-[#DBDAE3] shadow-card p-6 sm:p-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F05537] uppercase tracking-wider mb-1">
              <Sparkle size={14} weight="fill" />
              <span>60-Second Event Creator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E0A3C]">
              Launch Your Event in Bihar
            </h1>
            <p className="text-xs sm:text-sm text-[#6F7287] mt-1">
              Set ticket pricing, gate scanner PIN, and choose whether to pass fees to buyers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Super 50 Scholarship Seminar or Rohtas Garba Night"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3] focus:ring-2 focus:ring-[#3659E3]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  Event Description & Guidelines
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline key highlights, chief guests, entry rules, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3] focus:ring-2 focus:ring-[#3659E3]/20 transition resize-none"
                />
              </div>
            </div>

            {/* City & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  City (Bihar) *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3]"
                >
                  <option value="Sasaram">Sasaram (Rohtas)</option>
                  <option value="Dehri-on-Sone">Dehri-on-Sone</option>
                  <option value="Patna">Patna</option>
                  <option value="Gaya">Gaya</option>
                  <option value="Bhabua">Bhabua</option>
                  <option value="Ara">Ara</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  Venue & Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sardar Patel Hall, Gaurakshani"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3]"
                />
              </div>
            </div>

            {/* Date & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  Event Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  Total Seat / Pass Capacity *
                </label>
                <input
                  type="number"
                  required
                  min={10}
                  max={10000}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3]"
                />
              </div>
            </div>

            {/* Pricing & 0% Commission Toggle */}
            <div className="p-5 rounded-3xl bg-[#F8F7FA] border border-[#DBDAE3] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1E0A3C]">Base Ticket Price (₹)</h3>
                  <p className="text-xs text-[#6F7287]">Set ₹0 for free scholarship seminars or charity fests.</p>
                </div>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Number(e.target.value))}
                  className="w-28 px-3 py-2 rounded-xl bg-white border border-[#DBDAE3] text-sm font-bold text-[#1E0A3C] text-right outline-none focus:border-[#3659E3]"
                />
              </div>

              {/* Fee Pass Toggle */}
              <div className="pt-3 border-t border-[#DBDAE3] flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#1E0A3C] block">
                    Pass Platform Fee to Buyer (0% Cost to You)
                  </span>
                  <span className="text-[11px] text-[#6F7287] block mt-0.5">
                    {passFeeToBuyer
                      ? `Buyer pays ₹${buyerPays} • You receive full ₹${netPerTicket}`
                      : `Buyer pays ₹${buyerPays} • You receive ₹${netPerTicket} (7% deducted)`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPassFeeToBuyer(!passFeeToBuyer)}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                    passFeeToBuyer ? "bg-[#3659E3]" : "bg-[#DBDAE3]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      passFeeToBuyer ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Organizer Info & Gate PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  Host Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Institute / Club"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3]"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  Host WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit number"
                  value={organizerWhatsapp}
                  onChange={(e) => setOrganizerWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3]"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  Gate Scanner PIN *
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={scannerPin}
                  onChange={(e) => setScannerPin(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-sm font-mono font-bold text-[#1E0A3C] text-center outline-none focus:border-[#3659E3]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 rounded-[360px] bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <CircleNotch size={18} weight="bold" className="animate-spin" />
                    <span>Publishing Event...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Event & Launch Ticketing</span>
                    <Lightning size={16} weight="fill" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
