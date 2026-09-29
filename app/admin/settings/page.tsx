"use client";

import React, { useState, useEffect } from "react";
import {
  KeyRound,
  Mail,
  User,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Truck,
} from "lucide-react";
import { adminChangeCredentials, fetchDeliverySettings, adminUpdateDeliverySettings } from "@/lib/api";

export default function AdminSettingsPage() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentName, setCurrentName] = useState("");

  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delivery Charges State (3 Options: Dhaka, Near Dhaka, Outside Dhaka)
  const [deliverySettings, setDeliverySettings] = useState({
    dhaka: 70,
    nearDhaka: 100,
    outsideDhaka: 130,
  });
  const [loadingDelivery, setLoadingDelivery] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // Load current admin info from localStorage
    try {
      const userStr = localStorage.getItem("gaxinmart_admin_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.email) setCurrentEmail(u.email);
        if (u.name) {
          setCurrentName(u.name);
          setName(u.name);
        }
      } else {
        setCurrentEmail("gaxinmart@gmail.com");
        setCurrentName("GAXIN MART Admin");
      }
    } catch {
      setCurrentEmail("gaxinmart@gmail.com");
    }

    // Load delivery settings from backend
    fetchDeliverySettings().then((res) => {
      if (res) {
        setDeliverySettings(res);
      }
    });
  }, []);

  const handleSaveDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeliveryMessage(null);
    setLoadingDelivery(true);

    try {
      const res = await adminUpdateDeliverySettings({
        dhaka: Number(deliverySettings.dhaka) || 0,
        nearDhaka: Number(deliverySettings.nearDhaka) || 0,
        outsideDhaka: Number(deliverySettings.outsideDhaka) || 0,
      });

      if (res && res.success) {
        setDeliveryMessage({
          type: "success",
          text: res.message || "৩টি এরিয়ার ডেলিভারি চার্জ সফলভাবে ডাটাবেজে আপডেট করা হয়েছে!",
        });
      } else {
        setDeliveryMessage({
          type: "error",
          text: res?.message || "ডেলিভারি চার্জ সংরক্ষণ করা সম্ভব হয়নি।",
        });
      }
    } catch (err: any) {
      setDeliveryMessage({
        type: "error",
        text: err?.message || "সার্ভার এরর: ডেলিভারি চার্জ আপডেট ব্যর্থ হয়েছে।",
      });
    } finally {
      setLoadingDelivery(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword) {
      setMessage({ type: "error", text: "পরিবর্তন সংরক্ষণ করতে বর্তমান পাসওয়ার্ড প্রদান করা আবশ্যক।" });
      return;
    }

    if (!newEmail && !newPassword && (!name || name === currentName)) {
      setMessage({ type: "error", text: "অনুগ্রহ করে নতুন ইমেইল বা নতুন পাসওয়ার্ড প্রদান করুন।" });
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setMessage({ type: "error", text: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" });
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: "error", text: "নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড দুটি একই হতে হবে।" });
        return;
      }
    }

    setLoading(true);

    try {
      const res = await adminChangeCredentials({
        currentPassword,
        newEmail: newEmail.trim() || undefined,
        newPassword: newPassword || undefined,
        newName: name.trim() || undefined,
      });

      if (res && res.success) {
        setMessage({
          type: "success",
          text: res.message || "অ্যাডমিন ইমেইল ও পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!",
        });

        // Update token & user in local storage
        if (res.token) {
          localStorage.setItem("gaxinmart_admin_token", res.token);
          localStorage.setItem("auramart_admin_token", res.token);
        }
        if (res.admin) {
          localStorage.setItem("gaxinmart_admin_user", JSON.stringify(res.admin));
          localStorage.setItem("auramart_admin_user", JSON.stringify(res.admin));
          setCurrentEmail(res.admin.email);
          setCurrentName(res.admin.name);
        }

        // Reset password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setNewEmail("");
      } else {
        setMessage({
          type: "error",
          text: res?.message || "পরিবর্তন সংরক্ষণ করা সম্ভব হয়নি। তথ্যগুলো পুনরায় চেক করুন।",
        });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "সার্ভার এরর: ক্রেডেনশিয়াল আপডেট ব্যর্থ হয়েছে।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#df2d4d]/10 text-[#df2d4d] flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          অ্যাকাউন্ট ও পাসওয়ার্ড সেটিংস
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          GAXIN MART অ্যাডমিন একাউন্টের লগইন ইমেইল (Gmail) এবং সিকিউরিটি পাসওয়ার্ড পরিবর্তন করুন।
        </p>
      </div>

      {/* Current Account Status Box */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">বর্তমান অ্যাডমিন</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">{currentName || "Admin"}</h2>
            <p className="text-xs text-slate-600 font-mono flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentEmail || "admin@gaxinmart.com"}</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 sm:text-right">
          <span className="font-semibold text-slate-700 block">সিকিউরিটি নোট</span>
          <span className="text-[11px]">পাসওয়ার্ড পরিবর্তনের পর নতুন পাসওয়ার্ড দিয়ে পুনরায় লগইন করা যাবে।</span>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm font-semibold shadow-xs ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">{message.text}</div>
        </div>
      )}

      {/* ================= DELIVERY CHARGE SETTINGS (3 ZONES) ================= */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#df2d4d] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">ডেলিভারি চার্জ কনফিগারেশন (Delivery Zones)</h3>
              <p className="text-[11px] text-slate-500">৩টি নির্দিষ্ট জোনের জন্য ইচ্ছামতো ডেলিভারি চার্জ নির্ধারণ করুন</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ✓ চেকআউটে সরাসরি কার্যকর হবে
          </span>
        </div>

        {deliveryMessage && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
              deliveryMessage.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            {deliveryMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{deliveryMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveDelivery} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Zone 1: Dhaka */}
            <div className="p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800">১. ঢাকা সিটির ভেতরে</span>
                <span className="text-[10px] text-slate-500">(Dhaka)</span>
              </div>
              <p className="text-[10px] text-slate-500">ঢাকা মেট্রোপলিটন এলাকা</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-500">৳</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={deliverySettings.dhaka}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, dhaka: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 text-sm font-black text-slate-900 bg-white focus:border-[#df2d4d] focus:outline-none"
                />
              </div>
            </div>

            {/* Zone 2: Near Dhaka */}
            <div className="p-3.5 rounded-xl border-2 border-amber-200 bg-amber-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800">২. ঢাকার আশেপাশে</span>
                <span className="text-[10px] text-amber-700 font-bold">(Near Dhaka)</span>
              </div>
              <p className="text-[10px] text-slate-500">সাভার, গাজীপুর, নারায়ণগঞ্জ, কেরানীগঞ্জ</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-500">৳</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={deliverySettings.nearDhaka}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, nearDhaka: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 rounded-lg border border-amber-300 text-sm font-black text-slate-900 bg-white focus:border-[#df2d4d] focus:outline-none"
                />
              </div>
            </div>

            {/* Zone 3: Outside Dhaka */}
            <div className="p-3.5 rounded-xl border-2 border-rose-200 bg-rose-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800">৩. ঢাকার বাইরে</span>
                <span className="text-[10px] text-rose-700 font-bold">(Outside Dhaka)</span>
              </div>
              <p className="text-[10px] text-slate-500">অন্যান্য সকল জেলা ও উপজেলা</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-500">৳</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={deliverySettings.outsideDhaka}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, outsideDhaka: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 rounded-lg border border-rose-300 text-sm font-black text-slate-900 bg-white focus:border-[#df2d4d] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loadingDelivery}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loadingDelivery ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>ডেলিভারি চার্জ সেভ করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Profile & Email */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-[#df2d4d]" />
            <h3 className="text-sm font-black text-slate-900">অ্যাডমিন প্রোফাইল ও ইমেইল (Email)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                অ্যাডমিনের নাম (Admin Name)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: Afnan Johad"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                নতুন ইমেইল (New Gmail / Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={`নতুন ইমেইল (বর্তমান: ${currentEmail})`}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">ইমেইল পরিবর্তন করতে না চাইলে ফাঁকা রাখুন।</p>
            </div>
          </div>
        </div>

        {/* Section 2: Password Change */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-4 h-4 text-[#df2d4d]" />
            <h3 className="text-sm font-black text-slate-900">পাসওয়ার্ড পরিবর্তন (Password Change)</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>বর্তমান পাসওয়ার্ড (Current Password) *</span>
                <span className="text-[11px] font-normal text-rose-600">বাধ্যতামূলক</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showCurrentPass ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="আপনার বর্তমান সিকিউরিটি পাসওয়ার্ড লিখুন"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  নতুন পাসওয়ার্ড (New Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 flex items-center gap-2 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>পরিবর্তন সংরক্ষণ করুন (Save Changes)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
