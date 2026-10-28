# 08. UI Component Registry (Living Tracker)

> **Purpose:** This is a living inventory of all UI components built in the GetMyShow platform.  
> **Rule for Agents & Developers:** Before creating a new component, check this registry. If a matching component exists, reuse it or inherit its exact styling. If building a new component, construct it using `context/ui-tokens.md` and `context/ui-rules.md`, and register it here immediately.

---

## 1. Component Registry Table

| Component Name | File Path | Category | Status | Props / Variants | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *Header* | `components/ui/Header.tsx` | Navigation | Planned | `variant?: 'public' \| 'dashboard'` | Navbar with brand mark `get [my ▶] show`, city switcher & CTA |
| *EventCard* | `components/ui/EventCard.tsx` | Public | Planned | `event: EventSummary` | Cinema card showing poster, title, venue, price, and "Book" CTA |
| *CheckoutModal* | `components/checkout/CheckoutModal.tsx` | Checkout | Planned | `isOpen: boolean, event: Event` | 2-Step no-login UPI checkout sheet |
| *QrPassCard* | `components/ticket/QrPassCard.tsx` | Ticket | Planned | `ticket: TicketDetail` | Scalloped 35mm cinema ticket with HMAC QR code and ad banner |
| *DownloadTicketBtn* | `components/ticket/DownloadTicketBtn.tsx` | Ticket | Planned | `ticketElementId: string` | Exports ticket pass as high-res PNG / PDF to user phone |
| *ScannerCamera* | `components/scanner/ScannerCamera.tsx` | Gate | Planned | `eventId: string, pin: string` | Continuous camera QR reader with audio feedback & flash |
| *WalletCard* | `components/dashboard/WalletCard.tsx` | Dashboard | Planned | `pending: number, available: number` | Financial summary card with "Request Withdrawal" trigger |
| *CashCounterModal*| `components/promoter/CashCounterModal.tsx`| Dashboard | Planned | `eventId: string` | Desk modal to issue offline cash passes with bounty tracking |
| *LivePollWidget* | `components/interactive/LivePollWidget.tsx` | Stage | Planned | `pollId: string` | Real-time audience voting and stage question widget |

---

## 2. Component Registration Protocol (How to Register New Components)

When creating a new component:
1. Verify no existing component serves the same function.
2. Follow strict naming conventions: `PascalCase.tsx` in `components/<category>/`.
3. Use the CSS variables defined in `context/ui-tokens.md`.
4. Append a row to the registry table above detailing its file path, category, variants, and purpose.
