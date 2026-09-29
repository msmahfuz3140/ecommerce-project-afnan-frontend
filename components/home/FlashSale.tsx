"use client";

import React, { useState, useEffect } from "react";
import { Zap, Clock } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface FlashSaleProps {
  products: Product[];
  onOpenDetails?: (product: Product) => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({ products, onOpenDetails }) => {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products that have isOffer === true AND (no offerEndTime OR offerEndTime > now)
  const activeOfferProducts = products.filter((p) => {
    if (!p.isOffer) return false;
    if (p.offerEndTime) {
      const end = new Date(p.offerEndTime).getTime();
      if (!isNaN(end) && end <= now) return false;
    }
    return true;
  });

  const offerProducts = activeOfferProducts.slice(0, 4);

  if (offerProducts.length === 0) return null;

  // Find nearest expiration time among active offer products
  let targetEndTime: number | null = null;
  for (const p of offerProducts) {
    if (p.offerEndTime) {
      const end = new Date(p.offerEndTime).getTime();
      if (!isNaN(end) && end > now) {
        if (targetEndTime === null || end < targetEndTime) {
          targetEndTime = end;
        }
      }
    }
  }

  // Calculate real remaining time
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (targetEndTime) {
    const diff = Math.max(0, targetEndTime - now);
    days = Math.floor(diff / (1000 * 60 * 60 * 24));
    hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    minutes = Math.floor((diff / (1000 * 60)) % 60);
    seconds = Math.floor((diff / 1000) % 60);
  } else {
    // If no explicit end time is set, fallback to end of current day (midnight)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = Math.max(0, endOfDay.getTime() - now);
    hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    minutes = Math.floor((diff / (1000 * 60)) % 60);
    seconds = Math.floor((diff / 1000) % 60);
  }

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

          {/* Real Countdown Boxes */}
          <div className="flex items-center gap-1.5 self-center sm:self-auto bg-white px-3.5 py-1.5 rounded-xl border border-rose-200 shadow-xs">
            <Clock className="w-4 h-4 text-[#df2d4d] mr-1" />
            <span className="text-xs font-bold text-slate-600 mr-1">অফারের বাকি:</span>
            {days > 0 && (
              <>
                <div className="bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded-md">
                  {String(days).padStart(2, "0")} দিন
                </div>
                <span className="font-bold text-rose-500">:</span>
              </>
            )}
            <div className="bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded-md">
              {String(hours).padStart(2, "0")}
            </div>
            <span className="font-bold text-rose-500">:</span>
            <div className="bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded-md">
              {String(minutes).padStart(2, "0")}
            </div>
            <span className="font-bold text-rose-500">:</span>
            <div className="bg-[#df2d4d] text-white font-mono font-bold text-xs px-2 py-1 rounded-md animate-pulse">
              {String(seconds).padStart(2, "0")}
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
