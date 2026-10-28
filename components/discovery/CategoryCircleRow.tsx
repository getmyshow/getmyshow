"use client";

import React from "react";
import {
  GraduationCap,
  MusicNotes,
  Sparkle,
  Confetti,
  MicrophoneStage,
  Trophy,
  ForkKnife,
  Laptop,
} from "@phosphor-icons/react";

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  { id: "coaching", label: "Coaching", icon: <GraduationCap size={32} weight="duotone" /> },
  { id: "music", label: "Music & Live", icon: <MusicNotes size={32} weight="duotone" /> },
  { id: "dandiya", label: "Cultural Fest", icon: <Sparkle size={32} weight="duotone" /> },
  { id: "college", label: "College Fests", icon: <Confetti size={32} weight="duotone" /> },
  { id: "standup", label: "Comedy & Talks", icon: <MicrophoneStage size={32} weight="duotone" /> },
  { id: "sports", label: "Sports & 10K", icon: <Trophy size={32} weight="duotone" /> },
  { id: "food", label: "Food & Melas", icon: <ForkKnife size={32} weight="duotone" /> },
  { id: "workshops", label: "Workshops", icon: <Laptop size={32} weight="duotone" /> },
];

interface CategoryCircleRowProps {
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export default function CategoryCircleRow({
  selectedCategory,
  onSelectCategory,
}: CategoryCircleRowProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar pb-3 px-2 justify-start md:justify-center">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(isSelected ? "" : cat.id)}
              className="group flex flex-col items-center gap-2.5 shrink-0 focus:outline-none transition-transform active:scale-95"
            >
              {/* 80px Circular Icon Container */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 border ${
                  isSelected
                    ? "bg-[#3659E3] text-white border-[#3659E3] shadow-md scale-105"
                    : "bg-white text-[#39364F] border-[#DBDAE3] group-hover:border-[#3659E3] group-hover:text-[#3659E3] group-hover:shadow-sm"
                }`}
              >
                {cat.icon}
              </div>

              {/* 14px Category Label */}
              <span
                className={`text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                  isSelected
                    ? "text-[#3659E3] font-bold"
                    : "text-[#39364F] group-hover:text-[#1E0A3C]"
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
