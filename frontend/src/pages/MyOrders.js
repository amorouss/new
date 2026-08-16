// ============================================
// 📦 ایمپورت‌ها
// ============================================
import { useEffect, useState } from "react";
import { api, fmtToman } from "../lib/api";
import { StatusBadge } from "./Track";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft, ShoppingBag, Package } from "lucide-react";

// ============================================
// 🏠 کامپوننت صفحه سفارش‌های من
// ============================================
export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // ✅ اضافه: مدیریت خطا

  // ============================================
  // 📦 دریافت سفارش‌ها
  // ============================================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/orders/mine");
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("خطا در دریافت سفارش‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ============================================
  // 📅 فرمت تاریخ فارسی
  // ============================================
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ============================================
  // 🎨 رندر
  // ============================================
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      
      {/* هدر */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Package className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">سفارش‌های من</h1>
          <p className="text-sm text-muted-foreground mt-1">
            لیست تمام سفارش‌های ثبت شده شما
          </p>
        </div>
      </div>

      {/* ============================================
          🔄 وضعیت‌های مختلف
          ============================================ */}

      {/* لودینگ */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-24" />
                  <div className="h-5 bg-muted rounded w-32" />
                </div>
                <div className="h-8 bg-muted rounded-full w-24" />
                <div className="h-6 bg-muted rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* خطا */}
      {error && !loading && (
        <div className="text-center py-24">
          <div className="text-destructive text-lg font-semibold">{error}</div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            تلاش مجدد
          </Button>
        </div>
      )}

      {/* بدون سفارش */}
      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-muted-foreground text-lg">هنوز سفارشی ثبت نکرده‌اید.</p>
          <p className="text-sm text-muted-foreground mt-1">
            اولین سفارش خود را ثبت کنید
          </p>
          <Link to="/shop">
            <Button className="mt-6 rounded-full" data-testid="my-orders-shop-btn">
              <ShoppingBag className="w-4 h-4 ml-2" />
              رفتن به فروشگاه
            </Button>
          </Link>
        </div>
      )}

      {/* لیست سفارش‌ها */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4" data-testid="my-orders-list">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/track?code=${order.tracking_code}`}  // ✅ اصلاح: بک‌تیک
              data-testid={`my-order-${order.id}`}       // ✅ اصلاح: بک‌تیک
              className="block bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:border-primary/30 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* کد پیگیری */}
                <div>
                  <div className="text-xs text-muted-foreground">کد پیگیری</div>
                  <div className="font-mono font-bold text-sm" dir="ltr">
                    {order.tracking_code}
                  </div>
                </div>

                {/* وضعیت */}
                <StatusBadge status={order.status} />

                {/* مبلغ */}
                <div>
                  <div className="text-xs text-muted-foreground text-left">مبلغ</div>
                  <div className="font-bold text-primary text-left">
                    {fmtToman(order.total)}
                  </div>
                </div>

                {/* تاریخ */}
                <div className="text-xs text-muted-foreground text-left min-w-[100px]">
                  {formatDate(order.created_at)}
                </div>

                {/* فلش */}
                <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {/* نمایش تعداد اقلام */}
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{order.items?.length || 0} قلم کالا</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>تحویل به: {order.customer_name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}