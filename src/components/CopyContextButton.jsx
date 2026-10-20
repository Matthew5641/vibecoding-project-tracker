import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { buildContextPrompt, copyText } from '../contextPrompt.js';

/**
 * "Copy context" (M10 copy-context), on every card and in the modal.
 *
 * The label flips to "Copied!" for 2 s. On the board, `onCopied` raises the
 * app toast; inside the modal the toast sits behind the dialog (inert), so
 * without `onCopied` the button announces through its own live region.
 */
export default function CopyContextButton({ task, stages, onCopied, className = '' }) {
  const [status, setStatus] = useState(null); // null | 'copied' | 'failed'

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  async function handleClick() {
    const ok = await copyText(buildContextPrompt(task, stages));
    setStatus(ok ? 'copied' : 'failed');
    onCopied?.(ok);
  }

  const Icon = status === 'copied' ? Check : Copy;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Copy context for "${task.title || 'this task'}"`}
        className={`inline-flex h-7 items-center gap-1 rounded-md border border-line-input bg-surface-card px-2 text-xs font-medium text-ink-primary hover:bg-surface-page focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${className}`}
      >
        <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.25} />
        {status === 'copied' ? 'Copied!' : 'Copy context'}
      </button>
      {!onCopied && (
        <span role="status" className="sr-only">
          {status === 'copied' && 'Context copied — paste it into your AI and keep vibing.'}
          {status === 'failed' && "Couldn't copy. Select the text and copy it manually."}
        </span>
      )}
    </>
  );
}
