"use client";

import { useState, useTransition } from "react";
import { X, ShieldCheck, ArrowRight, Loader2, Minus, Plus } from "lucide-react";
import { EventItem } from "@/types";
import { formatINR } from "@/lib/utils";

interface CheckoutModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ event, isOpen, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [quantity, setQuantity] = useState<number>(1);
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
      setErrorMessage("Please enter a valid 10-digit WhatsApp number.");
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
        // Simulated local checkout bridge / Razorpay trigger
        // In full integration, calls /api/orders/create and opens Razorpay modal
        alert(
          `Demo Pass Booked!\nName: ${name}\nWhatsApp: ${whatsapp}\nTotal: ${formatINR(totalPayable)}\n\nRedirecting to instant pass confirmation...`
        );
        window.location.href = `/ticket/demo-${Date.now()}`;
      } catch {
        setErrorMessage("Payment initiation failed. Please try again.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-surface-card border border-surface-border rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div>
            <span className="text-[11px] font-bold text-brand-indigo uppercase tracking-wider">
              {step === 1 ? "Step 1 of 2: Attendee Info" : "Step 2 of 2: Questions"}
            </span>
            <h3 className="text-lg font-bold text-white line-clamp-1">{event.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-surface-elevated text-text-muted hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-button bg-status-danger/10 border border-status-danger/20 text-xs font-semibold text-status-danger">
            {errorMessage}
          </div>
        )}

        {/* Step 1 Form */}
        {step === 1 ? (
          <form onSubmit={handleStepOneSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Kumar"
                className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white text-sm focus:outline-none focus:border-brand-indigo transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                WhatsApp Phone Number *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-text-dim">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white text-sm focus:outline-none focus:border-brand-indigo transition"
                />
              </div>
              <p className="text-[11px] text-text-dim mt-1">
                Your QR pass will be sent directly to this WhatsApp number.
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                Number of Passes
              </label>
              <div className="flex items-center justify-between p-3 rounded-button bg-surface-elevated border border-surface-border">
                <span className="text-sm font-medium text-text-primary">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 rounded bg-surface-card text-text-muted hover:text-white transition disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="p-1 rounded bg-surface-card text-text-muted hover:text-white transition disabled:opacity-40"
                    disabled={quantity >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-3.5 rounded-button bg-surface-elevated/70 border border-surface-border/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Pass Price ({quantity}x)</span>
                <span>{formatINR(baseSubtotal)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Platform Convenience Fee</span>
                <span>{event.pass_fee_to_buyer ? formatINR(platformFee) : "₹0 (Free)"}</span>
              </div>
              <div className="pt-2 border-t border-surface-border flex justify-between font-bold text-white text-sm">
                <span>Total Payable</span>
                <span className="text-brand-saffron font-mono">{formatINR(totalPayable)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-button font-bold text-sm bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-glow transition active:scale-95 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : event.custom_fields && event.custom_fields.length > 0 ? (
                <>
                  <span>Next: Details</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay {formatINR(totalPayable)} via UPI</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Custom Questions */
          <div className="mt-5 space-y-4">
            {event.custom_fields?.map((field) => (
              <div key={field.id}>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  {field.label} {field.required && "*"}
                </label>
                <input
                  type="text"
                  required={field.required}
                  value={customAnswers[field.id] || ""}
                  onChange={(e) => handleCustomChange(field.id, e.target.value)}
                  placeholder={field.placeholder || "Enter details..."}
                  className="w-full px-3.5 py-2.5 rounded-button bg-surface-elevated border border-surface-border text-white text-sm focus:outline-none focus:border-brand-indigo transition"
                />
              </div>
            ))}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-button font-semibold text-xs bg-surface-elevated hover:bg-slate-800 text-text-muted transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={initiatePayment}
                disabled={isPending}
                className="w-2/3 py-3 rounded-button font-bold text-sm bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-glow transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay {formatINR(totalPayable)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-text-dim">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Instant WhatsApp delivery • 100% Encrypted UPI</span>
        </div>
      </div>
    </div>
  );
}

