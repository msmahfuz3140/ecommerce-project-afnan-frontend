"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShoppingBag, ArrowRight, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("afnan@gmail.com");
  const [password, setPassword] = useState("afnan31403140");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem("auramart_admin_token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminLogin({ email, password });
      if (res.success && res.token) {
        localStorage.setItem("auramart_admin_token", res.token);
        localStorage.setItem("auramart_admin_user", JSON.stringify(res.admin));
        router.push("/admin");
      } else {
        setError(res.message || "ভুল ইমেইল বা পাসওয়ার্ড প্রদান করেছেন।");
      }
    } catch (err: any) {
      setError("লগইন ব্যর্থ হয়েছে। ব্যাকএন্ড সার্ভার চালু আছে কিনা নিশ্চিত করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#df2d4d] to-[#ff4d6d] flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-500/30 mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Aura<span className="text-[#df2d4d]">Mart</span> Admin
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            অ্যাডমিন ড্যাশবোর্ড ও লাভ-ক্ষতির হিসাব প্যানেল
          </p>
        </div>

        {/* Credentials Info Helper */}
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-700">
            <ShieldCheck className="w-4 h-4 text-[#df2d4d]" />
            <span>প্রদত্ত অ্যাডমিন ক্রেডেনশিয়াল:</span>
          </div>
          <p className="font-mono text-slate-700">ইমেইল: <span className="font-bold text-slate-900">afnan@gmail.com</span></p>
          <p className="font-mono text-slate-700">পাসওয়ার্ড: <span className="font-bold text-slate-900">afnan31403140</span></p>
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
              অ্যাডমিন ইমেইল
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="afnan@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#df2d4d] focus:outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
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

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <a
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-[#df2d4d] transition-colors"
          >
            ← ওয়েবসাইটে ফিরে যান
          </a>
        </div>
      </div>
    </div>
  );
}
