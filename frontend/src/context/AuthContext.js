// ============================================
// 📦 ایمپورت‌ها
// ============================================
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

// ============================================
// 🎯 ایجاد Context
// ============================================
const AuthContext = createContext(null);

// ============================================
// 🏭 Provider
// ============================================
export const AuthProvider = ({ children }) => {
  // 
  // ✅ اصلاح: استفاده از ۳ حالت مجزا
  // null = در حال بارگذاری
  // false = احراز هویت نشده (مهمان)
  // object = کاربر احراز هویت شده
  //
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // ✅ اصلاح: اسم واضح‌تر

  // ============================================
  // 🔄 دریافت اطلاعات کاربر
  // ============================================
  const refresh = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch (error) {
      // ✅ بهبود: لاگ خطا برای دیباگ
      console.error("Auth refresh error:", error?.response?.status || error.message);
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  // اجرا در رندر اولیه
  useEffect(() => {
    refresh();
  }, []);

  // ============================================
  // 📝 توابع احراز هویت
  // ============================================

  // ورود
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      return { success: true, data };
    } catch (error) {
      // ✅ بهبود: برگرداندن خطا برای مدیریت در کامپوننت
      const message = error?.response?.data?.detail || "ورود ناموفق بود";
      return { success: false, error: message };
    }
  };

  // ثبت‌نام
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setUser(data);
      return { success: true, data };
    } catch (error) {
      const message = error?.response?.data?.detail || "ثبت‌نام ناموفق بود";
      return { success: false, error: message };
    }
  };

  // خروج
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // ✅ بهبود: لاگ خطا
      console.error("Logout error:", error?.message);
    } finally {
      // ✅ اصلاح: همیشه کاربر رو پاک کن
      setUser(false);
    }
  };

  // ============================================
  // 📊 مقادیر Context
  // ============================================
  const value = {
    user,
    loading,
    isAuthenticated: !!user,        // ✅ اضافه: راحت‌تر برای استفاده
    isAdmin: user?.role === "admin", // ✅ اضافه: بررسی ادمین
    login,
    register,
    logout,
    refresh,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// 🪝 هوک استفاده از Auth
// ============================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // ✅ اصلاح: خطای واضح‌تر اگر خارج از Provider استفاده بشه
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};