import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bean, Heart, Sparkles } from "lucide-react";
import { api, fmtToman, displayProductDescription } from "../lib/api";
import { ABOUT_PARAGRAPHS, ABOUT_CLOSING, BRAND } from "../lib/brand";
import { Button } from "../components/ui/button";

const pillars = [
  { icon: Bean, title: "انتخاب دانه", text: "دانه‌های مرغوب، با عطر و طعمی که در خاطر می‌ماند." },
  { icon: Heart, title: "برشته‌کاری با دقت", text: "کیفیت تعهد ماست؛ از رست تا بسته‌بندی." },
  { icon: Sparkles, title: "الهام از اندیشه", text: "هر فنجان، آغاز گفت‌وگو و لحظه‌ای برای خلق ایده." },
];

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = `${BRAND.shopFa} | دانه قهوه با اصالت هنر و اندیشه`;
    api
      .get("/products")
      .then(({ data }) => {
        if (Array.isArray(data)) setProducts(data.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-mask pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-primary mb-4">
              {BRAND.nameEn}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
              {BRAND.shopFa}
              <br />
              <span className="text-primary">با بهترین کیفیت</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              یک فنجان قهوه، آغاز یک روز و فرصتی برای خلق ایده‌های تازه است. دانه‌های باکیفیت اقبال را برای دم‌آوری در خانه و کافه انتخاب کنید.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/shop">
                <Button className="px-8 py-6 rounded-full text-base shadow-lg">ورود به فروشگاه</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="px-8 py-6 rounded-full text-base">
                  درباره برند اقبال
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {pillars.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground grid place-items-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <span className="text-xs font-semibold tracking-[0.2em] text-primary">داستان برند</span>
        <h2 className="mt-3 text-3xl font-bold">درباره برند اقبال</h2>
        <p className="mt-5 text-muted-foreground leading-loose text-lg">{ABOUT_PARAGRAPHS[0]}</p>
        <blockquote className="mt-8 border-r-4 border-primary pr-5 text-foreground font-medium leading-relaxed">
          {ABOUT_CLOSING}
        </blockquote>
        <Link to="/about" className="inline-flex items-center gap-2 mt-6 text-primary font-semibold hover:underline">
          ادامه داستان برند
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </section>

      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-primary">فروشگاه</span>
              <h2 className="mt-3 text-3xl font-bold">دانه‌های منتخب</h2>
            </div>
            <Link to="/shop" className="text-sm text-primary font-semibold hover:underline">
              مشاهده همه
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to="/shop"
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-4xl">🫘</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {displayProductDescription(product.description)}
                  </p>
                  <div className="mt-3 font-extrabold text-primary">{fmtToman(product.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
