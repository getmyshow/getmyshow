import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Render 10-Minute Keep-Alive Protocol Endpoint
 * Target for Cloudflare Cron / cron-job.org to keep container warm 24/7 at ₹0 cost.
 * Also checks Supabase database connectivity to prevent 7-day free tier pause.
 */
export async function GET() {
  const timestamp = Math.floor(Date.now() / 1000);
  let dbStatus = "unverified";

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("events").select("id").limit(1);
    dbStatus = error ? `error: ${error.message}` : "healthy";
  } catch (err: unknown) {
    dbStatus = err instanceof Error ? err.message : "unavailable";
  }

  return NextResponse.json(
    {
      status: "ok",
      service: "getmyshow-platform",
      timestamp,
      database: dbStatus,
      uptime: process.uptime(),
    },
    { status: 200 }
  );
}

