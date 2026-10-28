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
  useDirectImage?: boolean;
}

const BANNERS: BannerSlide[] = [
  {
    id: "live-music",
    badge: "GET INTO IT",
    badgeColor: "bg-[#FF70A6] text-white",
    titleLine1: "FROM POP BALLADS",
    titleLine2: "TO EMO ENCORES",
    titleColor: "bg-[#708BFF] text-white",
    subtitle: "Discover high-energy live concerts, acoustic gigs, and musical nights across Bihar.",
    ctaText: "Get Into Live Music",
    ctaLink: "#events",
    imageSrc: "/banners/banner-live-music.png",
    useDirectImage: true,
  },
  {
    id: "coaching-seminar",
    badge: "FOR ASPIRANTS",
    badgeColor: "bg-[#F97316] text-white",
    titleLine1: "CRACK JEE & NEET",
    titleLine2: "WITH TOP MENTORS",
    titleColor: "bg-[#3659E3] text-white",
    subtitle: "Super 50 Talent Scholarship Test & Career Blueprint Seminar in Sasaram.",
    ctaText: "Explore Career Seminars",
    ctaLink: "/e/sasaram-jee-neet-scholarship-seminar-2026",
    imageSrc: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop",
    useDirectImage: false,
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
    useDirectImage: false,
  },
];

export default function HeroBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = BANNERS.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
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
      className="relative w-full bg-[#1E0A3C] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Banner Slide Frame */}
        <div className="relative w-full min-h-[320px] sm:min-h-[380px] md:min-h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0F0521]">
          {BANNERS.map((banner, index) => {
            const isActive = index === currentSlide;

            return (
              <div
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {banner.useDirectImage ? (
                  /* Banner 1: User's provided graphic representation */
                  <Link
                    href={banner.ctaLink}
                    className="relative block w-full h-full group cursor-pointer"
                  >
                    <Image
                      src={banner.imageSrc}
                      alt="From Pop Ballads to Emo Encores - Live Music"
                      fill
                      priority={index === 0}
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    {/* Subtle edge gradient to blend seamlessly */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                    
                    {/* Mobile interactive pill overlay for small touch targets */}
                    <div className="absolute bottom-4 left-4 sm:hidden z-20">
                      <span className="px-4 py-2 rounded-lg bg-white text-[#1E0A3C] text-xs font-bold shadow-md flex items-center gap-1.5">
                        <span>Get Into Live Music</span>
                        <ArrowRight size={14} weight="bold" />
                      </span>
                    </div>
                  </Link>
                ) : (
                  /* Banners 2 & 3: Matching Eventbrite Multi-block Banner Aesthetic */
                  <div className="relative w-full h-full flex items-center">
                    {/* Background Photography */}
                    <Image
                      src={banner.imageSrc}
                      alt={banner.subtitle}
                      fill
                      priority={false}
                      className="object-cover object-center filter brightness-60 md:brightness-75 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1E0A3C]/95 via-[#1E0A3C]/75 to-transparent" />

                    {/* Content Overlays matching Eventbrite Hero Typography */}
                    <div className="relative z-20 max-w-2xl px-6 sm:px-12 py-8 space-y-4">
                      {/* Pill Badge */}
                      <div className="inline-block">
                        <span
                          className={`px-3 py-1 rounded-md text-[11px] sm:text-xs font-extrabold uppercase tracking-wider ${banner.badgeColor} shadow-xs inline-flex items-center gap-1.5`}
                        >
                          <Sparkle size={13} weight="fill" />
                          <span>{banner.badge}</span>
                        </span>
                      </div>

                      {/* Stacked Colored Headline Blocks */}
                      <div className="space-y-1 sm:space-y-2">
                        <div className="inline-block">
                          <h2
                            className={`text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight px-3 sm:px-4 py-1 sm:py-1.5 rounded-md ${banner.titleColor} shadow-md`}
                          >
                            {banner.titleLine1}
                          </h2>
                        </div>
                        <br />
                        <div className="inline-block">
                          <h2
                            className={`text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight px-3 sm:px-4 py-1 sm:py-1.5 rounded-md ${banner.titleColor} shadow-md`}
                          >
                            {banner.titleLine2}
                          </h2>
                        </div>
                      </div>

                      {/* Subtitle / Description */}
                      <p className="text-sm sm:text-base text-[#DBDAE3] font-medium max-w-lg leading-relaxed drop-shadow-sm">
                        {banner.subtitle}
                      </p>

                      {/* Action CTA Button (Rectangular 8px Curved Radius - White/Pillow Style) */}
                      <div className="pt-2">
                        <Link
                          href={banner.ctaLink}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-[#F8F7FA] text-[#1E0A3C] text-sm font-extrabold shadow-lg transition-all active:scale-95 group"
                        >
                          <span>{banner.ctaText}</span>
                          <ArrowRight
                            size={16}
                            weight="bold"
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Navigation Arrows (Rectangular with 8px radius) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Banner"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-lg bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20 active:scale-90"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-lg bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20 active:scale-90"
          >
            <CaretRight size={20} weight="bold" />
          </button>

          {/* 3 Progress Bars / Indicators with 5-second interval feedback */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {BANNERS.map((_, i) => {
              const isSelected = i === currentSlide;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="h-2 rounded-full transition-all duration-300 overflow-hidden relative"
                  style={{
                    width: isSelected ? "36px" : "10px",
                    backgroundColor: isSelected ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.25)",
                  }}
                >
                  {isSelected && (
                    <div
                      key={`progress-${currentSlide}-${isPaused}`}
                      className={`h-full bg-white rounded-full ${
                        !isPaused ? "animate-banner-progress" : "w-full"
                      }`}
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

