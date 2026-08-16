// ============================================
// 📦 ایمپورت‌ها
// ============================================
import { createContext, useContext, useEffect, useState, useMemo } from "react";

// ============================================
// 🎯 ایجاد Context
// ============================================
const CartContext = createContext(null);

// کلید ذخیره‌سازی در localStorage
const STORAGE_KEY = "pine_cart_v1";

// ============================================
// 🏭 Provider
// ============================================
export const CartProvider = ({ children }) => {
  // بارگذاری از localStorage
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  // ذخیره در localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items]);

  // ============================================
  // 🛒 توابع مدیریت سبد خرید
  // ============================================

  // ✅ اصلاح: استفاده از id به جای product_id
  const add = (product, qty = 1) => {
    if (!product || !product.id) {
      console.warn("Invalid product provided to cart.add");
      return;
    }

    setItems((prev) => {
      const exist = prev.find((i) => i.id === product.id); // ✅ اصلاح: id
      
      if (exist) {
        return prev.map((i) =>
          i.id === product.id 
            ? { ...i, quantity: i.quantity + qty } 
            : i
        );
      }
      
      // ✅ اصلاح: اضافه کردن آیتم جدید با id
      return [
        ...prev,
        {
          id: product.id,           // ✅ استفاده از id
          name: product.name,
          price: product.price,
          image_url: product.image_url || "",
          quantity: Math.max(1, qty),
          stock: product.stock || 0, // ✅ اضافه: موجودی برای بررسی
        },
      ];
    });
  };

  // حذف آیتم
  const remove = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // تغییر تعداد
  const setQty = (id, quantity) => {
    const newQty = Math.max(1, Math.floor(quantity));
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: newQty } : i
      )
    );
  };

  // افزایش تعداد
  const increment = (id) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  // کاهش تعداد
  const decrement = (id) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.quantity > 1 
          ? { ...i, quantity: i.quantity - 1 } 
          : i
      )
    );
  };

  // خالی کردن سبد
  const clear = () => setItems([]);

  // ============================================
  // 📊 محاسبات (بهینه شده با useMemo)
  // ============================================
  
  // ✅ اصلاح: استفاده از useMemo برای جلوگیری از محاسبات اضافی
  const total = useMemo(() => {
    return items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  }, [items]);

  const count = useMemo(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  // بررسی موجودی
  const hasStockIssues = useMemo(() => {
    return items.some((i) => (i.stock || 0) < i.quantity);
  }, [items]);

  // ============================================
  // 🎁 توابع کمکی
  // ============================================
  
  // بررسی وجود آیتم در سبد
  const hasItem = (id) => {
    return items.some((i) => i.id === id);
  };

  // دریافت تعداد یک آیتم خاص
  const getItemQty = (id) => {
    const item = items.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  // ============================================
  // 📦 مقادیر Context
  // ============================================
  const value = {
    items,
    add,
    remove,
    setQty,
    increment,    // ✅ اضافه: افزایش یک واحد
    decrement,    // ✅ اضافه: کاهش یک واحد
    clear,
    total,
    count,
    hasItem,
    getItemQty,
    hasStockIssues,
    isEmpty: items.length === 0,  // ✅ اضافه: خالی بودن سبد
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// ============================================
// 🪝 هوک استفاده از سبد خرید
// ============================================
export const useCart = () => {
  const context = useContext(CartContext);
  
  // ✅ اصلاح: خطای واضح‌تر
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
};