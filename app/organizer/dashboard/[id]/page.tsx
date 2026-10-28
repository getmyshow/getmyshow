"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowUpRight,
  Ticket,
  Users,
  Download,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function OrganizerDashboardPage() {
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [cashBuyerName, setCashBuyerName] = useState("");
  const [cashBuyerPhone, setCashBuyerPhone] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payoutDest, setPayoutDest] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Financial statistics
  const grossGMV = 38200;
  const ticketsSold = 382;
  const capacity = 500;
  const walletPending = 35526;
  const walletAvailable = 14200;

  const handleIssueCash = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Cash Pass Issued for ${cashBuyerName} (${cashBuyerPhone})!\nStudent Promoter Bounty: ₹20 credited.`);
    setCashBuyerName("");
    setCashBuyerPhone("");
    setIsCashModalOpen(false);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawModalOpen(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">
            Organizer Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Super 50 Talent Scholarship Test & Seminar
          </h1>
          <p className="text-xs text-text-muted mt-0.5">Sardar Patel Hall, Gaurakshani, Sasaram</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCashModalOpen(true)}
            className="px-4 py-2.5 rounded-button text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue Cash Pass</span>
          </button>

          <Link
            href="/scan/demo"
            className="px-4 py-2.5 rounded-button text-xs font-semibold bg-surface-card hover:bg-surface-elevated border border-surface-border text-white transition flex items-center gap-1.5"
          >
            <Ticket className="w-4 h-4 text-brand-saffron" />
            <span>Gate Scanner</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-card bg-surface-card border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-text-dim text-xs">
            <span className="font-semibold uppercase tracking-wider">Gross Sales (GMV)</span>
            <Ticket className="w-4 h-4 text-brand-indigo" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{formatINR(grossGMV)}</p>
          <p className="text-[11px] text-text-muted">Total collected before fees</p>
        </div>

        <div className="p-5 rounded-card bg-surface-card border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-text-dim text-xs">
            <span className="font-semibold uppercase tracking-wider">Passes Sold</span>
            <Users className="w-4 h-4 text-brand-saffron" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {ticketsSold} <span className="text-sm text-text-dim">/ {capacity}</span>
          </p>
          <div className="w-full bg-surface-elevated rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-indigo h-full rounded-full"
              style={{ width: `${(ticketsSold / capacity) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-card bg-surface-card border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-text-dim text-xs">
            <span className="font-semibold uppercase tracking-wider">Attendance Check-In</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">298 / 382</p>
          <p className="text-[11px] text-emerald-400 font-medium">78% Admitted at Gate</p>
        </div>
      </div>

      {/* Wallet Settlement Ledger (T+2 Payout Engine) */}
      <div className="p-6 rounded-card bg-surface-card border border-surface-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-brand-indigo" />
              <span>Organizer Earnings & Wallet Ledger</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Net 93% share credited automatically. T+2 bank settlement rules apply.
            </p>
          </div>

          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-5 py-2.5 rounded-button text-xs font-bold bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-glow transition active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Request Withdrawal</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-button bg-surface-elevated border border-surface-border/70 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Bank Settlement (T+2)</span>
            </div>
            <p className="text-2xl font-mono font-bold text-white">{formatINR(walletPending)}</p>
            <p className="text-[10px] text-text-dim">Awaiting clearance from Razorpay</p>
          </div>

          <div className="p-4 rounded-button bg-surface-elevated border border-surface-border/70 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Available to Withdraw</span>
            </div>
            <p className="text-2xl font-mono font-bold text-emerald-400">{formatINR(walletAvailable)}</p>
            <p className="text-[10px] text-text-dim">Ready for instant UPI / Bank NEFT transfer</p>
          </div>
        </div>
      </div>

      {/* Attendee Data Export Card */}
      <div className="p-6 rounded-card bg-surface-card border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Attendee Lead Data & Check-In Log</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Export verified student list with WhatsApp numbers, Class, and gate attendance for follow-ups.
          </p>
        </div>
        <button
          onClick={() => alert("Downloading attendance spreadsheet (Excel/CSV)...")}
          className="px-4 py-2.5 rounded-button text-xs font-semibold bg-surface-elevated hover:bg-slate-800 border border-surface-border text-white transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-brand-indigo" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Cash Counter Pass Modal */}
      {isCashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-surface-card border border-surface-border rounded-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Issue Cash Pass (Promoter Desk)</h3>
            <p className="text-xs text-text-muted">
              Accept cash at the counter and generate an instant pass. Bypasses gateway fees.
            </p>
            <form onSubmit={handleIssueCash} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Attendee Name</label>
                <input
                  type="text"
                  required
                  value={cashBuyerName}
                  onChange={(e) => setCashBuyerName(e.target.value)}
                  placeholder="e.g. Vikas Kumar"
                  className="w-full px-3 py-2 rounded-button bg-surface-elevated border border-surface-border text-white text-xs focus:outline-none focus:border-brand-indigo"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={cashBuyerPhone}
                  onChange={(e) => setCashBuyerPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 rounded-button bg-surface-elevated border border-surface-border text-white text-xs focus:outline-none focus:border-brand-indigo"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCashModalOpen(false)}
                  className="flex-1 py-2.5 rounded-button text-xs font-semibold bg-surface-elevated text-text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-button text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  Confirm & Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-surface-card border border-surface-border rounded-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Request Wallet Payout</h3>
            <p className="text-xs text-text-muted">
              Available: <span className="text-emerald-400 font-bold">{formatINR(walletAvailable)}</span>
            </p>
            {withdrawSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">Payout Requested!</p>
                <p className="text-xs text-text-dim">You will receive the bank transfer within 2-4 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    max={walletAvailable}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full px-3 py-2 rounded-button bg-surface-elevated border border-surface-border text-white text-xs focus:outline-none focus:border-brand-indigo font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">UPI ID or Bank A/C + IFSC</label>
                  <input
                    type="text"
                    required
                    value={payoutDest}
                    onChange={(e) => setPayoutDest(e.target.value)}
                    placeholder="organizer@okhdfcbank"
                    className="w-full px-3 py-2 rounded-button bg-surface-elevated border border-surface-border text-white text-xs focus:outline-none focus:border-brand-indigo"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="flex-1 py-2.5 rounded-button text-xs font-semibold bg-surface-elevated text-text-muted hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-button text-xs font-bold bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-glow"
                  >
                    Withdraw
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

