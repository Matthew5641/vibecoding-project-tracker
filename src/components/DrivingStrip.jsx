import { useEffect, useRef, useState } from 'react';
import { TriangleAlert, UserPlus, X } from 'lucide-react';
import Avatar from './Avatar.jsx';
import SectionHeading from './SectionHeading.jsx';
import { getDueState } from './DueLabel.jsx';

const MAX_NAME = 40;

export const ROLES = ['Designer', 'Developer', 'Researcher', 'Writer', 'Other'];

/** "Priya Shah" + { "Priya Shah": "Designer" } -> "Priya Shah (Designer)" */
export function nameWithRole(name, roles) {
  return roles?.[name] ? `${name} (${roles[name]})` : name;
}

/**
 * The team strip (M7 task-owner, extended in M12):
 * - each teammate's role and workload — open, in progress, overdue
 * - click a teammate to show only their tasks on the board (a toggle button
 *   with aria-pressed); click again to show everyone
 * - add teammates (name + role) and remove them
 * Everyone on the team shows up in the "Hand off to…" and Assignee dropdowns.
 */
export default function DrivingStrip({ team, roles, tasks, now, filter, onFilter, onAdd, onRemove }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const addButtonRef = useRef(null);
  const wasAdding = useRef(false);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
    // Closing the form returns focus to the button that opened it
    else if (wasAdding.current) addButtonRef.current?.focus();
    wasAdding.current = adding;
  }, [adding]);

  function close() {
    setAdding(false);
    setName('');
    setRole(ROLES[0]);
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim().replace(/\s+/g, ' ');
    if (!trimmed) return setError('Type a name first.');
    if (trimmed.length > MAX_NAME) return setError(`Keep it under ${MAX_NAME} characters.`);
    if (team.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      return setError(`${trimmed} is already on the team.`);
    }
    onAdd(trimmed, role);
    close();
  }

  return (
    <section aria-labelledby="team-heading" className="mb-6">
      <SectionHeading id="team-heading">Team</SectionHeading>
      <ul className="flex flex-wrap items-center gap-3">
        {team.map((member) => {
          const theirs = tasks.filter((t) => t.assignee === member && t.status !== 'done');
          const inProgress = theirs.filter((t) => t.status === 'in-progress').length;
          const overdue = theirs.filter((t) => getDueState(t, now)?.state === 'overdue').length;
          const pressed = filter === member;

          return (
            <li
              key={member}
              className={`flex min-w-0 items-center rounded-full border bg-surface-card ${
                pressed ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-line-subtle'
              }`}
            >
              <button
                type="button"
                aria-pressed={pressed}
                onClick={() => onFilter(pressed ? null : member)}
                title={pressed ? 'Show everyone’s tasks' : `Show only ${member}’s tasks`}
                className={`flex min-w-0 items-center gap-2 rounded-full py-1 pl-1 pr-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                  pressed ? 'bg-brand-primary/10' : 'hover:bg-surface-page'
                }`}
              >
                <Avatar name={member} team={team} size="sm" />
                <span className="min-w-0 truncate text-xs">
                  <span className="font-medium text-ink-primary">{member}</span>
                  {roles[member] && <span className="text-ink-muted"> · {roles[member]}</span>}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-ink-muted">
                  <span aria-hidden="true" className="h-3 w-px bg-line-subtle" />
                  <span>{theirs.length} open</span>
                  {inProgress > 0 && <span>· {inProgress} in progress</span>}
                  {overdue > 0 && (
                    <span className="inline-flex items-center gap-0.5 font-medium text-due-overdue">
                      <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5" />
                      {overdue} overdue
                    </span>
                  )}
                </span>
                <span className="sr-only">, show only their tasks</span>
              </button>
              {team.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onRemove(member)}
                  aria-label={`Remove ${member} from the team`}
                  title={`Remove ${member}`}
                  className="mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-surface-page hover:text-due-overdue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <X aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span className="w-1" />
              )}
            </li>
          );
        })}

        <li>
          {adding ? (
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => e.key === 'Escape' && close()}
              noValidate
              className="flex flex-wrap items-center gap-2"
            >
              <label htmlFor="new-teammate" className="sr-only">
                Teammate name
              </label>
              <input
                id="new-teammate"
                ref={inputRef}
                type="text"
                value={name}
                maxLength={MAX_NAME + 10}
                placeholder="Teammate name"
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? 'new-teammate-error' : undefined}
                autoComplete="off"
                className="h-8 w-44 rounded-full border border-line-input bg-surface-card px-3 text-xs text-ink-primary placeholder:text-ink-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              />
              <label htmlFor="new-teammate-role" className="sr-only">
                Role
              </label>
              <select
                id="new-teammate-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-8 rounded-full border border-line-input bg-surface-card px-3 text-xs text-ink-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button
                type="submit"
                className="h-8 rounded-full bg-brand-primary px-3 text-xs font-medium text-ink-on-fill hover:bg-brand-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                Add
              </button>
              <button
                type="button"
                onClick={close}
                className="h-8 rounded-full px-3 text-xs font-medium text-ink-muted hover:text-ink-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Cancel
              </button>
              {error && (
                <p id="new-teammate-error" role="alert" className="w-full text-xs font-medium text-due-overdue">
                  {error}
                </p>
              )}
            </form>
          ) : (
            <button
              ref={addButtonRef}
              type="button"
              onClick={() => setAdding(true)}
              className="flex h-8 items-center gap-1.5 rounded-full border border-dashed border-line-input px-3 text-xs font-medium text-ink-primary hover:border-brand-primary hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <UserPlus aria-hidden="true" className="h-3.5 w-3.5" />
              Add teammate
            </button>
          )}
        </li>
      </ul>
    </section>
  );
}
