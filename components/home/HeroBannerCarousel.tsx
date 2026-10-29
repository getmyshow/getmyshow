"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CaretLeft, CaretRight, Sparkle, ArrowRight } from "@phosphor-icons/react";

interface BannerSlide {
  id: string;
  badge: string;
  badgeColor: string;
  titleLine1: string;
  titleLine2: string;
  titleColor: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: "live-music",
    badge: "LIVE IN BIHAR",
    badgeColor: "bg-[#FF70A6] text-white",
    titleLine1: "FROM POP BALLADS",
    titleLine2: "TO EMO ENCORES",
    titleColor: "bg-[#4F46E5] text-white",
    subtitle: "Discover high-energy live concerts, acoustic gigs, and musical nights across Bihar.",
    ctaText: "Explore Live Music",
    ctaLink: "#events",
    imageSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "coaching-seminar",
    badge: "FOR ASPIRANTS",
    badgeColor: "bg-[#F97316] text-white",
    titleLine1: "CRACK JEE & NEET",
    titleLine2: "WITH TOP MENTORS",
    titleColor: "bg-[#3659E3] text-white",
    subtitle: "Super 50 Talent Scholarship Test & Career Blueprint Seminar in Sasaram.",
    ctaText: "Explore Seminars",
    ctaLink: "/e/sasaram-jee-neet-scholarship-seminar-2026",
    imageSrc: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "dandiya-mahotsav",
    badge: "FESTIVALS OF BIHAR",
    badgeColor: "bg-[#E11D48] text-white",
    titleLine1: "ROHTAS DANDIYA &",
    titleLine2: "CULTURAL NIGHTS 2026",
    titleColor: "bg-[#7C3AED] text-white",
    subtitle: "The biggest Navratri celebration in Rohtas. Live Dhol, DJ, and family entertainment.",
    ctaText: "Book Festival Passes",
    ctaLink: "/e/rohtas-dandiya-mahotsav-2026",
    imageSrc: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function HeroBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = BANNERS.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Touch Swipe for mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) nextSlide();
    if (diff < -45) prevSlide();
    touchStartX.current = null;
  };

  // 5-second automatic rotation loop
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalSlides, currentSlide]);

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner decreased by 50% from all sides with compact centered container */}
      <div className="max-w-[780px] mx-auto px-3 sm:px-6 py-2 sm:py-3">
        {/* Banner Slide Frame: 50% compact height with elegant 16px radius on all devices */}
        <div className="relative w-full min-h-[140px] sm:min-h-[175px] md:min-h-[200px] rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-[#0A0D14]">
          {BANNERS.map((banner, index) => {
            const isActive = index === currentSlide;

            return (
              <div
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <div className="relative w-full h-full flex items-center">
                  {/* Background Photography with optimized contrast */}
                  <Image
                    src={banner.imageSrc}
                    alt={banner.subtitle}
                    fill
                    priority={index === 0}
                    className="object-cover object-center filter brightness-65 md:brightness-75 transition-transform duration-700"
                  />
                  {/* Subtle Cinematic Vignette for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/85 via-black/55 to-transparent" />

                  {/* Compact Content Overlay */}
                  <div className="relative z-20 max-w-md px-3.5 sm:px-6 py-2.5 sm:py-3.5 space-y-1 sm:space-y-1.5">
                    {/* Category Pill Badge */}
                    <div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${banner.badgeColor} shadow-2xs inline-flex items-center gap-1`}
                      >
                        <Sparkle size={10} weight="fill" />
                        <span>{banner.badge}</span>
                      </span>
                    </div>

                    {/* Stacked Colored Headline Blocks */}
                    <div className="space-y-0.5">
                      <div className="block">
                        <h2
                          className={`text-xs sm:text-base md:text-lg font-black uppercase tracking-tight px-2 py-0.5 rounded ${banner.titleColor} shadow-xs inline-block max-w-full leading-tight`}
                        >
                          {banner.titleLine1}
                        </h2>
                      </div>
                      <div className="block">
                        <h2
                          className={`text-xs sm:text-base md:text-lg font-black uppercase tracking-tight px-2 py-0.5 rounded ${banner.titleColor} shadow-xs inline-block max-w-full leading-tight`}
                        >
                          {banner.titleLine2}
                        </h2>
                      </div>
                    </div>

                    {/* Subtitle / Description */}
                    <p className="text-[11px] sm:text-xs text-slate-200 font-medium max-w-sm leading-tight line-clamp-1 drop-shadow-xs">
                      {banner.subtitle}
                    </p>

                    {/* Action CTA Button */}
                    <div className="pt-0.5">
                      <Link
                        href={banner.ctaLink}
                        className="inline-flex items-center gap-1 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white hover:bg-slate-100 text-[#0F172A] text-[10px] sm:text-xs font-bold shadow-xs transition-all active:scale-95 group"
                      >
                        <span>{banner.ctaText}</span>
                        <ArrowRight
                          size={12}
                          weight="bold"
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows: Compact and tucked inside */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Banner"
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white items-center justify-center transition-all border border-white/20 active:scale-90"
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Banner"
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white items-center justify-center transition-all border border-white/20 active:scale-90"
          >
            <CaretRight size={16} weight="bold" />
          </button>

          {/* Progress Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1">
            {BANNERS.map((_, i) => {
              const isSelected = i === currentSlide;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="h-1 rounded-full transition-all duration-300 overflow-hidden relative"
                  style={{
                    width: isSelected ? "18px" : "6px",
                    backgroundColor: isSelected ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {isSelected && (
                    <div
                      className="absolute inset-0 bg-white rounded-full transition-all duration-100 ease-linear"
                      style={{
                        animation: isPaused ? "none" : "progress 5s linear infinite",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
