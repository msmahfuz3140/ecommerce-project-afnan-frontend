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
  Zap,
  Shirt,
  Layers,
} from "lucide-react";
import {
  fetchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadMedia,
} from "@/lib/api";
import { Product } from "@/types";

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

  const [formData, setFormData] = useState({
    name: "",
    category: "electronics",
    subCategory: "",
    buyPrice: "",
    sellPrice: "",
    originalPrice: "",
    stock: "50",
    description: "",
    image: "",
    isOffer: false,
    offerBadge: "",
  });

  const loadProductsList = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts({
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        search: search || undefined,
      });
      if (res && res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsList();
  }, [categoryFilter, search]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "electronics",
      subCategory: "",
      buyPrice: "",
      sellPrice: "",
      originalPrice: "",
      stock: "50",
      description: "",
      image: "",
      isOffer: false,
      offerBadge: "",
    });
    setMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      subCategory: prod.subCategory || "",
      buyPrice: String(prod.buyPrice || ""),
      sellPrice: String(prod.sellPrice || ""),
      originalPrice: String(prod.originalPrice || ""),
      stock: String(prod.stock || ""),
      description: prod.description || "",
      image: prod.images[0] || "",
      isOffer: prod.isOffer || false,
      offerBadge: prod.offerBadge || "",
    });
    setMessage("");
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await adminUploadMedia(file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload = {
      name: formData.name,
      category: formData.category,
      subCategory: formData.subCategory,
      buyPrice: Number(formData.buyPrice) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
      originalPrice: Number(formData.originalPrice) || Number(formData.sellPrice) || 0,
      stock: Number(formData.stock) || 50,
      description: formData.description || formData.name,
      images: formData.image ? [formData.image] : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
      isOffer: formData.isOffer,
      offerBadge: formData.offerBadge,
    };

    try {
      let res;
      if (editingProduct) {
        res = await adminUpdateProduct(editingProduct._id, payload);
      } else {
        res = await adminCreateProduct(payload);
      }

      if (res.success) {
        setMessage("পণ্য সফলভাবে সংরক্ষিত হয়েছে!");
        setTimeout(() => {
          setIsModalOpen(false);
          loadProductsList();
        }, 800);
      }
    } catch (err) {
      console.error("Save product failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই পণ্যটি ডিলিট করতে চান?")) return;
    try {
      await adminDeleteProduct(id);
      loadProductsList();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#df2d4d]" />
            পণ্য তালিকা ও স্টক ম্যানেজমেন্ট
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            নতুন পণ্য যোগ করুন (ক্রয়মূল্য ও বিক্রয়মূল্য সহ), ক্লাউডিনারি ছবি আপলোড করুন
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 active:scale-97 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: "সব পণ্য" },
            { id: "electronics", label: "⚡ ইলেকট্রনিক্স" },
            { id: "cosmetics", label: "✨ কসমেটিক্স" },
            { id: "fashion", label: "👔 ফ্যাশন" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                categoryFilter === cat.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat.label}
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
            <p className="text-sm font-bold text-slate-700">কোনো পণ্য নেই</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (Visible on small screens < md) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {products.map((prod) => {
                const profitPerUnit = prod.sellPrice - (prod.buyPrice || 0);
                return (
                  <div key={prod._id} className="p-4 hover:bg-slate-50/80 transition-colors space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-14 h-14 rounded-2xl bg-slate-100 border shrink-0 overflow-hidden">
                        <Image src={prod.images[0] || ""} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold uppercase text-[9px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded inline-block mb-1">
                          {prod.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                          {prod.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{prod.subCategory || "General"}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">ক্রয়মূল্য</span>
                        <span className="font-bold text-amber-700">৳{prod.buyPrice || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">বিক্রয়মূল্য</span>
                        <span className="font-black text-slate-900">৳{prod.sellPrice}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">একক লাভ</span>
                        <span className="font-black text-emerald-600">+৳{profitPerUnit}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${prod.stock > 10 ? "bg-slate-100 text-slate-700" : "bg-rose-100 text-rose-700"}`}>
                          স্টক: {prod.stock} টি
                        </span>
                        {prod.isOffer && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {prod.offerBadge || "Offer"}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>এডিট</span>
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
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

            {/* Desktop Table (Visible on md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">পণ্য</th>
                    <th className="py-3.5 px-4">ক্যাটাগরি</th>
                    <th className="py-3.5 px-4">ক্রয়মূল্য (Buy Cost)</th>
                    <th className="py-3.5 px-4">বিক্রয়মূল্য (Sell Price)</th>
                    <th className="py-3.5 px-4">সম্ভাব্য লাভ</th>
                    <th className="py-3.5 px-4">স্টক</th>
                    <th className="py-3.5 px-4">অফার ট্যাগ</th>
                    <th className="py-3.5 px-4 text-right">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((prod) => {
                    const profitPerUnit = prod.sellPrice - (prod.buyPrice || 0);
                    return (
                      <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl bg-slate-100 border shrink-0 overflow-hidden">
                            <Image src={prod.images[0] || ""} alt="" fill className="object-cover" />
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
                          ৳{prod.buyPrice || 0}
                        </td>

                        <td className="py-3 px-4 font-mono font-black text-slate-900">
                          ৳{prod.sellPrice}
                        </td>

                        <td className="py-3 px-4 font-black text-emerald-600">
                          +৳{profitPerUnit}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`font-bold ${prod.stock > 10 ? "text-slate-800" : "text-rose-600"}`}>
                            {prod.stock} টি
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {prod.isOffer ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {prod.offerBadge || "Offer"}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod._id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-[#df2d4d] transition-colors"
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
              <h2 className="text-base sm:text-lg font-black">
                {editingProduct ? "পণ্য সম্পাদনা করুন (Edit Product)" : "নতুন পণ্য যোগ করুন (Add Product)"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400"
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
                  placeholder="যেমন: Wireless ANC Pro Over-Ear Headphones"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 font-semibold"
                  >
                    <option value="electronics">⚡ ইলেকট্রনিক্স (Electronics)</option>
                    <option value="cosmetics">✨ কসমেটিক্স (Cosmetics)</option>
                    <option value="fashion">👔 ফ্যাশন ও লাইফস্টাইল (Fashion)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সাব-ক্যাটাগরি</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="যেমন: Audio, Skincare, Bags"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Price & Cost Grid */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-amber-800 mb-1">
                    ক্রয়মূল্য (Buy Cost) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                    placeholder="কতো দিয়ে কেনা (৳)"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">লাভ গণনার জন্য</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                    বিক্রয়মূল্য (Sell Price) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.sellPrice}
                    onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                    placeholder="কতো বিক্রি করবেন (৳)"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    পূর্বমূল্য (Original Price)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="কাটা দাগের জন্য (৳)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Stock & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পণ্যের ছবি আপলোড (Cloudinary)
                  </label>
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 hover:bg-rose-50 text-xs text-[#df2d4d] font-bold">
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{uploadingImage ? "আপলোড হচ্ছে..." : "ছবি সিলেক্ট করুন"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Image URL preview */}
              {formData.image && (
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border">
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
                </div>
              )}

              {/* Offer Toggle */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-900">হট অফার / ফ্ল্যাশ সেলে রাখুন</p>
                  <p className="text-[11px] text-amber-700">হোমপেজের ফ্ল্যাশ সেল সেকশনে দেখাবে</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isOffer}
                  onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })}
                  className="w-5 h-5 accent-[#df2d4d] rounded cursor-pointer"
                />
              </div>

              {formData.isOffer && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অফার ব্যাজ টেক্সট
                  </label>
                  <input
                    type="text"
                    value={formData.offerBadge}
                    onChange={(e) => setFormData({ ...formData, offerBadge: e.target.value })}
                    placeholder="যেমন: 25% OFF বা FLASH SALE"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বর্ণনা</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="পণ্যের বিস্তারিত বিবরণ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-[#df2d4d] hover:bg-[#b1001f] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ করা হচ্ছে...</span>
                  </>
                ) : (
                  <span>সংরক্ষণ করুন</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
