import React from "react";

export default function CheckoutSuccessIllustration({ className = "w-48 h-36" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ticket confirmed illustration"
    >
      <ellipse cx="200" cy="270" rx="140" ry="18" fill="#EEEDF2" />

      {/* Modern Smartphone */}
      <rect x="130" y="30" width="140" height="230" rx="20" fill="#1E0A3C" stroke="#39364F" strokeWidth="4" />
      <rect x="138" y="45" width="124" height="200" rx="14" fill="#FFFFFF" />

      {/* Screen notch / speaker */}
      <rect x="180" y="38" width="40" height="4" rx="2" fill="#6F7287" />

      {/* Ticket Pass on Screen */}
      <rect x="148" y="60" width="104" height="135" rx="10" fill="#F8F7FA" stroke="#DBDAE3" strokeWidth="1.5" />
      <rect x="148" y="60" width="104" height="30" rx="10" fill="#4F46E5" />

      {/* Scallop waist notches on phone ticket */}
      <circle cx="148" cy="125" r="7" fill="#FFFFFF" />
      <circle cx="252" cy="125" r="7" fill="#FFFFFF" />
      <line x1="155" y1="125" x2="245" y2="125" stroke="#DBDAE3" strokeDasharray="3 3" />

      {/* QR code on screen ticket */}
      <rect x="180" y="135" width="40" height="40" rx="4" fill="#1E0A3C" />
      <rect x="186" y="141" width="10" height="10" fill="#FFFFFF" />
      <rect x="204" y="141" width="10" height="10" fill="#FFFFFF" />
      <rect x="186" y="159" width="10" height="10" fill="#FFFFFF" />
      <rect x="202" y="157" width="14" height="14" fill="#F97316" />

      {/* Green Success Badge */}
      <circle cx="200" cy="210" r="18" fill="#10B981" />
      <path d="M192 210L197 215L208 204" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Floating party sparkles */}
      <path d="M90 90L93 82L96 90L104 93L96 96L93 104L90 96L82 93L90 90Z" fill="#F97316" />
      <path d="M300 70L303 62L306 70L314 73L306 76L303 84L300 76L292 73L300 70Z" fill="#3659E3" />
      <circle cx="100" cy="160" r="5" fill="#10B981" />
      <circle cx="295" cy="150" r="6" fill="#F97316" />
    </svg>
  );
}

