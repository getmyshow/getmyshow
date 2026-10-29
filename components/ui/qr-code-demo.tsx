"use client";

import React from "react";
import { QRCode } from "@/components/ui/qr-code";

export default function QRCodeDemo() {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-sm w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          <span>Instant UPI Gate Pass</span>
        </div>

        <QRCode
          value="https://getmyshow.in/ticket/GMS-SAS-2026-DEMO"
          size={180}
          variant="rounded"
          color="#0F172A"
          background="#FFFFFF"
          reveal="load"
          revealDuration={900}
        />

        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900">Cryptographic Gate QR</p>
          <p className="text-xs text-slate-500">Scan at entrance for instantaneous gate validation</p>
        </div>
      </div>
    </div>
  );
}
