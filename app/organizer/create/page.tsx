"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  CaretLeft,
  Sparkle,
  CheckCircle,
  Ticket,
  CalendarBlank,
  MapPinLine,
  UsersThree,
  LockKey,
  ShieldCheck,
  Lightning,
  CircleNotch,
  Plus,
  Trash,
  PlusCircle,
  Question,
  ArrowRight,
  Eye,
  Copy,
  Clock,
  CurrencyInr,
} from "@phosphor-icons/react";
import { formatINR } from "@/lib/utils";
import { createEvent } from "@/actions/events";
import { TicketTier, CustomField, EventItem } from "@/types";
import CheckoutSuccessIllustration from "@/components/illustrations/CheckoutSuccessIllustration";

const DRAFT_STORAGE_KEY = "gms_organizer_create_draft";

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  // Basic Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("Sasaram");
  const [eventDate, setEventDate] = useState("");
  const [posterUrl, setPosterUrl] = useState("");

  // Multi-Tier Ticketing State
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([
    {
      id: "tier-ga",
      name: "General Admission",
      price: 150,
      capacity: 400,
      tickets_sold: 0,
      perks: "Standard hall entry • Open auditorium seating",
      badge_color: "indigo",
    },
  ]);

  // Pricing & Platform Fee Configuration
  const [passFeeToBuyer, setPassFeeToBuyer] = useState(true);

  // Security & Host Details
  const [scannerPin, setScannerPin] = useState("1234");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerWhatsapp, setOrganizerWhatsapp] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");

  // Custom Attendee Questions State
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // Workflow & Draft States
  const [hasDraft, setHasDraft] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdEvent, setCreatedEvent] = useState<EventItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-fill host details from Clerk authentication if signed in
  useEffect(() => {
    if (isSignedIn && user) {
      if (!organizerName && user.fullName) {
        setOrganizerName(user.fullName);
      }
      if (!organizerEmail && user.primaryEmailAddress?.emailAddress) {
        setOrganizerEmail(user.primaryEmailAddress.emailAddress);
      }
      if (!organizerWhatsapp && user.primaryPhoneNumber?.phoneNumber) {
        setOrganizerWhatsapp(user.primaryPhoneNumber.phoneNumber.replace(/\D/g, "").slice(-10));
      }
    }
  }, [isSignedIn, user, organizerName, organizerEmail, organizerWhatsapp]);

  // Check for saved local draft on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.title || parsed.venue || parsed.organizerName) {
            setHasDraft(true);
          }
        } catch {}
      }
    }
  }, []);

  // Auto-save draft to localStorage whenever form state changes
  useEffect(() => {
    if (typeof window === "undefined" || createdEvent) return;

    const timeout = setTimeout(() => {
      const draftPayload = {
        title,
        description,
        venue,
        city,
        eventDate,
        posterUrl,
        ticketTiers,
        passFeeToBuyer,
        scannerPin,
        organizerName,
        organizerWhatsapp,
        organizerEmail,
        customFields,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [
    title,
    description,
    venue,
    city,
    eventDate,
    posterUrl,
    ticketTiers,
    passFeeToBuyer,
    scannerPin,
    organizerName,
    organizerWhatsapp,
    organizerEmail,
    customFields,
    createdEvent,
  ]);

  const restoreDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.description) setDescription(parsed.description);
      if (parsed.venue) setVenue(parsed.venue);
      if (parsed.city) setCity(parsed.city);
      if (parsed.eventDate) setEventDate(parsed.eventDate);
      if (parsed.posterUrl) setPosterUrl(parsed.posterUrl);
      if (parsed.ticketTiers && Array.isArray(parsed.ticketTiers)) setTicketTiers(parsed.ticketTiers);
      if (typeof parsed.passFeeToBuyer === "boolean") setPassFeeToBuyer(parsed.passFeeToBuyer);
      if (parsed.scannerPin) setScannerPin(parsed.scannerPin);
      if (parsed.organizerName) setOrganizerName(parsed.organizerName);
      if (parsed.organizerWhatsapp) setOrganizerWhatsapp(parsed.organizerWhatsapp);
      if (parsed.organizerEmail) setOrganizerEmail(parsed.organizerEmail);
      if (parsed.customFields && Array.isArray(parsed.customFields)) setCustomFields(parsed.customFields);
      setHasDraft(false);
    } catch {}
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
  };

  // Tier operations
  const addTier = () => {
    const newTierNumber = ticketTiers.length + 1;
    const defaultColor = newTierNumber === 2 ? "saffron" : newTierNumber === 3 ? "emerald" : "indigo";
    const defaultName = newTierNumber === 2 ? "VIP Stage Front Pass" : newTierNumber === 3 ? "Student Discount Pass" : `Tier ${newTierNumber}`;
    const defaultPrice = newTierNumber === 2 ? 500 : newTierNumber === 3 ? 99 : 200;

    setTicketTiers((prev) => [
      ...prev,
      {
        id: `tier-${Date.now().toString(36)}`,
        name: defaultName,
        price: defaultPrice,
        capacity: 100,
        tickets_sold: 0,
        perks: newTierNumber === 2 ? "Front-row seats + VIP badge" : "Requires valid student ID card",
        badge_color: defaultColor,
      },
    ]);
  };

  const updateTier = (index: number, field: keyof TicketTier, value: unknown) => {
    setTicketTiers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeTier = (index: number) => {
    if (ticketTiers.length <= 1) return;
    setTicketTiers((prev) => prev.filter((_, i) => i !== index));
  };

  // Custom question operations
  const addPresetQuestion = (type: "roll" | "exam" | "class") => {
    if (type === "roll") {
      setCustomFields((prev) => [
        ...prev,
        {
          id: `q-roll-${Date.now().toString(36)}`,
          label: "Coaching Roll Number / Student ID",
          placeholder: "e.g. SRM-2026-904",
          required: true,
          type: "text",
        },
      ]);
    } else if (type === "exam") {
      setCustomFields((prev) => [
        ...prev,
        {
          id: `q-exam-${Date.now().toString(36)}`,
          label: "Target Competitive Exam",
          required: true,
          type: "select",
          options: ["JEE Main & Advanced", "NEET UG", "NDA / Defence", "UPSC / BPSC Foundation"],
        },
      ]);
    } else if (type === "class") {
      setCustomFields((prev) => [
        ...prev,
        {
          id: `q-class-${Date.now().toString(36)}`,
          label: "Current Academic Class",
          required: true,
          type: "select",
          options: ["Class 10th", "Class 11th", "Class 12th", "Repeater / Dropper Batch"],
        },
      ]);
    }
  };

  const addCustomQuestion = () => {
    setCustomFields((prev) => [
      ...prev,
      {
        id: `q-custom-${Date.now().toString(36)}`,
        label: "Custom Question",
        placeholder: "Enter attendee question prompt...",
        required: false,
        type: "text",
      },
    ]);
  };

  const updateCustomField = (index: number, field: keyof CustomField, value: unknown) => {
    setCustomFields((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeCustomField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  };

  // Aggregated totals
  const totalCapacity = ticketTiers.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0);
  const primaryTicketPrice = ticketTiers[0]?.price || 0;
  const estimatedGrossRevenue = ticketTiers.reduce((acc, t) => acc + (Number(t.price) || 0) * (Number(t.capacity) || 0), 0);
  const estimatedNetRevenue = passFeeToBuyer
    ? estimatedGrossRevenue
    : Math.round(estimatedGrossRevenue * 0.93);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !venue.trim() || !eventDate || !organizerName.trim() || !organizerWhatsapp.trim()) {
      setErrorMessage("Please complete all mandatory fields marked with an asterisk (*).");
      return;
    }

    const cleanPhone = organizerWhatsapp.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please provide a valid 10-digit Indian WhatsApp number.");
      return;
    }

    startTransition(async () => {
      const result = await createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        venue: venue.trim(),
        city: city.trim(),
        event_date: eventDate,
        ticket_price: primaryTicketPrice,
        pass_fee_to_buyer: passFeeToBuyer,
        total_capacity: totalCapacity,
        scanner_pin: scannerPin.trim() || "1234",
        organizer_name: organizerName.trim(),
        organizer_whatsapp: cleanPhone.slice(-10),
        organizer_email: organizerEmail.trim() || undefined,
        poster_url: posterUrl.trim() || undefined,
        ticket_tiers: ticketTiers,
        custom_fields: customFields,
      });

      if (result.success) {
        setCreatedEvent(result.data);
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } else {
        setErrorMessage(result.error || "Failed to publish event. Please check inputs and retry.");
      }
    });
  };

  const handleCopyLink = () => {
    if (!createdEvent) return;
    const url = `${window.location.origin}/e/${createdEvent.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // SUCCESS CONFIRMATION VIEW
  if (createdEvent) {
    const liveEventUrl = `/e/${createdEvent.slug}`;
    const gateScanUrl = `/scan/${createdEvent.id}`;
    const dashboardUrl = `/organizer/dashboard/${createdEvent.id}`;

    return (
      <div className="min-h-[85vh] bg-[#F8F7FA] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-[#DBDAE3] shadow-xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-center">
            <CheckoutSuccessIllustration className="w-48 h-36" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 tracking-wider">
              Event Published Live
            </span>
            <h1 className="text-2xl font-black text-[#1E0A3C] mt-1.5">
              Ticketing Desk Activated!
            </h1>
            <p className="text-xs text-[#6F7287] mt-1">
              Your event is now live on GetMyShow. Share the direct ticket link on WhatsApp to launch instant UPI pass bookings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F7FA] border border-[#DBDAE3] text-left space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-[#6F7287]">Event Title:</span>
              <span className="font-bold text-[#1E0A3C] truncate max-w-[240px]">{createdEvent.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6F7287]">Venue:</span>
              <span className="font-semibold text-[#39364F]">{createdEvent.city} • {createdEvent.venue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6F7287]">Pass Capacity:</span>
              <span className="font-bold text-[#1E0A3C]">{createdEvent.total_capacity} Passes ({ticketTiers.length} Tiers)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-[#6F7287] font-semibold">Gate Volunteer PIN:</span>
              <span className="font-mono font-bold text-sm text-[#4F46E5] bg-white px-2.5 py-0.5 rounded border border-[#DBDAE3]">
                {createdEvent.scanner_pin}
              </span>
            </div>
          </div>

          {/* Quick Copy Link Bar */}
          <div className="flex items-center gap-2 p-2 bg-[#F8F7FA] border border-[#DBDAE3] rounded-lg">
            <input
              type="text"
              readOnly
              value={typeof window !== "undefined" ? `${window.location.origin}${liveEventUrl}` : liveEventUrl}
              className="bg-transparent text-xs text-[#39364F] font-mono flex-1 outline-none px-2 select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-md bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#4338CA] transition flex items-center gap-1 shrink-0"
            >
              <Copy size={13} weight="bold" />
              <span>{copiedLink ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <Link
              href={liveEventUrl}
              className="w-full py-3 rounded-lg bg-[#F05537] hover:bg-[#D94428] text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Eye size={15} weight="bold" />
              <span>View Live Event Page</span>
            </Link>
            <Link
              href={dashboardUrl}
              className="w-full py-3 rounded-lg border border-[#DBDAE3] text-[#1E0A3C] font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 bg-white hover:bg-[#F8F7FA]"
            >
              <span>Open Organizer Console</span>
              <ArrowRight size={15} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#39364F] py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/organizer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#39364F] hover:text-[#4F46E5] transition"
          >
            <CaretLeft size={16} weight="bold" />
            <span>Back to Organizer Desk</span>
          </Link>

          <span className="text-xs text-[#6F7287]">
            Bihar Hyperlocal Ticketing Engine
          </span>
        </div>

        {/* Local Draft Restore Alert */}
        {hasDraft && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Clock size={18} weight="bold" className="text-amber-600 shrink-0" />
              <span>
                <strong>Unsaved Draft Found:</strong> We detected an in-progress event form saved locally on your device.
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={restoreDraft}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition"
              >
                Restore Draft
              </button>
              <button
                type="button"
                onClick={discardDraft}
                className="px-2.5 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-100 text-amber-800 font-semibold text-xs transition"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {errorMessage}
          </div>
        )}

        {/* Form Container (16px Radius - No AI Slop) */}
        <div className="bg-white rounded-2xl border border-[#DBDAE3] shadow-md p-6 sm:p-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F05537] uppercase tracking-wider mb-1">
              <Sparkle size={14} weight="fill" />
              <span>60-Second Event Creator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E0A3C]">
              Launch Your Event in Bihar
            </h1>
            <p className="text-xs sm:text-sm text-[#6F7287] mt-1">
              Configure multi-tier ticketing (VIP, General, Student), set gate scanner PIN, and add custom attendee questions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. BASIC EVENT DETAILS */}
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#1E0A3C] border-b border-slate-100 pb-2">
                1. Event Overview
              </h2>

              <div>
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Super 50 Scholarship Seminar or Rohtas Garba Mahotsav"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                  Event Description & Guidelines
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline seminar schedule, chief guests, hall dress code, eligibility rules, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                    City (Bihar) *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#4F46E5]"
                  >
                    <option value="Sasaram">Sasaram (Rohtas)</option>
                    <option value="Dehri-on-Sone">Dehri-on-Sone</option>
                    <option value="Patna">Patna</option>
                    <option value="Gaya">Gaya</option>
                    <option value="Bhabua">Bhabua</option>
                    <option value="Ara">Ara</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                    Venue & Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sardar Patel Hall, Gaurakshani"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                    Event Date & Time (IST) *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#4F46E5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                    Poster Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>
            </div>

            {/* 2. MULTI-TIER TICKETING BUILDER */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-[#1E0A3C]">
                    2. Ticket Tiers & Capacity
                  </h2>
                  <p className="text-xs text-[#6F7287]">
                    Total event capacity automatically calculated: <strong>{totalCapacity} passes</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addTier}
                  className="px-3 py-1.5 rounded-lg bg-[#4F46E5]/10 hover:bg-[#4F46E5]/20 text-[#4F46E5] text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus size={14} weight="bold" />
                  <span>Add Another Tier</span>
                </button>
              </div>

              <div className="space-y-3">
                {ticketTiers.map((tier, idx) => (
                  <div
                    key={tier.id}
                    className="p-4 rounded-xl bg-[#F8F7FA] border border-[#DBDAE3] space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#4F46E5]">
                        Tier #{idx + 1}
                      </span>
                      {ticketTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(idx)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
                        >
                          <Trash size={14} weight="bold" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#1E0A3C] mb-1">
                          Tier Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={tier.name}
                          onChange={(e) => updateTier(idx, "name", e.target.value)}
                          placeholder="e.g. VIP Front Pass, General Entry"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DBDAE3] text-xs font-bold text-[#1E0A3C] outline-none focus:border-[#4F46E5]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1E0A3C] mb-1">
                          Badge Style
                        </label>
                        <select
                          value={tier.badge_color || "indigo"}
                          onChange={(e) => updateTier(idx, "badge_color", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DBDAE3] text-xs font-medium text-[#39364F] outline-none focus:border-[#4F46E5]"
                        >
                          <option value="indigo">Indigo (Standard)</option>
                          <option value="saffron">Saffron (VIP)</option>
                          <option value="emerald">Emerald (Discount)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#1E0A3C] mb-1">
                          Price per Attendee (₹) *
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={10}
                          required
                          value={tier.price}
                          onChange={(e) => updateTier(idx, "price", Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DBDAE3] text-xs font-bold text-[#1E0A3C] outline-none focus:border-[#4F46E5]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1E0A3C] mb-1">
                          Tier Seat Capacity *
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={5000}
                          required
                          value={tier.capacity}
                          onChange={(e) => updateTier(idx, "capacity", Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DBDAE3] text-xs font-bold text-[#1E0A3C] outline-none focus:border-[#4F46E5]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1E0A3C] mb-1">
                        Tier Perks & Description
                      </label>
                      <input
                        type="text"
                        value={tier.perks || ""}
                        onChange={(e) => updateTier(idx, "perks", e.target.value)}
                        placeholder="e.g. Front 3 rows reserved + seminar notes booklet"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#DBDAE3] text-xs text-[#39364F] outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 0% Commission Fee Pass Toggle & Revenue Projections */}
              <div className="p-4 rounded-xl bg-[#F8F7FA] border border-[#DBDAE3] space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#1E0A3C] block">
                      Pass Platform Convenience Fee to Attendee (0% Cost to Host)
                    </span>
                    <span className="text-[11px] text-[#6F7287] block mt-0.5">
                      {passFeeToBuyer
                        ? "Attendee pays small 7% fee at UPI checkout. You receive 100% of your ticket price."
                        : "You absorb the 7% fee. Attendees pay exact ticket price with ₹0 convenience fee."}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPassFeeToBuyer(!passFeeToBuyer)}
                    className={`w-11 h-6 rounded-md transition-colors p-0.5 shrink-0 ${
                      passFeeToBuyer ? "bg-[#4F46E5]" : "bg-[#DBDAE3]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-sm bg-white transition-transform ${
                        passFeeToBuyer ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-2.5 border-t border-[#DBDAE3]/70 flex items-center justify-between text-xs">
                  <span className="text-[#6F7287]">Projected Organizer Payout:</span>
                  <span className="font-mono font-black text-sm text-[#1E0A3C]">
                    {formatINR(estimatedNetRevenue)} <span className="text-[10px] text-emerald-600 font-bold">(T+2 Bank Settlement)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 3. CUSTOM ATTENDEE QUESTION BUILDER */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-[#1E0A3C]">
                    3. Attendee Questionnaire (Optional)
                  </h2>
                  <p className="text-xs text-[#6F7287]">
                    Gather coaching roll numbers, target exams, or college classes during checkout.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addCustomQuestion}
                  className="px-3 py-1.5 rounded-lg border border-[#DBDAE3] hover:border-[#4F46E5] text-[#39364F] hover:text-[#4F46E5] text-xs font-bold transition flex items-center gap-1 bg-white self-start sm:self-auto"
                >
                  <Plus size={14} weight="bold" />
                  <span>Custom Field</span>
                </button>
              </div>

              {/* Fast Presets Row */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-[#6F7287] py-1 font-medium">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => addPresetQuestion("roll")}
                  className="px-2.5 py-1 rounded-md bg-white border border-[#DBDAE3] hover:border-[#4F46E5] text-[#1E0A3C] font-semibold transition"
                >
                  + Roll Number
                </button>
                <button
                  type="button"
                  onClick={() => addPresetQuestion("exam")}
                  className="px-2.5 py-1 rounded-md bg-white border border-[#DBDAE3] hover:border-[#4F46E5] text-[#1E0A3C] font-semibold transition"
                >
                  + Target Exam
                </button>
                <button
                  type="button"
                  onClick={() => addPresetQuestion("class")}
                  className="px-2.5 py-1 rounded-md bg-white border border-[#DBDAE3] hover:border-[#4F46E5] text-[#1E0A3C] font-semibold transition"
                >
                  + Class / Batch
                </button>
              </div>

              {/* Questions List */}
              {customFields.length > 0 && (
                <div className="space-y-3 pt-1">
                  {customFields.map((field, qIdx) => (
                    <div
                      key={field.id}
                      className="p-3.5 rounded-xl bg-[#F8F7FA] border border-[#DBDAE3] space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#4F46E5]">
                          Question #{qIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCustomField(qIdx)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                        >
                          <Trash size={13} weight="bold" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-[#1E0A3C] mb-1">
                            Prompt Label
                          </label>
                          <input
                            type="text"
                            required
                            value={field.label}
                            onChange={(e) => updateCustomField(qIdx, "label", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DBDAE3] text-xs font-semibold text-[#1E0A3C] outline-none focus:border-[#4F46E5]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#1E0A3C] mb-1">
                            Response Type
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) => updateCustomField(qIdx, "type", e.target.value as "text" | "number" | "select")}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DBDAE3] text-xs text-[#39364F] outline-none focus:border-[#4F46E5]"
                          >
                            <option value="text">Short Text</option>
                            <option value="number">Number</option>
                            <option value="select">Dropdown Options</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id={`req-${field.id}`}
                          checked={field.required}
                          onChange={(e) => updateCustomField(qIdx, "required", e.target.checked)}
                          className="rounded border-[#DBDAE3] text-[#4F46E5] focus:ring-[#4F46E5]"
                        />
                        <label htmlFor={`req-${field.id}`} className="text-xs text-[#39364F] select-none">
                          Mandatory response before payment
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. SECURITY & ORGANIZER INFO */}
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#1E0A3C] border-b border-slate-100 pb-2">
                4. Gate Security PIN & Host Contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                    Organizer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Institute / Club / Host"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#4F46E5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                    Organizer WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit phone"
                    value={organizerWhatsapp}
                    onChange={(e) => setOrganizerWhatsapp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#4F46E5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E0A3C] mb-1.5">
                    Gate Volunteer PIN *
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={scannerPin}
                    onChange={(e) => setScannerPin(e.target.value)}
                    placeholder="1234"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F7FA] border border-[#DBDAE3] text-sm font-mono font-bold text-[#1E0A3C] text-center outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 rounded-xl bg-[#F05537] hover:bg-[#D94428] text-white text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[48px]"
              >
                {isPending ? (
                  <>
                    <CircleNotch size={20} weight="bold" className="animate-spin" />
                    <span>Publishing Multi-Tier Event...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Event & Launch Instant UPI Ticketing</span>
                    <Lightning size={18} weight="fill" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
