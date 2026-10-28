import React from "react";

export default function EmptyEventsIllustration({ className = "w-64 h-48" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="No events found illustration"
    >
      {/* Background soft shadow base */}
      <ellipse cx="250" cy="300" rx="180" ry="24" fill="#EEEDF2" />

      {/* Calendar back card */}
      <rect x="150" y="70" width="200" height="210" rx="16" fill="#FFFFFF" stroke="#DBDAE3" strokeWidth="3" />
      <path d="M150 86C150 77.1634 157.163 70 166 70H334C342.837 70 350 77.1634 350 86V120H150V86Z" fill="#F05537" />

      {/* Calendar rings */}
      <rect x="190" y="55" width="12" height="30" rx="6" fill="#1E0A3C" />
      <rect x="298" y="55" width="12" height="30" rx="6" fill="#1E0A3C" />

      {/* Calendar grid dots & lines */}
      <rect x="180" y="150" width="30" height="20" rx="4" fill="#F8F7FA" stroke="#DBDAE3" />
      <rect x="235" y="150" width="30" height="20" rx="4" fill="#F8F7FA" stroke="#DBDAE3" />
      <rect x="290" y="150" width="30" height="20" rx="4" fill="#F8F7FA" stroke="#DBDAE3" />

      <rect x="180" y="185" width="30" height="20" rx="4" fill="#F8F7FA" stroke="#DBDAE3" />
      <rect x="235" y="185" width="30" height="20" rx="4" fill="#3659E3" fillOpacity="0.15" stroke="#3659E3" />
      <rect x="290" y="185" width="30" height="20" rx="4" fill="#F8F7FA" stroke="#DBDAE3" />

      <rect x="180" y="220" width="30" height="20" rx="4" fill="#F8F7FA" stroke="#DBDAE3" />
      <rect x="235" y="220" width="30" height="20" rx="4" fill="#F8F7FA" stroke="#DBDAE3" />
      <rect x="290" y="220" width="30" height="20" rx="4" fill="#F05537" fillOpacity="0.15" stroke="#F05537" />

      {/* Magnifying Glass looking for events */}
      <circle cx="340" cy="220" r="45" fill="#FFFFFF" stroke="#1E0A3C" strokeWidth="8" />
      <path d="M375 255L420 300" stroke="#1E0A3C" strokeWidth="12" strokeLinecap="round" />
      <circle cx="340" cy="220" r="35" fill="#3659E3" fillOpacity="0.08" />

      {/* Sparkles / search stars */}
      <path d="M120 160L125 145L130 160L145 165L130 170L125 185L120 170L105 165L120 160Z" fill="#F05537" />
      <path d="M380 90L383 80L386 90L396 93L386 96L383 106L380 96L370 93L380 90Z" fill="#3659E3" />
      <circle cx="130" cy="240" r="5" fill="#F97316" />
      <circle cx="390" cy="140" r="4" fill="#10B981" />
    </svg>
  );
}

