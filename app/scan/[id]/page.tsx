"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Camera, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

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
      setPinError("Please enter a 4-digit PIN");
    }
  };

  // Simulated scan triggers for demonstration
  const simulateScan = (type: "valid" | "duplicate") => {
    if (type === "valid") {
      setScanStatus("valid");
      setScannedTicket({
        name: "Rahul Kumar",
        ticketNumber: "GMS-SAS-8421",
        quantity: 1,
      });
      // Web Audio API Success Chime
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch {}
    } else {
      setScanStatus("duplicate");
      setScannedTicket({
        name: "Duplicate Pass",
        ticketNumber: "GMS-SAS-8421",
        quantity: 1,
      });
      // Web Audio API Alert Buzz
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch {}
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-8">
      {!unlocked ? (
        /* PIN Lock Screen */
        <div className="w-full max-w-sm p-6 rounded-card bg-surface-card border border-surface-border text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-brand-indigo/20 text-brand-indigo flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-white">Gate Security Scanner</h1>
            <p className="text-xs text-text-muted mt-1">Enter your 4-digit PIN to activate camera</p>
          </div>

          {pinError && (
            <p className="text-xs text-status-danger font-semibold">{pinError}</p>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full py-3 text-center text-3xl font-mono tracking-[0.5em] rounded-button bg-surface-elevated border border-surface-border text-white focus:outline-none focus:border-brand-indigo"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-button font-bold text-sm bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-glow transition active:scale-95"
            >
              Unlock Scanner
            </button>
          </form>
        </div>
      ) : (
        /* Unlocked Camera Viewport */
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              Scanner Online
            </span>
            <button
              onClick={() => setUnlocked(false)}
              className="hover:text-white transition"
            >
              Lock
            </button>
          </div>

          {/* Camera Viewport Simulation */}
          <div
            className={`relative aspect-[3/4] w-full rounded-ticket overflow-hidden border-2 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300 ${
              scanStatus === "valid"
                ? "bg-emerald-950/80 border-emerald-500 shadow-glow-emerald"
                : scanStatus === "duplicate"
                ? "bg-red-950/80 border-red-500 shadow-lg"
                : "bg-surface-card border-surface-border"
            }`}
          >
            {scanStatus === "idle" && (
              <div className="space-y-4">
                <div className="w-48 h-48 border-2 border-dashed border-brand-indigo/60 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                  <Camera className="w-12 h-12 text-brand-indigo/70" />
                </div>
                <p className="text-xs text-text-dim">Align attendee QR pass within target</p>
              </div>
            )}

            {scanStatus === "valid" && scannedTicket && (
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                    VALID PASS
                  </h2>
                  <p className="text-lg font-bold text-emerald-300 mt-1">{scannedTicket.name}</p>
                  <p className="font-mono text-xs text-text-dim mt-0.5">
                    {scannedTicket.ticketNumber} • {scannedTicket.quantity} Attendee
                  </p>
                </div>
              </div>
            )}

            {scanStatus === "duplicate" && (
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
                <div>
                  <h2 className="text-2xl font-black text-red-400 uppercase tracking-wider">
                    ALREADY USED
                  </h2>
                  <p className="text-xs text-red-200 mt-1 font-semibold">
                    Scanned 4 mins ago at Gate 1
                  </p>
                  <p className="text-[11px] text-text-dim mt-2">Do not admit this pass.</p>
                </div>
              </div>
            )}
          </div>

          {/* Manual Simulation Controls for Developer Testing */}
          <div className="p-4 rounded-card bg-surface-card border border-surface-border space-y-2">
            <span className="text-[10px] uppercase font-bold text-text-dim tracking-wider block text-center">
              Gate Simulation Trigger
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => simulateScan("valid")}
                className="flex-1 py-2 rounded-button text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition"
              >
                Simulate Valid Pass
              </button>
              <button
                onClick={() => simulateScan("duplicate")}
                className="flex-1 py-2 rounded-button text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition"
              >
                Simulate Duplicate
              </button>
              <button
                onClick={() => setScanStatus("idle")}
                className="px-3 py-2 rounded-button text-xs font-semibold bg-surface-elevated text-text-muted hover:text-white transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

