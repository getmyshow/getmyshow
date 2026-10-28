import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import AgentationProvider from "@/components/dev/AgentationProvider";

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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen bg-[#F8F7FA] text-[#39364F] antialiased selection:bg-[#3659E3]/20 selection:text-[#3659E3]">
        <AgentationProvider />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
