"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
} from "@phosphor-icons/react";
import { EventItem } from "@/types";
import { formatINR } from "@/lib/utils";

interface CheckoutModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  initialQuantity?: number;
}

export default function CheckoutModal({
  event,
  isOpen,
  onClose,
  initialQuantity = 1,
}: CheckoutModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [name, setName] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Pricing calculation
  const baseSubtotal = event.ticket_price * quantity;
  const platformFee = event.pass_fee_to_buyer ? Math.round(baseSubtotal * 0.07) : 0;
  const totalPayable = baseSubtotal + platformFee;

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
        // Fast local mock checkout simulation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const demoToken = `DEMO-HMAC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            `gms_pass_${demoToken}`,
            JSON.stringify({
              ticketNumber: `GMS-SAS-${Math.floor(10000 + Math.random() * 90000)}`,
              qrToken: demoToken,
              eventName: event.title,
              venue: event.venue,
              eventDate: event.event_date,
              buyerName: name,
              buyerPhone: whatsapp,
              quantity: quantity,
              amountPaid: totalPayable,
            })
          );
        }

        onClose();
        router.push(`/ticket/${demoToken}`);
      } catch (err: unknown) {
        setErrorMessage("Payment initiation timed out. Please retry.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] sm:rounded-[40px] border border-[#DBDAE3] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header & Close */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEDF2]">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#3659E3] uppercase tracking-wider">
              <Ticket size={16} weight="duotone" />
              <span>Step {step} of {event.custom_fields && event.custom_fields.length > 0 ? 2 : 1}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E0A3C] mt-0.5">
              {step === 1 ? "Instant UPI Booking" : "Attendee Questionnaire"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F8F7FA] text-[#6F7287] hover:text-[#1E0A3C] hover:bg-[#EEEDF2] flex items-center justify-center transition-colors"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: Pass Selection & Buyer Contact */}
        {step === 1 && (
          <form onSubmit={handleStepOneSubmit} className="mt-5 space-y-5">
            {/* Ticket Tier Pill Card */}
            <div className="p-4 rounded-[24px] bg-[#F8F7FA] border border-[#DBDAE3] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#1E0A3C]">General Admission Pass</h4>
                <p className="text-xs text-[#6F7287] mt-0.5">
                  {event.ticket_price === 0 ? "Free Entry Pass" : `${formatINR(event.ticket_price)} per attendee`}
                </p>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 bg-white border border-[#DBDAE3] rounded-full px-2.5 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-1 text-[#39364F] hover:text-[#1E0A3C] disabled:opacity-30"
                >
                  <Minus size={14} weight="bold" />
                </button>
                <span className="text-sm font-bold text-[#1E0A3C] min-w-[16px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                  className="p-1 text-[#39364F] hover:text-[#1E0A3C] disabled:opacity-30"
                >
                  <Plus size={14} weight="bold" />
                </button>
              </div>
            </div>

            {/* Buyer Contact Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#39364F] mb-1.5">
                  Full Name (will appear on ticket pass)
                </label>
                <div className="relative">
                  <User size={18} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F7287]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Kumar Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3] focus:ring-2 focus:ring-[#3659E3]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39364F] mb-1.5">
                  WhatsApp Phone Number (instant QR delivery)
                </label>
                <div className="relative">
                  <WhatsappLogo size={18} weight="fill" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#25D366]" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    placeholder="10-digit mobile number"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3] focus:ring-2 focus:ring-[#3659E3]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Fee Breakdown Summary */}
            <div className="p-4 rounded-2xl bg-[#F8F7FA] border border-[#DBDAE3] text-xs space-y-1.5">
              <div className="flex justify-between text-[#6F7287]">
                <span>Tickets ({quantity}x {formatINR(event.ticket_price)})</span>
                <span className="font-semibold text-[#1E0A3C]">{formatINR(baseSubtotal)}</span>
              </div>
              {event.pass_fee_to_buyer && (
                <div className="flex justify-between text-[#6F7287]">
                  <span>Platform Convenience Fee (7%)</span>
                  <span className="font-semibold text-[#1E0A3C]">{formatINR(platformFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#1E0A3C] pt-2 border-t border-[#DBDAE3]/60">
                <span>Total Amount</span>
                <span>{formatINR(totalPayable)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 rounded-[360px] bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
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

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6F7287]">
                <LockKey size={14} weight="fill" className="text-emerald-600" />
                <span>100% Secure 256-Bit Encrypted UPI Checkout</span>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: Custom Questionnaire (if coaching/seminar) */}
        {step === 2 && (
          <div className="mt-5 space-y-5">
            <p className="text-xs text-[#6F7287]">
              The organizer requires these details for attendance and scholarship roll rosters:
            </p>

            <div className="space-y-4">
              {event.custom_fields?.map((field) => (
                <div key={field.id}>
                  <label className="block text-xs font-bold text-[#39364F] mb-1.5">
                    {field.label} {field.required && <span className="text-[#F05537]">*</span>}
                  </label>
                  <input
                    type="text"
                    required={field.required}
                    placeholder={field.placeholder}
                    value={customAnswers[field.id] || ""}
                    onChange={(e) => handleCustomChange(field.id, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBDAE3] text-sm text-[#39364F] font-medium outline-none focus:border-[#3659E3] focus:ring-2 focus:ring-[#3659E3]/20 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-[360px] border border-[#DBDAE3] text-[#39364F] text-xs font-bold hover:bg-[#F8F7FA]"
              >
                Back
              </button>

              <button
                type="button"
                onClick={initiatePayment}
                disabled={isPending}
                className="flex-1 py-3.5 rounded-[360px] bg-[#3659E3] hover:bg-[#2b4ac2] text-white text-sm font-bold shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
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
