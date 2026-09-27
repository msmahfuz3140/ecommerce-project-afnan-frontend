"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  Shirt,
  Sparkles,
  Home,
  Smartphone,
  LayoutGrid,
  Baby,
  Flame,
} from "lucide-react";

interface CategoryChipsProps {
  activeCategory: string;
  isOfferFilter?: boolean;
}

export const CATEGORIES_LIST = [
  {
    id: "all",
    name: "All Products",
    bnName: "সকল পণ্য",
    icon: Layers,
    color: "from-slate-700 to-slate-900",
    iconColor: "text-slate-700",
    bgHover: "hover:border-slate-400",
  },
  {
    id: "mens-fashion",
    name: "Men's Fashion",
    bnName: "পুরুষদের ফ্যাশন",
    icon: Shirt,
    color: "from-blue-600 to-indigo-700",
    iconColor: "text-blue-600",
    bgHover: "hover:border-blue-300",
  },
  {
    id: "womens-fashion",
    name: "Women's Fashion",
    bnName: "মহিলাদের ফ্যাশন",
    icon: Sparkles,
    color: "from-pink-500 to-rose-600",
    iconColor: "text-pink-600",
    bgHover: "hover:border-pink-300",
  },
  {
    id: "home-lifestyle",
    name: "Home & Lifestyle",
    bnName: "হোম ও লাইফস্টাইল",
    icon: Home,
    color: "from-amber-500 to-orange-600",
    iconColor: "text-amber-600",
    bgHover: "hover:border-amber-300",
  },
  {
    id: "gadgets-electronics",
    name: "Gadgets & Electronics",
    bnName: "গ্যাজেটস ও ইলেকট্রনিক্স",
    icon: Smartphone,
    color: "from-cyan-600 to-blue-600",
    iconColor: "text-cyan-600",
    bgHover: "hover:border-cyan-300",
  },
  {
    id: "others",
    name: "Other's",
    bnName: "অন্যান্য সামগ্রী",
    icon: LayoutGrid,
    color: "from-emerald-600 to-teal-700",
    iconColor: "text-emerald-600",
    bgHover: "hover:border-emerald-300",
  },
  {
    id: "kids-zone",
    name: "Kids Zone",
    bnName: "কিডস জোন",
    icon: Baby,
    color: "from-violet-600 to-purple-700",
    iconColor: "text-violet-600",
    bgHover: "hover:border-violet-300",
  },
  {
    id: "offers",
    name: "Hot Offers",
    bnName: "স্পেশাল অফার",
    icon: Flame,
    color: "from-[#df2d4d] to-[#fe4c6c]",
    iconColor: "text-[#df2d4d]",
    bgHover: "hover:border-rose-300",
  },
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeCategory,
  isOfferFilter = false,
}) => {
  const router = useRouter();

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Category Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <span>ক্যাটাগরি সমূহ</span>
          <span className="text-xs font-semibold text-slate-400">(Categories)</span>
        </h3>
        <span className="text-[11px] font-bold text-rose-600 cursor-pointer hover:underline" onClick={() => router.push("/")}>
          সবগুলো দেখুন
        </span>
      </div>

      {/* Categories Cards Carousel (Modeled exactly like Image 2) */}
      <div className="flex items-stretch gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar pb-2 pt-1">
        {CATEGORIES_LIST.map((cat) => {
          const Icon = cat.icon;
          const isSelected =
            (cat.id === "offers" && isOfferFilter) ||
            (!isOfferFilter && (activeCategory === cat.id || (!activeCategory && cat.id === "all")));

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-300 shrink-0 border min-w-[105px] sm:min-w-[130px] cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-950/20 scale-102"
                  : "bg-white text-slate-700 border-slate-200/90 hover:shadow-md hover:scale-102 " + cat.bgHover
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center transition-all duration-300 mb-2 ${
                  isSelected
                    ? "bg-white/10 text-white"
                    : "bg-slate-50 group-hover:bg-slate-100 " + cat.iconColor
                }`}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              {/* Title */}
              <span
                className={`text-xs sm:text-sm font-bold text-center leading-tight ${
                  isSelected ? "text-white" : "text-slate-800 group-hover:text-rose-600"
                }`}
              >
                {cat.name}
              </span>

              {/* Bengali Subtitle */}
              <span
                className={`text-[10px] mt-0.5 line-clamp-1 ${
                  isSelected ? "text-slate-300" : "text-slate-400"
                }`}
              >
                {cat.bnName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
