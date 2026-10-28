# 08. UI Component Registry (Living Tracker)

> **Purpose:** This is a living inventory of all UI components built in the GetMyShow platform.  
> **Rule for Agents & Developers:** Before creating a new component, check this registry. If a matching component exists, reuse it or inherit its exact styling. If building a new component, construct it using `context/ui-tokens.md` and `context/ui-rules.md`, and register it here immediately.

---

## 1. Component Registry Table

| Component Name | File Path | Category | Status | Props / Variants | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Header** | `components/ui/Header.tsx` | Navigation | Completed | Default | Eventbrite-inspired pillow navigation with official SVG wordmark `get [my ▶] show`, 100px pill search bar, Bihar city dropdown (Sasaram, Dehri-on-Sone, Patna, Gaya, Ara, Buxar), and circular Ember Orange submit CTA with Phosphor icons. |
| **CategoryCircleRow** | `components/discovery/CategoryCircleRow.tsx` | Discovery | Completed | `selectedCategory: string, onSelectCategory: (id: string) => void` | Eventbrite-style 80px circular category buttons with duotone Phosphor icons (Music, Coaching, Dance, Comedy, Sports, Tech) with horizontal overflow-x-auto scroll. |
| **EventCard** | `components/ui/EventCard.tsx` | Discovery | Completed | `event: EventItem` | Eventbrite pillow-soft 40px rounded card with 16:9 poster, floating save heart toggle, category tag, IST date/time, venue, and price badge in ₹. |
| **EventDetailView** | `components/event/EventDetailView.tsx` | Detail | Completed | `event: EventItem` | 16:9 widescreen hero stage, 2-column editorial layout with verified organizer card, location map pill, sticky desktop booking widget, and 44px sticky mobile bottom checkout bar. |
| **CheckoutModal** | `components/checkout/CheckoutModal.tsx` | Checkout | Completed | `event: EventItem, isOpen: boolean, onClose: () => void` | Eventbrite-inspired 40px pillow-soft modal container with 2-step no-login UPI checkout, quantity stepper, custom coaching registration fields, convenience fee calculator, and Razorpay UPI trigger. |
| **QrPassCard** | `components/ticket/QrPassCard.tsx` | Ticket | Completed | `ticketNumber, qrToken, eventName, venue, eventDate, buyerName, quantity, amountPaid` | Pillow-soft ticket confirmation container wrapping an authentic 35mm cinema ticket with circular sprocket scallops, dashed perforation line, high-contrast QR code, and local sponsor ad banner. |
| **GateScannerView** | `app/scan/[id]/page.tsx` | Gate | Completed | Default | Eventbrite-inspired high-speed mobile gate scanner with 4-digit PIN lock, camera reticle, full-screen green valid pass flash, red duplicate alert flash, and Web Audio API double-beep chimes. |
| **OrganizerDashboard** | `app/organizer/dashboard/[id]/page.tsx` | Dashboard | Completed | Default | Eventbrite-inspired organizer console with real-time sales metrics (GMV, Tickets Sold, Attendance %), T+2 wallet ledger card, 15% event-completion holdback rule, 12-digit UTR payout modal, and offline cash promoter desk. |
| **EventCreator** | `app/organizer/create/page.tsx` | Organizer | Completed | Default | 60-Second event creation wizard with 0% commission convenience fee toggle, gate PIN setup, and instant live preview. |
| **Footer** | `components/ui/Footer.tsx` | Navigation | Completed | Default | Eventbrite-inspired rich directory footer with Bihar city links, organizer resources, trust strip, copyright, and Phosphor icons. |

---

## 2. Component Registration Protocol

When creating a new component:
1. Verify no existing component serves the same function.
2. Follow strict naming conventions: `PascalCase.tsx` in `components/<category>/`.
3. Use the CSS variables defined in `context/ui-tokens.md`.
4. Append a row to the registry table above detailing its file path, category, variants, and purpose.
