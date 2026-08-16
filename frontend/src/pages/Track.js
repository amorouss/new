import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { api, fmtToman, formatApiErrorDetail } from "../lib/api";
import { Search, CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";

// اطلاعات وضعیت سفارش
const STATUS_INFO = {
  pending: { label: "در انتظار تأیید", color: "bg-amber-500", icon: Clock },
  preparing: { label: "در حال آماده‌سازی", color: "bg-blue-500", icon: Package },
  shipped: { label: "ارسال شده", color: "bg-indigo-500", icon: Truck },
  delivered: { label: "تحویل شده", color: "bg-green-500", icon: CheckCircle2 },
  cancelled: { label: "لغو شده", color: "bg-red-500", icon: XCircle },
};

const STEPS = ["pending", "preparing", "shipped", "delivered"];

// ✅ کامپوننت StatusBadge (درست شده)
export function StatusBadge({ status }) {
  const info = STATUS_INFO[status] || STATUS_INFO.pending;
  const Icon = info.icon; // ✅ استفاده از Icon به جای IconComponent
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-semibold ${info.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {info.label}
    </span>
  );
}

export default function Track() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get("code") || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const fetchOrder = async (trackingCode) => {
    if (!trackingCode) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/orders/track/${trackingCode.trim()}`);
      setOrder(data);
    } catch (err) {
      setOrder(null);
      const msg = formatApiErrorDetail(err.response?.data?.detail) || err.message || "سفارش یافت نشد";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const codeParam = params.get("code");
    if (codeParam) fetchOrder(codeParam);
  }, [params]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOrder(code);
  };

  const currentIdx = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* هدر */}
      <div className="text-center mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          پیگیری سفارش
        </span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">وضعیت سفارش خود را ببینید</h1>
        <p className="mt-3 text-muted-foreground">
          کد پیگیری را که در هنگام ثبت سفارش دریافت کرده‌اید وارد کنید.
        </p>
      </div>

      {/* فرم جستجو */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-3 items-end" data-testid="track-form">
        <div className="flex-1 w-full space-y-2">
          <Label htmlFor="track-code">کد پیگیری</Label>
          <Input
            id="track-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="PC-XXXXXXXX"
            data-testid="track-code-input"
            dir="ltr"
            className="text-left uppercase font-mono"
          />
        </div>
        <Button type="submit" size="lg" className="rounded-full" data-testid="track-submit-btn" disabled={loading || !code.trim()}>
          <Search className="w-4 h-4 ml-2" />
          {loading ? "در حال جستجو..." : "جستجو"}
        </Button>
      </form>

      {/* خطا */}
      {error && (
        <div data-testid="track-error" className="mt-6 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-4">
          {error}
        </div>
      )}

      {/* اطلاعات سفارش */}
      {order && (
        <div className="mt-8 space-y-6" data-testid="track-order-details">
          
          {/* وضعیت */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground">کد پیگیری</div>
                <div className="font-mono font-bold text-lg" dir="ltr">{order.tracking_code}</div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* استپ‌ها */}
            {order.status !== "cancelled" && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  {STEPS.map((step, idx) => {
                    const active = idx <= currentIdx;
                    const Info = STATUS_INFO[step];
                    const Icon = Info.icon;
                    return (
                      <div key={step} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-10 h-10 rounded-full grid place-items-center border-2 transition-all ${active ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className={`text-xs mt-2 text-center ${active ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                            {Info.label}
                          </div>
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 -mt-6 ${idx < currentIdx ? "bg-primary" : "bg-border"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* اقلام سفارش */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">اقلام سفارش</h3>
            <div className="divide-y divide-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.quantity} عدد × {fmtToman(item.price)}</div>
                  </div>
                  <div className="font-semibold">{fmtToman(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-muted-foreground">جمع کل</span>
              <span className="text-xl font-extrabold text-primary">{fmtToman(order.total)}</span>
            </div>
          </div>

          {/* اطلاعات تحویل */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">اطلاعات تحویل</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">گیرنده</div>
                <div className="font-medium mt-1">{order.customer_name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">تلفن</div>
                <div className="font-medium mt-1" dir="ltr">{order.phone}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-muted-foreground">آدرس</div>
                <div className="font-medium mt-1">{order.address}</div>
              </div>
              {order.notes && (
                <div className="sm:col-span-2">
                  <div className="text-muted-foreground">یادداشت</div>
                  <div className="font-medium mt-1">{order.notes}</div>
                </div>
              )}
            </div>
          </div>

          {/* دکمه جستجوی مجدد */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => { setOrder(null); setCode(""); window.history.replaceState({}, "", "/track"); }}>
              جستجوی مجدد
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}