"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Zap, ArrowRight } from "lucide-react";
import { Offer } from "@/types";
import { getOptimizedCloudinaryUrl } from "@/lib/imageOptimizer";

interface HeroBannerProps {
  banners: Offer[];
}

export const getBannerCategoryLink = (banner: {
  link?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}): string => {
  const rawLink = (banner.link || "").trim();
  if (
    rawLink &&
    rawLink !== "#" &&
    rawLink !== "/" &&
    rawLink !== "/?category=all"
  ) {
    return rawLink.includes("#products-section") ? rawLink : `${rawLink}#products-section`;
  }

  const text = `${banner.title || ""} ${banner.subtitle || ""} ${banner.badge || ""}`.toLowerCase();

  // Women's Fashion (Dress, শাড়ি, লেডিস, কুর্তি, মহিলা, ড্রেস, গহনা, etc.)
  if (
    /dress|women|ladies|girl|saree|shari|kurti|abaya|hijab|jewelry|jewellery|লেডিস|মহিলা|নারী|শাড়ি|থ্রি-পিস|থ্রিপিস|কুর্তি|বোরকা|হিজাব|জুয়েলারি|গহনা|কামিজ|স্কার্ট|ড্রেস/i.test(
      text
    )
  ) {
    return "/?category=womens-fashion#products-section";
  }

  // Gadgets & Electronics (গ্যাজেটস, হেডফোন, স্মার্টওয়াচ, স্পিকার, ইয়ারবাড, অডিও, ইত্যাদি)
  if (
    /gadget|electronic|headphone|earphone|earbuds|smartwatch|watch|speaker|audio|bluetooth|wireless|charger|cable|গ্যাজেট|ইলেকট্রনিক্স|ইলেকট্রনিক|হেডফোন|ইয়ারফোন|ইয়ারবাড|স্মার্টওয়াচ|ঘড়ি|স্পিকার|অডিও|ব্লুটুথ|ওয়্যারলেস|চার্জার/i.test(
      text
    )
  ) {
    return "/?category=gadgets-electronics#products-section";
  }

  // Men's Fashion (শার্ট, পাঞ্জাবি, প্যান্ট, হুডি, পুরুষ, ইত্যাদি)
  if (
    /men|gent|shirt|t-shirt|polo|panjabi|hoodie|jacket|trouser|pant|sneaker|shoes|শার্ট|টি-শার্ট|পাঞ্জাবি|পাঞ্জাবী|হুডি|জ্যাকেট|প্যান্ট|জুতা|জুতো|পুরুষ|মেনস/i.test(
      text
    )
  ) {
    return "/?category=mens-fashion#products-section";
  }

  // Home & Lifestyle (হোম, কিচেন, ফার্নিচার, ল্যাম্প, কুশন, ইত্যাদি)
  if (
    /home|lifestyle|kitchen|living|decor|cushion|bedsheet|lamp|furniture|হোম|লাইফস্টাইল|কিচেন|ডেকোর|ফার্নিচার|কুশন|চাদর|বাতি|ল্যাম্প/i.test(
      text
    )
  ) {
    return "/?category=home-lifestyle#products-section";
  }

  // Kids Zone (বাচ্চা, বেবি, খেলনা, ইত্যাদি)
  if (/kid|baby|child|toy|বাচ্চা|বেবি|খেলনা|শিশু|কিডস/i.test(text)) {
    return "/?category=kids-zone#products-section";
  }

  // Offers
  if (/offer|deal|discount|অফার|ডিল|ছাড়/i.test(text)) {
    return "/?isOffer=true#products-section";
  }

  return "/?category=all#products-section";
};

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
      title: "এক্সক্লুসিভ ফ্যাশন ও ট্রেন্ডি ড্রেস কালেকশন",
      subtitle: "নারী ও পুরুষদের প্রিমিয়াম পোশাক, ট্রেন্ডি ড্রেস ও এক্সেসরিজে স্পেশাল অফার!",
      bannerImage:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
      badge: "WOMEN'S DRESS & FASHION",
      link: "/?category=womens-fashion",
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

  const handleBannerButtonClick = () => {
    setTimeout(() => {
      const el = document.getElementById("products-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      <div className="relative h-[220px] sm:h-[350px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-rose-100 bg-slate-900 group">
        {displayBanners.map((banner, idx) => {
          const targetCategoryLink = getBannerCategoryLink(banner);

          return (
            <div
              key={banner._id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={getOptimizedCloudinaryUrl(banner.bannerImage) || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"}
                  alt={banner.title}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? undefined : "lazy"}
                  sizes="100vw"
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
                    href={targetCategoryLink}
                    onClick={handleBannerButtonClick}
                    className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 transition-all hover:gap-3 cursor-pointer"
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
          );
        })}

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
