import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'vibetracker.theme';

function initialTheme() {
  // index.html already applied this before first paint; read it back
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Light / dark switch (M12 secret-sauce), top right of the header.
 *
 * One toggle button with aria-pressed, so screen readers hear
 * "Dark mode, toggle button, pressed / not pressed". Both icons are shown
 * and the active one sits on a highlighted knob, so the state doesn't rely
 * on colour alone. The choice is remembered; until the user picks, the
 * theme follows the operating system (prefers-color-scheme).
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(initialTheme);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Follow OS changes until the user has made an explicit choice
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    function onChange(e) {
      try {
        if (window.localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        /* storage blocked — just follow the OS */
      }
      setTheme(e.matches ? 'dark' : 'light');
    }
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  function toggle() {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex h-10 w-[4.5rem] shrink-0 items-center rounded-full border border-line-input bg-surface-card p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
    >
      {/* Knob behind the active icon */}
      <span
        aria-hidden="true"
        className={`absolute top-1 h-8 w-8 rounded-full bg-brand-primary motion-safe:transition-transform motion-safe:duration-200 ${
          isDark ? 'translate-x-8' : 'translate-x-0'
        }`}
      />
      <span aria-hidden="true" className="relative z-10 grid w-full grid-cols-2">
        <Sun
          className={`mx-auto h-4 w-4 ${isDark ? 'text-ink-muted' : 'text-ink-on-fill'}`}
          strokeWidth={2.25}
        />
        <Moon
          className={`mx-auto h-4 w-4 ${isDark ? 'text-ink-on-fill' : 'text-ink-muted'}`}
          strokeWidth={2.25}
        />
      </span>
    </button>
  );
}
