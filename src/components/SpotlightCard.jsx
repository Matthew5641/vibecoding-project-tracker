import { useRef } from 'react';

/**
 * A soft brand-coloured glow that follows the mouse across a card (M12) —
 * a small take on React Bits' SpotlightCard.
 *
 * Purely decorative: the glow is aria-hidden, ignores the pointer, only
 * reacts to a mouse/pen (not touch), and at 10 % opacity keeps every text
 * pairing on the card above 4.5:1 in both themes.
 */
export default function SpotlightCard({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);

  function handlePointerMove(e) {
    if (e.pointerType === 'touch') return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }

  return (
    <Tag ref={ref} onPointerMove={handlePointerMove} className={`group relative overflow-hidden ${className}`} {...rest}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgb(var(--brand-primary)/0.10),transparent_70%)]"
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}
