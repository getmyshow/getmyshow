"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  CaretLeft,
  PencilSimple,
  Camera,
  MapPin,
  CheckCircle,
  Plus,
  Trash,
  Info,
  X,
  User,
} from "@phosphor-icons/react";

interface SavedAddress {
  id: string;
  email: string;
  line1: string;
  line2?: string;
  landmark?: string;
  pinCode: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  // Contact State
  const [mobileNumber, setMobileNumber] = useState("");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Personal Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [identity, setIdentity] = useState<"woman" | "man" | null>(null);
  const [isMarried, setIsMarried] = useState<"yes" | "no" | null>(null);

  // Address State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // New Address Form State
  const [newAddrEmail, setNewAddrEmail] = useState("");
  const [newAddrLine1, setNewAddrLine1] = useState("");
  const [newAddrLine2, setNewAddrLine2] = useState("");
  const [newAddrLandmark, setNewAddrLandmark] = useState("");
  const [newAddrPin, setNewAddrPin] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("Sasaram");
  const [newAddrState, setNewAddrState] = useState("Bihar");

  // Save State Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Populate from Clerk + localStorage
  useEffect(() => {
    if (isSignedIn && user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      if (user.primaryEmailAddress?.emailAddress) {
        setEmailAddress(user.primaryEmailAddress.emailAddress);
        setNewAddrEmail(user.primaryEmailAddress.emailAddress);
      }
      if (user.primaryPhoneNumber?.phoneNumber) {
        setMobileNumber(user.primaryPhoneNumber.phoneNumber);
      }

      // Read unsafeMetadata if previously saved
      const meta = user.unsafeMetadata as Record<string, any> | undefined;
      if (meta) {
        if (meta.birthday) setBirthday(meta.birthday);
        if (meta.identity) setIdentity(meta.identity);
        if (meta.isMarried) setIsMarried(meta.isMarried);
        if (meta.customPhone && !mobileNumber) setMobileNumber(meta.customPhone);
      }
    }

    // Read saved addresses from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gms_saved_addresses");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setSavedAddresses(parsed);
        } catch {}
      }

      const localProfile = localStorage.getItem("gms_user_profile");
      if (localProfile) {
        try {
          const p = JSON.parse(localProfile);
          if (p.firstName && !firstName) setFirstName(p.firstName);
          if (p.lastName && !lastName) setLastName(p.lastName);
          if (p.birthday) setBirthday(p.birthday);
          if (p.identity) setIdentity(p.identity);
          if (p.isMarried) setIsMarried(p.isMarried);
          if (p.mobileNumber && !mobileNumber) setMobileNumber(p.mobileNumber);
          if (p.emailAddress && !emailAddress) setEmailAddress(p.emailAddress);
        } catch {}
      }
    }
  }, [isSignedIn, user]);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine1.trim() || !newAddrPin.trim() || !newAddrCity.trim()) {
      alert("Please enter Address Line 1, Pin Code, and City");
      return;
    }

    if (!/^\d{6}$/.test(newAddrPin.trim())) {
      alert("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      email: newAddrEmail.trim() || emailAddress,
      line1: newAddrLine1.trim(),
      line2: newAddrLine2.trim() || undefined,
      landmark: newAddrLandmark.trim() || undefined,
      pinCode: newAddrPin.trim(),
      city: newAddrCity.trim(),
      state: newAddrState.trim(),
      isDefault: savedAddresses.length === 0,
    };

    const updated = [...savedAddresses, newAddr];
    setSavedAddresses(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("gms_saved_addresses", JSON.stringify(updated));
    }

    // Reset Form
    setNewAddrLine1("");
    setNewAddrLine2("");
    setNewAddrLandmark("");
    setNewAddrPin("");
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("gms_saved_addresses", JSON.stringify(updated));
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Save to Clerk if signed in
      if (isSignedIn && user) {
        await user.update({
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          unsafeMetadata: {
            birthday,
            identity,
            isMarried,
            customPhone: mobileNumber,
          },
        });
      }

      // 2. Persist locally for immediate reactivity
      if (typeof window !== "undefined") {
        const profileData = {
          firstName,
          lastName,
          birthday,
          identity,
          isMarried,
          mobileNumber,
          emailAddress,
        };
        localStorage.setItem("gms_user_profile", JSON.stringify(profileData));
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push("/profile");
      }, 1000);
    } catch (err: any) {
      console.warn("Error saving profile to Clerk:", err);
      // Fallback to local storage persistence
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "gms_user_profile",
          JSON.stringify({ firstName, lastName, birthday, identity, isMarried, mobileNumber, emailAddress })
        );
      }
      setSaveSuccess(true);
      setTimeout(() => router.push("/profile"), 1000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5FA] pb-32 font-sans">
      {/* 1. Header Bar matching reference */}
      <div className="h-14 px-4 bg-white border-b border-slate-200/80 sticky top-0 z-40 flex items-center justify-between">
        <Link
          href="/profile"
          className="p-1.5 -ml-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Back"
        >
          <CaretLeft size={22} weight="bold" />
        </Link>

        <h1 className="text-base font-bold text-[#0F172A] tracking-tight">
          Edit Profile
        </h1>

        <div className="w-8" />
      </div>

      <div className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        {/* 2. Photo / Avatar Banner matching reference */}
        <div className="bg-[#182235] rounded-2xl p-6 text-center text-white shadow-xs flex flex-col items-center justify-center space-y-2">
          <div className="relative group">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={firstName || "User"}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-white/20 text-slate-400 flex items-center justify-center">
                <User size={40} weight="regular" />
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera size={22} className="text-white" />
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-300">
            {user?.imageUrl ? "Change Avatar" : "Add Photo"}
          </span>
        </div>

        {/* 3. Contact Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          {/* Mobile Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Mobile Number
              </label>
              <button
                type="button"
                onClick={() => setIsEditingPhone(!isEditingPhone)}
                className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
              >
                <PencilSimple size={13} weight="bold" />
                <span>{isEditingPhone ? "Done" : "Edit"}</span>
              </button>
            </div>
            {isEditingPhone ? (
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 - 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:border-[#4F46E5] outline-none"
              />
            ) : (
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700">
                {mobileNumber || "+91 - Add your WhatsApp number"}
              </div>
            )}
          </div>

          {/* Email Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Email Address
              </label>
              <button
                type="button"
                onClick={() => setIsEditingEmail(!isEditingEmail)}
                className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
              >
                <PencilSimple size={13} weight="bold" />
                <span>{isEditingEmail ? "Done" : "Edit"}</span>
              </button>
            </div>
            {isEditingEmail ? (
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Get tickets on Email"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:border-[#4F46E5] outline-none"
              />
            ) : (
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700">
                {emailAddress || "Get tickets on Email"}
              </div>
            )}
          </div>
        </div>

        {/* 4. Personal Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            Personal Details
          </h2>

          {/* First Name & Last Name */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name here"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name here"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:border-[#4F46E5] outline-none"
              />
            </div>
          </div>

          {/* Birthday (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Birthday (Optional)
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:border-[#4F46E5] outline-none bg-white"
            />
          </div>

          {/* Identity (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Identity (Optional)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIdentity(identity === "woman" ? null : "woman")}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                  identity === "woman"
                    ? "border-[#4F46E5] bg-indigo-50 text-[#4F46E5] ring-2 ring-[#4F46E5]/15"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Woman
              </button>
              <button
                type="button"
                onClick={() => setIdentity(identity === "man" ? null : "man")}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                  identity === "man"
                    ? "border-[#4F46E5] bg-indigo-50 text-[#4F46E5] ring-2 ring-[#4F46E5]/15"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Man
              </button>
            </div>
          </div>

          {/* Married? (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Married ? (Optional)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsMarried(isMarried === "yes" ? null : "yes")}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                  isMarried === "yes"
                    ? "border-[#4F46E5] bg-indigo-50 text-[#4F46E5] ring-2 ring-[#4F46E5]/15"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIsMarried(isMarried === "no" ? null : "no")}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                  isMarried === "no"
                    ? "border-[#4F46E5] bg-indigo-50 text-[#4F46E5] ring-2 ring-[#4F46E5]/15"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* 5. Your Saved Addresses */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Your Saved Addresses
            </h2>
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(true)}
              className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
            >
              <Plus size={14} weight="bold" />
              <span>Add New</span>
            </button>
          </div>

          {/* Saved Address Cards */}
          {savedAddresses.length > 0 ? (
            <div className="space-y-2.5">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    {addr.landmark && (
                      <p className="text-slate-500 text-[11px]">Near {addr.landmark}</p>
                    )}
                    <p className="font-medium text-[#4F46E5]">
                      {addr.city}, {addr.state} - {addr.pinCode}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white transition"
                    aria-label="Delete address"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(true)}
              className="w-full p-4 rounded-xl border border-dashed border-slate-300 hover:border-[#4F46E5] text-left flex items-center justify-between group transition-colors"
            >
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#4F46E5]">
                Add New Address
              </span>
              <span className="text-xs font-bold text-[#4F46E5]">→</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <Info size={14} className="shrink-0" />
            <span>Supports only Indian pin codes & mobile numbers.</span>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-center text-[11px] text-slate-400 px-4">
          By proceeding, I agree to{" "}
          <Link href="/terms" className="text-[#4F46E5] underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#4F46E5] underline">
            Privacy Policy
          </Link>
        </p>
      </div>

      {/* 6. Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <span>Saving Changes...</span>
            ) : saveSuccess ? (
              <>
                <CheckCircle size={18} weight="fill" />
                <span>Profile Saved Successfully!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>

      {/* 7. Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[1200] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Add New Address
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email ID *
                </label>
                <input
                  type="email"
                  required
                  value={newAddrEmail}
                  onChange={(e) => setNewAddrEmail(e.target.value)}
                  placeholder="Enter Email ID"
                  className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={newAddrLine1}
                  onChange={(e) => setNewAddrLine1(e.target.value)}
                  placeholder="House/Flat No., Building Name, Street"
                  className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={newAddrLine2}
                  onChange={(e) => setNewAddrLine2(e.target.value)}
                  placeholder="Area, Colony, Road"
                  className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={newAddrLandmark}
                    onChange={(e) => setNewAddrLandmark(e.target.value)}
                    placeholder="e.g. Near Tara Chandi Temple"
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#4F46E5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pin Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddrPin}
                    onChange={(e) => setNewAddrPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit PIN"
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    placeholder="e.g. Sasaram"
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#4F46E5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs shadow-md transition"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
