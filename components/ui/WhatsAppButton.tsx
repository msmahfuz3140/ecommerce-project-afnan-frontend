"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export const WHATSAPP_NUMBER = "01356584296";
export const WHATSAPP_INTL_NUMBER = "8801356584296";

export const getWhatsAppUrl = (productName?: string, price?: number): string => {
  let message = "আসসালামু আলাইকুম, আমি GAXIN MART থেকে কেনাকাটা করতে চাই।";
  if (productName) {
    message = `আসসালামু আলাইকুম, আমি GAXIN MART থেকে "${productName}"${
      price ? ` (মূল্য: ৳${price.toLocaleString()})` : ""
    } অর্ডার করতে / বিস্তারিত জানতে চাই।`;
  }
  return `https://wa.me/${WHATSAPP_INTL_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.031 2C6.496 2 2 6.495 2 12.031c0 1.996.59 3.864 1.606 5.438L2.05 22.05l4.757-1.523A9.99 9.99 0 0 0 12.03 22c5.535 0 10.03-4.495 10.03-10.031C22.062 6.495 17.566 2 12.031 2zm0 18.232c-1.637 0-3.18-.46-4.509-1.258l-.323-.193-3.344 1.07.904-3.218-.211-.336a8.21 8.21 0 0 1-1.266-4.266c0-4.549 3.682-8.231 8.23-8.231 4.548 0 8.23 3.682 8.23 8.231 0 4.549-3.682 8.231-8.23 8.231zm4.512-6.177c-.247-.123-1.464-.722-1.69-.804-.227-.082-.392-.123-.556.123-.165.247-.639.804-.783.969-.144.165-.289.186-.536.062-.247-.123-1.043-.385-1.986-1.226-.734-.655-1.229-1.464-1.373-1.711-.144-.247-.015-.381.108-.504.111-.111.247-.289.371-.433.123-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.123-.556-1.34-.762-1.835-.2-.485-.404-.419-.556-.427-.144-.007-.309-.009-.474-.009-.165 0-.433.062-.659.309-.227.247-.866.845-.866 2.062 0 1.216.886 2.391 1.01 2.556.123.165 1.745 2.664 4.227 3.737.59.255 1.052.408 1.411.522.593.188 1.133.161 1.56.098.476-.071 1.464-.598 1.67-1.175.206-.577.206-1.072.144-1.175-.062-.103-.227-.165-.474-.288z" />
  </svg>
);

export const FloatingWhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Pop-up Hint Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl border border-slate-700 animate-fade-in">
          <span>WhatsApp এ দ্রুত অর্ডার / চ্যাট করুন: 01356584296</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5 rounded"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main WhatsApp Floating Action Button */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative group w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-108 transition-all duration-300 cursor-pointer"
      >
        <WhatsAppIcon className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
      </a>
    </div>
  );
};
