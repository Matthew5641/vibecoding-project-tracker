import { Hourglass } from 'lucide-react';

/**
 * "2 d in Review" / "Stuck · 4 d" chip on In Progress and Review cards
 * (M12 stuck-task nudge). Hidden for tasks that moved in today.
 *
 * Stuck uses brand-accent text + the word "Stuck", never colour alone, and
 * screen readers get the full sentence. Copy context on a stuck task opens
 * the briefing by asking the AI for help getting unstuck.
 */
export default function TimeInColumn({ time, columnLabel }) {
  if (!time || time.days < 1) return null;
  const dayWord = time.days === 1 ? 'day' : 'days';

  if (time.stuck) {
    return (
      <span
        title={`In ${columnLabel} for ${time.days} ${dayWord}. Copy context to ask an AI for help.`}
        className="inline-flex items-center gap-1 rounded-full bg-surface-card px-2 py-0.5 text-xs font-semibold text-brand-accent"
      >
        <Hourglass aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.25} />
        <span aria-hidden="true">Stuck · {time.days} d</span>
        <span className="sr-only">
          Stuck: in {columnLabel} for {time.days} {dayWord}. Copy context to ask an AI for help.
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-card px-2 py-0.5 text-xs text-ink-muted">
      <Hourglass aria-hidden="true" className="h-3.5 w-3.5" />
      <span aria-hidden="true">{time.days} d</span>
      <span className="sr-only">
        In {columnLabel} for {time.days} {dayWord}
      </span>
    </span>
  );
}
