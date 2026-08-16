import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // ✅ اضافه شده
import { api, fmtToman, formatApiErrorDetail } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Minus, Plus, Trash2, CreditCard, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, total, setQty, remove, clear } = useCart();
  const { user } = useAuth(); // ✅ دریافت اطلاعات کاربر
  const navigate = useNavigate();

  // State‌های فرم
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);

  // ============================================
  // ✅ ثبت سفارش (با بررسی احراز هویت)
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ بررسی: کاربر وارد شده است؟
    if (!user) {
      toast.error('لطفاً ابتدا وارد حساب خود شوید');
      navigate('/login');
      return;
    }

    // اعتبارسنجی فرم
    if (items.length === 0) {
      toast.error('سبد شما خالی است');
      return;
    }

    if (!customerName.trim()) {
      toast.error('نام گیرنده را وارد کنید');
      return;
    }

    if (!phone.trim()) {
      toast.error('شماره تماس را وارد کنید');
      return;
    }

    if (!address.trim()) {
      toast.error('آدرس را وارد کنید');
      return;
    }

    setPlacing(true);

    try {
      const { data } = await api.post('/orders', {
        items: items.map(({ id, name, price, quantity }) => ({
          product_id: id,
          name,
          price,
          quantity,
        })),
        customer_name: customerName,
        phone,
        address,
        notes,
      });

      clear();
      toast.success('سفارش شما با موفقیت ثبت شد!');
      navigate(`/track?code=${data.tracking_code}`);
    } catch (err) {
      const msg = formatApiErrorDetail(err.response?.data?.detail) || err.message || 'خطا در ثبت سفارش';
      toast.error(msg);
      console.error('Order error:', err);
    } finally {
      setPlacing(false);
    }
  };

  // ============================================
  // 🎨 رندر
  // ============================================
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* هدر */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">سبد خرید</h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            data-testid="clear-cart-btn"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 ml-1" />
            خالی کردن سبد
          </Button>
        )}
      </div>

      {/* سبد خالی */}
      {items.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-muted-foreground text-lg">سبد شما خالی است.</p>
          <p className="text-sm text-muted-foreground mt-1">برای خرید، به فروشگاه بروید</p>
          <Button className="mt-6 rounded-full" data-testid="cart-goto-shop-btn" onClick={() => navigate('/shop')}>
            بازگشت به فروشگاه
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* لیست آیتم‌ها */}
          <div className="lg:col-span-2 space-y-4" data-testid="cart-items">
            {items.map((item) => (
              <div
                key={item.id}
                data-testid={`cart-item-${item.id}`}
                className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:shadow-sm transition-shadow"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                    loading="lazy"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{item.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{fmtToman(item.price)}</div>
                </div>

                <div className="flex items-center border border-border rounded-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid={`cart-decrease-${item.id}`}
                    onClick={() => {
                      if (item.quantity > 1) {
                        setQty(item.id, item.quantity - 1);
                      } else {
                        remove(item.id);
                      }
                    }}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid={`cart-increase-${item.id}`}
                    onClick={() => setQty(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  data-testid={`cart-remove-${item.id}`}
                  onClick={() => remove(item.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {/* فرم ثبت سفارش */}
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5 h-fit lg:sticky lg:top-24"
            data-testid="checkout-form"
          >
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              اطلاعات تحویل
            </h2>

            {/* ✅ پیام ورود برای کاربران مهمان */}
            {!user && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-400">
                <p className="font-semibold">⚠️ برای ثبت سفارش باید وارد حساب خود شوید</p>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="mt-2 text-primary font-semibold hover:underline"
                >
                  وارد شوید →
                </button>
              </div>
            )}

            {/* نام گیرنده */}
            <div className="space-y-2">
              <Label htmlFor="customer_name">نام گیرنده</Label>
              <Input
                id="customer_name"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                data-testid="checkout-name-input"
                placeholder="نام کامل"
                disabled={!user} // ✅ غیرفعال برای کاربران مهمان
              />
            </div>

            {/* شماره تماس */}
            <div className="space-y-2">
              <Label htmlFor="phone">شماره تماس</Label>
              <Input
                id="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                data-testid="checkout-phone-input"
                dir="ltr"
                className="text-left"
                placeholder="09xxxxxxxxx"
                disabled={!user} // ✅ غیرفعال برای کاربران مهمان
              />
            </div>

            {/* آدرس */}
            <div className="space-y-2">
              <Label htmlFor="address">آدرس کامل</Label>
              <Textarea
                id="address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                data-testid="checkout-address-input"
                rows={3}
                placeholder="استان، شهر، خیابان، پلاک..."
                disabled={!user} // ✅ غیرفعال برای کاربران مهمان
              />
            </div>

            {/* یادداشت */}
            <div className="space-y-2">
              <Label htmlFor="notes">یادداشت (اختیاری)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-testid="checkout-notes-input"
                rows={2}
                placeholder="نکات ویژه، درخواست‌ها..."
                disabled={!user} // ✅ غیرفعال برای کاربران مهمان
              />
            </div>

            {/* جمع کل */}
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <span className="text-muted-foreground">جمع کل</span>
              <span className="text-2xl font-extrabold text-primary" data-testid="cart-total">
                {fmtToman(total)}
              </span>
            </div>

            {/* اطلاعات پرداخت */}
            <div className="border border-dashed border-border rounded-xl p-4 bg-muted/40">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="w-4 h-4 text-primary" />
                پرداخت آنلاین
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                در نسخهٔ فعلی پرداخت آنلاین فعال نیست. سفارش شما ثبت می‌شود و ادمین
                برای هماهنگی پرداخت با شما تماس می‌گیرد.
              </p>
            </div>

            {/* ✅ دکمه ثبت سفارش (فقط برای کاربران وارد شده فعال) */}
            <Button
              type="submit"
              disabled={placing || items.length === 0 || !user} // ✅ فقط کاربران وارد شده
              data-testid="place-order-btn"
              className="w-full rounded-full"
              size="lg"
            >
              {!user ? (
                'برای ثبت سفارش وارد شوید'
              ) : placing ? (
                <span className="animate-pulse">در حال ثبت...</span>
              ) : (
                `ثبت سفارش (${items.length} آیتم)`
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}