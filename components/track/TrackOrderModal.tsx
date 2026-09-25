"use client";

import React, { useState } from "react";
import { X, Search, Truck, Package, CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";
import { trackOrder } from "@/lib/api";
import { Order, OrderStatus } from "@/types";

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      setOrders(null);
      const res = await trackOrder(query.trim());

      if (res.success && res.orders && res.orders.length > 0) {
        setOrders(res.orders);
      } else {
        setError("এই নম্বর বা অর্ডার আইডিতে কোনো অর্ডার পাওয়া যায়নি।");
      }
    } catch (err: any) {
      setError("অর্ডার ট্র্যাকিং এ সমস্যা হয়েছে। সঠিক নম্বর বা আইডি দিন।");
    } finally {
      setLoading(false);
    }
  };

  const statusSteps: Array<{ key: OrderStatus; label: string; icon: any }> = [
    { key: "pending", label: "অর্ডার গ্রহণ", icon: Clock },
    { key: "in_progress", label: "প্রসেসিং", icon: Package },
    { key: "in_courier", label: "কুরিয়ারে আছে", icon: Truck },
    { key: "delivered", label: "ডেলিভার্ড", icon: CheckCircle2 },
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#df2d4d]" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              অর্ডার ট্র্যাকিং (Track Order)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="মোবাইল নম্বর (017...) অথবা অর্ডার আইডি (#AUR-...) দিন"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#df2d4d] hover:bg-[#b1001f] text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>খুঁজুন</span>
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Orders Results */}
          {orders && orders.length > 0 && (
            <div className="space-y-4 pt-2">
              {orders.map((ord) => (
                <div key={ord._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#df2d4d]">{ord.orderId}</span>
                      <p className="text-[11px] text-slate-500">
                        {new Date(ord.createdAt).toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-800">
                      {ord.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Visual Status Tracker */}
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-1">
                    {statusSteps.map((step) => {
                      const StepIcon = step.icon;
                      const state = getStepStatus(ord.status, step.key);
                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                              state === "completed"
                                ? "bg-emerald-600 text-white"
                                : state === "current"
                                ? "bg-[#df2d4d] text-white ring-4 ring-rose-200 animate-pulse"
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            <StepIcon className="w-4 h-4" />
                          </div>
                          <span
                            className={`font-semibold ${
                              state === "current" ? "text-[#df2d4d] font-bold" : "text-slate-600"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                    <p>
                      <span className="font-semibold text-slate-800">গ্রাহক:</span> {ord.customerName} ({ord.phone})
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">ডেলিভারি ঠিকানা:</span> {ord.address}, {ord.city}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">সর্বমোট প্রদেয়:</span>{" "}
                      <span className="font-bold text-slate-900">৳{ord.totalAmount?.toLocaleString()}</span> (ক্যাশ অন ডেলিভারি)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
