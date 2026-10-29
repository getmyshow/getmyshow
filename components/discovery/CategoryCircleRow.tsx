"use client";

import React from "react";
import Image from "next/image";
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
  imageUrl: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "coaching",
    label: "Coaching & Seminars",
    icon: <GraduationCap size={20} weight="fill" />,
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "music",
    label: "Music & Live Concerts",
    icon: <MusicNotes size={20} weight="fill" />,
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dandiya",
    label: "Cultural & Dandiya",
    icon: <Sparkle size={20} weight="fill" />,
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "college",
    label: "College Tarang Fests",
    icon: <Confetti size={20} weight="fill" />,
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "standup",
    label: "Comedy & Stand-up",
    icon: <MicrophoneStage size={20} weight="fill" />,
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sports",
    label: "Sports, Marathon & Cricket",
    icon: <Trophy size={20} weight="fill" />,
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "food",
    label: "Food Melas & Expos",
    icon: <ForkKnife size={20} weight="fill" />,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "workshops",
    label: "Skills & Coding Bootcamps",
    icon: <Laptop size={20} weight="fill" />,
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
  },
];

interface CategoryRowProps {
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export default function CategoryCircleRow({
  selectedCategory,
  onSelectCategory,
}: CategoryRowProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E0A3C] tracking-tight">
            Explore Trending Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#6F7287] mt-0.5">
            Discover verified events across Sasaram and neighboring Bihar districts
          </p>
        </div>
        {selectedCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory?.("")}
            className="text-xs font-bold text-[#4F46E5] hover:underline"
          >
            Show All
          </button>
        )}
      </div>

      {/* Responsive Visual Category Cards: Horizontal Swipeable on Mobile, Grid on Desktop */}
      <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(isSelected ? "" : cat.id)}
              className={`group relative shrink-0 w-[130px] sm:w-auto h-24 sm:h-32 rounded-xl overflow-hidden border text-left transition-all duration-200 focus:outline-none flex flex-col justify-end p-2.5 snap-start active:scale-95 ${
                isSelected
                  ? "border-[#4F46E5] ring-2 ring-[#4F46E5] ring-offset-1 shadow-md scale-[1.02]"
                  : "border-[#DBDAE3] hover:border-[#39364F] hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Rich Stock Image Background */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.imageUrl}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Dark Vignette Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E0A3C]/90 via-[#1E0A3C]/50 to-transparent" />
              </div>

              {/* Icon & Label Content */}
              <div className="relative z-10 space-y-1">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-[#4F46E5] text-white"
                      : "bg-white/20 backdrop-blur-xs text-white group-hover:bg-[#4F46E5]"
                  }`}
                >
                  {cat.icon}
                </div>
                <div className="text-xs font-bold text-white leading-tight line-clamp-2">
                  {cat.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
