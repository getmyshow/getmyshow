"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  QrCode,
  ShieldCheck,
  LockKey,
  IdentificationBadge,
  Eye,
  EyeSlash,
  CircleNotch,
  WarningCircle,
  Buildings,
  ArrowRight,
  Key,
} from "@phosphor-icons/react";
import { authenticateScannerStaff } from "@/actions/scanner-staff";

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL query parameters shared via WhatsApp
  const initialEvent = searchParams.get("event") || "SAS-01";
  const initialStaffId = searchParams.get("staff") || searchParams.get("scanner") || "";

  const [eventId, setEventId] = useState(initialEvent);
  const [staffId, setStaffId] = useState(initialStaffId);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEvent = eventId.trim();
    const cleanStaffId = staffId.trim().toUpperCase();
    const cleanPass = password.trim();

    if (!cleanEvent || !cleanStaffId || !cleanPass) {
      setError("All 3 credentials are mandatory: (1) Event ID, (2) Official Staff ID, and (3) PIN/Password.");
      return;
    }

    startTransition(async () => {
      const res = await authenticateScannerStaff({
        eventId: cleanEvent,
        scannerId: cleanStaffId,
        password: cleanPass,
      });

      if (res.success) {
        // Store staff gate session in sessionStorage (isolated per device/tab)
        const sessionData = {
          token: res.data.token,
          eventId: res.data.event_id,
          eventTitle: res.data.event_title,
          scannerId: res.data.scanner_id,
          gateName: res.data.gate_name,
          scannedCount: res.data.scanned_count,
          authenticatedAt: new Date().toISOString(),
        };

        if (typeof window !== "undefined") {
          sessionStorage.setItem("gms_gate_session", JSON.stringify(sessionData));
        }

        router.push(`/scan/${res.data.event_id}`);
      } else {
        setError(res.error || "Authentication failed. Check your Event ID, Staff ID, or PIN.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-[family-name:var(--font-sans)]">
      {/* Top Bar */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-black text-sm shadow-md">
            ▶
          </div>
          <span className="font-bold text-white tracking-tight text-lg">
            get<span className="text-[#F97316]">[my ▶]</span>show
          </span>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#111622] text-[#F97316] border border-[#F97316]/30">
          <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
          Staff Gate Portal
        </span>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-[#111622] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/30 text-[#4F46E5] mx-auto flex items-center justify-center">
              <QrCode size={26} weight="bold" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Scanning Staff Login Portal
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Official turnstile pass check-in. Enter the 3 access credentials issued by the Event Organizer.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
              <WarningCircle size={18} weight="fill" className="shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* 1. Event ID / Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Event ID / Code</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Issued by Organizer</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value.toUpperCase())}
                  placeholder="e.g. SAS-01 or 1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D14] border border-slate-700/80 focus:border-[#4F46E5] text-white font-mono text-xs font-bold uppercase tracking-wider outline-none transition placeholder:text-slate-600 pl-10"
                />
                <Buildings size={16} className="absolute left-3.5 top-3 text-slate-500" />
              </div>
            </div>

            {/* 2. Official Staff ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Official Staff ID</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Issued by Organizer</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value.toUpperCase())}
                  placeholder="e.g. GATE-1-RAHUL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D14] border border-slate-700/80 focus:border-[#4F46E5] text-white font-mono text-xs font-bold uppercase tracking-wider outline-none transition placeholder:text-slate-600 pl-10"
                />
                <IdentificationBadge size={16} className="absolute left-3.5 top-3 text-slate-500" />
              </div>
            </div>

            {/* 3. PIN Code / Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>PIN Code / Password</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Issued by Organizer</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. 9842"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D14] border border-slate-700/80 focus:border-[#4F46E5] text-white font-mono text-xs font-bold outline-none transition placeholder:text-slate-600 pl-10 pr-10"
                />
                <LockKey size={16} className="absolute left-3.5 top-3 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Security Assurance Notice */}
            <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <ShieldCheck size={15} weight="fill" className="text-emerald-400" />
                <span>Zero Financial Access (Turnstile Sandbox)</span>
              </div>
              <p className="text-[10.5px] leading-relaxed">
                This portal grants camera ticket verification only. Event revenue, bank withdrawal balances, and ticket holder private phone numbers cannot be accessed from this account.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#4F46E5]/20 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
            >
              {isPending ? (
                <>
                  <CircleNotch size={16} weight="bold" className="animate-spin" />
                  <span>Verifying 3 Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Camera Scanner</span>
                  <ArrowRight size={15} weight="bold" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 block mb-2">Need a test login?</span>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  setEventId("SAS-01");
                  setStaffId("GATE-1-RAHUL");
                  setPassword("9842");
                }}
                className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700 transition"
              >
                GATE-1-RAHUL (PIN: 9842)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEventId("SAS-01");
                  setStaffId("GATE-2-BOUNCER");
                  setPassword("9842");
                }}
                className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700 transition"
              >
                GATE-2-BOUNCER (PIN: 9842)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Switcher */}
      <footer className="max-w-md w-full mx-auto text-center py-4 text-xs text-slate-500">
        <span>Are you an Event Organizer? </span>
        <Link href="/organizer" className="text-[#4F46E5] font-semibold hover:underline">
          Go to Host Dashboard
        </Link>
      </footer>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center text-slate-400 font-mono text-xs">
          Loading Scanning Staff Portal...
        </div>
      }
    >
      <StaffLoginForm />
    </Suspense>
  );
}

