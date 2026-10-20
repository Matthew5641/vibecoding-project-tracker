import { useState } from 'react';
import Markdown from 'react-markdown';

export const AI_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

export const CONTEXT_TEMPLATE = `## Background
What is this task and why does it matter?

## Constraints
-

## Tried so far
-

## Pick up
The very next step for whoever (or whichever AI) continues this.
`;

/** "2026-10-20T13:00:00Z" -> "2 h ago" */
export function timeAgo(iso, now = new Date()) {
  const minutes = Math.floor((now - new Date(iso)) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}

// Markdown preview styling without a typography plugin
const previewClass =
  'min-h-[12rem] rounded-md border border-line-subtle bg-surface-page px-3 py-2 text-sm leading-relaxed text-ink-primary ' +
  '[&_h1]:mt-3 [&_h1]:font-heading [&_h1]:text-base [&_h1]:font-semibold ' +
  '[&_h2]:mt-3 [&_h2]:font-heading [&_h2]:text-sm [&_h2]:font-semibold [&>*:first-child]:mt-0 ' +
  '[&_h3]:mt-2 [&_h3]:font-semibold [&_p]:mt-1 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 ' +
  '[&_ol]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand-accent [&_a]:underline ' +
  '[&_code]:rounded [&_code]:bg-surface-card [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs ' +
  '[&_pre]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-surface-card [&_pre]:p-2';

const toggleClass = (active) =>
  'h-8 rounded px-3 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ' +
  (active ? 'bg-surface-card text-ink-primary shadow-sm' : 'text-ink-muted hover:text-ink-primary');

/**
 * The Context briefing on the task modal (M9 task-context) — the curated
 * Markdown block you paste into an AI tool to carry on vibecoding.
 *
 * Write / Preview toggle for the Markdown (stretch goal). Inputs come from
 * TaskModal's draft; `onChange(field, value)` updates it.
 */
export default function ContextField({ context, contextTool, contextUpdatedAt, inputClass, labelClass, onChange, copyButton }) {
  const [mode, setMode] = useState('write');

  return (
    <fieldset className="rounded-lg border border-line-subtle p-4">
      <legend className="px-1 font-heading text-sm font-semibold">Context</legend>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p id="context-help" className="text-xs text-ink-muted">
          A Markdown briefing to paste into your AI tool.
        </p>
        <div className="flex items-center gap-2">
          {copyButton}
          <div role="group" aria-label="Context view" className="flex gap-1 rounded-md bg-surface-page p-1">
            <button type="button" aria-pressed={mode === 'write'} onClick={() => setMode('write')} className={toggleClass(mode === 'write')}>
              Write
            </button>
            <button type="button" aria-pressed={mode === 'preview'} onClick={() => setMode('preview')} className={toggleClass(mode === 'preview')}>
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2">
        {mode === 'write' ? (
          <>
            <label htmlFor="task-context" className="sr-only">Context (Markdown)</label>
            <textarea
              id="task-context"
              rows={10}
              value={context}
              onChange={(e) => onChange('context', e.target.value)}
              aria-describedby="context-help context-updated"
              spellCheck
              className={`${inputClass} font-mono text-xs leading-relaxed`}
            />
          </>
        ) : (
          <div aria-label="Context preview" role="region" className={previewClass}>
            {context.trim() ? (
              <Markdown>{context}</Markdown>
            ) : (
              <p className="text-ink-muted">Nothing written yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p id="context-updated" className="text-xs text-ink-muted">
          {contextUpdatedAt ? (
            <>
              Last updated{' '}
              <time dateTime={contextUpdatedAt} title={new Date(contextUpdatedAt).toLocaleString()}>
                {timeAgo(contextUpdatedAt)}
              </time>
            </>
          ) : (
            'Not edited yet'
          )}
        </p>
        {!context.trim() && mode === 'write' && (
          <button
            type="button"
            onClick={() => onChange('context', CONTEXT_TEMPLATE)}
            className="text-xs font-medium text-brand-accent underline hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Insert template
          </button>
        )}
      </div>

      <div className="mt-4 sm:w-1/2">
        <label htmlFor="task-context-tool" className={labelClass}>
          AI tool <span className="text-ink-muted">(optional)</span>
        </label>
        <select
          id="task-context-tool"
          value={contextTool ?? ''}
          onChange={(e) => onChange('contextTool', e.target.value || null)}
          className={inputClass}
        >
          <option value="">Not set</option>
          {AI_TOOLS.map((tool) => (
            <option key={tool} value={tool}>{tool}</option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}
