"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already logged in
    const token =
      localStorage.getItem("gaxinmart_admin_token") ||
      localStorage.getItem("auramart_admin_token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminLogin({ email: email.trim(), password });
      if (res.success && res.token) {
        localStorage.setItem("gaxinmart_admin_token", res.token);
        localStorage.setItem("gaxinmart_admin_user", JSON.stringify(res.admin));
        localStorage.setItem("auramart_admin_token", res.token);
        localStorage.setItem("auramart_admin_user", JSON.stringify(res.admin));
        router.push("/admin");
      } else {
        setError(res.message || "ভুল ইমেইল বা পাসওয়ার্ড প্রদান করেছেন।");
      }
    } catch (err: any) {
      setError("লগইন ব্যর্থ হয়েছে। ইমেইল ও পাসওয়ার্ড সঠিক কিনা নিশ্চিত করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200">
        {/* Brand with Rose Logo */}
        <div className="text-center mb-6">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-black border-2 border-slate-800 mx-auto shadow-xl shadow-slate-950/30 mb-3">
            <Image
              src="/gaxin-mart-logo.jpg"
              alt="GAXIN MART Logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            GAXIN <span className="text-[#df2d4d]">MART</span> Admin
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            অ্যাডমিন কন্ট্রোল প্যানেল ও লাভ-ক্ষতির হিসাব ড্যাশবোর্ড
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              অ্যাডমিন ইমেইল (Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার অ্যাডমিন ইমেইল লিখুন"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পাসওয়ার্ড (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>লগইন হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>লগইন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
