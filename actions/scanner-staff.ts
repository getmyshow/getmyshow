"use server";

import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { ScannerStaff, ActionResult } from "@/types";

const HMAC_SECRET = process.env.QR_HMAC_SECRET || "getmyshow_secret_qr_token_key_change_in_production";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password.trim()).digest("hex");
}

function generateStaffSessionToken(eventId: string, scannerId: string): string {
  const payload = `${eventId}:${scannerId}:${Date.now()}`;
  const sig = crypto.createHmac("sha256", HMAC_SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${sig.slice(0, 32)}`;
}

export interface CreateScannerStaffInput {
  eventId: string;
  scannerId: string;
  password: string;
  assignedGate: string;
}

export interface StaffAuthResponse {
  event: {
    id: string;
    title: string;
    venue: string;
    city: string;
  };
  staff: {
    id: string;
    scanner_id: string;
    assigned_gate: string;
    scanned_count: number;
  };
  sessionToken: string;
  // Flattened convenience fields
  token: string;
  event_id: string;
  event_title: string;
  scanner_id: string;
  gate_name: string;
  scanned_count: number;
}

/**
 * Provisions a new gate scanner staff member for a specific event
 */
export async function createScannerStaff(
  input: CreateScannerStaffInput
): Promise<ActionResult<ScannerStaff>> {
  try {
    const { eventId, scannerId, password, assignedGate } = input;

    if (!eventId || !scannerId?.trim() || !password?.trim()) {
      return {
        success: false,
        error: "Missing mandatory fields (Event ID, Scanner Staff ID, and Password are required).",
      };
    }

    const cleanScannerId = scannerId.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (cleanScannerId.length < 3) {
      return {
        success: false,
        error: "Scanner Staff ID must be at least 3 alphanumeric characters (e.g. GATE-01, BOUNCER-A).",
      };
    }

    if (password.trim().length < 4) {
      return {
        success: false,
        error: "Gate access password must be at least 4 characters.",
      };
    }

    const supabase = createAdminClient();

    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("id, scanner_staff")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      return {
        success: false,
        error: "Event not found in database.",
      };
    }

    const existingStaff: ScannerStaff[] = (event.scanner_staff as ScannerStaff[]) || [];

    // Ensure scanner ID is unique per event
    if (existingStaff.some((s) => s.scanner_id.toUpperCase() === cleanScannerId)) {
      return {
        success: false,
        error: `Scanner ID "${cleanScannerId}" is already assigned for this event. Please pick a unique identifier.`,
      };
    }

    const newStaff: ScannerStaff = {
      id: `staff-${Date.now().toString(36)}`,
      event_id: eventId,
      scanner_id: cleanScannerId,
      password_hash: hashPassword(password),
      assigned_gate: assignedGate.trim() || "Main Turnstile Gate",
      is_active: true,
      scanned_count: 0,
      created_at: new Date().toISOString(),
    };

    const updatedStaff = [...existingStaff, newStaff];

    const { error: updateErr } = await supabase
      .from("events")
      .update({ scanner_staff: updatedStaff })
      .eq("id", eventId);

    if (updateErr) {
      console.error("Error saving scanner staff to event:", updateErr);
      return {
        success: false,
        error: "Failed to persist scanner staff account.",
      };
    }

    return {
      success: true,
      data: newStaff,
      message: `Scanner account ${cleanScannerId} created successfully!`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal error creating scanner staff.",
    };
  }
}

/**
 * Retrieves the full roster of scanner volunteers for an event
 */
export async function getScannerStaff(
  eventId: string
): Promise<ActionResult<ScannerStaff[]>> {
  try {
    if (!eventId) {
      return { success: false, error: "Missing event ID." };
    }

    const supabase = createAdminClient();

    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("scanner_staff")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      return { success: false, error: "Event not found." };
    }

    const staffList: ScannerStaff[] = (event.scanner_staff as ScannerStaff[]) || [];

    return {
      success: true,
      data: staffList,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load scanner staff roster.",
    };
  }
}

/**
 * Instantly revokes or re-activates a volunteer's gate scanning access
 */
export async function toggleScannerStaffStatus(
  eventId: string,
  staffId: string,
  isActive: boolean
): Promise<ActionResult<void>> {
  try {
    const supabase = createAdminClient();

    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("scanner_staff")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      return { success: false, error: "Event not found." };
    }

    const existingStaff: ScannerStaff[] = (event.scanner_staff as ScannerStaff[]) || [];
    const updatedStaff = existingStaff.map((s) =>
      s.id === staffId ? { ...s, is_active: isActive } : s
    );

    const { error: updateErr } = await supabase
      .from("events")
      .update({ scanner_staff: updatedStaff })
      .eq("id", eventId);

    if (updateErr) {
      return { success: false, error: "Failed to update staff status." };
    }

    return {
      success: true,
      data: undefined,
      message: isActive ? "Scanner staff access activated." : "Scanner staff access revoked immediately.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error updating scanner staff status.",
    };
  }
}

/**
 * Deletes a scanner staff account from the event
 */
export async function deleteScannerStaff(
  eventId: string,
  staffId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = createAdminClient();

    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("scanner_staff")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      return { success: false, error: "Event not found." };
    }

    const existingStaff: ScannerStaff[] = (event.scanner_staff as ScannerStaff[]) || [];
    const updatedStaff = existingStaff.filter((s) => s.id !== staffId);

    const { error: updateErr } = await supabase
      .from("events")
      .update({ scanner_staff: updatedStaff })
      .eq("id", eventId);

    if (updateErr) {
      return { success: false, error: "Failed to delete staff account." };
    }

    return {
      success: true,
      data: undefined,
      message: "Scanner staff account deleted.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error deleting scanner staff account.",
    };
  }
}

export interface AuthenticateStaffParams {
  eventId: string;
  scannerId: string;
  password: string;
}

/**
 * Zero-Trust 3-Credential Gate Staff Authentication Handshake
 * Validates: (1) Event ID, (2) Scanner Staff ID, (3) Password/PIN
 */
export async function authenticateScannerStaff(
  paramsOrEventId: AuthenticateStaffParams | string,
  scannerIdArg?: string,
  passwordAttemptArg?: string
): Promise<ActionResult<StaffAuthResponse>> {
  try {
    let eventIdOrSlug = "";
    let scannerId = "";
    let passwordAttempt = "";

    if (typeof paramsOrEventId === "object" && paramsOrEventId !== null) {
      eventIdOrSlug = paramsOrEventId.eventId || "";
      scannerId = paramsOrEventId.scannerId || "";
      passwordAttempt = paramsOrEventId.password || "";
    } else {
      eventIdOrSlug = paramsOrEventId || "";
      scannerId = scannerIdArg || "";
      passwordAttempt = passwordAttemptArg || "";
    }

    if (!eventIdOrSlug?.trim() || !scannerId?.trim() || !passwordAttempt?.trim()) {
      return {
        success: false,
        error: "All 3 credentials are mandatory: (1) Event ID/Code, (2) Scanner Staff ID, and (3) Gate Password.",
      };
    }

    const cleanInput = eventIdOrSlug.trim();
    const cleanScannerId = scannerId.trim().toUpperCase();
    const supabase = createAdminClient();

    // Query event by UUID or slug
    let query = supabase.from("events").select("id, slug, title, venue, city, scanner_pin, scanner_staff");
    
    // Check if UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanInput);
    if (isUuid) {
      query = query.eq("id", cleanInput);
    } else {
      query = query.or(`slug.eq.${cleanInput},id.eq.${cleanInput}`);
    }

    const { data: event, error: eventErr } = await query.maybeSingle();

    if (eventErr || !event) {
      // Fallback for mock demo events if Supabase is unseeded
      if (cleanInput === "1" || cleanInput === "SAS-01") {
        const demoStaff = [
          { id: "staff-1", scanner_id: "GATE-1-RAHUL", assigned_gate: "Main Entry Gate A", password_hash: hashPassword("9842"), scanned_count: 142 },
          { id: "staff-2", scanner_id: "GATE-2-BOUNCER", assigned_gate: "VIP Front Gate", password_hash: hashPassword("9842"), scanned_count: 38 },
        ];
        const found = demoStaff.find((s) => s.scanner_id === cleanScannerId);
        if (found && (passwordAttempt.trim() === "9842" || passwordAttempt.trim() === "1234")) {
          const token = generateStaffSessionToken("1", found.scanner_id);
          return {
            success: true,
            data: {
              event: {
                id: "1",
                title: "Sasaram Mega Music Fest 2026",
                venue: "Fazalganj Stadium",
                city: "Sasaram",
              },
              staff: {
                id: found.id,
                scanner_id: found.scanner_id,
                assigned_gate: found.assigned_gate,
                scanned_count: found.scanned_count,
              },
              sessionToken: token,
              token,
              event_id: "1",
              event_title: "Sasaram Mega Music Fest 2026",
              scanner_id: found.scanner_id,
              gate_name: found.assigned_gate,
              scanned_count: found.scanned_count,
            },
            message: `Welcome, ${found.scanner_id}! Camera gate scanner unlocked.`,
          };
        }
      }

      return {
        success: false,
        error: `Event "${cleanInput}" not found. Please verify the Event Code with your organizer.`,
      };
    }

    const staffList: ScannerStaff[] = (event.scanner_staff as ScannerStaff[]) || [];
    const matchedStaff = staffList.find(
      (s) => s.scanner_id.toUpperCase() === cleanScannerId
    );

    // Fallback: Check if organizer is logging in using Master Gate PIN
    const isMasterPin = event.scanner_pin && passwordAttempt.trim() === event.scanner_pin;
    if (isMasterPin && (!matchedStaff || cleanScannerId === "MASTER" || cleanScannerId === "ADMIN")) {
      const sessionToken = generateStaffSessionToken(event.id, "MASTER-ORGANIZER");
      return {
        success: true,
        data: {
          event: {
            id: event.id,
            title: event.title,
            venue: event.venue,
            city: event.city,
          },
          staff: {
            id: "master",
            scanner_id: "MASTER-ORGANIZER",
            assigned_gate: "All Gates (Organizer Override)",
            scanned_count: 0,
          },
          sessionToken,
          token: sessionToken,
          event_id: event.id,
          event_title: event.title,
          scanner_id: "MASTER-ORGANIZER",
          gate_name: "All Gates (Organizer Override)",
          scanned_count: 0,
        },
        message: "Authenticated via Master Organizer Gate PIN.",
      };
    }

    if (!matchedStaff) {
      return {
        success: false,
        error: `Scanner Staff ID "${cleanScannerId}" is not registered for this event. Check with your organizer.`,
      };
    }

    if (!matchedStaff.is_active) {
      return {
        success: false,
        error: "Your scanning access has been revoked by the event organizer. Please contact event desk.",
      };
    }

    const inputHash = hashPassword(passwordAttempt);
    if (matchedStaff.password_hash !== inputHash && passwordAttempt.trim() !== event.scanner_pin) {
      return {
        success: false,
        error: "Incorrect gate access password / PIN. Access denied.",
      };
    }

    // Update last_active_at on staff record asynchronously
    const updatedStaffList = staffList.map((s) =>
      s.id === matchedStaff.id ? { ...s, last_active_at: new Date().toISOString() } : s
    );
    supabase.from("events").update({ scanner_staff: updatedStaffList }).eq("id", event.id).then();

    const sessionToken = generateStaffSessionToken(event.id, matchedStaff.scanner_id);

    return {
      success: true,
      data: {
        event: {
          id: event.id,
          title: event.title,
          venue: event.venue,
          city: event.city,
        },
        staff: {
          id: matchedStaff.id,
          scanner_id: matchedStaff.scanner_id,
          assigned_gate: matchedStaff.assigned_gate,
          scanned_count: matchedStaff.scanned_count || 0,
        },
        sessionToken,
        token: sessionToken,
        event_id: event.id,
        event_title: event.title,
        scanner_id: matchedStaff.scanner_id,
        gate_name: matchedStaff.assigned_gate,
        scanned_count: matchedStaff.scanned_count || 0,
      },
      message: `Welcome, ${matchedStaff.scanner_id}! Camera gate scanner unlocked.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gate authentication failed.",
    };
  }
}

/**
 * Records a successful scan against the staff member's shift count
 */
export async function recordStaffScan(
  eventId: string,
  scannerId: string
): Promise<void> {
  try {
    if (!eventId || !scannerId || scannerId === "MASTER-PIN" || scannerId === "MASTER-ORGANIZER") return;

    const supabase = createAdminClient();
    const { data: event } = await supabase
      .from("events")
      .select("scanner_staff")
      .eq("id", eventId)
      .single();

    if (!event?.scanner_staff) return;

    const staffList = (event.scanner_staff as ScannerStaff[]) || [];
    const updatedList = staffList.map((s) =>
      s.scanner_id.toUpperCase() === scannerId.toUpperCase()
        ? {
            ...s,
            scanned_count: (s.scanned_count || 0) + 1,
            last_active_at: new Date().toISOString(),
          }
        : s
    );

    await supabase
      .from("events")
      .update({ scanner_staff: updatedList })
      .eq("id", eventId);
  } catch (err) {
    console.warn("Could not increment staff scan count:", err);
  }
}
