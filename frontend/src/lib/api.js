// ============================================
// 📦 ایمپورت‌ها
// ============================================
import axios from "axios";

// ============================================
// 🔧 تنظیمات اولیه
// ============================================




const BACKEND_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_BACKEND_URL || import.meta.env?.REACT_APP_BACKEND_URL)) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_BACKEND_URL) ||
  "https://api.cafeiqbal.ir";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);
// ============================================
// 🔄 Interceptor برای مدیریت خطاها
// ============================================

// ============================================
// 🛠 توابع کمکی
// ============================================

/**
 * فرمت کردن پیام خطا برای نمایش به کاربر
 * @param {*} detail - جزئیات خطا از سرور
 * @returns {string} - پیام خطای خوانا
 */
export function formatApiErrorDetail(detail) {
  // خطاهای null/undefined
  if (detail == null) {
    return "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
  }
  
  // رشته ساده
  if (typeof detail === "string") {
    return detail;
  }
  
  // آرایه از خطاها (مثل validation errors)
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        if (e && typeof e.msg === "string") return e.msg;
        if (e && typeof e.message === "string") return e.message;
        return JSON.stringify(e);
      })
      .filter(Boolean)
      .join(" | ");
  }
  
  // آبجکت با msg
  if (detail && typeof detail.msg === "string") {
    return detail.msg;
  }
  
  // آبجکت با message
  if (detail && typeof detail.message === "string") {
    return detail.message;
  }
  
  // fallback
  try {
    return String(detail);
  } catch {
    return "خطای ناشناخته رخ داد";
  }
}

/**
 * تبدیل عدد به تومان با فرمت فارسی
 * @param {number} n - مبلغ به تومان
 * @returns {string} - مبلغ فرمت شده با پسوند تومان
 */
export const fmtToman = (n) => {
  const num = Number(n);
  if (isNaN(num) || num < 0) {
    return "۰ تومان";
  }
  return new Intl.NumberFormat("fa-IR").format(Math.round(num)) + " تومان";
};

export const displayProductDescription = (description) => {
  const text = (description || "").trim();
  if (!text || /^\d+$/.test(text)) {
    return "دانه‌های منتخب، مناسب دم‌آوری خانگی و کافه";
  }
  return text;
};

// ============================================
// 🛒 توابع کمکی برای API
// ============================================

/**
 * دریافت لیست محصولات
 */
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

/**
 * دریافت جزئیات یک محصول
 */
export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

/**
 * ایجاد سفارش جدید
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

/**
 * پیگیری سفارش با کد رهگیری
 */
export const trackOrder = async (code) => {
  const response = await api.get(`/orders/track/${code}`);
  return response.data;
};

/**
 * دریافت اطلاعات کاربر جاری
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ============================================
// 📦 مدیریت سبد خرید (محلی)
// ============================================
export const cartHelpers = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  },
  
  set: (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  },
  
  add: (product, quantity = 1) => {
    const cart = cartHelpers.get();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    cartHelpers.set(cart);
    return cart;
  },
  
  remove: (productId) => {
    let cart = cartHelpers.get();
    cart = cart.filter(item => item.id !== productId);
    cartHelpers.set(cart);
    return cart;
  },
  
  clear: () => {
    localStorage.removeItem('cart');
    return [];
  },
  
  getTotal: () => {
    const cart = cartHelpers.get();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  
  getCount: () => {
    const cart = cartHelpers.get();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }
};

// ============================================
// 🎯 توابع احراز هویت
// ============================================
export const authHelpers = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// ============================================
// 👑 توابع ادمین
// ============================================
export const adminHelpers = {
  getOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },
  
  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  createProduct: async (product) => {
    const response = await api.post('/products', product);
    return response.data;
  },
  
  updateProduct: async (id, product) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },
  
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};