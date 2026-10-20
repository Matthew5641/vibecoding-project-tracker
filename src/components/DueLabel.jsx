import { CalendarDays, Check, Clock, TriangleAlert } from 'lucide-react';

const HOUR = 60 * 60 * 1000;

/**
 * Due-date colour coding (M8 due-tint). No new fields — everything derives
 * from `dueDate`, `status` and the current time.
 *
 *   done     -> neutral  (always, even if it was overdue)
 *   past due -> overdue
 *   < 24 h   -> warning  (in practice: due today, since dates end at 23:59)
 *   later    -> safe
 *   no date  -> null     (no tint, no label)
 *
 * Each state pairs its colour with an icon and words (DESIGN.md §7).
 * Class strings are written out in full so Tailwind can find them.
 */
export const DUE_STYLES = {
  safe: {
    Icon: CalendarDays,
    bg: 'bg-due-safe-tint',
    border: 'border-line-subtle',
    text: 'text-due-safe',
    legend: 'Calm',
  },
  warning: {
    Icon: Clock,
    bg: 'bg-due-warning-tint',
    border: 'border-due-warning',
    text: 'text-due-warning',
    legend: 'Due within 24 h',
  },
  overdue: {
    Icon: TriangleAlert,
    bg: 'bg-due-overdue-tint',
    border: 'border-due-overdue',
    text: 'text-due-overdue',
    legend: 'Overdue',
  },
  neutral: {
    Icon: Check,
    bg: 'bg-due-neutral-tint',
    border: 'border-line-subtle',
    text: 'text-due-neutral',
    legend: 'Done',
  },
};

/** 'YYYY-MM-DD' -> the last millisecond of that day, in local time. */
function endOfDay(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Returns { state, text } or null when the task has no due date. */
export function getDueState(task, now) {
  if (task.status === 'done') return { state: 'neutral', text: 'Done' };
  if (!task.dueDate) return null;

  const due = endOfDay(task.dueDate);
  const msLeft = due - now;

  if (msLeft < 0) {
    const daysLate = Math.round((startOfDay(now) - startOfDay(due)) / (24 * HOUR));
    return { state: 'overdue', text: `Overdue by ${daysLate} ${daysLate === 1 ? 'day' : 'days'}` };
  }
  if (msLeft < 24 * HOUR) return { state: 'warning', text: 'Due today' };

  // Round, because days around a clock change are 23 or 25 hours long
  const isTomorrow = Math.round((startOfDay(due) - startOfDay(now)) / (24 * HOUR)) === 1;
  const date = due.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  return { state: 'safe', text: isTomorrow ? 'Due tomorrow' : `Due ${date}` };
}

export default function DueLabel({ due }) {
  if (!due) return null;
  const { Icon, text } = DUE_STYLES[due.state];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-surface-card px-2 py-0.5 text-xs font-medium ${text}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.25} />
      {due.text}
    </span>
  );
}

/** Key for the four due states, shown in the Board section heading. */
export function DueLegend() {
  return (
    <div role="group" aria-labelledby="due-legend-heading" className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span id="due-legend-heading" className="text-xs font-medium text-ink-muted">
        Due dates:
      </span>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {Object.entries(DUE_STYLES).map(([state, { Icon, bg, border, text, legend }]) => (
          <li key={state} className="flex items-center gap-1.5 text-xs text-ink-primary">
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 items-center justify-center rounded border ${bg} ${border} ${text}`}
            >
              <Icon className="h-3 w-3" strokeWidth={2.5} />
            </span>
            {legend}
          </li>
        ))}
      </ul>
    </div>
  );
}
