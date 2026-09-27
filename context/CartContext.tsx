"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";

import { Toast } from "@/components/ui/Toast";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  directCheckoutItem: CartItem | null;
  setDirectCheckoutItem: (item: CartItem | null) => void;
  openDirectCheckout: (product: Product, quantity?: number) => void;
  closeDirectCheckout: () => void;
  showCartToast: (product: Product, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; product: Product; quantity: number } | null>(null);

  // Load cart & directCheckoutItem from localStorage
  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem("gaxinmart_cart") ||
        localStorage.getItem("auramart_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedDirect =
        localStorage.getItem("gaxinmart_direct_checkout") ||
        localStorage.getItem("auramart_direct_checkout");
      if (savedDirect) {
        setDirectCheckoutItem(JSON.parse(savedDirect));
      }
    } catch (e) {
      console.error("Failed to load cart/checkout state", e);
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("gaxinmart_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart", e);
      }
    }
  }, [cart, mounted]);

  // Save directCheckoutItem to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        if (directCheckoutItem) {
          localStorage.setItem("gaxinmart_direct_checkout", JSON.stringify(directCheckoutItem));
        } else {
          localStorage.removeItem("gaxinmart_direct_checkout");
          localStorage.removeItem("auramart_direct_checkout");
        }
      } catch (e) {
        console.error("Failed to save direct checkout item", e);
      }
    }
  }, [directCheckoutItem, mounted]);

  const showCartToast = (product: Product, quantity: number) => {
    setToast({ show: true, product, quantity });
  };

  // Auto-dismiss toast after 3.5 seconds
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast((prev) => (prev ? { ...prev, show: false } : null));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    // DO NOT open slider automatically as requested!
    // Instead show friendly Toast notification:
    showCartToast(product, quantity);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openDirectCheckout = (product: Product, quantity: number = 1) => {
    const item = { product, quantity };
    setDirectCheckoutItem(item);
    try {
      localStorage.setItem("gaxinmart_direct_checkout", JSON.stringify(item));
    } catch (e) {}
  };

  const closeDirectCheckout = () => {
    setDirectCheckoutItem(null);
    setIsCheckoutOpen(false);
    try {
      localStorage.removeItem("gaxinmart_direct_checkout");
      localStorage.removeItem("auramart_direct_checkout");
    } catch (e) {}
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.sellPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        directCheckoutItem,
        setDirectCheckoutItem,
        openDirectCheckout,
        closeDirectCheckout,
        showCartToast,
      }}
    >
      {children}
      {/* Global Toast for Cart Additions */}
      <Toast
        toast={toast}
        onClose={() => setToast((prev) => (prev ? { ...prev, show: false } : null))}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
