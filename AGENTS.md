# 🤖 Universal AI Agent System Instructions (AGENTS.md) — GetMyShow Platform

> **MANDATORY PRE-TASK DIRECTIVE FOR ALL AI AGENTS (Antigravity, Claude Code, Cursor, Windsurf, Codex, Gemini):**  
> Before executing ANY user prompt, planning a task, generating code, or modifying existing files, you **MUST FIRST READ** the 9 Master Context Files located in `context/`. Never skip this step.
>
> This document defines universal operating guidelines, architectural constraints, tool execution protocols, anti-slop frontend standards, and skill orchestration rules for all AI coding agents working in this repository. Read this before analyzing, writing, or modifying any code.

---

## 🏛️ The 9 Master Context Files

You must inspect and strictly adhere to these 9 authoritative documents in `context/`:

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

## 🛡️ 1. Core Architectural & Safety Rules

1. **Strict Docker-Free Operations**:
   * Never spawn or require Docker containers for GitHub operations or Git sync.
   * All GitHub MCP interactions use `@modelcontextprotocol/server-github` via standard Node/NPX configured in `.mcp.json`.
2. **Strict Git Safety Protocols**:
   * NEVER run `git clean -fd` or `git reset --hard` blindly without checking `git status`.
   * NEVER delete untracked files or directories without backing up or asking the user.
   * Always protect credentials and tokens (`.gitignore` must protect `.mcp.json`, `githubPAT.md`, `.env*`, and private keys).
3. **The Unified Stack Rule (Never Merge Languages)**:
   * Build strictly in **Next.js 15+ App Router + TypeScript + Tailwind CSS + Supabase**.
   * Reference repositories (`Hi.Events`, `revel-backend`, `gathio`) are for UI/logic/schema reverse-engineering only. Never introduce Python, PHP, or foreign runtimes into the production codebase.
4. **TypeScript & Code Quality Standards**:
   * **Zero `any` types**: All props, state, API routes, and Server Actions must use strongly-typed interfaces from `types/`.
   * **Standardized Result Pattern**: Server actions must return `ActionResult<T> = { success: true; data: T } | { success: false; error: string }`.
   * **No Unhandled States**: Every interactive form must handle pending states (`isPending`), every list must have an empty state with a CTA, and every fetch must have an error boundary with a retry button.
5. **Financial & Settlement Invariants**:
   * **Rule 2.1 — Never Pay Out Unsettled Funds**: Payouts are restricted to Razorpay T+2 settled funds (`wallet_available`).
   * **Rule 2.2 — Event-Completion Holdback (15%)**: Organizers can withdraw up to 85% before the event; 15% is locked until 8:00 AM morning post-event.
   * **Rule 2.3 — Mandatory Bank UTR Logging**: Verified 12-digit Indian Bank UTR logged before payout marks `COMPLETED`.
6. **Legal & Cloud Invariants**:
   * **Never Rotate Family PANs**: Avoid aggregator fraud freeze. Follow the 2-Stage legal roadmap (Udyam Sole Proprietorship → Automated Split GST).
   * **Render 10-Minute Keep-Alive**: Maintain 10-min health ping (`GET /api/health`) to prevent container sleep and lost Razorpay webhooks.
   * **Supabase Keep-Alive**: Ping every 72 hours to prevent free-tier 7-day inactivity pause.
   * **Cryptographic QR Security**: Tamper-proof HMAC-SHA256 signature generated with `QR_HMAC_SECRET`.

---

## 🎨 2. Frontend Design Standard: "Anti-Slop" Protocol

When designing or coding web interfaces, you are strictly prohibited from generating generic AI statistical defaults (interchangeable hero sections, random purple gradients, 3 identical cards, rounded-xl everywhere).

Before writing any UI code, enforce the **Five Mandatory Design Decisions**:
1. **Named Typography Pairing**:
   * Display & UI Body: **Plus Jakarta Sans** (Weights: 400, 500, 600, 700, 800).
   * Ticket Identifiers & Security PIN: **JetBrains Mono** (SemiBold 600 / Bold 700).
   * Never use unstyled browser fallback fonts.
2. **Tokenized Color System (No Hardcoded Hex / No Default Purple Gradients)**:
   * Electric Indigo: `var(--color-indigo)` (`#4F46E5`) — Primary CTA & Ticket Pass.
   * Midnight Charcoal: `var(--color-charcoal)` (`#0F172A`) — Dark card body & contrast elements.
   * Sunset Saffron: `var(--color-saffron)` (`#F97316`) — Live play symbol (`▶`), VIP badges, spotlight alerts.
   * Deep Cinema Background: `var(--bg-app)` (`#0A0D14`) & Surface Card: `var(--surface-card)` (`#111622`).
   * Semantic States: `var(--color-success)` (`#10B981`), `var(--color-warning)` (`#F59E0B`), `var(--color-danger)` (`#EF4444`).
3. **Authentic 35mm Scalloped Cinema Ticket Geometry (`get [my ▶] show`)**:
   * Circular sprocket scallops (`∩∩∩`) along top/bottom edges.
   * Symmetrical semicircular waist cutouts on side borders.
   * Vertical dashed perforation line (`border-dashed border-slate-700/60`).
   * QR Code Quiet Zone: High-contrast white square with $\ge 12\text{px}$ padding.
   * Local Sponsor Coupon Ad Banner directly beneath the QR code.
4. **Mobile-First Layout & Touch Rules**:
   * **360px Baseline**: Flawless display on budget Android smartphones common in Bihar.
   * Minimum touch target: **$44\text{px} \times 44\text{px}$** for buttons and inputs.
   * Sticky Mobile Checkout Bar on `/e/[slug]`.
   * Fast-action Gate Scanner Viewport with instant full-screen Green/Red flashes.
5. **Orchestrated Motion & Real Assets**:
   * Fluid spring transitions (`transitions-dev`), 80ms stagger fade-up entrances.
   * Hardware-accelerated CSS properties (`transform`, `opacity`); no layout jank (`fixing-motion-performance`).
   * Authentic WebP posters and real Bihar event assets; never blank gray boxes.

---

## 🔌 3. MCP (Model Context Protocol) Server Usage Protocols

Always prioritize specialized MCP tools over generic terminal improvisations:

| MCP Server | When to Call | What Tool to Use |
| :--- | :--- | :--- |
| **`github`** | Managing PRs, reviewing branches, opening issues, and committing files. | `mcp_github_*` (`create_or_update_file`, `create_pull_request`, `search_repositories`) |
| **`agentation`** | Visual feedback and on-page browser annotations left by the user. | `agentation_get_all_pending`, `agentation_resolve`, `agentation_reply` |
| **`21st`** | Searching production-ready UI components, templates, and color palettes. | `video_search_blocks`, `get_component`, `get_theme` |
| **`ui-skills`** | Fetching live design guidelines, accessibility checklists, and layout rules. | `get_skill`, `list_skills` |
| **`whatfontis`** | Reverse-engineering typography and fonts from images or screenshots. | `identify_font` |
| **`supabase`** | Managing databases, applying migrations, and querying tables. | `list_tables`, `execute_sql`, `apply_migration` |
| **`vercel`** | Checking deployments, project domains, and live server logs. | Remote deployment tools |
| **`posthog`** | Product analytics, event schemas, feature flags, and funnels. | Analytics query tools |
| **`rea`** | Reverse-engineering web bundles, reference apps, and dynamic runtimes. | REA suite tools (`batch_decompile`, `analyze_javascript_application`) |
| **`ghidra-mcp`** | Inspecting compiled binaries, disassembly, and native symbol analysis. | Ghidra tools |
| **`brainsync`** | Syncing persistent developer context and cross-agent memory. | Memory sync tools |

---

## 🧭 4. Complete Skill Orchestration Decision Matrix (169 Skills)

All 169 curated skills are located in `.agents/skills/`. The agent must consult and trigger the appropriate skill before executing tasks:

### Category A: UI/UX, Design Engineering & Motion
- **`anti-slop-web-design`**: Mandatory for building or redesigning pages/components. Enforces typography pairs, semantic tokens, asymmetric layouts, real assets.
- **`ui-ux-pro-max`**: End-to-end UX flow design, multi-step checkout modals, state transition diagrams.
- **`baseline-ui`**: Fast cleanup pass for spacing, padding, alignment, and visual hierarchy.
- **`create-design-md`**: Reconstructs and documents design tokens into persistent `DESIGN.md`.
- **`improve-ui`**: Audits existing UI against design tokens without breaking brand identity.
- **`transitions-dev`** / **`transitions-polish`**: Fluid page transitions, spring physics, hover micro-interactions.
- **`fixing-motion-performance`**: Replaces janky layout animations with hardware-accelerated transforms.
- **`design-system`**: Scalable 3-layer token architecture (primitive → semantic → component).
- **`banner-design`**: Responsive event banners and high-converting CTA headers.
- **`algorithmic-art`** / **`canvas-design`**: Generative coded visuals with p5.js and high-res canvas.

### Category B: SEO, Accessibility & Quality Assurance
- **`fixing-accessibility`**: Full WCAG 2.1 AA compliance (ARIA roles, focus rings, contrast ratios).
- **`fixing-metadata`**: WhatsApp OpenGraph rich cards, Twitter previews, JSON-LD event schemas.
- **`webapp-testing`**: Playwright browser automation, screenshots, and visual DOM proofs.
- **`qa-test-planner`**: Comprehensive QA test matrices, checkout edge cases, regression suites.

### Category C: System Design, Architecture & Distributed Systems
- **`system-design`**: Scalable architectures, trade-off matrices, capacity estimations.
- **`architecture-designer`**: Microservice and module ADRs (Architecture Decision Records).
- **`c4-architecture`**: C4 model architectural maps (Context, Container, Component, Code).
- **`api-design`**: RESTful/GraphQL schemas, versioning (`/api/v1/`), idempotency keys.
- **`backend-to-frontend-handoff-docs`**: Endpoint specs for frontend engineering handoffs.
- **`frontend-to-backend-requirements`**: Translates UI requirements into backend API payloads.
- **`database-schema-designer`**: PostgreSQL schema design, indexing, 3NF normalization.
- **`caching`**: Upstash Redis cache-aside, seat mutex locking, eviction policies.
- **`resilience-failure`**: Circuit breakers, exponential retries, graceful degradation.
- **`messaging-streaming`**: Decoupled message queues, webhook retries, dead-letter queues.
- **`consistency-coordination`**: Distributed locking, seat race-condition prevention.
- **`back-of-the-envelope`**: Rapid estimations for QPS, throughput, and storage capacity.
- **`graphify`**: AST knowledge graph of the codebase and module dependencies.

### Category D: Enterprise Security, Vulnerability Auditing & AI Safety
- **`secure-code-review`** / **`codeguard`**: Pre-merge security gates against OWASP ASVS and CWE Top 25.
- **`secrets-scan`**: Scans for leaked API keys, tokens, and unprotected files.
- **`owasp-top-10-web`**: Web vulnerability reviews (A01-A10, SQLi, XSS, CSRF).
- **`api-security`**: BOLA, IDOR, token validation, and rate limiting audits.
- **`agent-security-audit`** / **`mcp-server-review`**: Auditing MCP server privileges and tool permissions.
- **`agentic-ai-risk-assess`**: Multi-agent safety against OWASP Agentic Top 10.
- **`prompt-injection-test`**: System prompt stress-testing against evasion and jailbreaking.
- **`llm-risk-assess`**: RAG and autonomous workflow threat modeling.
- **`iac-security-review`**: Infrastructure-as-Code security audits.
- **`rbac-design`**: Role-based access control architecture for organizers and admins.
- **`soc2-gap`** / **`iso27001-gap`**: Compliance audits and remediation roadmaps.
- **`cve-triage`**: Vulnerability prioritization using CVSS and EPSS.

### Category E: Developer Productivity, Git Workflows & Maintenance
- **`commit-work`**: Staging clean logical git diffs with Conventional Commit messages.
- **`reducing-entropy`**: Dead-code elimination, zombie dependency removal, codebase minimalism.
- **`naming-analyzer`**: Context-aware identifier naming recommendations.
- **`session-handoff`**: Compiling session summaries for seamless multi-agent transitions.
- **`crafting-effective-readmes`**: Developer-friendly setup instructions and docs.
- **`dependency-updater`**: Safe package upgrades with breaking-change diagnosis.
- **`skill-creator`**: Creating and packaging new reusable skills.

---

## 🔄 5. Live Feedback Workflow (Agentation Integration)

1. **Development Embedding**:
   Ensure `<Agentation />` is mounted conditionally in development in `app/layout.tsx`:
   ```tsx
   import { Agentation } from "agentation";

   // Inside RootLayout:
   {process.env.NODE_ENV === "development" && (
     <Agentation endpoint="http://localhost:4747" />
   )}
   ```
2. **User Annotation**:
   The user navigates to the running dev app and clicks on any UI element to leave visual feedback or mark bugs.
3. **Agent Inspection**:
   The AI agent executes `agentation_get_all_pending()` to retrieve element selectors, screenshots, and comments.
4. **Autonomous Resolution**:
   The AI modifies the component code following design tokens, tests the fix, and marks the annotation resolved via `agentation_resolve({ "id": "<annotation_id>" })`.
