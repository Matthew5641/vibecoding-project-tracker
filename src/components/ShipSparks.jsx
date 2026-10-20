import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// Brand palette (DESIGN.md §2): indigo, pink, teal — read from the CSS
// variables at burst time, so the sparks follow light / dark mode
const TOKENS = ['--brand-primary', '--brand-accent', '--feature'];
function currentColours() {
  const style = getComputedStyle(document.documentElement);
  return TOKENS.map((t) => `rgb(${style.getPropertyValue(t).trim().replace(/ /g, ', ')})`);
}
const SPARK_COUNT = 12;
const DURATION = 600;
const RADIUS = 56;
const LENGTH = 14;

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * The M12 "ship moment": a burst of sparks where a card lands in Done.
 * A small, programmatic take on React Bits' ClickSpark (reactbits.dev).
 *
 * Purely decorative — the canvas is aria-hidden, ignores the pointer, and
 * does nothing at all for prefers-reduced-motion users (DESIGN.md §7).
 *
 * Usage: const sparks = useRef(); sparks.current.burst(x, y)  // viewport px
 */
const ShipSparks = forwardRef(function ShipSparks(_props, ref) {
  const canvasRef = useRef(null);
  const bursts = useRef([]);
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  function draw(time) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bursts.current = bursts.current.filter((b) => time - b.start < DURATION);
    for (const b of bursts.current) {
      const t = (time - b.start) / DURATION;
      const distance = RADIUS * easeOut(t);
      const length = LENGTH * (1 - t);
      ctx.globalAlpha = 1 - t;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      for (let i = 0; i < SPARK_COUNT; i++) {
        const angle = (2 * Math.PI * i) / SPARK_COUNT;
        ctx.strokeStyle = b.colours[i % b.colours.length];
        ctx.beginPath();
        ctx.moveTo(b.x + Math.cos(angle) * distance, b.y + Math.sin(angle) * distance);
        ctx.lineTo(b.x + Math.cos(angle) * (distance + length), b.y + Math.sin(angle) * (distance + length));
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    frame.current = bursts.current.length > 0 ? requestAnimationFrame(draw) : 0;
  }

  useImperativeHandle(ref, () => ({
    burst(x, y) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      bursts.current.push({ x, y, start: performance.now(), colours: currentColours() });
      if (!frame.current) frame.current = requestAnimationFrame(draw);
    },
  }));

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 h-full w-full" />;
});

export default ShipSparks;
