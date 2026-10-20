import { useRef } from 'react';

/**
 * Page tabs (M12): Board | Deliverables. Follows the WAI-ARIA tabs pattern —
 * role="tablist" / "tab", aria-selected, roving tabindex, ←/→ and Home/End
 * to move (selection follows focus). The selected tab is shown by an
 * underline and bold text, not colour alone.
 *
 * Panels are rendered by the caller with id `panel-<id>` and
 * aria-labelledby `tab-<id>`.
 *
 * tabs: [{ id, label, badge?, badgeLabel? }]
 */
export default function Tabs({ label, tabs, selected, onSelect }) {
  const refs = useRef({});

  function handleKeyDown(e) {
    const index = tabs.findIndex((t) => t.id === selected);
    const last = tabs.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    onSelect(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  }

  return (
    <div className="mb-6 flex items-end">
      <div role="tablist" aria-label={label} onKeyDown={handleKeyDown} className="flex gap-1 border-b border-line-subtle">
        {tabs.map((tab) => {
          const active = tab.id === selected;
          return (
            <button
              key={tab.id}
              ref={(el) => (refs.current[tab.id] = el)}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(tab.id)}
              className={`-mb-px flex h-10 items-center gap-2 border-b-2 px-3 font-heading text-xs uppercase tracking-[0.12em] focus:outline-none focus-visible:rounded-t focus-visible:ring-2 focus-visible:ring-brand-primary ${
                active
                  ? 'border-brand-primary font-bold text-ink-primary'
                  : 'border-transparent font-semibold text-ink-muted hover:border-line-input hover:text-ink-primary'
              }`}
            >
              {tab.label}
              {tab.badge != null && (
                <span className="rounded-full bg-surface-column px-1.5 py-0.5 font-mono text-[0.75rem] font-medium normal-case tracking-normal text-ink-muted">
                  <span aria-hidden="true">{tab.badge}</span>
                  {tab.badgeLabel && <span className="sr-only">, {tab.badgeLabel}</span>}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/* The thin rule from the section headings, continued under the tabs */}
      <span aria-hidden="true" className="h-px flex-1 bg-line-subtle" />
    </div>
  );
}
