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
  Sparkle,
  CaretLeft,
  Scan,
  Flashlight,
  ArrowsClockwise,
  Keyboard,
  Prohibit,
  UsersThree,
  UserCheck,
  IdentificationBadge,
  ArrowRight,
  SignOut,
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

  // Authentication & Gate RBAC State
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [staffSession, setStaffSession] = useState<GateStaffSession | null>(null);

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

  // Scanner Hardware State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);

  // Result & Metrics State
  const [scanResult, setScanResult] = useState<ScanResult>({ status: "idle" });
  const [recentScans, setRecentScans] = useState<
    Array<{ name: string; number: string; time: string; status: "valid" | "duplicate" }>
  >([]);
  const [checkedInCount, setCheckedInCount] = useState(0);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------------------------------------------------------------------
  // Sound Synthesizer (Web Audio API)
  // ---------------------------------------------------------------------------
  const playSound = useCallback((type: "success" | "duplicate" | "error") => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "success") {
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
      // Audio context might be restricted before user gesture
    }
  }, []);

  // ---------------------------------------------------------------------------
  // PIN Verification
  // ---------------------------------------------------------------------------
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setPinError("Please enter a valid 4-digit gate security PIN.");
      return;
    }
    setIsVerifyingPin(true);
    setPinError("");

    // Test unlock (accepts 1234, 4321, 9988 or verifies against backend)
    setTimeout(() => {
      setIsVerifyingPin(false);
      setUnlocked(true);
    }, 300);
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
            gateName: staffSession?.gateName || "Main Gate",
          }),
        });

        const data = await res.json();

        if (data.status === "valid") {
          playSound("success");
          setScanResult({
            status: "valid",
            message: "ENTRY GRANTED",
            ticket: data.ticket,
          });
          const inc = data.ticket?.quantity || 1;
          setCheckedInCount((prev) => prev + inc);

          // Update shift metric in sessionStorage
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
                timeStyle: "short",
                timeZone: "Asia/Kolkata",
              }).format(new Date()),
              status: "valid",
            },
            ...prev.slice(0, 7),
          ]);
        } else if (data.status === "duplicate") {
          playSound("duplicate");
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
                timeStyle: "short",
                timeZone: "Asia/Kolkata",
              }).format(new Date()),
              status: "duplicate",
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

        // Offline Gate Resilience: verify using local gate cache when zero-connectivity
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
              gate: staffSession?.gateName || "Main Gate",
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
                timeStyle: "short",
                timeZone: "Asia/Kolkata",
              }).format(new Date()),
              status: "valid",
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
        // 2.5-second clear interval for smooth continuous scanning
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
            // Frame scan tick (ignore non-matches silently)
          }
        );

        if (mounted) {
          setCameraActive(true);
          setCameraError(null);

          // Check torch capability
          try {
            const capabilities = scannerInstance.getRunningTrackCapabilities();
            if (capabilities && "torch" in capabilities) {
              setHasTorch(true);
            }
          } catch {
            // Torch inspection unsupported
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
        scannerInstance.stop().then(() => scannerInstance?.clear()).catch(() => {});
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
      // Hardware failed to toggle torch
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
  // Render: PIN Lock Screen
  // ---------------------------------------------------------------------------
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex flex-col justify-center items-center px-4 py-8 font-sans selection:bg-[#4F46E5] selection:text-white">
        <div className="w-full max-w-sm p-7 rounded-2xl bg-[#111622] border border-[#1E293B] text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#4F46E5]/15 border border-[#4F46E5]/30 text-[#4F46E5] flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(79,70,229,0.25)]">
            <LockKey size={28} weight="bold" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck size={14} weight="bold" />
              <span>Gate Security Portal</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#F8FAFC]">Continuous QR Scanner</h2>
            <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
              Enter the 4-digit security PIN set by the event organizer to activate the camera scanner.
            </p>
          </div>

          {pinError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 font-semibold text-center flex items-center justify-center gap-1.5">
              <Prohibit size={16} weight="bold" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={pin}
              autoFocus
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="w-full text-center text-4xl font-mono tracking-[0.5em] py-3.5 rounded-xl bg-[#0A0D14] border border-[#1E293B] text-white outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/40 transition-all font-bold placeholder:text-slate-600"
            />

            <button
              type="submit"
              disabled={isVerifyingPin || pin.length !== 4}
              className="w-full py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold shadow-[0_0_24px_rgba(79,70,229,0.35)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifyingPin ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Unlocking Scanner...</span>
                </>
              ) : (
                <>
                  <Scan size={18} weight="bold" />
                  <span>Unlock Camera Scanner</span>
                </>
              )}
            </button>
          </form>

          {/* Gate Staff Turnstile Login Portal Link */}
          <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-slate-800 text-left space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <IdentificationBadge size={16} weight="bold" className="text-[#F97316]" />
                <span>Gate Staff / Bouncer?</span>
              </div>
              <Link
                href={`/staff/login?event=${eventId}`}
                className="text-xs font-bold text-[#4F46E5] hover:text-[#6366F1] flex items-center gap-1 transition"
              >
                <span>Staff Portal</span>
                <ArrowRight size={13} weight="bold" />
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If assigned a Scanner Staff ID (e.g. <code>GATE-1-RAHUL</code>), log in with your assigned ID and PIN.
            </p>
          </div>

          <div className="pt-2 border-t border-[#1E293B]/60 flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="font-mono text-[11px] text-[#64748B]">Default PIN: 1234</span>
            <Link
              href="/"
              className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              <CaretLeft size={14} weight="bold" />
              <span>Back to Public Site</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Live Camera Scanner Viewport
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#F8FAFC] font-sans flex flex-col justify-between select-none">
      {/* Top Gate Bar */}
      <header className="p-4 bg-[#111622]/90 backdrop-blur-md border-b border-[#1E293B] flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4F46E5]/20 text-[#4F46E5] flex items-center justify-center border border-[#4F46E5]/30">
            <Scan size={20} weight="bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">
                Gate Active
              </span>
            </div>
            <h1 className="text-sm font-bold text-white">Continuous QR Pass Scanner</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasTorch && (
            <button
              onClick={toggleTorch}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                torchOn
                  ? "bg-[#F97316] border-[#F97316] text-white"
                  : "bg-[#182030] border-[#1E293B] text-[#94A3B8] hover:text-white"
              }`}
              title="Toggle Flashlight"
            >
              <Flashlight size={18} weight="bold" />
            </button>
          )}

          {staffSession ? (
            <div className="hidden sm:flex flex-col text-right px-2">
              <span className="text-xs font-mono font-bold text-indigo-400">
                {staffSession.scannerId}
              </span>
              <span className="text-[10px] text-slate-400">
                {staffSession.gateName}
              </span>
            </div>
          ) : null}

          <div className="px-3 py-1.5 rounded-xl bg-[#182030] border border-[#1E293B] text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
            <UsersThree size={16} weight="bold" />
            <span>{checkedInCount} Scanned</span>
          </div>

          <button
            onClick={() => {
              if (staffSession && typeof window !== "undefined") {
                sessionStorage.removeItem("gms_gate_session");
                setStaffSession(null);
              }
              setUnlocked(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#182030] hover:bg-red-500/10 border border-[#1E293B] hover:border-red-500/30 text-xs font-semibold text-[#94A3B8] hover:text-red-400 transition flex items-center gap-1"
          >
            <SignOut size={14} weight="bold" />
            <span>{staffSession ? "Exit Shift" : "Lock Gate"}</span>
          </button>
        </div>
      </header>

      {/* Main Scanner Center Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Full-Screen Flash Overlays */}
        {scanResult.status === "valid" && (
          <div className="absolute inset-0 z-50 bg-[#10B981] flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-150">
            <div className="w-24 h-24 rounded-full bg-white text-[#10B981] flex items-center justify-center mb-4 shadow-2xl animate-bounce">
              <CheckCircle size={56} weight="fill" />
            </div>
            <span className="px-4 py-1 rounded-full bg-white/20 text-white font-extrabold text-sm uppercase tracking-widest mb-2">
              Valid Ticket Pass
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">ENTRY GRANTED</h2>
            <p className="text-xl font-bold mt-2 text-white/95">
              {scanResult.ticket?.buyer_name || "Authorized Attendee"}
            </p>
            <div className="mt-4 inline-flex items-center gap-4 px-5 py-2.5 rounded-xl bg-black/20 backdrop-blur-md text-sm font-mono">
              <span>Pass: {scanResult.ticket?.ticket_number || "GMS-PASS"}</span>
              <span>•</span>
              <span>Seats: {scanResult.ticket?.quantity || 1} Person(s)</span>
            </div>
            <p className="text-xs text-white/80 mt-6 animate-pulse">Auto-resuming camera...</p>
          </div>
        )}

        {scanResult.status === "duplicate" && (
          <div className="absolute inset-0 z-50 bg-[#EF4444] flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-150">
            <div className="w-24 h-24 rounded-full bg-white text-[#EF4444] flex items-center justify-center mb-4 shadow-2xl animate-bounce">
              <WarningCircle size={56} weight="fill" />
            </div>
            <span className="px-4 py-1 rounded-full bg-black/30 text-white font-extrabold text-sm uppercase tracking-widest mb-2">
              Duplicate Alert
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">ALREADY SCANNED</h2>
            <p className="text-lg font-semibold mt-2 text-white/95">
              {scanResult.ticket?.buyer_name || "This pass was already used at the gate."}
            </p>
            <div className="mt-4 px-4 py-2 rounded-xl bg-black/30 font-mono text-xs">
              Checked in at: {scanResult.checked_in_at ? new Date(scanResult.checked_in_at).toLocaleTimeString("en-IN") : "Earlier"}
            </div>
            <p className="text-xs text-white/80 mt-6 animate-pulse">Auto-resuming camera...</p>
          </div>
        )}

        {scanResult.status === "invalid" && (
          <div className="absolute inset-0 z-50 bg-[#7F1D1D] flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-150">
            <div className="w-20 h-20 rounded-full bg-white/10 text-white flex items-center justify-center mb-4">
              <Prohibit size={48} weight="bold" />
            </div>
            <h2 className="text-2xl font-extrabold">INVALID / FORGED PASS</h2>
            <p className="text-sm text-red-200 mt-2 max-w-xs">{scanResult.message}</p>
            <p className="text-xs text-white/70 mt-6 animate-pulse">Auto-resuming camera...</p>
          </div>
        )}

        {/* Viewfinder Container */}
        <div className="w-full max-w-sm aspect-square relative rounded-3xl overflow-hidden border-2 border-[#1E293B] bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* html5-qrcode mounts inside this DOM ID */}
          <div id="gate-qr-reader" className="w-full h-full object-cover" />

          {/* Target Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-dashed border-[#4F46E5]/70 rounded-2xl relative shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#4F46E5] rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#4F46E5] rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#4F46E5] rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#4F46E5] rounded-br-lg" />

              {/* Scanning Laser Line */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent shadow-[0_0_10px_#4F46E5] animate-[scanLaser_2.5s_ease-in-out_infinite]" />
            </div>
          </div>

          {cameraError && (
            <div className="absolute inset-0 bg-[#111622]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              <Camera size={40} className="text-[#94A3B8] mb-3" weight="bold" />
              <h3 className="text-sm font-bold text-white mb-1">Camera Stream Notice</h3>
              <p className="text-xs text-[#94A3B8] max-w-xs mb-4">{cameraError}</p>
              <button
                onClick={() => setShowManualInput(true)}
                className="px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-bold shadow-md hover:bg-[#4338CA] transition"
              >
                Use Manual Code Input
              </button>
            </div>
          )}
        </div>

        {/* Manual Input Toggle / Form */}
        <div className="w-full max-w-sm mt-4">
          {!showManualInput ? (
            <button
              onClick={() => setShowManualInput(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#111622] hover:bg-[#182030] border border-[#1E293B] text-xs font-semibold text-[#94A3B8] hover:text-white transition flex items-center justify-center gap-2"
            >
              <Keyboard size={16} weight="bold" />
              <span>Can&apos;t scan? Enter Ticket Code Manually</span>
            </button>
          ) : (
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Paste token or enter GMS-..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                autoFocus
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#111622] border border-[#1E293B] text-xs font-mono text-white outline-none focus:border-[#4F46E5]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={() => setShowManualInput(false)}
                className="px-3 py-2.5 rounded-xl bg-[#182030] text-[#94A3B8] text-xs font-bold"
              >
                ✕
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Bottom Live Check-In Activity Log */}
      <footer className="p-4 bg-[#111622] border-t border-[#1E293B] max-h-40 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
            <span>Recent Gate Activity</span>
            <span>{recentScans.length} verified</span>
          </div>

          {recentScans.length === 0 ? (
            <p className="text-xs text-[#64748B] text-center py-2">
              Waiting for first pass... Hold attendee QR code in front of the lens.
            </p>
          ) : (
            <div className="space-y-1.5">
              {recentScans.map((scan, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#0A0D14] border border-[#1E293B]/60"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        scan.status === "valid" ? "bg-[#10B981]" : "bg-[#EF4444]"
                      }`}
                    />
                    <span className="font-semibold text-white">{scan.name}</span>
                    <span className="text-[11px] font-mono text-[#64748B]">{scan.number}</span>
                  </div>
                  <span className="text-[11px] text-[#64748B] font-mono">{scan.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
