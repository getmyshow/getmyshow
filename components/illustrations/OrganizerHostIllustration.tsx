import React from "react";

export default function OrganizerHostIllustration({ className = "w-64 h-48" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Organizer hosting event illustration"
    >
      {/* Soft floor shadow */}
      <ellipse cx="250" cy="305" rx="200" ry="24" fill="#2D1155" />

      {/* Stage platform with 12px rounded edges */}
      <rect x="70" y="260" width="360" height="40" rx="8" fill="#4F46E5" />
      <rect x="90" y="250" width="320" height="20" rx="6" fill="#F97316" />

      {/* Podium */}
      <rect x="220" y="160" width="60" height="100" rx="8" fill="#FFFFFF" />
      <rect x="210" y="150" width="80" height="16" rx="6" fill="#1E0A3C" />
      {/* Microphone */}
      <path d="M250 150V120" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
      <circle cx="250" cy="115" r="8" fill="#F97316" />

      {/* Spotlight beam */}
      <path d="M250 40L150 250H350L250 40Z" fill="url(#spotlight-gradient)" fillOpacity="0.15" />

      {/* Floating Ticket Pass on the left */}
      <g transform="translate(90, 90) rotate(-10)">
        <rect width="100" height="60" rx="8" fill="#FFFFFF" stroke="#DBDAE3" strokeWidth="2" />
        <rect x="10" y="10" width="50" height="8" rx="4" fill="#4F46E5" />
        <rect x="10" y="24" width="35" height="6" rx="3" fill="#EEEDF2" />
        <rect x="10" y="36" width="45" height="6" rx="3" fill="#EEEDF2" />
        {/* Scallop notches */}
        <circle cx="75" cy="0" r="8" fill="#1E0A3C" />
        <circle cx="75" cy="60" r="8" fill="#1E0A3C" />
        {/* Barcode/QR */}
        <rect x="78" y="14" width="14" height="32" rx="2" fill="#4F46E5" />
      </g>

      {/* Floating megaphone on the right */}
      <g transform="translate(320, 100) rotate(15)">
        <path d="M30 25L70 10V60L30 45V25Z" fill="#F97316" />
        <rect x="10" y="25" width="20" height="20" rx="4" fill="#FFFFFF" />
        <rect x="15" y="45" width="10" height="20" rx="3" fill="#4F46E5" />
        {/* Sound waves */}
        <path d="M80 20C85 27 85 43 80 50" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <path d="M90 12C98 24 98 46 90 58" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Audience celebration silhouettes */}
      <circle cx="130" cy="245" r="14" fill="#4B2A7A" />
      <path d="M110 270C110 255 150 255 150 270V280H110V270Z" fill="#4B2A7A" />

      <circle cx="370" cy="245" r="14" fill="#4B2A7A" />
      <path d="M350 270C350 255 390 255 390 270V280H350V270Z" fill="#4B2A7A" />

      <circle cx="180" cy="240" r="12" fill="#5E3894" />
      <path d="M165 265C165 252 195 252 195 265V275H165V265Z" fill="#5E3894" />

      {/* Confetti & stars */}
      <path d="M170 80L174 72L178 80L186 84L178 88L174 96L170 88L162 84L170 80Z" fill="#F97316" />
      <path d="M320 60L323 54L326 60L332 63L326 66L323 72L320 66L314 63L320 60Z" fill="#10B981" />
      <circle cx="230" cy="70" r="4" fill="#FFFFFF" opacity="0.8" />
      <circle cx="270" cy="90" r="3" fill="#F97316" />

      <defs>
        <linearGradient id="spotlight-gradient" x1="250" y1="40" x2="250" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

