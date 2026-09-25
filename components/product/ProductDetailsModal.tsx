"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Zap, ShoppingCart, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
}) => {
  const { addToCart, openDirectCheckout } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discountPercent =
    product.originalPrice > product.sellPrice
      ? Math.round(((product.originalPrice - product.sellPrice) / product.originalPrice) * 100)
      : 0;

  const handleBuyNow = () => {
    onClose();
    openDirectCheckout(product, quantity);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-[#df2d4d] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Images Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#df2d4d] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                  -{discountPercent}% ছাড়
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${
                      selectedImageIndex === i ? "border-[#df2d4d]" : "border-slate-200"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-500" />
                <span>ঢাকাতে ২ দিন, ঢাকার বাইরে ৩-৫ দিনে ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>৭ দিনের ফ্রি সহজ রিটার্ন ও পরিবর্তন পলিসি</span>
              </div>
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>
                <h2 className="mt-2 text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#df2d4d]">
                  ৳{product.sellPrice.toLocaleString()}
                </span>
                {product.originalPrice > product.sellPrice && (
                  <span className="text-base text-slate-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  ইন স্টক ({product.stock} টি অবশিষ্ট)
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/60">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    স্পেসিফিকেশন (Specifications)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-slate-200/50 pb-1">
                        <span className="text-slate-500">{key}:</span>
                        <span className="font-semibold text-slate-800">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Changer */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-slate-700">পরিমাণ:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-bold text-sm text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white font-extrabold text-sm shadow-lg shadow-rose-500/30 active:scale-97 transition-all"
              >
                <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)
              </button>

              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl border-2 border-rose-300 hover:bg-rose-50 text-slate-800 font-bold text-sm transition-colors"
              >
                <ShoppingCart className="w-4 h-4 text-[#df2d4d]" />
                কার্টে যোগ করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
