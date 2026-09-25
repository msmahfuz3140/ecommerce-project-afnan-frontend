"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, ShoppingBag, X, ArrowRight } from "lucide-react";
import { Product } from "@/types";

interface ToastProps {
  toast: {
    show: boolean;
    product: Product;
    quantity: number;
  } | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose, onOpenCart }) => {
  if (!toast || !toast.show) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto animate-slide-up">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3">
        {/* Product Image or Icon */}
        <div className="relative w-12 h-12 rounded-xl bg-white/10 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
          {toast.product.images?.[0] ? (
            <Image
              src={toast.product.images[0]}
              alt={toast.product.name}
              fill
              className="object-cover"
            />
          ) : (
            <ShoppingBag className="w-6 h-6 text-rose-400" />
          )}
          <span className="absolute bottom-0 right-0 bg-[#df2d4d] text-[10px] font-black px-1 rounded-tl text-white">
            +{toast.quantity}
          </span>
        </div>

        {/* Text Info */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>কার্টে যুক্ত করা হয়েছে!</span>
          </div>
          <p className="text-xs text-slate-200 font-semibold truncate mt-0.5" title={toast.product.name}>
            {toast.product.name}
          </p>
          <p className="text-[11px] font-black text-rose-300">
            ৳{(toast.product.sellPrice * toast.quantity).toLocaleString()}
          </p>
        </div>

        {/* Action: Open Cart */}
        <button
          onClick={() => {
            onClose();
            onOpenCart();
          }}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs font-bold shadow-md shrink-0 flex items-center gap-1 transition-all"
        >
          <span>কার্ট</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss Notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
