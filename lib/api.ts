const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const getAdminToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gaxinmart_admin_token") || localStorage.getItem("auramart_admin_token");
};

const authHeaders = (isFormData: boolean = false) => {
  const token = getAdminToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// ==================== STOREFRONT APIs ====================

export const fetchProducts = async (params: {
  category?: string;
  search?: string;
  isOffer?: boolean;
  sort?: string;
} = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== "all") query.append("category", params.category);
    if (params.search) query.append("search", params.search);
    if (params.isOffer) query.append("isOffer", "true");
    if (params.sort) query.append("sort", params.sort);

    const res = await fetch(`${API_URL}/products?${query.toString()}`, {
      cache: "no-store",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (error) {
    console.error("fetchProducts error:", error);
    return { success: false, products: [] };
  }
};

export const fetchProduct = async (identifier: string) => {
  try {
    const res = await fetch(`${API_URL}/products/${identifier}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch product");
    return await res.json();
  } catch (error) {
    console.error("fetchProduct error:", error);
    return { success: false, product: null };
  }
};

export const fetchActiveOffers = async () => {
  try {
    const res = await fetch(`${API_URL}/offers/active`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch offers");
    return await res.json();
  } catch (error) {
    console.error("fetchActiveOffers error:", error);
    return { success: false, banners: [], notices: [] };
  }
};

export const createOrder = async (orderData: {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  items: Array<{ productId: string; quantity: number }>;
}) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return await res.json();
};

export const trackOrder = async (query: string) => {
  const res = await fetch(`${API_URL}/orders/track/${encodeURIComponent(query)}`);
  return await res.json();
};

// ==================== ADMIN APIs ====================

export const adminLogin = async (credentials: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return await res.json();
};

export const adminGetOrders = async (params: { status?: string; search?: string } = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.append("status", params.status);
  if (params.search) query.append("search", params.search);

  const res = await fetch(`${API_URL}/orders?${query.toString()}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  return await res.json();
};

export const adminGetOrderById = async (id: string) => {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  return await res.json();
};

export const adminUpdateOrderStatus = async (id: string, status: string, note?: string) => {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status, note }),
  });
  return await res.json();
};

export const adminGetAnalytics = async (range: string = "7days") => {
  const res = await fetch(`${API_URL}/analytics/profit-loss?range=${range}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  return await res.json();
};

export const adminCreateProduct = async (productData: any) => {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(productData),
  });
  return await res.json();
};

export const adminUpdateProduct = async (id: string, productData: any) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(productData),
  });
  return await res.json();
};

export const adminDeleteProduct = async (id: string) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return await res.json();
};

export const adminGetOffers = async () => {
  const res = await fetch(`${API_URL}/offers`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  return await res.json();
};

export const adminCreateOffer = async (offerData: any) => {
  const res = await fetch(`${API_URL}/offers`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(offerData),
  });
  return await res.json();
};

export const adminUpdateOffer = async (id: string, offerData: any) => {
  const res = await fetch(`${API_URL}/offers/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(offerData),
  });
  return await res.json();
};

export const adminDeleteOffer = async (id: string) => {
  const res = await fetch(`${API_URL}/offers/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return await res.json();
};

export const adminUploadMedia = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload/single`, {
    method: "POST",
    headers: authHeaders(true),
    body: formData,
  });
  return await res.json();
};
