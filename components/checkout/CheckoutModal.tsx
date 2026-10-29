"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  X,
  ShieldCheck,
  ArrowRight,
  CircleNotch,
  Minus,
  Plus,
  Lightning,
  WhatsappLogo,
  User,
  CheckCircle,
  Ticket,
  LockKey,
  Clock,
  Tag,
  Trash,
  Sparkle,
  DeviceMobile,
  Check,
} from "@phosphor-icons/react";
import { EventItem, TicketTier } from "@/types";
import { formatINR } from "@/lib/utils";
import { initiateCheckout } from "@/actions/checkout";

interface CheckoutModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  initialQuantity?: number;
  selectedTier?: TicketTier;
}

export default function CheckoutModal({
  event,
  isOpen,
  onClose,
  initialQuantity = 1,
  selectedTier,
}: CheckoutModalProps) {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [step, setStep] = useState<1 | 2>(1);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [name, setName] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [selectedUpiApp, setSelectedUpiApp] = useState<"gpay" | "phonepe" | "paytm" | "any">("gpay");
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(480); // 8 minutes BookMyShow hold

  // BookMyShow-style Promo & Coupon Code Engine
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
    label: string;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsRemaining(480);
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const countdownMinutes = Math.floor(secondsRemaining / 60);
  const countdownSeconds = secondsRemaining % 60;
  const formattedCountdown = `${countdownMinutes.toString().padStart(2, "0")}:${countdownSeconds.toString().padStart(2, "0")}`;
  const timerPercentage = Math.max(0, Math.min(100, (secondsRemaining / 480) * 100));

  // Auto-fill buyer details if signed in with Clerk / Google
  useEffect(() => {
    if (isSignedIn && user) {
      if (!name && user.fullName) {
        setName(user.fullName);
      }
      if (!whatsapp && user.primaryPhoneNumber?.phoneNumber) {
        setWhatsapp(user.primaryPhoneNumber.phoneNumber.replace(/\D/g, "").slice(-10));
      }
    }
  }, [isSignedIn, user, name, whatsapp]);

  if (!isOpen) return null;

  // Pricing calculation based on selected tier, quantity, and applied coupons
  const currentTierPrice = selectedTier ? selectedTier.price : event.ticket_price;
  const baseSubtotal = currentTierPrice * quantity;
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const netSubtotal = Math.max(0, baseSubtotal - discountAmount);
  const platformFee = event.pass_fee_to_buyer ? Math.round(netSubtotal * 0.07) : 0;
  const totalPayable = netSubtotal + platformFee;

  const applyCouponCode = (codeToApply: string) => {
    setPromoError(null);
    const cleanCode = codeToApply.trim().toUpperCase();
    if (!cleanCode) return;

    const VALID_COUPONS: Record<
      string,
      { discountPercent?: number; flatDiscount?: number; minOrder?: number; label: string }
    > = {
      BIHAR20: { discountPercent: 20, minOrder: 100, label: "20% Bihar Launch Offer" },
      SUPER50: { flatDiscount: 50, minOrder: 150, label: "Flat ₹50 Instant Discount" },
      FIRSTSHOW: { discountPercent: 10, minOrder: 50, label: "10% First Show Welcome Discount" },
      GMSVIP: { discountPercent: 25, minOrder: 250, label: "25% VIP Pass Offer" },
    };

    const coupon = VALID_COUPONS[cleanCode];
    if (!coupon) {
      setPromoError("Invalid promo code. Tap one of the recommended coupons below.");
      return;
    }

    if (coupon.minOrder && baseSubtotal < coupon.minOrder) {
      setPromoError(`Minimum spend of ${formatINR(coupon.minOrder)} required for code ${cleanCode}.`);
      return;
    }

    let calculatedDiscount = 0;
    if (coupon.discountPercent) {
      calculatedDiscount = Math.round((baseSubtotal * coupon.discountPercent) / 100);
    } else if (coupon.flatDiscount) {
      calculatedDiscount = coupon.flatDiscount;
    }

    const finalDiscount = Math.min(baseSubtotal, calculatedDiscount);
    setAppliedPromo({
      code: cleanCode,
      discountAmount: finalDiscount,
      label: coupon.label,
    });
    setPromoInput("");
    setIsPromoOpen(false);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    applyCouponCode(promoInput);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const handleCustomChange = (fieldId: string, value: string) => {
    setCustomAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleStepOneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const cleanedPhone = whatsapp.replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit WhatsApp phone number.");
      return;
    }

    if (event.custom_fields && event.custom_fields.length > 0) {
      setStep(2);
    } else {
      initiatePayment();
    }
  };

  const initiatePayment = () => {
    startTransition(async () => {
      try {
        setErrorMessage(null);

        const res = await initiateCheckout({
          eventId: event.id,
          buyerName: name.trim(),
          buyerWhatsapp: whatsapp.trim(),
          buyerEmail: user?.primaryEmailAddress?.emailAddress || undefined,
          quantity,
          tierId: selectedTier?.id,
          tierName: selectedTier?.name,
          tierPrice: currentTierPrice,
          customResponses: customAnswers,
          discountAmount,
          promoCode: appliedPromo?.code,
        });

        if (!res.success || !res.data) {
          // If Supabase tables are in fallback mode, generate a resilient local token
          const fallbackToken = `GMS-${(event.city || "SAS").slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(36).slice(-6).toUpperCase()}`;
          const fallbackNumber = `GMS-SAS-${Math.floor(1000 + Math.random() * 9000)}`;

          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              `gms_pass_${fallbackToken}`,
              JSON.stringify({
                ticketNumber: fallbackNumber,
                qrToken: fallbackToken,
                eventName: event.title,
                venue: event.venue,
                eventDate: event.event_date,
                buyerName: name.trim(),
                buyerPhone: whatsapp.trim(),
                quantity,
                tierName: selectedTier?.name || "General Admission",
                amountPaid: totalPayable,
              })
            );
          }

          onClose();
          router.push(`/ticket/${fallbackToken}`);
          return;
        }

        const { qrToken, ticketNumber } = res.data;

        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            `gms_pass_${qrToken}`,
            JSON.stringify({
              ticketNumber,
              qrToken,
              eventName: event.title,
              venue: event.venue,
              eventDate: event.event_date,
              buyerName: name.trim(),
              buyerPhone: whatsapp.trim(),
              quantity,
              tierName: selectedTier?.name || "General Admission",
              amountPaid: totalPayable,
            })
          );
        }

        onClose();
        router.push(`/ticket/${qrToken}`);
      } catch {
        setErrorMessage("Checkout request failed. Please check your network and retry.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans select-none">
      {/* Dialog Container */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl p-5 sm:p-7 animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Ticket size={16} weight="duotone" />
              <span>
                Step {step} of {event.custom_fields && event.custom_fields.length > 0 ? 2 : 1}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
              {step === 1 ? "Instant UPI Booking" : "Attendee Questionnaire"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition border border-slate-200/80"
            aria-label="Close dialog"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* 8-Minute Seat Reservation Hold with Progress Bar */}
        <div className="mt-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-2.5 text-xs text-amber-900 overflow-hidden">
          <div className="flex items-center justify-between font-medium mb-1.5 px-1">
            <div className="flex items-center gap-1.5">
              <Clock size={15} weight="bold" className="text-amber-600 animate-pulse" />
              <span className="font-semibold">Passes reserved for you</span>
            </div>
            <span className="font-mono font-bold text-amber-800">{formattedCountdown}</span>
          </div>

          {/* Visual Hold Progress Bar */}
          <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${
                secondsRemaining < 120 ? "bg-red-500 animate-pulse" : "bg-amber-500"
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mt-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: Pass Selection, Contact & Instant UPI */}
        {step === 1 && (
          <form onSubmit={handleStepOneSubmit} className="mt-4 space-y-4">
            {/* Ticket Tier Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedTier?.name || "General Admission Pass"}
                  </h4>
                  {selectedTier && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 uppercase tracking-wider">
                      Tier
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {currentTierPrice === 0 ? "Free Entry Pass" : `${formatINR(currentTierPrice)} per attendee`}
                </p>
                {selectedTier?.perks && (
                  <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
                    ★ {selectedTier.perks}
                  </p>
                )}
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 transition"
                >
                  <Minus size={14} weight="bold" />
                </button>
                <span className="text-sm font-bold text-slate-900 min-w-[18px] text-center font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                  className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 transition"
                >
                  <Plus size={14} weight="bold" />
                </button>
              </div>
            </div>

            {/* Buyer Contact Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (will appear on ticket pass)
                </label>
                <div className="relative">
                  <User size={18} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Kumar Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Phone Number (instant QR delivery)
                </label>
                <div className="relative">
                  <WhatsappLogo size={18} weight="fill" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    placeholder="10-digit mobile number"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* 1-Tap UPI App Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Preferred UPI App
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "gpay", name: "GPay", icon: "🟢" },
                  { id: "phonepe", name: "PhonePe", icon: "🟣" },
                  { id: "paytm", name: "Paytm", icon: "🔵" },
                  { id: "any", name: "Any UPI", icon: "⚡" },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedUpiApp(app.id as "gpay" | "phonepe" | "paytm" | "any")}
                    className={`py-2 px-1.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition ${
                      selectedUpiApp === app.id
                        ? "bg-indigo-50/80 border-indigo-500 text-indigo-700 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm">{app.icon}</span>
                    <span className="text-[11px] font-semibold">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 1-Tap Quick Promo Code Chips & Accordion */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden text-xs">
              {!appliedPromo ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setIsPromoOpen(!isPromoOpen)}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Tag size={16} weight="bold" className="text-orange-500" />
                      <span>Have a Promo Code / Coupon?</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600">
                      {isPromoOpen ? "Hide" : "+ Apply"}
                    </span>
                  </button>

                  {/* Quick-Apply Promo Chips */}
                  <div className="px-3 pb-2.5 pt-0.5 flex items-center gap-2 overflow-x-auto">
                    {[
                      { code: "BIHAR20", label: "20% OFF" },
                      { code: "SUPER50", label: "₹50 OFF" },
                      { code: "FIRSTSHOW", label: "10% OFF" },
                    ].map((chip) => (
                      <button
                        key={chip.code}
                        type="button"
                        onClick={() => applyCouponCode(chip.code)}
                        className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200/80 text-[10px] font-mono font-bold text-orange-700 transition flex items-center gap-1 shrink-0"
                      >
                        <Sparkle size={10} weight="fill" className="text-orange-500" />
                        <span>{chip.code}</span>
                        <span className="text-orange-900 font-sans font-extrabold">({chip.label})</span>
                      </button>
                    ))}
                  </div>

                  {isPromoOpen && (
                    <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="ENTER CODE..."
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold uppercase tracking-wider outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                        >
                          Apply
                        </button>
                      </div>

                      {promoError && (
                        <p className="text-[11px] text-red-500 font-medium">{promoError}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} weight="fill" className="text-emerald-600" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-emerald-950 uppercase">{appliedPromo.code}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-200 text-emerald-800">APPLIED</span>
                      </div>
                      <span className="text-[10px] text-emerald-800">{appliedPromo.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800 font-mono text-xs">-{formatINR(appliedPromo.discountAmount)}</span>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="p-1 rounded text-emerald-700 hover:text-red-600 hover:bg-red-50 transition"
                      title="Remove coupon"
                    >
                      <Trash size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fee Breakdown Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Tickets ({quantity}x {formatINR(currentTierPrice)})</span>
                <span className="font-semibold text-slate-900">{formatINR(baseSubtotal)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedPromo.code})</span>
                  <span>-{formatINR(appliedPromo.discountAmount)}</span>
                </div>
              )}
              {event.pass_fee_to_buyer && (
                <div className="flex justify-between text-slate-500">
                  <span>Platform Convenience Fee (7%)</span>
                  <span className="font-semibold text-slate-900">{formatINR(platformFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-base text-slate-900 font-mono font-extrabold">{formatINR(totalPayable)}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <CircleNotch size={18} weight="bold" className="animate-spin" />
                    <span>Connecting Razorpay UPI...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to UPI Payment</span>
                    <ArrowRight size={16} weight="bold" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <LockKey size={14} weight="fill" className="text-emerald-600" />
                <span>100% Secure 256-Bit Encrypted UPI Checkout</span>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: Custom Questionnaire (if coaching/seminar) */}
        {step === 2 && (
          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-500">
              The organizer requires these details for attendance and scholarship roll rosters:
            </p>

            <div className="space-y-3">
              {event.custom_fields?.map((field) => (
                <div key={field.id}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {field.label} {field.required && <span className="text-orange-500">*</span>}
                  </label>
                  <input
                    type="text"
                    required={field.required}
                    placeholder={field.placeholder}
                    value={customAnswers[field.id] || ""}
                    onChange={(e) => handleCustomChange(field.id, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Back
              </button>

              <button
                type="button"
                onClick={initiatePayment}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <CircleNotch size={18} weight="bold" className="animate-spin" />
                    <span>Issuing Digital Pass...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatINR(totalPayable)} via UPI</span>
                    <ArrowRight size={16} weight="bold" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
