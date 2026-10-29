"use client";

import React from "react";
import {
  MusicNotes,
  MicrophoneStage,
  Sparkle,
  GraduationCap,
  Microphone,
  Trophy,
  PersonSimpleRun,
  Cricket,
} from "@phosphor-icons/react";

interface CategoryIconItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
}

const CATEGORIES: CategoryIconItem[] = [
  {
    id: "music",
    label: "Music",
    icon: <MusicNotes size={20} weight="fill" />,
    color: "text-[#4F46E5]",
    hoverColor: "hover:bg-[#4F46E5]/10",
  },
  {
    id: "live-concert",
    label: "Live Concert",
    icon: <MicrophoneStage size={20} weight="fill" />,
    color: "text-[#F97316]",
    hoverColor: "hover:bg-[#F97316]/10",
  },
  {
    id: "cultural",
    label: "Cultural",
    icon: <Sparkle size={20} weight="fill" />,
    color: "text-[#E11D48]",
    hoverColor: "hover:bg-[#E11D48]/10",
  },
  {
    id: "college-fests",
    label: "College Fests",
    icon: <GraduationCap size={20} weight="fill" />,
    color: "text-[#7C3AED]",
    hoverColor: "hover:bg-[#7C3AED]/10",
  },
  {
    id: "comedy",
    label: "Comedy & Stand-up",
    icon: <Microphone size={20} weight="fill" />,
    color: "text-[#F59E0B]",
    hoverColor: "hover:bg-[#F59E0B]/10",
  },
  {
    id: "sports",
    label: "Sports",
    icon: <Trophy size={20} weight="fill" />,
    color: "text-[#10B981]",
    hoverColor: "hover:bg-[#10B981]/10",
  },
  {
    id: "marathon",
    label: "Marathon",
    icon: <PersonSimpleRun size={20} weight="fill" />,
    color: "text-[#06B6D4]",
    hoverColor: "hover:bg-[#06B6D4]/10",
  },
  {
    id: "cricket",
    label: "Cricket",
    icon: <Cricket size={20} weight="fill" />,
    color: "text-[#EF4444]",
    hoverColor: "hover:bg-[#EF4444]/10",
  },
];

interface CategoryIconRowProps {
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
  className?: string;
}

export default function CategoryIconRow({
  selectedCategory,
  onSelectCategory,
  className = "",
}: CategoryIconRowProps) {
  return (
    <div className={`w-full py-3 sm:py-4 ${className}`}>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(isSelected ? "" : cat.id)}
              className={`group relative shrink-0 w-28 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-1 active:scale-95 snap-start ${
                isSelected
                  ? "bg-brand-indigo/10 ring-1 ring-brand-indigo shadow-sm"
                  : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
              } ${cat.hoverColor}`}
              aria-pressed={isSelected}
              aria-label={cat.label}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "bg-brand-indigo text-white shadow-lg"
                    : "bg-slate-50 text-slate-600 group-hover:bg-slate-100"
                }`}
              >
                <span className={isSelected ? "text-white" : cat.color}>
                  {cat.icon}
                </span>
              </div>
              <span className={`text-[11px] font-semibold leading-tight text-center w-full truncate ${
                isSelected ? "text-brand-indigo" : "text-slate-700 group-hover:text-slate-900"
              }`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}