import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Lock,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      {/* 1. Value Proposition Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-[#df2d4d] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">সারা দেশে ডেলিভারি</h4>
              <p className="text-xs text-slate-400">দ্রুত ও নিরাপদ ডেলিভারি</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-slate-400">পণ্য দেখে মূল্য পরিশোধ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">৭ দিনের রিটার্ন</h4>
              <p className="text-xs text-slate-400">সমস্যা হলে দ্রুত পরিবর্তন</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">২৪/৭ কাস্টমার সাপোর্ট</h4>
              <p className="text-xs text-slate-400">যে কোনো প্রয়োজনে কল করুন</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
        {/* Brand Details */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#df2d4d] to-[#ff4d6d] flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Aura<span className="text-[#df2d4d]">Mart</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            বাংলাদেশের শীর্ষস্থানীয় প্রিমিয়াম অনলাইন শপ। ইলেকট্রনিক্স, কসমেটিক্স এবং ফ্যাশনে সেরা কোয়ালিটির ১০০% অরিজিনাল পণ্য সবচেয়ে সুলভ মূল্যে।
          </p>
          <div className="pt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              ✓ ক্যাশ অন ডেলিভারি সাপোর্টেড
            </span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">ক্যাটাগরি সমূহ</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/?category=electronics" className="hover:text-rose-400 transition-colors">
                ⚡ ইলেকট্রনিক্স ও স্মার্ট গ্যাজেটস
              </Link>
            </li>
            <li>
              <Link href="/?category=cosmetics" className="hover:text-rose-400 transition-colors">
                ✨ স্কিনকেয়ার ও কসমেটিক্স
              </Link>
            </li>
            <li>
              <Link href="/?category=fashion" className="hover:text-rose-400 transition-colors">
                👔 ফ্যাশন, ব্যাগ ও লাইফস্টাইল
              </Link>
            </li>
            <li>
              <Link href="/?isOffer=true" className="hover:text-rose-400 transition-colors">
                🔥 হট ডিলস ও ফ্ল্যাশ সেল
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
                অর্ডার ট্র্যাকিং
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
              <Link href="/admin" className="text-slate-400 hover:text-white flex items-center gap-1 pt-1">
                <Lock className="w-3 h-3" /> অ্যাডমিন লগইন (Admin)
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">যোগাযোগ করুন</h4>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>বাড়ি #১২, রোড #৪, ধানমন্ডি, ঢাকা - ১২০৯</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <span>+৮৮০ ১৭০০-০০০০০০ (সকাল ৯টা - রাত ১১টা)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-rose-500 shrink-0" />
              <span>support@auramart.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} AuraMart. সর্বস্বত্ব সংরক্ষিত।</p>
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
