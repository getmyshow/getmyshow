# 09. Project Progress & Milestone Tracker (Living Document)

> **Purpose:** Living checklist of all engineering and go-to-market milestones for GetMyShow.  
> **Agent & Developer Rule:** At the beginning of every session, consult this file to determine the exact next task. Mark items as `[x]` as they are completed and verified.

---

## Current Status Overview
* **Active Sprint:** Phase 1 (Foundation & Context Initialization)
* **Last Updated:** 2026-10-28
* **Next Immediate Task:** Scaffold Next.js 15+ App Router application files and database client.

---

## 1. Phase 1: Environment, Database & Tooling Setup
- [x] Create GitHub repository (`coder-aarav0/getmyshow`) and push initial commit
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
- [ ] Initialize Next.js 15+ with TypeScript and Tailwind CSS
- [ ] Configure `tailwind.config.ts` with brand tokens (Electric Indigo, Midnight Charcoal, Sunset Saffron)
- [ ] Install base dependencies (`@supabase/supabase-js`, `lucide-react`, `qrcode`, `razorpay`)
- [ ] Setup Supabase client helpers (`lib/supabase/client.ts` and `lib/supabase/server.ts`)
- [ ] Import official SVG and PNG brand marks into `public/brand/`
- [ ] Create global layout (`app/layout.tsx`) with Plus Jakarta Sans & JetBrains Mono typography

---

## 3. Phase 3: Public Event Discovery & Detail Experience
- [ ] Build Header navigation bar with brand mark, location selector (Sasaram/Rohtas), and "List Event" CTA
- [ ] Build Homepage (`app/(public)/page.tsx`) with curated Bihar events grid
- [ ] Build Event Card component (`components/ui/EventCard.tsx`) with date badge, venue, and price
- [ ] Build Single-Scroll Event Detail Page (`app/(public)/e/[slug]/page.tsx`)
- [ ] Add OpenGraph meta tags generator for WhatsApp rich link cards
- [ ] Implement Mobile Sticky Bottom Bar for instant pass booking

---

## 4. Phase 4: 2-Step No-Login Checkout & Razorpay UPI Flow
- [ ] Build 2-Step Checkout Modal (`components/checkout/CheckoutModal.tsx`)
  - [ ] Step 1: Buyer Name, WhatsApp Number, and Ticket Quantity
  - [ ] Step 2: Custom fields (Roll No, Class, Target Exam for coaching events)
- [ ] Implement convenience fee calculator (reflecting `pass_fee_to_buyer` toggle)
- [ ] Implement Razorpay order creation Server Action (`actions/checkout.ts`)
- [ ] Integrate Razorpay client-side UPI checkout modal
- [ ] Build Webhook Route (`app/api/webhook/razorpay/route.ts`) with HMAC-SHA256 signature verification
- [ ] Record ticket in Supabase `tickets` table upon payment capture
- [ ] Credit 93% share to organizer `wallet_pending_settlement`

---

## 5. Phase 5: Tamper-Proof Cryptographic QR Pass & Download Engine
- [ ] Build HMAC-SHA256 QR token generator (`lib/qr/signer.ts`)
- [ ] Build Ticket Confirmation Page (`app/(public)/ticket/[token]/page.tsx`)
- [ ] Construct authentic 35mm Scalloped Cinema Pass card (`components/ticket/QrPassCard.tsx`)
- [ ] Add High-Contrast QR code rendering with high error correction
- [ ] Integrate Local Sponsor Ad Coupon Banner below QR pass
- [ ] Implement Download Pass button (saving pass image directly to phone gallery)
- [ ] Add WhatsApp Share button with pre-filled message

---

## 6. Phase 6: Mobile Camera Gate Scanner (`/scan/[id]`)
- [ ] Build Gate Scanner PIN Authentication screen (`app/(gate)/scan/[id]/page.tsx`)
- [ ] Integrate `html5-qrcode` rear-camera video scanner
- [ ] Build low-latency verification API (`app/api/scan/verify/route.ts`)
- [ ] Connect Upstash Redis set for <50ms duplicate scan detection
- [ ] Implement Emerald Green visual flash & double-beep chime for Valid Pass
- [ ] Implement Crimson Red visual flash & alert buzz for "ALREADY SCANNED" duplicate pass

---

## 7. Phase 7: Organizer Portal, Wallet Ledger & Payouts
- [ ] Build 60-Second Event Creator Form (`app/(organizer)/organizer/create/page.tsx`)
  - [ ] Poster upload with Cloudinary auto-WebP compression
  - [ ] "Pass Fee to Buyer" toggle
  - [ ] 4-Digit gate scanner PIN setup
  - [ ] Custom questionnaire builder
- [ ] Build Organizer Dashboard (`app/(organizer)/dashboard/[id]/page.tsx`)
  - [ ] Real-time sales counter (Gross GMV, Tickets Sold, Attendance %)
  - [ ] Wallet ledger card (Pending T+2 vs Available Balance)
  - [ ] "Request Withdrawal" modal (capturing UPI ID or Bank Account + IFSC)
  - [ ] Auto-generate 1-page PDF settlement statement with 12-digit Bank UTR

---

## 8. Phase 8: Cash Promoter & Offline Desk Mode
- [ ] Build Cash Promoter desk modal inside Organizer Dashboard
- [ ] Implement offline cash pass issuance Server Action (`payment_mode = 'CASH_PROMOTER'`)
- [ ] Calculate student promoter bounties (e.g. ₹20/ticket)
- [ ] Generate instant printable QR pass for cash buyers on the spot

---

## 9. Phase 9: Live Stage Polling & Coaching Pack Upsell
- [ ] Build Live Stage Poll viewer (`app/(interactive)/poll/[id]/page.tsx`)
- [ ] Implement attendee real-time voting widget
- [ ] Build Attendee Data Export button (downloading verified Excel sheet of checked-in students)

---

## 10. Phase 10: KYC, Legal & Production Launch
- [ ] Register free Udyam MSME Certificate under parent sole proprietorship
- [ ] Submit Razorpay Live KYC with GST Non-Enrollment Declaration
- [ ] Configure Cloudflare Cron ping worker to keep Supabase awake 24/7/365
- [ ] Deploy production Next.js app to Vercel Hobby Tier
- [ ] Run live on-ground test in Sasaram (Gaurakshani / Post Office Chowk)

