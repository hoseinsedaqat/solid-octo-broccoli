import { useRouter } from '../../router';
import { LightBackButton, LightShell, LightTile } from '../../components/Light';

/**
 * «🏛️ مدیریت کشور» — the country-management hub from the reference screenshots.
 * Eight tiles, each leading to a real screen (or an honest «به‌زودی» placeholder).
 */
export function ManagePage() {
  const { navigate } = useRouter();
  const tiles: { emoji: string; label: string; to: string }[] = [
    { emoji: '💰', label: 'اقتصاد کشور', to: '/app/economy-hub' },
    { emoji: '🛢️', label: 'منابع کشور', to: '/app/resources' },
    { emoji: '🏭', label: 'صنایع و تولید', to: '/app/soon?title=صنایع%20و%20تولید&emoji=🏭' },
    { emoji: '🏗️', label: 'ساخت‌وساز', to: '/app/build' },
    { emoji: '🪖', label: 'مدیریت ارتش', to: '/app/military' },
    { emoji: '📦', label: 'انبار تجهیزات', to: '/app/military' },
    { emoji: '👥', label: 'مدیریت جمعیت', to: '/app/soon?title=مدیریت%20جمعیت&emoji=👥' },
    { emoji: '🛡️', label: 'امنیت کشور', to: '/app/soon?title=امنیت%20کشور&emoji=🛡️' },
  ];

  return (
    <LightShell title="مدیریت کشور" emoji="🏛️">
      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map((t) => (
          <LightTile key={t.label} emoji={t.emoji} label={t.label} onClick={() => navigate(t.to)} />
        ))}
      </div>
      <div className="mt-3">
        <LightBackButton label="بازگشت به منوی اصلی" to="/app/player" />
      </div>
    </LightShell>
  );
}

/** honest placeholder for sections that do not exist in the engine yet — no fake numbers, no dead buttons */
export function SoonPage() {
  const { query, back } = useRouter();
  const title = typeof query.title === 'string' ? query.title : 'این بخش';
  const emoji = typeof query.emoji === 'string' ? query.emoji : '🚧';
  return (
    <LightShell>
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-black/5 bg-white px-6 py-14 text-center shadow-sm">
        <span className="text-6xl leading-none">{emoji}</span>
        <h1 className="text-lg font-black text-[#111827]">{title}</h1>
        <p className="max-w-[16rem] text-[12px] leading-7 text-[#6b7280]">این بخش هنوز در بازی پیاده‌سازی نشده است. به‌زودی اضافه می‌شود.</p>
        <button onClick={back} className="mt-2 rounded-2xl bg-[#111111] px-6 py-3 text-[13px] font-bold text-white">
          ⬅ بازگشت
        </button>
      </div>
    </LightShell>
  );
}
