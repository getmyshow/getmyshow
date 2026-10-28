# 06. UI Design Tokens — GetMyShow System

> **Official Design Source:** `getmyshow-official-brand-kit/brand-guidelines.md`  
> **Mandatory Rule:** Always use CSS variables and Tailwind design tokens. **NEVER hardcode arbitrary hex color values** inside component files.

---

## 1. Color Palette Tokens (CSS Variables)

```css
:root {
  /* Brand Core */
  --color-indigo: #4F46E5;            /* Electric Indigo — Primary brand CTA & ticket pass */
  --color-indigo-dark: #6366F1;       /* Indigo Dark Surface */
  --color-charcoal: #0F172A;          /* Midnight Charcoal — Primary text (light) & dark card body */
  --color-saffron: #F97316;           /* Sunset Saffron — Live stage play symbol (▶), VIP badges */
  --color-white: #FFFFFF;             /* Pure White */

  /* Surface & Canvas Hierarchy */
  --bg-app: #0A0D14;                  /* Deep Cinema Black Viewport */
  --surface-card: #111622;            /* Primary Elevated Card Container */
  --surface-elevated: #182030;        /* Secondary Hover / Active Surface */
  --surface-border: #1E293B;          /* Subtle Slate Borders */

  /* Typography Colors */
  --text-primary: #F8FAFC;            /* High Contrast Body Text (Dark Mode) */
  --text-muted: #94A3B8;              /* Secondary Descriptive Text */
  --text-dim: #64748B;                /* Metadata & Inactive Labels */

  /* Semantic State Colors */
  --color-success: #10B981;           /* Emerald 500 — Gate Valid Check-In, Settled Wallet */
  --color-warning: #F59E0B;           /* Amber 500 — Pending T+2 Settlement, Waitlist */
  --color-danger: #EF4444;            /* Crimson 500 — Already Scanned / Invalid Pass, Rejection */
  --color-info: #0284C7;              /* Sky 600 — Informational Notices */

  /* Visual Accents & Glows */
  --glow-indigo: rgba(79, 70, 229, 0.25);
  --glow-saffron: rgba(249, 115, 22, 0.20);
  --glow-success: rgba(16, 185, 129, 0.25);
}
```

---

## 2. Tailwind Configuration Mapping

In `tailwind.config.ts`, these tokens map directly to standard classes:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: "var(--color-indigo)",
          charcoal: "var(--color-charcoal)",
          saffron: "var(--color-saffron)",
          "indigo-dark": "var(--color-indigo-dark)",
        },
        surface: {
          bg: "var(--bg-app)",
          card: "var(--surface-card)",
          elevated: "var(--surface-elevated)",
          border: "var(--surface-border)",
        },
        status: {
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          danger: "var(--color-danger)",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card: "18px",
        button: "12px",
        badge: "9999px",
        ticket: "20px",
      },
    },
  },
};
```

---

## 3. Typography Scale & Hierarchy

| Token | Font Family | Size / Line-Height | Weight | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `text-display` | Plus Jakarta Sans | 36px / 44px | ExtraBold (800) | Homepage hero title, event headline |
| `text-title` | Plus Jakarta Sans | 24px / 32px | Bold (700) | Card title, checkout modal heading |
| `text-headline`| Plus Jakarta Sans | 18px / 26px | SemiBold (600) | Section titles, organizer stats |
| `text-body` | Plus Jakarta Sans | 15px / 24px | Regular (400) / Medium (500) | Descriptions, venue details |
| `text-caption` | Plus Jakarta Sans | 13px / 18px | Medium (500) | Form helper labels, timestamps |
| `text-ticket-id`| JetBrains Mono | 16px / 20px | SemiBold (600) | Ticket pass numbers (`GMS-SAS-1001`), UTRs |
| `text-scanner` | JetBrains Mono | 32px / 40px | Bold (700) | 4-Digit gate PIN input |

---

## 4. Spacing, Elevation & Layout Grid

* **Base Unit ($4\text{px}$ Grid)**:
  * Micro padding: `p-1` (4px), `p-2` (8px), `p-3` (12px)
  * Standard element padding: `p-4` (16px), `p-6` (24px)
  * Card & modal container padding: `p-6` (24px) to `p-8` (32px)
  * Section vertical spacing: `py-12` (48px) to `py-16` (64px)
* **Shadows & Glows**:
  * Default Card Shadow: `0 4px 20px -2px rgba(0, 0, 0, 0.4)`
  * Electric Indigo Glow CTA: `0 0 24px var(--glow-indigo)`
  * Ticket Scallop Notch Border: Crisp 1px solid `var(--surface-border)`

