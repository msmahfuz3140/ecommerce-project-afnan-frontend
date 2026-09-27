"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Zap, ArrowRight } from "lucide-react";
import { Offer } from "@/types";

interface HeroBannerProps {
  banners: Offer[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback banners if none loaded from DB
  const defaultBanners = [
    {
      _id: "default-1",
      title: "GAXIN MART গ্র্যান্ড সেল — ৩৫% পর্যন্ত ছাড়!",
      subtitle: "Men's Fashion, Women's Fashion, Gadgets & Lifestyle পণ্যে সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
      bannerImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
      badge: "GAXIN SPECIAL",
      link: "/?category=all",
      discountPercentage: 35,
    },
    {
      _id: "default-2",
      title: "লেটেস্ট স্মার্ট গ্যাজেটস ও ওয়্যারলেস অডিও",
      subtitle: "১০০% অরিজিনাল ব্র্যান্ড কোয়ালিটি ওয়ারেন্টি সহ দ্রুত ডেলিভারি সুবিধা। WhatsApp: 01356584296",
      bannerImage:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80",
      badge: "GADGETS FEST",
      link: "/?category=gadgets-electronics",
      discountPercentage: 25,
    },
    {
      _id: "default-3",
      title: "এক্সক্লুসিভ ফ্যাশন ও ট্রেন্ডি লাইফস্টাইল কালেকশন",
      subtitle: "পুরুষ ও নারীদের প্রিমিয়াম পোশাক, ব্যাগ ও এক্সেসরিজে স্পেশাল অফার!",
      bannerImage:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
      badge: "FASHION & LIVING",
      link: "/?category=mens-fashion",
      discountPercentage: 30,
    },
  ];

  const displayBanners = banners && banners.length > 0 ? banners : defaultBanners;

  // Auto slide every 5 seconds
  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [displayBanners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      <div className="relative h-[220px] sm:h-[350px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-rose-100 bg-slate-900 group">
        {displayBanners.map((banner, idx) => (
          <div
            key={banner._id || idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={banner.bannerImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"}
                alt={banner.title}
                fill
                priority={idx === 0}
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-12 md:px-16 max-w-2xl text-white">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#df2d4d] text-white text-[11px] sm:text-xs font-bold w-fit mb-2 sm:mb-3 shadow-md">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-300 text-yellow-300" />
                {banner.badge || "SPECIAL OFFER"}
              </div>

              <h2 className="text-lg sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug drop-shadow-md line-clamp-2">
                {banner.title}
              </h2>

              {banner.subtitle && (
                <p className="mt-1 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 drop-shadow">
                  {banner.subtitle}
                </p>
              )}

              <div className="mt-3 sm:mt-6 flex items-center gap-3">
                <Link
                  href={banner.link || "/?category=all"}
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 transition-all hover:gap-3"
                >
                  কেনাকাটা করুন
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
                <span className="hidden sm:inline-block text-xs font-medium text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500/30">
                  ✓ ক্যাশ অন ডেলিভারি সুবিধা
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        {displayBanners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-[#df2d4d] text-white backdrop-blur flex items-center justify-center transition-all opacity-75 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-[#df2d4d] text-white backdrop-blur flex items-center justify-center transition-all opacity-75 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {displayBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? "w-6 bg-[#df2d4d]" : "w-2 bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
