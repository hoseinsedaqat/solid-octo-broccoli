# 🚀 دیپلوی کامل World War — مرحله‌به‌مرحله با دستورات

> هر جا `<<…»>>` دیدی، مقدار خودت را بگذار. نمونه‌های داخل راهنما **جعلی/آموزشی**‌اند.

---

## فاز ۰ — پیش‌نیازها (روی کامپیوتر خودت)

1. **Node.js نسخه ۲۰ یا ۲۲** ← https://nodejs.org (LTS) را نصب کن. چک:
   ```bash
   node -v    # v20.x یا v22.x
   npm -v
   git --version
   ```
2. یک **ایمیل** برای ساخت اکانت رایگان Cloudflare (کارت بانکی لازم نیست).

## فاز ۱ — ربات تلگرام (در اپ تلگرام یا telegramweb)

با **@BotFather** به ترتیب:

```
/newbot                → نام نمایشی: World War  → username: مثلاً MyWorldWarBot
                          در آخر یک <<BOT_TOKEN>> مثل 7123456789:AAF3kQ… می‌دهد — نگهش دار
/setprivacy → Disable  → تا ربات پیام‌های متنی دکمه‌ها را هم ببیند (واجب!)
/setuserpic            → یک عکس (مثلاً همان لوگوی تانک)
/setdescription        → «بازی استراتژی جنگ جهانی — اقتصاد، ارتش، دیپلماسی»
/setcommands             start - شروع بازی
                        menu - منوی اصلی
                        help - راهنما
                        economy - دارایی و درآمد
                        shop - فروشگاه تجهیزات
                        war - جنگ‌ها
                        country - مدیریت کشور
                        defense - دفاع
                        diplomacy - دیپلماسی
                        statements - بیانیه‌ها
                        news - اخبار جهانی
                        rankings - رتبه‌بندی
                        settings - تنظیمات کشور
```

## فاز ۲ — اکانت Cloudflare + زیردامین

1. https://dash.cloudflare.com → **Sign up** (رایگان).
2. چپ منو → **Workers & Pages**. اگر کادر «Enter a subdomain» آمد، زیردامین را ست کن (مثلاً `hoseinsedaqat`). از این لحظه آدرس برنامه‌هایت: `https://<name>.hoseinsedaqat.workers.dev`. (اگر رد شدی: Workers & Pages → کنار «Your domain» → Settings → Domains.)

## فاز ۳ — گرفتن کد و نصب وابستگی‌ها

```bash
git clone https://github.com/hoseinsedaqat/solid-octo-broccoli.git
cd solid-octo-broccoli
git checkout test          # PR #1 اینجا مرج شده
npm install
```

## فاز ۴ — ورود wrangler به اکانت

```bash
npx wrangler login
```
مرورگر باز می‌شود → **Allow**. خروجی موفق: `🎉 Successfully logged...`

## فاز ۵ — ساخت دیتابیس D1 و وصل‌کردنش

```bash
npx wrangler d1 create world-war-db
```
خروجی (نمونه):
```jsonc
{
  "database_name": "world-war-db",
  "database_id": "3f9d2a5e-7c41-4b8a-9d6e-21a0c58f7b12"   ← این را کپی کن
}
```

فایل `apps/worker/wrangler.jsonc` را باز کن و **دو خط** را عوض کن:

```diff
-      "database_id": "{{D1_DATABASE_ID}}",
+      "database_id": "3f9d2a5e-7c41-4b8a-9d6e-21a0c58f7b12",   // مال خودت
...
-    "PUBLIC_BASE_URL": "https://world-war.SUBDOMAIN.workers.dev"
+    "PUBLIC_BASE_URL": "https://world-war.hoseinsedaqat.workers.dev"  // زیردامین فاز ۲
```

## فاز ۶ — build و اولین deploy

```bash
npm run build                                                        # مینی‌اپ → apps/frontend/dist
npx wrangler deploy --config apps/worker/wrangler.jsonc
```
آخر خط باید بگوید:
```
✨ Deployed world-war to https://world-war.hoseinsedaqat.workers.dev
```

## فاز ۷ — جداول + داده اولیه روی دیتابیس ابری

```bash
npx wrangler d1 migrations apply DB --remote --config apps/worker/wrangler.jsonc
#   ✅ 0001_init.sql / 0002_rate_limits.sql

npx wrangler d1 execute DB --remote --file=apps/worker/seeds/seed.sql --config apps/worker/wrangler.jsonc
#   🚣 108 commands executed successfully — (۴۰ آیتم، ۱۸ دسته، بسته اولیه)
```

## فاز ۸ — رازها (۴ عدد)

```bash
cd apps/worker
npx wrangler secret put BOT_TOKEN              # paste کن: <<توکن فاز ۱>>
npx wrangler secret put ADMIN_TELEGRAM_IDS     # عدد تلگرام خودت — از @userinfobot بپرس، مثلاً 641100001
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
npx wrangler secret put APP_SECRET
cd ../..
```
هر کدام وقتی Enter بزنی `🌀 Creating... ✅ Success` می‌دهد.
برای دو‌تای آخر اگر رشته‌ی تصادفی نمی‌داری، بساز:
```bash
openssl rand -hex 16      # مثل 9f2c7a1b44e6d0a8c3f5b7e9d1c3a5f7
```
در ویندوز (PowerShell) به‌جای openssl:
```powershell
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

⚠️ `APP_SECRET` و `TELEGRAM_WEBHOOK_SECRET` را در جای دیگری هم یادداشت کن — فاز ۹ به همان مقدارِ TELEGRAM_WEBHOOK_SECRET کار دارد.

## فاز ۹ — وصل‌کردن وب‌هوک تلگرام

### اول: توکن ربات را از BotFather بردار (۳۰ ثانیه)
1. در تلگرام برو سرِ **@BotFather** → بفرست `/mybots`
2. روی نام رباتت بزن → دکمه **API Token**
3. BotFather توکن را می‌دهد (یک رشته مثل `7123456789:AAH4qSAMPLEtokenDoNotUse_x1y2z3` — عدد، بعد دو‌نقطه، بعد حروف/زیرخط) → روش بزن/کپی کن.

> توکن **رمز ربات توست**. آن را در چت/اسکرین‌شات/گیت قرار نده. اگر جایی لو رفت، در BotFather `/revoke` بزن و توکن تازه بگیر و فاز ۸ (secret) + فاز ۹ (webhook) را دوباره بزن.

### به زبان ساده
وب‌هوک یعنی: به تلگرام بگو «هر پیام این ربات را برای این آدرس بفرست». آدرس مقصد از قبل در Worker ساخته شده (`https://world-war.hoseinsedaqat.workers.dev/api/telegram/webhook`)؛ فقط باید معرفی‌اش کنی. یک بار برای همیشه.
بازی هم هر درخواست را با `TELEGRAM_WEBHOOK_SECRET` (فاز ۸) بررسی می‌کند، پس همان رشته باید عیناً اینجا هم استفاده شود وگرنه جواب ۴۰۳ می‌گیری.

### روش ۱ — مرورگر (پیشنهادی). توکن را **کپی/پیست** کن، تایپ نکن

### چطور این خط را در مرورگر وارد کنم؟ (قدم‌به‌قدم)
1. **نه‌تاد** (Notepad) را باز کن. کل خط آدرس را داخلش بچسبان — این‌جا می‌توانی بدون استرس ویرایش کنی.
2. دو جای خالی را پر کن: به‌جای `TOKEN` توکن ربات (پیست از BotFather)، به‌جای `SECRET` همان مقداری که به `TELEGRAM_WEBHOOK_SECRET` دادی. فقط همان دو کلمه را انتخاب و Replace کن؛ **هیچ چیز دیگری را دست نزن** (نه `https://`، نه `&`، نه `/api/telegram/webhook`).
3. خط کامل را انتخاب کن (`Ctrl+A`) و کپی کن (`Ctrl+C`).
4. مرورگر → **تب جدید** (`Ctrl+T`) → روی **نوار آدرس بالا** کلیک کن → هرچه هست پاک کن → `Ctrl+V` → `Enter`.
   - اگر به‌جای JSON، صفحه‌ی جست‌وجوی گوگل آمد: یعنی آن خط را در کادر جست‌وجو تایپ کرده‌ای؛ دوباره `Ctrl+L` بزن تا نوار آدرس انتخاب شود و پیست کن.
   - اگر آدرس قرمز/`&` پررنگ شد و متن شکست، یعنی فاصله داخل آدرس افتاده — برگرد به نه‌تاد و فاصله‌ها را پاک کن.
5. جواب را همان‌جا بخوان. اگر JSON را به‌جای نمایش، دانلود کرد: روی فایل دانلودشده کلیک کن و **Keep** بزن، یا جلوی آدرس `view-source:` اضافه کن.
6. خط بعدی (`getWebhookInfo`) را هم به همان روش بزن تا ببینی `url` پر شده. بعدش **تب را نبند** — فقط `/start` تلگرام را تست کن.

در **نوار آدرس مرورگر** (نه در گوگل)، به این شکل آدرس را بساز — یعنی فقط بخش وسط را با پیست کردن پر کن:

```
https://api.telegram.org/bot   +   [توکنِ پیست‌شده]   +   /getMe
```

دقیقاً یکی از این سه خط را امتحان کن (خط نمونه با توکن جعلی است؛ `bot7123456789:AAH4qSAMPLEtokenDoNotUse_x1y2z3` را با `bot` + توکن خودت عوض کن):

```
https://api.telegram.org/bot7123456789:AAH4qSAMPLEtokenDoNotUse_x1y2z3/getMe
```
خروجی درست: `{"ok":true,"result":{"id":7123456789,"is_bot":true,"username":"نام_رباتت"}}`

اگر `{"ok":false,"error_code":404,"description":"Not Found"}` دیدی → تلگرام توکنِ داخل آدرس را نشناخته. چهار علتِ ممکن: ① جای‌گذار («توکن») هنوز پاک نشده ② فاصله یا خط جدید در انتهای توکن پیست شده ③ `bot` دوبار نوشته شده (`/bot/bot…`) ④ توکن ناقص/عوضی کپی شده (باید اولش عدد باشد و وسطش یک `:`).

حالا همین آدرس را با `setWebhook` ادامه بده (یک خط، بدون فاصله):

```
https://api.telegram.org/bot7123456789:AAH4qSAMPLEtokenDoNotUse_x1y2z3/setWebhook?url=https://world-war.hoseinsedaqat.workers.dev/api/telegram/webhook&secret_token=9f2c7a1b44e6d0a8c3f5b7e9d1c3a5f7&drop_pending_updates=true
```

خروجی درست: `{"ok":true,"result":"Webhook was set"}`

تأیید نهایی:

```
https://api.telegram.org/bot7123456789:AAH4qSAMPLEtokenDoNotUse_x1y2z3/getWebhookInfo
```

```json
{"ok":true,"result":{"url":"https://world-war.hoseinsedaqat.workers.dev/api/telegram/webhook","pending_update_count":0}}
```
- `"url":""` → ست نشده (خط setWebhook را دوباره و کامل بزن)
- `"url":"http://127.0.0.1:9999/…"` → وب‌هوکِ توسعه‌ی محلی روی ربات مانده؛ همان خط بالا آن را با آدرس ابری بازنویسی می‌کند
- `last_error_message` پر بود → آدرس غلط یا Worker پایین است (`/api/health` را چک کن)

### روش ۱-ب — اگر مرورگر گفت «این سایت باز نمی‌شود» (فیلترشکن)
`api.telegram.org` در بعضی شبکه‌ها فیلتر است (در حالی که `workers.dev` باز است). PowerShell را باز کن و همین دو خط را بزن — `curl.exe` و کوتیشن لازم است وگرنه `&` را دستور جدید می‌فهمد:

```powershell
curl.exe "https://api.telegram.org/bot7123456789:AAH4qSAMPLEtokenDoNotUse_x1y2z3/getMe"
curl.exe -X POST "https://api.telegram.org/bot7123456789:AAH4qSAMPLEtokenDoNotUse_x1y2z3/setWebhook" -d "url=https://world-war.hoseinsedaqat.workers.dev/api/telegram/webhook" -d "secret_token=9f2c7a1b44e6d0a8c3f5b7e9d1c3a5f7" -d "drop_pending_updates=true"
```
یا VPN را روی حالت Global بگذار و روش ۱ را تکرار کن. بعد از ست‌شدن، فیلترشکن لازم نیست.

### روش ۲ — با اسکریپت خودمان
```bash
node scripts/setup-bot.mjs --token=7123456789:AAH4qSAMPLEtokenDoNotUse_x1y2z3 --base=https://world-war.hoseinsedaqat.workers.dev --secret=9f2c7a1b44e6d0a8c3f5b7e9d1c3a5f7
```
خروجی مورد انتظار:
```
✓ ربات: @نام_ربات (id 7123456789)
✓ وب‌هوک ست شد: https://world-war.hoseinsedaqat.workers.dev/api/telegram/webhook
```
پرچم‌های دیگر: `--delete` (قطع وب‌هوک)، `--poll` (حالت توسعه با getUpdates). `BOT_TOKEN` / `PUBLIC_BASE_URL` / `TELEGRAM_WEBHOOK_SECRET` به‌صورت متغیر محیطی هم پذیرفته می‌شود، ولی در CMD/PowerShell همان `VAR=value command` کار نمی‌کند — **از پرچم‌ها استفاده کن**.

## فاز ۱۰ — تست نهایی (چهار قدم، هر کدام ۱۰ ثانیه)

**۱) سلامت سرور:** این آدرس را در مرورگر باز کن:
```
https://world-war.hoseinsedaqat.workers.dev/api/health
```
باید JSON سبزبازانه‌ای ببینی:
```json
{"ok":true,"service":"world-war","telegramBotConfigured":true,"webhookSecretConfigured":true}
```
- `telegramBotConfigured:false` → `BOT_TOKEN` ست نشده (برگرد فاز ۸).
- `webhookSecretConfigured:false` → `TELEGRAM_WEBHOOK_SECRET` نیست؛ آن را put کن و **وب‌هوک را دوباره با همان مقدار ست کن**.
- اصلاً باز نشد/`error 1101` → `npx wrangler tail --config apps/worker/wrangler.jsonc` را بزن و خطا را بخوان.

**۲) ربات در تلگرام:** به رباتت پیام بده `/start` → اسم کشور تایپ کن (مثلاً «پرشیا») → رئیس کشور را انتخاب کن → پرچم → پیام «کشور ساخته شد؛ خزانه ۱٬۰۰۰٬۰۰۰ سکه». اگر ` /start ` هیچ جوابی نداد: ۹۹٪ وب‌هوک است → روش ۱ قدم ۳ را دوباره چک کن.

**۳) دکمه‌های منوی پایین:** کنار کادر متن تلگرام «⋮» → «Play with bot» → منوی ۶ دکمه‌ای. روی هر کدام بزنی باید جواب بیاید (مثلاً «🛒 فروشگاه تجهیزات»). این مسیرِ `npm run dev` نیست، مستقیم روی Worker است.

**۴) مینی‌اپ:** از همان منو دکمه سبز **«ورود به بازی»** → صفحه‌ی بازی (نقشه/خزانه/دسته‌بندی‌ها) بالا بیاید. اگر فقط چرخ‌گردان می‌بینی: یک‌بار `Ctrl+Shift+R` (ریفرش سخت) و بعد اگر درست نشد بگو کد HTTP را در تب Network می‌بینی.

**اگر قبلاً `/start` زده بودی و چیزی نیامد:** بعد از ست‌کردن وب‌هوک، دوباره `/start` بفرست — تلگرام پیام‌های قبل از وب‌هوک را دوباره ارسال نمی‌کند (`drop_pending_updates:true` آن‌ها را پاک کرد، عمدی).

## فاز ۱۱ — پنل مدیریت

چون شناسه‌ات در `ADMIN_TELEGRAM_IDS` است:
1. به ربات پیام بده: `/start admin` → منوی مدیر.
2. در مینی‌اپ: `/app/admin` → داشبورد مدیر (شمارنده‌ها، کاربران، تجهیزات…).
3. **قیمت‌گذاری اولیه:** پنل ← تجهیزات ← دسته «تانک‌ها» ← قیمت بگذار (قیمت نداشتن = «قابل خرید نیست»؛ این عمداً اینجوری است).

## فاز ۱۲ — آپدیت‌های روزمره

هر تغییر کد ← `git push` (روی `test`) ← بعد روی سیستم خودت:
```bash
npm run build && npx wrangler deploy --config apps/worker/wrangler.jsonc
```
فقط وقتی مایگریشن جدید اضافه شد:
```bash
npx wrangler d1 migrations apply DB --remote --config apps/worker/wrangler.jsonc
```
کران (درآمد/راندهای جنگ) هر ۳۰ دقیقه خودکار است؛ دستی از پنل کران یا:
`POST https://.../api/admin/jobs/run` (یا همان فرم «اجرای دستی» پنل).

---

## عیب‌یابی سریع

| علامت | علت | درمان |
|---|---|---|
| `deploy` خطای `database_id` | فاز ۵ انجام نشده | دو خط wrangler.jsonc را دوباره چک کن |
| `/getMe` جواب `404 Not Found` | توکن داخل آدرس نامعتبر یا ناقص | توکن را از BotFather (`/mybots` → API Token) دوباره کپی کن؛ فقط پیست، نه تایپ |
| `/setWebhook` گفت `Bad Request: url is required` | `&` قبل از `url=` خورده شد (معمولاً در CMD/PowerShell) | یا یک‌خطی در مرورگر، یا `curl.exe … -d "url=…"` |
| `Not Found` روی **همه** متدها | مسیر آدرس غلط (مثلاً `/bot/getMe`) | شکل درست: `https://api.telegram.org/bot<توکن>/<متد>` |
| ربات ساکت است ولی `getWebhookInfo` آدرس را نشان می‌دهد | `secret_token` با `TELEGRAM_WEBHOOK_SECRET` فرق دارد | همان secret فاز ۸ را دوباره put کن و setWebhook را با همان مقدار بزن |
| health اوکی ولی `/start` بی‌جواب | وب‌هوک/secret | `getWebhookInfo` را باز کن؛ `last_error_message` چه می‌گوید؛ secret‌های فاز ۸ و ۹ باید **یکی** باشند |
| `403 ورود فقط از طریق…` در Admin | ربات از `ADMIN_TELEGRAM_IDS` بیرون است | عدد درست از @userinfobot |
| مینی‌اپ «در حال ورود» می‌ماند | توکن مرورگر/iframe | رفرش کن (فیکس در repo است؛ اگر خودت بیلد قدیمی deploy کردی، فاز ۶ را دوباره بزن) |
| دکمه «ورود به بازی» نیست | BotFather تنظیم نشده | `/menu_button` ← Show Web App → URL همان `https://world-war.<sub>.workers.dev` |


