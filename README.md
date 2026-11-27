# 🌍 World War — بازی استراتژی چندنفره در تلگرام

مینی‌اپ تلگرام + ربات تلگرام؛ بک‌اند روی **Cloudflare Workers** (D1 + Static Assets + Cron) با **Hono** و **Zod**، فرانت با **React + Vite + Tailwind**. همه‌چیز روی free-plan کلودفلر جا می‌شود: بدون سرور همیشه‌روشن، بدون دیتابیس پولی، بدون CDN سوم.

> این README عمداً «صادق» نوشته شده: هر عددی که در UI نشان داده می‌شود سمت سرور محاسبه شده و هیچ جایی قیمت/درآمد/قدرت تصادفی ساخته نمی‌شود. اگر داده‌ای اندازه‌گیری‌شدنی نباشد (مثلاً CPU ثانیه‌ای Worker) در پنل صفر نمی‌شود، بلکه `—` و یادداشت «اندازه‌گیری نمی‌شود» می‌خورد.

---

## ۱. ساختار مخزن

```
shared/                پکیژ مشترک: ثابت‌ها + اسکیماهای zod (منبع حقیقت هر دو سمت)
apps/worker/
  src/api/routes/      auth · player · shop+war · diplomacy · statements · social · admin
  src/services/        economy · war engine · diplomacy · statements · admin · quota …
  src/bot/             آپدیت‌هندلر تلگرام، انبورдинگ، کیبورد، منوی کشور
  src/scheduled/       کران ۳۰ دقیقه‌ای (revenue · wars · expiry · ranking · housekeeping)
  migrations/          0001_init.sql (۲۶ جدول + ۳ ویو) · 0002_rate_limits.sql
  seeds/seed.sql       با npm run db:generate-seed تولید می‌شود (از STARTER_PACK در shared)
apps/frontend/         مینی‌اپ React (RTL، فارسی) — ۱۲ صفحه بازیکن + ۱۴ صفحه مدیریتی
scripts/               gen-seed · telegram-stub · smoke-local · check-access · setup-bot
tests/                 سوئیت vitest روی Miniflare واقعی (۹ فایل، ۱۰۶ تست)
```

مسیرهای مینی‌اپ: بازیکن `/app/player`، مدیر `/app/admin` (هر کدام ۱۴ مسیر، lazy-loaded؛ ریکارتز فقط در صفحه اقتصاد دانلود می‌شود).

## ۲. شروع سریع — کاملاً آفلاین

```bash
npm install                                   # یک‌بار
npm run db:migrate:local && npm run db:seed:local   # D1 محلی: ۲۶ جدول + ۴۰ آیتم استارتر
cp apps/worker/.dev.vars.example apps/worker/.dev.vars  # مقادیر پیش‌فرضِ توسعه کافی است
node scripts/telegram-stub.mjs &              # شبیه‌ساز آفلاین Bot API (برای شبکه فیلتر/سنجباکس)
npm run dev                                   # wrangler dev روی 127.0.0.1:8787 (API + مینی‌اپ built)
node scripts/smoke-local.mjs                  # ۳۷ چک سرتاسری؛ باید همه ✓ شوند
```

`wrangler dev` هم API و هم باندل `apps/frontend/dist` را از یک origin سرو می‌کند (قبلاً `npm run build`). در مرورگر عادی هم کار می‌کند: در `APP_ENV=development` لاگین با `POST /api/auth/dev-login {"telegramId":111111111}` انجام می‌شود و توکن Bearer برمی‌گردد؛ در پروداکشن این مسیر بسته است.

## ۳. اتصال تلگرام واقعی

1. از **@BotFather** توکن بگیرید؛ Domain مینی‌اپ را روی همان Worker ست کنید (`/newapp` یا Bot Settings).
2. مقدارها را در `.dev.vars` (محلی) یا `wrangler secret put` (از راه دور) بگذارید: `BOT_TOKEN`، `TELEGRAM_WEBHOOK_SECRET`، `APP_SECRET`، `ADMIN_TELEGRAM_IDS`.
3. `PUBLIC_BASE_URL=https://<worker-url> node scripts/setup-bot.mjs` — وب‌هوک را با `secret_token` ست می‌کند.
4. اگر تحویل وب‌هوک از شبکه شما ممکن نیست: `node scripts/setup-bot.mjs --poll` و سپس `POST /api/telegram/poll` با هدر `x-admin-secret` (فقط API واقعی تلگرام لازم دارد، نه فیلترشکن).

اولین `/start admin` از شناسه داخل `ADMIN_TELEGRAM_IDS` → **مدیر اصلی** ساخته می‌شود (قابل مسدود/تنزل نیست تا پنل قفل نشود).

📄 هر متغیر از کجا می‌آید (BotFather، D1 database_id، نمونه‌های پرشده برای Dashboard): **[`docs/env-guide.md`](docs/env-guide.md)**.

## ۴. دیپلوی روی Cloudflare

```bash
npx wrangler d1 create world-war-db          # database_id را در apps/worker/wrangler.jsonc بگذارید
npm run db:migrate:remote && npm run db:seed:remote
npm run build && npx wrangler deploy
for s in BOT_TOKEN TELEGRAM_WEBHOOK_SECRET APP_SECRET; do npx wrangler secret put $s; done
npx wrangler secret put ADMIN_TELEGRAM_IDS
```

Cron (`*/30 * * * *`) و Static Assets در `apps/worker/wrangler.jsonc` تعریف شده‌اند؛ `run_worker_first: true` است و خودِ Worker مسیرهای غیر-API را به assets می‌دهد (SPA fallback).

## ۵. مدل بازی — عددها از کجا می‌آیند؟

- **بسته اولیه:** ۴۰ آیتم (بدون قیمت) + ۱٬۰۰۰٬۰۰۰ سکه + درآمد چرخه‌ای ۵۰٬۰۰۰ (کارخانه) و ۳۰٬۰۰۰ (معدن) هر ۲۴ ساعت.
- **درآمد:** ۵۰٬۰۰۰/۳۰٬۰۰۰ «جمع بخش» است؛ رشد تک‌آیتمی مشتق می‌شود: `16 667 × (کارخانه−3)` و `6 000 × (معدن−5)` — هر دو از خود STARTER_PACK استخراج شده‌اند (`shared/src/constants.ts`)، نه ابداع.
- **قیمت‌گذاری:** آیتم بدون قیمت = «قابل خرید نیست» (با دلیل فارسی در فروشگاه). هیچ قیمت صفر/تصادفی ثبت نمی‌شود؛ فقط مدیر قیمت می‌دهد (`/api/admin/shop/prices-bulk`).
- **جنگ:** پیشنهاد ← پذیرش ← راندهای کران‌محور (حتماً `next_round_at`) ← غرامت `indemnityPerPoint` × امتیاز از‌مرفت. فرمول‌ها در `tests/unit/battle.test.ts` قفل شده‌اند (mulberry32، سقف آسیب ۰٫۶، برتری مدافع و…).
- **رتبه‌بندی:** هر معیار روی بزرگ‌ترین مقدار جاری نرمال×وزن×۱۰۰۰؛ تغییر `ranking_weights` یا `battle_params` از پنل، جدول را بی‌درنگ بازمحاسبه می‌کند.
- **Idempotency:** کلیدهای `rev:<nation>:<cycle>`، `buy:<nation>:<clientKey>`، `starter:<nation>` روی `transactions.idempotency_key` و `revenue_cycles(nation_id,cycle_index)` — رپلی هیچ‌وقت دوباره پول کم/اضافه نمی‌کند (در سوئیت تست و در smoke چک می‌شود).

## ۶. پنل مدیریت (۱۴ صفحه)

داشبورد (شمارنده‌ها + کیفیت داده: آیتم بی‌قیمت/نام تکراری) · کشورها (تغییر خزانه/درآمد/موجودی، انحلال با تایپ DISSOLVE) · کاربران (نقش، بن با دلیل، RBAC دانه‌درشت ۱۲ بخش×خواندنی/نوشتنی) · تجهیزات (ویرایش + قیمت‌گذاری تک و گروهی + فروش) · بسته‌های اولیه · اقتصاد (قواعد + گردش پول + سلامت چرخه) · جنگ (پارامترهای نبرد + توقف/پایان دستی) · دیپلماسی (قواعد + انحلال اتحاد) · رتبه‌بندی (ویرایش کامل نقشه وزن‌ها — چون POST این بخش جایش را replace می‌کند) · برندینگ · اطلاع‌رسانی (بیانیه سراسری + مدیریت درخواست‌ها) · کران (اجرای دستی job‌ها + خروجی/بازگردانی پشتیبان) · ممیزی (audit با فیلتر) · تنظیمات (feature flags، کوئتا، پروفایل).

## ۷. تست‌ها و وضعیت صحت‌سنجی

| لایه | وضعیت |
|---|---|
| `npm test` — ۱۰۶ تست روی Miniflare (D1 واقعی، تایم‌ماشین، ربات جعلی) | ✅ پاس |
| `npx tsc --noEmit` در هر سه پکیژ + `vite build` | ✅ صفر خطا |
| `node scripts/smoke-local.mjs` — ۳۷ چک سرتاسری روی `wrangler dev` + D1 محلی seed شده + stub تلگرام (ان بورding از ربات، خرید، کران درآمد، جنگ+راند واقعی، بلوک مدیر، بکاپ، RBAC) | ✅ ۳۷/۳۷ |
| مایگریشن روی D1 محلی + seed (۱۰۸ INSERT) | ✅ اعمال و کوئری‌شده |
| دیپلوی راه‌دور/وب‌هوک تلگرام واقعی | ⚠️ در این سندباکس egress فقط به github/npm/pypi باز است؛ لازم است روی ماشین خودتان اجرا و بررسی شود |

## ۸. شبکه فیلتر (ایران) — نکات عمدی طراحی

- `telegram-web-app.js` **self-host** است (`apps/frontend/public/`)؛ ارجاع به CDN تلگرام در `index.html` وجود ندارد و اگر بود، با بلاک شدن telegram.org کل بازی می‌مرد. این فایل کوچک دادهٔ ورود را از خودِ آدرس مینی‌اپ می‌خواند — با همان شکل تلگرام: کلید `tgWebAppData` که در **fragment** می‌آید و `?`/`#` هر دو یک کوئری پیوسته می‌سازند (`/app/player#tgWebAppData=…&tgWebAppPlatform=android`). اگر فرگمنت حذف شده باشد، از `performance.getEntriesByType('navigation')` و در نهایت از کش `sessionStorage` برمی‌گرداند و اگر نبود، از پل `web_view_data_request` استفاده می‌کند؛ یعنی ورود بدون هیچ درخواست شبکه‌ای به بیرون انجام می‌شود. تستش در `tests/unit/miniapp-bridge.test.ts` است.
- هیچ فایل CSS/JS از googledapis/jsdelivr درخواست نمی‌شود؛ Tailwind در باندل inline است.
- API و مینی‌اپ یک origin هستند (همان Worker) → بدون preflight، بدون CORS.
- برای توسعه آفلاین: `scripts/telegram-stub.mjs` هر فراخوانی Bot API را با `TELEGRAM_API_BASE` محلی جواب می‌دهد و در `.wrangler/telegram-stub.jsonl` ضبط می‌کند؛ `scripts/check-access.mjs` گزارش می‌دهد کدام دامنه از نقطه شما باز است.
- کران ۳۰ دقیقه‌ای؛ «گذر زمان» در تست با جابه‌جایی `income_anchor_at` شبیه‌سازی می‌شود، پس روی حساب‌های رایگان هم دقیق است.

## ۹. امنیت — به‌طور خلاصه

`initData` با کلید HMAC-SHA256 (کلید = `HMAC_SHA256("WebAppData", BOT_TOKEN)`، `auth_date` حداکثر ۲۴ ساعت) تأیید می‌شود؛ توکن سشن ۷ روزه و فقط sha256 آن در دیتابیس است. ریت‌لییت ماندگار برای خرید/جنگ/دیپلماسی/بیانیه. همه‌ی پول‌ها integer سکه با `CHECK (treasury >= 0)`؛ ورودی‌ها همه با zodِ `shared`؛ لاگ مدیریتی روی هر اقدام نوشتنی.

---

**چطور شروع کنم؟** بند ۲ را اجرا کنید، مرورگر را روی `http://127.0.0.1:8787/app/player` بگذارید، با dev-login وارد شوید و از ربات (یا همان صفحه «کشور من») کشور بسازید. بقیه‌اش بازی است.


