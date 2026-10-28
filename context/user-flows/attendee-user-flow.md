# 👤 Attendee User Flow — GetMyShow (Industry Standard, World-Class)

> **Version:** 1.0
> **Design Reference:** BookMyShow · District · Eventbrite · Razorpay Checkout UX · 35mm Cinema Ticket
> **Platform Context:** Hyperlocal Tier-2/3 Bihar · Zero-Login · UPI · WhatsApp · HMAC QR

---

## 🎯 **North Star Metric**
**"Tap → Pay → Show → Scan in under 45 seconds total."**

---

## **USER FLOW MAP (End-to-End)**

```
[Home] → [Discover] → [Event Detail] → [Checkout] → [Ticket] → [Gate Scan] → [Done]
   │            │               │              │            │            │            │
   └── Browse    └── Filter       └── Tier          └── UPI      └── WhatsApp   └── Green/Red
                (Category/     (GA/VIP)        (2-step)     └── QR      └── Flash
                 City/Date)                         └── Custom

```

---

## **PHASE 1 — ATTENTEE DISCOVERY (Homepage `/`)**

### **1.1 Entry & First Impression**

| Step | Screen | UX Details | Industry Benchmark |
| :--- | :--- | :--- | :--- |
| 1.1 | Homepage | Auto-detect city from GPS/WiFi or show Bihar city pill selector (Sasaram, Dehri, Patna, Gaya, Ara, Buxar) | Eventbrite / District location prompt |
| 1.2 | Hero Strip | "Get [my ▶] show" wordmark · Search bar · IST date strip (Today / Tomorrow / This Weekend) | Eventbrite hero |
| 1.3 | Category Carousel | 80px circular duotone icons: 🎓 Coaching · 🎤 Cultural · 🎭 College · 🕺 Dance · 🎸 Live Music · 🏏 Sports · 💼 Workshops | District category rail |

### **1.2 Event Discovery Grid**

```
┌─────────────────────────────────────────────────┐
│  [CategoryCircleRow]                             │
│  ◯ 🎓 Coaching   ◯ 🎤 Music   ◯ 🎭 Dance ...     │
├─────────────────────────────────────────────────┤
│  [EventCard]  [EventCard]  [EventCard]          │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐│
│  │ 16:9 Poster │  │ 16:9 Poster │  │ 16:9... ││
│  │ ♥ Save      │  │ ♥ Save      │  │ ♥ Save   ││
│  │ Coaching    │  │ Cultural    │  │ College  ││
│  │ Sun 6:30 PM │  │ Sat 8:00 PM │  │ Fri 5:30 ││
│  │ Post Office │  │ Golghar     │  │ Patna Univ││
│  │ Chowk       │  │ Chowk       │  │ Hall      ││
│  │ ₹500        │  │ ₹800        │  │ ₹300      ││
│  └─────────────┘  └─────────────┘  └──────────┘│
├─────────────────────────────────────────────────┤
│  [EventCard]  [EventCard]  ...                  │
└─────────────────────────────────────────────────┘
```

**Card Anatomy (EventCard):**
```
┌──────────────────────────────┐
│ [16:9 Poster] ♥  Save         │
│ [Category Pill]               │
│ Title (2-line clamp)          │
│ 📅 IST: Sun, 15 Nov • 6:30 PM │
│ 📍 Venue (1-line)             │
│ ₹ Price Badge (Primary/      │
│    Saffron for VIP)          │
└──────────────────────────────┘
```

**Key UX Decisions:**
- **Horizontal scroll category rail** with snap scrolling (80px circles, 44px min touch target)
- **Event cards** max 2-line title clamp, never overflow
- **₹ price badge** — Primary Indigo for GA, Sunset Saffron for VIP
- **Empty state**: Clear illustration + "No events in {city} this week" + CTA "Explore All Cities"
- **Skeleton loading** on first paint (never blank)

---

## **PHASE 2 — EVENT DETAIL (`/e/[slug]`)**

### **2.1 Screen Layout (Mobile-First)**

```
┌─────────────────────────────────────┐
│  [Sticky Top Bar] ← Home · /e/slug  │
├─────────────────────────────────────┤
│  [16:9 Hero Poster]                  │
│   Overlay: Title + Date + Venue    │
├─────────────────────────────────────┤
│  [Title]                             │
│  [Verified Organizer Card]         │
│   ✓ Udyam MSME Verified            │
│   Organizer: XYZ Coaching           │
│   WhatsApp: +91 XXXXXXX             │
│   [Chat on WhatsApp]               │
│                                     │
│  [Location Map Pill]  [Share Event]│
│  📍 Post Office Chowk, Sasaram    │
│  [Open in Google Maps]             │
│                                     │
│  [Description] (collapsible)       │
│  [Event Details List]              │
│   • Date/Time (IST)                 │
│   • Capacity (X / Y seats)         │
│   • Entry: Arrive 30 min early     │
│   • Age/Group restrictions        │
│                                     │
│  [🎟 TICKET TIERS]                  │
│  ┌─────────────────────────────────┐│
│  │ ○ General Admission    ₹500   ││
│  │   Remaining: 124 seats        ││
│  ├─────────────────────────────────┤│
│  │ ● VIP Pass            ₹900   ││
│  │   Includes: Front-row seat   ││
│  │   + 1 backstage access       ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  [STICKY MOBILE CHECKOUT BAR]       │
│  [Event Title] · [₹900] · [Buy Passes] │
└─────────────────────────────────────┘
```

### **2.2 Sticky Mobile Checkout Bar (Critical)**

```
┌─────────────────────────────────────┐
│ [🎟] Super 30 Scholarship Workshop   │
│      [₹900]  [Buy Passes →]          │
├─────────────────────────────────────┤
│  fixed bottom-0 · z-50               │
│  bg-surface-card/95 backdrop-blur   │
│  border-t border-surface-border    │
└─────────────────────────────────────┘
```

**Bar Contents:**
- Event title (1-line ellipsis)
- Price badge (formatted INR)
- Primary CTA: "Buy Passes" (44×44px min touch)
- Live availability count (e.g., "87 seats left")

### **2.3 Organizer Card Behavior**
- **Verified badge**: Udyam MSME / Govt Registered (green check)
- **WhatsApp CTA**: One-tap "Chat Organizer" → `wa.me/{number}?text=Hi...`
- **Organizer stats**: Events hosted, total tickets sold

---

## **PHASE 3 — CHECKOUT (`/e/[slug]` → CheckoutModal)**

### **3.1 Entry Points (3 Triggers)**
1. Sticky mobile checkout bar CTA
2. Desktop sticky booking widget (right column, `top-8`)
3. Tier card "Select" button

### **3.2 Checkout Modal Flow (2-Step No-Login)**

```
┌─────────────────────────────────────────┐
│  [Close X]  Step 2 of 2 — Checkout      │
├─────────────────────────────────────────┤
│  Event: Super 30 Scholarship Workshop  │
│  Tier: VIP Pass · ₹900                 │
├─────────────────────────────────────────┤
│  Step 2: Your Details                  │
│  ┌─────────────────────────────────┐ │
│  │ Full Name [____________]        │ │
│  │ WhatsApp Number [+91 _____]     │ │
│  │                                 │ │
│  │ Quantity  [ 1 ]  [+] [–]        │ │
│  │   (Multi-buy supported)          │ │
│  └─────────────────────────────────┘ │
│                                         │
│  [If Coaching/College event]          │
│  Custom Fields (Dynamic):             │
│   • Roll Number [________]             │
│   • Class [11th / 12th / Dropper]    │
│   • Target Exam [JEE / NEET / NDA]   │
│                                         │
│  Convenience Fee: ₹0 (or +₹30 if     │
│  Pass Fee to Buyer enabled)          │
│                                         │
│  [₹9,00,000 total? No → ₹900]        │
│                                         │
│  [Pay ₹900 via UPI →]                 │
└─────────────────────────────────────────┘
```

### **3.3 Field Specifications**
| Field | Type | Validation | Keyboard |
| :--- | :--- | :--- | :--- |
| Full Name | `text` | Required, ≥2 chars | Text |
| WhatsApp Number | `tel` / `inputMode="numeric"` | Required, Indian format (10 digits) | Numeric keypad |
| Quantity | Stepper | 1–10 (max 10/ticket per order) | +/- buttons, 44×44px |

### **3.4 Payment Execution**
```
[Pay via UPI] → Razorpay Checkout Sheet (Google Pay / PhonePe / Paytm)
    → UPI Intent/Collect → Auth → Success
        → Razorpay HMAC Webhook (server) → Ticket Issued (DB)
        → Redirect to /ticket/[qr_token]
        → Confetti/Success state (light)
```

### **3.5 Edge States**
| State | UX | Copy |
| :--- | :--- | :--- |
| Payment dismissed | Close modal → return to event detail, keep draft | "Payment cancelled. Your details were saved locally." |
| Webhook timeout | Optimistic UI + retry | "Confirming your payment… if not received in 5s, retry" |
| Sold out during checkout | Disable tier, show waitlist CTA | "Almost full — Join waitlist" |
| Custom field invalid | Inline error under field | "Roll number must be numeric (6 digits)" |

---

## **PHASE 4 — TICKET CONFIRMATION (`/ticket/[qr_token]`)**

### **4.1 QrPassCard (35mm Cinema Ticket Geometry)**

```
┌──────────────────────────────────────────────┐
│  ◠◠◠  (Sprocket Scallops Top)                │
│  ┌──────────────────────────────────────────┐  │
│  │  🎟 SUPER 30 SCHOLARSHIP WORKSHOP       │  │
│  │                                          │  │
│  │  [QR Code]  ← 12px quiet zone,         │  │
│  │              HMAC-SHA256 token          │  │
│  │  [VIP Badge]  Seat: VIP-07            │  │
│  │  Buyer: Rahul Kumar · Qty: 1          │  │
│  │  Venue: Post Office Chowk             │  │
│  │  IST: Sun, 15 Nov · 6:30 PM           │  │
│  │  [Sponsor Ad: Local Cafe 10% Off]    │  │
│  └──────────────────────────────────────────┘
│  ◠◠◠  (Sprocket Scallops Bottom)
│  ──── Vertical Dashed Perforation ────────
└──────────────────────────────────────────────┘
```

### **4.2 Confirmation Screen Actions**
```
[Download Pass (PNG)]  [Share via WhatsApp]  [Save to Wallet]  [Done → Home]
```

### **4.3 WhatsApp Share Deep Link**
```
whatsapp://send?text=
  🎟️ [Event] — Super 30 Scholarship Workshop
  📅 Sun, 15 Nov · 6:30 PM IST
  📍 Post Office Chowk, Sasaram
  🎫 VIP Pass · ₹900
  🎟️ [QR Image]

  or web fallback: https://getmyshow.in/t/[qr_token]
```

---

## **PHASE 5 — GATE ENTRY (`/scan/[event-id]`)**

### **5.1 Crew Scanner Flow**
```
[4-Digit PIN Gate] → Camera Scanner (html5-qrcode)
    → [Scan QR]
        ├── ✅ VALID → FULL-SCREEN GREEN FLASH (#10B981)
        │              + "CHECKED IN: Rahul Kumar × 1"
        │              + double-beep chime
        ├── ❌ DUPLICATE → FULL-SCREEN RED FLASH (#EF4444)
        │              + "ALREADY SCANNED AT 18:22"
        │              + error beep
        └── ❌ INVALID → ORANGE FLASH + "INVALID PASS"
```

### **5.2 Attendee Presentation**
- Attendee opens ticket → shows QR to gate
- Crew scans → green flash → check-in complete
- **< 50ms verification** (Upstash Redis cached token)

---

## **PHASE 6 — POST-PURCHASE (Optional Post-Event)**

| Step | UX |
| :--- | :--- |
| 6.1 | Ticket received → Add to device wallet |
| 6.2 | WhatsApp group share for group bookings (₹/head discount auto-applied) |
| 6.3 | Post-event feedback (NPS: "How was your experience?") |

---

## **🚨 CRITICAL USER FLOW RULES (Industry Standard)**

1. **Never ask for login** — Name + WhatsApp only (GetMyShow moat)
2. **Always show IST time** — never local device time
3. **Always confirm payment before issuing ticket** — webhook idempotent
4. **Always show QR quiet zone** — 12px white padding min
5. **Always use 44×44px touch targets** — 360px baseline
6. **Always show live availability** — "X seats left" urgency

---

## **📊 KEY METRICS TO TRACK (User Flow Analytics)**

| Funnel Stage | Event | Success Metric |
| :--- | :--- | :--- |
| Discovery → Detail | `/e/[slug]` | 60%+ scroll depth to CTA |
| Detail → Checkout | Modal open | 25%+ click-through |
| Checkout → Payment | Razorpay | **>80% payment completion** |
| Payment → Ticket | Redirect | 100% ticket issuance success |
| Ticket → Gate | Scan | Check-in success rate |
