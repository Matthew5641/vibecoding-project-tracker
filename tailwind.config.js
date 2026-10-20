// Colours live as CSS variables in src/index.css (light + dark values),
// so every class like bg-surface-card switches theme on its own.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // M12: .dark on <html>, set by the theme toggle
  theme: {
    extend: {
      // Tokens from DESIGN.md §2 — use e.g. bg-brand-primary, border-due-warning
      // Every solid colour is >= 4.5:1 on cards, page and its own tint, in both themes (DESIGN.md §7)
      colors: {
        brand: {
          primary: token('brand-primary'), // header, "+" button, focus rings
          'primary-hover': token('brand-primary-hover'),
          accent: token('brand-accent'), // highlights, hover, links
        },
        surface: {
          page: token('surface-page'),
          card: token('surface-card'),
          column: token('surface-column'),
        },
        ink: {
          primary: token('ink-primary'), // body text (text-ink-primary)
          muted: token('ink-muted'), // captions, dates, counts
          'on-fill': token('ink-on-fill'), // text on solid fills: white in light, near-black in dark
        },
        line: {
          input: token('line-input'), // form field borders (>= 3:1)
          subtle: token('line-subtle'), // decorative borders only
        },
        // M6 tag-style
        feature: { DEFAULT: token('feature'), tint: token('feature-tint') },
        bug: { DEFAULT: token('bug'), tint: token('bug-tint') },
        // M8 due-tint
        due: {
          safe: token('due-safe'), // > 2 days out
          warning: token('due-warning'), // < 24 hours
          overdue: token('due-overdue'), // past due
          neutral: token('due-neutral'), // done
          'safe-tint': token('due-safe-tint'),
          'warning-tint': token('due-warning-tint'),
          'overdue-tint': token('due-overdue-tint'),
          'neutral-tint': token('due-neutral-tint'),
        },
      },
      // DESIGN.md §8 — short, one-off animations only; all used via motion-safe:
      keyframes: {
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(0.5rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // M12 ShinyText: one sweep of the highlight across the word
        shine: {
          from: { backgroundPosition: '100% 0' },
          to: { backgroundPosition: '0% 0' },
        },
        // M12 StatusMark: the tick draws itself in
        draw: {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
      },
      animation: {
        'toast-in': 'toast-in 200ms ease-out',
        shine: 'shine 2s ease-in-out 1',
        draw: 'draw 300ms ease-out 1',
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
