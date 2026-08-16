import React, { useEffect, useState } from 'react';
import { api, fmtToman, formatApiErrorDetail } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
} from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { StatusBadge } from './Track';
import { Plus, Edit, Trash2, ShoppingBag, Package, Users, TrendingUp, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

// ============================================
// 📊 تنظیمات وضعیت‌ها
// ============================================
const STATUS_OPTIONS = [
  { value: 'pending', label: 'در انتظار تأیید' },
  { value: 'preparing', label: 'در حال آماده‌سازی' },
  { value: 'shipped', label: 'ارسال شده' },
  { value: 'delivered', label: 'تحویل شده' },
  { value: 'cancelled', label: 'لغو شده' },
];

// ============================================
// 🏠 کامپوننت اصلی داشبورد ادمین
// ============================================
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const loadStats = () => api.get('/admin/stats').then((r) => setStats(r.data));

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* هدر */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">پنل مدیریت</h1>
        <p className="text-muted-foreground text-sm mt-2">
          مدیریت سفارش‌ها و محصولات فروشگاه
        </p>
      </div>

      {/* آمار */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="admin-stats">
        <StatCard
          icon={ShoppingBag}
          label="کل سفارش‌ها"
          value={stats?.total_orders ?? '-'}
          testid="stat-total-orders"
        />
        <StatCard
          icon={Package}
          label="در انتظار"
          value={stats?.pending ?? '-'}
          testid="stat-pending"
        />
        <StatCard
          icon={Users}
          label="مشتریان"
          value={stats?.customers ?? '-'}
          testid="stat-customers"
        />
        <StatCard
          icon={TrendingUp}
          label="درآمد کل"
          value={stats ? fmtToman(stats.revenue) : '-'}
          testid="stat-revenue"
          large
        />
      </div>

      {/* تب‌ها */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList data-testid="admin-tabs">
          <TabsTrigger value="orders" data-testid="tab-orders">
            سفارش‌ها
          </TabsTrigger>
          <TabsTrigger value="products" data-testid="tab-products">
            محصولات
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="mt-6">
          <OrdersTable onUpdated={loadStats} />
        </TabsContent>
        
        <TabsContent value="products" className="mt-6">
          <ProductsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// 📊 کارت آمار
// ============================================
function StatCard({ icon: Icon, label, value, testid, large }) {
  return (
    <div
      data-testid={testid}
      className="bg-card border border-border rounded-xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="w-8 h-8 rounded-md bg-accent text-accent-foreground grid place-items-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className={`mt-3 font-extrabold ${large ? 'text-lg' : 'text-2xl'}`}>
        {value}
      </div>
    </div>
  );
}

// ============================================
// 📋 جدول سفارش‌ها
// ============================================
function OrdersTable({ onUpdated }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = () => {
    setLoading(true);
    const params = {};
    if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    return api
      .get('/admin/orders', { params })
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter, dateFrom, dateTo]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success('وضعیت به‌روزرسانی شد');
      await load();
      onUpdated && onUpdated();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    }
  };

  if (loading) return <div className="text-muted-foreground">در حال بارگذاری...</div>;

  return (
    <div>
      {/* فیلترهای سفارش */}
      <div
        className="bg-card border border-border rounded-xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        data-testid="order-filters"
      >
        <div className="space-y-2">
          <Label className="text-xs">وضعیت</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">از تاریخ</Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            dir="ltr"
            data-testid="filter-date-from"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">تا تاریخ</Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            dir="ltr"
            data-testid="filter-date-to"
          />
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setStatusFilter('all');
              setDateFrom('');
              setDateTo('');
            }}
            data-testid="clear-filters"
          >
            پاک کردن فیلترها
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        {orders.length} سفارش
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">سفارشی با این فیلتر یافت نشد.</p>
        </div>
      ) : (
    <div className="space-y-3" data-testid="admin-orders-list">
      {orders.map((order) => (
        <div
          key={order.id}
          data-testid={`admin-order-${order.id}`}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-[240px]">
              
              {/* هدر سفارش */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="font-mono font-bold text-sm" dir="ltr">
                  {order.tracking_code}
                </div>
                <StatusBadge status={order.status} />
                <span className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleString('fa-IR')}
                </span>
              </div>

              {/* اطلاعات سفارش */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">گیرنده</div>
                  <div>{order.customer_name}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">تلفن</div>
                  <div dir="ltr">{order.phone}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">مبلغ</div>
                  <div className="text-primary font-bold">{fmtToman(order.total)}</div>
                </div>
                <div className="sm:col-span-3">
                  <div className="text-muted-foreground text-xs">آدرس</div>
                  <div>{order.address}</div>
                </div>
                {order.notes && (
                  <div className="sm:col-span-3">
                    <div className="text-muted-foreground text-xs">یادداشت</div>
                    <div>{order.notes}</div>
                  </div>
                )}
              </div>

              {/* اقلام سفارش */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {order.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-muted px-2.5 py-1 rounded-full text-muted-foreground"
                  >
                    {item.name} × {item.quantity}
                  </span>
                ))}
              </div>
            </div>

            {/* انتخاب وضعیت */}
            <div className="w-full sm:w-56">
              <Label className="text-xs">تغییر وضعیت</Label>
              <Select
                value={order.status}
                onValueChange={(v) => updateStatus(order.id, v)}
              >
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem 
                      key={s.value} 
                      value={s.value}
                    >
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}
    </div>
      )}
    </div>
  );
}

// ============================================
// 📸 کامپوننت آپلود عکس
// ============================================
function ImageUpload({ onUpload, currentImage }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  useEffect(() => {
    setPreview(currentImage || '');
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // بررسی حجم فایل (حداکثر 5 مگابایت)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم فایل باید کمتر از ۵ مگابایت باشد');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
     const response = await api.post('/upload-image', formData);
      setPreview(response.data.url);
      onUpload(response.data.url);
      toast.success('عکس با موفقیت آپلود شد');
    } catch (error) {
      toast.error('خطا در آپلود عکس');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onUpload('');
  };

  return (
    <div className="space-y-2">
      <Label>تصویر محصول</Label>
      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative w-24 h-24 flex-shrink-0">
            <img 
              src={preview} 
              alt="پیش‌نمایش" 
              className="w-full h-full object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
            <Upload className="w-6 h-6" />
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-muted-foreground mt-1">در حال آپلود...</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">حداکثر حجم: ۵ مگابایت</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 📦 پنل محصولات
// ============================================
function ProductsPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = () =>
    api
      .get('/products')
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const del = async (id) => {
    if (!window.confirm('حذف این محصول؟')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('محصول حذف شد');
      load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    }
  };

  return (
    <div>
      {/* هدر محصولات */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {products.length} محصول
        </div>
        <Button
          data-testid="add-product-btn"
          onClick={() => {
            setEditing({});
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 ml-1" />
          افزودن محصول
        </Button>
      </div>

      {/* لیست محصولات */}
      {loading ? (
        <div className="text-muted-foreground">در حال بارگذاری...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">هیچ محصولی وجود ندارد.</p>
          <Button 
            className="mt-4"
            onClick={() => { setEditing({}); setOpen(true); }}
          >
            <Plus className="w-4 h-4 ml-1" />
            افزودن اولین محصول
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="admin-products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              data-testid={`admin-product-${product.id}`}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* تصویر */}
              <div className="aspect-video bg-muted">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Package className="w-8 h-8" />
                  </div>
                )}
              </div>
              
              {/* اطلاعات */}
              <div className="p-4">
                <div className="font-bold text-sm">{product.name}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2rem]">
                  {product.description || 'بدون توضیحات'}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-primary font-bold text-sm">
                    {fmtToman(product.price)}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid={`edit-product-${product.id}`}
                      onClick={() => {
                        setEditing(product);
                        setOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid={`delete-product-${product.id}`}
                      onClick={() => del(product.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* دیالوگ افزودن/ویرایش محصول */}
      <ProductDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSaved={() => {
          setOpen(false);
          load();
        }}
      />
    </div>
  );
}

// ============================================
// 📝 دیالوگ محصول
// ============================================
function ProductDialog({ open, onOpenChange, editing, onSaved }) {
  const isEdit = editing && editing.id;
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'قهوه',
    stock: 100,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: editing?.name || '',
        description: editing?.description || '',
        price: editing?.price ?? '',
        image_url: editing?.image_url || '',
        category: editing?.category || 'قهوه',
        stock: editing?.stock ?? 100,
      });
    }
  }, [open, editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { 
        ...form, 
        price: Number(form.price), 
        stock: Number(form.stock) 
      };
      
      if (isEdit) {
        await api.put(`/products/${editing.id}`, payload);
        toast.success('محصول به‌روزرسانی شد');
      } else {
        await api.post('/products', payload);
        toast.success('محصول افزوده شد');
      }
      onSaved();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="product-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'ویرایش محصول' : 'افزودن محصول'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* نام */}
          <div className="space-y-2">
            <Label htmlFor="product-name">نام</Label>
            <Input
              id="product-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="product-name-input"
              placeholder="نام محصول"
            />
          </div>
          
          {/* توضیحات */}
          <div className="space-y-2">
            <Label htmlFor="product-desc">توضیحات</Label>
            <Textarea
              id="product-desc"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              data-testid="product-description-input"
              placeholder="توضیحات محصول"
            />
          </div>
          
          {/* قیمت و دسته‌بندی */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-price">قیمت (تومان)</Label>
              <Input
                id="product-price"
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                data-testid="product-price-input"
                dir="ltr"
                placeholder="۰"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-category">دسته‌بندی</Label>
              <Input
                id="product-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                data-testid="product-category-input"
                placeholder="قهوه"
              />
            </div>
          </div>
          
          {/* ✅ آپلود عکس */}
          <ImageUpload
            currentImage={form.image_url}
            onUpload={(url) => setForm({ ...form, image_url: url })}
          />
          
          {/* موجودی */}
          <div className="space-y-2">
            <Label htmlFor="product-stock">موجودی</Label>
            <Input
              id="product-stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              data-testid="product-stock-input"
              dir="ltr"
              placeholder="۱۰۰"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={saving} 
              data-testid="product-save-btn"
              className="w-full sm:w-auto"
            >
              {saving ? 'در حال ذخیره...' : 'ذخیره'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}