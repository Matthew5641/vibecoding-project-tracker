import { useEffect, useRef, useState } from 'react';

const DURATION = 500;

/**
 * "3 of 7 shipped" (M12 ship moment). The number rolls up when a task lands
 * in Done — a small take on React Bits' Counter, with no dependencies.
 *
 * The animated number and bar are aria-hidden; screen readers get one clean
 * live-region update with the final value instead of every frame.
 */
export default function ShippedCounter({ shipped, total }) {
  const [shown, setShown] = useState(shipped);
  const previous = useRef(shipped);

  useEffect(() => {
    const from = previous.current;
    previous.current = shipped;
    if (from === shipped) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(shipped);
      return;
    }

    let frame;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / DURATION);
      setShown(Math.round(from + (shipped - from) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shipped]);

  const percent = total === 0 ? 0 : Math.round((shipped / total) * 100);

  return (
    <div className="min-w-[9rem]">
      <p aria-hidden="true" className="text-sm text-ink-muted">
        <span className="font-heading text-xl font-semibold tabular-nums text-ink-primary">{shown}</span> of{' '}
        <span className="tabular-nums">{total}</span> shipped
      </p>
      <div aria-hidden="true" className="mt-1 h-1.5 overflow-hidden rounded-full bg-line-subtle">
        <div
          className="h-full rounded-full bg-brand-primary motion-safe:transition-[width] motion-safe:duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p role="status" className="sr-only">
        {shipped} of {total} tasks shipped
      </p>
    </div>
  );
}
