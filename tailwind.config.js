/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Tokens from DESIGN.md §2 — use e.g. bg-brand-primary, border-due-warning
      // Every solid colour is >= 4.5:1 on white, page and its own tint (DESIGN.md §7)
      colors: {
        brand: {
          primary: '#4F46E5', // indigo — header, "+" button, focus rings
          accent: '#BE185D',  // pink — highlights, hover, links
        },
        surface: {
          page: '#F7F6F3', // warm off-white
          card: '#FFFFFF',
        },
        ink: {
          primary: '#1C1B22', // body text (text-ink-primary)
          muted: '#5F5C6B',   // captions, dates, counts
        },
        line: {
          input: '#86828F',  // form field borders (>= 3:1)
          subtle: '#E7E5E4', // decorative borders only
        },
        // M6 tag-style
        feature: { DEFAULT: '#0F766E', tint: '#F0FDFA' }, // teal
        bug: { DEFAULT: '#BE123C', tint: '#FFF1F2' },     // rose
        // M8 due-tint
        due: {
          safe: '#1D4ED8',    // > 2 days out
          warning: '#B45309', // < 24 hours
          overdue: '#B91C1C', // past due
          neutral: '#6B6560', // done
          'safe-tint': '#EFF6FF',
          'warning-tint': '#FFFBEB',
          'overdue-tint': '#FEF2F2',
          'neutral-tint': '#F5F5F4',
        },
      },
      // DESIGN.md §3
      fontFamily: {
        heading: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
