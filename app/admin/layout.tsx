"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Gift,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  // Exclude login page from layout auth guard
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthenticated(true);
      return;
    }

    const token = localStorage.getItem("auramart_admin_token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem("auramart_admin_token");
    localStorage.removeItem("auramart_admin_user");
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">
        যাচাই করা হচ্ছে...
      </div>
    );
  }

  const navLinks = [
    {
      name: "লাভ-ক্ষতি ও ড্যাশবোর্ড",
      subName: "Profit & Loss Analytics",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "অর্ডার ম্যানেজমেন্ট",
      subName: "Orders & Pending List",
      href: "/admin/orders",
      icon: Package,
    },
    {
      name: "পণ্য তালিকা ও যুক্তকরণ",
      subName: "Products Management",
      href: "/admin/products",
      icon: Tag,
    },
    {
      name: "ব্যানার ও অফারসমূহ",
      subName: "Offers & Notice Ticker",
      href: "/admin/offers",
      icon: Gift,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#df2d4d] to-[#ff4d6d] flex items-center justify-center text-white shadow-md shadow-rose-500/20 font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight text-white leading-tight">
              Aura<span className="text-[#df2d4d]">Mart</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Admin Control Panel
            </span>
          </div>
        </div>

        {/* Admin Profile Chip */}
        <div className="px-5 py-3.5 bg-slate-800/60 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 text-[#df2d4d] flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Afnan Johad</p>
            <p className="text-[10px] text-slate-400 truncate">afnan@gmail.com</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#df2d4d] text-white shadow-md shadow-rose-500/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <div>
                  <p className="leading-tight">{item.name}</p>
                  <p className="text-[10px] font-normal text-slate-400 leading-tight">
                    {item.subName}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              ওয়েবসাইট দেখুন
            </span>
            <span className="text-[10px] text-slate-400">Open Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট করুন (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#df2d4d] flex items-center justify-center text-white">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="font-bold text-base">AuraMart Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-slate-900 text-white h-full p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="font-black text-lg">AuraMart Admin</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                        isActive ? "bg-[#df2d4d] text-white" : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-semibold text-emerald-400"
              >
                <ExternalLink className="w-4 h-4" />
                ওয়েবসাইট দেখুন
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-bold text-rose-400"
              >
                <LogOut className="w-4 h-4" />
                লগআউট করুন
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Admin Content Container */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
