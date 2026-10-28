"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lightning,
  Heart,
  MapPin,
  EnvelopeSimple,
  WhatsappLogo,
  Ticket,
} from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#DBDAE3] text-[#39364F] text-sm">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-[#EEEDF2] bg-[#F8F7FA]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#3659E3]/10 text-[#3659E3] flex items-center justify-center shrink-0">
                <Lightning size={24} weight="duotone" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E0A3C] uppercase tracking-wide">
                  2-Click Instant UPI Passes
                </h4>
                <p className="text-xs text-[#6F7287] mt-0.5 leading-relaxed">
                  No app download required. Digital pass with HMAC QR token issued on-screen and WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#F05537]/10 text-[#F05537] flex items-center justify-center shrink-0">
                <ShieldCheck size={24} weight="duotone" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E0A3C] uppercase tracking-wide">
                  HMAC Cryptographic Pass
                </h4>
                <p className="text-xs text-[#6F7287] mt-0.5 leading-relaxed">
                  Mathematically tamper-proof QR tickets. Zero Photoshop forgery or screenshot duplication.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin size={24} weight="duotone" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E0A3C] uppercase tracking-wide">
                  Hyperlocal to Sasaram & Bihar
                </h4>
                <p className="text-xs text-[#6F7287] mt-0.5 leading-relaxed">
                  Dedicated local team supporting coaching institutes, college fests, and cultural organizers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/brand/logos/wordmark-tilted-black-text-transparent.svg"
                alt="GetMyShow Logo"
                width={140}
                height={38}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#6F7287] leading-relaxed max-w-sm">
              GetMyShow (<code className="text-xs bg-[#F8F7FA] px-1.5 py-0.5 rounded text-[#1E0A3C] font-mono">get [my ▶] show</code>) is Bihar&apos;s homegrown event ticketing and box-office platform. Empowering local fests, coaching seminars, and cultural nights.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#6F7287]">
              <MapPin size={16} className="text-[#3659E3] shrink-0" />
              <span>Headquartered in Sasaram, Rohtas, Bihar 821115</span>
            </div>
          </div>

          {/* Quick Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1E0A3C] uppercase tracking-wider">
              Popular Cities
            </h4>
            <ul className="space-y-2 text-xs text-[#6F7287]">
              <li><Link href="/?city=Sasaram#events" className="hover:text-[#3659E3] transition">Sasaram (Rohtas)</Link></li>
              <li><Link href="/?city=Dehri-on-Sone#events" className="hover:text-[#3659E3] transition">Dehri-on-Sone</Link></li>
              <li><Link href="/?city=Patna#events" className="hover:text-[#3659E3] transition">Patna</Link></li>
              <li><Link href="/?city=Gaya#events" className="hover:text-[#3659E3] transition">Gaya</Link></li>
              <li><Link href="/?city=Ara#events" className="hover:text-[#3659E3] transition">Ara (Bhojpur)</Link></li>
            </ul>
          </div>

          {/* Event Verticals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1E0A3C] uppercase tracking-wider">
              Event Types
            </h4>
            <ul className="space-y-2 text-xs text-[#6F7287]">
              <li><Link href="/#events" className="hover:text-[#3659E3] transition">Coaching Seminars</Link></li>
              <li><Link href="/#events" className="hover:text-[#3659E3] transition">College Fests</Link></li>
              <li><Link href="/#events" className="hover:text-[#3659E3] transition">Dandiya & Garba Nights</Link></li>
              <li><Link href="/#events" className="hover:text-[#3659E3] transition">Bhojpuri Kavi Sammelan</Link></li>
              <li><Link href="/#events" className="hover:text-[#3659E3] transition">Marathons & Sports</Link></li>
            </ul>
          </div>

          {/* Organizer Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1E0A3C] uppercase tracking-wider">
              Organizer Tools
            </h4>
            <ul className="space-y-2 text-xs text-[#6F7287]">
              <li><Link href="/organizer/create" className="hover:text-[#3659E3] transition font-semibold text-[#1E0A3C]">List Your Event (0% Fee)</Link></li>
              <li><Link href="/organizer" className="hover:text-[#3659E3] transition">Organizer Studio</Link></li>
              <li><Link href="/scan/1" className="hover:text-[#3659E3] transition">Mobile Gate Scanner</Link></li>
              <li><span className="text-[#6F7287]">T+2 Bank Settlement</span></li>
              <li><span className="text-[#6F7287]">Cash Counter Desk</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#EEEDF2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6F7287]">
          <p>© {new Date().getFullYear()} GetMyShow Platform. Built with pride in Sasaram, Bihar.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span>Made with</span>
              <Heart size={14} weight="fill" className="text-[#F05537]" />
              <span>for Bihar</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
