# Resume and GitHub — Day 29

هدف: یک غریبه در دو دقیقه بفهمد تو Web AppSec بلدی، نه اینکه «دوره گذرانده‌ای».

## سه bullet پیشنهادی (با عدد و اثر)

قالب: عمل + محدوده + نتیجه.

نمونه‌ها را با کار واقعی خودت عوض کن:

- Mapped and tested broken access control on training apps; wrote a public IDOR finding with request-level reproduction and developer remediations.
- Built `appsec-review`, a Python CLI that flags missing security headers, weak cookie flags, and JWT misconfiguration; published a sample report.
- Documented 4 web vulnerability write-ups (access control, XSS, JWT/SSRF, API) using a consistent pentest-report format.

از این‌ها پرهیز کن:

- "Familiar with OWASP Top 10"
- "Worked with Burp Suite"
- "Passionate about cybersecurity"

این‌ها را همه می‌نویسند و هیچ شاهدی ندارند.

## بخش Skills

فقط چیزی را بنویس که می‌توانی همان روز توضیح بدهی:

- Broken access control / IDOR testing
- XSS (context, DOM)
- JWT / session review
- SSRF concepts
- API authorization (BOLA)
- Burp, Python, HTTP

## README ریشه ریپو

بالای README باید این لینک‌ها دیده شوند:

1. بهترین write-up
2. پروژه + نمونه گزارش
3. چک‌لیست
4. برنامه ۳۰ روزه (نشان می‌دهد روش‌مند کار می‌کنی)

## در مصاحبه این ریپو را چطور باز می‌کنی

ترتیب دمو:

1. یک write-up (۲ دقیقه): باگ، اثر، اصلاح
2. `appsec-review scan` روی هدف مجاز (۱ دقیقه)
3. `appsec-review jwt` روی توکن نمونه (۱ دقیقه)
4. چک‌لیست: «این همان روش دستی من است»

اگر چیزی نیمه است، همان را بگو. صداقت از گزارش جعلی بهتر است.
