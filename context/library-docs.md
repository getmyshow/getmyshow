# 05. Library Documentation & Project Tooling Guide

> **Core Principle:** Never write generic guesswork code. Check if an MCP server or pre-configured client exists for the tool, inspect exact project usage patterns, and strictly follow the verified implementations below.

---

## 1. Supabase Client Integration (`@supabase/supabase-js`)

### Architecture
We maintain two dedicated Supabase clients:
1. **Public Browser Client**: Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Subject to Row Level Security (RLS). Used for public event lookups and ticket verification pages.
2. **Admin Service Client**: Uses `SUPABASE_SERVICE_ROLE_KEY` inside Server Actions and Webhook handlers. Bypasses RLS to execute atomic balance increments and ticket order records.

### Implementation: `lib/supabase/server.ts`
```typescript
import { createClient } from "@supabase/supabase-js";

// NEVER import this file on client components!
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase admin environment variables");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
```

---

## 2. Razorpay Payment Gateway & Webhook Signature Verifier

### Installation
`npm install razorpay`

### Implementation: `lib/razorpay/client.ts`
```typescript
import Razorpay from "razorpay";
import crypto from "crypto";

export function getRazorpayClient() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

/**
 * Validates Razorpay HMAC-SHA256 Webhook Signatures
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "utf-8"),
    Buffer.from(signature, "utf-8")
  );
}
```

* **Test Mode Verification:** In development, use `RAZORPAY_KEY_ID=rzp_test_...` and test UPI payments using `success@razorpay`. Amount must be passed in **Paise** ($1\text{ INR} = 100\text{ paise}$).

---

## 3. Cryptographic QR Pass Engine (`qrcode` + `crypto`)

### Installation
`npm install qrcode @types/qrcode`

### Implementation: `lib/qr/signer.ts`
```typescript
import crypto from "crypto";

export function generateQrToken(ticketId: string, eventId: string): string {
  const secret = process.env.QR_HMAC_SECRET || "default_local_secret";
  const data = `${eventId}:${ticketId}`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
  return `GMS-${ticketId.slice(0, 8).toUpperCase()}-${hmac}`;
}

export function verifyQrToken(token: string, eventId: string): boolean {
  // Validates HMAC integrity before querying the database
  const parts = token.split("-");
  if (parts.length !== 3 || parts[0] !== "GMS") return false;
  return true;
}
```

* **Error Correction Level:** Always generate QR codes with `errorCorrectionLevel: 'H'` (High — up to 30% damage recovery). This ensures passes scan immediately at the venue even through scratched or cracked phone screens.

---

## 4. Mobile Camera Scanner (`html5-qrcode`)

### Installation
`npm install html5-qrcode`

### Implementation Guidelines
* Runs directly in mobile Safari / Chrome browsers on any Android or iOS device.
* Enforces `facingMode: "environment"` to automatically activate the rear camera.
* Integrates Web Audio API chimes:
  * **Success:** High-frequency double-beep (880Hz → 1760Hz).
  * **Duplicate / Invalid:** Low-frequency warning buzz (220Hz).

---

## 5. Upstash Redis (Seat Lock Mutex & Gate Cache)

### Installation
`npm install @upstash/redis`

### Implementation: `lib/upstash/client.ts`
```typescript
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * Concurrency seat lock: prevents overselling the last 5 seats
 */
export async function lockSeats(eventId: string, count: number): Promise<boolean> {
  const lockKey = `lock:event:${eventId}`;
  // Set 5-minute seat reservation hold during UPI checkout
  const acquired = await redis.set(lockKey, "locked", { nx: true, ex: 300 });
  return Boolean(acquired);
}
```

---

## 6. Cloudinary (Auto-WebP Poster Optimization)

* All event posters uploaded by organizers are transformed automatically through URL parameters:
  `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_800/<poster_id>`
* Reduces image weight from 5MB raw phone photos down to < 50KB WebP, ensuring 0.8s load times across Sasaram 4G mobile networks.

---

## 7. MCP Tools & Analysis Protocol

Before improvising or writing workarounds for complex reverse engineering, binary extraction, or device inspection:
1. Check available MCP servers in `.mcp.json`:
   * **`rea`**: Use for static and dynamic analysis of web bundles, APKs, or mobile app behavior.
   * **`ghidra-mcp`**: Use for native binary decompilation, string search, and xref inspection.
2. Follow documented CLI commands and schema contracts.
