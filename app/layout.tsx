import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FloatingWhatsAppButton } from "@/components/ui/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GAXIN MART - Best Online Shopping in Bangladesh | Cash on Delivery",
  description:
    "GAXIN MART - সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা সহ সেরা দামে Men's Fashion, Women's Fashion, Gadgets & Electronics, Home & Lifestyle পণ্য কিনুন। হটলাইন / WhatsApp: 01356584296",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/gaxin-mart-logo.jpg",
  },
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
        <CartProvider>
          {children}
          <FloatingWhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
