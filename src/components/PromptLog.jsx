import { useRef, useState } from 'react';
import { Check, Copy, Minus, Trash2, X } from 'lucide-react';
import { AI_TOOLS, timeAgo } from './ContextField.jsx';
import { OUTCOMES, createPromptEntry } from '../prompts.js';
import { copyText } from '../contextPrompt.js';

// Outcome styling: icon + word + colour, never colour alone (DESIGN.md §7).
// Each text colour is >= 4.5:1 on its tint in both themes.
export const OUTCOME_STYLES = {
  worked: { Icon: Check, badge: 'bg-feature-tint text-feature', selected: 'border-feature bg-feature-tint text-feature' },
  partly: { Icon: Minus, badge: 'bg-due-warning-tint text-due-warning', selected: 'border-due-warning bg-due-warning-tint text-due-warning' },
  failed: { Icon: X, badge: 'bg-bug-tint text-bug', selected: 'border-bug bg-bug-tint text-bug' },
};

export function OutcomeBadge({ outcome }) {
  const { Icon, badge } = OUTCOME_STYLES[outcome];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />
      {OUTCOMES[outcome].label}
    </span>
  );
}

/**
 * The prompt log section of the task modal. Lives inside the modal's <form>,
 * so "Log prompt" is a plain button (forms can't nest) and Enter in the note
 * field logs the prompt instead of saving the task.
 *
 * Entries are part of the task draft — they're kept when the task is saved.
 */
export default function PromptLog({ prompts = [], defaultTool, inputClass, labelClass, onChange }) {
  const [prompt, setPrompt] = useState('');
  const [tool, setTool] = useState(defaultTool ?? '');
  const [outcome, setOutcome] = useState('worked');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const promptRef = useRef(null);

  function addEntry() {
    if (!prompt.trim()) {
      setError('Paste or type the prompt you sent.');
      promptRef.current?.focus();
      return;
    }
    const next = [createPromptEntry({ prompt, tool, outcome, note }), ...prompts];
    onChange(next);
    setPrompt('');
    setNote('');
    setError('');
    setAnnouncement(`Prompt logged as ${OUTCOMES[outcome].label.toLowerCase()}. ${next.length} in the log.`);
    promptRef.current?.focus();
  }

  function removeEntry(id) {
    onChange(prompts.filter((p) => p.id !== id));
    setAnnouncement('Prompt removed from the log.');
  }

  async function copyEntry(entry) {
    const ok = await copyText(entry.prompt);
    setAnnouncement(ok ? 'Prompt copied.' : "Couldn't copy the prompt.");
  }

  return (
    <fieldset className="rounded-lg border border-line-subtle p-4">
      <legend className="px-1 font-heading text-sm font-semibold">
        Prompt log {prompts.length > 0 && <span className="font-sans font-normal text-ink-muted">({prompts.length})</span>}
      </legend>
      <p className="text-xs text-ink-muted">What you asked the AI, and how it went. Saved with the task.</p>

      {/* Add an entry */}
      <div className="mt-3 space-y-3">
        <div>
          <label htmlFor="prompt-text" className={labelClass}>Prompt</label>
          <textarea
            id="prompt-text"
            ref={promptRef}
            rows={3}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'prompt-text-error' : undefined}
            className={`${inputClass} font-mono text-xs leading-relaxed`}
          />
          {error && (
            <p id="prompt-text-error" className="mt-1 text-xs font-medium text-due-overdue">{error}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="prompt-tool" className={labelClass}>AI tool</label>
            <select id="prompt-tool" value={tool} onChange={(e) => setTool(e.target.value)} className={inputClass}>
              <option value="">Not set</option>
              {AI_TOOLS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className={labelClass}>Outcome</legend>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {Object.entries(OUTCOMES).map(([key, { label }]) => {
                const { Icon, selected } = OUTCOME_STYLES[key];
                return (
                  <label key={key} className="cursor-pointer">
                    <input
                      type="radio"
                      name="prompt-outcome"
                      value={key}
                      checked={outcome === key}
                      onChange={() => setOutcome(key)}
                      className="peer sr-only"
                    />
                    <span
                      className={`flex h-[38px] items-center justify-center gap-1 rounded-md border text-xs font-medium peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary peer-focus-visible:ring-offset-1 ${
                        outcome === key ? selected : 'border-line-input text-ink-muted hover:text-ink-primary'
                      }`}
                    >
                      <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="prompt-note" className={labelClass}>
              What happened? <span className="text-ink-muted">(optional)</span>
            </label>
            <input
              id="prompt-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // log the prompt, don't save the whole task
                  addEntry();
                }
              }}
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={addEntry}
            className="h-10 shrink-0 rounded-md border border-brand-primary px-4 text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-ink-on-fill focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            Log prompt
          </button>
        </div>
      </div>

      <p role="status" className="sr-only">{announcement}</p>

      {/* History, newest first */}
      {prompts.length === 0 ? (
        <p className="mt-4 rounded-md border border-dashed border-line-subtle p-3 text-center text-xs text-ink-muted">
          No prompts logged yet — your first attempt goes here.
        </p>
      ) : (
        <ol className="mt-4 space-y-2" aria-label="Logged prompts, newest first">
          {prompts.map((entry) => (
            <li key={entry.id} className="rounded-md border border-line-subtle bg-surface-page p-3">
              <div className="flex flex-wrap items-center gap-2">
                <OutcomeBadge outcome={entry.outcome} />
                <span className="text-xs text-ink-muted">
                  {entry.tool ?? 'No tool set'} ·{' '}
                  <time dateTime={entry.createdAt} title={new Date(entry.createdAt).toLocaleString()}>
                    {timeAgo(entry.createdAt)}
                  </time>
                </span>
                <div className="ml-auto flex gap-1">
                  <button
                    type="button"
                    onClick={() => copyEntry(entry)}
                    aria-label={`Copy prompt from ${timeAgo(entry.createdAt)}`}
                    title="Copy prompt"
                    className="flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-surface-card hover:text-ink-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    aria-label={`Remove prompt from ${timeAgo(entry.createdAt)}`}
                    title="Remove from log"
                    className="flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-surface-card hover:text-due-overdue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-ink-primary">
                {entry.prompt}
              </p>
              {entry.note && <p className="mt-1 text-xs text-ink-muted">→ {entry.note}</p>}
            </li>
          ))}
        </ol>
      )}
    </fieldset>
  );
}
