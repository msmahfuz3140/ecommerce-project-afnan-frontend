export interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subCategory?: string;
  buyPrice?: number;
  sellPrice: number;
  originalPrice: number;
  stock: number;
  inStock: boolean;
  images: string[];
  isOffer: boolean;
  offerBadge?: string;
  isFeatured: boolean;
  specifications: Record<string, string>;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface OfferRecord {
  _id: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  discountPercentage: number;
  badge: string;
  link: string;
  active: boolean;
  isNoticeTicker: boolean;
  noticeText?: string;
}

export interface OrderItem {
  product?: string;
  name: string;
  image: string;
  quantity: number;
  buyPrice?: number;
  sellPrice: number;
  subtotal: number;
  profit?: number;
}

export interface OrderRecord {
  _id: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  totalBuyCost?: number;
  totalProfit?: number;
  status: "pending" | "in_progress" | "in_courier" | "delivered" | "cancelled";
  paymentMethod: "cash_on_delivery";
  statusHistory: Array<{
    status: string;
    changedAt: string;
    note?: string;
  }>;
  createdAt: string;
}

// Products are managed strictly via MongoDB database
export const initialProducts: ProductItem[] = [];

// Helper to get active product list (with localStorage additions if in browser)
export function getAllProducts(): ProductItem[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gaxinmart_custom_products");
      if (stored) {
        const customProds = JSON.parse(stored);
        if (Array.isArray(customProds) && customProds.length > 0) {
          // Merge custom products with initial products (custom first or overriding)
          const merged = [...customProds];
          const customIds = new Set(customProds.map((p) => p._id));
          for (const p of initialProducts) {
            if (!customIds.has(p._id)) {
              merged.push(p);
            }
          }
          return merged;
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return initialProducts;
}

// Public product helper: STRICTLY hides buyPrice and hides exact stock
export function getPublicProducts(params: {
  category?: string;
  search?: string;
  isOffer?: boolean;
  sort?: string;
} = {}): ProductItem[] {
  let list = getAllProducts();

  // Category filter
  if (params.category && params.category !== "all") {
    const cat = params.category.toLowerCase().trim();
    list = list.filter((p) => (p.category || "").toLowerCase() === cat);
  }

  // Search filter
  if (params.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.subCategory || "").toLowerCase().includes(q)
    );
  }

  // Offer filter
  if (params.isOffer) {
    list = list.filter((p) => p.isOffer);
  }

  // Sort
  if (params.sort === "price_asc") {
    list = [...list].sort((a, b) => a.sellPrice - b.sellPrice);
  } else if (params.sort === "price_desc") {
    list = [...list].sort((a, b) => b.sellPrice - a.sellPrice);
  }

  // Strip buyPrice and mask exact stock
  return list.map((item) => {
    const { buyPrice, ...safeProduct } = item;
    return {
      ...safeProduct,
      inStock: (item.stock ?? 0) > 0,
      stock: (item.stock ?? 0) > 0 ? 1 : 0, // only indicate availability, never reveal internal stock count!
    };
  });
}

// Admin product helper: retains buyPrice and stock
export function getAdminProducts(params: {
  category?: string;
  search?: string;
  sort?: string;
} = {}): ProductItem[] {
  let list = getAllProducts();

  if (params.category && params.category !== "all") {
    const cat = params.category.toLowerCase().trim();
    list = list.filter((p) => (p.category || "").toLowerCase() === cat);
  }

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.subCategory || "").toLowerCase().includes(q)
    );
  }

  return list;
}

// Find single product by ID or slug (case-insensitive and URL-decode safe)
export function getProductById(identifier: string, isAdmin: boolean = false): ProductItem | null {
  if (!identifier) return null;
  const clean = decodeURIComponent(identifier).toLowerCase().trim();
  const list = getAllProducts();
  const found = list.find(
    (p) =>
      p._id.toLowerCase() === clean ||
      (p.slug || "").toLowerCase() === clean ||
      (p.slug || "").toLowerCase().replace(/-/g, "") === clean.replace(/-/g, "")
  );
  if (!found) return null;

  if (isAdmin) {
    return found;
  }

  const { buyPrice, ...safeProduct } = found;
  return {
    ...safeProduct,
    inStock: (found.stock ?? 0) > 0,
    stock: (found.stock ?? 0) > 0 ? 1 : 0,
  };
}

export const initialOffers: any[] = [
  {
    _id: "off-1",
    title: "GAXIN MART গ্র্যান্ড সেল — ৩৫% পর্যন্ত বিশাল ছাড়!",
    subtitle: "Men's Fashion, Women's Fashion, Gadgets & Lifestyle পণ্যে সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    bannerImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    discountPercentage: 35,
    badge: "GRAND SALE",
    link: "/?category=all",
    active: true,
    isNoticeTicker: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "off-2",
    title: "লেটেস্ট স্মার্ট গ্যাজেটস ও ওয়্যারলেস অডিও",
    subtitle: "হাই-কোয়ালিটি সাউন্ড, স্মার্টওয়াচ এবং ইয়ারবাডসে স্পেশাল ক্যাশ অন ডেলিভারি ডিসকাউন্ট!",
    bannerImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80",
    discountPercentage: 25,
    badge: "MEGA DEAL",
    link: "/?category=gadgets-electronics",
    active: true,
    isNoticeTicker: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "off-3",
    title: "এক্সক্লুসিভ ফ্যাশন ও ট্রেন্ডি লাইফস্টাইল কালেকশন",
    subtitle: "পুরুষ ও নারীদের প্রিমিয়াম পোশাক, ব্যাগ ও এক্সেসরিজে স্পেশাল অফার!",
    bannerImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
    discountPercentage: 30,
    badge: "TRENDING FASHION",
    link: "/?category=mens-fashion",
    active: true,
    isNoticeTicker: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "notice-1",
    title: "Header Top Announcement Notice",
    subtitle: "Official Announcement",
    bannerImage: "",
    discountPercentage: 0,
    badge: "SPECIAL NOTICE",
    link: "",
    active: true,
    isNoticeTicker: true,
    noticeText:
      "⭐ GAXIN MART স্পেশাল অফার! সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা। সরাসরি WhatsApp এ মেসেজ বা কল করুন: 01356584296",
    createdAt: new Date().toISOString(),
  },
];

// Get active promotional banners & notices
export function getOffersData() {
  const banners = initialOffers.filter((o) => !o.isNoticeTicker && o.active);
  const notices = initialOffers.filter((o) => o.isNoticeTicker && o.active);
  return { banners, notices };
}

// Initial demo orders for GAXIN MART
export const initialOrders: OrderRecord[] = [
  {
    _id: "ord-demo-1",
    orderId: "#GX-982410",
    customerName: "তানভীর আহমেদ",
    phone: "01712345678",
    address: "বাড়ি #২৪, রোড #৭, উত্তরা সেক্টর ৩",
    city: "Dhaka (Inside Dhaka)",
    note: "বিকেলে ডেলিভারি দিলে ভালো হয়",
    items: [
      {
        product: "prod-gadget-1",
        name: "Wireless ANC Pro Over-Ear Hi-Fi Headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        quantity: 1,
        buyPrice: 1800,
        sellPrice: 3200,
        subtotal: 3200,
        profit: 1400,
      },
    ],
    subtotal: 3200,
    deliveryCharge: 70,
    totalAmount: 3270,
    totalBuyCost: 1800,
    totalProfit: 1400,
    status: "in_courier",
    paymentMethod: "cash_on_delivery",
    statusHistory: [
      {
        status: "pending",
        changedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        note: "অর্ডার গ্রহণ করা হয়েছে - কনফার্মেশনের জন্য কল দেওয়া হয়েছে",
      },
      {
        status: "in_progress",
        changedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        note: "পণ্য প্যাকিং সম্পন্ন হয়েছে",
      },
      {
        status: "in_courier",
        changedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        note: "কুরিয়ার সার্ভিসে হস্তান্তর করা হয়েছে (ট্র্যাকিং কোড: STD-9824)",
      },
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "ord-demo-2",
    orderId: "#GX-873912",
    customerName: "সাদিয়া রহমান",
    phone: "01898765432",
    address: "ফ্ল্যাট ৪বি, ধানমন্ডি ২৭",
    city: "Dhaka (Inside Dhaka)",
    note: "সাবধানে ডেলিভারি করবেন",
    items: [
      {
        product: "prod-women-2",
        name: "Luxury Crossbody Structured Leather Handbag",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
        quantity: 1,
        buyPrice: 980,
        sellPrice: 1790,
        subtotal: 1790,
        profit: 810,
      },
    ],
    subtotal: 1790,
    deliveryCharge: 70,
    totalAmount: 1860,
    totalBuyCost: 980,
    totalProfit: 810,
    status: "in_progress",
    paymentMethod: "cash_on_delivery",
    statusHistory: [
      {
        status: "pending",
        changedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        note: "অর্ডার পাওয়া গিয়েছে",
      },
      {
        status: "in_progress",
        changedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        note: "অর্ডার কনফার্ম করা হয়েছে, ডেলিভারির জন্য প্রস্তুত করা হচ্ছে",
      },
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "ord-demo-3",
    orderId: "#GX-765432",
    customerName: "মাহমুদুল হাসান",
    phone: "01356584296",
    address: "হাউজ ১২, রোড ৫, মিরপুর ১০",
    city: "Dhaka (Inside Dhaka)",
    note: "WhatsApp এ কনফার্মেশন মেসেজ দিবেন",
    items: [
      {
        product: "prod-gadget-2",
        name: "Ultra AMOLED Smart Watch v2 with Bluetooth Calling",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        quantity: 1,
        buyPrice: 1400,
        sellPrice: 2450,
        subtotal: 2450,
        profit: 1050,
      },
    ],
    subtotal: 2450,
    deliveryCharge: 70,
    totalAmount: 2520,
    totalBuyCost: 1400,
    totalProfit: 1050,
    status: "delivered",
    paymentMethod: "cash_on_delivery",
    statusHistory: [
      {
        status: "pending",
        changedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        note: "অর্ডার গ্রহণ",
      },
      {
        status: "delivered",
        changedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        note: "গ্রাহকের কাছে সফলভাবে ডেলিভারি সম্পন্ন হয়েছে",
      },
    ],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

// In-memory server/module cache for orders
export const activeServerOrders: OrderRecord[] = [...initialOrders];

// Helper to get all combined orders (local storage + in-memory + initial)
export function getAllOrders(): OrderRecord[] {
  let list: OrderRecord[] = [...activeServerOrders];

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gaxinmart_orders");
      if (stored) {
        const parsed: OrderRecord[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(list.map((o) => o.orderId));
          for (const item of parsed) {
            if (!existingIds.has(item.orderId)) {
              list.unshift(item);
              existingIds.add(item.orderId);
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return list;
}

// Create order and persist locally & in-memory
export function createMockOrderRecord(orderData: {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  items: Array<{ productId: string; quantity: number }>;
}): OrderRecord {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderId = `#GX-${randomSuffix}`;

  const all = getAllProducts();
  const orderItems: OrderItem[] = orderData.items.map((it) => {
    const prod = all.find((p) => p._id === it.productId);
    const sellPrice = prod ? prod.sellPrice : 0;
    const buyPrice = prod ? prod.buyPrice || 0 : 0;
    const name = prod ? prod.name : "Product";
    const image = prod && prod.images && prod.images[0] ? prod.images[0] : "";
    return {
      product: it.productId,
      name,
      image,
      quantity: it.quantity,
      buyPrice,
      sellPrice,
      subtotal: sellPrice * it.quantity,
      profit: (sellPrice - buyPrice) * it.quantity,
    };
  });

  const subtotal = orderItems.reduce((acc, cur) => acc + cur.subtotal, 0);
  const deliveryCharge = orderData.city && orderData.city.toLowerCase().includes("inside") ? 70 : 130;
  const totalAmount = subtotal + deliveryCharge;
  const totalBuyCost = orderItems.reduce((acc, cur) => acc + (cur.buyPrice || 0) * cur.quantity, 0);
  const totalProfit = totalAmount - totalBuyCost - deliveryCharge;

  const newOrder: OrderRecord = {
    _id: `ord-${Date.now()}`,
    orderId,
    customerName: orderData.customerName,
    phone: orderData.phone,
    address: orderData.address,
    city: orderData.city,
    note: orderData.note,
    items: orderItems,
    subtotal,
    deliveryCharge,
    totalAmount,
    totalBuyCost,
    totalProfit,
    status: "pending",
    paymentMethod: "cash_on_delivery",
    statusHistory: [
      {
        status: "pending",
        changedAt: new Date().toISOString(),
        note: "অর্ডার গ্রহণ করা হয়েছে - কনফার্মেশনের জন্য শীঘ্রই কল দেওয়া হবে",
      },
    ],
    createdAt: new Date().toISOString(),
  };

  // Add to in-memory list
  activeServerOrders.unshift(newOrder);

  // Add to browser localStorage if available
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem("gaxinmart_orders");
      const list: OrderRecord[] = existing ? JSON.parse(existing) : [];
      list.unshift(newOrder);
      localStorage.setItem("gaxinmart_orders", JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  }

  return newOrder;
}

// Track orders with fuzzy phone and ID matching - returns ARRAY of all matches
export function trackMockOrders(query: string): OrderRecord[] {
  if (!query) return [];

  const raw = query.trim().toLowerCase();
  const cleanId = raw.replace(/^#/, "").replace(/-/g, "");
  const digitsOnly = raw.replace(/\D/g, "");

  const allOrders = getAllOrders();

  const matched = allOrders.filter((o) => {
    const oIdRaw = (o.orderId || "").toLowerCase();
    const oIdClean = oIdRaw.replace(/^#/, "").replace(/-/g, "");
    const oPhone = (o.phone || "").replace(/\D/g, "");
    const oName = (o.customerName || "").toLowerCase();

    // 1. Exact or partial Order ID match
    if (oIdRaw === raw || oIdClean === cleanId || oIdClean.includes(cleanId) || cleanId.includes(oIdClean)) {
      return true;
    }

    // 2. Phone match (e.g. 01712345678, +8801712345678, 1712345678)
    if (digitsOnly.length >= 6) {
      if (oPhone.includes(digitsOnly) || digitsOnly.includes(oPhone)) {
        return true;
      }
      // Check last 8-10 digits
      const lastDigits = digitsOnly.slice(-10);
      if (oPhone.slice(-10) === lastDigits) {
        return true;
      }
    }

    // 3. Customer Name match if query is longer than 3 chars
    if (raw.length >= 3 && oName.includes(raw)) {
      return true;
    }

    return false;
  });

  return matched;
}

// Backward-compatible single order tracker
export function trackMockOrderRecord(query: string): OrderRecord | null {
  const orders = trackMockOrders(query);
  return orders.length > 0 ? orders[0] : null;
}

