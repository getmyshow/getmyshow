# 09. Project Progress & Milestone Tracker (Living Document)

> **Purpose:** Living checklist of all engineering and go-to-market milestones for GetMyShow.  
> **Agent & Developer Rule:** At the beginning of every session, consult this file to determine the exact next task. Mark items as `[x]` as they are completed and verified.

---

## Current Status Overview
* **Active Sprint:** Phase 4 (Razorpay UPI Integration & Supabase Database Wiring)
* **Last Updated:** 2026-10-28
* **Next Immediate Task:** Wire real Supabase mutations and Razorpay UPI order creation into checkout modal.

---

## 1. Phase 1: Environment, Database & Tooling Setup
- [x] Create GitHub repository (`getmyshow/getmyshow`) and push initial commit
- [x] Configure `.gitignore` to prevent any secret or `.env` leaks
- [x] Save verified Supabase API keys & Project ID (`bexxwfvnhaetezvtayfx`) in `.env.local`
- [x] Write PostgreSQL schema (`supabase-schema.sql`) for events, tickets, and withdrawal requests
- [x] Install JDK 21 (Eclipse Temurin) on system
- [x] Install and verify REA (`morluto/rea`) globally
- [x] Install and configure Ghidra 12.1.4 and Ghidra MCP (`bethington/ghidra-mcp`)
- [x] Clone reference repositories (`tickity`, `Hi.Events`, `gathio`, `revel-frontend`, `revel-backend`, `pollaris`)
- [x] Initialize the 9 master context files in `context/`

---

## 2. Phase 2: Next.js App Router Scaffolding & Design Foundation
- [x] Initialize Next.js 15+ with TypeScript and Tailwind CSS
- [x] Configure `tailwind.config.ts` with brand tokens (Electric Indigo, Midnight Charcoal, Sunset Saffron)
- [x] Install base dependencies (`@supabase/supabase-js`, `lucide-react`, `qrcode`, `razorpay`, `@upstash/redis`, `zod`)
- [x] Setup Supabase client helpers (`lib/supabase/client.ts` and `lib/supabase/server.ts`)
- [x] Import official SVG and PNG brand marks into `public/brand/`
- [x] Create global layout (`app/layout.tsx`) with Plus Jakarta Sans & JetBrains Mono typography

---

## 3. Phase 3: Public Event Discovery & Detail Experience (Eventbrite-Inspired Overhaul)
- [x] Overhaul design tokens (`tailwind.config.ts`, `globals.css`) with Eventbrite palette (`#F8F7FA` Warm Linen, `#1E0A3C` Plum Depth, `#F05537` Ember Orange, 40px rounded pillow-cards)
- [x] Install and configure `@phosphor-icons/react` across all UI components
- [x] Build Header navigation bar with 100px pill search bar, Bihar city switcher, and circular Ember Orange submit button
- [x] Build Category Circle Row (`components/discovery/CategoryCircleRow.tsx`) with 80px circles and duotone Phosphor icons
- [x] Build Homepage (`app/page.tsx`) with full-bleed stage hero banner, floating overlay CTA card, and 4-column discovery grid
- [x] Build Event Card component (`components/ui/EventCard.tsx`) with 40px pillow-soft corners, floating save toggle, and price badges
- [x] Build Single-Scroll Event Detail Page (`app/e/[slug]/page.tsx` & `components/event/EventDetailView.tsx`) with 16:9 hero, verified organizer card, and sticky mobile booking bar
- [x] Build Rich Footer (`components/ui/Footer.tsx`) with Bihar city directory, organizer links, and trust strip
- [x] Add OpenGraph meta tags generator for WhatsApp rich link cards

---

## 4. Phase 4: 2-Step No-Login Checkout & Razorpay UPI Flow
- [x] Build 2-Step Checkout Modal (`components/checkout/CheckoutModal.tsx`)
  - [x] Step 1: Buyer Name, WhatsApp Number, and Ticket Quantity
  - [x] Step 2: Custom fields (Roll No, Class, Target Exam for coaching events)
  - [x] Convenience fee calculator (reflecting `pass_fee_to_buyer` toggle)
- [ ] Connect Razorpay order creation Server Action (`actions/checkout.ts`)
- [ ] Integrate Razorpay client-side UPI checkout modal
- [ ] Build Webhook Route (`app/api/webhook/razorpay/route.ts`) with HMAC-SHA256 signature verification
- [ ] Record ticket in Supabase `tickets` table upon payment capture
- [ ] Credit 93% share to organizer `wallet_pending_settlement`

---

## 5. Phase 5: Tamper-Proof Cryptographic QR Pass & Download Engine
- [x] Build HMAC-SHA256 QR token generator (`lib/qr/signer.ts`)
- [x] Build Ticket Confirmation Page (`app/ticket/[token]/page.tsx`)
- [x] Construct authentic 35mm Scalloped Cinema Pass card (`components/ticket/QrPassCard.tsx`)
- [x] Add High-Contrast QR code rendering with high error correction ('H')
- [x] Integrate Local Sponsor Ad Coupon Banner below QR pass (Add-On #2)
- [x] Implement Save Pass button and WhatsApp Share button

---

## 6. Phase 6: Mobile Camera Gate Scanner (`/scan/[id]`)
- [x] Build Gate Scanner PIN Authentication screen (`app/scan/[id]/page.tsx`)
- [x] Build camera viewport with target reticle and live simulation triggers
- [x] Connect Emerald Green visual flash & Web Audio double-beep chime for Valid Pass
- [x] Connect Crimson Red visual flash & alert buzz for "ALREADY SCANNED" duplicate pass
- [ ] Connect live Upstash Redis check-in verification endpoint

---

## 7. Phase 7: Organizer Portal, Wallet Ledger & Payouts
- [x] Build 60-Second Event Creator Form (`app/organizer/create/page.tsx`)
  - [x] "Pass Fee to Buyer" toggle (0% Cost to Organizer)
  - [x] 4-Digit gate scanner PIN setup
  - [x] Pricing and seat capacity calculators
- [x] Build Organizer Dashboard (`app/organizer/dashboard/[id]/page.tsx`)
  - [x] Real-time sales counter (Gross GMV, Tickets Sold, Attendance %)
  - [x] Wallet ledger card (Pending T+2 vs Available Balance)
  - [x] "Request Withdrawal" modal (capturing UPI ID or Bank Account + IFSC)
  - [x] Offline "Issue Cash Pass" promoter desk modal

---

## 8. Phase 8: Cash Promoter & Offline Desk Mode
- [x] Build Cash Promoter desk modal inside Organizer Dashboard
- [ ] Implement offline cash pass issuance Server Action (`payment_mode = 'CASH_PROMOTER'`)
- [ ] Calculate student promoter bounties (e.g. ₹20/ticket)

---

## 9. Phase 9: Live Stage Polling & Coaching Pack Upsell
- [ ] Build Live Stage Poll viewer (`app/poll/[id]/page.tsx`)
- [ ] Implement attendee real-time voting widget
- [ ] Build Attendee Data Export button

---

## 10. Phase 10: KYC, Legal & Production Launch
- [ ] Register free Udyam MSME Certificate under parent sole proprietorship
- [ ] Submit Razorpay Live KYC with GST Non-Enrollment Declaration
- [ ] Deploy frontend to Vercel and backend to Render with 10-minute keep-alive ping
