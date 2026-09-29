"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Gift,
  Plus,
  Trash2,
  Edit2,
  Zap,
  Upload,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  adminGetOffers,
  adminCreateOffer,
  adminDeleteOffer,
  adminUploadMedia,
} from "@/lib/api";
import { Offer } from "@/types";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    bannerImage: "",
    discountPercentage: "25",
    badge: "SPECIAL OFFER",
    link: "/?category=all",
    active: true,
    isNoticeTicker: false,
    noticeText: "",
  });

  const loadOffersList = async () => {
    setLoading(true);
    try {
      const res = await adminGetOffers();
      if (res && res.offers) {
        setOffers(res.offers);
      }
    } catch (err) {
      console.error("Error loading offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffersList();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await adminUploadMedia(file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, bannerImage: res.url }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await adminCreateOffer({
        title: formData.title,
        subtitle: formData.subtitle,
        bannerImage: formData.bannerImage,
        discountPercentage: Number(formData.discountPercentage) || 0,
        badge: formData.badge,
        link: formData.link,
        active: formData.active,
        isNoticeTicker: formData.isNoticeTicker,
        noticeText: formData.noticeText,
      });

      if (res.success) {
        setMessage("অফার সফলভাবে পাবলিশ করা হয়েছে!");
        setTimeout(() => {
          setIsModalOpen(false);
          loadOffersList();
        }, 800);
      }
    } catch (err) {
      console.error("Failed to create offer:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (off: Offer) => {
    setDeletingOffer(off);
    setDeleteError(null);
  };

  const handleExecuteDelete = async () => {
    if (!deletingOffer) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await adminDeleteOffer(deletingOffer._id);
      if (res && res.success === false) {
        setDeleteError(res.message || "অফার মুছে ফেলতে সমস্যা হয়েছে");
        return;
      }
      setDeletingOffer(null);
      await loadOffersList();
    } catch (err: any) {
      console.error("Delete offer failed:", err);
      setDeleteError(err.message || "অফার মুছে ফেলতে সমস্যা হয়েছে");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#df2d4d]" />
            ওয়েবসাইট অফার ও নোটিশ ব্যানার
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            হোমপেজের হিরো ব্যানার এবং উপরের স্ক্রলিং স্পেশাল নোটিশ নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: "",
              subtitle: "",
              bannerImage: "",
              discountPercentage: "25",
              badge: "SPECIAL OFFER",
              link: "/?category=all",
              active: true,
              isNoticeTicker: false,
              noticeText: "",
            });
            setMessage("");
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 active:scale-97 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অফার বা নোটিশ তৈরি করুন</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#df2d4d]" />
            <p className="text-xs font-semibold">অফার লোড হচ্ছে...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border p-8">
            <Gift className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো অফার সক্রিয় নেই</p>
          </div>
        ) : (
          offers.map((off) => (
            <div
              key={off._id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Banner Thumbnail */}
                {off.isNoticeTicker ? (
                  <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center gap-2 text-rose-800 text-xs font-bold">
                    <Zap className="w-4 h-4 text-[#df2d4d]" />
                    <span>স্ক্রলিং নোটিশ বার (Scrolling Top Bar Notice)</span>
                  </div>
                ) : (
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={off.bannerImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"}
                      alt=""
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#df2d4d] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      {off.badge || "OFFER"}
                    </div>
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900">{off.title}</h3>
                  {off.isNoticeTicker ? (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {off.noticeText}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">{off.subtitle}</p>
                  )}
                  {off.discountPercentage > 0 && (
                    <p className="text-xs font-bold text-[#df2d4d]">
                      ডিসকাউন্ট: {off.discountPercentage}%
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    off.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {off.active ? "সক্রিয় (Active)" : "নিষ্ক্রিয় (Inactive)"}
                </span>

                <button
                  onClick={() => confirmDelete(off)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= CREATE OFFER MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black">নতুন অফার তৈরি করুন</h2>
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

              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isNoticeTicker: false })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    !formData.isNoticeTicker
                      ? "border-[#df2d4d] bg-rose-50 text-[#df2d4d]"
                      : "border-slate-200 text-slate-700"
                  }`}
                >
                  হিরো স্লাইডার ব্যানার
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isNoticeTicker: true })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    formData.isNoticeTicker
                      ? "border-[#df2d4d] bg-rose-50 text-[#df2d4d]"
                      : "border-slate-200 text-slate-700"
                  }`}
                >
                  টপ স্ক্রলিং নোটিশ বার
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শিরোনাম (Title)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: গ্র্যান্ড উইন্টার মেগা অফার"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900"
                />
              </div>

              {formData.isNoticeTicker ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    নোটিশ টেক্সট (যা ওয়েবসাইটের উপরে স্ক্রল করবে) <span className="text-[#df2d4d]">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.noticeText}
                    onChange={(e) => setFormData({ ...formData, noticeText: e.target.value })}
                    placeholder="যেমন: ⭐ GAXIN MART স্পেশাল অফার! সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি সুবিধা। WhatsApp: 01356584296..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">উপ-শিরোনাম (Subtitle)</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="যেমন: ৩৫% পর্যন্ত বিশাল ছাড় ও ফ্রি হোম ডেলিভারি"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাজ টেক্সট</label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="HOT DEALS"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ছাড়ের শতাংশ (%)</label>
                      <input
                        type="number"
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ব্যানার ছবি আপলোড (Cloudinary)
                    </label>
                    <label className="cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 hover:bg-rose-50 text-xs text-[#df2d4d] font-bold">
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{uploadingImage ? "আপলোড হচ্ছে..." : "ছবি সিলেক্ট করুন"}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  {formData.bannerImage && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border">
                      <Image src={formData.bannerImage} alt="" fill className="object-cover" />
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-[#df2d4d] hover:bg-[#b1001f] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>পাবলিশ হচ্ছে...</span>
                  </>
                ) : (
                  <span>অফার পাবলিশ করুন</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingOffer)}
        title="অফার মুছে ফেলার নিশ্চিতকরণ"
        itemName={deletingOffer?.title}
        message="আপনি কি নিশ্চিত এই অফার ব্যানারটি মুছে ফেলতে চান? এটি মুছে ফেললে হোমপেজের ব্যানার বা নোটিশ আর প্রদর্শিত হবে না।"
        loading={deleteLoading}
        error={deleteError}
        onClose={() => {
          setDeletingOffer(null);
          setDeleteError(null);
        }}
        onConfirm={handleExecuteDelete}
      />
    </div>
  );
}
