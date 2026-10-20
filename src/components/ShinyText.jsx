/**
 * A light sweep across text (M12) — a small take on React Bits' ShinyText.
 *
 * Accessibility:
 * - The sweep runs once (2 s), then again whenever `replay` changes — never
 *   on a loop, so it stays inside WCAG 2.2.2's 5-second limit for motion.
 * - It blends between ink-primary and brand-primary, both >= 4.5:1 on the
 *   page, so the word is readable at every frame, in both themes.
 * - motion-safe only; Windows High Contrast (forced-colors) gets plain text.
 * - The text itself is untouched, so screen readers read it normally.
 */
export default function ShinyText({ children, replay = 0 }) {
  return (
    <span
      key={replay}
      className="bg-[linear-gradient(110deg,rgb(var(--ink-primary))_40%,rgb(var(--brand-primary))_50%,rgb(var(--ink-primary))_60%)] bg-[length:250%_100%] bg-clip-text bg-[position:0%_0] text-transparent motion-safe:animate-shine forced-colors:bg-none forced-colors:text-[CanvasText]"
    >
      {children}
    </span>
  );
}
