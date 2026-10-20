/** "Matthew Devon" -> "MD" */
export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

// One colour per teammate, in TEAM order. ink-on-fill text is >= 4.5:1 on each, in both themes.
const AVATAR_COLOURS = ['bg-brand-primary', 'bg-ink-primary', 'bg-feature', 'bg-brand-accent'];

/**
 * Assignee avatar (M7 task-owner). Decorative — the name is always shown or
 * announced next to it, so the avatar itself is hidden from screen readers.
 */
export default function Avatar({ name, team, size = 'md' }) {
  const index = Math.max(0, team.indexOf(name));
  const colour = AVATAR_COLOURS[index % AVATAR_COLOURS.length];
  const dimensions = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';

  return (
    <span
      aria-hidden="true"
      title={name}
      className={`flex ${dimensions} shrink-0 items-center justify-center rounded-full ${colour} text-xs font-semibold text-ink-on-fill`}
    >
      {initials(name)}
    </span>
  );
}
