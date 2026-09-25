"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Star } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const router = useRouter();
  const { addToCart, openDirectCheckout } = useCart();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDirectCheckout(product, 1);
    router.push("/checkout");
  };

  const discountPercent =
    product.originalPrice > product.sellPrice
      ? Math.round(((product.originalPrice - product.sellPrice) / product.originalPrice) * 100)
      : 0;

  const categoryLabel: Record<string, string> = {
    electronics: "ইলেকট্রনিক্স",
    cosmetics: "কসমেটিক্স",
    fashion: "ফ্যাশন",
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-rose-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {discountPercent > 0 && (
          <span className="bg-[#df2d4d] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md">
            -{discountPercent}% ছাড়
          </span>
        )}
        {product.offerBadge && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {product.offerBadge}
          </span>
        )}
      </div>

      {/* Image Container */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative w-full pt-[95%] bg-slate-50 cursor-pointer overflow-hidden"
      >
        <Image
          src={product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500 p-2 rounded-2xl"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      {/* Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
              {categoryLabel[product.category] || product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>4.9</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 hover:text-[#df2d4d] cursor-pointer transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-3 pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900">
              ৳{product.sellPrice.toLocaleString()}
            </span>
            {product.originalPrice > product.sellPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-2.5 grid grid-cols-5 gap-1.5">
            {/* 1-Click Cash on Delivery Order Button */}
            <button
              onClick={handleBuyNow}
              className="col-span-4 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs font-bold shadow-md shadow-rose-500/20 active:scale-97 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              অর্ডার করুন
            </button>

            {/* Add to Cart Icon Button */}
            <button
              onClick={() => addToCart(product, 1)}
              className="col-span-1 flex items-center justify-center py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-slate-700 hover:text-[#df2d4d] transition-colors"
              title="কার্টে যোগ করুন"
              aria-label="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
