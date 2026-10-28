# AGENTS.md — Master AI Agent Operating Instructions

> **MANDATORY PRE-TASK DIRECTIVE FOR ALL AI AGENTS (Antigravity, Claude Code, Cursor, Windsurf, Codex, Gemini):**  
> Before executing ANY user prompt, planning a task, generating code, or modifying existing files, you **MUST FIRST READ** the 9 Master Context Files located in `context/`. Never skip this step.

---

## 🏛️ The 9 Master Context Files

You must inspect and strictly adhere to these 9 authoritative documents:

1. **[`context/project-overview.md`](file:///c:/Users/AARAV%20SONI/Documents/Get%20My%20Show%20Platform/context/project-overview.md)**
   * What we are building: **GetMyShow** (`get [my ▶] show`), the problems solved, target market (Sasaram, Rohtas & Bihar), core user journeys, in-scope vs. out-of-scope features, and success metrics.
2. **[`context/architecture.md`](file:///c:/Users/AARAV%20SONI/Documents/Get%20My%20Show%20Platform/context/architecture.md)**
   * The ₹0/month cloud stack (Next.js, Supabase, Upstash Redis, Cloudflare, Cloudinary, Razorpay), directory structure, data flows, and division between Server Actions and API Routes.
3. **[`context/system-invariants-and-roadmap.md`](file:///c:/Users/AARAV%20SONI/Documents/Get%20My%20Show%20Platform/context/system-invariants-and-roadmap.md)**
   * **Absolute Invariants:** Never merge backend languages, never pay out unsettled funds, 15% event holdback rule, never rotate family PANs, avoid Render free tier webhook drops, prevent Supabase sleep, and the 14-day execution roadmap.
4. **[`context/code-standards.md`](file:///c:/Users/AARAV%20SONI/Documents/Get%20My%20Show%20Platform/context/code-standards.md)**
   * Strict TypeScript rules (zero `any`), standardized `ActionResult<T>` patterns, Next.js Server Components vs Client Components, error/loading/empty states, and Indian Rupee (₹) & IST timezone formatting.
5. **[`context/library-docs.md`](file:///c:/Users/AARAV%20SONI/Documents/Get%20My%20Show%20Platform/context/library-docs.md)**
   * Project-specific implementation blueprints for Supabase, Razorpay UPI, HMAC QR signing, `html5-qrcode` camera scanner, Upstash Redis, and MCP server usage protocols.
6. **[`context/ui-tokens.md`](file:///c:/Users/AARAV%20SONI/Documents/Get%20My%20Show%20Platform/context/ui-tokens.md)**
   * Exact CSS variables and Tailwind classes for colors (Electric Indigo `#4F46E5`, Midnight Charcoal `#0F172A`, Sunset Saffron `#F97316`), typography (Plus Jakarta Sans & JetBrains Mono), spacing, and border radius. **Never hardcode hex values.**
7. **[`context/ui-rules.md`](file:///c:/Users/AARAV%20SONI/Documents/Get%20My%20Show%20Platform/context/ui-rules.md)**
   * Authentic 35mm scalloped cinema ticket geometry, button hierarchies, status badges, mobile-first touch rules (360px baseline), sticky mobile checkout bar, and gate scanner flash states.
8. **[`context/ui-registry.md`](file:///c:/Users/AARAV%20SONI/Documents/Get%20My%20Show%20Platform/context/ui-registry.md)**
   * **Living Component Registry:** Check this table before creating any new component. If it exists, match or reuse it; if new, build it following `ui-tokens.md` and register it here immediately.
9. **[`context/progress-tracker.md`](file:///c:/Users/AARAV%20SONI/Documents/Get%20My%20Show%20Platform/context/progress-tracker.md)**
   * **Living Progress Tracker:** Check this file at the start of every session to know the exact milestone in progress. Mark items completed (`[x]`) as work is verified.

---

## 🛡️ Non-Negotiable Rules Summary
* **Do NOT guess:** If a pattern is defined in `context/`, you must use it verbatim.
* **Do NOT expose secrets:** Never prefix backend secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `QR_HMAC_SECRET`) with `NEXT_PUBLIC_`.
* **Do NOT introduce foreign runtimes:** Build strictly in Next.js + TypeScript + Tailwind. Reference repositories are for UI/logic inspiration only.
* **Always handle UI resilience:** Every interactive form must handle pending states (`isPending`), every list must have an empty state with a CTA, and every fetch must have an error state with a retry option.
