"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  CaretLeft,
  Sparkle,
  QrCode,
  UsersThree,
  ArrowClockwise,
  DeviceMobile,
  ProjectorScreen,
  CheckCircle,
} from "@phosphor-icons/react";
import AttendeeVoteWidget from "@/components/poll/AttendeeVoteWidget";

interface PollOption {
  id: string;
  label: string;
  subtitle?: string;
  votes: number;
  color: string;
}

export default function LivePollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [viewMode, setViewMode] = useState<"projector" | "mobile">("projector");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const [pollData, setPollData] = useState({
    title: "Super 50 Talent Scholarship & Career Blueprint",
    question: "Which competitive exam is your primary target for 2026–2027?",
    venue: "Sardar Patel Hall, Gaurakshani, Sasaram",
    options: [
      {
        id: "opt-jee",
        label: "JEE Main & Advanced",
        subtitle: "IIT / NIT Engineering Aspirant",
        votes: 412,
        color: "bg-[#4F46E5]",
      },
      {
        id: "opt-neet",
        label: "NEET UG",
        subtitle: "AIIMS / Govt Medical College Aspirant",
        votes: 388,
        color: "bg-[#F97316]",
      },
      {
        id: "opt-nda",
        label: "NDA & Defence Academy",
        subtitle: "Officer Commission in Armed Forces",
        votes: 194,
        color: "bg-emerald-600",
      },
      {
        id: "opt-civil",
        label: "UPSC & BPSC Civil Services",
        subtitle: "Administrative Foundation",
        votes: 146,
        color: "bg-purple-600",
      },
    ],
  });

  const totalVotes = pollData.options.reduce((acc, opt) => acc + opt.votes, 0);

  // Generate QR code for mobile audience scanning
  useEffect(() => {
    const currentOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const audienceVoteUrl = `${currentOrigin}/poll/${id}?mode=mobile`;

    QRCode.toDataURL(audienceVoteUrl, {
      margin: 1,
      width: 320,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("Error generating poll QR:", err));
  }, [id]);

  const handleVoteCast = (optionId: string) => {
    setPollData((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ),
    }));
  };

  const handleResetPoll = () => {
    if (confirm("Reset stage poll metrics to baseline?")) {
      setPollData((prev) => ({
        ...prev,
        options: prev.options.map((opt) => ({
          ...opt,
          votes: Math.floor(opt.votes * 0.7),
        })),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white">
      {/* Top Stage Control Bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/organizer/dashboard/${id}`}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition"
          >
            <CaretLeft size={16} weight="bold" />
            <span>Exit to Console</span>
          </Link>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-black tracking-wider uppercase text-red-400">
              Live Stage Poll
            </span>
          </div>
        </div>

        {/* View Switcher & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("projector")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                viewMode === "projector"
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <ProjectorScreen size={15} weight="bold" />
              <span>Projector Screen</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                viewMode === "mobile"
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <DeviceMobile size={15} weight="bold" />
              <span>Mobile Voter View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetPoll}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition"
            title="Reset Counter"
          >
            <ArrowClockwise size={16} weight="bold" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        {viewMode === "mobile" ? (
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <AttendeeVoteWidget
              pollId={id}
              title={pollData.title}
              question={pollData.question}
              options={pollData.options}
              onVoteSubmit={handleVoteCast}
            />
          </div>
        ) : (
          /* PROJECTOR SCREEN AUDITORIUM VIEW */
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            {/* Left 2 Columns: Large Display & Live Percentage Bars */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5]/40 text-[#A5B4FC] text-xs font-bold uppercase tracking-wider">
                  <Sparkle size={14} weight="fill" />
                  <span>Auditorium Live Interaction</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {pollData.question}
                </h1>
                <p className="text-sm text-white/60">
                  {pollData.title} • {pollData.venue}
                </p>
              </div>

              {/* Animated Live Bars */}
              <div className="space-y-4">
                {pollData.options.map((option) => {
                  const pct =
                    totalVotes > 0
                      ? Math.round((option.votes / totalVotes) * 100)
                      : 0;

                  return (
                    <div
                      key={option.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden backdrop-blur-sm shadow-md"
                    >
                      {/* Background fill bar */}
                      <div
                        className={`absolute inset-y-0 left-0 opacity-20 transition-all duration-700 ease-out ${option.color}`}
                        style={{ width: `${pct}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-base sm:text-lg font-black text-white">
                            {option.label}
                          </span>
                          {option.subtitle && (
                            <span className="text-xs text-white/50 block">
                              {option.subtitle}
                            </span>
                          )}
                        </div>

                        <div className="text-right flex items-baseline gap-3">
                          <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                            {pct}%
                          </span>
                          <span className="text-xs font-mono text-white/50">
                            ({option.votes} votes)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Aggregated Total Live Voters */}
              <div className="flex items-center gap-3 text-xs text-white/60 pt-2 font-mono">
                <UsersThree size={18} weight="bold" className="text-emerald-400" />
                <span>
                  <strong>{totalVotes.toLocaleString("en-IN")}</strong> Total Live Votes Transmitted from Auditorium Seats
                </span>
              </div>
            </div>

            {/* Right Column: High-Contrast Scan QR Card */}
            <div className="lg:col-span-1 flex flex-col items-center text-center">
              <div className="p-7 rounded-3xl bg-white text-[#0F172A] border border-white/20 shadow-2xl space-y-4 w-full max-w-sm animate-in fade-in">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#4F46E5] bg-indigo-50 px-2 py-0.5 rounded">
                    Instant Participation
                  </span>
                  <h3 className="text-xl font-black text-[#1E0A3C]">
                    Scan to Vote Now
                  </h3>
                  <p className="text-xs text-[#6F7287]">
                    Point your smartphone camera at this QR code. No app install required.
                  </p>
                </div>

                {qrCodeUrl ? (
                  <div className="p-3 bg-white border border-[#DBDAE3] rounded-2xl mx-auto inline-block shadow-sm">
                    <img
                      src={qrCodeUrl}
                      alt="Audience Poll QR Code"
                      className="w-56 h-56 mx-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-56 h-56 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                    <QrCode size={48} weight="light" />
                  </div>
                )}

                <div className="pt-1 text-[11px] font-semibold text-[#6F7287]">
                  get [my ▶] show • Live Interactive Platform
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Stage Footer Bar */}
      <footer className="border-t border-white/10 px-6 py-3 flex items-center justify-between text-xs text-white/40">
        <span>Sasaram, Rohtas District • GetMyShow Stage Display Engine</span>
        <span>Press F11 for Fullscreen Auditorium Beamer Mode</span>
      </footer>
    </div>
  );
}

