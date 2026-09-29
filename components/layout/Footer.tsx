import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Lock,
} from "lucide-react";
import { WhatsAppIcon, getWhatsAppUrl, WHATSAPP_NUMBER } from "@/components/ui/WhatsAppButton";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-10 sm:pt-14 pb-24 md:pb-8 border-t border-slate-800">
      {/* 1. Value Proposition Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-[#df2d4d] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">সারা দেশে ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-slate-400">পণ্য দেখে মূল্য পরিশোধ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">১০০% অথেনটিক পণ্য</h4>
              <p className="text-xs text-slate-400">কোয়ালিটি নিশ্চয়তা</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">সহজ রিটার্ন পলিসি</h4>
              <p className="text-xs text-slate-400">৭ দিনের মধ্যে সমাধান</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
              <WhatsAppIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">WhatsApp সাপোর্ট</h4>
              <p className="text-xs text-slate-400">{WHATSAPP_NUMBER}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
        {/* Brand Details */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black border border-slate-700">
              <Image src="/gaxin-mart-logo.jpg" alt="GAXIN MART Logo" fill className="object-cover" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              GAXIN <span className="text-[#df2d4d]">MART</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            বাংলাদেশের শীর্ষস্থানীয় প্রিমিয়াম অনলাইন শপ। ফ্যাশন, গ্যাজেটস এবং লাইফস্টাইলে সেরা কোয়ালিটির ১০০% অরিজিনাল পণ্য সবচেয়ে সুলভ মূল্যে।
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 w-fit">
              ✓ ক্যাশ অন ডেলিভারি সাপোর্টেড
            </span>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white transition-all w-fit cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp: {WHATSAPP_NUMBER}</span>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">ক্যাটাগরি সমূহ</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/?category=mens-fashion" className="hover:text-rose-400 transition-colors">
                👔 Men&apos;s Fashion (পুরুষদের পোশাক)
              </Link>
            </li>
            <li>
              <Link href="/?category=womens-fashion" className="hover:text-rose-400 transition-colors">
                👗 Women&apos;s Fashion (মহিলাদের পোশাক)
              </Link>
            </li>
            <li>
              <Link href="/?category=home-lifestyle" className="hover:text-rose-400 transition-colors">
                🏠 Home & Lifestyle (গৃহস্থালী সামগ্রী)
              </Link>
            </li>
            <li>
              <Link href="/?category=gadgets-electronics" className="hover:text-rose-400 transition-colors">
                ⚡ Gadgets & Electronics (স্মার্ট গ্যাজেট)
              </Link>
            </li>
            <li>
              <Link href="/?category=others" className="hover:text-rose-400 transition-colors">
                📦 Other&apos;s (অন্যান্য প্রডাক্ট)
              </Link>
            </li>
            <li>
              <Link href="/?category=kids-zone" className="hover:text-rose-400 transition-colors">
                🧸 Kids Zone (বাচ্চাদের খেলনা ও আইটেম)
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">সহায়তা ও নীতিমালা</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/#track" className="hover:text-rose-400 transition-colors">
                অর্ডার ট্র্যাকিং (Track Order)
              </Link>
            </li>
            <li>
              <span className="hover:text-rose-400 cursor-pointer">ডেলিভারি পলিসি ও চার্জ</span>
            </li>
            <li>
              <span className="hover:text-rose-400 cursor-pointer">রিটার্ন ও রিফান্ড নীতি</span>
            </li>
            <li>
              <span className="hover:text-rose-400 cursor-pointer">প্রাইভেসী পলিসি</span>
            </li>
            <li>
              <span className="hover:text-rose-400 cursor-pointer">টার্মস অ্যান্ড কন্ডিশন</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">যোগাযোগ করুন</h4>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>ঢাকা, বাংলাদেশ (সারাদেশে হোম ডেলিভারি)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{WHATSAPP_NUMBER} (সকাল ৯টা - রাত ১১টা)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366] font-bold text-white"
              >
                WhatsApp: {WHATSAPP_NUMBER}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-rose-500 shrink-0" />
              <span>support@gaxinmart.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} GAXIN MART. সর্বস্বত্ব সংরক্ষিত।</p>
        <p className="flex items-center gap-2">
          <span>পেমেন্ট মেথড:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
            Cash On Delivery (ক্যাশ অন ডেলিভারি)
          </span>
        </p>
      </div>
    </footer>
  );
};
