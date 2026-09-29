"use client";

import React from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  message?: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = "মুছে ফেলার নিশ্চিতকরণ",
  itemName,
  message = "আপনি কি নিশ্চিত এটি ডাটাবেজ থেকে মুছে ফেলতে চান? এই কাজটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।",
  loading = false,
  error = null,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#df2d4d] via-rose-500 to-[#fe4c6c]" />

        <div className="p-6 sm:p-7">
          {/* Header Icon & Close */}
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#df2d4d] shadow-xs">
              <Trash2 className="w-6 h-6" />
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{title}</span>
            </h3>

            {itemName && (
              <p className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-2 rounded-xl truncate">
                &ldquo;{itemName}&rdquo;
              </p>
            )}

            <p className="text-xs text-slate-500 leading-relaxed">
              {message}
            </p>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#df2d4d] shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#df2d4d] to-[#fe4c6c] hover:from-[#b1001f] hover:to-[#df2d4d] text-white text-xs font-bold shadow-md shadow-rose-500/25 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>মুছে ফেলা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছে ফেলুন (Delete)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
