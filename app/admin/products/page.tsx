"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  X,
  CheckCircle2,
  Search,
  Sparkles,
  Percent,
  TrendingUp,
  ShieldCheck,
  EyeOff,
  Clock,
  Calendar,
} from "lucide-react";
import {
  fetchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadMedia,
} from "@/lib/api";
import { Product } from "@/types";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

export const ADMIN_CATEGORIES = [
  { id: "mens-fashion", label: "👔 Men's Fashion (পুরুষদের ফ্যাশন)" },
  { id: "womens-fashion", label: "👗 Women's Fashion (মহিলাদের ফ্যাশন)" },
  { id: "home-lifestyle", label: "🏠 Home & Lifestyle (হোম ও লাইফস্টাইল)" },
  { id: "gadgets-electronics", label: "⚡ Gadgets & Electronics (গ্যাজেটস ও ইলেকট্রনিক্স)" },
  { id: "others", label: "📦 Other's (অন্যান্য সামগ্রী)" },
  { id: "kids-zone", label: "🧸 Kids Zone (কিডস জোন)" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const formatForDateTimeInput = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    category: "mens-fashion",
    subCategory: "",
    buyPrice: "",
    sellPrice: "",
    originalPrice: "",
    discountPercent: "",
    stock: "50",
    description: "",
    image: "",
    isOffer: false,
    offerBadge: "",
    offerEndTime: "",
  });

  const loadProductsList = async (targetCategory?: string, targetSearch?: string, isSilent = false) => {
    if (!isSilent && products.length === 0) {
      setLoading(true);
    }
    const cat = targetCategory !== undefined ? targetCategory : categoryFilter;
    const q = targetSearch !== undefined ? targetSearch : search;

    try {
      const res = await fetchProducts({
        category: cat !== "all" ? cat : undefined,
        search: q || undefined,
      });
      if (res && res.products && Array.isArray(res.products)) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsList(categoryFilter, search);
  }, [categoryFilter, search]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "mens-fashion",
      subCategory: "",
      buyPrice: "",
      sellPrice: "",
      originalPrice: "",
      discountPercent: "",
      stock: "50",
      description: "",
      image: "",
      isOffer: false,
      offerBadge: "",
      offerEndTime: "",
    });
    setMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    const orig = prod.originalPrice || 0;
    const sell = prod.sellPrice || 0;
    const disc = orig > sell && orig > 0 ? Math.round(((orig - sell) / orig) * 100) : 0;

    setFormData({
      name: prod.name,
      category: prod.category || "mens-fashion",
      subCategory: prod.subCategory || "",
      buyPrice: String(prod.buyPrice ?? ""),
      sellPrice: String(prod.sellPrice || ""),
      originalPrice: String(prod.originalPrice || ""),
      discountPercent: disc > 0 ? String(disc) : "",
      stock: String(prod.stock || "50"),
      description: prod.description || "",
      image: prod.images[0] || "",
      isOffer: prod.isOffer || false,
      offerBadge: prod.offerBadge || (disc > 0 ? `${disc}% OFF` : ""),
      offerEndTime: formatForDateTimeInput(prod.offerEndTime),
    });
    setMessage("");
    setIsModalOpen(true);
  };

  const setQuickOfferDuration = (hours: number) => {
    const target = new Date(Date.now() + hours * 3600000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatted = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
    setFormData((prev) => ({
      ...prev,
      isOffer: true,
      offerEndTime: formatted,
    }));
  };

  // Two-way price and discount percentage calculations
  const handleOriginalPriceChange = (val: string) => {
    const orig = Number(val);
    const disc = Number(formData.discountPercent);

    if (orig > 0 && disc > 0) {
      const calculatedSell = Math.round(orig * (1 - disc / 100));
      setFormData((prev) => ({
        ...prev,
        originalPrice: val,
        sellPrice: String(calculatedSell),
      }));
    } else {
      setFormData((prev) => ({ ...prev, originalPrice: val }));
    }
  };

  const handleDiscountPercentChange = (val: string) => {
    const disc = Number(val);
    const orig = Number(formData.originalPrice);

    if (orig > 0 && disc >= 0 && disc <= 100) {
      const calculatedSell = Math.round(orig * (1 - disc / 100));
      setFormData((prev) => ({
        ...prev,
        discountPercent: val,
        sellPrice: String(calculatedSell),
        offerBadge: disc > 0 ? `${disc}% OFF` : prev.offerBadge,
        isOffer: disc > 0 ? true : prev.isOffer,
      }));
    } else {
      setFormData((prev) => ({ ...prev, discountPercent: val }));
    }
  };

  const handleSellPriceChange = (val: string) => {
    const sell = Number(val);
    const orig = Number(formData.originalPrice);

    if (orig > sell && orig > 0) {
      const disc = Math.round(((orig - sell) / orig) * 100);
      setFormData((prev) => ({
        ...prev,
        sellPrice: val,
        discountPercent: String(disc),
        offerBadge: disc > 0 ? `${disc}% OFF` : prev.offerBadge,
      }));
    } else {
      setFormData((prev) => ({ ...prev, sellPrice: val, discountPercent: "" }));
    }
  };

  const applyQuickDiscount = (pct: number) => {
    const orig = Number(formData.originalPrice);
    if (!orig || orig <= 0) {
      alert("অনুগ্রহ করে আগে 'পূর্বমূল্য (Original Price)' লিখুন");
      return;
    }
    const calculatedSell = Math.round(orig * (1 - pct / 100));
    setFormData((prev) => ({
      ...prev,
      discountPercent: String(pct),
      sellPrice: String(calculatedSell),
      offerBadge: `${pct}% OFF`,
      isOffer: true,
    }));
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await adminUploadMedia(file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
      } else {
        alert(res.message || "ছবি আপলোড ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("ছবি আপলোড হতে সমস্যা হয়েছে");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      subCategory: formData.subCategory.trim(),
      buyPrice: Number(formData.buyPrice) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
      originalPrice: Number(formData.originalPrice) || Number(formData.sellPrice) || 0,
      stock: Number(formData.stock) || 50,
      description: formData.description.trim() || formData.name.trim(),
      images: formData.image ? [formData.image] : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
      isOffer: formData.isOffer,
      offerBadge: formData.offerBadge.trim(),
      offerEndTime: formData.isOffer && formData.offerEndTime ? new Date(formData.offerEndTime).toISOString() : undefined,
    };

    try {
      let res;
      if (editingProduct) {
        res = await adminUpdateProduct(editingProduct._id, payload);
      } else {
        res = await adminCreateProduct(payload);
      }

      if (res && res.success) {
        if (editingProduct) {
          const updated: Product = res.product || {
            ...editingProduct,
            ...payload,
            updatedAt: new Date().toISOString(),
          };
          setProducts((prev) =>
            prev.map((p) => (p._id === editingProduct._id ? updated : p))
          );
        } else if (res.product) {
          const newProd: Product = res.product;
          // Immediately insert new product at the beginning of the list
          setProducts((prev) => [
            newProd,
            ...prev.filter((p) => p._id !== newProd._id),
          ]);
        }

        // Reset filter and search so new product is guaranteed visible immediately
        setCategoryFilter("all");
        setSearch("");
        setIsModalOpen(false);
        setMessage("");

        // Silently sync from database in background
        await loadProductsList("all", "", true);
      } else {
        alert(res?.message || "পণ্য সংরক্ষণ করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
      }
    } catch (err: any) {
      console.error("Save product failed:", err);
      alert(err.message || "পণ্য সংরক্ষণে সমস্যা দেখা দিয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (prod: Product) => {
    setDeletingProduct(prod);
    setDeleteError(null);
  };

  const handleExecuteDelete = async () => {
    if (!deletingProduct) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const deletedId = deletingProduct._id;
      const res = await adminDeleteProduct(deletedId);
      if (res && res.success === false) {
        setDeleteError(res.message || "পণ্য ডিলিট করা যায়নি");
        return;
      }
      // Optimistically remove from table immediately
      setProducts((prev) => prev.filter((p) => p._id !== deletedId));
      setDeletingProduct(null);
      await loadProductsList(categoryFilter, search, true);
    } catch (err: any) {
      console.error("Delete failed:", err);
      setDeleteError(err.message || "পণ্য ডিলিট করতে সমস্যা হয়েছে");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Profit calculation for the form
  const formBuy = Number(formData.buyPrice) || 0;
  const formSell = Number(formData.sellPrice) || 0;
  const formProfit = formSell - formBuy;
  const formMargin = formSell > 0 ? Math.round((formProfit / formSell) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#df2d4d]" />
            GAXIN MART পণ্য তালিকা ও স্টক ম্যানেজমেন্ট
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ক্রয়মূল্য ও শতকরা ডিসকাউন্ট সহ বিক্রয়মূল্য নির্ধারণ করুন (ক্রয়মূল্য ও স্টক গ্রাহক দেখতে পাবে না)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 active:scale-97 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-amber-900">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <p className="font-bold">গোপনীয়তা ও নিরাপত্তা নীতি সক্রিয়</p>
          <p className="text-amber-700 text-[11px]">
            পণ্যের কেনার দাম (Buy Price) এবং স্টকের সঠিক সংখ্যা শুধুমাত্র এই অ্যাডমিন প্যানেলে সংরক্ষিত থাকে। সাধারণ গ্রাহকের কাছে কেনার দাম সম্পূর্ণ গোপন থাকে এবং স্টকে শুধুমাত্র &ldquo;ইন স্টক&rdquo; দেখানো হয়।
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              categoryFilter === "all"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            সব পণ্য ({products.length})
          </button>
          {ADMIN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat.label.split("(")[0]}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="পণ্য খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#df2d4d]" />
            <p className="text-xs font-semibold">পণ্য লোড হচ্ছে...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Tag className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো পণ্য পাওয়া যায়নি</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {products.map((prod) => {
                const profitPerUnit = prod.sellPrice - (prod.buyPrice || 0);
                return (
                  <div key={prod._id} className="p-4 hover:bg-slate-50/80 transition-colors space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl bg-slate-50 border overflow-hidden shrink-0">
                        <Image
                          src={prod.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{prod.name}</h4>
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400">কেনার দাম</p>
                        <p className="font-bold text-amber-700 font-mono">৳{prod.buyPrice || 0}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">বিক্রির দাম</p>
                        <p className="font-bold text-slate-900 font-mono">৳{prod.sellPrice}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">লাভ</p>
                        <p className="font-bold text-emerald-600 font-mono">+৳{profitPerUnit}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">স্টক: {prod.stock} টি</span>
                        {prod.isOffer && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            {prod.offerBadge || "Offer"}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 rounded-lg border text-slate-600 hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(prod)}
                          className="p-1.5 rounded-lg border text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">পণ্য (Product)</th>
                    <th className="py-3 px-4">ক্যাটাগরি</th>
                    <th className="py-3 px-4">কেনার দাম (Buy)</th>
                    <th className="py-3 px-4">বিক্রির দাম (Sell)</th>
                    <th className="py-3 px-4">লাভ (Profit)</th>
                    <th className="py-3 px-4">স্টক (Admin Only)</th>
                    <th className="py-3 px-4">অফার ব্যাজ</th>
                    <th className="py-3 px-4 text-right">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((prod) => {
                    const profitPerUnit = prod.sellPrice - (prod.buyPrice || 0);
                    return (
                      <tr key={prod._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg bg-slate-50 border overflow-hidden shrink-0">
                            <Image
                              src={prod.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                            <p className="text-[10px] text-slate-400">{prod.subCategory || "General"}</p>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold uppercase text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            {prod.category}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-amber-700 font-bold">
                          ৳{prod.buyPrice ?? 0}
                        </td>

                        <td className="py-3 px-4 font-mono font-black text-slate-900">
                          ৳{prod.sellPrice}
                        </td>

                        <td className="py-3 px-4 font-black text-emerald-600 font-mono">
                          +৳{profitPerUnit}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`font-bold ${prod.stock > 10 ? "text-slate-800" : "text-rose-600"}`}>
                            {prod.stock} টি
                          </span>
                          <span className="block text-[9px] text-slate-400">(কাস্টমার দেখবে না)</span>
                        </td>

                        <td className="py-3 px-4">
                          {prod.isOffer ? (
                            <div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                {prod.offerBadge || "Offer"}
                              </span>
                              {prod.offerEndTime && (
                                <p className="text-[9px] text-slate-500 mt-0.5 flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5 text-amber-600" />
                                  {new Date(prod.offerEndTime).getTime() > Date.now()
                                    ? `মেয়াদ: ${new Date(prod.offerEndTime).toLocaleDateString("bn-BD")}`
                                    : "মেয়াদোত্তীর্ণ"}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(prod)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-[#df2d4d] transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black">
                  {editingProduct ? "পণ্য সম্পাদনা করুন (Edit Product)" : "নতুন পণ্য যোগ করুন (Add Product)"}
                </h2>
                <p className="text-[11px] text-slate-400">GAXIN MART পণ্য আপলোড ও মূল্য নির্ধারণ</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {message && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পণ্যের নাম <span className="text-[#df2d4d]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন: Premium Slim-Fit Cotton Formal Shirt"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900"
                />
              </div>

              {/* Category & SubCategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্যাটাগরি <span className="text-[#df2d4d]">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 font-semibold"
                  >
                    {ADMIN_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সাব-ক্যাটাগরি</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="যেমন: Formal Wear, Audio, Decor"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Price, Discount & Profit System */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/30 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    মূল্য ও লাভ ক্যালকুলেটর (Pricing & Profit Calculator)
                  </h3>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" /> কেনার দাম গ্রাহক দেখবে না
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Buy Price */}
                  <div>
                    <label className="block text-[11px] font-bold text-amber-800 mb-1">
                      কেনার দাম / ক্রয়মূল্য (৳) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.buyPrice}
                      onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                      placeholder="কতো দিয়ে কেনা (৳)"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-bold text-slate-900 bg-white"
                    />
                    <span className="text-[10px] text-amber-700">লাভ গণনার জন্য</span>
                  </div>

                  {/* Original / Regular Price */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      পূর্বমূল্য / কাটা দাগ (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => handleOriginalPriceChange(e.target.value)}
                      placeholder="যেমন: ১৮৫০"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                    />
                    <span className="text-[10px] text-slate-500">মূল দাম (ছাড়ের পূর্বে)</span>
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label className="block text-[11px] font-bold text-rose-700 mb-1 flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-rose-600" />
                      ডিসকাউন্ট শতাংশ (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={formData.discountPercent}
                      onChange={(e) => handleDiscountPercentChange(e.target.value)}
                      placeholder="যেমন: ২৫"
                      className="w-full px-3 py-2 rounded-xl border border-rose-300 text-xs font-bold text-slate-900 bg-white"
                    />
                    <span className="text-[10px] text-rose-600">লিখলে বিক্রির দাম অটো বসবে</span>
                  </div>
                </div>

                {/* Quick Discount Pills */}
                <div>
                  <p className="text-[10px] font-bold text-slate-600 mb-1.5">দ্রুত ডিসকাউন্ট প্রয়োগ করুন:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[10, 15, 20, 25, 30, 35, 40, 50].map((pct) => (
                      <button
                        type="button"
                        key={pct}
                        onClick={() => applyQuickDiscount(pct)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          formData.discountPercent === String(pct)
                            ? "bg-[#df2d4d] text-white border-[#df2d4d]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50"
                        }`}
                      >
                        {pct}% OFF
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sell Price & Live Profit Display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                      বিক্রির দাম / কাস্টমার মূল্য (৳) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.sellPrice}
                      onChange={(e) => handleSellPriceChange(e.target.value)}
                      placeholder="যেমন: ১২৫০"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-emerald-400 text-sm font-black text-slate-900 bg-white"
                    />
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      গ্রাহক এই মূল্যে পণ্য অর্ডার করবেন
                    </span>
                  </div>

                  {/* Live Profit Preview Box */}
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200 flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      আনুমানিক লাভ ও মার্জিন (Live Margin)
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className={`text-base font-black ${formProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {formProfit >= 0 ? `+৳${formProfit.toLocaleString()}` : `-৳${Math.abs(formProfit).toLocaleString()}`}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        ({formMargin}% মার্জিন)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    স্টক পরিমাণ <span className="text-slate-400 font-normal">(অ্যাডমিনের জন্য)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    * কাস্টমারকে সংখ্যা দেখানো হবে না, শুধুমাত্র &ldquo;ইন স্টক&rdquo; দেখাবে।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ছবি আপলোড (Cloudinary Upload)
                  </label>
                  <label className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 hover:bg-rose-50 text-xs text-[#df2d4d] font-bold transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploadingImage ? "Cloudinary তে আপলোড হচ্ছে..." : "ছবি সিলেক্ট করুন (File Pick)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Image URL preview */}
              {formData.image && (
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="relative w-12 h-12 rounded-lg bg-white border overflow-hidden shrink-0">
                    <Image src={formData.image} alt="" fill className="object-cover" />
                  </div>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 text-xs text-slate-600 bg-transparent border-0 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="text-slate-400 hover:text-rose-600 text-xs p-1"
                    title="ছবি বাদ দিন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পণ্যের বিবরণ (Description)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="পণ্য সম্পর্কে বিস্তারিত লিখুন..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>

              {/* Hot Offer Toggle */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-900">হট অফার / ফ্ল্যাশ সেলে রাখুন</p>
                  <p className="text-[11px] text-amber-700">হোমপেজের হট অফার সেকশনে এবং ব্যানার ব্যাজ সহ দেখাবে</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isOffer}
                  onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })}
                  className="w-5 h-5 accent-[#df2d4d] rounded cursor-pointer"
                />
              </div>

              {formData.isOffer && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        অফার ব্যাজ টেক্সট (Offer Badge)
                      </label>
                      <input
                        type="text"
                        value={formData.offerBadge}
                        onChange={(e) => setFormData({ ...formData, offerBadge: e.target.value })}
                        placeholder="যেমন: 25% OFF বা FLASH SALE"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        অফার সমাপ্তির তারিখ ও সময় (Offer End Time)
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.offerEndTime}
                        onChange={(e) => setFormData({ ...formData, offerEndTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-bold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  {/* Quick Expiration Presets */}
                  <div>
                    <p className="text-[10px] font-bold text-amber-900 mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      দ্রুত সময় নির্ধারণ করুন (Quick Duration):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQuickOfferDuration(12)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 transition-colors cursor-pointer"
                      >
                        +১২ ঘন্টা
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickOfferDuration(24)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 transition-colors cursor-pointer"
                      >
                        +২৪ ঘন্টা (১ দিন)
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickOfferDuration(72)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 transition-colors cursor-pointer"
                      >
                        +৩ দিন
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickOfferDuration(168)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 transition-colors cursor-pointer"
                      >
                        +৭ দিন
                      </button>
                      {formData.offerEndTime && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, offerEndTime: "" })}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-300 bg-white hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                        >
                          সময়সীমা মুছুন
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-amber-800/80 mt-1.5">
                      ⚡ নির্ধারিত সময় শেষ হওয়ার সাথে সাথে ওয়েবসাইট ও ফ্ল্যাশ সেল থেকে অফার স্বয়ংক্রিয়ভাবে রিয়েল-টাইমে বন্ধ হয়ে যাবে।
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs font-bold shadow-md shadow-rose-500/20 active:scale-97 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingProduct ? "আপডেট করুন" : "পণ্য যোগ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        title="পণ্য মুছে ফেলার নিশ্চিতকরণ"
        itemName={deletingProduct?.name}
        message="আপনি কি নিশ্চিত এই পণ্যটি GAXIN MART ডাটাবেজ থেকে স্থায়ীভাবে মুছে ফেলতে চান? এটি মুছে ফেললে গ্রাহক ওয়েবসাইট বা অ্যাডমিন প্যানেল কোথাও দেখতে পাবেন না।"
        loading={deleteLoading}
        error={deleteError}
        onClose={() => {
          setDeletingProduct(null);
          setDeleteError(null);
        }}
        onConfirm={handleExecuteDelete}
      />
    </div>
  );
}
