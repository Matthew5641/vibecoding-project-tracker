import Avatar from './Avatar.jsx';
import CopyContextButton from './CopyContextButton.jsx';
import DueLabel, { DUE_STYLES, getDueState } from './DueLabel.jsx';
import TypeBadge, { TYPE_STYLES } from './TypeBadge.jsx';

/**
 * One task on the board. M4 shows the essentials (title + assignee);
 * M5 makes it clickable, M6 adds the type stripe, M8 the due tint.
 *
 * The title is a button stretched over the whole card (after:inset-0), so
 * the card is one big click target but still a heading for screen readers —
 * and later buttons (M10 Copy Context) can sit on top without nesting.
 */
export default function TaskCard({ task, team, stages, now, onOpen, onHandOff, onContextCopied, highlighted }) {
  const typeStyle = TYPE_STYLES[task.type] ?? TYPE_STYLES.feature;
  const others = team.filter((name) => name !== task.assignee);
  const due = getDueState(task, now);
  const dueStyle = due ? DUE_STYLES[due.state] : { bg: 'bg-surface-card', border: 'border-line-subtle' };

  return (
    <article
      aria-labelledby={`task-${task.id}-title`}
      className={`relative rounded-lg border border-l-4 ${dueStyle.border} ${typeStyle.stripe} ${dueStyle.bg} p-3 shadow-sm transition-shadow hover:shadow-md has-[:focus-visible]:shadow-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-primary has-[:focus-visible]:ring-offset-2 ${
        highlighted ? 'ring-2 ring-brand-accent ring-offset-2' : ''
      }`}
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

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <DueLabel due={due} />
        {/* z-10 lifts the button above the stretched title button */}
        <CopyContextButton task={task} stages={stages} onCopied={onContextCopied} className="relative z-10 ml-auto" />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar name={task.assignee} team={team} />
          <span className="truncate text-xs font-medium text-ink-primary">
            <span className="sr-only">Assigned to </span>
            {task.assignee}
          </span>
        </div>

        {others.length > 0 && (
          // z-10 lifts the dropdown above the stretched title button
          <select
            value=""
            onChange={(e) => e.target.value && onHandOff(task.id, e.target.value)}
            aria-label={`Hand off "${task.title}" to…`}
            className="relative z-10 h-8 max-w-[9rem] rounded-md border border-line-input bg-surface-card px-2 text-xs text-ink-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <option value="">Hand off to…</option>
            {others.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        )}
      </div>
    </article>
  );
}
