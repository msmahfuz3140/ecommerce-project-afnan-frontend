"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { trackOrder } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { WhatsAppIcon, WHATSAPP_NUMBER } from "@/components/ui/WhatsAppButton";

function OrderTrackContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("id") || searchParams.get("phone") || searchParams.get("query") || "";

  const [query, setQuery] = useState(queryParam);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const performSearch = async (searchTerm: string) => {
    const q = searchTerm.trim();
    if (!q) return;

    try {
      setLoading(true);
      setError("");
      setOrders(null);
      const res = await trackOrder(q);

      const orderList =
        res.orders && Array.isArray(res.orders) && res.orders.length > 0
          ? res.orders
          : res.order
          ? [res.order]
          : [];

      if (orderList.length > 0) {
        setOrders(orderList);
      } else {
        setError(
          res.message ||
            "এই নম্বর বা অর্ডার আইডিতে কোনো অর্ডার পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার আইডি বা মোবাইল নম্বর দিন।"
        );
      }
    } catch (err: any) {
      setError("অর্ডার ট্র্যাকিং এ সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const copyToClipboard = (orderId: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(orderId);
      setCopiedId(orderId);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const statusSteps: Array<{ key: OrderStatus; label: string; icon: any; desc: string }> = [
    { key: "pending", label: "অর্ডার গ্রহণ", icon: Clock, desc: "অর্ডার রিসিভড" },
    { key: "in_progress", label: "প্রসেসিং", icon: Package, desc: "প্যাকিং চলছে" },
    { key: "in_courier", label: "কুরিয়ারে আছে", icon: Truck, desc: "ডেলিভারিম্যান হাতে" },
    { key: "delivered", label: "ডেলিভার্ড", icon: CheckCircle2, desc: "পণ্য পৌঁছে গেছে" },
  ];

  const getStepStatus = (currentStatus: OrderStatus, stepKey: OrderStatus) => {
    const orderIndexMap: Record<OrderStatus, number> = {
      pending: 0,
      in_progress: 1,
      in_courier: 2,
      delivered: 3,
      cancelled: -1,
    };

    const currentIdx = orderIndexMap[currentStatus] ?? 0;
    const stepIdx = orderIndexMap[stepKey] ?? 0;

    if (currentStatus === "cancelled") return "cancelled";
    if (stepIdx < currentIdx) return "completed";
    if (stepIdx === currentIdx) return "current";
    return "upcoming";
  };

  const samplePills = ["#GX-982410", "#GX-873912", "01356584296", "01712345678"];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#df2d4d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-[#fe4c6c] mx-auto shadow-inner">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            GAXIN MART অর্ডার ট্র্যাকিং
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            আপনার অর্ডারের বর্তমান অবস্থা জানতে অর্ডার আইডি অথবা অর্ডার দেওয়ার মোবাইল নম্বর দিন
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="অর্ডার আইডি (#GX-...) অথবা মোবাইল নম্বর (013...)"
                className="flex-1 px-4 py-3 rounded-2xl border-0 focus:ring-2 focus:ring-[#df2d4d] text-slate-900 text-xs sm:text-sm shadow-md bg-white outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>ট্র্যাক করুন</span>
              </button>
            </div>

            {/* Quick Pills */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-3">
              <span className="text-[11px] text-slate-400">উদাহরণ:</span>
              {samplePills.map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => {
                    setQuery(pill);
                    performSearch(pill);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-mono text-slate-200 transition-colors border border-white/10 cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">{error}</p>
              <p className="text-xs text-rose-600 mt-1">
                কোনো সমস্যা হলে সরাসরি আমাদের WhatsApp হেল্পলাইনে মেসেজ দিন:{" "}
                <a
                  href={`https://wa.me/880${WHATSAPP_NUMBER.slice(1)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold underline"
                >
                  {WHATSAPP_NUMBER}
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {orders && orders.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                অর্ডারের বিবরণ ({orders.length} টি অর্ডার পাওয়া গেছে)
              </h2>
            </div>

            {orders.map((ord) => {
              const isCopied = copiedId === ord.orderId;
              return (
                <div
                  key={ord._id || ord.orderId}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-5"
                >
                  {/* Top Bar with ID and Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xl sm:text-2xl font-black text-[#df2d4d] bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
                        {ord.orderId}
                      </span>

                      {/* Copy Button */}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(ord.orderId)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                          isCopied
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                        }`}
                        title="অর্ডার আইডি কপি করুন"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>কপি হয়েছে!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-600" />
                            <span>আইডি কপি</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        ord.status === "delivered"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : ord.status === "in_courier"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : ord.status === "in_progress"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : ord.status === "cancelled"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}
                    >
                      {ord.status === "pending"
                        ? "অর্ডার গৃহীত (Pending)"
                        : ord.status === "in_progress"
                        ? "প্রসেসিং হচ্ছে"
                        : ord.status === "in_courier"
                        ? "কুরিয়ারে রওয়ানা হয়েছে"
                        : ord.status === "delivered"
                        ? "ডেলিভারি সম্পন্ন"
                        : "বাতিল (Cancelled)"}
                    </span>
                  </div>

                  {/* Stepper */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {statusSteps.map((step) => {
                        const StepIcon = step.icon;
                        const state = getStepStatus(ord.status as OrderStatus, step.key);
                        return (
                          <div key={step.key} className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all shadow-md ${
                                state === "completed"
                                  ? "bg-emerald-600 text-white shadow-emerald-500/20"
                                  : state === "current"
                                  ? "bg-[#df2d4d] text-white ring-4 ring-rose-200 animate-pulse shadow-rose-500/30"
                                  : "bg-slate-100 text-slate-400 border border-slate-200"
                              }`}
                            >
                              <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <span
                              className={`text-xs font-bold ${
                                state === "current"
                                  ? "text-[#df2d4d]"
                                  : state === "completed"
                                  ? "text-emerald-700"
                                  : "text-slate-500"
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  {ord.items && ord.items.length > 0 && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-[#df2d4d]" />
                        <span>অর্ডার করা পণ্য তালিকা:</span>
                      </p>
                      <div className="divide-y divide-slate-200 space-y-2">
                        {ord.items.map((it: any, idx: number) => (
                          <div
                            key={idx}
                            className="pt-2 flex items-center justify-between text-xs sm:text-sm text-slate-800"
                          >
                            <div className="flex items-center gap-3 truncate pr-3">
                              {it.image && (
                                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                                  <Image src={it.image} alt="" fill className="object-cover" />
                                </div>
                              )}
                              <div className="truncate">
                                <p className="font-bold truncate">{it.name || "Product"}</p>
                                <p className="text-xs text-slate-400">পরিমাণ: {it.quantity} টি</p>
                              </div>
                            </div>
                            <span className="font-black text-slate-900 shrink-0">
                              ৳{(it.sellPrice * it.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="space-y-1.5">
                      <p>
                        <span className="text-slate-500">গ্রাহকের নাম:</span>{" "}
                        <span className="font-bold text-slate-800">{ord.customerName}</span>
                      </p>
                      <p>
                        <span className="text-slate-500">মোবাইল:</span>{" "}
                        <span className="font-bold text-slate-800 font-mono">{ord.phone}</span>
                      </p>
                      <p>
                        <span className="text-slate-500">ঠিকানা:</span>{" "}
                        <span className="font-semibold text-slate-800">{ord.address}, {ord.city}</span>
                      </p>
                    </div>
                    <div className="space-y-1.5 sm:text-right">
                      <p>
                        <span className="text-slate-500">পেমেন্ট মেথড:</span>{" "}
                        <span className="font-bold text-emerald-700">ক্যাশ অন ডেলিভারি (COD)</span>
                      </p>
                      <p>
                        <span className="text-slate-500">ডেলিভারি চার্জ:</span>{" "}
                        <span className="font-semibold text-slate-800">৳{ord.deliveryCharge || 70}</span>
                      </p>
                      <p className="text-sm font-black text-slate-900 pt-1">
                        <span>সর্বমোট প্রদেয়:</span>{" "}
                        <span className="text-[#df2d4d]">৳{ord.totalAmount?.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp Support Button */}
                  <a
                    href={`https://wa.me/880${WHATSAPP_NUMBER.slice(1)}?text=${encodeURIComponent(
                      `আসসালামু আলাইকুম, আমি GAXIN MART এ করা অর্ডার (${ord.orderId}) এর আপডেট জানতে চাচ্ছি।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp এ এই অর্ডারের তথ্য জানুন ({WHATSAPP_NUMBER})</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function OrderTrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#df2d4d]" />
          <p className="text-xs font-semibold">ট্র্যাকিং তথ্য লোড হচ্ছে...</p>
        </div>
      }
    >
      <OrderTrackContent />
    </Suspense>
  );
}
