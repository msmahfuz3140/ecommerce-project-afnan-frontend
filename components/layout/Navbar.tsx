"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Home,
  Baby,
  LayoutGrid,
  Phone,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WhatsAppIcon, getWhatsAppUrl, WHATSAPP_NUMBER } from "@/components/ui/WhatsAppButton";

interface NavbarProps {
  noticeText?: string;
  onOpenTrackModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  noticeText = "⭐ GAXIN MART স্পেশাল অফার! সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা। WhatsApp অর্ডার ও হেল্পলাইন: 01356584296",
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

  const handleOpenTracking = () => {
    setMobileMenuOpen(false);
    if (onOpenTrackModal) {
      onOpenTrackModal();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-track-order"));
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-rose-100 font-sans">
      {/* 1. Top Announcement Notice Ticker */}
      {showNotice && (
        <div className="bg-[#b1001f] text-white text-[11px] sm:text-xs py-1 sm:py-1.5 px-3 flex items-center justify-between overflow-hidden relative border-b border-rose-900">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <span className="bg-[#df2d4d] text-white font-black text-[9px] sm:text-[10px] uppercase px-1.5 sm:px-2 py-0.5 rounded flex items-center gap-1 shrink-0 animate-pulse">
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-300 text-yellow-300" />
              SPECIAL
            </span>
            <div className="overflow-hidden whitespace-nowrap w-full">
              <p className="inline-block animate-marquee font-medium pl-3 sm:pl-4">
                {noticeText}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            className="text-rose-200 hover:text-white ml-2 p-0.5 shrink-0 cursor-pointer"
            aria-label="Close Notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-6">
          {/* Left: Mobile Menu & Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform bg-black border border-slate-800">
                <Image
                  src="/gaxin-mart-logo.jpg"
                  alt="GAXIN MART Logo"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 block leading-tight">
                  GAXIN <span className="text-[#df2d4d]">MART</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase hidden sm:block">
                  Fashion • Gadgets • Lifestyle
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop & Tablet) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg relative items-center mx-2"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সার্চ করুন শার্ট, গ্যাজেট, ব্যাগ, ঘড়ি, হোম অ্যাপ্লায়েন্স..."
              className="w-full pl-4 pr-12 py-2 sm:py-2.5 rounded-full border-2 border-rose-200 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-800 transition-colors bg-slate-50/50"
            />
            <button
              type="submit"
              className="absolute right-1.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#df2d4d] hover:bg-[#b1001f] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right: Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Direct WhatsApp Call/Chat Button */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200 cursor-pointer"
              title="WhatsApp এ সরাসরি কথা বলুন"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span className="hidden sm:inline">{WHATSAPP_NUMBER}</span>
              <span className="sm:hidden text-[11px] font-bold">WhatsApp</span>
            </a>

            {/* Track Order Button (Desktop & Tablet) */}
            <button
              onClick={handleOpenTracking}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#df2d4d] bg-slate-100 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#df2d4d]" />
              <span className="hidden md:inline">Track Order</span>
            </button>



            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white shadow-md shadow-rose-500/25 transition-all transform active:scale-95 cursor-pointer"
              aria-label="Open Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-xs sm:text-sm">
                ৳{subtotal.toLocaleString()}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Directly below navbar on phone screens) */}
        <div className="md:hidden pb-2.5 pt-0.5">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য সার্চ করুন (যেমন: শার্ট, ঘড়ি, জুতো)..."
              className="w-full pl-3.5 pr-10 py-2 rounded-full border border-rose-200 focus:border-[#df2d4d] focus:outline-none text-xs text-slate-800 bg-slate-50"
            />
            <button
              type="submit"
              className="absolute right-1 w-7 h-7 rounded-full bg-[#df2d4d] text-white flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 3. Desktop Category Navigation Bar (All 6 Categories from Image 2) */}
        <nav className="hidden lg:flex items-center gap-6 py-2.5 border-t border-slate-100 text-xs font-bold text-slate-700 overflow-x-auto no-scrollbar">
          <Link
            href="/"
            className="hover:text-[#df2d4d] transition-colors whitespace-nowrap"
          >
            সকল পণ্য (All)
          </Link>
          <Link
            href="/?category=mens-fashion"
            className="hover:text-[#df2d4d] transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Shirt className="w-3.5 h-3.5 text-blue-600" />
            Men&apos;s Fashion
          </Link>
          <Link
            href="/?category=womens-fashion"
            className="hover:text-[#df2d4d] transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            Women&apos;s Fashion
          </Link>
          <Link
            href="/?category=home-lifestyle"
            className="hover:text-[#df2d4d] transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Home className="w-3.5 h-3.5 text-amber-600" />
            Home & Lifestyle
          </Link>
          <Link
            href="/?category=gadgets-electronics"
            className="hover:text-[#df2d4d] transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-600" />
            Gadgets & Electronics
          </Link>
          <Link
            href="/?category=others"
            className="hover:text-[#df2d4d] transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-600" />
            Other&apos;s
          </Link>
          <Link
            href="/?category=kids-zone"
            className="hover:text-[#df2d4d] transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Baby className="w-3.5 h-3.5 text-violet-600" />
            Kids Zone
          </Link>

          <div className="ml-auto flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য দিন)
          </div>
        </nav>
      </div>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-slide-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black border border-slate-800">
                    <Image src="/gaxin-mart-logo.jpg" alt="" fill className="object-cover" />
                  </div>
                  <span className="font-black text-base text-slate-900">GAXIN MART</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-600"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories Navigation */}
              <div className="flex flex-col gap-1.5 mt-4 text-xs font-bold text-slate-700">
                <p className="text-[10px] uppercase text-slate-400 tracking-wider mb-1">ক্যাটাগরি</p>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2.5 transition-colors"
                >
                  <Home className="w-4 h-4 text-slate-600" />
                  সকল পণ্য (All Products)
                </Link>
                <Link
                  href="/?category=mens-fashion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2.5 transition-colors"
                >
                  <Shirt className="w-4 h-4 text-blue-600" />
                  Men&apos;s Fashion
                </Link>
                <Link
                  href="/?category=womens-fashion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  Women&apos;s Fashion
                </Link>
                <Link
                  href="/?category=home-lifestyle"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2.5 transition-colors"
                >
                  <Home className="w-4 h-4 text-amber-600" />
                  Home & Lifestyle
                </Link>
                <Link
                  href="/?category=gadgets-electronics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2.5 transition-colors"
                >
                  <Zap className="w-4 h-4 text-cyan-600" />
                  Gadgets & Electronics
                </Link>
                <Link
                  href="/?category=others"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2.5 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4 text-emerald-600" />
                  Other&apos;s
                </Link>
                <Link
                  href="/?category=kids-zone"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2.5 transition-colors"
                >
                  <Baby className="w-4 h-4 text-violet-600" />
                  Kids Zone
                </Link>

                <p className="text-[10px] uppercase text-slate-400 tracking-wider mt-3 mb-1">কুইক সার্ভিসেস</p>
                <button
                  type="button"
                  onClick={handleOpenTracking}
                  className="px-3 py-2 text-left rounded-xl hover:bg-rose-50 hover:text-[#df2d4d] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-[#df2d4d]" />
                  অর্ডার ট্র্যাক করুন (Track Order)
                </button>

              </div>
            </div>

            {/* Helpline & WhatsApp Footer */}
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
              >
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                <span>WhatsApp: {WHATSAPP_NUMBER}</span>
              </a>
              <div className="text-[11px]">
                <p className="font-bold text-slate-800">GAXIN MART কাস্টমার কেয়ার</p>
                <p>হটলাইন: {WHATSAPP_NUMBER}</p>
                <p>সকাল ৯টা - রাত ১১টা (৭ দিন)</p>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* 5. Modern Mobile Bottom App Bar (Sticky on phones for native app feel) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 flex items-center justify-around shadow-2xl">
        {/* Home */}
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-600 hover:text-[#df2d4d] active:text-[#df2d4d]"
        >
          <Home className="w-5 h-5" />
          <span>হোম</span>
        </Link>

        {/* Categories Drawer Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-600 hover:text-[#df2d4d]"
        >
          <LayoutGrid className="w-5 h-5" />
          <span>ক্যাটাগরি</span>
        </button>

        {/* Track Order */}
        <button
          type="button"
          onClick={handleOpenTracking}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-600 hover:text-[#df2d4d]"
        >
          <Truck className="w-5 h-5 text-[#df2d4d]" />
          <span>ট্র্যাক</span>
        </button>

        {/* Cart Drawer Trigger with Badge */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-600 hover:text-[#df2d4d] relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#df2d4d] text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </div>
          <span>কার্ট</span>
        </button>

        {/* WhatsApp Direct Chat */}
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-emerald-700"
        >
          <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
          <span>মেসেজ</span>
        </a>
      </nav>
    </header>
  );
};
