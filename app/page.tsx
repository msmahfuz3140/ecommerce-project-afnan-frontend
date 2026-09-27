"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryChips } from "@/components/home/CategoryChips";
import { FlashSale } from "@/components/home/FlashSale";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailsModal } from "@/components/product/ProductDetailsModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CashOnDeliveryModal } from "@/components/checkout/CashOnDeliveryModal";
import { TrackOrderModal } from "@/components/track/TrackOrderModal";
import { fetchProducts, fetchActiveOffers } from "@/lib/api";
import { Product, Offer } from "@/types";
import { Zap, Sparkles, Shirt, Layers, SlidersHorizontal, Loader2 } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  const isOfferParam = searchParams.get("isOffer") === "true";

  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Offer[]>([]);
  const [noticeText, setNoticeText] = useState(
    "⭐ GAXIN MART স্পেশাল অফার! সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা। WhatsApp অর্ডার ও হেল্পলাইন: 01356584296"
  );
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  // Load products and offers
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [prodRes, offerRes] = await Promise.all([
          fetchProducts({
            category: categoryParam !== "all" ? categoryParam : undefined,
            search: searchQuery || undefined,
            isOffer: isOfferParam ? true : undefined,
            sort: sortBy,
          }),
          fetchActiveOffers(),
        ]);

        if (prodRes && prodRes.products) {
          setProducts(prodRes.products);
        }

        if (offerRes) {
          if (offerRes.banners && offerRes.banners.length > 0) {
            setBanners(offerRes.banners);
          }
          if (offerRes.notices && offerRes.notices.length > 0 && offerRes.notices[0].noticeText) {
            setNoticeText(offerRes.notices[0].noticeText);
          }
        }
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryParam, searchQuery, isOfferParam, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar with notice ticker and track order modal trigger */}
      <Navbar
        noticeText={noticeText}
        onOpenTrackModal={() => setTrackModalOpen(true)}
      />

      <main className="flex-1 pb-16">
        {/* Hero Banner Carousel (Only on main landing without search) */}
        {!searchQuery && categoryParam === "all" && !isOfferParam && (
          <HeroBanner banners={banners} />
        )}

        {/* Category Chips Scroll */}
        <CategoryChips
          activeCategory={categoryParam}
          isOfferFilter={isOfferParam}
        />

        {/* Flash Sale Section (Only on main landing) */}
        {!searchQuery && categoryParam === "all" && !isOfferParam && products.length > 0 && (
          <FlashSale
            products={products}
            onOpenDetails={(p) => setSelectedProduct(p)}
          />
        )}

        {/* Main Products Grid & Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* Section Header with Sort Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                {searchQuery ? (
                  <>
                    <span className="text-slate-500 font-normal">সার্চ ফলাফল:</span> &ldquo;{searchQuery}&rdquo;
                  </>
                ) : isOfferParam ? (
                  <>
                    <Sparkles className="w-5 h-5 text-[#df2d4d]" />
                    বিশেষ অফারের পণ্যসমূহ (Hot Offers)
                  </>
                ) : categoryParam === "mens-fashion" ? (
                  <>
                    <Shirt className="w-5 h-5 text-blue-600" />
                    পুরুষদের ফ্যাশন (Men&apos;s Fashion)
                  </>
                ) : categoryParam === "womens-fashion" ? (
                  <>
                    <Sparkles className="w-5 h-5 text-pink-600" />
                    মহিলাদের ফ্যাশন (Women&apos;s Fashion)
                  </>
                ) : categoryParam === "home-lifestyle" ? (
                  <>
                    <Layers className="w-5 h-5 text-amber-600" />
                    হোম ও লাইফস্টাইল (Home & Lifestyle)
                  </>
                ) : categoryParam === "gadgets-electronics" ? (
                  <>
                    <Zap className="w-5 h-5 text-cyan-600" />
                    গ্যাজেটস ও ইলেকট্রনিক্স (Gadgets & Electronics)
                  </>
                ) : categoryParam === "others" ? (
                  <>
                    <Layers className="w-5 h-5 text-emerald-600" />
                    অন্যান্য সামগ্রী (Other&apos;s)
                  </>
                ) : categoryParam === "kids-zone" ? (
                  <>
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    কিডস জোন (Kids Zone)
                  </>
                ) : (
                  <>
                    <Layers className="w-5 h-5 text-[#df2d4d]" />
                    সকল প্রিমিয়াম পণ্য (All Products)
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ক্যাশ অন ডেলিভারিতে অর্ডার করুন — পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-none focus:border-[#df2d4d]"
              >
                <option value="latest">নতুন পণ্য আগে</option>
                <option value="price_asc">মূল্য: কম থেকে বেশি</option>
                <option value="price_desc">মূল্য: বেশি থেকে কম</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#df2d4d]" />
              <p className="text-xs font-semibold">পণ্য লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-[#df2d4d] flex items-center justify-center mx-auto mb-3">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">কোনো পণ্য পাওয়া যায়নি!</h3>
              <p className="text-xs text-slate-400 mt-1">
                অন্য কোনো ক্যাটাগরি বা সঠিক কীওয়ার্ড দিয়ে সার্চ করার চেষ্টা করুন।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onOpenDetails={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer />
      <CashOnDeliveryModal />
      <TrackOrderModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#df2d4d]" />
          <p className="text-xs font-semibold">GAXIN MART লোড হচ্ছে...</p>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
