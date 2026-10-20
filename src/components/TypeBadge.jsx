import { Bug, Sparkles } from 'lucide-react';

/**
 * Feature vs. bug styling (M6 tag-style), shared by the card and the modal
 * so the two can never drift apart. Colours are the DESIGN.md §2 tokens;
 * every pairing is >= 4.5:1, and the word + icon mean colour is never the
 * only signal (DESIGN.md §7).
 *
 * Class strings are written out in full so Tailwind can find them.
 */
export const TYPE_STYLES = {
  feature: {
    label: 'Feature',
    Icon: Sparkles,
    stripe: 'border-l-feature',
    topEdge: 'border-t-feature',
    badge: 'bg-feature-tint text-feature',
  },
  bug: {
    label: 'Bug',
    Icon: Bug,
    stripe: 'border-l-bug',
    topEdge: 'border-t-bug',
    badge: 'bg-bug-tint text-bug',
  },
};

export default function TypeBadge({ type }) {
  const { label, Icon, badge } = TYPE_STYLES[type] ?? TYPE_STYLES.feature;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.25} />
      {label}
    </span>
  );
}
