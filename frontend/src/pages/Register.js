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
import { UserPlus } from "lucide-react"; 
// ============================================
// 🏠 کامپوننت صفحه ثبت‌نام
// ============================================
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();  // ✅ اصلاح: اسم واضح‌تر
  
  // State‌ها
  const [name, setName] = useState("");
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

    // ✅ اعتبارسنجی ساده کلاینت
    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ حرف باشد");
      toast.error("رمز عبور باید حداقل ۶ حرف باشد");
      setLoading(false);
      return;
    }

    try {
      // ✅ اصلاح: register الان { success, data } برمی‌گردونه
      const result = await register(name, email, password);
      
      if (result.success) {
        toast.success(`حساب کاربری ${result.data.name || "شما"} ساخته شد!`);
        navigate("/shop");
      } else {
        // خطا از سمت سرور
        setError(result.error || "ثبت‌نام ناموفق بود");
        toast.error(result.error || "ثبت‌نام ناموفق بود");
      }
      
    } catch (err) {
      // خطای غیرمنتظره
      const msg = formatApiErrorDetail(err.response?.data?.detail) || err.message || "خطای شبکه";
      setError(msg);
      toast.error(msg);
      console.error("Register error:", err);
      
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 🎨 رندر
  // ============================================
  return (
    <div className="min-h-[calc(100vh-8rem)] grid place-items-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6"
        data-testid="register-form"
      >
        {/* ============================================
            📝 عنوان
            ============================================ */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">ثبت‌نام</h1>
          <p className="text-sm text-muted-foreground mt-2">
            حساب دارید؟{" "}
            <Link 
              to="/login" 
              className="text-primary hover:underline" 
              data-testid="register-goto-login"
            >
              وارد شوید
            </Link>
          </p>
        </div>

        {/* ============================================
            📝 فیلدهای فرم
            ============================================ */}

        {/* نام و نام خانوادگی */}
        <div className="space-y-2">
          <Label htmlFor="name">نام و نام خانوادگی</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="register-name-input"
            placeholder="نام خود را وارد کنید"
            autoComplete="name"
          />
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
            data-testid="register-email-input"
            dir="ltr"
            className="text-left"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        {/* رمز عبور */}
        <div className="space-y-2">
          <Label htmlFor="password">
            رمز عبور
            <span className="text-xs text-muted-foreground mr-1">(حداقل ۶ حرف)</span>
          </Label>
          <PasswordInput
            id="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="register-password-input"
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {/* نشانگر قدرت رمز عبور */}
          {password.length > 0 && (
            <div className="text-xs text-muted-foreground">
              قدرت:{" "}
              <span className={
                password.length < 4 ? "text-red-500" :
                password.length < 6 ? "text-yellow-500" :
                "text-green-500"
              }>
                {password.length < 4 ? "ضعیف" :
                 password.length < 6 ? "متوسط" :
                 "قوی"}
              </span>
            </div>
          )}
        </div>

        {/* نمایش خطا */}
        {error && (
          <div
            data-testid="register-error"
            className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3"
          >
            {error}
          </div>
        )}
        

        {/* دکمه ثبت‌نام */}
        <Button
          type="submit"
          data-testid="register-submit-btn"
          disabled={loading || !name || !email || password.length < 6}
          className="w-full rounded-full"
          size="lg"
        >
          {loading ? (
            <>
              <span className="animate-pulse">در حال ساخت حساب...</span>
            </>
          ) : (
            "ساخت حساب"
          )}
        </Button>

        {/* اطلاعات اضافی */}
        <div className="text-xs text-muted-foreground border-t border-border pt-4 text-center">
          با ثبت‌نام، با{" "}
          <Link to="/terms" className="text-primary hover:underline">قوانین و مقررات</Link>{" "}
          و{" "}
          <Link to="/privacy" className="text-primary hover:underline">حریم خصوصی</Link>{" "}
          موافقت می‌کنید.
        </div>
      </form>
    </div>
  );
}