"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Star } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { WhatsAppIcon, getWhatsAppUrl } from "@/components/ui/WhatsAppButton";

interface ProductCardProps {
  product: Product;
  index?: number;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const router = useRouter();
  const { addToCart, openDirectCheckout } = useCart();
  const productUrl = `/product/${product.slug || product._id}`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsRevealed(true);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: "0px 0px -30px 0px",
        }
      );

      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    } else {
      setIsRevealed(true);
    }
  }, []);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDirectCheckout(product, 1);
    router.push("/checkout");
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getWhatsAppUrl(product.name, product.sellPrice), "_blank");
  };

  const discountPercent =
    product.originalPrice > product.sellPrice
      ? Math.round(((product.originalPrice - product.sellPrice) / product.originalPrice) * 100)
      : 0;

  const categoryLabel: Record<string, string> = {
    "mens-fashion": "Men's Fashion",
    "womens-fashion": "Women's Fashion",
    "home-lifestyle": "Home & Living",
    "gadgets-electronics": "Gadgets",
    "others": "Other's",
    "kids-zone": "Kids Zone",
    "electronics": "Gadgets",
    "cosmetics": "Beauty",
    "fashion": "Fashion",
  };

  // Subtle stagger delay when scrolling into view (0.07s per column)
  const staggerDelay = (index % 4) * 0.07;

  return (
    <div
      ref={cardRef}
      className={`scroll-reveal-card bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden relative ${
        isRevealed ? "revealed" : ""
      }`}
      style={{
        transitionDelay: isRevealed ? `${staggerDelay}s` : "0s",
      }}
    >
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-[#df2d4d] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md">
            -{discountPercent}% ছাড়
          </span>
        )}
        {product.offerBadge && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {product.offerBadge}
          </span>
        )}
      </div>

      {/* WhatsApp Quick Float Icon on Image */}
      <button
        onClick={handleWhatsApp}
        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-md opacity-90 hover:opacity-100 transition-all cursor-pointer"
        title="WhatsApp এ সরাসরি মেসেজ করুন"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-4 h-4" />
      </button>

      {/* Image Container - Links to Details Page */}
      <Link
        href={productUrl}
        className="relative w-full pt-[95%] bg-slate-50 cursor-pointer overflow-hidden block"
      >
        <Image
          src={product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover p-2 rounded-2xl"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </Link>

      {/* Details */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-rose-600 bg-rose-50 px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[100px] sm:max-w-none">
              {categoryLabel[product.category] || product.category}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>4.9</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={productUrl}>
            <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 hover:text-[#df2d4d] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-slate-100 flex flex-col gap-2">
          {/* Prices */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-black text-[#df2d4d]">
              ৳{product.sellPrice.toLocaleString()}
            </span>
            {product.originalPrice > product.sellPrice && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Direct Buy & Cart Button Dual Row */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              onClick={handleBuyNow}
              className="w-full py-1.5 sm:py-2 px-1 sm:px-2 bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-3 h-3 fill-yellow-300 text-yellow-300 shrink-0" />
              <span className="truncate">অর্ডার করুন</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-full py-1.5 sm:py-2 px-1 sm:px-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#df2d4d] text-[11px] sm:text-xs font-bold rounded-xl border border-slate-200/80 hover:border-rose-200 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-3 h-3 shrink-0" />
              <span className="truncate">কার্ট</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
