export interface Product {
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
  offerEndTime?: string;
  isFeatured: boolean;
  specifications?: Record<string, string>;
  createdAt?: string;
}

export interface OrderItem {
  product?: string;
  name: string;
  image: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  subtotal: number;
  profit: number;
}

export type OrderStatus = "pending" | "in_progress" | "in_courier" | "delivered" | "cancelled";

export interface Order {
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
  totalBuyCost: number;
  totalProfit: number;
  status: OrderStatus;
  paymentMethod: "cash_on_delivery";
  statusHistory: Array<{
    status: OrderStatus;
    changedAt: string;
    note?: string;
  }>;
  createdAt: string;
}

export interface Offer {
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
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsMetrics {
  totalRevenue: number;
  totalBuyCost: number;
  totalProfit: number;
  profitMargin: number;
  totalOrders: number;
  statusCounts: {
    pending: number;
    in_progress: number;
    in_courier: number;
    delivered: number;
    cancelled: number;
  };
}

export interface AnalyticsResponse {
  success: boolean;
  range: string;
  startDate: string;
  endDate: string;
  metrics: AnalyticsMetrics;
  categoryBreakdown: Array<{
    _id: string;
    revenue: number;
    cost: number;
    profit: number;
    itemsSold: number;
  }>;
  dailyTrend: Array<{
    _id: string;
    revenue: number;
    cost: number;
    profit: number;
    orders: number;
  }>;
  topProducts: Array<{
    _id: string;
    image?: string;
    quantitySold: number;
    totalRevenue: number;
    totalProfit: number;
  }>;
}
