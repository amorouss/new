// ============================================
// 📦 ایمپورت‌ها
// ============================================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/PasswordInput";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { formatApiErrorDetail } from "../lib/api";
import { toast } from "sonner";
import { Coffee } from "lucide-react";

// ============================================
// 🏠 کامپوننت صفحه ورود
// ============================================
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();  // ✅ اصلاح: اسم واضح‌تر
  
  // State‌ها
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // 📝 ارسال فرم
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ اصلاح: login الان { success, data } برمی‌گردونه
      const result = await login(email, password);
      
      if (result.success) {
        const user = result.data;
        toast.success(`خوش آمدید ${user.name || "کاربر عزیز"}!`);
        
        // ریدایرکت بر اساس نقش
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/shop");
        }
      } else {
        // خطا از سمت سرور
        setError(result.error || "ورود ناموفق بود");
        toast.error(result.error || "ورود ناموفق بود");
      }
      
    } catch (err) {
      // خطای غیرمنتظره
      const msg = formatApiErrorDetail(err.response?.data?.detail) || err.message || "خطای شبکه";
      setError(msg);
      toast.error(msg);
      console.error("Login error:", err);
      
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 🎨 رندر
  // ============================================
  return (
    <div className="min-h-[calc(100vh-8rem)] grid lg:grid-cols-2">
      
      {/* ============================================
          🖼️ سمت چپ - تصویر
          ============================================ */}
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1675306408031-a9aad9f23308?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY29mZmVlJTIwYmVhbnMlMjBkYXJrfGVufDB8fHx8MTc4NDA1MDE3NHww&ixlib=rb-4.1.0&q=85"
          alt="دانه‌های قهوه"
          className="w-full h-full object-cover"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        {/* متن روی تصویر */}
        <div className="absolute bottom-10 right-10 left-10 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Coffee className="w-6 h-6" />
            <span className="font-bold">قهوهٔ اقبال</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            به خانهٔ عطرها بازگردید.
          </h2>
        </div>
      </div>

      {/* ============================================
          📝 سمت راست - فرم ورود
          ============================================ */}
      <div className="flex items-center justify-center p-8">
        <form 
          onSubmit={handleSubmit} 
          className="w-full max-w-md space-y-6" 
          data-testid="login-form"
        >
          {/* عنوان */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ورود به حساب</h1>
            <p className="text-sm text-muted-foreground mt-2">
              حساب ندارید؟{" "}
              <Link 
                to="/register" 
                className="text-primary hover:underline" 
                data-testid="login-goto-register"
              >
                ثبت‌نام کنید
              </Link>
            </p>
          </div>

          {/* ایمیل */}
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="login-email-input"
              placeholder="you@example.com"
              className="text-left"
              dir="ltr"
              autoComplete="email"
            />
          </div>

          {/* رمز عبور */}
          <div className="space-y-2">
            <Label htmlFor="password">رمز عبور</Label>
            <PasswordInput
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="login-password-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {/* نمایش خطا */}
          {error && (
            <div
              data-testid="login-error"
              className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3"
            >
              {error}
            </div>
          )}

          {/* دکمه ورود */}
          <Button
            type="submit"
            data-testid="login-submit-btn"
            disabled={loading}
            className="w-full rounded-full"
            size="lg"
          >
            {loading ? (
              <>
                <span className="animate-pulse">در حال ورود...</span>
              </>
            ) : (
              "ورود"
            )}
          </Button>

          {/* اطلاعات ادمین آزمایشی */}
          <div className="text-xs text-muted-foreground border-t border-border pt-4 text-center">
          
            <span className="text-foreground font-mono bg-muted px-2 py-0.5 rounded">
             
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}