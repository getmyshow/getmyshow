"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSubdomainUrl } from "@/lib/domains";
import {
  Plus,
  Minus,
  Sparkle,
  Ticket,
  Headset,
  EnvelopeSimple,
  ArrowRight,
  MapPin,
  Heart,
  CheckCircle,
} from "@phosphor-icons/react";

// Real Official Brand Social Media SVG Icons
function OfficialWhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#25D366">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.053-1.042-.047-.358-.088-.868-.282-1.579-.588-1.421-.611-2.338-2.05-2.408-2.146-.07-.095-.589-.785-.589-1.498 0-.713.375-1.064.509-1.209.133-.145.29-.181.388-.181.097 0 .194.002.277.006.089.005.207-.034.323.246.121.291.413 1.012.449 1.085.036.073.06.158.012.254-.048.096-.073.157-.145.242-.073.085-.153.19-.219.255-.073.072-.149.151-.064.296.085.145.378.622.81 1.008.558.497 1.028.651 1.173.723.145.073.23.061.316-.037.085-.097.363-.424.46-.569.097-.145.194-.121.327-.073.133.048.847.4 1 .472.152.073.254.109.29.17.037.06.037.351-.107.756zM12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.66 1.447 5.174L2 22l4.981-1.306A9.94 9.94 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
}

function OfficialInstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function OfficialFacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function OfficialXIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function OfficialYouTubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FF0000">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function OfficialLinkedInIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function Footer() {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  return (
    <footer className="bg-[#0F172A] text-slate-400 text-sm print:hidden border-t border-slate-800">
      {/* 1. Interactive Collapsible Bar ("Know more about GetMyShow") */}
      <div className="bg-[#182235] border-b border-slate-800/80">
        <button
          type="button"
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
          aria-expanded={isAccordionOpen}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-wide text-slate-200 group-hover:text-white">
              Know more about GetMyShow
            </span>
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 font-medium">
              Bihar Box-Office Engine
            </span>
          </div>

          <div className="w-7 h-7 rounded-full bg-slate-700/60 group-hover:bg-[#4F46E5] text-slate-300 group-hover:text-white flex items-center justify-center transition-all">
            {isAccordionOpen ? (
              <Minus size={15} weight="bold" />
            ) : (
              <Plus size={15} weight="bold" />
            )}
          </div>
        </button>

        {/* Expandable Content Drawer */}
        {isAccordionOpen && (
          <div className="border-t border-slate-800 bg-[#0F172A] animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8">
              {/* List Your Show Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/20 p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/15 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <Ticket size={28} weight="duotone" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight">
                      List Your Show on GetMyShow
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
                      Got an educational seminar, college fest, Dandiya night, cultural concert or sports tournament? Partner with Bihar&apos;s homegrown platform with 0% platform fee for organizers.
                    </p>
                  </div>
                </div>

                <Link
                  href={getSubdomainUrl("org", "/create")}
                  className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap self-stretch md:self-auto text-center"
                >
                  Partner Today →
                </Link>
              </div>

              {/* 3 Pillar Support Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* 1. 24/7 WhatsApp Support */}
                <a
                  href="https://wa.me/919876543210?text=Hi%20GetMyShow%2C%20I%20need%20assistance%20with%20my%20event%20ticket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <OfficialWhatsAppIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    24/7 Customer Care
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Instant 1-tap support on WhatsApp
                  </span>
                </a>

                {/* 2. Resend Booking Confirmation */}
                <Link
                  href="/my-tickets"
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <Ticket size={22} weight="duotone" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Resend Booking Pass
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Lookup your HMAC QR ticket by phone
                  </span>
                </Link>

                {/* 3. Local Show Alerts */}
                <Link
                  href="/#events"
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 text-[#F97316] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <EnvelopeSimple size={22} weight="duotone" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Local Show Alerts
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Never miss seminars & fests in Bihar
                  </span>
                </Link>
              </div>

              {/* SEO Regional Bihar Directory */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80 text-xs">
                <div>
                  <h5 className="font-bold text-slate-300 uppercase tracking-wider mb-2 text-[11px]">
                    Events in Top Bihar Hubs
                  </h5>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-400">
                    <Link href="/?city=Sasaram#events" className="hover:text-indigo-400 transition">Sasaram</Link>
                    <span>•</span>
                    <Link href="/?city=Dehri-on-Sone#events" className="hover:text-indigo-400 transition">Dehri-on-Sone</Link>
                    <span>•</span>
                    <Link href="/?city=Patna#events" className="hover:text-indigo-400 transition">Patna</Link>
                    <span>•</span>
                    <Link href="/?city=Gaya#events" className="hover:text-indigo-400 transition">Gaya</Link>
                    <span>•</span>
                    <Link href="/?city=Ara#events" className="hover:text-indigo-400 transition">Ara</Link>
                    <span>•</span>
                    <Link href="/?city=Bhabua#events" className="hover:text-indigo-400 transition">Bhabua</Link>
                    <span>•</span>
                    <Link href="/?city=Aurangabad#events" className="hover:text-indigo-400 transition">Aurangabad</Link>
                    <span>•</span>
                    <Link href="/?city=Buxar#events" className="hover:text-indigo-400 transition">Buxar</Link>
                    <span>•</span>
                    <Link href="/?city=Muzaffarpur#events" className="hover:text-indigo-400 transition">Muzaffarpur</Link>
                    <span>•</span>
                    <Link href="/?city=Bhagalpur#events" className="hover:text-indigo-400 transition">Bhagalpur</Link>
                    <span>•</span>
                    <Link href="/?city=Darbhanga#events" className="hover:text-indigo-400 transition">Darbhanga</Link>
                    <span>•</span>
                    <Link href="/?city=Begusarai#events" className="hover:text-indigo-400 transition">Begusarai</Link>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-slate-300 uppercase tracking-wider mb-2 text-[11px]">
                    Popular Categories
                  </h5>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-400">
                    <Link href="/#events" className="hover:text-indigo-400 transition">Coaching Seminars</Link>
                    <span>•</span>
                    <Link href="/#events" className="hover:text-indigo-400 transition">College Fests</Link>
                    <span>•</span>
                    <Link href="/#events" className="hover:text-indigo-400 transition">Dandiya & Garba Nights</Link>
                    <span>•</span>
                    <Link href="/#events" className="hover:text-indigo-400 transition">Kavi Sammelan</Link>
                    <span>•</span>
                    <Link href="/#events" className="hover:text-indigo-400 transition">Stand-up Comedy</Link>
                    <span>•</span>
                    <Link href="/#events" className="hover:text-indigo-400 transition">Marathons & Sports</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Footer Body: Centered Brand Emblem Flanked by Horizontal Lines */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-12">
        {/* Centered Logo with Left & Right Horizontal Divider Lines */}
        <div className="flex items-center justify-center gap-4 my-4">
          <div className="flex-1 h-px bg-slate-800" />
          <Link href="/" className="inline-flex items-center gap-2 group px-2">
            <Image
              src="/brand/logos/wordmark-tilted-white.svg"
              alt="GetMyShow"
              width={160}
              height={42}
              className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Real Official Social Media Icons Row */}
        <div className="flex items-center justify-center gap-4 py-6">
          {/* WhatsApp */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
          >
            <OfficialWhatsAppIcon className="w-5 h-5" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-pink-500 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
          >
            <OfficialInstagramIcon className="w-5 h-5 text-pink-500" />
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
          >
            <OfficialFacebookIcon className="w-5 h-5" />
          </a>

          {/* X (formerly Twitter) */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
          >
            <OfficialXIcon className="w-4 h-4 text-white" />
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
          >
            <OfficialYouTubeIcon className="w-5 h-5" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
          >
            <OfficialLinkedInIcon className="w-5 h-5" />
          </a>
        </div>

        {/* Legal & Copyright Notice */}
        <div className="text-center space-y-2 pt-2 max-w-2xl mx-auto text-xs text-slate-500 leading-relaxed">
          <p>
            Copyright © {new Date().getFullYear()} GetMyShow Platform. MSME Registered in Sasaram, Rohtas, Bihar 821115. All Rights Reserved.
          </p>
          <p className="text-[11px] text-slate-600">
            The content, images, and logos featured on this platform are copyright protected by their respective organizers and institutes. Digital passes issued with cryptographic HMAC-SHA256 signatures for tamper-proof gate verification.
          </p>
        </div>

        {/* Bottom Legal Navigation Links */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
          <Link href="/terms" className="hover:text-indigo-400 transition">Terms & Conditions</Link>
          <Link href="/privacy" className="hover:text-indigo-400 transition">Privacy Policy (DPDP)</Link>
          <Link href="/refund-policy" className="hover:text-indigo-400 transition">Cancellation & Refunds</Link>
          <Link href="/shipping-policy" className="hover:text-indigo-400 transition">Digital Delivery Policy</Link>
          <Link href="/contact" className="hover:text-indigo-400 transition">Grievance Desk</Link>
          <span className="flex items-center gap-1 text-slate-500">
            <span>Made with</span>
            <Heart size={13} weight="fill" className="text-[#F97316]" />
            <span>in Sasaram, Bihar</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
