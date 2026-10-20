/**
 * Linked / not-linked indicator for the deliverables (M11, upgraded in M12)
 * — inspired by React Bits' StatusMark, in plain SVG + CSS.
 *
 * Empty: a hollow ring. Linked: a filled teal circle whose tick draws itself
 * in (300 ms, motion-safe). Decorative — the "Linked" / "No link yet" words
 * next to it carry the meaning (DESIGN.md §7).
 */
export default function StatusMark({ linked }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0">
      {linked ? (
        <>
          <circle cx="8" cy="8" r="7" className="fill-feature" />
          <path
            key="tick"
            d="M4.75 8.25 7 10.5l4.25-4.75"
            pathLength="1"
            fill="none"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-ink-on-fill [stroke-dasharray:1] motion-safe:animate-draw"
          />
        </>
      ) : (
        <circle cx="8" cy="8" r="6" fill="none" strokeWidth="2" className="stroke-line-input" />
      )}
    </svg>
  );
}
