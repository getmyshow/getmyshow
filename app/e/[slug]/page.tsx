import { Metadata } from "next";
import { notFound } from "next/navigation";
import EventDetailView from "@/components/event/EventDetailView";
import { EventItem } from "@/types";
import { createBrowserClient } from "@/lib/supabase/client";

// Local fallback demo events for preview before database seeding
const DEMO_EVENTS: Record<string, EventItem> = {
  "sasaram-jee-neet-scholarship-seminar-2026": {
    id: "1",
    slug: "sasaram-jee-neet-scholarship-seminar-2026",
    title: "Super 50 Talent Scholarship Test & Seminar",
    description: "Annual career seminar and scholarship test for Class 10th, 11th & 12th aspirants in Sasaram & Rohtas. Top 50 rankers get 100% free coaching fee waiver.\n\nInstructions:\n• Carry a valid school ID card\n• Arrive 15 minutes prior to gate closing\n• Entry strictly by cryptographic QR ticket pass",
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
    custom_fields: [
      { id: "class", label: "Class / Standard", placeholder: "e.g. 10th / 11th / 12th", required: true, type: "text" },
      { id: "roll", label: "School Roll Number", placeholder: "e.g. 24", required: false, type: "text" },
      { id: "target", label: "Target Exam", placeholder: "e.g. JEE Main / NEET / NDA", required: true, type: "text" },
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  "rohtas-dandiya-mahotsav-2026": {
    id: "2",
    slug: "rohtas-dandiya-mahotsav-2026",
    title: "Sasaram Grand Dandiya & Cultural Night",
    description: "The biggest Navratri Garba & Dandiya celebration in Rohtas. Featuring live regional vocalists, Bollywood DJ sound, authentic Gujarati food stalls, and best dress prizes.\n\nStrict family & student admission only.",
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
};

async function getEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return DEMO_EVENTS[slug] || null;
    }
    return data as EventItem;
  } catch {
    return DEMO_EVENTS[slug] || null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event Not Found — GetMyShow" };
  }

  return {
    title: `${event.title} — GetMyShow Passes`,
    description: `Book your pass for ${event.title} in ${event.venue}, ${event.city}. Instant 2-click UPI checkout.`,
    openGraph: {
      title: event.title,
      description: `Venue: ${event.venue} • Price: ₹${event.ticket_price}`,
      images: event.poster_url ? [{ url: event.poster_url }] : [],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventDetailView event={event} />;
}

