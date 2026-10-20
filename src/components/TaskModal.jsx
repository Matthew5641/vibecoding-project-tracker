import { useEffect, useRef, useState } from 'react';
import TypeBadge, { TYPE_STYLES } from './TypeBadge.jsx';

const inputClass =
  'mt-1 block w-full rounded-md border border-line-input bg-surface-card px-3 py-2 text-sm text-ink-primary ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1';
const labelClass = 'block text-xs font-medium text-ink-primary';
const ghostButton =
  'h-10 rounded-md border border-line-input px-4 text-sm font-medium text-ink-primary hover:bg-surface-page ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2';
const primaryButton =
  'h-10 rounded-md bg-brand-primary px-4 text-sm font-medium text-white hover:bg-indigo-700 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2';

/**
 * Add / edit modal (M5 crud-modal).
 *
 * Built on the native <dialog> + showModal(): the page behind becomes inert,
 * Esc closes it, and it is announced as a modal dialog. We add the rest of
 * DESIGN.md §7 — focus starts on the title, returns to the opener on close,
 * and a backdrop click closes it.
 *
 * `task` is the task being edited, or a blank draft when `isNew` is true.
 */
export default function TaskModal({ task, isNew, stages, team, onSave, onDelete, onClose }) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const keepButtonRef = useRef(null);
  const pressStartedOnBackdrop = useRef(false);

  const [draft, setDraft] = useState(task);
  const [titleError, setTitleError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    if (!dialog.open) dialog.showModal();
    titleRef.current?.focus();
    return () => {
      // The opener is gone after a delete — fall back to the "+ New task" button
      if (opener?.isConnected) opener.focus();
      else document.getElementById('new-task-button')?.focus();
    };
  }, []);

  useEffect(() => {
    if (confirmingDelete) keepButtonRef.current?.focus();
  }, [confirmingDelete]);

  function update(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const title = draft.title.trim();
    if (!title) {
      setTitleError('Give the task a title so you can find it later.');
      titleRef.current?.focus();
      return;
    }
    onSave({ ...draft, title, description: draft.description.trim() });
  }

  const headingId = 'task-modal-title';
  const typeStyle = TYPE_STYLES[draft.type] ?? TYPE_STYLES.feature;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      onClose={onClose}
      onMouseDown={(e) => {
        pressStartedOnBackdrop.current = e.target === dialogRef.current;
      }}
      onClick={(e) => {
        // Only close when the whole click happened on the backdrop, so
        // selecting text and releasing outside the panel doesn't lose work.
        if (pressStartedOnBackdrop.current && e.target === dialogRef.current) onClose();
      }}
      className={`w-[calc(100%-2rem)] max-w-lg rounded-xl border-t-4 ${typeStyle.topEdge} bg-surface-card p-0 text-ink-primary shadow-xl backdrop:bg-ink-primary/40`}
    >
      <form onSubmit={handleSubmit} noValidate className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-ink-muted">{isNew ? 'New task' : draft.id}</p>
              <TypeBadge type={draft.type} />
            </div>
            <h2 id={headingId} className="font-heading text-xl font-semibold">
              {isNew ? 'Add a task' : 'Edit task'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-md text-xl text-ink-muted hover:bg-surface-page focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="task-title" className={labelClass}>
              Title <span className="text-ink-muted">(required)</span>
            </label>
            <input
              id="task-title"
              ref={titleRef}
              type="text"
              value={draft.title}
              onChange={(e) => {
                update('title', e.target.value);
                if (titleError) setTitleError('');
              }}
              aria-required="true"
              aria-invalid={titleError ? 'true' : undefined}
              aria-describedby={titleError ? 'task-title-error' : undefined}
              className={inputClass}
            />
            {titleError && (
              <p id="task-title-error" className="mt-1 text-xs font-medium text-due-overdue">
                {titleError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="task-description" className={labelClass}>Description</label>
            <textarea
              id="task-description"
              rows={3}
              value={draft.description}
              onChange={(e) => update('description', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="task-type" className={labelClass}>Type</label>
              <select
                id="task-type"
                value={draft.type}
                onChange={(e) => update('type', e.target.value)}
                className={inputClass}
              >
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-status" className={labelClass}>Status</label>
              <select
                id="task-status"
                value={draft.status}
                onChange={(e) => update('status', e.target.value)}
                className={inputClass}
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-assignee" className={labelClass}>Assignee</label>
              <select
                id="task-assignee"
                value={draft.assignee}
                onChange={(e) => update('assignee', e.target.value)}
                className={inputClass}
              >
                {team.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-due" className={labelClass}>Due date</label>
              <input
                id="task-due"
                type="date"
                value={draft.dueDate ?? ''}
                onChange={(e) => update('dueDate', e.target.value || null)}
                className={inputClass}
              />
            </div>
          </div>

          <p className="text-xs text-ink-muted">
            Created <span className="font-mono">{draft.createdDate}</span>
          </p>
        </div>

        {confirmingDelete ? (
          <div className="mt-6 rounded-lg border border-due-overdue bg-due-overdue-tint p-4">
            <p id="delete-confirm-message" className="text-sm font-medium text-ink-primary">
              Delete this task for good? This can't be undone.
            </p>
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button
                ref={keepButtonRef}
                type="button"
                onClick={() => setConfirmingDelete(false)}
                aria-describedby="delete-confirm-message"
                className={ghostButton + ' bg-surface-card'}
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => onDelete(draft.id)}
                className="h-10 rounded-md bg-due-overdue px-4 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-due-overdue focus-visible:ring-offset-2"
              >
                Delete task
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              {!isNew && (
                <button type="button" onClick={() => setConfirmingDelete(true)} className={ghostButton}>
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className={ghostButton}>
                Cancel
              </button>
              <button type="submit" className={primaryButton}>
                {isNew ? 'Add task' : 'Save changes'}
              </button>
            </div>
          </div>
        )}
      </form>
    </dialog>
  );
}
