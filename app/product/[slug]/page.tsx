"use client";

import React, { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Zap,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Share2,
  Check,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowLeft,
  Loader2,
  Send,
  User,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CashOnDeliveryModal } from "@/components/checkout/CashOnDeliveryModal";
import { TrackOrderModal } from "@/components/track/TrackOrderModal";
import { ProductCard } from "@/components/product/ProductCard";
import { WhatsAppIcon, getWhatsAppUrl, WHATSAPP_NUMBER } from "@/components/ui/WhatsAppButton";
import { useCart } from "@/context/CartContext";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { Product } from "@/types";

interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  likes: number;
}

const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    name: "তানভীর আহমেদ",
    rating: 5,
    date: "২ দিন আগে",
    comment:
      "আলহামদুলিল্লাহ, প্রোডাক্টটি অনেক ভালো! যেমনটা ছবিতে দেখেছি হুবহু তেমনই পেয়েছি। প্যাকেজিং দারুণ ছিল এবং ২ দিনের মধ্যেই ডেলিভারি পেয়েছি। GAXIN MART কে ধন্যবাদ!",
    verified: true,
    likes: 14,
  },
  {
    id: "rev-2",
    name: "সাবরিনা চৌধুরী",
    rating: 5,
    date: "৫ দিন আগে",
    comment:
      "খুবই প্রিমিয়াম কোয়ালিটি। এই মূল্যে এত ভালো মানের পণ্য পাওয়া সত্যিই অবিশ্বাস্য। কাস্টমার কেয়ারের ব্যবহারও চমৎকার ছিল।",
    verified: true,
    likes: 9,
  },
  {
    id: "rev-3",
    name: "মোঃ মারুফ হোসেন",
    rating: 4,
    date: "১ সপ্তাহ আগে",
    comment:
      "পণ্যটি চমৎকার, ব্যবহার করে ভালো লেগেছে। ক্যাশ অন ডেলিভারিতে চেক করে নিতে পেরেছি। সবাই নিশ্চিন্তে নিতে পারেন।",
    verified: true,
    likes: 6,
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const router = useRouter();
  const resolvedParams = use(params as any) as { slug: string };
  const slug = resolvedParams.slug;

  const { addToCart, openDirectCheckout } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Zoom State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<CustomerReview[]>(DEFAULT_REVIEWS);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load Product and Related Products
  useEffect(() => {
    let isMounted = true;
    async function loadProductData() {
      setLoading(true);
      try {
        const res = await fetchProduct(slug);
        if (res && res.product && isMounted) {
          setProduct(res.product);
          setActiveImageIndex(0);

          // Load related products from same category
          const relRes = await fetchProducts({
            category: res.product.category,
            sort: "latest",
          });
          if (relRes && relRes.products && isMounted) {
            const filtered = relRes.products
              .filter((p: Product) => p._id !== res.product._id)
              .slice(0, 4);
            setRelatedProducts(filtered);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProductData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Load custom reviews from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined" && product) {
      try {
        const stored = localStorage.getItem(`gaxinmart_reviews_${product._id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReviews([...parsed, ...DEFAULT_REVIEWS]);
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, [product]);

  // Zoom Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Actions
  const handleBuyNow = () => {
    if (!product) return;
    openDirectCheckout(product, quantity);
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: newReviewName.trim(),
      rating: newReviewRating,
      date: "এখনই",
      comment: newReviewComment.trim(),
      verified: true,
      likes: 1,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);

    if (typeof window !== "undefined" && product) {
      try {
        const stored = localStorage.getItem(`gaxinmart_reviews_${product._id}`);
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newRev);
        localStorage.setItem(`gaxinmart_reviews_${product._id}`, JSON.stringify(list));
      } catch (err) {
        // ignore
      }
    }

    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar onOpenTrackModal={() => setTrackModalOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-32">
          <Loader2 className="w-10 h-10 animate-spin text-[#df2d4d]" />
          <p className="text-xs font-bold text-slate-500">পণ্য লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar onOpenTrackModal={() => setTrackModalOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-[#df2d4d] flex items-center justify-center">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
          <p className="text-xs text-slate-500 max-w-sm">
            হয়তো লিংকটি পরিবর্তিত হয়েছে অথবা পণ্যটি এই মুহূর্তে স্টকে নেই।
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-[#df2d4d] text-white text-xs font-bold shadow-md hover:bg-[#b1001f] transition-all"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentImage =
    product.images[activeImageIndex] ||
    product.images[0] ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";

  const discountPercent =
    product.originalPrice > product.sellPrice
      ? Math.round(((product.originalPrice - product.sellPrice) / product.originalPrice) * 100)
      : 0;

  const savingsAmount = product.originalPrice - product.sellPrice;

  const categoryNames: Record<string, string> = {
    "mens-fashion": "পুরুষদের ফ্যাশন (Men's Fashion)",
    "womens-fashion": "মহিলাদের ফ্যাশন (Women's Fashion)",
    "home-lifestyle": "হোম ও লাইফস্টাইল (Home & Lifestyle)",
    "gadgets-electronics": "গ্যাজেটস ও ইলেকট্রনিক্স (Gadgets & Electronics)",
    "others": "অন্যান্য সামগ্রী (Other's)",
    "kids-zone": "কিডস জোন (Kids Zone)",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onOpenTrackModal={() => setTrackModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-[#df2d4d] transition-colors">
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link
            href={`/?category=${product.category}`}
            className="hover:text-[#df2d4d] transition-colors"
          >
            {categoryNames[product.category] || product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Showcase Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT: PRODUCT GALLERY WITH ZOOM ================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image with Interactive Magnifier / Zoom */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                {discountPercent > 0 && (
                  <span className="bg-[#df2d4d] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                    -{discountPercent}% ছাড়
                  </span>
                )}
                {product.offerBadge && (
                  <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    {product.offerBadge}
                  </span>
                )}
              </div>

              {/* Floating Zoom & Action Controls */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200/60">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  title="Zoom In (বড় করে দেখুন)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  title="Zoom Out (ছোট করে দেখুন)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                {zoomLevel > 1 && (
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="px-2 py-1 text-[10px] font-black rounded-lg bg-rose-50 text-[#df2d4d] hover:bg-rose-100 transition-colors cursor-pointer"
                    title="রিসেট জুম"
                  >
                    1.0x
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  title="ফুল-স্ক্রিন লাইটবক্স"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Image View Area */}
              <div
                className="relative w-full aspect-square cursor-crosshair overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                  setIsHovering(false);
                  if (zoomLevel === 1) setMousePos({ x: 50, y: 50 });
                }}
                onClick={() => setIsLightboxOpen(true)}
              >
                <div
                  className="w-full h-full transition-transform duration-150 ease-out"
                  style={{
                    transform:
                      zoomLevel > 1 || isHovering
                        ? `scale(${Math.max(zoomLevel, 1.8)})`
                        : "scale(1)",
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }}
                >
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-4 rounded-2xl select-none"
                  />
                </div>


              </div>
            </div>

            {/* Thumbnail Switcher */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setZoomLevel(1);
                    }}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-slate-50 ${
                      activeImageIndex === idx
                        ? "border-[#df2d4d] ring-2 ring-rose-200 scale-102"
                        : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT: PRODUCT DETAILS & CTA ================= */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, Stock Badge, Share */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#df2d4d] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  {categoryNames[product.category] || product.category}
                </span>

                <div className="flex items-center gap-2">
                  {/* Stock Privacy Guarantee Badge */}
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    স্টকে রয়েছে (In Stock)
                  </span>

                  {/* Share Link Button */}
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200"
                    title="পণ্য লিংক কপি করুন"
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* Ratings and Reviews anchor */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-black text-slate-800 ml-1">4.9</span>
                </div>
                <span className="text-slate-300">|</span>
                <a
                  href="#reviews-section"
                  className="font-bold text-slate-600 hover:text-[#df2d4d] transition-colors underline decoration-slate-300"
                >
                  {reviews.length} টি ভেরিফাইড রিভিউ
                </a>
              </div>

              {/* Pricing Box */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#df2d4d]">
                    ৳{product.sellPrice.toLocaleString()}
                  </span>
                  {product.originalPrice > product.sellPrice && (
                    <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {savingsAmount > 0 && (
                  <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
                    🔥 আপনি সাশ্রয় করছেন ৳{savingsAmount.toLocaleString()} ({discountPercent}% ছাড়)
                  </p>
                )}

                <p className="text-[11px] text-slate-500 pt-1">
                  * সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা। পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।
                </p>
              </div>

              {/* Short Description with See More Toggle */}
              {product.description && (
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {product.description.length > 140 && !showFullDesc
                      ? `${product.description.slice(0, 140)}...`
                      : product.description}
                  </p>
                  {product.description.length > 140 && (
                    <button
                      type="button"
                      onClick={() => setShowFullDesc((prev) => !prev)}
                      className="text-xs font-bold text-[#df2d4d] hover:text-[#b1001f] inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {showFullDesc ? (
                        <>
                          <span>সংক্ষেপ করুন (See Less)</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>আরো দেখুন (See More)</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-slate-700">পরিমাণ (Quantity):</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs sm:text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Buy Now, Add to Cart, WhatsApp */}
              <div className="space-y-2.5 pt-2">
                {/* Primary Buy Now / COD */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-sm sm:text-base font-black shadow-xl shadow-rose-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                  <span>এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="py-3 px-4 rounded-xl border-2 border-slate-900 hover:bg-slate-900 text-slate-900 hover:text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>কার্টে যোগ করুন</span>
                  </button>

                  {/* Direct WhatsApp Order */}
                  <a
                    href={getWhatsAppUrl(product.name, product.sellPrice)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp এ অর্ডার ({WHATSAPP_NUMBER})</span>
                  </a>
                </div>
              </div>

              {/* Trust & Guarantee Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-800">ক্যাশ অন ডেলিভারি</p>
                  <p className="text-[9px] text-slate-400">দেখে মূল্য দিন</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-800">দ্রুত ডেলিভারি</p>
                  <p className="text-[9px] text-slate-400">ঢাকা ৳৭০, বাইরে ৳১৩০</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-800">৭ দিনের রিটার্ন</p>
                  <p className="text-[9px] text-slate-400">সহজ এক্সচেঞ্জ পলিসি</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-800">১০০% অথেন্টিক</p>
                  <p className="text-[9px] text-slate-400">অরিজিনাল প্রডাক্ট</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#df2d4d]" />
              পণ্যের স্পেসিফিকেশন ও বৈশিষ্ট্য (Specifications)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <span className="font-bold text-slate-600">{key}:</span>
                  <span className="font-semibold text-slate-900">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CUSTOMER REVIEWS SECTION ================= */}
        <section
          id="reviews-section"
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#df2d4d]" />
                কাস্টমার রিভিউ (Customer Reviews)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                প্রকৃত ক্রেতাদের অভিমত ও অভিজ্ঞতা
              </p>
            </div>
            <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-200">
              <div className="text-2xl font-black text-[#df2d4d]">4.9</div>
              <div className="text-xs">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">{reviews.length} টি রিভিউ</p>
              </div>
            </div>
          </div>

          {/* Reviews List & Write Review Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-[#df2d4d] font-bold text-xs flex items-center justify-center">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{rev.name}</h4>
                          {rev.verified && (
                            <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>

                  <div className="pt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rev.likes} জন ক্রেতা এই রিভিউটিকে সহায়ক মনে করেছেন</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Write a Review Box */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                আপনার রিভিউ শেয়ার করুন
              </h3>
              <p className="text-xs text-slate-500">
                পণ্যটি ব্যবহার করে আপনার অভিজ্ঞতা কেমন ছিল? অন্যান্য ক্রেতাদের জানাতে রিভিউ দিন।
              </p>

              {reviewSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ধন্যবাদ! আপনার রিভিউটি সফলভাবে প্রকাশিত হয়েছে।</span>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-3">
                {/* Star Rating Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    রেটিং সিলেক্ট করুন:
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newReviewRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {newReviewRating} স্টার
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="যেমন: মোঃ সাকিব হোসেন"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার মতামত লিখুন *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="পণ্যটির মান ও ডেলিভারি কেমন ছিল?"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>রিভিউ জমা দিন</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ================= RELATED PRODUCTS SECTION ================= */}
        {relatedProducts.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#df2d4d]" />
                  সম্পর্কিত অন্যান্য পণ্য (Related Products)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  একই ক্যাটাগরির আরও আকর্ষণীয় পণ্য দেখুন
                </p>
              </div>
              <Link
                href={`/?category=${product.category}`}
                className="text-xs font-bold text-[#df2d4d] hover:underline"
              >
                সবগুলো দেখুন ➜
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {relatedProducts.map((relProd, idx) => (
                <ProductCard key={relProd._id} product={relProd} index={idx} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Full-Screen Zoom Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-3xl aspect-square max-h-[80vh] rounded-2xl overflow-hidden">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          <div className="text-white text-xs sm:text-sm font-bold mt-4 text-center">
            {product.name}
          </div>
        </div>
      )}

      {/* Global Drawers & Modals */}
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
