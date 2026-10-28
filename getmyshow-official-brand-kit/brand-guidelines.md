# GetMyShow — Official Brand Identity Guidelines (Edition 5.0 Final)
## The Cinema Sprocket Scalloped Ticket (`get [ my ] show`)

> **Official Brand System & Identity Assets** for GetMyShow — Hyperlocal Mobile-First Ticketing & Box-Office Platform.

---

## 1. Executive Summary & Design Rationale

### Moving Beyond Generic Capsules & Copycat Marks
In the entertainment ticketing sector, competitors established the formula of enclosing the word `"my"` inside a ticket shape. However, earlier identities relied on sharp, jagged 1990s paper-tear triangles (`▲▲▲`) representing ripped receipt paper.

**GetMyShow Edition 5.0** creates a distinctive, modern, and authentic cinema heritage identity:
- **`get`**: Rendered in solid Midnight Charcoal (`#0F172A`) for light backgrounds or Pure White (`#FFFFFF`) on dark cinema viewports.
- **`[ my ]` Scalloped Cinema Ticket Pass**:
  - Features **3 smooth circular sprocket scallops (`∩∩∩`)** along the top and bottom edges, directly inspired by authentic **35mm cinema roll ticket pin-feed holes**.
  - **Symmetrical circular waist cutouts** on both sides for authentic ticket bite silhouette.
  - **Vertical dashed perforation cut line** representing the tear-off stub.
  - **Zero accidental particles / dots**: Completely eliminated extraneous dots, ensuring maximum clean breathing space and zero visual collisions.
  - **Sunset Saffron Live Stage Triangle (`▶`)**: Organically integrated after `my`, serving as an energetic live performance and movie play symbol.
- **`show`**: Rendered in matching Electric Indigo (`#4F46E5`), creating an unbroken visual flow from the ticket pass into the wordmark.
- **100% Vector Geometry**: Zero live fonts required. Scales from a 16px browser favicon to an 8K stadium billboard with zero distortion.

---

## 2. Core Color Palette

| Color Name | Hex Code | RGB | HSL | Primary Use Case |
|---|---|---|---|---|
| **Electric Indigo** | `#4F46E5` | `rgb(79, 70, 229)` | `hsl(243, 75%, 59%)` | Ticket pass body, 'show' typography, primary CTAs, app icon background |
| **Midnight Charcoal** | `#0F172A` | `rgb(15, 23, 42)` | `hsl(222, 47%, 11%)` | 'get' wordmark typography (light mode), primary body text, dark backgrounds |
| **Sunset Saffron** | `#F97316` | `rgb(249, 115, 22)` | `hsl(25, 95%, 53%)` | Live stage play triangle (`▶`), VIP badges, live status indicators |
| **Indigo Dark Surface** | `#6366F1` | `rgb(99, 102, 241)` | `hsl(239, 84%, 67%)` | Ticket pass & 'show' on dark mode backgrounds |
| **Pure White** | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | 'my' lettering, dark mode typography, ticket body on app icon |

---

## 3. Asset Directory Structure

```
getmyshow-official-brand-kit/
├── index.html                      <- Interactive Master Brand Portal & Asset Showcase
├── presentation.html               <- 5-Slide Client Presentation Deck with Keyboard Navigation
├── brand-guidelines.md             <- This Document
├── favicon.ico                     <- Multi-resolution Windows & Web Favicon (16, 32, 48px)
├── site.webmanifest                <- PWA Web App Manifest
├── head-snippet.html               <- HTML code to copy-paste into <head>
├── logos/
│   ├── wordmark-primary.svg        <- Master Light Mode Wordmark (Electric Indigo Ticket)
│   ├── wordmark-primary.png        <- 1200px & 600px High-Res PNGs
│   ├── wordmark-dark.svg           <- Master Dark Mode Wordmark
│   ├── wordmark-dark.png           <- 1200px Dark PNG
│   ├── wordmark-white-badge.svg    <- 1:1 White Ticket Badge Wordmark
│   ├── wordmark-white-badge.png    <- 1200px White Badge PNG
│   ├── wordmark-tilted-black-text.svg   <- Black Text Bookends ('get' & 'show' black, ticket indigo)
│   ├── wordmark-straight-black-text.svg <- Straight Black Text Bookends
│   ├── wordmark-mono.svg           <- Single-Color Indigo Wordmark
│   ├── wordmark-black.svg          <- Single-Ink Print Black Wordmark
│   └── wordmark-white.svg          <- Single-Ink Print White Wordmark
├── app-icons/
│   ├── app-icon-tilted.svg         <- Hero App Icon Vector (Dynamic 9° Tilt)
│   ├── app-icon-tilted-1024.png    <- App Store / Google Play 1024px Master Icon
│   ├── app-icon-tilted-512.png     <- Android Home Screen 512px
│   ├── app-icon-tilted-256.png     <- 256px Retina Icon
│   ├── app-icon-tilted-128.png     <- 128px Desktop Icon
│   ├── app-icon-tilted-64.png      <- 64px Icon
│   ├── app-icon-tilted-32.png      <- 32px Icon
│   ├── app-icon-straight.svg       <- Architectural Straight App Icon Vector
│   ├── app-icon-straight-*.png     <- Straight App Icon PNGs (128-1024px)
│   ├── symbol-ticket-transparent.svg <- Standalone Ticket Pass (Transparent SVG)
│   └── symbol-ticket-transparent.png <- Standalone Ticket Pass (Transparent PNG)
├── favicons/
│   ├── favicon.ico                 <- Multi-resolution ICO (16, 32, 48px)
│   ├── favicon.svg                 <- Scalable Vector Favicon
│   ├── favicon-16.png              <- 16x16 Browser Tab Favicon
│   ├── favicon-32.png              <- 32x32 Retina Tab Favicon
│   ├── favicon-48.png              <- 48x48 Desktop Taskbar Favicon
│   ├── apple-touch-icon.png        <- 180x180 iOS Home Screen Icon
│   ├── icon-192.png                <- 192x192 Android PWA Icon
│   ├── icon-512.png                <- 512x512 Android PWA Splash Icon
│   └── maskable-512.png            <- 512x512 Adaptive Maskable Icon
└── slides/
    ├── slide-01.png                <- Presentation Cover Slide
    ├── slide-02.png                <- Category Brief & Rationale Slide
    ├── slide-03.png                <- Scalloped Geometry & Sizing Slide
    ├── slide-04.png                <- Real-World Mockups Slide
    └── slide-05.png                <- Brand System Summary Slide
```

---

## 4. Exclusion Zone & Minimum Sizing

- **Exclusion Margin ($X$)**: The minimum clear space surrounding the wordmark is equal to the height of the circular waist bite notch ($18\text{px}$ on the standard $820 \times 240$ canvas).
- **Minimum Digital Sizes**:
  - Full Wordmark: Minimum $130\text{px}$ width.
  - App Icon / Hero Ticket: Minimum $32\text{px} \times 32\text{px}$.
  - Favicon: Crisp and recognizable down to $16\text{px} \times 16\text{px}$.
