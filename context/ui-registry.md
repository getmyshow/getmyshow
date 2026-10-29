# 08. UI Component Registry (Living Tracker)

> **Purpose:** This is a living inventory of all UI components built in the GetMyShow platform.  
> **Rule for Agents & Developers:** Before creating a new component, check this registry. If a matching component exists, reuse it or inherit its exact styling. If building a new component, construct it using `context/ui-tokens.md` and `context/ui-rules.md`, and register it here immediately.

---

## 1. Component Registry Table

| Component Name | File Path | Category | Status | Props / Variants | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Header** | `components/ui/Header.tsx` | Navigation | Completed | Default | Eventbrite-inspired pillow navigation with official SVG wordmark `get [my ▶] show`, 100px pill search bar, Bihar city dropdown (Sasaram, Dehri-on-Sone, Patna, Gaya, Ara, Buxar), and circular Ember Orange submit CTA with Phosphor icons. |
| **CategoryCircleRow** | `components/discovery/CategoryCircleRow.tsx` | Discovery | Completed | `selectedCategory: string, onSelectCategory: (id: string) => void` | Eventbrite-style 80px circular category buttons with duotone Phosphor icons (Music, Coaching, Dance, Comedy, Sports, Tech) with horizontal overflow-x-auto scroll. |
| **CategoryIconRow** | `components/discovery/CategoryIconRow.tsx` | Discovery | Completed | `selectedCategory: string, onSelectCategory: (id: string) => void` | BookMyShow/District-style horizontal icon row with 8 colored icon pills (Music, Live Concert, Cultural, College Fests, Comedy, Sports, Marathon, Cricket) — responsive horizontal scroll, 44px touch targets, brand-colored icon backgrounds. |
| **EventCard** | `components/ui/EventCard.tsx` | Discovery | Completed | `event: EventItem, featured?: boolean` | Pillow-soft card with optional `featured` 2-column wide spotlight layout, 16:9 poster, floating save heart toggle, category tag, IST date/time, venue, and price badge in tabular ₹ figures. |
| **EventDetailView** | `components/event/EventDetailView.tsx` | Detail | Completed | `event: EventItem` | 16:9 widescreen hero stage, 2-column editorial layout with verified organizer card, location map pill, sticky desktop booking widget, and 44px sticky mobile bottom checkout bar. |
| **CheckoutModal** | `components/checkout/CheckoutModal.tsx` | Checkout | Completed | `event: EventItem, isOpen: boolean, onClose: () => void` | 2-step no-login UPI checkout with visual 8-minute reservation hold progress bar, 1-tap quick promo code chips (`BIHAR20`, `SUPER50`, `FIRSTSHOW`), 1-tap preferred UPI app selector (GPay, PhonePe, Paytm, Any UPI), custom fields, convenience fee calculator, and Razorpay UPI trigger. |
| **QrPassCard** | `components/ticket/QrPassCard.tsx` | Ticket | Completed | `ticketNumber, qrToken, eventName, venue, eventDate, buyerName, quantity, amountPaid` | Authentic 35mm cinema ticket with 14 top circular sprocket pin-feed perforations, live anti-screenshot dynamic hologram ribbon with real-time IST second clock, dashed perforation line, high-contrast QR code, local partner tear-away voucher (Maurya Royal Cafe), and 2X canvas pass generator. |
| **GateScannerView** | `app/scan/[id]/page.tsx` | Gate | Completed | Default | Industrial turnstile HUD with corner brackets, calibration tick marks, sweeping laser beam, tactile 3x4 keypad matrix with haptic feedback (`navigator.vibrate`) and 4 glowing digit slot indicators, sunlight mode toggle (☀️/🌙), stamp animation for `ENTRY GRANTED`, hazard diagonal stripes for `ALREADY SCANNED`, camera reticle, and Web Audio chimes. |
| **OrganizerDashboard** | `app/organizer/dashboard/[id]/page.tsx` | Dashboard | Completed | Default | Organizer console with real-time sales metrics (GMV, Tickets Sold, Attendance %), T+2 wallet ledger card, 15% event-completion holdback rule, 12-digit UTR payout modal, offline cash promoter desk, RBAC gate scanner provision modal with 1-click WhatsApp dispatch, and 100% tokenized styling. |
| **EventCreator** | `app/organizer/create/page.tsx` | Organizer | Completed | Default | 60-Second event creation wizard with 0% commission convenience fee toggle, gate PIN setup, and instant live preview. |
| **Footer** | `components/ui/Footer.tsx` | Navigation | Completed | Default | Eventbrite-inspired rich directory footer with Bihar city links, organizer resources, trust strip, copyright, and Phosphor icons. |
| **MobileBottomNav** | `components/ui/MobileBottomNav.tsx` | Navigation | Completed | Default | Viewport-isolated mobile bottom sticky bar mounted at root layout outside WebKit blur context. 5 navigation touch targets: Explore, Search, Host (+), Passes, Studio with safe-area insets. |
| **CityDetailView** | `components/city/CityDetailView.tsx` | Discovery | Completed | `citySlug: string` | Dedicated city events landing page with photographic hero, regional badge, category chips, date filters, dynamic Supabase events feed, and quick host CTA. |
| **Badge** | `components/ui/badge.tsx` | UI Primitive | Completed | `variant: default \| secondary \| destructive \| outline` | shadcn/ui badge primitive styled with GetMyShow brand tokens (Electric Indigo, Midnight Charcoal, Sunset Saffron). |
| **CardCarousel** | `components/ui/card-carousel.tsx` | UI Carousel | Completed | `images, autoplayDelay, showPagination, showNavigation, badgeText, heading, description` | 3D coverflow Swiper carousel for featured event spotlights and highlights with smooth autoplay, pagination, and navigation. |
| **QRCode** | `components/ui/qr-code.tsx` | UI / Ticket | Completed | `value, size, variant (dots \| rounded \| squares), errorCorrection, margin, color, background, reveal` | Crisp SVG QR code rendered on server or client using `qrcode` encoder with animated center-outward reveal mask. |

---

## 2. Component Registration Protocol

When creating a new component:
1. Verify no existing component serves the same function.
2. Follow strict naming conventions: `PascalCase.tsx` in `components/<category>/`.
3. Use the CSS variables defined in `context/ui-tokens.md`.
4. Append a row to the registry table above detailing its file path, category, variants, and purpose.
