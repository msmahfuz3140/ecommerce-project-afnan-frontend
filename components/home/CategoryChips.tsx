"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Zap, Sparkles, Shirt, Flame, Layers } from "lucide-react";

interface CategoryChipsProps {
  activeCategory: string;
  isOfferFilter?: boolean;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeCategory,
  isOfferFilter = false,
}) => {
  const router = useRouter();

  const categories = [
    { id: "all", name: "সকল পণ্য (All)", icon: Layers, color: "text-slate-700" },
    { id: "electronics", name: "ইলেকট্রনিক্স (Electronics)", icon: Zap, color: "text-blue-600" },
    { id: "cosmetics", name: "কসমেটিক্স (Cosmetics)", icon: Sparkles, color: "text-pink-600" },
    { id: "fashion", name: "ফ্যাশন ও লাইফস্টাইল (Fashion)", icon: Shirt, color: "text-amber-600" },
    { id: "offers", name: "হট অফার (Special Offers)", icon: Flame, color: "text-[#df2d4d]" },
  ];

  const handleSelect = (id: string) => {
    if (id === "offers") {
      router.push("/?isOffer=true");
    } else if (id === "all") {
      router.push("/");
    } else {
      router.push(`/?category=${id}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected =
            (cat.id === "offers" && isOfferFilter) ||
            (!isOfferFilter && (activeCategory === cat.id || (!activeCategory && cat.id === "all")));

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 border shadow-xs ${
                isSelected
                  ? "bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] text-white border-transparent shadow-md shadow-rose-500/20 scale-102"
                  : "bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-white" : cat.color}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
