# 🧭 راهنمای محیط‌ها — هر متغیر از کجا می‌آید و کجا باید نشست شود

سه جا می‌شود مقدار داد؛ لازم نیست همه‌جا:

| جا | چه زمانی | فایل/مسیر |
|---|---|---|
| `apps/worker/.dev.vars` | فقط `wrangler dev` محلی (این فایل در `.gitignore` است — هرگز commit نکنید) | از روی `apps/worker/.dev.vars.example` کپی کنید |
| **Cloudflare Dashboard** | پروداکشن | Workers → **world-war** → Settings → **Variables and Secrets** |
| `wrangler secret put` | پروداکشن با CLI | `npx wrangler secret put BOT_TOKEN --config apps/worker/wrangler.jsonc` |

قانون کلی: **رازها** (توکن، سِر‌ها) → Secrets؛ **آدرس‌ها/حالت** (URLها، APP_ENV) → Vars.

---

## ۱) تک‌تک متغیرها

### `BOT_TOKEN` — توکن ربات
- **از کجا:** در تلگرام به **@BotFather** پیام بدهید → `/newbot` → نام و username را که گرفتید، توکنی مثل `8123456789:AAH4x…` می‌دهید. (ربات موجود؟ `/token`.)
- نمونه: `7654321098:AAFkQ2mZ0xY1bCdef789hIjKlMnOpQrStUv`
- ⚠️ اگر توکن لو رفت: BotFather → `/revoke` و توکن جدید.

### `ADMIN_TELEGRAM_IDS` — شناسه عددی مدیر(ها)
- **از کجا:** عددی است، نه @username. از **@userinfobot** بپرسید «/myid» می‌گیرد، یا موقتاً در تلگرام آدرس `https://api.telegram.org/bot<TOKEN>/getUpdates` را باز کنید و `chat.id` را بردارید.
- چند مدیر با کاما: `123456789,987654321`
- اولین شناسه = **مدیر اصلی** (با اولین `/start admin` ساخته می‌شود؛ قابل بن/تنزل نیست تا پنل قفل نشود).

### `TELEGRAM_WEBHOOK_SECRET`
- **از کجا:** خودتان می‌سازید؛ هر رشته بلند تصادفی. `scripts/setup-bot.mjs` همان را در `setWebhook` می‌گذارد و Worker هر آپدیت را با هدر `x-telegram-bot-api-secret-token` چک می‌کند.
- ساختن: `openssl rand -hex 32` → نمونه `9f2c7a…` (۶۴ کاراکتر)

### `APP_SECRET`
- **از کجا:** خودتان؛ برای هش توکن‌های سشن استفاده می‌شود. عوض کردنش = همه از بازی خارج می‌شوند (نه پولی جابه‌جا می‌شود نه داده‌ای می‌پرد).
- ساختن: `openssl rand -hex 32`

### `PUBLIC_BASE_URL`
- **از کجا:** آدرس خود Worker. بعد از `npx wrangler deploy` چاپ می‌شود: `https://world-war.<your-subdomain>.workers.dev` — یا dashboard → Workers → world-war → Triggers.
- بدون `https://` نه؛ اسلش انتهایی هم نه.

### `WEBAPP_URL`
- معمولاً **همان PUBLIC_BASE_URL** (مینی‌اپ و API یک origin هستند). فقط اگر مینی‌اپ را جای دیگری (مثلاً Pages) میزبانید، آدرس آنجا را بدهید.

### `APP_ENV`
- `development` / `test` / `local` → مسیر `dev-login` باز است (برای تست مرورگری). در **production هیچ‌چیز نگذارید** یا خالی بگذارید تا dev-login بسته باشد.

### `TELEGRAM_API_BASE`
- فقط محلی: `http://127.0.0.1:9999` تا با `node scripts/telegram-stub.mjs` بازی کامل روی شبکه فیلتر هم کار کند. در پروداکشن **نگذاریدش**.

### `CRON_DISABLED`
- هر مقدار غیرخالی = کران ۳۰ دقیقه‌ای خاموش (برای دیباگ). پروداکشن: خالی.

### D1 — binding و `database_id` (در `wrangler.jsonc`، نه env)
- **از کجا:** `npx wrangler d1 create world-war-db` → خروجی `database_id` را در `apps/worker/wrangler.jsonc` جای `{{D1_DATABASE_ID}}` بگذارید؛ یا dashboard → Storage & Databases → **D1** → world-war-db → **View details** → `Database ID` (کپی).
- بعد: `npm run db:migrate:remote && npm run db:seed:remote`

---

## ۲) نمونه کامل — همان‌طور که در Cloudflare Dashboard پر می‌شود

Workers → world-war → **Settings → Variables and Secrets** → Edit:

**Variables**
| Key | Value |
|---|---|
| `APP_ENV` | *(خالی بگذارید)* |
| `PUBLIC_BASE_URL` | `https://world-war.hoseinseda.workers.dev` |
| `WEBAPP_URL` | `https://world-war.hoseinseda.workers.dev` |

**Secrets** (دکمه Add → Secret — مقدار بعد از ذخیره قابل دیدن نیست)
| Key | Value |
|---|---|
| `BOT_TOKEN` | `7654321098:AAFkQ2mZ0xY1bCdef789hIjKlMnOpQrStUv` |
| `ADMIN_TELEGRAM_IDS` | `123456789` |
| `TELEGRAM_WEBHOOK_SECRET` | `9f2c7a1b44…(openssl rand -hex 32)` |
| `APP_SECRET` | `3e8d5c77aa…(openssl rand -hex 32)` |

و CLI معادل‌:
```bash
cd apps/worker
echo "7654321098:AAFkQ…" | npx wrangler secret put BOT_TOKEN
echo "123456789"           | npx wrangler secret put ADMIN_TELEGRAM_IDS
openssl rand -hex 32       | npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
openssl rand -hex 32       | npx wrangler secret put APP_SECRET
npx wrangler secret put PUBLIC_BASE_URL   # یا به‌صورت var در dashboard
```

## ۳) نمونه `apps/worker/.dev.vars` برای توسعه محلی (آفلاین/شبکه فیلتر)

```bash
BOT_TOKEN=7654321098:AAFkQ2mZ0xY1bCdef789hIjKlMnOpQrStUv
ADMIN_TELEGRAM_IDS=111111111
TELEGRAM_WEBHOOK_SECRET=local-dev-webhook-secret
APP_SECRET=local-dev-app-secret-change-me
APP_ENV=development
# تا وقتی از داخل تلگرام تست نمی‌کنید خالی بماند؛ اگر تست تلگرامی می‌کنید آدرس https Preview را بگذارید:
PUBLIC_BASE_URL=
WEBAPP_URL=
TELEGRAM_API_BASE=http://127.0.0.1:9999
```

## ۴) وصل‌کردن تلگرام به Worker (بعد از deploy)

```bash
BOT_TOKEN=... PUBLIC_BASE_URL=https://world-war.<sub>.workers.dev \
TELEGRAM_WEBHOOK_SECRET=<همان‌که در dashboard ست کردید> \
node scripts/setup-bot.mjs
```

و در **@BotFather** برای اینکه مینی‌اپ مثل اسکرین‌شات از پایین چت باز شود:
- `/newapp` → ربات را انتخاب کنید → URL مینی‌اپ: `https://world-war.<sub>.workers.dev` → نام دکمه: «ورود به بازی» (متن دکمه: «بازی 🌍» یا «ورود به بازی 🌍») → «Create short name» می‌پرسد: بله.
- یا `/menu_button` → **Web App** → همان URL + متن «ورود به بازی کسب‌درآمد».
- با `/setprivacy` روی **Disable** بگذارید تا ربات پیام‌های کاربر را هم ببیند (صفحه‌کلیدهای متنی بازی به آن نیاز دارند).
- `/mycommands` (اختیاری): `start-شروع بازی`, `menu-منو`, `economy-دارایی`, `shop-فروشگاه`, `war-جنگ`, `country-مدیریت کشور`.

## ۵) چک‌لیست عیب‌یابی سریع

|的症状 | علت | کار |
|---|---|---|
| مینی‌اپ «در حال ورود…» می‌ماند | نسخهٔ قدیمی فرانت | rebuild: `npm run build` و deploy دوباره (فیکس در repo است) |
| `/start` جواب نمی‌دهد | webhook ست نشده/secret غلط | `node scripts/setup-bot.mjs` دوباره؛ مقدار SECRET در dashboard دقیقاً برابر فایل setup باشد |
| دکمه‌های وب‌اپ باز نمی‌شوند | `PUBLIC_BASE_URL` خالی/بدون https | اصلاح var → deploy دوباره |
| «ورود» در تلگرام 403 | `APP_ENV=development` در production | پاکش کنید (dev-login فقط محلی) |
| کران اجرا نمی‌شود | cron فقط با deploy واقعی | dashboard → worker → Events/Cron لاگ را ببینید؛ دستی: پنل کران |

هوورا رضا خان
