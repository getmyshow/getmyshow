import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";

export const viewport: Viewport = {
  themeColor: "#4F46E5",
};

export const metadata: Metadata = {
  title: "GetMyShow — Hyperlocal Event Passes & Box-Office",
  description: "Book passes for coaching seminars, college fests, cultural nights, and concerts in Sasaram, Dehri-on-Sone, and Bihar. 2-click instant UPI checkout.",
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen bg-surface-bg text-text-primary antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-surface-border bg-surface-card/60 py-8 text-center text-sm text-text-muted">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight">GetMyShow</span>
              <span className="text-xs bg-brand-indigo/20 text-brand-indigo px-2 py-0.5 rounded-full font-medium">
                Sasaram & Rohtas
              </span>
            </div>
            <p>© {new Date().getFullYear()} GetMyShow Platform. Fast, No-Login UPI Ticketing for Bihar.</p>
            <div className="flex items-center gap-4 text-xs">
              <a href="/organizer" className="hover:text-white transition">Organizer Portal</a>
              <a href="/privacy" className="hover:text-white transition">Privacy</a>
              <a href="/terms" className="hover:text-white transition">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

