import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { ABOUT_CLOSING, ABOUT_PARAGRAPHS, BRAND } from "../lib/brand";
import { Button } from "../components/ui/button";

export default function About() {
  useEffect(() => {
    document.title = `درباره برند اقبال | ${BRAND.shopFa}`;
  }, []);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
        <ArrowRight className="w-4 h-4" />
        بازگشت به خانه
      </Link>

      <header className="mt-6 mb-10">
        <span className="text-xs font-semibold tracking-[0.2em] text-primary">برند</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold mt-3">درباره برند اقبال</h1>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          الهام‌گرفته از اندیشه محمد اقبال لاهوری؛ قهوه‌ای برای آغاز روز، آرامش، و خلق ایده‌های تازه.
        </p>
      </header>

      <div className="space-y-8 text-lg leading-loose text-foreground">
        {ABOUT_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>

      <blockquote className="mt-12 rounded-2xl bg-accent/60 border border-border p-6 sm:p-8 text-xl font-semibold leading-relaxed text-foreground">
        {ABOUT_CLOSING}
      </blockquote>

      <div className="mt-10 flex items-start gap-3 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p>
          خانهٔ {BRAND.cafeFa} کنار میدان اقبال لاهوری است: {BRAND.address}
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/shop">
          <Button className="rounded-full px-8">خرید دانه قهوه</Button>
        </Link>
        <Link to="/track">
          <Button variant="outline" className="rounded-full px-8">
            پیگیری سفارش
          </Button>
        </Link>
      </div>
    </article>
  );
}
