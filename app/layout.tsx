import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuraMart - Modern Lifestyle, Tech & Beauty | Cash on Delivery",
  description:
    "বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা সহ সেরা মূল্যে ইলেকট্রনিক্স, কসমেটিক্স এবং ফ্যাশন পণ্য কিনুন।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-rose-500 selection:text-white">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
