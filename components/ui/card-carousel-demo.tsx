"use client";

import React from "react";
import { CardCarousel } from "@/components/ui/card-carousel";

export default function CardCarouselDemo() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      alt: "Concert Lights & Music Night",
      title: "Sasaram Music Festival 2026",
      subtitle: "Live at Sasaram Stadium • ₹199 onwards",
    },
    {
      src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
      alt: "Tech Conference & Startup Meet",
      title: "Bihar Student & Tech Summit",
      subtitle: "Sardar Patel Hall • Career & Guidance",
    },
    {
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
      alt: "Cultural Folk & Fest",
      title: "Bhojpuri Gaurav Cultural Night",
      subtitle: "Dehri Open Grounds • Entry Passes",
    },
    {
      src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop",
      alt: "DJ EDM Fiesta",
      title: "Campus DJ EDM Extravaganza",
      subtitle: "Engineering College Ground • Sasaram",
    },
  ];

  return (
    <div className="w-full py-6">
      <CardCarousel
        images={images}
        autoplayDelay={2500}
        showPagination={true}
        showNavigation={true}
        badgeText="Trending Bihar Events"
        heading="Spotlight Shows & Events"
        description="Swipe or let it roll through the hottest upcoming box-office events in your region."
      />
    </div>
  );
}
