# برنامه ۳۰ روزه Web AppSec

سطح: متوسط (یک دور OWASP خوانده‌ای، لاب کامل و باگ واقعی کم است)  
هدف: دانش عمیق‌تر + رزومه برای استخدام  
زمان: ۳ ساعت در روز

منبع لاب پیش‌فرض: [PortSwigger Web Security Academy](https://portswigger.net/web-security)  
اگر لاب گیر کرد، بعد از ۲۵ دقیقه راهنمای رسمی را بخوان، یادداشت کن کجا گیر کردی، و ادامه بده. گیر کردن بدون نوت، یادگیری نیست.

---

## هفته ۱ — Access Control

این هفته مهم‌ترین هفته است. Broken Access Control در OWASP Top 10 اول است و در مصاحبه زیاد پرسیده می‌شود.

### روز ۱ — متدولوژی، نه ابزار

**هدف:** بتوانی یک اپ را مثل یک پنتستر نگاه کنی، نه مثل کسی که payload امتحان می‌کند.

**مطالعه (۴۵م)**

- [PortSwigger: Access control](https://portswigger.net/web-security/access-control) تا قبل از لاب‌ها
- این ۳ سؤال را روی کاغذ جواب بده:
  1. افقی و عمودی privilege escalation چه فرقی دارند؟
  2. IDOR با Broken Function Level Authorization چه فرقی دارد؟
  3. در یک درخواست، چه چیزهایی «هویت» را مشخص می‌کنند؟ (cookie, JWT, hidden field, URL id, IP, …)

**لاب (۹۰م)**

- Burp را روی یک لاب ساده Access control راه بینداز
- Proxy + Logger را مرتب کن: scope، فیلتر js/css/image
- یک sitemap از اپ لاب بساز

**خروجی (۴۵م)**

- `notes/` روز ۱
- در `PROGRESS.md` تیک بزن
- این جمله را کامل کن: «روش من برای تست access control این است که …»

**تمام وقتی:** می‌توانی Burp را روی لاب بیاوری و نقش‌ها را در نوت بنویسی.

### روز ۲ — نقشه اپ و نقش‌ها

**هدف:** قبل از حمله، موجودیت‌ها و نقش‌ها را استخراج کنی.

**مطالعه (۴۵م)**

- یک فلوی لاگین تا یک عمل حساس (تغییر ایمیل، دیدن سفارش، پنل ادمین) را روی کاغذ بکش
- برای هر درخواست بنویس: چه کسی باید بتواند؟ چه شناسه‌ای در درخواست است؟

**لاب (۹۰م)**

از مسیر Access control حداقل ۲ لاب:

- Unprotected admin functionality
- User role controlled by request parameter

**خروجی (۴۵م)**

جدول نقش‌ها:

| نقش | قابلیت مجاز | چه درخواستی آن را نشان داد | اگر نقش عوض شود چه می‌شود |
| --- | --- | --- | --- |

**تمام وقتی:** جدول حداقل ۳ نقش یا ۳ قابلیت دارد.

### روز ۳ — IDOR

**هدف:** IDOR را روش‌مند پیدا کنی، نه شانسی.

**مطالعه (۴۵م)**

چک‌لیست IDOR:

1. شناسه در URL / body / header را لیست کن
2. شناسه خودت را با شناسه کاربر دیگر عوض کن
3. اگر عددی است: `-1`, `0`, `1`, id همسایه
4. اگر UUID است: از پاسخ‌های دیگر UUID دربیاور (leak)
5. اگر 401/403 آمد: method، content-type، یا مسیر جایگزین را تست کن
6. اگر GET بسته است: همان عمل را با POST/PUT/PATCH/JSON امتحان کن

**لاب (۹۰م)**

- Insecure direct object references
- User ID controlled by request parameter

**خروجی (۴۵م)**

پیش‌نویس بخش Reproduction از Write-up ۱ را بنویس. هنوز منتشر نکن.

**تمام وقتی:** یک IDOR را خودت بازتولید کردی و request/response را ذخیره کردی.

### روز ۴ — Vertical و Horizontal

**هدف:** فرق escalation افقی و عمودی را در عمل ببینی.

**مطالعه (۴۵م)**

- Horizontal: کاربر A داده کاربر B را می‌بیند
- Vertical: کاربر عادی کار ادمین را انجام می‌دهد
- سؤال مصاحبه: «اگر IDOR فقط داده غیرحساس را نشان بدهد، باز هم گزارش می‌کنی؟» جواب خودت را بنویس (بله/مشروط + دلیل)

**لاب (۹۰م)**

- User role can be modified in user profile
- URL-based access control can be bypassed

**خروجی (۴۵م)**

یک پاراگراف impact برای هر کدام: داده لو می‌رود، عمل انجام می‌شود، یا هر دو؟

**تمام وقتی:** هر دو نوع escalation را در نوت با مثال جدا کردی.

### روز ۵ — Method, parameter, mass assignment

**هدف:** دور زدن کنترل با تغییر شکل درخواست.

**مطالعه (۴۵م)**

- Method override: `POST` به `GET`/`PUT`، یا headerهایی مثل `X-HTTP-Method-Override` (فقط روی لاب)
- Parameter pollution
- Mass assignment / hidden field: `role=admin`, `isAdmin=true`

**لاب (۹۰م)**

- Method-based access control can be bypassed
- Multi-step process with no access control on one step

**خروجی (۴۵م)**

۳ مورد به [`checklists/web-appsec-review.md`](../checklists/web-appsec-review.md) اضافه کن که این هفته یاد گرفتی.

**تمام وقتی:** می‌توانی بگویی «کنترل دسترسی را فقط روی UI نباید اعتماد کرد» و یک مثال فنی بدهی.

### روز ۶ — Write-up ۱

**هدف:** اولین گزارش عمومی، شبیه یافته پنتست.

**موضوع اجباری:** Broken Access Control یا IDOR روی لاب مجاز.

**۳ ساعت را این‌طور تقسیم کن:**

- ۳۰م: لاب را از نو تمیز بازتولید کن
- ۹۰م: طبق [`writeups/TEMPLATE.md`](../writeups/TEMPLATE.md) بنویس
- ۶۰م: ویرایش: عنوان قوی، impact مشخص، remediation قابل‌اجرا

**کیفیت حداقلی:**

- عنوان مثل یافته است، نه مثل «لاب PortSwigger»
- Reproduction با request واقعی
- Root cause جدا از payload
- Remediation برای دولوپر، نه «فیکس کنید»

فایل: `writeups/01-broken-access-control/README.md`

**تمام وقتی:** شخص دیگری فقط با گزارش تو بتواند بفهمد باگ چیست و چرا مهم است.

### روز ۷ — جمع‌بندی هفته ۱

**مطالعه + مرور (۶۰م)**

۱۰ سؤال اول [`interview/web-appsec-interview.md`](../interview/web-appsec-interview.md) را با صدای بلند در ۳۰ تا ۶۰ ثانیه جواب بده.

**لاب سبک (۶۰م)**

یک لاب Access control که قبلاً گیر کردی را دوباره بدون راهنما بزن.

**خروجی (۶۰م)**

- چک‌لیست access control را کامل‌تر کن
- Write-up ۱ را یک بار دیگر بخوان و جمله‌های مبهم را کوتاه کن

**تمام وقتی:** Write-up ۱ منتشرشدنی است (حتی اگر بعداً بهترش کنی).

---

## هفته ۲ — XSS، Injection، CSRF

هدف این هفته context است. Payload حفظی برای مصاحبه کافی نیست.

### روز ۸ — XSS در context

**مطالعه (۴۵م)**

- [XSS](https://portswigger.net/web-security/cross-site-scripting)
- برای هر context یک مثال بنویس: HTML body, attribute, JS string, URL, href/src

**لاب (۹۰م)**

- Reflected XSS into HTML context with nothing encoded
- Reflected XSS into attribute with angle brackets HTML-encoded

**خروجی (۴۵م)**

جدول context → چه کاراکترهایی مهم‌اند → چه دفاعی باید باشد.

**تمام وقتی:** می‌توانی بدون نگاه به چیت‌شیت بگویی XSS در attribute با HTML body چه فرقی دارد.

### روز ۹ — DOM XSS و CSP

**مطالعه (۴۵م)**

- Source و sink در DOM XSS
- CSP: چه چیزی را واقعاً محدود می‌کند و چه چیزی را نه
- `innerHTML`, `location`, `eval`, `document.write`

**لاب (۹۰م)**

- DOM XSS in `document.write` sink using source `location.search`
- یک لاب Reflected/Stored دیگر به انتخاب خودت

**خروجی (۴۵م)**

پیش‌نویس Write-up ۲: فقط خلاصه و root cause.

**تمام وقتی:** source و sink لاب را در نوت نام بردی.

### روز ۱۰ — SQL injection مدرن

**مطالعه (۴۵م)**

- [SQL injection](https://portswigger.net/web-security/sql-injection)
- فرق in-band، blind، out-of-band
- چرا ORM همه SQLi را نمی‌بندد (raw query، concatenation، order by)

**لاب (۹۰م)**

- SQL injection vulnerability in WHERE clause allowing retrieval of hidden data
- SQL injection UNION attack (تعیین تعداد ستون)

روی استخراج داده حساس از لاب‌های آموزشی بمان. هدف فهم query است، نه ساخت exploit عمومی.

**خروجی (۴۵م)**

یک جواب مصاحبه ۶۰ ثانیه‌ای: «چطور SQLi را در کد ریویو پیدا می‌کنی؟»

**تمام وقتی:** UNION و blind را در نوت از هم جدا کردی.

### روز ۱۱ — یک injection دیگر، عمیق

**فقط یکی را انتخاب کن** (هر دو را سطحی نخوان):

**گزینه A — SSTI**

- مفهوم template engine
- فرق ارزیابی سمت سرور با XSS
- یک لاب SSTI آموزشی

**گزینه B — Command injection / OS injection**

- کجا ورودی به shell می‌رسد
- دفاع: اجتناب از shell، allowlist، جدا کردن آرگومان‌ها

**خروجی (۴۵م)**

یک صفحه نوت: «این باگ کجا در معماری رخ می‌دهد؟»

**تمام وقتی:** می‌توانی SSTI یا command injection را برای یک دولوپر توضیح بدهی.

### روز ۱۲ — CSRF و CORS

**مطالعه (۴۵م)**

- [CSRF](https://portswigger.net/web-security/csrf)
- [CORS](https://portswigger.net/web-security/cors)
- SameSite: Lax / Strict / None
- CORS ≠ CSRF defense کامل

**لاب (۹۰م)**

- CSRF vulnerability with no defenses
- CORS vulnerability with basic origin reflection (اگر وقت شد)

**خروجی (۴۵م)**

۳ مورد به چک‌لیست cookie / CSRF اضافه کن.

**تمام وقتی:** می‌توانی بگویی چرا token CSRF و SameSite هر کدام چه چیزی را می‌پوشانند.

### روز ۱۳ — Write-up ۲

**موضوع:** XSS (ترجیحاً با context مشخص، مثلاً attribute یا DOM).

همان کیفیت روز ۶. فایل: `writeups/02-xss/README.md`

اگر XSS برایت تکراری است، injection روز ۱۱ را بنویس؛ ولی عنوان و impact باید دقیق باشد.

**تمام وقتی:** در گزارش گفته‌ای XSS دقیقاً در کدام context است و دفاع درست چیست.

### روز ۱۴ — جمع‌بندی هفته ۲

- ۱۰ سؤال XSS/injection/CSRF مصاحبه را بلند جواب بده
- Write-up ۲ را ویرایش کن
- یک لاب هفته ۲ را بدون راهنما تکرار کن

**تمام وقتی:** دو write-up در ریپو داری که از هم قابل‌تشخیص‌اند (موضوع و impact جدا).

---

## هفته ۳ — Auth، SSRF، API

این هفته رزومه را از «لاب‌کار» به «کسی که auth می‌فهمد» نزدیک می‌کند.

### روز ۱۵ — Session و Cookie

**مطالعه (۴۵م)**

- Session fixation، session expiration، logout
- پرچم‌ها: `Secure`, `HttpOnly`, `SameSite`
- Cookie scoped به domain/path

**لاب (۹۰م)**

یک اپ لاب را از نظر cookie بررسی کن + لاب Information disclosure یا session اگر در Academy هست.

اگر لاب session کم بود: Juice Shop را با Docker بالا بیاور و فقط جریان login/logout/cookie را نقشه بکش.

**خروجی (۴۵م)**

بخش Cookie چک‌لیست را کامل کن. این همان منطقی است که ابزار هفته ۴ چک می‌کند.

**تمام وقتی:** برای هر پرچم cookie یک جمله «اگر نباشد چه می‌شود» داری.

### روز ۱۶ — JWT

**مطالعه (۴۵م)**

- [JWT](https://portswigger.net/web-security/jwt)
- ساختار header.payload.signature
- `alg=none`، کلید ضعیف، confusion الگوریتم، `kid` خطرناک
- claimهای `exp`, `nbf`, `iss`, `aud`

**لاب (۹۰م)**

- JWT authentication bypass via unverified signature
- JWT authentication bypass via `none` algorithm

**خروجی (۴۵م)**

با ابزار خودت در `project/appsec-review` یک JWT لاب را decode کن و خروجی را در نوت بگذار. اگر CLI هنوز کامل نیست، از `python -m appsec_review jwt TOKEN` استفاده کن؛ هسته analyzer از روز اول آماده است.

**تمام وقتی:** می‌توانی JWT را روی تخته بکش و ۳ misconfiguration رایج را بگویی.

### روز ۱۷ — OAuth / OIDC

**مطالعه (۴۵م)**

- [OAuth](https://portswigger.net/web-security/oauth)
- Authorization Code در برابر Implicit
- `redirect_uri`، `state`، token leakage در referrer/log

**لاب (۹۰م)**

- Authentication bypass via OAuth implicit flow
- اگر سخت بود: یک لاب دیگر OAuth با راهنما، بعد نوت «کجا اشتباه فکر می‌کردم»

**خروجی (۴۵م)**

جواب مصاحبه: «OAuth را در یک اپ جدید چطور ریویو می‌کنی؟» در ۵ گلوله.

**تمام وقتی:** `state` و `redirect_uri` را بدون مقاله توضیح می‌دهی.

### روز ۱۸ — SSRF

**مطالعه (۴۵م)**

- [SSRF](https://portswigger.net/web-security/ssrf)
- چرا SSRF در cloud خطرناک است (metadata) — مفهوم، بدون هدف واقعی
- Blind SSRF در برابر SSRF با پاسخ

**لاب (۹۰م)**

- Basic SSRF against the local server
- Basic SSRF against another back-end system

**خروجی (۴۵م)**

پیش‌نویس Write-up ۳ اگر موضوع SSRF را انتخاب می‌کنی.

**تمام وقتی:** می‌توانی بگویی allowlist و blocklist برای SSRF چه فرقی دارند و کدام شکننده‌تر است.

### روز ۱۹ — API Security

**مطالعه (۴۵م)**

- [API testing](https://portswigger.net/web-security/api-testing)
- BOLA = IDOR در API
- Mass assignment در JSON
- Rate limit روی login، reset password، OTP
- Excess data in response (فیلدهایی که UI نشان نمی‌دهد)

**لاب (۹۰م)**

لاب API در Academy، یا crAPI اگر Docker داری. تمرکز: یک endpoint با شناسه object.

**خروجی (۴۵م)**

۵ مورد API به چک‌لیست اضافه کن.

**تمام وقتی:** یک مثال BOLA با request JSON در نوت داری.

### روز ۲۰ — Write-up ۳

**موضوع:** JWT **یا** SSRF. همان که بهتر بازتولید کردی.

فایل: `writeups/03-jwt-or-ssrf/README.md`

**تمام وقتی:** گزارش سوم از نظر شکل شبیه دو تای اول است (قالب ثابت = حرفه‌ای به نظر رسیدن).

### روز ۲۱ — شروع پروژه AppSec

**هدف:** ابزار را مال خودت کنی، نه اینکه فقط کد آماده را نگه داری.

**۳ ساعت:**

1. `project/appsec-review/README.md` را بخوان و ابزار را روی یک سایت لاب/لوکال اجرا کن
2. یک چک جدید انتخاب کن که مال تو باشد. پیشنهادها:
   - تشخیص `security.txt`
   - هشدار اگر `Server` نسخه دقیق بدهد
   - بررسی `Cache-Control` روی پاسخ‌های authenticated (اگر header هست)
   - بهبود متن remediation در گزارش
3. issue/todo شخصی در نوت بنویس: فردا و پس‌فردا چه می‌سازی

کد اولیه عمداً کوچک است تا در رزومه بتوانی بگویی «من این بخش را طراحی و گسترش دادم».

**تمام وقتی:** یک تغییر کوچک commit‌شدنی در ابزار داری (حتی یک چک جدید).

---

## هفته ۴ — پروژه، write-up، مصاحبه

از اینجا به بعد هر ساعت باید یک artifact رزومه بسازد.

### روز ۲۲ — ابزار: scan

- چک header و cookie را بخوان و تست بنویس یا تست موجود را اجرا کن
- خروجی terminal را خوانا کن
- روی Juice Shop یا یک سرور لوکال `scan` بگیر و گزارش را ذخیره کن: `project/appsec-review/samples/`

**تمام وقتی:** یک فایل گزارش نمونه در ریپو هست.

### روز ۲۳ — ابزار: JWT + report

- analyzer را با ۳ توکن نمونه (معتبر، `alg=none`، بدون `exp`) تست کن
- خروجی Markdown را طوری کن که در GitHub خوب دیده شود
- در README پروژه ۲ مثال واقعی از خروجی بگذار

**تمام وقتی:** `scan` و `jwt` هر دو دموپذیرند.

### روز ۲۴ — README پروژه و داستان مصاحبه

README پروژه باید جواب این‌ها را بدهد:

- این ابزار چیست و چه نیست (exploit scanner نیست)
- چرا ساختی
- چطور اجرا می‌شود
- چه چک‌هایی دارد
- محدودیت‌ها
- نقشه راه

یک پاراگراف ۶۰ ثانیه‌ای برای مصاحبه بنویس و در `interview/project-pitch.md` بگذار.

**تمام وقتی:** اگر README را به یک استخدام‌کننده بدهی، می‌فهمد پروژه چیست.

### روز ۲۵ — Write-up ۴

**موضوع پیشنهادی:** API BOLA یا business logic از لاب مجاز.

فایل: `writeups/04-api-or-logic/README.md`

اگر API لاب کم بود: یک یافته Juice Shop در حوزه access control، با قالب حرفه‌ای.

**تمام وقتی:** چهار گزارش با قالب یکسان در `writeups/` هست.

### روز ۲۶ — Write-up ۵ یا پولیش

اگر انرژی داری: Write-up ۵ (file upload، OAuth، یا CORS).  
اگر نه: پروژه را پولیش کن — تست، نمونه گزارش، محدودیت‌ها، لینک در README اصلی.

فایل اختیاری: `writeups/05-elective/README.md`

**تمام وقتی:** یا ۵ write-up داری، یا ۴ write-up خیلی تمیز + پروژه دموپذیر.

### روز ۲۷ — مصاحبه فنی

از [`interview/web-appsec-interview.md`](../interview/web-appsec-interview.md) بخش فنی را کامل کن.

روش:

1. سؤال را بخوان
2. ۶۰ ثانیه تایمر
3. جواب بده (حتی برای خودت، بلند)
4. با outline مقایسه کن
5. جواب خودت را در ۲ تا ۴ گلوله بازنویسی کن

روی این‌ها بیشتر وقت بگذار: IDOR methodology، XSS context، JWT، SSRF، فرق authn/authz.

**تمام وقتی:** ۲۰ سؤال را یک دور جواب دادی.

### روز ۲۸ — رفتاری + توضیح یافته

- بخش behavioral را تمرین کن
- Write-up ۱ و ۳ را طوری تعریف کن که انگار برای مدیر فنی تعریف می‌کنی: مشکل، اثر، اصلاح
- پروژه را در ۵ دقیقه دمو کن: یک `scan` و یک `jwt`

**تمام وقتی:** یک داستان «یافته» و یک داستان «پروژه» آماده است.

### روز ۲۹ — رزومه و GitHub

از [`interview/resume-guide.md`](../interview/resume-guide.md) استفاده کن.

کار امروز:

- README ریشه ریپو را با لینک write-upها و پروژه به‌روز کن
- ۳ bullet رزومه از روی همین ۳۰ روز بنویس
- پین کردن ریپو / ترتیب پوشه‌ها را مرتب کن تا استخدام‌کننده گم نشود

**تمام وقتی:** یک غریبه در ۲ دقیقه می‌فهمد تو چه بلدی.

### روز ۳۰ — مرور و بعد از این ماه

**۶۰م:** `PROGRESS.md` را صادقانه پر کن. هر تیک نزده یک شکاف است، نه شکست.

**۶۰م:** لیست ۳۰ روز دوم (نه برنامه کامل): مثلاً business logic عمیق‌تر، race condition، cache poisoning، یا یک باگ‌بانتی با scope مشخص.

**۶۰م:** یک خودآزمایی:

- یک لاب Access control جدید بدون راهنما
- یک JWT را با ابزار خودت تحلیل کن
- یک سؤال مصاحبه را ضبط کن و گوش بده

**تمام وقتی:** می‌دانی بعد از این ماه سراغ چه مهارتی می‌روی و رزومه‌ات چه لینک‌هایی دارد.

---

## اگر یک هفته عقب افتادی

هفته را کامل نکن تا «برنامه تمام شود». این اولویت را نگه دار:

1. Write-up ۱ (access control)
2. Write-up ۲ (XSS)
3. ابزار با README و یک نمونه گزارش
4. Write-up ۳
5. مصاحبه فنی ۲۰ سؤال
6. بقیه

استخدام‌کننده ۳ گزارش خوب و یک پروژه واضح را به ۶ گزارش ضعیف ترجیح می‌دهد.
