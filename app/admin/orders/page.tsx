"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Package,
  Search,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Eye,
  X,
  Loader2,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import { adminGetOrders, adminUpdateOrderStatus } from "@/lib/api";
import { Order, OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    all: 0,
    pending: 0,
    in_progress: 0,
    in_courier: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [activeTab, setActiveTab] = useState<string>("pending"); // Default to pending as requested
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Selected Order for Large Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [statusNote, setStatusNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");

  const loadOrders = async (tab: string, searchQuery: string) => {
    setLoading(true);
    try {
      const res = await adminGetOrders({
        status: tab !== "all" ? tab : undefined,
        search: searchQuery || undefined,
      });

      if (res.success && res.orders) {
        setOrders(res.orders);
        if (res.statusCounts) {
          setStatusCounts(res.statusCounts);
        }
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(activeTab, search);
  }, [activeTab, search]);

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote("");
    setUpdateSuccess("");
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    setUpdateSuccess("");
    try {
      const res = await adminUpdateOrderStatus(selectedOrder._id, newStatus, statusNote);
      if (res.success && res.order) {
        setUpdateSuccess(`স্ট্যাটাস সফলভাবে "${newStatus}" এ পরিবর্তন করা হয়েছে!`);
        setSelectedOrder(res.order);
        // Refresh list
        loadOrders(activeTab, search);
      }
    } catch (err: any) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const statusConfig: Record<OrderStatus, { label: string; badge: string; icon: any }> = {
    pending: { label: "পেন্ডিং (Pending)", badge: "bg-amber-100 text-amber-800 border-amber-300", icon: Clock },
    in_progress: { label: "ইন প্রগ্রেস (In Progress)", badge: "bg-blue-100 text-blue-800 border-blue-300", icon: Package },
    in_courier: { label: "কুরিয়ারে আছে (In Courier)", badge: "bg-purple-100 text-purple-800 border-purple-300", icon: Truck },
    delivered: { label: "ডেলিভার্ড (Delivered)", badge: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: CheckCircle2 },
    cancelled: { label: "বাতিল (Cancelled)", badge: "bg-rose-100 text-rose-800 border-rose-300", icon: XCircle },
  };

  const tabs: Array<{ id: string; label: string; count: number; color?: string }> = [
    { id: "pending", label: "🟡 পেন্ডিং তালিকা (Pending)", count: statusCounts.pending || 0 },
    { id: "in_progress", label: "🔵 ইন প্রগ্রেস (Processing)", count: statusCounts.in_progress || 0 },
    { id: "in_courier", label: "🟣 কুরিয়ারে আছে (Courier)", count: statusCounts.in_courier || 0 },
    { id: "delivered", label: "🟢 ডেলিভার্ড (Delivered)", count: statusCounts.delivered || 0 },
    { id: "cancelled", label: "🔴 বাতিল (Cancelled)", count: statusCounts.cancelled || 0 },
    { id: "all", label: "সকল অর্ডার (All)", count: statusCounts.all || 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-[#df2d4d]" />
            অর্ডার ম্যানেজমেন্ট ও পেন্ডিং তালিকা
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            নতুন অর্ডার সমূহ চেক করুন, আইডিতে ক্লিক করে বিস্তারিত দেখুন এবং স্ট্যাটাস পরিবর্তন করুন
          </p>
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="গ্রাহকের নাম, ফোন বা অর্ডার আইডি..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs text-slate-900 bg-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === tab.id
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.id
                  ? "bg-[#df2d4d] text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#df2d4d]" />
            <p className="text-xs font-semibold">অর্ডার লোড হচ্ছে...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো অর্ডার পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === "pending"
                ? "বর্তমানে কোনো পেন্ডিং অর্ডার নেই।"
                : "অন্য ট্যাবে চেক করুন বা নতুন অর্ডার আসার অপেক্ষা করুন।"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (Visible on small screens < md) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {orders.map((ord) => {
                const conf = statusConfig[ord.status] || statusConfig.pending;
                const StatusIcon = conf.icon;
                return (
                  <div
                    key={ord._id}
                    onClick={() => openOrderDetails(ord)}
                    className="p-4 hover:bg-rose-50/20 active:bg-rose-50/40 transition-colors cursor-pointer space-y-3"
                  >
                    {/* Top Row: Order ID + Status */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-black text-sm text-[#df2d4d]">
                          {ord.orderId}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString("bn-BD")} • {new Date(ord.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${conf.badge}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {conf.label.split(" ")[0]}
                      </span>
                    </div>

                    {/* Customer Row */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{ord.customerName}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{ord.address}, {ord.city}</p>
                      </div>
                      <a
                        href={`tel:${ord.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 font-mono text-[11px] font-bold border border-emerald-200 shrink-0 ml-2"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </a>
                    </div>

                    {/* Financial & Items Summary */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <span className="text-slate-400 text-[10px] block">পণ্য সংখ্যা</span>
                        <span className="font-bold text-slate-700">
                          {ord.items?.reduce((s, i) => s + i.quantity, 0) || 0} টি
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">নিট লাভ</span>
                        <span className="font-black text-emerald-600">
                          +৳{ord.totalProfit?.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">সর্বমোট বিল (COD)</span>
                        <span className="font-black text-slate-900 text-sm">
                          ৳{ord.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openOrderDetails(ord);
                      }}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-[#df2d4d] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>বিস্তারিত ও স্ট্যাটাস পরিবর্তন</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop & Tablet Table (Visible on md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">অর্ডার আইডি</th>
                    <th className="py-3.5 px-4">তারিখ ও সময়</th>
                    <th className="py-3.5 px-4">গ্রাহকের নাম ও ফোন</th>
                    <th className="py-3.5 px-4">পণ্য সংখ্যা</th>
                    <th className="py-3.5 px-4">মোট বিল (COD)</th>
                    <th className="py-3.5 px-4">নিট লাভ</th>
                    <th className="py-3.5 px-4">বর্তমান স্ট্যাটাস</th>
                    <th className="py-3.5 px-4 text-right">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => {
                    const conf = statusConfig[ord.status] || statusConfig.pending;
                    const StatusIcon = conf.icon;
                    return (
                      <tr
                        key={ord._id}
                        className="hover:bg-rose-50/30 transition-colors group cursor-pointer"
                        onClick={() => openOrderDetails(ord)}
                      >
                        {/* Order ID - Big Clickable */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-black text-sm text-[#df2d4d] group-hover:underline">
                            {ord.orderId}
                          </span>
                          <span className="block text-[10px] text-slate-400">ক্লিক করে দেখুন</span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="font-medium">
                            {new Date(ord.createdAt).toLocaleDateString("bn-BD")}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{ord.customerName}</p>
                          <a
                            href={`tel:${ord.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] text-slate-500 hover:text-[#df2d4d] flex items-center gap-1 font-mono"
                          >
                            <Phone className="w-3 h-3" />
                            {ord.phone}
                          </a>
                        </td>

                        {/* Items */}
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">
                          {ord.items?.reduce((s, i) => s + i.quantity, 0) || 0} টি
                        </td>

                        {/* Total */}
                        <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                          ৳{ord.totalAmount?.toLocaleString()}
                        </td>

                        {/* Profit */}
                        <td className="py-3.5 px-4 font-black text-emerald-600">
                          +৳{ord.totalProfit?.toLocaleString()}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${conf.badge}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {conf.label.split(" ")[0]}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openOrderDetails(ord);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#df2d4d] hover:text-white text-slate-700 text-xs font-bold transition-all inline-flex items-center gap-1 shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>বিস্তারিত</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ================= LARGE CUSTOMER ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#df2d4d]">
                    {selectedOrder.orderId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white uppercase">
                    {selectedOrder.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  অর্ডার সময়: {new Date(selectedOrder.createdAt).toLocaleString("bn-BD")}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {updateSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{updateSuccess}</span>
                </div>
              )}

              {/* 1. Customer & Delivery Info Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2 text-[11px]">
                    গ্রাহকের বিবরণ (Customer Details)
                  </h4>
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-slate-900">{selectedOrder.customerName}</p>
                    <p className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-[#df2d4d]" />
                      <a href={`tel:${selectedOrder.phone}`} className="font-bold font-mono text-[#df2d4d] hover:underline">
                        {selectedOrder.phone}
                      </a>
                      <span className="text-[10px] text-slate-400">(সরাসরি কল করুন)</span>
                    </p>
                    <p className="text-slate-500">পেমেন্ট মেথড: <span className="font-bold text-slate-800">ক্যাশ অন ডেলিভারি (COD)</span></p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2 text-[11px]">
                    ডেলিভারি ঠিকানা ও নোট (Address)
                  </h4>
                  <div className="space-y-1.5 text-slate-700">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <span>{selectedOrder.address}, {selectedOrder.city}</span>
                    </p>
                    {selectedOrder.note && (
                      <p className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                        <strong>নোট:</strong> {selectedOrder.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Ordered Items Table with Profit Calculation */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 p-3 font-bold text-xs text-slate-800 flex justify-between items-center">
                  <span>অর্ডার করা পণ্যের তালিকা</span>
                  <span className="text-emerald-700">লাভের হিসাব সহ</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase border-b text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">পণ্য</th>
                        <th className="py-2.5 px-3">পরিমাণ</th>
                        <th className="py-2.5 px-3">ক্রয়মূল্য (Buy)</th>
                        <th className="py-2.5 px-3">বিক্রয়মূল্য (Sell)</th>
                        <th className="py-2.5 px-3">সাবটোটাল</th>
                        <th className="py-2.5 px-3">লাভ (Profit)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 flex items-center gap-2">
                            {item.image && (
                              <div className="relative w-8 h-8 rounded bg-slate-100 border shrink-0 overflow-hidden">
                                <Image src={item.image} alt="" fill className="object-cover" />
                              </div>
                            )}
                            <span className="font-semibold text-slate-900">{item.name}</span>
                          </td>
                          <td className="py-2.5 px-3 font-bold">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-amber-700 font-mono">৳{item.buyPrice}</td>
                          <td className="py-2.5 px-3 font-mono font-bold">৳{item.sellPrice}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">৳{item.subtotal}</td>
                          <td className="py-2.5 px-3 font-black text-emerald-600">+৳{item.profit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <div className="text-slate-600 space-x-3">
                    <span>পণ্য ক্রয় খরচ: <strong className="text-amber-700">৳{selectedOrder.totalBuyCost?.toLocaleString()}</strong></span>
                    <span>ডেলিভারি চার্জ: <strong>৳{selectedOrder.deliveryCharge}</strong></span>
                  </div>
                  <div className="space-x-3">
                    <span className="font-bold text-slate-800">মোট বিল: <strong>৳{selectedOrder.totalAmount?.toLocaleString()}</strong></span>
                    <span className="font-black text-emerald-700 text-sm bg-emerald-100 px-2.5 py-1 rounded-lg">
                      নিট লাভ: +৳{selectedOrder.totalProfit?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Interactive Status Updater Controller */}
              <form onSubmit={handleStatusUpdate} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                <h4 className="font-bold text-xs text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#df2d4d]" />
                  অর্ডার স্ট্যাটাস পরিবর্তন করুন (Change Status)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      নতুন স্ট্যাটাস সিলেক্ট করুন:
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs bg-white text-slate-800 focus:outline-none focus:border-[#df2d4d]"
                    >
                      <option value="pending">🟡 পেন্ডিং (Pending)</option>
                      <option value="in_progress">🔵 ইন প্রগ্রেস / প্যাকেজিং (In Progress)</option>
                      <option value="in_courier">🟣 কুরিয়ারে হস্তান্তর করা হয়েছে (In Courier)</option>
                      <option value="delivered">🟢 সফলভাবে ডেলিভারি সম্পন্ন (Delivered)</option>
                      <option value="cancelled">🔴 বাতিল করা হয়েছে (Cancelled)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      স্ট্যাটাস আপডেট নোট (ঐচ্ছিক):
                    </label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="যেমন: Steadfast Tracking #SF849283"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:border-[#df2d4d]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2.5 rounded-xl bg-[#df2d4d] hover:bg-[#b1001f] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>আপডেট হচ্ছে...</span>
                    </>
                  ) : (
                    <span>স্ট্যাটাস আপডেট নিশ্চিত করুন</span>
                  )}
                </button>
              </form>

              {/* 4. Status History Timeline */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-xs text-slate-700">স্ট্যাটাস পরিবর্তনের ইতিহাস (Audit Log):</h4>
                  <div className="space-y-1.5">
                    {selectedOrder.statusHistory.map((hist, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-bold uppercase text-[#df2d4d]">{hist.status.replace("_", " ")}</span>
                        <span className="text-slate-500 italic">{hist.note || "No note"}</span>
                        <span className="text-slate-400 font-mono">
                          {new Date(hist.changedAt).toLocaleString("bn-BD")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
