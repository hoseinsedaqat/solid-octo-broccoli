/** Tailwind theme for the World War Mini App: dark "war room" palette, RTL friendly. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#070a12',
          800: '#0b1020',
          700: '#121a30',
          600: '#1b2540',
          500: '#27324f',
        },
        gold: { DEFAULT: '#f0b429', soft: '#ffd66b' },
        steel: { DEFAULT: '#5eead4', dim: '#2dd4bf' },
        danger: '#f87171',
        ok: '#4ade80',
      },
      fontFamily: {
        // no external font requests: Telegram webviews on filtered networks must render offline
        sans: ['Tahoma', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: { card: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 12px 30px -18px rgba(0,0,0,0.9)' },
    },
  },
  plugins: [],
};
