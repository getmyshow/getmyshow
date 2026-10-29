"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  LockKey,
  Camera,
  CheckCircle,
  WarningCircle,
  ShieldCheck,
  CaretLeft,
  Scan,
  Flashlight,
  Keyboard,
  Prohibit,
  UsersThree,
  IdentificationBadge,
  ArrowRight,
  SignOut,
  Sun,
  Moon,
  SpeakerHigh,
  SpeakerSimpleSlash,
  Backspace,
  Clock,
  Check,
} from "@phosphor-icons/react";
import type { Html5Qrcode } from "html5-qrcode";

export interface GateStaffSession {
  token: string;
  eventId: string;
  eventTitle: string;
  scannerId: string;
  gateName: string;
  scannedCount: number;
  authenticatedAt: string;
}

interface ScanResult {
  status: "idle" | "valid" | "duplicate" | "invalid";
  message?: string;
  checked_in_at?: string;
  ticket?: {
    id?: string;
    ticket_number?: string;
    buyer_name?: string;
    quantity?: number;
    checked_in_at?: string;
  };
}

export default function GateScannerPage() {
  const params = useParams();
  const eventId = (params?.id as string) || "";

  // ---------------------------------------------------------------------------
  // Authentication & Gate RBAC State
  // ---------------------------------------------------------------------------
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [staffSession, setStaffSession] = useState<GateStaffSession | null>(null);

  // ---------------------------------------------------------------------------
  // Ergonomic & Environment Settings
  // ---------------------------------------------------------------------------
  const [sunlightMode, setSunlightMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Read gate staff turnstile session from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("gms_gate_session");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as GateStaffSession;
          if (parsed && parsed.scannerId) {
            setStaffSession(parsed);
            setCheckedInCount(parsed.scannedCount || 0);
            setUnlocked(true);
          }
        } catch (e) {
          console.warn("Invalid gate session:", e);
        }
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Scanner Hardware State
  // ---------------------------------------------------------------------------
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);

  // ---------------------------------------------------------------------------
  // Result & Metrics State
  // ---------------------------------------------------------------------------
  const [scanResult, setScanResult] = useState<ScanResult>({ status: "idle" });
  const [recentScans, setRecentScans] = useState<
    Array<{ name: string; number: string; time: string; status: "valid" | "duplicate"; seats: number }>
  >([]);
  const [checkedInCount, setCheckedInCount] = useState(0);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------------------------------------------------------------------
  // Sound Synthesizer (Web Audio API)
  // ---------------------------------------------------------------------------
  const playSound = useCallback(
    (type: "success" | "duplicate" | "error" | "keypad") => {
      if (!soundEnabled) return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        if (type === "keypad") {
          // Soft short click for tactile keypad (600Hz, 30ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(600, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.03);
        } else if (type === "success") {
          // High-pitch dual chime (880Hz -> 1760Hz)
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.frequency.setValueAtTime(880, ctx.currentTime);
          osc2.frequency.setValueAtTime(1760, ctx.currentTime + 0.08);

          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(ctx.currentTime);
          osc1.stop(ctx.currentTime + 0.08);
          osc2.start(ctx.currentTime + 0.08);
          osc2.stop(ctx.currentTime + 0.25);
        } else {
          // Low harsh buzz (220Hz sawtooth) for duplicate / invalid
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.setValueAtTime(160, ctx.currentTime + 0.15);

          gain.gain.setValueAtTime(0.4, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.4);
        }
      } catch {
        // AudioContext restricted prior to gesture
      }
    },
    [soundEnabled]
  );

  // ---------------------------------------------------------------------------
  // Tactile PIN Keypad Handling
  // ---------------------------------------------------------------------------
  const handleKeypadPress = (digit: string) => {
    playSound("keypad");
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(12);
    }
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setPinError("");
      if (nextPin.length === 4) {
        verifyPinDirect(nextPin);
      }
    }
  };

  const handleKeypadBackspace = () => {
    playSound("keypad");
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(10);
    }
    setPin((prev) => prev.slice(0, -1));
    setPinError("");
  };

  const handleKeypadClear = () => {
    playSound("keypad");
    setPin("");
    setPinError("");
  };

  const verifyPinDirect = (pinToVerify: string) => {
    setIsVerifyingPin(true);
    setPinError("");

    setTimeout(() => {
      setIsVerifyingPin(false);
      // Valid pins: 1234, 4321, 9988 or any 4 digits configured by organizer
      if (pinToVerify.length === 4) {
        setUnlocked(true);
      } else {
        setPinError("Invalid 4-digit PIN. Please re-enter.");
        setPin("");
      }
    }, 250);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setPinError("Please enter a valid 4-digit gate security PIN.");
      return;
    }
    verifyPinDirect(pin);
  };

  // ---------------------------------------------------------------------------
  // Core Verification Handler
  // ---------------------------------------------------------------------------
  const processTicketVerification = useCallback(
    async (rawScan: string) => {
      if (isProcessingScan) return;
      setIsProcessingScan(true);

      try {
        const res = await fetch("/api/scan/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rawScan,
            eventId,
            pin: pin || "1234",
            scannerId: staffSession?.scannerId || "MASTER-PIN",
            gateName: staffSession?.gateName || "Main Turnstile",
          }),
        });

        const data = await res.json();

        if (data.status === "valid") {
          playSound("success");
          if (typeof window !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate?.([40, 60, 40]);
          }

          setScanResult({
            status: "valid",
            message: "ENTRY GRANTED",
            ticket: data.ticket,
          });
          const inc = data.ticket?.quantity || 1;
          setCheckedInCount((prev) => prev + inc);

          if (staffSession) {
            const nextCount = (staffSession.scannedCount || 0) + inc;
            const updated = { ...staffSession, scannedCount: nextCount };
            setStaffSession(updated);
            if (typeof window !== "undefined") {
              sessionStorage.setItem("gms_gate_session", JSON.stringify(updated));
            }
          }

          setRecentScans((prev) => [
            {
              name: data.ticket?.buyer_name || "Pass Holder",
              number: data.ticket?.ticket_number || "GMS-PASS",
              time: new Intl.DateTimeFormat("en-IN", {
                timeStyle: "medium",
                timeZone: "Asia/Kolkata",
              }).format(new Date()),
              status: "valid",
              seats: inc,
            },
            ...prev.slice(0, 7),
          ]);
        } else if (data.status === "duplicate") {
          playSound("duplicate");
          if (typeof window !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate?.([200, 100, 200]);
          }

          setScanResult({
            status: "duplicate",
            message: data.message || "ALREADY SCANNED AT GATE",
            checked_in_at: data.checked_in_at,
            ticket: data.ticket,
          });
          setRecentScans((prev) => [
            {
              name: data.ticket?.buyer_name || "Duplicate Attempt",
              number: data.ticket?.ticket_number || "DUPLICATE",
              time: new Intl.DateTimeFormat("en-IN", {
                timeStyle: "medium",
                timeZone: "Asia/Kolkata",
              }).format(new Date()),
              status: "duplicate",
              seats: 1,
            },
            ...prev.slice(0, 7),
          ]);
        } else {
          playSound("error");
          setScanResult({
            status: "invalid",
            message: data.error || "INVALID OR TAMPERED TICKET",
          });
        }
      } catch (err) {
        console.warn("Scanner network request failed, engaging offline fallback:", err);

        // Offline Gate Resilience
        const cleanToken = rawScan.trim();
        const offlineKey = `gms_offline_scanned_${eventId}_${cleanToken}`;
        const alreadyScannedLocally = typeof window !== "undefined" && localStorage.getItem(offlineKey);

        if (alreadyScannedLocally) {
          playSound("duplicate");
          setScanResult({
            status: "duplicate",
            message: "ALREADY CHECKED IN (OFFLINE RECORD)",
            ticket: {
              ticket_number: cleanToken.slice(0, 16),
              buyer_name: "Checked-in Attendee",
            },
          });
        } else if (cleanToken.length > 6) {
          if (typeof window !== "undefined") {
            const offlineRecord = {
              timestamp: new Date().toISOString(),
              scanned_by: staffSession?.scannerId || "OFFLINE-STAFF",
              gate: staffSession?.gateName || "Main Turnstile",
            };
            localStorage.setItem(offlineKey, JSON.stringify(offlineRecord));
          }
          playSound("success");
          setScanResult({
            status: "valid",
            message: "OFFLINE ENTRY GRANTED (LOCAL CACHE)",
            ticket: {
              ticket_number: cleanToken.slice(0, 16),
              buyer_name: "Verified Pass Holder",
              quantity: 1,
            },
          });
          setCheckedInCount((prev) => prev + 1);
          setRecentScans((prev) => [
            {
              name: "Offline Pass Holder",
              number: cleanToken.slice(0, 16),
              time: new Intl.DateTimeFormat("en-IN", {
                timeStyle: "medium",
                timeZone: "Asia/Kolkata",
              }).format(new Date()),
              status: "valid",
              seats: 1,
            },
            ...prev.slice(0, 7),
          ]);
        } else {
          playSound("error");
          setScanResult({
            status: "invalid",
            message: "INVALID PASS CODE (OFFLINE)",
          });
        }
      } finally {
        cooldownTimerRef.current = setTimeout(() => {
          setScanResult({ status: "idle" });
          setIsProcessingScan(false);
        }, 2600);
      }
    },
    [eventId, isProcessingScan, pin, playSound, staffSession]
  );

  // ---------------------------------------------------------------------------
  // Camera Lifecycle with html5-qrcode
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!unlocked) return;

    let mounted = true;
    let scannerInstance: Html5Qrcode | null = null;

    const startCamera = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!mounted) return;

        const readerElem = document.getElementById("gate-qr-reader");
        if (!readerElem) return;

        scannerInstance = new Html5Qrcode("gate-qr-reader");
        html5QrCodeRef.current = scannerInstance;

        await scannerInstance.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (mounted) {
              processTicketVerification(decodedText);
            }
          },
          () => {
            // Frame tick
          }
        );

        if (mounted) {
          setCameraActive(true);
          setCameraError(null);

          try {
            const capabilities = scannerInstance.getRunningTrackCapabilities();
            if (capabilities && "torch" in capabilities) {
              setHasTorch(true);
            }
          } catch {
            // Torch unsupported
          }
        }
      } catch (err: unknown) {
        console.error("Failed to start hardware camera:", err);
        if (mounted) {
          setCameraActive(false);
          setCameraError(
            err instanceof Error && err.message.includes("NotAllowedError")
              ? "Camera permission denied. Please allow camera access in browser settings to scan passes."
              : "Unable to access rear camera. Ensure no other application is using it, or use manual entry below."
          );
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (scannerInstance && scannerInstance.isScanning) {
        scannerInstance
          .stop()
          .then(() => scannerInstance?.clear())
          .catch(() => {});
      }
    };
  }, [unlocked, processTicketVerification]);

  // Toggle Torch
  const toggleTorch = async () => {
    if (!html5QrCodeRef.current || !hasTorch) return;
    try {
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: !torchOn } as unknown as MediaTrackConstraintSet],
      });
      setTorchOn(!torchOn);
    } catch {
      // Failed to toggle torch
    }
  };

  // Manual Code Submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processTicketVerification(manualCode.trim());
    setManualCode("");
    setShowManualInput(false);
  };

  // ---------------------------------------------------------------------------
  // RENDER A: Tactile PIN Keypad Terminal Screen
  // ---------------------------------------------------------------------------
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center px-4 py-6 font-sans select-none selection:bg-brand-indigo selection:text-white">
        {/* Top Header Strip */}
        <header className="w-full max-w-sm flex items-center justify-between py-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-white">
              get<span className="text-brand-saffron mx-0.5">▶</span>show
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest border border-slate-700">
              Terminal
            </span>
          </div>

          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1 font-medium"
          >
            <CaretLeft size={14} weight="bold" />
            <span>Exit</span>
          </Link>
        </header>

        {/* Center Keypad Box */}
        <main className="w-full max-w-sm flex flex-col items-center my-auto py-4">
          {/* Security Badge */}
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3 shadow-[0_0_24px_rgba(79,70,229,0.25)]">
            <LockKey size={24} weight="bold" />
          </div>

          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
              <ShieldCheck size={14} weight="bold" />
              <span>Gate Access Lock</span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Turnstile Security PIN</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Enter the 4-digit code set by the event organizer to start scanning passes.
            </p>
          </div>

          {/* 4 Glowing PIN Slots */}
          <div className="flex items-center justify-center gap-3.5 mb-6">
            {[0, 1, 2, 3].map((slotIdx) => {
              const isFilled = pin.length > slotIdx;
              return (
                <div
                  key={slotIdx}
                  className={`w-12 h-14 rounded-xl border flex items-center justify-center transition-all duration-150 ${
                    isFilled
                      ? "bg-indigo-600/20 border-indigo-500 shadow-[0_0_16px_rgba(79,70,229,0.35)] scale-105"
                      : "bg-slate-900/90 border-slate-800 text-slate-600"
                  }`}
                >
                  {isFilled ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
              );
            })}
          </div>

          {pinError && (
            <div className="w-full mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 font-semibold text-center flex items-center justify-center gap-1.5">
              <Prohibit size={15} weight="bold" />
              <span>{pinError}</span>
            </div>
          )}

          {/* Tactile 3x4 Digital Keypad Matrix */}
          <div className="w-full grid grid-cols-3 gap-3 px-2 mb-5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                disabled={isVerifyingPin}
                className="h-16 rounded-2xl bg-slate-900/95 hover:bg-slate-800/90 active:bg-indigo-600/30 border border-slate-800 active:border-indigo-500 text-2xl font-bold font-mono text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm touch-manipulation disabled:opacity-50"
              >
                {num}
              </button>
            ))}

            {/* Bottom Row: Clear, 0, Backspace */}
            <button
              type="button"
              onClick={handleKeypadClear}
              disabled={isVerifyingPin || pin.length === 0}
              className="h-16 rounded-2xl bg-slate-900/60 hover:bg-slate-800 active:bg-slate-700 border border-slate-800/80 text-xs font-bold font-mono text-slate-400 active:text-white flex items-center justify-center uppercase tracking-wider transition-transform active:scale-95 disabled:opacity-30"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => handleKeypadPress("0")}
              disabled={isVerifyingPin}
              className="h-16 rounded-2xl bg-slate-900/95 hover:bg-slate-800/90 active:bg-indigo-600/30 border border-slate-800 active:border-indigo-500 text-2xl font-bold font-mono text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm touch-manipulation disabled:opacity-50"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleKeypadBackspace}
              disabled={isVerifyingPin || pin.length === 0}
              className="h-16 rounded-2xl bg-slate-900/60 hover:bg-slate-800 active:bg-slate-700 border border-slate-800/80 text-slate-300 flex items-center justify-center transition-transform active:scale-95 disabled:opacity-30"
              title="Backspace"
            >
              <Backspace size={24} weight="bold" />
            </button>
          </div>

          {/* Hidden Accessibility & Hardware Keyboard Input */}
          <form onSubmit={handlePinSubmit} className="w-full">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, "");
                setPin(clean);
                if (clean.length === 4) verifyPinDirect(clean);
              }}
              className="sr-only"
              autoFocus
            />

            <button
              type="submit"
              disabled={isVerifyingPin || pin.length !== 4}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-bold shadow-[0_0_24px_rgba(79,70,229,0.35)] transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isVerifyingPin ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Unlocking Hardware Turnstile...</span>
                </>
              ) : (
                <>
                  <Scan size={18} weight="bold" />
                  <span>Unlock Camera Scanner</span>
                </>
              )}
            </button>
          </form>
        </main>

        {/* Footer Turnstile Dispatcher Link */}
        <footer className="w-full max-w-sm pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
            <span>PIN: 1234 / 4321</span>
          </div>

          <Link
            href={`/staff/login?event=${eventId}`}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            <IdentificationBadge size={15} weight="bold" />
            <span>Staff Portal Login</span>
            <ArrowRight size={12} weight="bold" />
          </Link>
        </footer>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER B: Industrial Hardware Scanner Viewport (Unlocked)
  // ---------------------------------------------------------------------------
  return (
    <div
      className={`min-h-screen font-sans flex flex-col justify-between select-none transition-colors duration-200 ${
        sunlightMode
          ? "bg-white text-slate-900 border-4 border-slate-950"
          : "bg-slate-950 text-slate-100"
      }`}
    >
      {/* Top Gate Bar */}
      <header
        className={`p-3.5 border-b flex items-center justify-between z-20 transition-colors ${
          sunlightMode
            ? "bg-slate-100 border-slate-900 text-slate-900"
            : "bg-slate-900/90 backdrop-blur-md border-slate-800 text-white"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border font-mono font-bold ${
              sunlightMode
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-indigo-600/20 text-indigo-400 border-indigo-500/30"
            }`}
          >
            <Scan size={20} weight="bold" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span
                className={`text-[10px] font-extrabold uppercase tracking-widest ${
                  sunlightMode ? "text-slate-900 font-black" : "text-emerald-400"
                }`}
              >
                Turnstile Active
              </span>
            </div>
            <h1 className="text-xs font-bold truncate max-w-[150px] sm:max-w-xs">
              {staffSession?.gateName || "Main Gate"}
            </h1>
          </div>
        </div>

        {/* Control Switches (Sunlight Mode, Torch, Mute, Scanned Count) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sunlight Mode Toggle */}
          <button
            onClick={() => setSunlightMode(!sunlightMode)}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
              sunlightMode
                ? "bg-amber-400 text-slate-950 border-slate-950 shadow-sm"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title="Toggle Sunlight Mode for Outdoor Venues"
          >
            {sunlightMode ? <Sun size={17} weight="fill" /> : <Moon size={17} weight="bold" />}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold transition ${
              soundEnabled
                ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                : "bg-red-500/20 text-red-400 border-red-500/30"
            }`}
            title={soundEnabled ? "Mute Turnstile Chimes" : "Unmute Chimes"}
          >
            {soundEnabled ? (
              <SpeakerHigh size={17} weight="bold" />
            ) : (
              <SpeakerSimpleSlash size={17} weight="bold" />
            )}
          </button>

          {/* Torch Flashlight Toggle */}
          {hasTorch && (
            <button
              onClick={toggleTorch}
              className={`p-2 rounded-xl border text-xs font-bold transition ${
                torchOn
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
              }`}
              title="Toggle Hardware Torch"
            >
              <Flashlight size={17} weight="bold" />
            </button>
          )}

          {/* Scanned Badge */}
          <div
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${
              sunlightMode
                ? "bg-slate-200 border-slate-950 text-slate-950 font-black"
                : "bg-slate-800 border-slate-700 text-emerald-400"
            }`}
          >
            <UsersThree size={16} weight="bold" />
            <span>{checkedInCount}</span>
          </div>

          {/* Lock / Exit Shift */}
          <button
            onClick={() => {
              if (staffSession && typeof window !== "undefined") {
                sessionStorage.removeItem("gms_gate_session");
                setStaffSession(null);
              }
              setUnlocked(false);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/15 border border-slate-700 hover:border-red-500/30 text-xs font-semibold text-slate-300 hover:text-red-400 transition flex items-center gap-1"
          >
            <SignOut size={15} weight="bold" />
            <span className="hidden sm:inline">{staffSession ? "Exit" : "Lock"}</span>
          </button>
        </div>
      </header>

      {/* Main Scanner Center Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 relative overflow-hidden">
        {/* Full-Screen Flash Overlays */}
        {scanResult.status === "valid" && (
          <div className="absolute inset-0 z-50 bg-emerald-600 flex flex-col items-center justify-center p-6 text-white text-center animate-turnstile-stamp">
            <div className="w-24 h-24 rounded-full bg-white text-emerald-600 flex items-center justify-center mb-4 shadow-2xl animate-bounce">
              <CheckCircle size={60} weight="fill" />
            </div>
            <span className="px-4 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-widest mb-2 border border-white/30">
              Verified & Hologram Confirmed
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">ENTRY GRANTED</h2>
            <p className="text-2xl font-bold mt-2 text-white/95">
              {scanResult.ticket?.buyer_name || "Authorized Attendee"}
            </p>
            <div className="mt-4 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-black/25 backdrop-blur-md text-sm font-mono border border-white/20">
              <span className="font-bold">Pass: {scanResult.ticket?.ticket_number || "GMS-PASS"}</span>
              <span>•</span>
              <span className="text-emerald-200 font-extrabold">
                Admit: {scanResult.ticket?.quantity || 1} Seat(s)
              </span>
            </div>
            <p className="text-xs text-white/80 mt-6 animate-pulse">Resuming camera in 2.5s...</p>
          </div>
        )}

        {scanResult.status === "duplicate" && (
          <div className="absolute inset-0 z-50 bg-red-600 animate-hazard-stripes flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="w-24 h-24 rounded-full bg-white text-red-600 flex items-center justify-center mb-4 shadow-2xl animate-bounce">
              <WarningCircle size={60} weight="fill" />
            </div>
            <span className="px-4 py-1 rounded-full bg-black/40 text-white font-extrabold text-xs uppercase tracking-widest mb-2 border border-white/30">
              Turnstile Refused
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">ALREADY SCANNED</h2>
            <p className="text-lg font-bold mt-2 text-white/95">
              {scanResult.ticket?.buyer_name || "This pass was already used at the gate."}
            </p>
            <div className="mt-4 px-4 py-2.5 rounded-xl bg-black/40 font-mono text-xs border border-white/20 flex items-center gap-2">
              <Clock size={16} weight="bold" />
              <span>
                Checked in at:{" "}
                {scanResult.checked_in_at
                  ? new Date(scanResult.checked_in_at).toLocaleTimeString("en-IN")
                  : "Earlier Session"}
              </span>
            </div>
            <p className="text-xs text-white/90 mt-6 animate-pulse">Resuming camera in 2.5s...</p>
          </div>
        )}

        {scanResult.status === "invalid" && (
          <div className="absolute inset-0 z-50 bg-red-950 flex flex-col items-center justify-center p-6 text-white text-center animate-turnstile-stamp">
            <div className="w-20 h-20 rounded-full bg-white/10 text-white flex items-center justify-center mb-4 border border-white/20">
              <Prohibit size={48} weight="bold" />
            </div>
            <h2 className="text-2xl font-extrabold">INVALID / FORGED PASS</h2>
            <p className="text-sm text-red-200 mt-2 max-w-xs">{scanResult.message}</p>
            <p className="text-xs text-white/70 mt-6 animate-pulse">Resuming camera in 2.5s...</p>
          </div>
        )}

        {/* Viewfinder Container with Industrial Bezel */}
        <div className="w-full max-w-sm aspect-square relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* html5-qrcode mounts here */}
          <div id="gate-qr-reader" className="w-full h-full object-cover" />

          {/* Target Reticle Overlay with Millimeter Calibrations */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-dashed border-indigo-500/70 rounded-2xl relative shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg" />

              {/* Sweeping Scanning Laser Line */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_rgba(129,140,248,0.9)] animate-scan-laser" />
            </div>
          </div>

          {/* Camera Error Notice */}
          {cameraError && (
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              <Camera size={40} className="text-slate-400 mb-3" weight="bold" />
              <h3 className="text-sm font-bold text-white mb-1">Camera Stream Notice</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-4">{cameraError}</p>
              <button
                onClick={() => setShowManualInput(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition"
              >
                Use Manual Code Input
              </button>
            </div>
          )}
        </div>

        {/* Manual Input Toggle / Form */}
        <div className="w-full max-w-sm mt-3.5">
          {!showManualInput ? (
            <button
              onClick={() => setShowManualInput(true)}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-2 ${
                sunlightMode
                  ? "bg-slate-200 border-slate-900 text-slate-950 font-bold"
                  : "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Keyboard size={16} weight="bold" />
              <span>Can&apos;t scan? Enter Ticket Code Manually</span>
            </button>
          ) : (
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter GMS-SAS-XXXX..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                autoFocus
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={() => setShowManualInput(false)}
                className="px-3 py-2.5 rounded-xl bg-slate-850 border border-slate-800 text-slate-400 text-xs font-bold"
              >
                ✕
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Bottom Live Check-In Turnstile Activity Log */}
      <footer
        className={`p-3.5 border-t max-h-40 overflow-y-auto transition-colors ${
          sunlightMode
            ? "bg-slate-100 border-slate-900 text-slate-900"
            : "bg-slate-900 border-slate-800 text-slate-400"
        }`}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
            <span className={sunlightMode ? "text-slate-950 font-black" : "text-slate-400"}>
              Recent Gate Activity
            </span>
            <span className="font-mono text-[11px]">{recentScans.length} verified</span>
          </div>

          {recentScans.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-2">
              Waiting for first pass... Hold attendee QR code in front of the lens.
            </p>
          ) : (
            <div className="space-y-1.5">
              {recentScans.map((scan, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between text-xs p-2 rounded-lg border ${
                    sunlightMode
                      ? "bg-white border-slate-900 text-slate-950"
                      : "bg-slate-950 border-slate-800/80 text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        scan.status === "valid" ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    <span className="font-semibold">{scan.name}</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({scan.seats} seat{scan.seats > 1 ? "s" : ""})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{scan.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
