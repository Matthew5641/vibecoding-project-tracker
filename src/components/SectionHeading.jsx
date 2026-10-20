/**
 * Page section label — "DELIVERABLES ────", "TEAM ────", "BOARD ────".
 * Smaller and quieter than the column titles so the hierarchy reads at a
 * glance; a real <h2> so screen reader users can jump between sections.
 * `action` sits on the right (e.g. the due-date legend).
 */
export default function SectionHeading({ id, children, action }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <h2 id={id} className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {children}
      </h2>
      <span aria-hidden="true" className="h-px min-w-8 flex-1 bg-line-subtle" />
      {action}
    </div>
  );
}
