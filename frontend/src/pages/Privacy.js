import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* هدر */}
      <div className="mb-8">
        <Link to="/" className="text-sm text-primary hover:underline flex items-center gap-1">
          <ArrowRight className="w-4 h-4" />
          بازگشت به خانه
        </Link>
        <h1 className="text-3xl font-bold mt-4">حریم خصوصی</h1>
        <p className="text-muted-foreground mt-2">آخرین به‌روزرسانی: تیر ۱۴۰۴</p>
      </div>

      <div className="space-y-6 text-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-3">۱. اطلاعاتی که جمع‌آوری می‌کنیم</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>نام و نام خانوادگی</li>
            <li>آدرس ایمیل</li>
            <li>شماره تماس</li>
            <li>آدرس تحویل سفارش</li>
            <li>تاریخچه خرید</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۲. نحوه استفاده از اطلاعات</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>پردازش سفارش‌ها و ارسال کالا</li>
            <li>ارسال اطلاعیه‌های مرتبط با سفارش</li>
            <li>بهبود تجربه کاربری</li>
            <li>ارتباط با کاربران در صورت نیاز</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۳. امنیت اطلاعات</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>اطلاعات شما با بالاترین سطح امنیت ذخیره می‌شود.</li>
            <li>رمز عبور به صورت هش شده ذخیره می‌گردد.</li>
            <li>اطلاعات بانکی شما ذخیره نمی‌شود.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۴. اشتراک‌گذاری اطلاعات</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>اطلاعات شما با هیچ شخص ثالثی به اشتراک گذاشته نمی‌شود.</li>
            <li>تنها در موارد قانونی، اطلاعات به مراجع ذی‌صلاح ارائه می‌شود.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۵. کوکی‌ها (Cookies)</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>برای بهبود تجربه کاربری از کوکی‌ها استفاده می‌شود.</li>
            <li>شما می‌توانید کوکی‌ها را در مرورگر خود غیرفعال کنید.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۶. حقوق کاربران</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>دسترسی به اطلاعات خود</li>
            <li>تصحیح اطلاعات نادرست</li>
            <li>درخواست حذف اطلاعات</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">۷. تماس با ما</h2>
          <p className="text-muted-foreground">
            در صورت سوال درباره حریم خصوصی، با ما تماس بگیرید.
          </p>
        </section>
      </div>

      {/* فوتر صفحه */}
      <div className="mt-8 pt-8 border-t border-border text-sm text-muted-foreground">
        <p>آخرین به‌روزرسانی: تیر ۱۴۰۴</p>
      </div>
    </div>
  );
}