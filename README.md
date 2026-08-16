# 30-Day Web AppSec Sprint

برنامه ۳۰ روزه برای مهندس امنیت وب سطح متوسط: عمق روی آسیب‌پذیری‌های واقعی، ساخت رزومه قابل‌نمایش، و آمادگی مصاحبه.

**زمان روزانه:** حداقل ۳ ساعت  
**خروجی نهایی:** ۵ write-up عمومی + یک ابزار AppSec + چک‌لیست بازبینی + آمادگی مصاحبه

## خروجی رزومه

| خروجی | مسیر | وضعیت هدف |
| --- | --- | --- |
| برنامه روزانه | [`curriculum/30-day-plan.md`](curriculum/30-day-plan.md) | اجرا |
| Write-upها | [`writeups/`](writeups/) | ۳ تا ۵ گزارش عمومی |
| ابزار AppSec | [`project/appsec-review/`](project/appsec-review/) | CLI قابل‌دمو |
| چک‌لیست بازبینی | [`checklists/web-appsec-review.md`](checklists/web-appsec-review.md) | نسخه قابل‌استفاده |
| مصاحبه | [`interview/web-appsec-interview.md`](interview/web-appsec-interview.md) | پاسخ‌های کوتاه و تمرین‌شده |
| پیشرفت | [`PROGRESS.md`](PROGRESS.md) | تیک روزانه |

## قانون کار

فقط روی اهداف مجاز کار کن: PortSwigger Academy، Juice Shop، WebGoat، crAPI، یا اپی که خودت بالا آوردی.  
هیچ هدف واقعی، باگ‌بانتی بدون scope، یا سیستم دیگران بدون مجوز در این ۳۰ روز نیست.

## ساختار هر روز (۳ ساعت)

1. **۴۵ دقیقه مطالعه** — یک موضوع، نه ده تا مقاله پراکنده
2. **۹۰ دقیقه لاب** — حداقل ۲ لاب PortSwigger یا معادل
3. **۴۵ دقیقه خروجی رزومه** — نوت، write-up، کد پروژه، یا سؤال مصاحبه

اگر یک روز کمتر وقت داشتی، لاب را نگه دار و مطالعه را کوتاه کن. لاب اولویت است.

## نقشه ۴ هفته

| هفته | تمرکز | خروجی قابل‌نمایش |
| --- | --- | --- |
| ۱ | Access Control / IDOR / متدولوژی | Write-up ۱ + پیش‌نویس چک‌لیست |
| ۲ | XSS / Injection / CSRF | Write-up ۲ |
| ۳ | JWT / OAuth / SSRF / API | Write-up ۳ + شروع ابزار |
| ۴ | پروژه + write-up ۴ و ۵ + مصاحبه | ابزار کامل + رزومه به‌روز |

جزئیات روزبه‌روز: [`curriculum/30-day-plan.md`](curriculum/30-day-plan.md)

## چرا این ترتیب؟

برای استخدام AppSec / Web Pentest، مصاحبه‌کننده معمولاً این‌ها را می‌سنجد:

1. آیا می‌توانی **Broken Access Control** را روش‌مند پیدا کنی؟
2. آیا XSS و injection را در **context** می‌فهمی، نه فقط payload حفظی؟
3. آیا auth (session / JWT / OAuth) را بلدی توضیح بدهی؟
4. آیا یک **گزارش حرفه‌ای** و یک **پروژه قابل‌دمو** داری؟

هفته ۱ همان مهارتی است که بیشترین باگ واقعی و بیشترین سؤال مصاحبه را می‌سازد.

## شروع امروز

```bash
# ۱. این ریپو را کلون کن و PROGRESS.md را باز کن
# ۲. محیط لاب را بساز (حساب PortSwigger + Burp Community)
# ۳. روز ۱ برنامه را اجرا کن
```

راهنمای محیط: [`curriculum/setup.md`](curriculum/setup.md)
