"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LockKey,
  Camera,
  CheckCircle,
  WarningCircle,
  ShieldCheck,
  Sparkle,
  CaretLeft,
  Scan,
} from "@phosphor-icons/react";

export default function GateScannerPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [scanStatus, setScanStatus] = useState<"idle" | "valid" | "duplicate">("idle");
  const [scannedTicket, setScannedTicket] = useState<{
    name: string;
    ticketNumber: string;
    quantity: number;
  } | null>(null);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      setUnlocked(true);
      setPinError("");
    } else {
      setPinError("Please enter a 4-digit PIN (default: 1234 or 4321)");
    }
  };

  const simulateScan = (type: "valid" | "duplicate") => {
    if (type === "valid") {
      setScanStatus("valid");
      setScannedTicket({
        name: "Rahul Kumar Verma",
        ticketNumber: "GMS-SAS-8421",
        quantity: 1,
      });
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        }
      } catch {}
    } else {
      setScanStatus("duplicate");
      setScannedTicket({
        name: "ALREADY SCANNED PASS",
        ticketNumber: "GMS-SAS-8421",
        quantity: 1,
      });
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch {}
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-8 bg-[#F8F7FA]">
      {!unlocked ? (
        /* PIN Lock Screen */
        <div className="w-full max-w-sm p-6 sm:p-8 rounded-[40px] bg-white border border-[#DBDAE3] text-center space-y-6 shadow-card">
          <div className="w-14 h-14 rounded-full bg-[#3659E3]/10 text-[#3659E3] flex items-center justify-center mx-auto shadow-xs">
            <LockKey size={28} weight="bold" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-[#1E0A3C]">Gate Scanner Access</h2>
            <p className="text-xs text-[#6F7287] mt-1">
              Enter the 4-digit security PIN set by the event organizer
            </p>
          </div>

          {pinError && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
              {pinError}
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center text-3xl font-mono tracking-widest py-3 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-[#1E0A3C] outline-none focus:border-[#3659E3] focus:ring-2 focus:ring-[#3659E3]/20 transition-all font-bold"
            />

            <button
              type="submit"
              className="w-full py-3.5 rounded-[360px] bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-sm font-bold shadow-md transition-all active:scale-95"
            >
              Unlock Scanner
            </button>
          </form>

          <div className="pt-2">
            <Link
              href="/"
              className="text-xs text-[#6F7287] hover:text-[#1E0A3C] transition flex items-center justify-center gap-1"
            >
              <CaretLeft size={14} weight="bold" />
              <span>Back to Public Site</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Camera Scanner Viewport */
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider block">
                Active Gate Session
              </span>
              <h2 className="text-lg font-bold text-[#1E0A3C]">Continuous QR Scanner</h2>
            </div>
            <button
              onClick={() => setUnlocked(false)}
              className="px-3.5 py-1.5 rounded-full border border-[#DBDAE3] bg-white text-xs font-semibold text-[#39364F] hover:bg-[#F8F7FA]"
            >
              Lock Gate
            </button>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="relative aspect-square w-full rounded-[40px] overflow-hidden bg-[#1E0A3C] border-2 border-[#DBDAE3] shadow-2xl flex flex-col items-center justify-center p-6 text-white text-center">
            {/* Visual Flash Overlays */}
            {scanStatus === "valid" && (
              <div className="absolute inset-0 bg-emerald-600/90 z-20 flex flex-col items-center justify-center p-6 text-white animate-in zoom-in-95 duration-150">
                <CheckCircle size={64} weight="fill" className="text-white drop-shadow-md" />
                <h3 className="text-2xl font-black mt-2">VALID ADMIT PASS!</h3>
                <p className="text-base font-bold mt-1 text-emerald-100">{scannedTicket?.name}</p>
                <span className="mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-mono font-bold">
                  {scannedTicket?.ticketNumber} • {scannedTicket?.quantity} Pass
                </span>
                <button
                  onClick={() => setScanStatus("idle")}
                  className="mt-6 px-6 py-2 bg-white text-emerald-900 rounded-full font-bold text-xs shadow-lg active:scale-95"
                >
                  Scan Next Ticket
                </button>
              </div>
            )}

            {scanStatus === "duplicate" && (
              <div className="absolute inset-0 bg-red-600/90 z-20 flex flex-col items-center justify-center p-6 text-white animate-in zoom-in-95 duration-150">
                <WarningCircle size={64} weight="fill" className="text-white drop-shadow-md animate-bounce" />
                <h3 className="text-2xl font-black mt-2">ALREADY SCANNED!</h3>
                <p className="text-sm font-semibold mt-1 text-red-100">
                  Duplicate admission attempt. Entry denied.
                </p>
                <button
                  onClick={() => setScanStatus("idle")}
                  className="mt-6 px-6 py-2 bg-white text-red-900 rounded-full font-bold text-xs shadow-lg active:scale-95"
                >
                  Dismiss Alert
                </button>
              </div>
            )}

            {/* Target Reticle */}
            <div className="w-56 h-56 border-2 border-dashed border-[#F97316] rounded-3xl flex items-center justify-center relative shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              <Scan size={44} weight="bold" className="text-white/60 animate-pulse" />
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white" />
            </div>

            <p className="mt-6 text-xs text-[#DBDAE3] max-w-xs font-medium">
              Point camera at attendee&apos;s phone screen to verify cryptographic HMAC QR pass
            </p>
          </div>

          {/* Gate Simulation Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => simulateScan("valid")}
              className="py-3 px-4 rounded-[360px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
            >
              <CheckCircle size={16} weight="fill" />
              <span>Simulate Valid Scan</span>
            </button>

            <button
              onClick={() => simulateScan("duplicate")}
              className="py-3 px-4 rounded-[360px] bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
            >
              <WarningCircle size={16} weight="fill" />
              <span>Simulate Duplicate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
