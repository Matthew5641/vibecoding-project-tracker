import { BookOpen, ExternalLink, FileText, MonitorPlay, Presentation } from 'lucide-react';
import SpotlightCard from './SpotlightCard.jsx';
import StatusMark from './StatusMark.jsx';

export const DELIVERABLES = [
  { id: 'presentation', label: 'Presentation', Icon: Presentation },
  { id: 'demo', label: 'Demo', Icon: MonitorPlay },
  { id: 'report', label: 'Report', Icon: FileText },
  { id: 'documentation', label: 'Documentation', Icon: BookOpen },
];

export const EMPTY_ANCHORS = { presentation: '', demo: '', report: '', documentation: '' };

/** Only http(s) links are opened — never javascript: or data: URLs. */
export function safeHref(value) {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * Deliverable Anchor Board (M11 project-deliverables): the four final-project
 * deliverables pinned above the Kanban, one URL each.
 *
 * Status is a filled / hollow dot *plus* the words "Linked" / "No link yet",
 * so it never relies on colour or shape alone (DESIGN.md §7).
 */
export default function DeliverableAnchors({ anchors, onChange }) {
  return (
    <section aria-labelledby="deliverables-heading">
      {/* The Deliverables tab is the visible label; this keeps heading navigation working */}
      <h2 id="deliverables-heading" className="sr-only">
        Deliverables
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {DELIVERABLES.map(({ id, label, Icon }) => {
          const value = anchors[id] ?? '';
          const href = safeHref(value);
          const linked = Boolean(href);
          const invalid = value.trim() !== '' && !linked;
          const inputId = `anchor-${id}`;

          return (
            <SpotlightCard as="li" key={id} className="rounded-lg border border-line-subtle bg-surface-card p-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={inputId} className="flex items-center gap-1.5 text-sm font-medium text-ink-primary">
                  <Icon aria-hidden="true" className="h-4 w-4 text-brand-primary" strokeWidth={2.25} />
                  {label}
                </label>
                <span id={`${inputId}-status`} className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <StatusMark linked={linked} />
                  {linked ? 'Linked' : invalid ? 'Not a valid link' : 'No link yet'}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <input
                  id={inputId}
                  type="url"
                  inputMode="url"
                  placeholder="https://…"
                  value={value}
                  onChange={(e) => onChange({ ...anchors, [id]: e.target.value })}
                  aria-describedby={`${inputId}-status`}
                  aria-invalid={invalid ? 'true' : undefined}
                  className={`h-9 min-w-0 flex-1 rounded-md border bg-surface-card px-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                    invalid ? 'border-due-overdue' : 'border-line-input'
                  }`}
                />
                {linked && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${label} (new tab)`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line-input text-ink-primary hover:bg-surface-page focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </a>
                )}
              </div>
            </SpotlightCard>
          );
        })}
      </ul>
    </section>
  );
}
