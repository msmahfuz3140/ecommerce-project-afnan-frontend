"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  Sparkles,
  Shirt,
  Loader2,
} from "lucide-react";
import { adminGetAnalytics } from "@/lib/api";
import { AnalyticsResponse } from "@/types";

export default function AdminDashboardPage() {
  const [range, setRange] = useState("7days");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await adminGetAnalytics(selectedRange);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics(range);
  }, [range]);

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalBuyCost: 0,
    totalProfit: 0,
    profitMargin: 0,
    totalOrders: 0,
    statusCounts: { pending: 0, in_progress: 0, in_courier: 0, delivered: 0, cancelled: 0 },
  };

  const categoryNames: Record<string, { label: string; icon: any; color: string }> = {
    electronics: { label: "ইলেকট্রনিক্স (Electronics)", icon: Zap, color: "text-blue-600 bg-blue-50" },
    cosmetics: { label: "কসমেটিক্স (Cosmetics)", icon: Sparkles, color: "text-pink-600 bg-pink-50" },
    fashion: { label: "ফ্যাশন (Fashion)", icon: Shirt, color: "text-amber-600 bg-amber-50" },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header with Time Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#df2d4d]" />
            লাভ-ক্ষতি ও বিক্রয় হিসাব (Profit & Loss)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            পণ্য কেনার খরচ, বিক্রয়মূল্য এবং নিট লাভের সম্পূর্ণ রিয়েল-টাইম হিসাব
          </p>
        </div>

        {/* Filter Buttons: 7 Days / 30 Days / All Time */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-300 shadow-xs self-stretch sm:self-auto">
          <button
            onClick={() => setRange("7days")}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              range === "7days"
                ? "bg-[#df2d4d] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            গত ৭ দিন
          </button>
          <button
            onClick={() => setRange("30days")}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              range === "30days"
                ? "bg-[#df2d4d] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            গত ৩০ দিন
          </button>
          <button
            onClick={() => setRange("all")}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              range === "all"
                ? "bg-[#df2d4d] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            সর্বমোট (All Time)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#df2d4d]" />
          <p className="text-xs font-semibold">হিসাব গণনা করা হচ্ছে...</p>
        </div>
      ) : (
        <>
          {/* Main 4 KPI Financial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Revenue Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">মোট বিক্রয় (Revenue)</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  ৳
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  ৳{metrics.totalRevenue.toLocaleString()}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  ক্যাশ অন ডেলিভারিতে বিক্রিত পণ্যের মোট মূল্য
                </p>
              </div>
            </div>

            {/* 2. Total Buy Cost Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">মোট ক্রয়মূল্য (Cost)</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl sm:text-3xl font-black text-amber-700">
                  ৳{metrics.totalBuyCost.toLocaleString()}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  পণ্য কেনার পাইকারি বা উৎপাদন খরচ (কতো দিয়ে কেনা)
                </p>
              </div>
            </div>

            {/* 3. Net Profit Card (Hero Card) */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-lg shadow-emerald-600/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                  নিট লাভ (Net Profit)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                  {metrics.profitMargin}% মার্জিন
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  +৳{metrics.totalProfit.toLocaleString()}
                </h3>
                <p className="text-[11px] text-emerald-100 mt-1">
                  বিক্রয়মূল্য - ক্রয়মূল্য (সম্পূর্ণ লাভ)
                </p>
              </div>
            </div>

            {/* 4. Orders Summary Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">অর্ডার সারসংক্ষেপ</span>
                <Link
                  href="/admin/orders"
                  className="text-[11px] font-bold text-[#df2d4d] hover:underline"
                >
                  সব দেখুন →
                </Link>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {metrics.totalOrders}
                  </h3>
                  <span className="text-xs text-slate-500">টি অর্ডার সম্পন্ন</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-bold text-amber-700">
                    {metrics.statusCounts?.pending || 0} টি পেন্ডিং অর্ডার আছে
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Category-wise Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Performance Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    ক্যাটাগরি অনুযায়ী লাভ ও বিক্রয় (Category Profit Breakdown)
                  </h3>
                  <p className="text-xs text-slate-500">
                    কোন ক্যাটাগরিতে কেমন লাভ ও বিক্রি হয়েছে
                  </p>
                </div>
                <Layers className="w-5 h-5 text-slate-400" />
              </div>

              {data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {data.categoryBreakdown.map((cat) => {
                    const info = categoryNames[cat._id] || {
                      label: cat._id,
                      icon: Layers,
                      color: "text-slate-700 bg-slate-100",
                    };
                    const Icon = info.icon;
                    const catMargin = cat.revenue > 0 ? ((cat.profit / cat.revenue) * 100).toFixed(1) : "0";

                    return (
                      <div
                        key={cat._id}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${info.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-800">{info.label}</h4>
                            <p className="text-xs text-slate-500">{cat.itemsSold} টি পণ্য বিক্রি হয়েছে</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">বিক্রয় (Sell)</p>
                            <p className="text-xs font-bold text-slate-800">৳{cat.revenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">ক্রয় (Cost)</p>
                            <p className="text-xs font-bold text-amber-700">৳{cat.cost.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-emerald-600 uppercase font-bold">নিট লাভ ({catMargin}%)</p>
                            <p className="text-sm font-black text-emerald-700">+৳{cat.profit.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  নির্বাচিত সময়ে কোনো বিক্রয় তথ্য পাওয়া যায়নি।
                </div>
              )}
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">অর্ডার স্ট্যাটাস</h3>
                <Package className="w-5 h-5 text-slate-400" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-900">পেন্ডিং অর্ডার (Pending)</span>
                  </div>
                  <span className="font-mono font-bold text-amber-900 bg-white px-2 py-0.5 rounded shadow-xs text-xs">
                    {metrics.statusCounts?.pending || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-900">ইন প্রগ্রেস (In Progress)</span>
                  </div>
                  <span className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded shadow-xs text-xs">
                    {metrics.statusCounts?.in_progress || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-purple-900">কুরিয়ারে আছে (In Courier)</span>
                  </div>
                  <span className="font-mono font-bold text-purple-900 bg-white px-2 py-0.5 rounded shadow-xs text-xs">
                    {metrics.statusCounts?.in_courier || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-900">ডেলিভারি সম্পন্ন (Delivered)</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded shadow-xs text-xs">
                    {metrics.statusCounts?.delivered || 0}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/admin/orders"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#df2d4d] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>অর্ডার ম্যানেজ করুন</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Daily Trend Table */}
          {data?.dailyTrend && data.dailyTrend.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    দৈনিক লাভ-ক্ষতি ও বিক্রয় টেবিল (Daily Sales & Profit Log)
                  </h3>
                  <p className="text-xs text-slate-500">প্রতিদিনের বিক্রয়, খরচ এবং নিট লাভের হিসাব</p>
                </div>
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">তারিখ (Date)</th>
                      <th className="py-3 px-4">মোট অর্ডার</th>
                      <th className="py-3 px-4">মোট বিক্রয় (Revenue)</th>
                      <th className="py-3 px-4">মোট খরচ (Cost)</th>
                      <th className="py-3 px-4">নিট লাভ (Net Profit)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.dailyTrend.map((day) => (
                      <tr key={day._id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{day._id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-600">{day.orders} টি</td>
                        <td className="py-3 px-4 font-bold text-slate-900">৳{day.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 font-semibold text-amber-700">৳{day.cost.toLocaleString()}</td>
                        <td className="py-3 px-4 font-black text-emerald-600">+৳{day.profit.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
