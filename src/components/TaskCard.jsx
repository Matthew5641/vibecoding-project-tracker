import TypeBadge, { TYPE_STYLES } from './TypeBadge.jsx';

/** "Matthew Devon" -> "MD" */
export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/**
 * One task on the board. M4 shows the essentials (title + assignee);
 * M5 makes it clickable, M6 adds the type stripe, M8 the due tint.
 *
 * The title is a button stretched over the whole card (after:inset-0), so
 * the card is one big click target but still a heading for screen readers —
 * and later buttons (M10 Copy Context) can sit on top without nesting.
 */
export default function TaskCard({ task, onOpen }) {
  const typeStyle = TYPE_STYLES[task.type] ?? TYPE_STYLES.feature;

  return (
    <article
      aria-labelledby={`task-${task.id}-title`}
      className={`relative rounded-lg border border-l-4 border-line-subtle ${typeStyle.stripe} bg-surface-card p-3 shadow-sm transition-shadow hover:shadow-md has-[:focus-visible]:shadow-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-primary has-[:focus-visible]:ring-offset-2`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-xs text-ink-muted">{task.id}</p>
        <TypeBadge type={task.type} />
      </div>

      <h3
        id={`task-${task.id}-title`}
        className="mt-1 text-sm font-medium leading-snug text-ink-primary"
      >
        <button
          type="button"
          onClick={() => onOpen(task)}
          className="text-left after:absolute after:inset-0 after:rounded-lg after:content-[''] focus:outline-none"
        >
          {task.title}
        </button>
      </h3>

      <div className="mt-3 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white"
        >
          {initials(task.assignee)}
        </span>
        <span className="text-xs text-ink-muted">
          <span className="sr-only">Assigned to </span>
          {task.assignee}
        </span>
      </div>
    </article>
  );
}
