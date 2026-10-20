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
 */
export default function TaskCard({ task }) {
  return (
    <article
      aria-labelledby={`task-${task.id}-title`}
      className="rounded-lg border border-line-subtle bg-surface-card p-3 shadow-sm"
    >
      <p className="font-mono text-xs text-ink-muted">{task.id}</p>

      <h3
        id={`task-${task.id}-title`}
        className="mt-1 text-sm font-medium leading-snug text-ink-primary"
      >
        {task.title}
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
