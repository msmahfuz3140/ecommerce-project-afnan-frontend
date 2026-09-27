"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Star } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { WhatsAppIcon, getWhatsAppUrl } from "@/components/ui/WhatsAppButton";

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart, openDirectCheckout } = useCart();
  const productUrl = `/product/${product.slug || product._id}`;

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

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-rose-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
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
        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-md opacity-90 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
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
          className="object-cover group-hover:scale-108 transition-transform duration-500 p-2 rounded-2xl"
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

          {/* Title - Fixed height so all cards align perfectly */}
          <Link
            href={productUrl}
            className="block font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 h-8 sm:h-10 hover:text-[#df2d4d] cursor-pointer transition-colors leading-tight sm:leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-2 sm:mt-3 pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-sm sm:text-lg font-black text-slate-900">
              ৳{product.sellPrice.toLocaleString()}
            </span>
            {product.originalPrice > product.sellPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action Buttons: Order, WhatsApp, Cart */}
          <div className="mt-2 flex items-center gap-1 sm:gap-1.5">
            {/* 1-Click Cash on Delivery Order Button */}
            <button
              onClick={handleBuyNow}
              className="flex-1 min-w-0 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-[11px] sm:text-xs font-black shadow-md shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-300 text-yellow-300 shrink-0" />
              <span className="truncate">অর্ডার করুন</span>
            </button>

            {/* Direct WhatsApp Button */}
            <button
              onClick={handleWhatsApp}
              className="p-1.5 sm:p-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-all cursor-pointer border border-[#25D366]/20 shrink-0"
              title="WhatsApp এ অর্ডার বা প্রশ্ন করুন"
              aria-label="WhatsApp Order"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Add to Cart Icon Button */}
            <button
              onClick={() => addToCart(product, 1)}
              className="p-1.5 sm:p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-slate-700 hover:text-[#df2d4d] transition-colors cursor-pointer shrink-0"
              title="কার্টে যোগ করুন"
              aria-label="Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
