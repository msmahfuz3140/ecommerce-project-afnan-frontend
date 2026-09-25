"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
    closeDirectCheckout,
  } = useCart();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    closeDirectCheckout();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#df2d4d]" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                আপনার কার্ট ({totalItems} টি পণ্য)
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-300 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-700">আপনার কার্ট খালি!</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  পছন্দের পণ্য খুঁজে কার্টে যোগ করুন বা সরাসরি ১-ক্লিক ক্যাশ অন ডেলিভারিতে অর্ডার করুন।
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-5 py-2 rounded-full bg-[#df2d4d] text-white text-xs font-bold shadow-md hover:bg-[#b1001f] transition-colors"
                >
                  কেনাকাটা শুরু করুন
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product._id} className="py-3.5 flex gap-3 sm:gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                    <Image
                      src={item.product.images[0] || ""}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs font-black text-[#df2d4d] mt-0.5">
                      ৳{item.product.sellPrice.toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-slate-200 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-slate-200 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        = ৳{(item.product.sellPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>পণ্য মূল্য (Subtotal):</span>
                <span className="font-bold text-slate-800">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-semibold text-emerald-600">চেকআউট পেজে সিলেক্ট করুন</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>সর্বমোট:</span>
                <span className="text-xl text-[#df2d4d]">৳{subtotal.toLocaleString()}</span>
              </div>

              <div className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold p-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ক্যাশ অন ডেলিভারি (কোনো অগ্রিম পেমেন্ট লাগবে না)</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 active:scale-97 transition-all"
              >
                <span>অর্ডার করতে এগিয়ে যান (ক্যাশ অন ডেলিভারি)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
