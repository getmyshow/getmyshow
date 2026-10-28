# 08. UI Component Registry (Living Tracker)

> **Purpose:** This is a living inventory of all UI components built in the GetMyShow platform.  
> **Rule for Agents & Developers:** Before creating a new component, check this registry. If a matching component exists, reuse it or inherit its exact styling. If building a new component, construct it using `context/ui-tokens.md` and `context/ui-rules.md`, and register it here immediately.

---

## 1. Component Registry Table

| Component Name | File Path | Category | Status | Props / Variants | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Header** | `components/ui/Header.tsx` | Navigation | Completed | Default | Navbar with official SVG wordmark `get [my ▶] show`, Sasaram location badge, and "List Event" CTA. |
| **EventCard** | `components/ui/EventCard.tsx` | Public | Completed | `event: EventItem` | 35mm scalloped cinema ticket card with waist notches, poster, date, venue, and price in ₹. |
| **EventDetailView** | `components/event/EventDetailView.tsx` | Public / Detail | Completed | `event: EventItem` | Single-scroll event detail hero with share triggers, verified organizer badge, and sticky mobile purchase bar. |
| **CheckoutModal** | `components/checkout/CheckoutModal.tsx` | Checkout | Completed | `event: EventItem, isOpen: boolean, onClose: () => void` | 2-Step no-login UPI checkout modal with quantity selector, custom coaching fields, and fee calculator. |
| **QrPassCard** | `components/ticket/QrPassCard.tsx` | Ticket | Completed | `ticketNumber, qrToken, eventName, venue, eventDate, buyerName, quantity, amountPaid` | 35mm cinema ticket with circular sprocket scallops, dashed perforation line, high-contrast QR code, and local sponsor ad banner. |
| **GateScannerView** | `app/scan/[id]/page.tsx` | Gate | Completed | Default | 4-Digit PIN gate lock, camera scanner viewport, green flash valid pass, red flash duplicate alert, and Web Audio API chimes. |
| **OrganizerDashboard** | `app/organizer/dashboard/[id]/page.tsx` | Dashboard | Completed | Default | Real-time sales counter (GMV, Tickets Sold), T+2 wallet ledger card, "Request Withdrawal" modal, and offline "Issue Cash Ticket" promoter desk. |
| **EventCreator** | `app/organizer/create/page.tsx` | Organizer | Completed | Default | 60-Second single-page form with 0% commission convenience fee toggle and gate PIN setup. |

---

## 2. Component Registration Protocol

When creating a new component:
1. Verify no existing component serves the same function.
2. Follow strict naming conventions: `PascalCase.tsx` in `components/<category>/`.
3. Use the CSS variables defined in `context/ui-tokens.md`.
4. Append a row to the registry table above detailing its file path, category, variants, and purpose.
