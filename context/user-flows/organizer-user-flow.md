# 👤 Organizer User Flow — GetMyShow (Industry Standard, World-Class)

> **Version:** 1.0
> **Design Reference:** BookMyShow Organizer UI · District Dashboard · Eventbrite Control Panel · Venmo/Square Payouts
> **Platform Context:** Hyperlocal Bihar · Flat 7% Commission · T+2 Payouts · Cash Counter · 15% Holdback

---

## **ORGANIZER FLOW MAP**

```
[Home] → [Create Event] → [Dashboard] → [Manage] → [Payout] → [Collect]
   │            │              │             │          │           │
   └─ Onboard ──→ 60-Second     │    └─ Sales     │   └─ Wallet    │   └─ Export
               Creation        │       Monitor    │    Ledger     │       Data
                              │              │    Withdraw   │
                              │              │              │   ┌─ Bank  │
                              │              │              │  │ UTR     │
                              │              │              │  │ Logging │
                              │              │              │  └─ UPI     │
                              │              │              │
                              │              │   └─ Cash      │
                              │              │     Counter   │
                              │              │              │
                              │              │              │
                              │              │              │
                              │              │              │
                              │              │              │
                              └─ Check‑In     ┌─ Gate      │
                                  Monitor    │    Scanner   │
                                              │              │
                                              │              │
                                              │              │
                                              │              │
                                              └─ Revenue    │
                                              ＊ Live Polling │

```

---

## **PHASE 1 — ONBOARDING & EVENT CREATION (`/organizer/create`)**

### **1.1 Access Points**
1. **Direct link**: `/organizer/create` (bypass login for beta)
2. **Website banner**: "Create Your First Event — GetMyShow"
3. **WhatsApp**: "Share your event to create instantly"

### **1.2 60-Second Event Creation Wizard**

```
┌──────────────────────────────────────────────────────┐
│  [✓] Event Basics                                   │
│  ├──────────────────────────────────────────────────┤
│  │ Title [________________________]                 │
│  │ Slug (auto-generated: /e/[slug])               │
│  │ Description [__________________________]        │
│  │ Location [____________________________]         │
│  │ City [Sasaram • ▼]                           │
│  │ Event Date [Tue, 15 Nov 2026] [▼]            │
│  │ Event Time [6:30 PM IST] [▼]                   │
│  │ Base Ticket Price [₹500]                      │
│  │ Total Capacity [500]                           │
│  │ Organizer WhatsApp [+91 ______]                │
│  │ Event Poster [Upload (≤2MB, WebP)]             │
├──────────────────────────────────────────────────────┤
│  [>] Custom Fields (optional)                        │
│  ├─ Coaching Question (Roll No)                     │
│  ├─ College Question (Class / Target Exam)          │
│  └─ Festival Question (Group Size)                 │
├──────────────────────────────────────────────────────┤
│  [>] Gate PIN & Security                           │
│  ├─ Auto-generate [1234] [Regenerate]              │
│  ├─ Gate scanner (mobile app for crew)              │
├──────────────────────────────────────────────────────┤
│  [>] Commission Settings                           │
│  ├─ Pass Fee to Buyer (0% commission) [✅]          │
│  └─ Platform Fee 7% [₹35/ticket]                  │
└──────────────────────────────────────────────────────┘
```

### **1.1.1 Custom Field Builder**
**No-code, drag-drop field builder for coaching/college events**

| Field Type | Example | Schema |
| :--- | :--- | :--- |
| Single-line Text | Roll Number | `roll_no: string` |
| Dropdown | Class: [11th / 12th / Dropper] | `class: "11th|12th|dropper"` |
| Multiple Select | Target Exam: [JEE / NEET / NDA] | `target_exam: ["jee","neet","nda"]` |
| Date | Batch Start | `batch_start: date` |
| Mobile | Mobile Number | `mobile: string` (Indian format) |

**Backend:** `event.custom_fields` → `JSONB`
**Frontend:** Dynamic React form → Zod validation

### **1.1.2 Commission Toggle Logic**
```
Pass Fee to Buyer (0% commission) [✅]
├─ Buyer pays ₹535 (₹500 + ₹35 gateway)
├─ Organizer receives ₹500 per ticket
└─ Platform fee: ₹0 (exempt)

Platform Fee 7% [₹35/ticket]
├─ Buyer pays ₹500
├─ Organizer receives ₹500 per ticket
└─ Platform fee: ₹35/ticket
```

### **1.1.3 Validation & Auto-Save**
- **Real-time validation**: Title duplicates, date < today, capacity < price
- **Auto-save draft** to localStorage (every 10s)
- **Live preview** of ticket QR and sponsor banner (below QR)

---

## **PHASE 2 — DASHBOARD (&/dashboard/[id])**

### **2.1 Dashboard Header**
```
┌───────────────────────────────────────────────┐
│ Super 30 Scholarship Workshop (Live)          │
│ Sasaram, Bihar • Tue, 15 Nov • 6:30 PM IST   │
│                                                │
│  [+] Share Event • [✏️] Edit • [🗑️] Cancel    │
└───────────────────────────────────────────────┘
```

### **2.2 Metrics Overview (Live)**

```
┌─────────────────────────────────────────────────────┐
│  ┌───────┐   ┌───────┐    ┌───────┐   ┌───────┐      │
│  │ GMV   │   │ Sold  │    │ Seats │   │ Avail │      │
│  │ ₹4,50,000 │   │ 245  │    │ 255   │   │ 255   │      │
│  │         │   │      │    │       │   │       │      │
│  │ Daily ▲ │   │ Daily ▲│    │ Daily  │   │ Daily  │      │
│  │ +12%    │   │ +8%   │    │ +0%    │   │ +0%   │      │
│  └───────┘   └───────┘    └───────┘   └───────┘      │
│                                                     │
│  ┌───────────────┐   ┌───────────────┐             │
│  │ PENDING       │   │ AVAILABLE    │             │
│  │ (Settled)     │   │ (Ready to    │             │
│  │ T+2 Holds     │   │ Withdraw)    │             │
│  │ ₹2,50,000     │   │ ₹1,00,000    │             │
│  └───────────────┘   └───────────────┘             │
│                                                     │
│  [❗] 15% Event-Completion Holdback               │
│       Holds until 8:00 AM next day                │
└─────────────────────────────────────────────────────┘
```

### **2.2 Wallet Ledger Card (Interactive)**

```
┌─────────────────────────────────┐
│ Wallet Ledger                     │
│                                 │
│ ┌───────────────┐   ┌───────────┐ │
│ │ SETTLED       │   │ PENDING   │ │
│ │ (T+2)         │   │ (T+2)     │ │
│ │ ₹1,00,000     │   │ ₹2,50,000 │ │
│ │  ───────────   │   │  ─────────│ │
│ │ Available to │   │ Holdback  │ │
│ │ Withdraw     │   │ (15% of │ │
│ │               │   │ event)   │ │
│ └───────────────┘   └───────────┘ │
│                                 │
│ [Request Withdrawal] (Modal)    │
│ [Bank UTR Logging Required]    │
└─────────────────────────────────┘
```

### **2.2.1 Withdrawal Modal**

```
┌─────────────────────────────────────────────┐
│ Request Withdrawal                          │
├─────────────────────────────────────────────┤
│ Amount [₹50,000]                            │
│ • Available: ₹1,00,000                       │
│ • Holdback locked: ₹75,000 (15%)            │
│ • Net withdrawable: ₹25,000                 │
├─────────────────────────────────────────────┤
│ Payout Destination:                           │
│ • UPI ID [your-vpa@upi] [✓ Verified]       │
│ • OR Bank Account + IFSC                    │
├─────────────────────────────────────────────┤
│ UTR Logging (Required):                      │
│ • 12-digit Bank UTR [____________]           │
│ • UTR Validated ✓                           │
│ • Processed at: YYYY-MM-DD HH:MM            │
├─────────────────────────────────────────────┤
│ Status [✅ Processing] → [✅ Completed]   │
│                                                                        │
│ [Request Withdrawal] → [Cancel]           │
└─────────────────────────────────────────────┘
```

### **2.2.2 Cash Promoter Desk (Offline Sales)**

```
┌─────────────────────────────────┐
│ Cash Promoter Mode (Offline)    │
│                                 │
│ [+ Issue Cash Ticket]            │
│                                 │
│ Tickets Issued Today: [5]       │
│ Revenue Collected: [₹2,500]     │
│ Promoter Code: [PROMO-2026-01]  │
│                                 │
│ [View Cash Ledger]              │
│ [Settle Daily Cash]             │
└─────────────────────────────────┘
```

---

## **PHASE 3 — EVENT MANAGEMENT (Dashboard Features)**

### **3.1 Live Sales & Analytics**

```
┌──────────────────────────────────────────────────────┐
│ Sales Chart (Hourly / Daily)                          │
│   🟢 Online (UPI)  🔴 Cash (Promoter)                  │
│                                                     │
│ Revenue Breakdown:                                    │
│   • Organizer Share: ₹2,50,000                     │
│   • Platform Fee: ₹1,75,000                       │
│   • Gateway Fee: ₹25,000                           │
│   • Net Platform Profit: ₹62,500                   │
└──────────────────────────────────────────────────────┘
```

### **3.2 Attendee Check-In Management**

```
┌──────────────────────────────────────────────────────┐
│ Gate Scanner (Real-time)                              │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 4-Digit PIN [_____]                              │ │
│ │ [Scan QR] • [Manual Lookup]                       │ │
│ │                                                 │ │
│ │ ┌─────────────────────────────────────────────┐ │ │
│ │ │ Valid ✓ CHECKED IN: Rahul Kumar × 2       │ │ │
│ │ │ Scanned at: 6:45 PM                         │ │ │
│ │ └─────────────────────────────────────────────┘ │ │
│ │                                                 │ │
│ │ ┌─────────────────────────────────────────────┐ │ │
│ │ │ ❌ ALREADY SCANNED AT 6:45               │ │ │
│ │ └─────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Quick Stats:                                           │
│ • Attended: 89% (222/250)                           │
│ • Revenue per Attendee: ₹1,000                    │
│ • Peak Time: 7:00 PM                              │
│ • Waitlist Offers Active: 12                      │
└──────────────────────────────────────────────────────┘
```

### **3.3 Revenue & Promoter Tracking**

| Promoter Code | Cash Sales | Commission |
| :--- | :--- | :--- |
| PROMO-001 | ₹5,000 | 5% (₹250) |
| PROMO-002 | ₹8,000 | 7% (₹560) |
| PROMO-003 | ₹3,000 | 10% (₹300) |

**Payout to promoters:** Daily at 9 AM (T+1 after event date)

---

## **PHASE 4 — EVENT LIFECYCLE MANAGEMENT**

### **4.1 Pre-Event Actions**

```
┌──────────────────────────────────────────────────────┐
│ Pre-Event Checklist (Organizer)                      │
│ ╭───────────────────────────────────────────────────╮ │
│ │ [ ] Publish Event (Go Live)                       │ │
│ │ [ ] Set up Gate PIN in Organizer App            │ │
│ │ [ ] Create WhatsApp announcement                │ │
│ │ [ ] Verify Sponsor Ad Banner (Local Cafe)       │ │
│ │ [ ] Test Gate Scanner (offline mode)           │ │
│ │ [ ] Generate Marketing Assets (share cards)    │ │
│ │ [ ] Configure Custom Fields (Coaching/College) │ │
│ │ [ ] Setup Event Reminder (3 days before)       │ │
│ ╰───────────────────────────────────────────────────╯ │
│                                                     │
│ Event Live Countdown: [2 days]                    │
│ Attendee Growth: [245 tickets]                   │
│ Promoter Network: [3 active]                     │
└──────────────────────────────────────────────────────┘
```

### **4.2 During Event (Live Features)**

**Stage Polling (for Coaching Seminars)**
```
┌──────────────────────────────────────────────────────┐
│ Live Stage Poll Widget                                │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Question: Which topic is most relevant?       │ │
│ │ 🗳️ JEE Syllabus ──── 45%                          │ │
│ │ 🗳️ NEET Syllabus ──── 32%                        │ │
│ │ 🗳️ NDA Math ──────── 23%                          │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Real-time Q&A (for live seminars):                 │
│ • [Chat] • [Ask a Question] • [Live Answers]      │
│                                                     │
│ Check-in Heatmap:                                        │
│     7:00 PM ──🔥── 8:00 PM                              │
│   (Red = Peak Check-in Time)                           │
└──────────────────────────────────────────────────────┘
```

### **4.3 Post-Event Actions**

```
┌──────────────────────────────────────────────────────┐
│ Post-Event Review (Organizer)                        │
│ ╭───────────────────────────────────────────────────╮ │
│ │ 15% Holdback Status: Still Locked               │ │
│ │ until 8:00 AM tomorrow (Tue, Nov 16)           │ │
│ │                                             │ │
│ │ [Generate Payout Report]                         │ │
│ │ [Download Attendee CSV]                         │ │
│ │ [Settle with Promoters]                         │ │
│ │ [Close Event (after payouts)]                   │ │
│ │                                             │ │
│ │ Event Performance:                                 │ │
│ │ • Attendance: 89% (222/250)                     │ │
│ │ • Revenue: ₹2,50,000                           │ │
│ │ • Net Organizer Share: ₹2,06,250              │ │
│ ╰───────────────────────────────────────────────────╯ │
│                                                     │
│ Next Event: [Create New Event] → [Quick Clone]   │
└──────────────────────────────────────────────────────┘
```

---

## **PHASE 5 — FINANCIAL & COMPLIANCE**

### **5.1 Wallet & Payout Rules**

**Rule 2.1 — Never Pay Unsettled Funds**
- T+2 settlement means money in `wallet_pending_settlement` cannot be withdrawn early
- Clear indicator: "This amount will be available for withdrawal tomorrow"

**Rule 2.2 — Event-Completion Holdback (15%)**
```
┌──────────────────────────────────────────────────────┐
│ 15% Holdback (Non-Withdrawable)                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 15% of ticket revenue locked until              │ │
│ │ Event Date + 1 day 8:00 AM IST                 │ │
│ │                                             │ │
│ │ Event: Super 30 (Nov 15)                     │ │
│ │ Holdback Window: Nov 16, 8:00 AM – Nov 17,    │ │
│ │ 7:59 AM IST                                 │ │
│ │                                             │ │
│ │ Holdback Amount: ₹37,500                      │ │
│ │ Available to Withdraw: ₹212,500             │ │
│ └─────────────────────────────────────────────────┘ │
│                                             │
│ Organizer Can Withdraw: ₹1,00,000           │
│ Holdback: ₹75,000 (until Nov 16, 8:00 AM)    │
│                                             │
│ 📍 UTR Required for withdrawal                │
│ 📍 Withdrawal processed: Nov 16, 10:30 AM   │
└──────────────────────────────────────────────────────┘
```

### **5.2 Promoter Settlement**

```
┌──────────────────────────────────────────────────────┐
│ Promoter Payouts                                   │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Promoter: PROMO-001                            │ │
│ │ Cash Sales: ₹5,000                             │ │
│ │ Commission: 5% (₹250)                         │ │
│ │ Promoter Share: ₹4,750                         │ │
│ │ Status: Paid Nov 16, 10:45 AM                 │ │
│ └─────────────────────────────────────────────────┘ │
│                                             │
│ Promoter: PROMO-002                            │
│ Cash Sales: ₹8,000                             │ │
│ Commission: 7% (₹560)                         │ │
│ Promoter Share: ₹7,440                         │ │
│ Status: Paid Nov 16, 11:00 AM                 │ │
│                                             │ │
│ Promoter: PROMO-003                            │ │
│ Cash Sales: ₹3,000                             │ │
│ Commission: 10% (₹300)                        │ │
│ Promoter Share: ₹2,700                         │ │
│ Status: Paid Nov 16, 11:15 AM                 │ │
│                                             │ │
│ [Settle All Promoters] (auto-calculate fees)   │ │
└──────────────────────────────────────────────────────┘
```

### **5.3 Legal & KYC Compliance**

**2-Stage Legal Roadmap**
```
Stage 1 (₹0 – ₹18 Lakhs GMV)
├─ Sole proprietorship in parent/guardian name
├─ Udyam MSME Certificate (free)
├─ Razorpay GST Non-Enrollment Declaration
├─ Collection Agent Agreement (1-page PDF)
└─ Platform Fee: 0% (Pass Fee to Buyer)

Stage 2 (>₹18 Lakhs GMV)
├─ Register GST using earned net profits
├─ Automated gateway split (Razorpay Route or Cashfree)
├─ 93% direct to organizer bank account
└─ Platform commission (7%) only on turnover
```

---

## **🚨 CRITICAL COMPLIANCE RULES**

1. **Never Rotate Family PANs** — Always use primary account holder name
2. **15% Holdback Must Be Enforced** — Non-negotiable
3. **UTR Required for Payouts** — 12-digit verification mandatory
4. **No Early Withdrawal** — T+2 settlement enforced
5. **Event Cancellation Fees** — Refund all tickets, delete waiting list
6. **Sponsor Ad Policy** — Local Bihar businesses only

---

## **📊 ORGANIZER ANALYTICS DASHBOARD**

### **KPI Widgets (Real-time)**
```
┌─────────────────────────────────┐
│ Daily KPIs (Live)                │
├─────────────────────────────────┤
│ Attendance Rate: 89% (222/250) │
│ Revenue per Attendee: ₹1,000   │
│ Peak Check-in Time: 7:00 PM     │
│ Promoter Network: 3/10 Active  │
├─────────────────────────────────┤
│ Cash vs Online Split:            │
│ 🟢 Online (UPI): 78% (196/250)  │
│ 🔴 Cash (Promoter): 22% (54/250)│
└─────────────────────────────────┘
```

### **Download & Export**

| Format | Data | Frequency |
| :--- | :--- | :--- |
| CSV | Attendee List (Name, WhatsApp, Roll No, Class) | Daily backup |
| Excel | Sales Analytics (GMV, Commission, Gate Check-in) | Weekly |
| PDF | Payout Report (UTR, Bank Details) | Monthly |

---

## **🔧 TECHNICAL INTEGRATIONS (Industry Standard)**

### **Backend APIs (Render Service)**
```
GET /api/organizer/dashboard/[id]      → Organizer dashboard data
POST /api/wallet/request              → Withdrawal request
POST /api/wallet/verify-utr          → UTR validation
POST /api/gate/check-in              → QR scan verification
GET /api/events/[id]/analytics       → Real-time analytics
POST /api/promoter/commission        → Promoter payout calculation
```

### **Frontend Components**
- **OrganizerDashboard** (Real-time metrics)
- **EventCreator** (60-second wizard)
- **WalletLedger** (T+2 + 15% holdback)
- **GateScanner** (4-digit PIN + QR scanner)
- **CashPromoterDesk** (offline ticket issuance)

---

## **📈 SUCCESS METRICS (Organizer-Focused)**

| Metric | Target | Industry Benchmark |
| :--- | :--- | :--- |
| Ticket Sales Conversion | >65% | Eventbrite: 45–55% |
| Promoter Network Growth | 10 events/month | Square: 15–20% |
| UTR Validation Speed | <5 min | Razorpay: 2–3 min |
| Cash Promoter Adoption | >30% of sales | Hi.Events: 40% |
| Holdback Compliance | 100% | BookMyShow: 85% |
| Payout Accuracy | 99.99% | District: 99.8% |
