"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Check, Loader2, ShieldCheck, Ticket } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("Sasaram");
  const [eventDate, setEventDate] = useState("");
  const [ticketPrice, setTicketPrice] = useState<number>(500);
  const [passFeeToBuyer, setPassFeeToBuyer] = useState(false);
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
      // Simulation / Direct Supabase insert
      setTimeout(() => {
        setIsSuccess(true);
      }, 800);
    });
  };

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Event Created Successfully!</h1>
        <p className="text-sm text-text-muted">
          Your event is now live. Share the link on WhatsApp to start selling passes immediately.
        </p>
        <div className="p-4 rounded-card bg-surface-card border border-surface-border text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-text-dim">Event Title:</span>
            <span className="font-bold text-white">{title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-dim">Gate Scanner PIN:</span>
            <span className="font-mono font-bold text-brand-saffron">{scannerPin}</span>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-button text-xs font-bold bg-brand-indigo hover:bg-brand-indigo-dark text-white transition shadow-glow"
          >
            View on Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
          60-Second Event Creator
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Create an event pass link in under a minute. 0% Commission option available.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="p-6 rounded-card bg-surface-card border border-surface-border space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-indigo" />
            <span>Event Basics</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sasaram New Year Night 2027"
              className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white text-sm focus:outline-none focus:border-brand-indigo transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                City / District *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white text-sm focus:outline-none focus:border-brand-indigo transition"
              >
                <option value="Sasaram">Sasaram (Rohtas)</option>
                <option value="Dehri-on-Sone">Dehri-on-Sone</option>
                <option value="Gaya">Gaya</option>
                <option value="Patna">Patna</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                Venue Location in {city} *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Post Office Chowk / GT Road"
                className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white text-sm focus:outline-none focus:border-brand-indigo transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              Event Date & Start Time *
            </label>
            <input
              type="datetime-local"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white text-sm focus:outline-none focus:border-brand-indigo transition"
            />
          </div>
        </div>

        {/* Pricing & 7% Convenience Fee Toggle */}
        <div className="p-6 rounded-card bg-surface-card border border-surface-border space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Ticket className="w-4 h-4 text-brand-saffron" />
            <span>Ticket Pricing & Wallet Split</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                Base Ticket Price (₹) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white font-mono text-sm focus:outline-none focus:border-brand-indigo transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                Total Seat Capacity *
              </label>
              <input
                type="number"
                min={1}
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white font-mono text-sm focus:outline-none focus:border-brand-indigo transition"
              />
            </div>
          </div>

          {/* Convenience Fee Switch (Add-On #1) */}
          <div className="p-4 rounded-button bg-surface-elevated border border-surface-border flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">Pass 7% Fee to Buyer (0% Cost to You)</p>
              <p className="text-xs text-text-muted mt-0.5">
                {passFeeToBuyer
                  ? `Buyer pays ${formatINR(buyerPays)} at checkout. You receive the full ${formatINR(netPerTicket)} (100%) into your wallet!`
                  : `You absorb the 7% fee. Buyer pays ${formatINR(buyerPays)}. You receive ${formatINR(netPerTicket)} (93%).`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPassFeeToBuyer(!passFeeToBuyer)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 shrink-0 ${
                passFeeToBuyer ? "bg-brand-indigo" : "bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                  passFeeToBuyer ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Gate Security PIN & Organizer WhatsApp */}
        <div className="p-6 rounded-card bg-surface-card border border-surface-border space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Gate Scanner PIN & Alerts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                4-Digit Gate Scanner PIN *
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={scannerPin}
                onChange={(e) => setScannerPin(e.target.value)}
                placeholder="1234"
                className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white font-mono text-sm tracking-widest focus:outline-none focus:border-brand-indigo transition"
              />
              <p className="text-[10px] text-text-dim mt-1">Guards type this PIN to unlock the gate camera scanner.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                Organizer WhatsApp Number *
              </label>
              <input
                type="tel"
                maxLength={10}
                required
                value={organizerWhatsapp}
                onChange={(e) => setOrganizerWhatsapp(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white text-sm focus:outline-none focus:border-brand-indigo transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              Organizer / Institute Name *
            </label>
            <input
              type="text"
              required
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              placeholder="e.g. Apex Coaching or Youth Club"
              className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white text-sm focus:outline-none focus:border-brand-indigo transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 rounded-button font-bold text-sm bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-glow transition active:scale-95 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Event...</span>
            </>
          ) : (
            <span>Publish Event & Get WhatsApp Link</span>
          )}
        </button>
      </form>
    </div>
  );
}

