"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { EventItem, TicketTier, CustomField, ActionResult } from "@/types";

export interface CreateEventInput {
  title: string;
  slug?: string;
  description?: string;
  venue: string;
  city: string;
  event_date: string;
  ticket_price: number;
  pass_fee_to_buyer: boolean;
  total_capacity: number;
  scanner_pin: string;
  organizer_name: string;
  organizer_whatsapp: string;
  organizer_email?: string | null;
  poster_url?: string | null;
  ticket_tiers?: TicketTier[];
  custom_fields?: CustomField[];
}

export async function getEvents(filters?: { city?: string }): Promise<ActionResult<EventItem[]>> {
  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .order("event_date", { ascending: true });

    if (filters?.city && filters.city !== "All" && filters.city !== "Bihar") {
      query = query.eq("city", filters.city);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("Supabase getEvents query returned error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: (data as EventItem[]) || [],
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load events";
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function getEventBySlug(slug: string): Promise<ActionResult<EventItem | null>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: error?.message || "Event not found",
      };
    }

    return {
      success: true,
      data: data as EventItem,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error querying event by slug",
    };
  }
}

export async function createEvent(input: CreateEventInput): Promise<ActionResult<EventItem>> {
  try {
    const supabase = createAdminClient();

    const cleanTitle = input.title.trim();
    if (
      !cleanTitle ||
      !input.venue?.trim() ||
      !input.event_date ||
      !input.organizer_name?.trim() ||
      !input.organizer_whatsapp?.trim()
    ) {
      return {
        success: false,
        error: "Missing mandatory event details (title, venue, date, organizer name, and WhatsApp).",
      };
    }

    const baseSlug =
      input.slug?.trim() ||
      cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

    // Total capacity calculated from tiers if present
    let totalCapacity = input.total_capacity;
    if (input.ticket_tiers && input.ticket_tiers.length > 0) {
      const sumTierCapacity = input.ticket_tiers.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0);
      if (sumTierCapacity > 0) {
        totalCapacity = sumTierCapacity;
      }
    }

    const payload = {
      title: cleanTitle,
      slug,
      description: input.description?.trim() || null,
      venue: input.venue.trim(),
      city: input.city?.trim() || "Sasaram",
      event_date: input.event_date,
      ticket_price: input.ticket_price || 0,
      pass_fee_to_buyer: input.pass_fee_to_buyer,
      total_capacity: totalCapacity,
      tickets_sold: 0,
      scanner_pin: input.scanner_pin?.trim() || "1234",
      organizer_name: input.organizer_name.trim(),
      organizer_whatsapp: input.organizer_whatsapp.trim(),
      organizer_email: input.organizer_email?.trim() || null,
      poster_url: input.poster_url?.trim() || null,
      is_active: true,
      ticket_tiers: input.ticket_tiers || [],
      custom_fields: input.custom_fields || [],
      wallet_pending_settlement: 0,
      wallet_available: 0,
      wallet_total_withdrawn: 0,
    };

    let { data, error } = await supabase.from("events").insert(payload).select().single();

    // Fallback if remote schema does not have ticket_tiers column yet
    if (
      error &&
      (error.message?.includes("ticket_tiers") ||
        error.message?.includes("column \"ticket_tiers\"") ||
        error.code === "42703")
    ) {
      console.warn("Fallback creating event without ticket_tiers column:", error.message);
      const { ticket_tiers, ...resilientPayload } = payload;
      const fallbackRes = await supabase.from("events").insert(resilientPayload).select().single();
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error || !data) {
      console.error("Failed to insert event:", error);
      return {
        success: false,
        error: error?.message || "Failed to persist event in database.",
      };
    }

    return {
      success: true,
      data: data as EventItem,
    };
  } catch (err: unknown) {
    console.error("Error creating event:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal error creating event.",
    };
  }
}
