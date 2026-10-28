"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowUpRight,
  Ticket,
  UsersThree,
  DownloadSimple,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle,
  QrCode,
  CaretLeft,
  X,
  Coins,
  Bank,
  Check,
} from "@phosphor-icons/react";
import { formatINR } from "@/lib/utils";

export default function OrganizerDashboardPage() {
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [cashBuyerName, setCashBuyerName] = useState("");
  const [cashBuyerPhone, setCashBuyerPhone] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payoutDest, setPayoutDest] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
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
    <div className="min-h-screen bg-[#F8F7FA] text-[#39364F]">
      <div className="max-w-[1340px] mx-auto py-10 px-4 sm:px-6 space-y-8">
        {/* Top Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#DBDAE3]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6F7287] mb-1">
              <Link href="/organizer" className="hover:text-[#3659E3] transition flex items-center gap-1 font-semibold">
                <CaretLeft size={14} weight="bold" />
                <span>Organizer Desk</span>
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#1E0A3C]">Live Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E0A3C]">
              Super 50 Talent Scholarship Test & Seminar
            </h1>
            <p className="text-xs text-[#6F7287] mt-0.5">
              Sardar Patel Hall, Gaurakshani, Sasaram • 15 Nov 2026
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/scan/1"
              className="px-4 py-2.5 rounded-lg bg-white border border-[#DBDAE3] hover:border-[#3659E3] text-[#39364F] hover:text-[#3659E3] text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <QrCode size={16} weight="bold" />
              <span>Gate Scanner</span>
            </Link>

            <button
              onClick={() => setIsCashModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Coins size={16} weight="bold" />
              <span>Issue Cash Ticket</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards (12px Radius) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Gross Sales</span>
              <div className="w-9 h-9 rounded-md bg-[#3659E3]/10 text-[#3659E3] flex items-center justify-center">
                <ArrowUpRight size={18} weight="bold" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1E0A3C]">{formatINR(grossGMV)}</div>
            <p className="text-xs text-[#6F7287]">Total ticket volume collected</p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Passes Sold</span>
              <div className="w-9 h-9 rounded-md bg-[#F05537]/10 text-[#F05537] flex items-center justify-center">
                <Ticket size={18} weight="duotone" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1E0A3C]">{ticketsSold} / {capacity}</div>
            <div className="w-full h-1.5 rounded-full bg-[#EEEDF2] overflow-hidden mt-1">
              <div className="h-full bg-[#3659E3] rounded-full" style={{ width: `${(ticketsSold / capacity) * 100}%` }} />
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Settled & Ready</span>
              <div className="w-9 h-9 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Wallet size={18} weight="duotone" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1E0A3C]">{formatINR(walletAvailable)}</div>
            <p className="text-xs text-emerald-600 font-semibold">Ready for bank withdrawal</p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#DBDAE3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F7287] uppercase tracking-wider">Pending T+2</span>
              <div className="w-9 h-9 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock size={18} weight="bold" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1E0A3C]">{formatINR(walletPending)}</div>
            <p className="text-xs text-[#6F7287]">Razorpay banking clearance</p>
          </div>
        </div>

        {/* Wallet Ledger Card (16px Radius) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DBDAE3] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#3659E3] uppercase tracking-wider">Organizer Wallet Ledger</span>
              <h2 className="text-xl font-extrabold text-[#1E0A3C] mt-0.5">T+2 Settlement & Payout Engine</h2>
              <p className="text-xs text-[#6F7287] mt-1">
                Withdraw up to 85% of settled funds. 15% is held until 8:00 AM the morning after the event concludes.
              </p>
            </div>

            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-5 py-3 rounded-lg bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Bank size={16} weight="bold" />
              <span>Request Bank Payout</span>
            </button>
          </div>

          {/* Settlement Rules Box (8px Radius) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#EEEDF2] text-xs">
            <div className="p-4 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] space-y-1">
              <span className="font-bold text-[#1E0A3C] block">Rule 2.1 — Never Pay Out Unsettled Funds</span>
              <p className="text-[#6F7287]">Withdrawals are restricted to funds that completed Razorpay&apos;s T+2 bank settlement.</p>
            </div>
            <div className="p-4 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] space-y-1">
              <span className="font-bold text-[#1E0A3C] block">Rule 2.2 — 15% Post-Event Holdback</span>
              <p className="text-[#6F7287]">Remaining 15% is unlocked the morning post-event to protect against cancellations.</p>
            </div>
            <div className="p-4 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] space-y-1">
              <span className="font-bold text-[#1E0A3C] block">Rule 2.3 — Mandatory 12-Digit UTR</span>
              <p className="text-[#6F7287]">Every payout requires a verified Indian Banking UTR number before marking complete.</p>
            </div>
          </div>
        </div>

        {/* Attendee Roster Table (16px Radius) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DBDAE3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1E0A3C]">Attendee Roster (Recent Passes)</h2>
              <p className="text-xs text-[#6F7287]">Real-time list of booked attendees and gate check-in status.</p>
            </div>

            <button
              onClick={() => alert("Attendee roster exported as CSV.")}
              className="px-4 py-2 rounded-lg border border-[#DBDAE3] hover:border-[#39364F] text-xs font-bold text-[#39364F] flex items-center gap-1.5 transition bg-white shadow-xs"
            >
              <DownloadSimple size={14} weight="bold" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DBDAE3] text-[#6F7287]">
                  <th className="py-3 px-3 font-bold uppercase">Pass ID</th>
                  <th className="py-3 px-3 font-bold uppercase">Attendee</th>
                  <th className="py-3 px-3 font-bold uppercase">Mode</th>
                  <th className="py-3 px-3 font-bold uppercase">Amount</th>
                  <th className="py-3 px-3 font-bold uppercase">Gate Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEDF2] text-[#39364F]">
                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-[#3659E3]">GMS-SAS-8421</td>
                  <td className="py-3 px-3 font-semibold text-[#1E0A3C]">Rahul Kumar Verma</td>
                  <td className="py-3 px-3">ONLINE (UPI)</td>
                  <td className="py-3 px-3 font-bold">₹100</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      Checked In
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-[#3659E3]">GMS-SAS-8422</td>
                  <td className="py-3 px-3 font-semibold text-[#1E0A3C]">Pooja Singh</td>
                  <td className="py-3 px-3">ONLINE (UPI)</td>
                  <td className="py-3 px-3 font-bold">₹100</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-[#6F7287] font-bold text-[10px]">
                      Not Scanned
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-[#3659E3]">GMS-SAS-8423</td>
                  <td className="py-3 px-3 font-semibold text-[#1E0A3C]">Amitabh Ranjan</td>
                  <td className="py-3 px-3">CASH_PROMOTER</td>
                  <td className="py-3 px-3 font-bold">₹100</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-[#6F7287] font-bold text-[10px]">
                      Not Scanned
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cash Desk Modal */}
      {isCashModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl border border-[#DBDAE3] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1E0A3C]">Issue Offline Cash Ticket</h3>
              <button onClick={() => setIsCashModalOpen(false)} className="text-[#6F7287]">
                <X size={20} weight="bold" />
              </button>
            </div>
            <p className="text-xs text-[#6F7287]">
              For student ambassadors & counter receptionists. Collects cash and issues instant WhatsApp pass.
            </p>
            <form onSubmit={handleIssueCash} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Attendee Full Name"
                value={cashBuyerName}
                onChange={(e) => setCashBuyerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm font-medium outline-none focus:border-[#3659E3]"
              />
              <input
                type="tel"
                required
                placeholder="10-digit WhatsApp number"
                value={cashBuyerPhone}
                onChange={(e) => setCashBuyerPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm font-medium outline-none focus:border-[#3659E3]"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Collect ₹100 & Issue Pass
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl border border-[#DBDAE3] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1E0A3C]">Request Payout to Bank / UPI</h3>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-[#6F7287]">
                <X size={20} weight="bold" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold text-center">
                Payout request submitted! UTR will be logged once processed.
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1E0A3C] mb-1">
                    Withdrawal Amount (Max: {formatINR(walletAvailable)})
                  </label>
                  <input
                    type="number"
                    required
                    max={walletAvailable}
                    placeholder="e.g. 10000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm font-bold text-[#1E0A3C] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1E0A3C] mb-1">
                    Destination UPI ID or Bank A/C + IFSC
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. institute@upi or SBIN0001234..."
                    value={payoutDest}
                    onChange={(e) => setPayoutDest(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1E0A3C] mb-1">
                    Verified 12-Digit Indian Bank UTR (For Admin Logging)
                  </label>
                  <input
                    type="text"
                    placeholder="12-digit UTR reference"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm font-mono font-medium outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#3659E3] hover:bg-[#2b4ac2] text-white font-bold text-xs shadow-xs mt-2"
                >
                  Confirm Withdrawal Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
