import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, Ticket } from "lucide-react";
import EventCard from "@/components/ui/EventCard";
import { EventItem } from "@/types";
import { createBrowserClient } from "@/lib/supabase/client";

// High-fidelity fallback events representing Sasaram & Bihar target verticals
const DEMO_EVENTS: EventItem[] = [
  {
    id: "1",
    slug: "sasaram-jee-neet-scholarship-seminar-2026",
    title: "Super 50 Talent Scholarship Test & Seminar",
    description: "Annual career seminar and scholarship test for Class 10th, 11th & 12th aspirants in Sasaram & Rohtas.",
    venue: "Sardar Patel Hall, Gaurakshani, Sasaram",
    city: "Sasaram",
    event_date: "2026-11-15T10:00:00.000Z",
    ticket_price: 100,
    pass_fee_to_buyer: true,
    total_capacity: 500,
    tickets_sold: 382,
    poster_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    organizer_name: "Apex Career Institute Sasaram",
    organizer_whatsapp: "919876543210",
    wallet_pending_settlement: 35526,
    wallet_available: 0,
    wallet_total_withdrawn: 0,
    scanner_pin: "4321",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "rohtas-dandiya-mahotsav-2026",
    title: "Sasaram Grand Dandiya & Cultural Night",
    description: "The biggest Navratri Garba & Dandiya celebration in Rohtas. Live regional singer, DJ sound, and prize distribution.",
    venue: "Maurya Royal Resort, GT Road, Sasaram",
    city: "Sasaram",
    event_date: "2026-10-31T18:30:00.000Z",
    ticket_price: 500,
    pass_fee_to_buyer: false,
    total_capacity: 800,
    tickets_sold: 694,
    poster_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    organizer_name: "Rohtas Cultural Youth Club",
    organizer_whatsapp: "919876543211",
    wallet_pending_settlement: 322710,
    wallet_available: 0,
    wallet_total_withdrawn: 0,
    scanner_pin: "9988",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "sp-jain-college-annual-cultural-fest-2026",
    title: "SP Jain College Annual Tarang Fest",
    description: "Inter-college youth festival featuring battle of bands, dance competitions, poetry slam, and food stalls.",
    venue: "SP Jain College Auditorium, Sasaram",
    city: "Sasaram",
    event_date: "2026-12-05T11:00:00.000Z",
    ticket_price: 250,
    pass_fee_to_buyer: true,
    total_capacity: 1200,
    tickets_sold: 450,
    poster_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    organizer_name: "Student Welfare Committee",
    organizer_whatsapp: "919876543212",
    wallet_pending_settlement: 104625,
    wallet_available: 0,
    wallet_total_withdrawn: 0,
    scanner_pin: "1234",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

async function getEvents(): Promise<EventItem[]> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .order("event_date", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEMO_EVENTS;
    }
    return data as EventItem[];
  } catch {
    return DEMO_EVENTS;
  }
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-surface-border bg-gradient-to-b from-surface-elevated/40 via-surface-bg to-surface-bg">
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-indigo/10 border border-brand-indigo/30 text-xs font-semibold text-brand-indigo-dark">
            <Sparkles className="w-3.5 h-3.5 text-brand-saffron" />
            <span>Hyperlocal Ticketing for Sasaram, Dehri & Bihar</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Book Passes in 2 Clicks. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo via-indigo-400 to-brand-saffron">
              Zero App Download.
            </span>
          </h1>

          <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto">
            Coaching seminars, college fests, cultural nights, and regional concerts.
            Pay with Google Pay, PhonePe, or Paytm and get an instant tamper-proof QR admit pass on WhatsApp.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#events"
              className="px-6 py-3 rounded-button font-bold text-sm bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-glow transition active:scale-95"
            >
              Explore Events
            </a>
            <Link
              href="/organizer/create"
              className="px-6 py-3 rounded-button font-semibold text-sm bg-surface-card hover:bg-surface-elevated text-text-primary border border-surface-border transition"
            >
              Host Your Event (0% Commission)
            </Link>
          </div>

          {/* Hyperlocal Features Proof Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-card bg-surface-card border border-surface-border flex items-start gap-3">
              <Zap className="w-5 h-5 text-brand-saffron shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">No-Login UPI Checkout</h4>
                <p className="text-xs text-text-muted mt-1">No passwords or OTP queues. Just name, WhatsApp, and UPI.</p>
              </div>
            </div>

            <div className="p-4 rounded-card bg-surface-card border border-surface-border flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-indigo shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Cryptographic QR Pass</h4>
                <p className="text-xs text-text-muted mt-1">Mathematically tamper-proof pass. No fake screenshots at the gate.</p>
              </div>
            </div>

            <div className="p-4 rounded-card bg-surface-card border border-surface-border flex items-start gap-3">
              <Ticket className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Cash Promoter Desk</h4>
                <p className="text-xs text-text-muted mt-1">Sell passes offline with cash counters & student ambassadors.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Listing Grid */}
      <section id="events" className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Featured Events in Sasaram & Rohtas
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Verified local passes with instant digital delivery
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-brand-indigo text-white font-semibold cursor-pointer">
              All Events
            </span>
            <span className="px-3 py-1.5 rounded-full bg-surface-card hover:bg-surface-elevated text-text-muted border border-surface-border cursor-pointer transition">
              Coaching Seminars
            </span>
            <span className="px-3 py-1.5 rounded-full bg-surface-card hover:bg-surface-elevated text-text-muted border border-surface-border cursor-pointer transition">
              College Fests
            </span>
            <span className="px-3 py-1.5 rounded-full bg-surface-card hover:bg-surface-elevated text-text-muted border border-surface-border cursor-pointer transition">
              Cultural Nights
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}

