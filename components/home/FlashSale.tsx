"use client";

import React, { useState, useEffect } from "react";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface FlashSaleProps {
  products: Product[];
  onOpenDetails?: (product: Product) => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({ products, onOpenDetails }) => {
  // 48 hour countdown simulation
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const offerProducts = products.filter((p) => p.isOffer).slice(0, 4);

  if (offerProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-rose-50 via-amber-50/40 to-rose-50 rounded-2xl p-4 sm:p-6 border border-rose-200/80 shadow-sm">
        {/* Flash Sale Header with Countdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-rose-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#df2d4d] text-white flex items-center justify-center shadow-md animate-pulse">
              <Zap className="w-6 h-6 fill-yellow-300 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Flash Sale <span className="text-[#df2d4d]">ঝলমলে ছাড়</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                সীমিত সময়ের জন্য বিশেষ ছাড় — এখনই অর্ডার করুন!
              </p>
            </div>
          </div>

          {/* Countdown Boxes */}
          <div className="flex items-center gap-1.5 self-center sm:self-auto bg-white px-3.5 py-1.5 rounded-xl border border-rose-200 shadow-xs">
            <Clock className="w-4 h-4 text-[#df2d4d] mr-1" />
            <span className="text-xs font-bold text-slate-600 mr-1">অফারের বাকি:</span>
            <div className="bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded-md">
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
            <span className="font-bold text-rose-500">:</span>
            <div className="bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded-md">
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
            <span className="font-bold text-rose-500">:</span>
            <div className="bg-[#df2d4d] text-white font-mono font-bold text-xs px-2 py-1 rounded-md animate-pulse">
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mt-5">
          {offerProducts.map((product, idx) => (
            <ProductCard
              key={product._id}
              product={product}
              index={idx}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
