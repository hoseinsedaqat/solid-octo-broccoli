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

**هدف یک‌خطی:** به تلگرام بگوییم «هر پیامی کاربر به ربات داد، همان لحظه برای من بفرست به این آدرس: `…/api/telegram/webhook`». تا این وصل نشود، ربات هیچ‌جوابی نمی‌دهد (نه `/start`، نه دکمه‌ها). همان یک کار است، بس.

⚠️ دو چیز لازم داری: **توکن ربات** (فاز ۱) و **همان رشته‌ای که در فاز ۸ به‌عنوان `TELEGRAM_WEBHOOK_SECRET` گذاشتی** — باید عیناً یکی باشند، وگرنه Worker پیام‌ها را ۴۰۳ می‌کند.

### روش ۱ — بدون ترمینال (ساده‌ترین؛ همین را انجام بده)
سه خط زیر را یکی‌یکی در **نوار آدرس مرورگر** (Chrome/Firefox) جای‌گذاری کن؛ `<<…>>` را با مقدار خودت عوض کن:

```
1) بررسی توکن:
https://api.telegram.org/bot<<توکن>>/getMe

2) ست‌کردن وب‌هوک:
https://api.telegram.org/bot<<توکن>>/setWebhook?url=https://world-war.hoseinsedaqat.workers.dev/api/telegram/webhook&secret_token=<<همان-secret-فاز-۸>>&drop_pending_updates=true

3) تأیید:
https://api.telegram.org/bot<<توکن>>/getWebhookInfo
```

- جواب ۱ باید `{"ok":true,...,"username":"@…"}` باشد ← توکن درست است.
- جواب ۲ باید `{"ok":true,"result":"Webhook was set"}` باشد
- در ۳ باید این را ببینی (مقدار `secret_token` هرگز نمایش داده نمی‌شود، طبیعی است):
  ```json
  {"ok":true,"result":{"url":"https://world-war.hoseinsedaqat.workers.dev/api/telegram/webhook","pending_update_count":0,"last_error_message":""}}
  ```
  اگر `pending_update_count` بالا رفت یا `last_error_message` آمد، یعنی آدرس غلط/Worker پایین است.

> نکته: مرورگر `&` را خودش درست می‌فرستد؛ فقط فاصله نگذار و `<<…>>` را کامل پاک کن.

### روش ۲ — با اسکریپت خودمان (`scripts/setup-bot.mjs`)
این شکل **در CMD، PowerShell و Git Bash هر سه** کار می‌کند (قبلاً فقط لینوکسی بود؛ با پرچم‌های جدید اضافه شد):

```bash
node scripts/setup-bot.mjs --token=<<توکن>> --base=https://world-war.hoseinsedaqat.workers.dev --secret=<<همان-secret-فاز-۸>>
```

خروجی مورد انتظار:
```
✓ ربات: @نام_ربات (id 7123456789)
✓ وب‌هوک ست شد: https://world-war.hoseinsedaqat.workers.dev/api/telegram/webhook
```
پرچم‌های اضافی: `--delete` (قطع وب‌هوک) و `--poll` (حالت توسعه با getUpdates). اگر `PUBLIC_BASE_URL`/`BOT_TOKEN` را به‌صورت متغیر محیطی ست کرده باشی، اسکریپت همان‌ها را هم می‌خواند.

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
| health اوکی ولی `/start` بی‌جواب | وب‌هوک/secret | `getWebhookInfo` را باز کن؛ `last_error_message` چه می‌گوید؛ secret‌های فاز ۸ و ۹ باید **یکی** باشند |
| `403 ورود فقط از طریق…` در Admin | ربات از `ADMIN_TELEGRAM_IDS` بیرون است | عدد درست از @userinfobot |
| مینی‌اپ «در حال ورود» می‌ماند | توکن مرورگر/iframe | رفرش کن (فیکس در repo است؛ اگر خودت بیلد قدیمی deploy کردی، فاز ۶ را دوباره بزن) |
| دکمه «ورود به بازی» نیست | BotFather تنظیم نشده | `/menu_button` ← Show Web App → URL همان `https://world-war.<sub>.workers.dev` |


