import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* هدر */}
      <div className="mb-8">
        <Link to="/" className="text-sm text-primary hover:underline flex items-center gap-1">
          <ArrowRight className="w-4 h-4" />
          بازگشت به خانه
        </Link>
        <h1 className="text-3xl font-bold mt-4">قوانین و مقررات</h1>
        <p className="text-muted-foreground mt-2">آخرین به‌روزرسانی: تیر ۱۴۰۴</p>
      </div>

      <div className="space-y-6 text-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-3">۱. پذیرش قوانین</h2>
          <p className="text-muted-foreground">
            با ثبت‌نام و استفاده از خدمات فروشگاه قهوهٔ اقبال، شما تمامی قوانین و مقررات این سایت را می‌پذیرید.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۲. ثبت‌نام و حساب کاربری</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>اطلاعات وارد شده باید صحیح و کامل باشد.</li>
            <li>مسئولیت حفظ امنیت رمز عبور بر عهده کاربر است.</li>
            <li>فروشگاه حق دارد حساب‌های کاربری متخلف را مسدود کند.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۳. سفارش و پرداخت</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>سفارش پس از تأیید نهایی توسط فروشگاه قطعی می‌شود.</li>
            <li>قیمت‌ها به تومان بوده و شامل مالیات نمی‌شود.</li>
            <li>در صورت اتمام موجودی، فروشگاه حق لغو سفارش را دارد.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۴. ارسال و تحویل</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>زمان تحویل حدود ۲ تا ۵ روز کاری پس از تأیید سفارش است.</li>
            <li>هزینه ارسال بر اساس آدرس و وزن محاسبه می‌شود.</li>
            <li>مسئولیت ارسال تا زمان تحویل به پست بر عهده فروشگاه است.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۵. بازگشت کالا</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>در صورت وجود مشکل در کالا، تا ۷ روز امکان بازگشت وجود دارد.</li>
            <li>کالا باید در بسته‌بندی اصلی و بدون استفاده باشد.</li>
            <li>هزینه بازگشت بر عهده مشتری است مگر در موارد خاص.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۶. تغییرات در قوانین</h2>
          <p className="text-muted-foreground">
            فروشگاه قهوهٔ اقبال حق دارد قوانین را به‌روزرسانی کند. تغییرات در همین صفحه اعمال می‌شود.
          </p>
        </section>
      </div>

      {/* فوتر صفحه */}
      <div className="mt-8 pt-8 border-t border-border text-sm text-muted-foreground">
        <p>برای اطلاعات بیشتر، با ما تماس بگیرید.</p>
      </div>
    </div>
  );
}