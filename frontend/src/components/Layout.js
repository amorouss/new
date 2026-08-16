import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  Coffee,
  Sun,
  Moon,
  MapPin,
  Phone,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/button";
import { BRAND } from "../lib/brand";

const navLinkClass = ({ isActive }) =>
  `text-sm transition-colors hover:text-primary ${
    isActive ? "text-primary font-semibold" : "text-muted-foreground"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block rounded-xl px-4 py-3 text-base ${
    isActive ? "bg-accent text-primary font-semibold" : "text-foreground"
  }`;

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col grain bg-background text-foreground transition-colors duration-300">
      <header
        data-testid="site-header"
        className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" data-testid="brand-link" className="flex items-center gap-2 group" onClick={closeMenu}>
            <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground grid place-items-center group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold tracking-tight leading-none">{BRAND.cafeFa}</div>
              <div className="text-[10px] text-muted-foreground">{BRAND.nameEn}</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" data-testid="nav-home" end className={navLinkClass}>
              خانه
            </NavLink>
            <NavLink to="/about" data-testid="nav-about" className={navLinkClass}>
              درباره برند
            </NavLink>
            <NavLink to="/shop" data-testid="nav-shop" className={navLinkClass}>
              فروشگاه
            </NavLink>
            <NavLink to="/track" data-testid="nav-track" className={navLinkClass}>
              پیگیری سفارش
            </NavLink>
            {user && user.role === "customer" && (
              <NavLink to="/my-orders" data-testid="nav-my-orders" className={navLinkClass}>
                سفارش‌های من
              </NavLink>
            )}
            {user && user.role === "admin" && (
              <NavLink to="/admin" data-testid="nav-admin" className={navLinkClass}>
                پنل مدیریت
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="theme-toggle-btn"
              className="rounded-full"
              aria-label={darkMode ? "حالت روشن" : "حالت تاریک"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              data-testid="cart-button"
              onClick={() => navigate("/cart")}
              className="relative"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span
                  data-testid="cart-count"
                  className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 grid place-items-center"
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {user.role === "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid="admin-shortcut-btn"
                    onClick={() => navigate("/admin")}
                  >
                    <LayoutDashboard className="w-4 h-4 ml-1" />
                    ادمین
                  </Button>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span data-testid="user-name">{user.name || "کاربر"}</span>
                </div>
                <Button variant="ghost" size="icon" data-testid="logout-btn" onClick={handleLogout} aria-label="خروج">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" data-testid="header-login-btn" onClick={() => navigate("/login")}>
                  ورود
                </Button>
                <Button size="sm" data-testid="header-register-btn" onClick={() => navigate("/register")} className="rounded-full">
                  ثبت‌نام
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              <NavLink to="/" end className={mobileLinkClass} onClick={closeMenu}>
                خانه
              </NavLink>
              <NavLink to="/about" className={mobileLinkClass} onClick={closeMenu}>
                درباره برند
              </NavLink>
              <NavLink to="/shop" className={mobileLinkClass} onClick={closeMenu}>
                فروشگاه
              </NavLink>
              <NavLink to="/track" className={mobileLinkClass} onClick={closeMenu}>
                پیگیری سفارش
              </NavLink>
              {user && user.role === "customer" && (
                <NavLink to="/my-orders" className={mobileLinkClass} onClick={closeMenu}>
                  سفارش‌های من
                </NavLink>
              )}
              {user && user.role === "admin" && (
                <NavLink to="/admin" className={mobileLinkClass} onClick={closeMenu}>
                  پنل مدیریت
                </NavLink>
              )}
              <div className="pt-3 flex gap-2">
                {user ? (
                  <Button variant="outline" className="flex-1" onClick={handleLogout}>
                    خروج از حساب
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => { closeMenu(); navigate("/login"); }}>
                      ورود
                    </Button>
                    <Button className="flex-1 rounded-full" onClick={() => { closeMenu(); navigate("/register"); }}>
                      ثبت‌نام
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border mt-16 bg-card/40">
        <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-primary text-primary-foreground grid place-items-center">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">{BRAND.cafeFa}</div>
                <div className="text-xs text-muted-foreground">{BRAND.tagline}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              فروش دانه قهوه باکیفیت؛ از انتخاب دانه تا برشته‌کاری و بسته‌بندی، با عشق و دقت.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4">تماس با ما</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{BRAND.address}</span>
              </li>
              {BRAND.phones.map((p) => (
                <li key={p.href} className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href={p.href} className="hover:text-primary" dir="ltr">
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4">پیوندها</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-primary transition-colors">درباره برند اقبال</Link>
              <Link to="/shop" className="hover:text-primary transition-colors">فروشگاه دانه‌ها</Link>
              <Link to="/track" className="hover:text-primary transition-colors">پیگیری سفارش</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">قوانین و مقررات</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">حریم خصوصی</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND.cafeFa} — {BRAND.nameEn}
        </div>
      </footer>
    </div>
  );
}
