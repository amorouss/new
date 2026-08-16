// ============================================
// 📦 ایمپورت‌ها
// ============================================
import { useEffect, useState } from "react";
import { api, fmtToman, displayProductDescription } from "../lib/api";
import { Button } from "../components/ui/button";
import { Plus, ShoppingBag, Filter } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { BRAND } from "../lib/brand";

// ============================================
// 🏠 کامپوننت صفحه فروشگاه
// ============================================
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { add, hasItem, getItemQty } = useCart();

  useEffect(() => {
    document.title = `فروشگاه دانه‌ها | ${BRAND.shopFa}`;
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/products/categories");
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = selectedCategory ? { category: selectedCategory } : {};
        const response = await api.get("/products", { params });
        
        // ✅ بررسی: آیا داده‌ها آرایه هستند؟
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("Data is not an array:", response.data);
          setError("داده‌های دریافتی نامعتبر است");
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("خطا در دریافت محصولات");
        toast.error("خطا در دریافت محصولات");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // ============================================
  // 🛒 افزودن به سبد خرید
  // ============================================
  const handleAddToCart = (product) => {
    add(product);
    toast.success(`${product.name} به سبد خرید اضافه شد`, {
      icon: <ShoppingBag className="w-4 h-4" />,
    });
  };

  // ============================================
  // 🎨 رندر
  // ============================================
  
  // ✅ اگر خطا داشت
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="text-destructive text-lg font-semibold">{error}</div>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          تلاش مجدد
        </Button>
      </div>
    );
  }

  // ✅ اگر لودینگ بود
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[4/5] bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ اگر محصولی نبود
  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-muted-foreground py-24 text-center border border-dashed border-border rounded-2xl">
          <div className="text-4xl mb-4">🫘</div>
          <div className="text-lg font-medium">فعلاً محصولی موجود نیست</div>
          <div className="text-sm mt-2">به زودی دانه‌های تازه اضافه می‌شوند</div>
        </div>
      </div>
    );
  }

  // ✅ نمایش محصولات
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      
      {/* هدر صفحه */}
      <div className="flex flex-col gap-6 mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            فروشگاه
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">دانه‌های امروز</h1>
          <p className="mt-3 text-muted-foreground max-w-lg">
            گزیده‌ای از رست‌های تازه، مناسب هر روشِ دم‌آوری. سبد خود را بسازید و
            سفارش دهید.
          </p>
        </div>

        {/* فیلتر دسته‌بندی */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" data-testid="category-filters">
            <span className="text-sm text-muted-foreground flex items-center gap-1 ml-2">
              <Filter className="w-4 h-4" />
              دسته‌بندی:
            </span>
            <Button
              size="sm"
              variant={selectedCategory === "" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setSelectedCategory("")}
              data-testid="filter-all"
            >
              همه
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSelectedCategory(cat)}
                data-testid={`filter-${cat}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* گرید محصولات */}
      <div
        data-testid="products-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.map((product, index) => {
          const inCart = hasItem(product.id);
          const qty = getItemQty(product.id);

          return (
            <motion.div
              key={product.id || index}
              data-testid={`product-card-${product.id}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
            >
              {/* تصویر محصول */}
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground">
                    <span className="text-4xl">🫘</span>
                    <span className="text-xs mt-2">بدون تصویر</span>
                  </div>
                )}
                
                {/* برچسب دسته‌بندی */}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-medium">
                  {product.category || "قهوه"}
                </div>
              </div>

              {/* اطلاعات محصول */}
              <div className="p-5">
                <h3 className="font-bold text-lg leading-tight line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-[2.5rem]">
                  {displayProductDescription(product.description)}
                </p>
                
                {/* قیمت و دکمه */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="font-extrabold text-primary">
                    {fmtToman(product.price)}
                  </div>
                  
                  <Button
                    size="sm"
                    data-testid={`add-to-cart-${product.id}`}
                    className="rounded-full"
                    onClick={() => handleAddToCart(product)}
                    variant={inCart ? "secondary" : "default"}
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    {inCart ? `${qty} در سبد` : "افزودن"}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}