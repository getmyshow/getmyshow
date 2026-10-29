"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  CircleNotch,
  ArrowSquareOut,
  UserCheck,
  Key,
  WhatsappLogo,
  Trash,
  Copy,
  LockKey,
  LinkSimple,
  MagnifyingGlass,
  CalendarBlank,
  MapPinLine,
  ArrowsClockwise,
  ShareNetwork,
} from "@phosphor-icons/react";
import { formatINR } from "@/lib/utils";
import { getEventById } from "@/actions/events";
import { getEventAttendees, issueCashPass } from "@/actions/tickets";
import { requestWithdrawal } from "@/actions/wallet";
import {
  getScannerStaff,
  createScannerStaff,
  toggleScannerStaffStatus,
  deleteScannerStaff,
} from "@/actions/scanner-staff";
import { getSubdomainUrl } from "@/lib/domains";
import { ScannerStaff, EventItem, TicketOrder } from "@/types";
import EmptyEventsIllustration from "@/components/illustrations/EmptyEventsIllustration";

export default function OrganizerDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = (params?.id as string) || "";

  // Core Data State
  const [event, setEvent] = useState<EventItem | null>(null);
  const [attendees, setAttendees] = useState<TicketOrder[]>([]);
  const [staffList, setStaffList] = useState<ScannerStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [attendeeSearch, setAttendeeSearch] = useState("");

  // Cash Pass Modal State
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [cashBuyerName, setCashBuyerName] = useState("");
  const [cashBuyerPhone, setCashBuyerPhone] = useState("");
  const [cashPromoterCode, setCashPromoterCode] = useState("");
  const [cashQuantity, setCashQuantity] = useState(1);
  const [selectedTierId, setSelectedTierId] = useState<string>("");
  const [cashIssuedPass, setCashIssuedPass] = useState<{ ticketNumber: string; qrToken: string } | null>(null);
  const [cashError, setCashError] = useState<string | null>(null);

  // Withdrawal Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payoutDest, setPayoutDest] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Scanner Staff RBAC State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaffScannerId, setNewStaffScannerId] = useState("");
  const [newStaffGate, setNewStaffGate] = useState("Main Turnstile Gate A");
  const [newStaffPassword, setNewStaffPassword] = useState("9842");
  const [staffCreatedSuccess, setStaffCreatedSuccess] = useState<string | null>(null);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [copiedStaffId, setCopiedStaffId] = useState<string | null>(null);
  const [copiedPublicLink, setCopiedPublicLink] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Load Event, Attendees & Staff from Supabase
  const loadDashboardData = async () => {
    if (!routeId) return;
    setIsLoading(true);
    setLoadError(null);

    try {
      const eventRes = await getEventById(routeId);
      if (!eventRes.success) {
        setLoadError(eventRes.error || "Event not found in database.");
        setIsLoading(false);
        return;
      }

      const liveEvent = eventRes.data;
      setEvent(liveEvent);

      // Default tier for cash desk
      if (liveEvent.ticket_tiers && liveEvent.ticket_tiers.length > 0) {
        setSelectedTierId(liveEvent.ticket_tiers[0].id);
      }

      // Populate Staff
      if (Array.isArray(liveEvent.scanner_staff)) {
        setStaffList(liveEvent.scanner_staff as ScannerStaff[]);
      } else {
        const staffRes = await getScannerStaff(liveEvent.id);
        if (staffRes.success && staffRes.data) {
          setStaffList(staffRes.data);
        }
      }

      // Populate Live Attendees Roster
      const attendeesRes = await getEventAttendees(liveEvent.id);
      if (attendeesRes.success && attendeesRes.data) {
        setAttendees(attendeesRes.data);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [routeId]);

  // Derived Financials & Metrics
  const grossGMV = attendees
    .filter((t) => t.payment_status === "PAID")
    .reduce((sum, t) => sum + (Number(t.amount_paid) || 0), 0);

  const totalPaidPasses = attendees
    .filter((t) => t.payment_status === "PAID")
    .reduce((sum, t) => sum + (Number(t.quantity) || 1), 0);

  const ticketsSold = Math.max(totalPaidPasses, event?.tickets_sold || 0);
  const totalCapacity = event?.total_capacity || 100;
  const occupancyRate = Math.min(100, Math.round((ticketsSold / Math.max(1, totalCapacity)) * 100));

  const walletAvailable = Number(event?.wallet_available) || 0;
  const walletPending = Number(event?.wallet_pending_settlement) || 0;

  // Selected Tier in Cash Desk
  const activeCashTier = event?.ticket_tiers?.find((t) => t.id === selectedTierId);
  const cashUnitCost = activeCashTier ? Number(activeCashTier.price) : Number(event?.ticket_price || 0);
  const totalCashPayable = cashUnitCost * cashQuantity;

  // Provision Staff Handler
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setStaffError(null);
    setStaffCreatedSuccess(null);

    const cleanId = newStaffScannerId.trim().toUpperCase();
    if (!cleanId || !newStaffPassword.trim()) {
      setStaffError("Scanner Staff ID and Gate Password are required.");
      return;
    }

    startTransition(async () => {
      const res = await createScannerStaff({
        eventId: event.id,
        scannerId: cleanId,
        password: newStaffPassword.trim(),
        assignedGate: newStaffGate.trim(),
      });

      if (res.success) {
        setStaffList((prev) => [res.data, ...prev]);
        setStaffCreatedSuccess(`Scanner account ${res.data.scanner_id} provisioned successfully!`);
      } else {
        setStaffError(res.error || "Failed to provision scanner staff.");
      }
    });
  };

  const handleToggleStaff = (staffId: string, currentStatus: boolean) => {
    if (!event) return;
    const nextStatus = !currentStatus;
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, is_active: nextStatus } : s))
    );
    toggleScannerStaffStatus(event.id, staffId, nextStatus).catch(() => {});
  };

  const handleDeleteStaff = (staffId: string) => {
    if (!event) return;
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    deleteScannerStaff(event.id, staffId).catch(() => {});
  };

  const copyCredentials = (staff: ScannerStaff) => {
    if (!event) return;
    const staffLoginUrl = getSubdomainUrl("scan", `/login?event=${event.id}&staff=${staff.scanner_id}`);
    const shortEventCode = event.slug.split("-")[0]?.toUpperCase() || event.id.slice(0, 8).toUpperCase();
    const message = `🎟️ *GetMyShow — Scanning Staff Gate Access*\n\nHello! You have been assigned as gate entry staff for:\n🎪 *Event:* ${event.title}\n\n🔑 *Your 3 Login Credentials:*\n1️⃣ *Event ID:* ${shortEventCode}\n2️⃣ *Official Staff ID:* ${staff.scanner_id}\n3️⃣ *Gate PIN / Password:* (Provided by Organizer)\n\n📍 *Assigned Turnstile:* ${staff.assigned_gate}\n\n👉 *Open Staff Login Portal:*\n${staffLoginUrl}\n\nEnter the 3 credentials above to start scanning passes!`;
    navigator.clipboard.writeText(message);
    setCopiedStaffId(staff.id);
    setTimeout(() => setCopiedStaffId(null), 2000);
  };

  // Issue Offline Cash Pass
  const handleIssueCash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setCashError(null);
    setCashIssuedPass(null);

    startTransition(async () => {
      const res = await issueCashPass({
        eventId: event.id,
        buyerName: cashBuyerName.trim(),
        buyerWhatsapp: cashBuyerPhone.trim(),
        quantity: cashQuantity,
        amountPaid: totalCashPayable,
        tierId: activeCashTier?.id,
        tierName: activeCashTier?.name || "General Admission",
        promoterCode: cashPromoterCode.trim() || undefined,
      });

      if (res.success) {
        setCashIssuedPass(res.data);
        // Instantly reflect in local attendees roster
        const newTicket: TicketOrder = {
          id: `cash-${Date.now().toString(36)}`,
          event_id: event.id,
          ticket_number: res.data.ticketNumber,
          buyer_name: cashBuyerName.trim(),
          buyer_whatsapp: cashBuyerPhone.trim(),
          payment_mode: "CASH_PROMOTER",
          tier_id: activeCashTier?.id,
          tier_name: activeCashTier?.name || "General Admission",
          quantity: cashQuantity,
          amount_paid: totalCashPayable,
          organizer_share: totalCashPayable,
          platform_fee: 0,
          payment_status: "PAID",
          qr_token: res.data.qrToken,
          is_checked_in: false,
          created_at: new Date().toISOString(),
        };
        setAttendees((prev) => [newTicket, ...prev]);
        setEvent((prev) => (prev ? { ...prev, tickets_sold: prev.tickets_sold + cashQuantity } : null));
      } else {
        setCashError(res.error || "Failed to issue cash pass.");
      }
    });
  };

  // Payout Request Handler
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setWithdrawError(null);
    setWithdrawSuccess(null);

    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setWithdrawError("Please enter a valid withdrawal amount.");
      return;
    }

    startTransition(async () => {
      const res = await requestWithdrawal({
        eventId: event.id,
        amount: amt,
        payoutDestination: payoutDest.trim(),
      });

      if (res.success) {
        setWithdrawSuccess(
          res.message || "Withdrawal request submitted successfully! Funds will disburse with verified 12-digit UTR."
        );
        setEvent((prev) =>
          prev ? { ...prev, wallet_available: Math.max(0, prev.wallet_available - amt) } : null
        );
      } else {
        setWithdrawError(res.error || "Withdrawal failed. Please check balance and retry.");
      }
    });
  };

  // Dynamic CSV Export from Real Attendees
  const handleExportCSV = () => {
    if (!event || attendees.length === 0) {
      alert("No attendee passes booked yet to export.");
      return;
    }

    const rows = [
      "Pass ID,Attendee Name,Phone Number,Payment Mode,Tier,Quantity,Amount Paid,Gate Status,Checked In At,Booking Date",
    ];

    attendees.forEach((t) => {
      const safeName = `"${(t.buyer_name || "").replace(/"/g, '""')}"`;
      const passId = t.ticket_number || t.id.slice(0, 12);
      const phone = t.buyer_whatsapp || "";
      const mode = t.payment_mode || "ONLINE";
      const tier = `"${(t.tier_name || "General Admission").replace(/"/g, '""')}"`;
      const qty = t.quantity || 1;
      const amount = t.amount_paid || 0;
      const status = t.is_checked_in ? "Checked In" : "Not Scanned";
      const checkedAt = t.checked_in_at ? new Date(t.checked_in_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "";
      const date = new Date(t.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      rows.push(`${passId},${safeName},${phone},${mode},${tier},${qty},${amount},${status},${checkedAt},${date}`);
    });

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(rows.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `${event.slug}_attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPublicEventLink = () => {
    if (!event) return;
    const url = getSubdomainUrl("public", `/e/${event.slug}`);
    navigator.clipboard.writeText(url);
    setCopiedPublicLink(true);
    setTimeout(() => setCopiedPublicLink(false), 2000);
  };

  // Filtered Attendees
  const filteredAttendees = attendees.filter((t) => {
    if (!attendeeSearch.trim()) return true;
    const q = attendeeSearch.toLowerCase();
    return (
      t.buyer_name.toLowerCase().includes(q) ||
      (t.ticket_number && t.ticket_number.toLowerCase().includes(q)) ||
      t.buyer_whatsapp.includes(q)
    );
  });

  // LOADING SKELETON
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FA] text-[#39364F]">
        <div className="max-w-[1340px] mx-auto py-10 px-4 sm:px-6 space-y-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-white rounded-xl border border-[#DBDAE3] p-6" />
            ))}
          </div>
          <div className="h-44 bg-white rounded-2xl border border-[#DBDAE3] p-6" />
          <div className="h-64 bg-white rounded-2xl border border-[#DBDAE3] p-6" />
        </div>
      </div>
    );
  }

  // NOT FOUND / ERROR STATE
  if (loadError || !event) {
    return (
      <div className="min-h-screen bg-[#F8F7FA] text-[#39364F] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#DBDAE3] shadow-sm p-8 text-center space-y-5">
          <EmptyEventsIllustration className="w-56 h-40 mx-auto" />
          <div>
            <h1 className="text-xl font-bold text-[#1E0A3C]">Event Not Found</h1>
            <p className="text-xs text-[#6F7287] mt-1.5 leading-relaxed">
              {loadError || `Could not find an event matching identifier "${routeId}". It may have been archived or deleted.`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href="/organizer"
              className="w-full py-2.5 rounded-lg bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <CaretLeft size={16} weight="bold" />
              <span>Back to Organizer Studio</span>
            </Link>
            <button
              onClick={loadDashboardData}
              className="w-full py-2.5 rounded-lg border border-[#DBDAE3] hover:bg-slate-50 text-[#1E0A3C] text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ArrowsClockwise size={16} weight="bold" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formattedEventDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

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
              {event.title}
            </h1>
            <p className="text-xs text-[#6F7287] mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{event.venue}, {event.city}</span>
              <span>•</span>
              <span>{formattedEventDate}</span>
              <span>•</span>
              <span className="font-mono text-[#3659E3]">ID: {event.id.slice(0, 8)}...</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={copyPublicEventLink}
              className="px-3.5 py-2.5 rounded-lg bg-white border border-[#DBDAE3] hover:border-[#3659E3] text-[#39364F] hover:text-[#3659E3] text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              title="Copy public booking link"
            >
              <ShareNetwork size={16} weight="bold" />
              <span>{copiedPublicLink ? "Link Copied!" : "Share Link"}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-lg bg-white border border-[#DBDAE3] hover:border-[#3659E3] text-[#39364F] hover:text-[#3659E3] text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <DownloadSimple size={16} weight="bold" />
              <span>Export CSV</span>
            </button>

            <a
              href={getSubdomainUrl("scan", `/${event.id}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-lg bg-white border border-[#DBDAE3] hover:border-[#3659E3] text-[#39364F] hover:text-[#3659E3] text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <QrCode size={16} weight="bold" />
              <span>Gate Scanner</span>
            </a>

            <button
              onClick={() => {
                setCashError(null);
                setCashIssuedPass(null);
                setIsCashModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Coins size={16} weight="bold" />
              <span>Issue Cash Ticket</span>
            </button>
          </div>
        </div>

        {/* 4 Dynamic Metric Cards */}
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
            <div className="text-2xl font-black text-[#1E0A3C]">{ticketsSold} / {totalCapacity}</div>
            <div className="w-full h-1.5 rounded-full bg-[#EEEDF2] overflow-hidden mt-1">
              <div className="h-full bg-[#3659E3] rounded-full transition-all duration-500" style={{ width: `${occupancyRate}%` }} />
            </div>
            <p className="text-[11px] text-[#6F7287]">{occupancyRate}% hall occupancy</p>
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

        {/* Wallet Ledger Card */}
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
              onClick={() => {
                setWithdrawError(null);
                setWithdrawSuccess(null);
                setIsWithdrawModalOpen(true);
              }}
              className="px-5 py-3 rounded-lg bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Bank size={16} weight="bold" />
              <span>Request Bank Payout</span>
            </button>
          </div>

          {/* Settlement Rules Box */}
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

        {/* Gate Scanner Staff & Turnstile Access (Zero-Trust RBAC) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DBDAE3] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-[#4F46E5]">
                  Turnstile Access Control
                </span>
                <span className="text-xs text-[#6F7287]">
                  • Zero Financial / PII Access
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#1E0A3C] mt-1">
                Gate Scanner Volunteers & Staff
              </h2>
              <p className="text-xs text-[#6F7287] mt-0.5">
                Delegate pass scanning to gate bouncers and student volunteers without exposing revenue, bank payouts, or attendee data.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/staff/login?event=${event.id}`;
                  navigator.clipboard.writeText(url);
                  alert("Scanning Staff Login Portal Link copied to clipboard:\n" + url);
                }}
                className="px-3.5 py-2.5 rounded-lg border border-[#DBDAE3] hover:bg-slate-50 text-[#1E0A3C] text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                title="Copy general staff login link for this event"
              >
                <LinkSimple size={15} weight="bold" />
                <span>Copy Portal Link</span>
              </button>

              <button
                onClick={() => {
                  setStaffError(null);
                  setStaffCreatedSuccess(null);
                  setNewStaffScannerId(`GATE-${staffList.length + 1}`);
                  setNewStaffPassword(Math.floor(1000 + Math.random() * 9000).toString());
                  setIsStaffModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <UserCheck size={16} weight="bold" />
                <span>+ Provision Staff</span>
              </button>
            </div>
          </div>

          {/* Scanner Staff Table or Empty State */}
          {staffList.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-[#DBDAE3] bg-[#F8F7FA] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto">
                <UserCheck size={24} weight="duotone" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1E0A3C]">No Turnstile Staff Provisioned Yet</h4>
                <p className="text-xs text-[#6F7287] mt-1 max-w-md mx-auto">
                  Click &ldquo;+ Provision Staff&rdquo; above to create gate entry accounts for bouncers or volunteers. They will only have camera scanning access.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DBDAE3] text-[#6F7287]">
                    <th className="py-3 px-3 font-bold uppercase">Staff ID</th>
                    <th className="py-3 px-3 font-bold uppercase">Assigned Gate</th>
                    <th className="py-3 px-3 font-bold uppercase">Passes Verified</th>
                    <th className="py-3 px-3 font-bold uppercase">Status</th>
                    <th className="py-3 px-3 font-bold uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEDF2] text-[#39364F]">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-[#1E0A3C] text-white flex items-center justify-center font-mono font-bold text-[10px]">
                            {staff.scanner_id.slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-mono font-bold text-[#1E0A3C] block">
                              {staff.scanner_id}
                            </span>
                            <span className="text-[10px] text-[#6F7287]">
                              Added {new Date(staff.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-medium text-[#1E0A3C]">
                        {staff.assigned_gate}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-sm text-[#1E0A3C]">
                          {staff.scanned_count}
                        </span>
                        <span className="text-[10px] text-[#6F7287] block">attendees admitted</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            staff.is_active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${staff.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                          <span>{staff.is_active ? "Active" : "Revoked"}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* 1-Click WhatsApp Dispatch */}
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `🎟️ *GetMyShow — Scanning Staff Gate Access*\n\nHello! You have been assigned as gate entry staff for:\n🎪 *Event:* ${event.title}\n\n🔑 *Your 3 Login Credentials:*\n1️⃣ *Event ID:* ${event.id.slice(0, 8).toUpperCase()}\n2️⃣ *Official Staff ID:* ${staff.scanner_id}\n3️⃣ *Gate PIN / Password:* (Provided by Organizer)\n\n📍 *Assigned Turnstile:* ${staff.assigned_gate}\n\n👉 *Open Staff Login Portal:*\n${getSubdomainUrl("scan", `/login?event=${event.id}&staff=${staff.scanner_id}`)}\n\nEnter the 3 credentials above to start scanning passes!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-[#25D366]/10 text-[#25D366] transition border border-[#DBDAE3]"
                            title="Share credentials on WhatsApp"
                          >
                            <WhatsappLogo size={15} weight="fill" />
                          </a>

                          {/* Copy Link */}
                          <button
                            type="button"
                            onClick={() => copyCredentials(staff)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-[#6F7287] transition border border-[#DBDAE3]"
                            title="Copy credentials text"
                          >
                            <Copy size={15} weight="bold" className={copiedStaffId === staff.id ? "text-emerald-600" : ""} />
                          </button>

                          {/* Revoke / Activate Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleStaff(staff.id, staff.is_active)}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                              staff.is_active
                                ? "text-red-600 hover:bg-red-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {staff.is_active ? "Revoke" : "Activate"}
                          </button>

                          {/* Delete Staff */}
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-[#6F7287] hover:text-red-600 transition"
                            title="Remove scanner account"
                          >
                            <Trash size={15} weight="bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Attendee Roster Table (Real Data) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DBDAE3] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#1E0A3C]">Attendee Roster ({attendees.length} Passes)</h2>
              <p className="text-xs text-[#6F7287]">Live bookings from UPI online payments and offline promoter box-office.</p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <MagnifyingGlass size={14} className="absolute left-2.5 top-2.5 text-[#6F7287]" />
                <input
                  type="text"
                  placeholder="Search name, phone, pass ID..."
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-[#DBDAE3] bg-[#F8F7FA] text-xs outline-none focus:border-[#3659E3] w-48 sm:w-60"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-1.5 rounded-lg border border-[#DBDAE3] hover:border-[#39364F] text-xs font-bold text-[#39364F] flex items-center gap-1.5 transition bg-white shadow-xs shrink-0"
              >
                <DownloadSimple size={14} weight="bold" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {filteredAttendees.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-[#6F7287] flex items-center justify-center mx-auto">
                <Ticket size={24} weight="duotone" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1E0A3C]">
                  {attendees.length === 0 ? "No Passes Booked Yet" : "No Matching Attendees Found"}
                </h4>
                <p className="text-xs text-[#6F7287] mt-1 max-w-sm mx-auto">
                  {attendees.length === 0
                    ? "Share your public event link or use the Box-Office Counter above to issue offline cash passes."
                    : "Try searching with a different attendee name or phone number."}
                </p>
              </div>
              {attendees.length === 0 && (
                <button
                  type="button"
                  onClick={copyPublicEventLink}
                  className="px-4 py-2 rounded-lg bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5 mt-2"
                >
                  <ShareNetwork size={14} weight="bold" />
                  <span>{copiedPublicLink ? "Link Copied!" : "Copy Event Link to Share"}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DBDAE3] text-[#6F7287]">
                    <th className="py-3 px-3 font-bold uppercase">Pass ID</th>
                    <th className="py-3 px-3 font-bold uppercase">Attendee</th>
                    <th className="py-3 px-3 font-bold uppercase">Tier / Qty</th>
                    <th className="py-3 px-3 font-bold uppercase">Mode</th>
                    <th className="py-3 px-3 font-bold uppercase">Amount</th>
                    <th className="py-3 px-3 font-bold uppercase">Gate Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEDF2] text-[#39364F]">
                  {filteredAttendees.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-[#3659E3]">
                        <Link
                          href={`/ticket/${ticket.qr_token}`}
                          target="_blank"
                          className="hover:underline flex items-center gap-1"
                          title="Open Ticket Pass"
                        >
                          <span>{ticket.ticket_number || ticket.id.slice(0, 10)}</span>
                          <ArrowSquareOut size={12} weight="bold" />
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-[#1E0A3C] block">{ticket.buyer_name}</span>
                        <span className="text-[10px] text-[#6F7287] font-mono">{ticket.buyer_whatsapp}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-[#1E0A3C]">{ticket.tier_name || "General"}</span>
                        <span className="text-[10px] text-[#6F7287] block">{ticket.quantity} pass(es)</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            ticket.payment_mode === "CASH_PROMOTER"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {ticket.payment_mode === "CASH_PROMOTER" ? "CASH DESK" : "ONLINE UPI"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#1E0A3C]">
                        {formatINR(Number(ticket.amount_paid))}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                            ticket.is_checked_in
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-[#6F7287]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ticket.is_checked_in ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span>{ticket.is_checked_in ? "Checked In" : "Not Scanned"}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Cash Desk Modal */}
      {isCashModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl border border-[#DBDAE3] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Box Office Counter
                </span>
                <h3 className="text-lg font-bold text-[#1E0A3C] mt-1">Issue Offline Cash Pass</h3>
              </div>
              <button
                onClick={() => {
                  setIsCashModalOpen(false);
                  setCashIssuedPass(null);
                  setCashError(null);
                }}
                className="text-[#6F7287] hover:text-[#1E0A3C]"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {cashIssuedPass ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
                <CheckCircle size={32} weight="fill" className="text-emerald-600 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Cash Pass Issued Successfully!</h4>
                  <p className="text-xs text-emerald-800 font-mono mt-0.5">
                    Pass ID: <strong>{cashIssuedPass.ticketNumber}</strong>
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/ticket/${cashIssuedPass.qrToken}`}
                    target="_blank"
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1"
                  >
                    <span>View Pass & QR</span>
                    <ArrowSquareOut size={14} weight="bold" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setCashBuyerName("");
                      setCashBuyerPhone("");
                      setCashIssuedPass(null);
                    }}
                    className="py-2 px-3 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition"
                  >
                    Issue Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleIssueCash} className="space-y-3.5 text-xs">
                {cashError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 font-semibold">
                    {cashError}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-[#1E0A3C] mb-1">
                    Attendee Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={cashBuyerName}
                    onChange={(e) => setCashBuyerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-xs font-medium outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1E0A3C] mb-1">
                    Attendee WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit phone for pass delivery"
                    value={cashBuyerPhone}
                    onChange={(e) => setCashBuyerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-xs font-medium outline-none focus:border-emerald-600"
                  />
                </div>

                {event.ticket_tiers && event.ticket_tiers.length > 0 && (
                  <div>
                    <label className="block font-bold text-[#1E0A3C] mb-1">
                      Ticket Tier
                    </label>
                    <select
                      value={selectedTierId}
                      onChange={(e) => setSelectedTierId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-xs font-bold text-[#1E0A3C] outline-none"
                    >
                      {event.ticket_tiers.map((tier) => (
                        <option key={tier.id} value={tier.id}>
                          {tier.name} — {formatINR(tier.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1E0A3C] mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={cashQuantity}
                      onChange={(e) => setCashQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-xs font-bold text-[#1E0A3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1E0A3C] mb-1">
                      Promoter Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PROMO-SAS-01"
                      value={cashPromoterCode}
                      onChange={(e) => setCashPromoterCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-xs font-mono font-medium outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <CircleNotch size={15} weight="bold" className="animate-spin" />
                      <span>Issuing Cash Pass...</span>
                    </>
                  ) : (
                    <span>Collect {formatINR(totalCashPayable)} & Issue Pass</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl border border-[#DBDAE3] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3659E3] bg-indigo-50 px-2 py-0.5 rounded">
                  Settled Payout Request
                </span>
                <h3 className="text-lg font-bold text-[#1E0A3C] mt-1">Request Bank Payout</h3>
              </div>
              <button
                onClick={() => {
                  setIsWithdrawModalOpen(false);
                  setWithdrawError(null);
                  setWithdrawSuccess(null);
                }}
                className="text-[#6F7287] hover:text-[#1E0A3C]"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in text-xs">
                <CheckCircle size={32} weight="fill" className="text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-950">Payout Request Submitted!</h4>
                <p className="text-emerald-800 leading-relaxed">
                  {withdrawSuccess}
                </p>
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="mt-2 py-2 px-4 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-3.5 text-xs">
                {withdrawError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 font-semibold leading-relaxed">
                    {withdrawError}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#1E0A3C]">
                      Withdrawal Amount (₹) *
                    </label>
                    <span className="text-[11px] text-[#6F7287]">
                      Available: <strong>{formatINR(walletAvailable)}</strong>
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min={1}
                    max={walletAvailable}
                    placeholder="e.g. 10000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm font-bold text-[#1E0A3C] outline-none focus:border-[#3659E3]"
                  />
                  <span className="text-[10px] text-[#6F7287] block mt-1">
                    Rule 2.2: 15% event-completion holdback automatically applied before event date.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#1E0A3C] mb-1">
                    Destination UPI ID or Bank A/C + IFSC *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. host@upi or 50100234123 (IFSC: HDFC0001234)"
                    value={payoutDest}
                    onChange={(e) => setPayoutDest(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-xs font-medium outline-none focus:border-[#3659E3]"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-[11px] text-[#6F7287] space-y-1">
                  <div className="flex items-center gap-1 font-bold text-[#1E0A3C]">
                    <ShieldCheck size={14} weight="fill" className="text-[#3659E3]" />
                    <span>Rule 2.3 — Mandatory 12-Digit Indian Bank UTR</span>
                  </div>
                  <p>
                    All withdrawals are audited and logged with a statutory 12-digit Indian Banking UTR number before completion.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isPending || walletAvailable <= 0}
                  className="w-full py-3 rounded-lg bg-[#3659E3] hover:bg-[#2b4ac2] text-white font-bold text-xs shadow-xs mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <CircleNotch size={15} weight="bold" className="animate-spin" />
                      <span>Verifying Balances...</span>
                    </>
                  ) : walletAvailable <= 0 ? (
                    <span>No Settled Funds Available</span>
                  ) : (
                    <span>Submit Payout Request</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Provision Gate Scanner Staff Modal (RBAC) */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl border border-[#DBDAE3] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3659E3] bg-[#3659E3]/10 px-2 py-0.5 rounded">
                  Turnstile RBAC
                </span>
                <h3 className="text-lg font-bold text-[#1E0A3C] mt-1">Provision Gate Scanner Staff</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsStaffModalOpen(false);
                  setStaffCreatedSuccess(null);
                  setStaffError(null);
                }}
                className="text-[#6F7287] hover:text-[#1E0A3C] text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#6F7287]">
              Create dedicated gate credentials for gate staff or bouncers. They will have camera scanning permissions only—no financial data or payout access.
            </p>

            {staffError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {staffError}
              </div>
            )}

            {staffCreatedSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <UserCheck size={16} weight="fill" className="text-emerald-600" />
                    <span>Staff Account Provisioned!</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    {staffCreatedSuccess}
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs font-mono text-[#1E0A3C] space-y-1 mt-2">
                    <div><span className="text-[#6F7287]">1. Event ID:</span> <strong>{event.id.slice(0, 8).toUpperCase()}</strong></div>
                    <div><span className="text-[#6F7287]">2. Official Staff ID:</span> <strong>{newStaffScannerId.trim().toUpperCase()}</strong></div>
                    <div><span className="text-[#6F7287]">3. Gate PIN / Password:</span> <strong>{newStaffPassword}</strong></div>
                    <div><span className="text-[#6F7287]">Assigned Gate:</span> <strong>{newStaffGate}</strong></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `🎟️ *GetMyShow — Scanning Staff Gate Access Pass*\n\nHello! You have been assigned as entry gate staff for:\n🎪 *Event:* ${event.title}\n\n🔑 *Your 3 Login Credentials:*\n1️⃣ *Event ID:* ${event.id.slice(0, 8).toUpperCase()}\n2️⃣ *Official Staff ID:* ${newStaffScannerId.trim().toUpperCase()}\n3️⃣ *Gate PIN / Password:* ${newStaffPassword}\n\n📍 *Assigned Turnstile:* ${newStaffGate}\n\n👉 *Open Staff Login Portal:*\n${getSubdomainUrl("scan", `/login?event=${event.id}&staff=${newStaffScannerId.trim().toUpperCase()}`)}\n\nEnter the 3 credentials above to start scanning passes!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <WhatsappLogo size={16} weight="fill" />
                    <span>Send via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const msg = `🎟️ *GetMyShow — Scanning Staff Gate Access Pass*\n\nHello! You have been assigned as entry gate staff for:\n🎪 *Event:* ${event.title}\n\n🔑 *Your 3 Login Credentials:*\n1️⃣ *Event ID:* ${event.id.slice(0, 8).toUpperCase()}\n2️⃣ *Official Staff ID:* ${newStaffScannerId.trim().toUpperCase()}\n3️⃣ *Gate PIN / Password:* ${newStaffPassword}\n\n📍 *Assigned Turnstile:* ${newStaffGate}\n\n👉 *Open Staff Login Portal:*\n${getSubdomainUrl("scan", `/login?event=${event.id}&staff=${newStaffScannerId.trim().toUpperCase()}`)}\n\nEnter the 3 credentials above to start scanning passes!`;
                      navigator.clipboard.writeText(msg);
                      alert("Full WhatsApp invite with all 3 credentials copied to clipboard!");
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#DBDAE3] hover:bg-slate-50 text-xs font-bold text-[#1E0A3C] flex items-center justify-center gap-1 transition"
                  >
                    <Copy size={15} weight="bold" />
                    <span>Copy Full Message</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const portalLink = getSubdomainUrl("scan", `/login?event=${event.id}&staff=${newStaffScannerId.trim().toUpperCase()}`);
                    navigator.clipboard.writeText(portalLink);
                    alert("Staff Portal Link copied:\n" + portalLink);
                  }}
                  className="w-full py-2 rounded-lg bg-[#F8F7FA] hover:bg-slate-100 border border-[#DBDAE3] text-xs font-semibold text-[#1E0A3C] flex items-center justify-center gap-1.5 transition"
                >
                  <LinkSimple size={14} weight="bold" />
                  <span>Copy Portal Link Only</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsStaffModalOpen(false);
                    setStaffCreatedSuccess(null);
                    setNewStaffScannerId("");
                  }}
                  className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#1E0A3C] transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E0A3C]">
                    Scanner Staff Identifier (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GATE-1-RAHUL or BOUNCER-01"
                    value={newStaffScannerId}
                    onChange={(e) => setNewStaffScannerId(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-xs font-mono uppercase tracking-wider font-bold outline-none focus:border-[#3659E3]"
                  />
                  <p className="text-[10px] text-[#6F7287]">
                    Will be stamped on every scanned ticket: <code>scanned_by</code>
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E0A3C]">
                    Assigned Gate / Entrance Turnstile
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Gate Turnstile A, VIP Entrance"
                    value={newStaffGate}
                    onChange={(e) => setNewStaffGate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-xs font-medium outline-none focus:border-[#3659E3]"
                  />
                  <p className="text-[10px] text-[#6F7287]">
                    Recorded as <code>scanned_at_gate</code> for crowd control metrics
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E0A3C]">
                    Gate Access Password or PIN
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9842 or GatePass@2026"
                    value={newStaffPassword}
                    onChange={(e) => setNewStaffPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-xs font-mono font-bold outline-none focus:border-[#3659E3]"
                  />
                  <p className="text-[10px] text-[#6F7287]">
                    Staff will enter this at <code>/staff/login</code> to activate camera scanning
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <LockKey size={14} weight="fill" className="text-amber-600" />
                    <span>Strict RBAC Security Boundary</span>
                  </div>
                  <p>
                    Staff cannot view organizer revenue, ticket holder phone numbers, or trigger payout withdrawals.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 rounded-lg bg-[#3659E3] hover:bg-[#2b4ac2] text-white font-bold text-xs shadow-xs mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <CircleNotch size={15} weight="bold" className="animate-spin" />
                      <span>Provisioning Access...</span>
                    </>
                  ) : (
                    <span>Create Scanner Account</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
