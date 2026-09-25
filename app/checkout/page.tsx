"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Phone,
  MapPin,
  FileText,
  Zap,
  Loader2,
  Plus,
  Minus,
  Trash2,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { createOrder, fetchProduct } from "@/lib/api";
import { Product } from "@/types";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryProductId = searchParams.get("productId");
  const queryQty = Number(searchParams.get("qty")) || 1;

  const {
    cart,
    clearCart,
    directCheckoutItem,
    setDirectCheckoutItem,
    closeDirectCheckout,
    removeFromCart,
    updateQuantity,
  } = useCart();

  // Local state for direct checkout item quantity if in direct buy mode
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDirectBuy, setIsDirectBuy] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form Fields
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "Dhaka (Inside Dhaka)",
    note: "",
  });

  const [deliveryCharge, setDeliveryCharge] = useState(70);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Initialize Items
  useEffect(() => {
    async function init() {
      // 1. If direct checkout item exists in context
      if (directCheckoutItem) {
        setItems([directCheckoutItem]);
        setIsDirectBuy(true);
        setLoadingInitial(false);
        return;
      }

      // 2. If direct product query param exists
      if (queryProductId) {
        try {
          const res = await fetchProduct(queryProductId);
          if (res.success && res.product) {
            const directItem: CartItem = {
              product: res.product,
              quantity: Math.max(1, queryQty),
            };
            setDirectCheckoutItem(directItem);
            setItems([directItem]);
            setIsDirectBuy(true);
            setLoadingInitial(false);
            return;
          }
        } catch (e) {
          console.error("Failed to load query product", e);
        }
      }

      // 3. Otherwise use full Cart
      if (cart.length > 0) {
        setItems(cart);
        setIsDirectBuy(false);
      } else {
        setItems([]);
      }
      setLoadingInitial(false);
    }

    init();
  }, [directCheckoutItem, queryProductId, queryQty, cart]);

  // Handle Quantity Increase
  const handleIncrease = (index: number) => {
    const targetItem = items[index];
    if (!targetItem) return;

    const newQty = targetItem.quantity + 1;
    if (isDirectBuy) {
      const updated = { ...targetItem, quantity: newQty };
      setDirectCheckoutItem(updated);
      setItems([updated]);
    } else {
      updateQuantity(targetItem.product._id, newQty);
    }
  };

  // Handle Quantity Decrease
  const handleDecrease = (index: number) => {
    const targetItem = items[index];
    if (!targetItem) return;

    if (targetItem.quantity <= 1) {
      if (!isDirectBuy && items.length > 1) {
        removeFromCart(targetItem.product._id);
      }
      return;
    }

    const newQty = targetItem.quantity - 1;
    if (isDirectBuy) {
      const updated = { ...targetItem, quantity: newQty };
      setDirectCheckoutItem(updated);
      setItems([updated]);
    } else {
      updateQuantity(targetItem.product._id, newQty);
    }
  };

  // Handle Area Change
  const handleAreaChange = (area: "inside" | "outside") => {
    if (area === "inside") {
      setFormData((prev) => ({ ...prev, city: "Dhaka (Inside Dhaka)" }));
      setDeliveryCharge(70);
    } else {
      setFormData((prev) => ({ ...prev, city: "Outside Dhaka (ঢাকার বাইরে)" }));
      setDeliveryCharge(130);
    }
  };

  // Calculation
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.sellPrice * item.quantity,
    0
  );
  const totalAmount = subtotal + (items.length > 0 ? deliveryCharge : 0);

  // Submit Order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.customerName.trim()) {
      setError("অনুগ্রহ করে আপনার পুরো নাম প্রদান করুন।");
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError("অনুগ্রহ করে সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 017xxxxxxxx)।");
      return;
    }
    if (!formData.address.trim()) {
      setError("অনুগ্রহ করে পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন।");
      return;
    }
    if (items.length === 0) {
      setError("আপনার অর্ডার তালিকায় কোনো পণ্য নেই।");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city,
        note: formData.note.trim(),
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
      };

      const res = await createOrder(payload);

      if (res.success && res.order) {
        setPlacedOrder(res.order);
        if (isDirectBuy) {
          closeDirectCheckout();
        } else {
          clearCart();
        }
      } else {
        setError(res.message || "অর্ডার সম্পন্ন হতে পারেনি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch (err: any) {
      console.error("Order placement error:", err);
      setError("সার্ভার সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // ================= ORDER SUCCESS SCREEN =================
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              🎉 অভিনন্দন! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              অর্ডার আইডি: <span className="text-[#df2d4d]">{placedOrder.orderId}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করবেন। আমাদের প্রতিনিধি শীঘ্রই আপনার নম্বরে ({placedOrder.phone}) ফোন করে অর্ডার কনফার্ম করবেন।
            </p>
          </div>

          {/* Order Summary Receipt */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">গ্রাহকের নাম:</span>
              <span className="font-bold text-slate-800">{placedOrder.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">মোবাইল নম্বর:</span>
              <span className="font-bold text-slate-800 font-mono">{placedOrder.phone}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">ডেলিভারি ঠিকানা:</span>
              <span className="font-semibold text-slate-800 text-right max-w-xs">{placedOrder.address}, {placedOrder.city}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">পেমেন্ট মেথড:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ক্যাশ অন ডেলিভারি (COD)
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">পণ্য সংখ্যা:</span>
              <span className="font-bold text-slate-800">
                {placedOrder.items?.reduce((s: number, i: any) => s + (i.quantity || 1), 0)} টি
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-1">
              <span>সর্বমোট প্রদেয় টাকা:</span>
              <span className="text-[#df2d4d]">৳{placedOrder.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/25 transition-all text-center"
            >
              আরও কেনাকাটা করুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-[#df2d4d] transition-colors text-xs font-bold">
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#df2d4d] to-[#ff4d6d] flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-black text-lg text-slate-900 tracking-tight">
              Aura<span className="text-[#df2d4d]">Mart</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>১০০% ক্যাশ অন ডেলিভারি</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {loadingInitial ? (
          <div className="py-24 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#df2d4d] mx-auto" />
            <p className="text-xs font-semibold">পণ্য লোড হচ্ছে...</p>
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#df2d4d] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">চেকআউট করার জন্য কোনো পণ্য নির্বাচন করা হয়নি</h2>
              <p className="text-xs text-slate-500 mt-1">
                আপনার পছন্দের পণ্যটি খুঁজে &ldquo;অর্ডার করুন&rdquo; বাটনে ক্লিক করুন।
              </p>
            </div>
            <Link
              href="/"
              className="inline-block py-2.5 px-6 rounded-2xl bg-[#df2d4d] text-white text-xs font-bold hover:bg-[#b1001f] transition-colors shadow-md"
            >
              কেনাকাটা শুরু করুন
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Banner Notice */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-rose-900">
              <Zap className="w-5 h-5 text-[#df2d4d] shrink-0 fill-yellow-300 text-yellow-300" />
              <div>
                <p className="font-bold">১০০% ক্যাশ অন ডেলিভারি (Cash on Delivery)</p>
                <p className="text-rose-700 text-[11px]">
                  কোনো অগ্রিম পেমেন্ট লাগবে না। পণ্য হাতে পেয়ে চেক করে ডেলিভারিম্যানকে টাকা দিন।
                </p>
              </div>
            </div>

            {/* ================= SECTION 1: SELECTED PRODUCTS & QUANTITY ADJUSTMENT ================= */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    ১
                  </span>
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    নির্বাচিত পণ্য ও পরিমাণ (Product & Quantity)
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-slate-500">
                  {items.length} টি আইটেম
                </span>
              </div>

              {/* Items List with Prominent Quantity Adjustment */}
              <div className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const itemTotal = item.product.sellPrice * item.quantity;
                  return (
                    <div
                      key={item.product._id}
                      className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Product Info */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                          <Image
                            src={item.product.images[0] || ""}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded inline-block mb-1">
                            {item.product.category}
                          </span>
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
                            {item.product.name}
                          </h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-sm font-black text-slate-900">
                              ৳{item.product.sellPrice.toLocaleString()}
                            </span>
                            {item.product.originalPrice > item.product.sellPrice && (
                              <span className="text-[11px] text-slate-400 line-through">
                                ৳{item.product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controller & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-2xl">
                        {/* Big Prominent Quantity Increment/Decrement Buttons */}
                        <div className="flex items-center border-2 border-rose-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                          <button
                            type="button"
                            onClick={() => handleDecrease(idx)}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-700 hover:bg-rose-50 hover:text-[#df2d4d] active:scale-95 transition-all font-bold text-sm"
                            aria-label="Decrease Quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 sm:w-12 text-center font-black text-sm sm:text-base text-slate-900 select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrease(idx)}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-700 hover:bg-rose-50 hover:text-[#df2d4d] active:scale-95 transition-all font-bold text-sm"
                            aria-label="Increase Quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Calculated Item Total */}
                        <div className="text-right min-w-[90px]">
                          <span className="text-[10px] text-slate-400 block font-medium">সাবটোটাল</span>
                          <span className="text-base sm:text-lg font-black text-[#df2d4d]">
                            ৳{itemTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation Summary Box */}
              <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/80 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>পণ্যের সর্বমোট মূল্য (Subtotal):</span>
                  <span className="font-bold text-slate-800">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ ({formData.city.includes("Inside") ? "ঢাকা সিটির ভেতরে" : "ঢাকার বাইরে"}):</span>
                  <span className="font-bold text-slate-800">৳{deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>সর্বমোট প্রদেয় টাকা (COD):</span>
                  <span className="text-[#df2d4d] text-base sm:text-xl">৳{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* ================= SECTION 2: ORDER & DELIVERY INFORMATION FORM ================= */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  ২
                </span>
                <h2 className="text-sm sm:text-base font-black text-slate-900">
                  ডেলিভারি ও অর্ডার তথ্য (Order Information)
                </h2>
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#df2d4d]" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* 1. Customer Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    আপনার পুরো নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="যেমন: মোঃ সাকিব হাসান"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900 transition-colors"
                  />
                </div>

                {/* 2. Customer Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>
                      সচল মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (অর্ডার কনফার্মেশনের জন্য কল করা হবে)
                    </span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="017xxxxxxxx"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900 font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Delivery Area Selection (Radio Cards) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    ডেলিভারি এলাকা নির্বাচন করুন <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => handleAreaChange("inside")}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        formData.city.includes("Inside")
                          ? "border-[#df2d4d] bg-rose-50/40 text-slate-900 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="delivery_area"
                          checked={formData.city.includes("Inside")}
                          onChange={() => handleAreaChange("inside")}
                          className="accent-[#df2d4d] w-4 h-4"
                        />
                        <div>
                          <span className="text-xs font-bold block">ঢাকা সিটির ভেতরে</span>
                          <span className="text-[10px] text-slate-500">হোম ডেলিভারি (২ দিন)</span>
                        </div>
                      </div>
                      <span className="font-mono font-black text-xs text-[#df2d4d]">৳৭০</span>
                    </label>

                    <label
                      onClick={() => handleAreaChange("outside")}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        formData.city.includes("Outside")
                          ? "border-[#df2d4d] bg-rose-50/40 text-slate-900 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="delivery_area"
                          checked={formData.city.includes("Outside")}
                          onChange={() => handleAreaChange("outside")}
                          className="accent-[#df2d4d] w-4 h-4"
                        />
                        <div>
                          <span className="text-xs font-bold block">ঢাকা সিটির বাইরে</span>
                          <span className="text-[10px] text-slate-500">দেশব্যাপী কুরিয়ার (৩-৫ দিন)</span>
                        </div>
                      </div>
                      <span className="font-mono font-black text-xs text-[#df2d4d]">৳১৩০</span>
                    </label>
                  </div>
                </div>

                {/* 4. Full Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>
                      পূর্ণ ডেলিভারি ঠিকানা <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (বাসা নং, রোড নং, এলাকা/থানা, জেলা)
                    </span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="যেমন: বাসা ২৪, রোড ৭, সেক্টর ৩, উত্তরা, ঢাকা"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900 transition-colors"
                  />
                </div>

                {/* 5. Special Note (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    অর্ডার সংক্রান্ত বিশেষ কোনো নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="যেমন: বিকেলে ডেলিভারি করবেন বা ফোন করে আসবেন"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#df2d4d] focus:outline-none text-xs text-slate-900 transition-colors"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-sm sm:text-base font-black shadow-lg shadow-rose-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>অর্ডার প্রসেস হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                      <span>অর্ডার নিশ্চিত করুন — ৳{totalAmount.toLocaleString()} (ক্যাশ অন ডেলিভারি)</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
                  পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করার ১০০% নিশ্চয়তা
                </p>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-[#df2d4d] mr-2" />
          লোড হচ্ছে...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
