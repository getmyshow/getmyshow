# 01. Project Overview — GetMyShow Platform

> **Brand Identity:** GetMyShow (`get [my ▶] show`)  
> **Codename:** SSM Events & Ticketing  
> **Target Region:** Sasaram (Rohtas), Dehri-on-Sone, Gaya, Patna & Tier-2/3 Bihar Cities  
> **Business Model:** Hyperlocal Event Listing + Box-Office QR Ticketing + Monetization Add-Ons  
> **Fixed Overhead Goal:** ₹0 / Month (100% Free-Tier Cloud Architecture)

---

## 1. Executive Summary & Market Thesis

National ticketing giants (BookMyShow, Paytm Insider, Zomato District) prioritize large-scale metro stadium concerts and cinema chains in Mumbai, Delhi, and Bengaluru. When local event organizers in Sasaram, Dehri-on-Sone, or Rohtas organize events, they face four fundamental roadblocks:

1. **Predatory Commission Rates (10% to 15%)**: Large platforms take a heavy cut that decimates the small budgets of local coaching seminars and college fests.
2. **Cumbersome Corporate Onboarding**: Big platforms demand formal incorporation certificates, GST proofs, and corporate contracts, taking weeks just to approve a local listing.
3. **Severe Buyer Checkout Friction**: Tier-2/3 attendees hate downloading heavy 80MB mobile apps, creating email accounts, and remembering passwords just to buy a ₹100 or ₹500 pass.
4. **Delayed Payouts (7–10 Days) & Zero Cash Support**: Existing platforms freeze funds until days after the event completes and completely ignore physical cash counter sales (hybrid box-office ticketing).

### The GetMyShow Solution
GetMyShow is a high-speed, mobile-first, **No-Login UPI Ticketing & Box-Office Platform** engineered specifically for the hyperlocal realities of Bihar.

* **Flat 7% Platform Commission**: Organizers retain 93% of ticket face value—or pay **0% commission** if they enable the "Pass Fee to Buyer" toggle.
* **Zero-Login 2-Click UPI Checkout**: Attendees enter Name + WhatsApp Number, select quantity, and pay in under 10 seconds using Google Pay, PhonePe, or Paytm.
* **Instant Digital Pass with Tamper-Proof Cryptographic QR**: Issued immediately on-screen and shareable via WhatsApp.
* **Rapid T+2 Settlements & Hybrid Sales**: Funds become available 2 business days after online payment, complemented by offline "Cash-at-Counter / Student Promoter" ticket issuance.

---

## 2. Target Market & Event Personas

| Target Vertical | Event Type | Ticket Price Range | Capacity | Hyperlocal Value Add |
| :--- | :--- | :--- | :--- | :--- |
| **Coaching Institutes** | Scholarship Tests, Career Seminars, Super 30 Style Workshops | ₹50 – ₹200 | 300 – 1,000 | Custom checkout fields (Roll No, Class, Target Exam) + Post-event attendance export |
| **Colleges & Schools** | Annual Functions, Freshers/Farewells, Tech & Cultural Fests | ₹200 – ₹500 | 500 – 1,200 | Tamper-proof admission cards + Student ambassador cash promoter network |
| **Cultural & Festival Nights** | Dandiya/Garba Nights, Holi Milan, New Year Parties | ₹500 – ₹1,000 | 400 – 1,500 | Fast gate check-in (<50ms) + Local shop sponsor banner ads on ticket passes |
| **Local Talent & Workshops** | Bhojpuri/Hindi Poetry, Regional Singers, Skill Bootcamps | ₹100 – ₹400 | 100 – 300 | Instant WhatsApp ticket sharing + Zero corporate paperwork onboarding |

---

## 3. Core Page Navigation & User Flows

```
[ Visitor / Attendee Flow ]
  Homepage (/) 
    └── Event Discovery Grid (Upcoming in Sasaram)
          └── Event Details (/e/[slug])
                └── 2-Step No-Login Checkout Modal
                      └── UPI Payment via Razorpay
                            └── Ticket Confirmation (/ticket/[qr_token])
                                  ├── Download Pass (PNG / PDF)
                                  ├── WhatsApp Share
                                  └── Live Sponsor Coupon Banner

[ Organizer Flow ]
  Organizer Portal (/organizer)
    ├── 60-Second Event Creator (/organizer/create)
    └── Organizer Event Dashboard (/dashboard/[event-id])
          ├── Live Sales Analytics (Gross GMV, Tickets Sold)
          ├── Wallet Ledger (Pending T+2 vs Available Balance)
          ├── Request Withdrawal Engine (UPI / Bank Account)
          ├── Cash Counter / Promoter Mode (Issue Cash Pass)
          └── Export Attendee Data (Excel / CSV)

[ Gate Security / Crew Flow ]
  Gate Scanner App (/scan/[event-id])
    ├── 4-Digit Security PIN Gate
    └── Continuous Camera QR Scanner
          ├── GREEN Sound & Screen: Valid Ticket (Checked In)
          └── RED Sound & Screen: "ALREADY SCANNED" (Duplicate Alert)

[ Interactive Stage Flow ]
  Live Stage Poll (/poll/[event-id])
    └── Real-time Audience Q&A / Polling Widget
```

---

## 4. Features In-Scope vs. Out-of-Scope

### In-Scope (MVP & Core Phase)
* **60-Second Event Creator**: Single-page form (Title, Venue, Date, Base Price, Total Seats, WhatsApp Number, Poster Image).
* **WhatsApp OpenGraph Cards**: Dynamic social sharing meta tags rendering rich previews with poster, title, and price in WhatsApp groups.
* **2-Step No-Login UPI Checkout**: Eliminates user account creation; captures buyer Name + WhatsApp Number + ticket count.
* **Custom Coaching/College Questions**: Dynamic form builder fields (e.g. "Class: 11th / 12th / Dropper", "Target: JEE / NEET / NDA", "Roll Number").
* **Tamper-Proof HMAC QR Ticket**: Cryptographic signature prevents Photoshop/counterfeit pass generation.
* **4-Digit PIN Mobile Camera Scanner**: Ultra-lightweight web-based scanner running on any mobile browser without native app installation.
* **Hybrid Cash Counter & Promoter Affiliate Mode**: Allows physical ticket sales by trusted receptionists and student ambassadors with bounty tracking.
* **Organizer Wallet & T+2 Payout Engine**: Transparent accounting showing Pending vs Settled balance with UTR receipt logging.
* **QR Ticket Local Sponsor Ad Banner**: High-attention ad placement slot below QR code for local cafe/store coupons.
* **Live Audience Stage Poll Widget**: Real-time polling for coaching seminars.

### Out-of-Scope (Deferred to Post-Launch)
* Native Android / iOS application downloads (PWA and responsive mobile web only).
* Multi-seat tiered auditorium venue seat selection matrices (general admission & tiered passes only).
* International payment gateways and multi-currency processing (Indian Rupee ₹ and UPI only).
* Complex multi-tenant corporate invoicing with automated GST filing (addressed via 2-stage legal roadmap).

---

## 5. Success Criteria & KPIs

* **Checkout Conversion Rate**: > 80% from clicking "Buy" to payment completion (driven by no-login UPI).
* **Gate Check-In Latency**: < 50ms verification per QR scan using cached Redis tokens.
* **Mobile Page Speed**: < 1.2 seconds load time on 4G cellular connections across Bihar.
* **Unit Economics**:
  * Platform Gross Fee: 7.00%
  * Razorpay Gateway Fee: 2.36% (2% MDR + 18% GST)
  * Net Platform Profit Margin: **4.64% per ticket**
* **Monthly Fixed Infrastructure Cost**: **₹0.00** across Vercel (Frontend), Render (Backend with 10-min keep-alive ping), Supabase (Database), Upstash Redis, Cloudinary, and Cloudflare.

