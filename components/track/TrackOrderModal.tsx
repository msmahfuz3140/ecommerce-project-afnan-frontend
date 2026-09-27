"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { trackOrder } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

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
      setError("অর্ডার ট্র্যাকিং এ সমস্যা হয়েছে। সঠিক নম্বর বা আইডি দিয়ে পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(query);
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

  const quickPills = ["#GX-982410", "#GX-873912", "01356584296", "01712345678"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Truck className="w-4 h-4 text-[#fe4c6c]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                অর্ডার ট্র্যাকিং (Track Order)
              </h2>
              <p className="text-[11px] text-slate-400">GAXIN MART লাইভ অর্ডার স্ট্যাটাস জানুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Search Form */}
          <form onSubmit={handleTrack} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="মোবাইল নম্বর (013...) অথবা অর্ডার আইডি (#GX-...) দিন"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:ring-2 focus:ring-rose-100 focus:outline-none text-xs sm:text-sm text-slate-900 bg-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>ট্র্যাক করুন</span>
              </button>
            </div>

            {/* Quick Suggestions / Sample Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] text-slate-400">উদাহরণ:</span>
              {quickPills.map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => {
                    setQuery(pill);
                    performSearch(pill);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-[#df2d4d] text-[11px] font-mono text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          </form>

          {/* Error Notice */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">{error}</p>
                <p className="text-[11px] text-rose-600 mt-0.5">
                  সরাসরি সহায়তার জন্য WhatsApp এ মেসেজ দিন:{" "}
                  <a
                    href="https://wa.me/8801356584296"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline"
                  >
                    01356584296
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Orders Results */}
          {orders && orders.length > 0 && (
            <div className="space-y-4 pt-1">
              <p className="text-xs font-bold text-slate-500">
                {orders.length} টি অর্ডার পাওয়া গেছে:
              </p>

              {orders.map((ord) => {
                const isCopied = copiedId === ord.orderId;
                return (
                  <div
                    key={ord._id || ord.orderId}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 hover:border-slate-300 transition-all"
                  >
                    {/* Order ID & Copy Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base sm:text-lg text-[#df2d4d] bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                          {ord.orderId}
                        </span>

                        {/* Copy Order ID Button */}
                        <button
                          type="button"
                          onClick={() => copyToClipboard(ord.orderId)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isCopied
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          }`}
                          title="অর্ডার আইডি কপি করুন"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>কপি হয়েছে!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>কপি</span>
                            </>
                          )}
                        </button>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
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

                    {/* Visual Status Stepper */}
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] pt-1 pb-1">
                      {statusSteps.map((step) => {
                        const StepIcon = step.icon;
                        const state = getStepStatus(ord.status as OrderStatus, step.key);
                        return (
                          <div key={step.key} className="flex flex-col items-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-all shadow-sm ${
                                state === "completed"
                                  ? "bg-emerald-600 text-white"
                                  : state === "current"
                                  ? "bg-[#df2d4d] text-white ring-4 ring-rose-200 animate-pulse"
                                  : "bg-slate-100 text-slate-400 border border-slate-200"
                              }`}
                            >
                              <StepIcon className="w-4 h-4" />
                            </div>
                            <span
                              className={`font-bold ${
                                state === "current"
                                  ? "text-[#df2d4d]"
                                  : state === "completed"
                                  ? "text-emerald-700"
                                  : "text-slate-500"
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[9px] text-slate-400 hidden sm:block mt-0.5">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Ordered Items Preview */}
                    {ord.items && ord.items.length > 0 && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                        <p className="text-[11px] font-bold text-slate-700">অর্ডারকৃত পণ্য:</p>
                        <div className="space-y-1.5 max-h-28 overflow-y-auto">
                          {ord.items.map((it: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs text-slate-700"
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                {it.image && (
                                  <div className="relative w-7 h-7 rounded overflow-hidden bg-white border border-slate-200 shrink-0">
                                    <Image src={it.image} alt="" fill className="object-cover" />
                                  </div>
                                )}
                                <span className="truncate font-medium">{it.name || "Product"}</span>
                                <span className="font-bold text-slate-400 shrink-0">x{it.quantity}</span>
                              </div>
                              <span className="font-bold text-slate-900 shrink-0">
                                ৳{(it.sellPrice * it.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Customer & Address Details */}
                    <div className="text-xs text-slate-600 space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">গ্রাহক:</span>
                        <span className="font-bold text-slate-800">
                          {ord.customerName} ({ord.phone})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">ঠিকানা:</span>
                        <span className="font-medium text-slate-800 text-right max-w-xs">
                          {ord.address}, {ord.city}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">সর্বমোট প্রদেয়:</span>
                        <span className="font-black text-slate-900 text-sm">
                          ৳{ord.totalAmount?.toLocaleString()}{" "}
                          <span className="text-[10px] font-normal text-emerald-600 font-sans">
                            (ক্যাশ অন ডেলিভারি)
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Direct WhatsApp Action for this order */}
                    <a
                      href={`https://wa.me/8801356584296?text=${encodeURIComponent(
                        `আসসালামু আলাইকুম, আমি GAXIN MART এ করা অর্ডার (${ord.orderId}) সম্পর্কে জানতে চাচ্ছি।`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>WhatsApp এ এই অর্ডারের তথ্য জানুন (01356584296)</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
