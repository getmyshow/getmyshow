"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, SignInButton, Show } from "@clerk/nextjs";
import {
  Ticket,
  QrCode,
  CalendarBlank,
  MapPin,
  CheckCircle,
  WarningCircle,
  ArrowRight,
  Sparkle,
  Phone,
  CircleNotch,
  MagnifyingGlass,
  CaretLeft,
} from "@phosphor-icons/react";
import { getUserTickets, TicketDetails } from "@/actions/tickets";
import { formatDateIST, formatINR } from "@/lib/utils";

export default function MyTicketsPage() {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const [tickets, setTickets] = useState<TicketDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [lookupPhone, setLookupPhone] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-load tickets if user is signed in with email/phone
  useEffect(() => {
    let mounted = true;

    async function loadTickets() {
      if (!isUserLoaded) return;

      if (isSignedIn && user) {
        setLoading(true);
        const email = user.primaryEmailAddress?.emailAddress;
        const phone = user.primaryPhoneNumber?.phoneNumber;

        const res = await getUserTickets({ email, phone });
        if (mounted && res.success && res.data) {
          setTickets(res.data);
        }
        if (mounted) setLoading(false);
      } else {
        if (mounted) setLoading(false);
      }
    }

    loadTickets();

    return () => {
      mounted = false;
    };
  }, [isUserLoaded, isSignedIn, user]);

  // Guest lookup by WhatsApp number
  const handlePhoneLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhone.trim()) return;

    setLookupLoading(true);
    setSearched(true);
    const res = await getUserTickets({ phone: lookupPhone.trim() });
    if (res.success && res.data) {
      setTickets(res.data);
    }
    setLookupLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#0F172A] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb & Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#4F46E5] transition mb-3"
          >
            <CaretLeft size={16} weight="bold" />
            <span>Back to Events</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-bold uppercase tracking-wider mb-2">
                <Ticket size={14} weight="duotone" />
                <span>Pass Vault</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                My Booked Passes
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Access, download, and present your entry QR passes for events in Bihar.
              </p>
            </div>

            {/* Quick action for signed-out users */}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#4338CA] transition shadow-md self-start"
                >
                  <Sparkle size={16} weight="bold" />
                  <span>Sign In to Sync Passes</span>
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>

        {/* Guest Order Lookup Bar (Industry Standard for Unauthenticated Buyers) */}
        <Show when="signed-out">
          <div className="p-6 rounded-2xl bg-white border border-[#DBDAE3] shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#0F172A]">
              Booked as a Guest without an account?
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Enter the 10-digit WhatsApp number you used during checkout to retrieve your passes immediately.
            </p>
            <form onSubmit={handlePhoneLookup} className="flex flex-col sm:flex-row gap-2 max-w-md pt-1">
              <div className="relative flex-1">
                <Phone size={18} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#0F172A] outline-none focus:border-[#4F46E5] font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={lookupLoading || lookupPhone.length < 10}
                className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold hover:bg-[#1E293B] transition disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
              >
                {lookupLoading ? (
                  <CircleNotch size={16} className="animate-spin" />
                ) : (
                  <MagnifyingGlass size={16} weight="bold" />
                )}
                <span>Find Passes</span>
              </button>
            </form>
          </div>
        </Show>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <CircleNotch size={36} className="animate-spin text-[#4F46E5] mb-3" weight="bold" />
            <p className="text-xs font-semibold text-[#64748B]">Loading your verified passes...</p>
          </div>
        )}

        {/* Tickets Feed */}
        {!loading && tickets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase tracking-wider px-1">
              <span>{tickets.length} Ticket Pass(es) Found</span>
              <span>Valid for Entry</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl bg-white border border-[#DBDAE3] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-[#4F46E5] bg-[#4F46E5]/10 px-2.5 py-1 rounded-md">
                        {t.ticket_number}
                      </span>
                      {t.is_checked_in ? (
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle size={12} weight="fill" /> Checked In
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Ready for Entry
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors line-clamp-2">
                      {t.event.title}
                    </h3>

                    <div className="mt-3 space-y-1.5 text-xs text-[#64748B]">
                      <div className="flex items-center gap-2">
                        <CalendarBlank size={15} weight="bold" className="shrink-0 text-[#0F172A]" />
                        <span>{formatDateIST(t.event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={15} weight="bold" className="shrink-0 text-[#0F172A]" />
                        <span className="truncate">{t.event.venue}, {t.event.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EEEDF2] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#64748B] block">Pass Holder</span>
                      <span className="text-xs font-bold text-[#0F172A]">{t.buyer_name} ({t.quantity} Seats)</span>
                    </div>

                    <Link
                      href={`/ticket/${t.qr_token}`}
                      className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#4F46E5] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <QrCode size={16} weight="bold" />
                      <span>View Pass</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && tickets.length === 0 && (
          <div className="p-10 rounded-2xl bg-white border border-[#DBDAE3] text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center">
              <Ticket size={32} weight="duotone" />
            </div>
            <div className="max-w-sm space-y-1">
              <h3 className="text-base font-bold text-[#0F172A]">
                {searched ? "No passes found for this phone number" : "No booked passes found"}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {searched
                  ? "Check that your 10-digit number matches what you entered during checkout."
                  : "Discover coaching seminars, college fests, and cultural nights happening across Bihar."}
              </p>
            </div>
            <Link
              href="/#events"
              className="px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#4338CA] transition shadow-md"
            >
              Browse Upcoming Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

