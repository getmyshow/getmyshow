"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { SparklesIcon } from "lucide-react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

import { Badge } from "@/components/ui/badge";

export interface CarouselItem {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  href?: string;
}

export interface CarouselProps {
  images: CarouselItem[];
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
  badgeText?: string;
  heading?: string;
  description?: string;
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 2500,
  showPagination = true,
  showNavigation = true,
  badgeText = "Featured Highlights",
  heading = "Card Carousel",
  description = "Seamless images carousel animation.",
}) => {
  const css = `
  .swiper {
    width: 100%;
    padding-bottom: 50px;
  }
  
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
  }
  
  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right {
    background: none;
  }
  
  .swiper-pagination-bullet-active {
    background: #4F46E5 !important;
  }
  `;

  return (
    <section className="w-full space-y-4">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-4xl rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-t-[44px]">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/5 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-4">
          <Badge
            variant="outline"
            className="absolute left-4 top-6 rounded-[14px] border border-black/10 bg-white/80 backdrop-blur-xs text-xs font-semibold md:left-6 flex items-center gap-1.5"
          >
            <SparklesIcon className="w-3.5 h-3.5 fill-[#EEBDE0] stroke-1 text-neutral-800" />
            <span>{badgeText}</span>
          </Badge>
          <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-start">
            <div className="flex gap-2">
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl text-[#0F172A] font-bold tracking-tight">
                  {heading}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
                spaceBetween={50}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={images.length > 2}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={showPagination ? { clickable: true } : false}
                navigation={
                  showNavigation
                    ? {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }
                    : undefined
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full rounded-3xl overflow-hidden shadow-lg border border-black/5 bg-white">
                      <div className="relative aspect-[4/5] w-full">
                        <Image
                          src={image.src}
                          fill
                          className="object-cover rounded-2xl"
                          alt={image.alt}
                          sizes="(max-width: 768px) 280px, 320px"
                        />
                      </div>
                      {(image.title || image.subtitle) && (
                        <div className="p-3 bg-white">
                          {image.title && (
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {image.title}
                            </h4>
                          )}
                          {image.subtitle && (
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {image.subtitle}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;
