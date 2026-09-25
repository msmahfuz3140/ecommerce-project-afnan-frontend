"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Truck,
  Sparkles,
  Zap,
  Shirt,
  ShieldCheck,
  Lock,
  X,
  Menu,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  noticeText?: string;
  onOpenTrackModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  noticeText = "⭐ AuraMart স্পেশাল অফার! সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা। ১০০% অরিজিনাল প্রোডাক্ট।",
  onOpenTrackModal,
}) => {
  const router = useRouter();
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const [showNotice, setShowNotice] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-rose-100">
      {/* 1. Top Notice Ticker (Like demo.scaleuper.com) */}
      {showNotice && (
        <div className="bg-[#b1001f] text-white text-xs sm:text-sm py-1.5 px-3 flex items-center justify-between overflow-hidden relative border-b border-rose-900">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <span className="bg-[#df2d4d] text-white font-bold text-[10px] sm:text-xs uppercase px-2 py-0.5 rounded flex items-center gap-1 shrink-0 animate-pulse">
              <Zap className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              SPECIAL NOTICE
            </span>
            <div className="overflow-hidden whitespace-nowrap w-full">
              <p className="inline-block animate-marquee font-medium pl-4">
                {noticeText}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            className="text-rose-200 hover:text-white ml-2 p-0.5 shrink-0"
            aria-label="Close Notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#df2d4d] to-[#ff4d6d] flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 block leading-tight">
                Aura<span className="text-[#df2d4d]">Mart</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block">
                Tech • Beauty • Fashion
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop & Tablet) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সার্চ করুন হেডফোন, সিরাম, ব্যাগ, ঘড়ি..."
              className="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-rose-200 focus:border-[#df2d4d] focus:outline-none text-sm text-slate-800 transition-colors bg-slate-50/50"
            />
            <button
              type="submit"
              className="absolute right-1.5 w-9 h-9 rounded-full bg-[#df2d4d] hover:bg-[#b1001f] text-white flex items-center justify-center transition-colors shadow-sm"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Track Order Button */}
            <button
              onClick={onOpenTrackModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#df2d4d] bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
            >
              <Truck className="w-4 h-4 text-[#df2d4d]" />
              Track Order
            </button>

            {/* Admin Portal Link */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Admin Panel"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Admin</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white shadow-md shadow-rose-500/25 transition-all transform active:scale-95"
              aria-label="Open Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="font-bold text-xs sm:text-sm">
                ৳{subtotal.toLocaleString()}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য সার্চ করুন..."
              className="w-full pl-3.5 pr-10 py-2 rounded-full border border-rose-200 focus:border-[#df2d4d] text-xs text-slate-800 bg-slate-50/50"
            />
            <button
              type="submit"
              className="absolute right-1 w-7 h-7 rounded-full bg-[#df2d4d] text-white flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Desktop Category Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-8 py-2.5 border-t border-slate-100 text-sm font-semibold text-slate-700">
          <Link
            href="/"
            className="hover:text-[#df2d4d] transition-colors flex items-center gap-1.5"
          >
            সব পণ্য (All)
          </Link>
          <Link
            href="/?category=electronics"
            className="hover:text-[#df2d4d] transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-blue-600" />
            ইলেকট্রনিক্স (Electronics)
          </Link>
          <Link
            href="/?category=cosmetics"
            className="hover:text-[#df2d4d] transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-pink-600" />
            কসমেটিক্স (Cosmetics & Beauty)
          </Link>
          <Link
            href="/?category=fashion"
            className="hover:text-[#df2d4d] transition-colors flex items-center gap-1.5"
          >
            <Shirt className="w-4 h-4 text-amber-600" />
            ফ্যাশন ও লাইফস্টাইল (Fashion)
          </Link>
          <div className="ml-auto flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ)
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-lg text-slate-900">মেন্যু (Menu)</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="flex flex-col gap-3 mt-4 text-sm font-medium">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-[#df2d4d]"
                >
                  🏠 হোমপেজ (Home)
                </Link>
                <Link
                  href="/?category=electronics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-blue-600" />
                  ইলেকট্রনিক্স (Electronics)
                </Link>
                <Link
                  href="/?category=cosmetics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  কসমেটিক্স (Cosmetics)
                </Link>
                <Link
                  href="/?category=fashion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2"
                >
                  <Shirt className="w-4 h-4 text-amber-600" />
                  ফ্যাশন (Fashion)
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenTrackModal) onOpenTrackModal();
                  }}
                  className="px-3 py-2 text-left rounded-lg hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2"
                >
                  <Truck className="w-4 h-4 text-[#df2d4d]" />
                  অর্ডার ট্র্যাক করুন (Track Order)
                </button>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  অ্যাডমিন প্যানেল (Admin Panel)
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              <p className="font-semibold text-slate-800">AuraMart Customer Care</p>
              <p>হেল্পলাইন: 01700-000000</p>
              <p>সকাল ৯টা - রাত ১১টা</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
