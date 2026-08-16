# Setup — روز صفر (۳۰ تا ۴۵ دقیقه)

این کار را قبل از روز ۱ یا در ابتدای روز ۱ انجام بده. اگر قبلاً داری، فقط تیک بزن.

## حساب‌ها و لاب (مجاز)

- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — منبع اصلی این ۳۰ روز
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — برای write-up و دمو
- اختیاری: [crAPI](https://github.com/OWASP/crAPI) برای API در هفته ۳

## ابزار

حداقل:

- Burp Suite Community
- Firefox یا Chromium جدا برای تست (یک پروفایل تمیز)
- Python 3.10+
- Git

مفید ولی اجباری نیست:

- `jq`, `httpie` یا `curl`
- VS Code / Cursor
- Docker (برای Juice Shop)

## ساختار نوت

هر لاب را در همان روز در `notes/YYYY-MM-DD.md` بنویس. قالب کوتاه:

```md
# موضوع
## چه چیزی را تست کردم
## چه چیزی کار کرد
## چه چیزی را اشتباه فهمیدم
## یک جمله برای مصاحبه
```

نوت خصوصی است. write-up عمومی جدا است و فقط از لاب مجاز ساخته می‌شود.

## قانون write-up عمومی

- هدف: لاب آموزشی یا اپ آسیب‌پذیر معروف
- شکل: گزارش یافته پنتست، نه داستان CTF
- هر گزارش باید impact، root cause و remediation داشته باشد
- اسکرین‌شات را سانسور کن؛ توکن و کوکی واقعی نگذار

قالب: [`writeups/TEMPLATE.md`](../writeups/TEMPLATE.md)
