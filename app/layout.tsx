import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import AgentationProvider from "@/components/dev/AgentationProvider";
import ClerkAuthProvider from "@/components/auth/ClerkAuthProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "GetMyShow — Hyperlocal Event Passes & Box-Office for Sasaram & Bihar",
  description: "Book passes for coaching seminars, college fests, cultural nights, and concerts in Sasaram, Dehri-on-Sone, and Bihar. 2-click instant UPI checkout, zero app download.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} overflow-x-hidden`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen bg-[#F8F7FA] text-[#0F172A] font-sans antialiased selection:bg-[#4F46E5]/20 selection:text-[#4F46E5] overflow-x-hidden pb-16 md:pb-0">
        <ClerkAuthProvider>
          <AgentationProvider />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClerkAuthProvider>
      </body>
    </html>
  );
}
