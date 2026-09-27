"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle,
  PhoneCall,
  Loader2,
  Receipt,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/api";
import { WhatsAppIcon, WHATSAPP_NUMBER } from "@/components/ui/WhatsAppButton";

export const CashOnDeliveryModal: React.FC = () => {
  const {
    cart,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    directCheckoutItem,
    closeDirectCheckout,
    subtotal: cartSubtotal,
  } = useCart();

  // If direct checkout with single item
  const checkoutItems = directCheckoutItem ? [directCheckoutItem] : cart;

  const subtotal = directCheckoutItem
    ? directCheckoutItem.product.sellPrice * directCheckoutItem.quantity
    : cartSubtotal;

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
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  if (!isCheckoutOpen) return null;

  const copyOrderId = (orderId: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(orderId);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2500);
    }
  };

  const handleCityChange = (val: string) => {
    setFormData({ ...formData, city: val });
    if (val.includes("Outside")) {
      setDeliveryCharge(130);
    } else {
      setDeliveryCharge(70);
    }
  };

  const handleClose = () => {
    setError("");
    setPlacedOrder(null);
    setCopiedOrderId(false);
    closeDirectCheckout();
    setIsCheckoutOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.customerName.trim()) {
      setError("অনুগ্রহ করে আপনার নাম লিখুন।");
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError("সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 01700000000)।");
      return;
    }
    if (!formData.address.trim()) {
      setError("অনুগ্রহ করে আপনার পূর্ণ ডেলিভারি ঠিকানা লিখুন।");
      return;
    }

    if (checkoutItems.length === 0) {
      setError("আপনার অর্ডার তালিকায় কোনো পণ্য নেই।");
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
        items: checkoutItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      const res = await createOrder(payload);

      if (res.success && res.order) {
        setPlacedOrder(res.order);
        if (!directCheckoutItem) {
          clearCart();
        }
      } else {
        setError(res.message || "অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      }
    } catch (err: any) {
      console.error("Order submit error:", err);
      setError("অর্ডার সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = subtotal + deliveryCharge;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-[#df2d4d] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-yellow-300" />
            <h2 className="text-base sm:text-lg font-black tracking-tight">
              {placedOrder ? "অর্ডার সম্পন্ন হয়েছে!" : "ক্যাশ অন ডেলিভারি অর্ডার"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {placedOrder ? (
            /* Order Placed Success View */
            <div className="text-center py-3 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  🎉 অভিনন্দন! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে
                </span>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
                  পণ্য হাতে পেয়ে মূল্য পরিশোধ করবেন। আমাদের প্রতিনিধি শীঘ্রই আপনার নম্বরে ({placedOrder.phone}) ফোন করে অর্ডার নিশ্চিত করবেন।
                </p>
              </div>

              {/* Order ID Box with Copy Button */}
              <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-3.5 max-w-md mx-auto flex items-center justify-between gap-3 shadow-xs">
                <div className="text-left">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    অর্ডার আইডি (Order ID)
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#df2d4d]">
                    {placedOrder.orderId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyOrderId(placedOrder.orderId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                    copiedOrderId
                      ? "bg-emerald-600 text-white"
                      : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-300"
                  }`}
                  title="অর্ডার আইডি কপি করুন"
                >
                  {copiedOrderId ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>আইডি কপি</span>
                    </>
                  )}
                </button>
              </div>

              {/* Order Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto text-xs space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">গ্রাহকের নাম:</span>
                  <span className="font-bold text-slate-800">{placedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">মোবাইল নম্বর:</span>
                  <span className="font-bold text-slate-800 font-mono">{placedOrder.phone}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">ঠিকানা:</span>
                  <span className="font-semibold text-slate-800">{placedOrder.address}, {placedOrder.city}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">পেমেন্ট মেথড:</span>
                  <span className="font-bold text-emerald-600">ক্যাশ অন ডেলিভারি (COD)</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1 text-slate-900">
                  <span>সর্বমোট প্রদেয় টাকা:</span>
                  <span className="text-[#df2d4d]">৳{placedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex flex-col gap-2.5 max-w-md mx-auto">
                {/* Track Order Button */}
                <button
                  type="button"
                  onClick={() => {
                    const id = placedOrder.orderId;
                    handleClose();
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("open-track-order", { detail: { query: id } }));
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Truck className="w-4 h-4 text-yellow-400" />
                  <span>অর্ডার লাইভ ট্র্যাক করুন (Live Tracking)</span>
                </button>

                <a
                  href={`https://wa.me/8801356584296?text=${encodeURIComponent(
                    `আসসালামু আলাইকুম, আমি GAXIN MART এ অর্ডার করেছি। আমার অর্ডার আইডি: ${placedOrder.orderId}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp এ অর্ডার আপডেট নিন ({WHATSAPP_NUMBER})</span>
                </a>

                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#df2d4d] hover:bg-[#b1001f] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  আরও কেনাকাটা করুন
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cash on Delivery Guarantee Banner */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-3 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">ক্যাশ অন ডেলিভারি (Cash on Delivery)</p>
                  <p className="text-emerald-700">
                    কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। ডেলিভারিম্যান থেকে পণ্য বুঝে নিয়ে মূল্য পরিশোধ করুন।
                  </p>
                </div>
              </div>

              {/* Items summary */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 mb-2">অর্ডার করা পণ্য সমূহ:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto divide-y divide-slate-100 pr-1">
                  {checkoutItems.map((item) => (
                    <div key={item.product._id} className="pt-1.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <div className="relative w-8 h-8 rounded bg-white border shrink-0 overflow-hidden">
                          <Image src={item.product.images[0] || ""} alt="" fill className="object-cover" />
                        </div>
                        <span className="font-medium text-slate-800 truncate">{item.product.name}</span>
                        <span className="text-slate-400 font-bold shrink-0">x{item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        ৳{(item.product.sellPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}

              {/* Input Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার নাম (Full Name) <span className="text-[#df2d4d]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="যেমন: মোঃ তানভীর হোসেন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মোবাইল নম্বর (Phone Number) <span className="text-[#df2d4d]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="যেমন: 017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ডেলিভারির পূর্ণ ঠিকানা (Full Address) <span className="text-[#df2d4d]">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="যেমন: বাড়ি #২৪, রোড #৭, সেক্টর #৩, উত্তরা, ঢাকা"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900 bg-white resize-none"
                  />
                </div>

                {/* City / Delivery Zone Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ডেলিভারি এরিয়া (Delivery Zone)
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleCityChange("Dhaka (Inside Dhaka)")}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                        formData.city.includes("Inside")
                          ? "border-[#df2d4d] bg-rose-50 text-[#df2d4d]"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <p>ঢাকা সিটির ভিতরে</p>
                      <p className="text-[11px] font-normal text-slate-500">ডেলিভারি চার্জ: ৳৭০</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCityChange("Outside Dhaka (সারা বাংলাদেশ)")}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                        formData.city.includes("Outside")
                          ? "border-[#df2d4d] bg-rose-50 text-[#df2d4d]"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <p>ঢাকার বাইরে</p>
                      <p className="text-[11px] font-normal text-slate-500">ডেলিভারি চার্জ: ৳১৩০</p>
                    </button>
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    বিশেষ কোনো নির্দেশনা থাকলে লিখুন (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="যেমন: বিকেলে ডেলিভারি দিন বা কল করে আসুন"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
                  />
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>পণ্য মূল্য (Subtotal):</span>
                  <span className="font-bold text-slate-800">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-slate-800">৳{deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>মোট প্রদেয় টাকা:</span>
                  <span className="text-[#df2d4d] text-xl">৳{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white font-black text-sm shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>অর্ডার প্রসেস হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span>অর্ডার নিশ্চিত করুন (৳{totalAmount.toLocaleString()} ক্যাশ অন ডেলিভারি)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
