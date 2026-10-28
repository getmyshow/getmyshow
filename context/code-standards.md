# 04. Code Standards & Engineering Conventions

> **Core Purpose:** Enforce rock-solid TypeScript, Next.js App Router, and React component standards to keep human developers and AI agents 100% consistent across every session.

---

## 1. TypeScript Rules & Type Safety

### A. The Strict No-`any` Directive
* **Rule:** Never use the `any` type in application code, server actions, or component props.
* If a type is temporarily unknown, use `unknown` with a type guard function, or construct an explicit interface in `types/`.
* Enable `"strict": true` and `"noImplicitAny": true` in `tsconfig.json`.

```typescript
// ❌ FORBIDDEN
function handleOrder(order: any) {
  console.log(order.amount);
}

// ✅ MANDATORY
import { TicketOrder } from "@/types";

function handleOrder(order: TicketOrder): void {
  console.log(order.amount_paid);
}
```

### B. Standardized Result Pattern (Never Throw Unhandled Errors)
* Server actions and API helpers must return a predictable discriminated union:

```typescript
export type ActionResult<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string };
```

---

## 2. Next.js App Router Conventions

### A. Server Components by Default
* All pages and layouts are React Server Components (RSC) by default.
* Add the `"use client"` directive **only** at the top of leaf components requiring:
  * React hooks (`useState`, `useEffect`, `useTransition`, `useRef`).
  * Browser event listeners (`onClick`, `onChange`).
  * Browser-only APIs (Camera for QR scanner, Canvas/DOM for downloading pass).

### B. Server Actions for Mutations
* Co-locate server mutations in `actions/` using `"use server"`.
* Always validate inputs on the server using Zod or strict type validation before querying Supabase.
* Protect against race conditions and double-submits.

### C. Route Handlers (`app/api/`)
* Reserved strictly for webhooks (Razorpay HMAC signature verification), edge scanning APIs, and automated ping crons.
* Always return typed `NextResponse.json(...)` with explicit HTTP status codes (`200`, `400`, `401`, `404`, `500`).

---

## 3. File & Folder Naming Conventions

| Category | Convention | Examples |
| :--- | :--- | :--- |
| **Route Folders** | `kebab-case` | `app/e/[slug]/page.tsx`, `app/dashboard/[event-id]/page.tsx` |
| **Component Files** | `PascalCase.tsx` | `EventCard.tsx`, `CheckoutModal.tsx`, `QrPassCard.tsx` |
| **Server Actions** | `kebab-case.ts` | `actions/events.ts`, `actions/tickets.ts`, `actions/wallet.ts` |
| **Utility Files** | `kebab-case.ts` | `lib/formatters.ts`, `lib/qr-signer.ts`, `lib/supabase-client.ts` |
| **TypeScript Types** | `kebab-case.ts` | `types/database.ts`, `types/checkout.ts`, `types/index.ts` |
| **CSS / Token Files** | `kebab-case.css`| `app/globals.css`, `styles/tokens.css` |

---

## 4. Component Structure & Lifecycle Rules

Every React component must follow this exact sequential anatomy:
1. **Directives** (`"use client"` if needed)
2. **Imports**:
   * React and standard libraries
   * Third-party UI / icons (e.g. `lucide-react`)
   * Internal components (`@/components/...`)
   * Types & interfaces (`@/types/...`)
   * Actions & utilities (`@/actions/...`, `@/lib/...`)
3. **TypeScript Props Interface**:
   ```typescript
   interface EventCardProps {
     event: EventSummary;
     onSelect?: (id: string) => void;
     className?: string;
   }
   ```
4. **Component Implementation**:
   * Hooks & state
   * Event handlers & server action dispatchers
   * Early returns (loading, error, empty state)
   * Main JSX render tree
5. **Export**: Named export preferred for reusability; default export for page route files.

---

## 5. UI Resilience: Loading, Error & Empty States

* **Rule: Never render a blank screen or unhandled exception.**
* **Submit Buttons:** Form submit buttons must disable automatically during mutation (`isPending || isSubmitting`) with a clear spinner state to prevent double-clicks and duplicate charges.
* **Empty States:** When a list is empty (e.g. "No events in Sasaram this week"), always render a clear illustration/icon, a human-readable explanation, and an actionable CTA button ("Create Your First Event").
* **Error Boundaries:** Every major route segment must include an `error.tsx` with a "Retry" button.

---

## 6. Indian Localization: Currency & Timezone Formatting

### Currency (₹ Indian Rupee)
* Always store financial values as standard numbers or integers in PostgreSQL.
* Format for attendees using Indian comma notation (Lakhs and Crores) and ₹ symbol:

```typescript
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
// formatINR(1490000) -> "₹14,90,000"
```

### Timezone (Indian Standard Time — IST)
* **Rule:** Database stores UTC timestamp (`TIMESTAMPTZ`).
* UI converts and displays in **Asia/Kolkata (IST — UTC+5:30)**:
  * Format: `Sun, 15 Nov 2026 • 6:30 PM IST`
  * Never let a client's device timezone skew event showtimes.
