# Project pitch (60 seconds)

روز ۲۴ این متن را با صدای خودت بازنویسی کن.

## نسخه پایه

I built `appsec-review`, a small AppSec review CLI. It is not an exploit scanner. It helps me do the boring, repeatable part of a web review: security headers, cookie flags, and JWT structure checks, then writes a Markdown report I can attach to notes.

I use it next to a manual checklist. The scanner catches missing `HttpOnly` or an `alg=none` token. The checklist is where I test IDOR and business logic, which tools miss.

I wrote tests for the JWT and header logic so I can change it without breaking the report.

## نسخه فارسی (اگر مصاحبه فارسی است)

یک CLI برای بازبینی AppSec ساختم، نه اسکنر حمله. بخش تکراری ریویو را خودکار می‌کند: هدرهای امنیتی، پرچم کوکی، و شکل JWT. خروجی‌اش گزارش Markdown است.

کنارش یک چک‌لیست دستی دارم. IDOR و منطق کسب‌وکار را ابزار نمی‌فهمد؛ آن را خودم تست می‌کنم. برای منطق JWT و هدر تست واحد نوشتم.

## سؤالی که بعدش می‌پرسند

**چرا از Nuclei / Burp scan استفاده نکردی؟**  
آن‌ها را می‌شناسم. این پروژه برای رزومه و یادگیری کنترل‌ها است و مال خودم است؛ می‌توانم چک اضافه کنم و توضیح بدهم.

**محدودیتش چیست؟**  
به هدف‌های مجاز محدود است، exploit نمی‌زند، و access control را پیدا نمی‌کند. این محدودیت عمدی است.
