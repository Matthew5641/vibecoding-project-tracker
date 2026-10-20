import { OUTCOMES } from './prompts.js';

const MAX_PROMPT_CHARS = 280;

/** The prompt log as a Markdown list, so the AI knows what was already tried. */
function promptLogSection(prompts = []) {
  if (prompts.length === 0) return null;
  const lines = prompts.map((p) => {
    const text = p.prompt.length > MAX_PROMPT_CHARS ? `${p.prompt.slice(0, MAX_PROMPT_CHARS)}…` : p.prompt;
    const { symbol, label } = OUTCOMES[p.outcome];
    const meta = [`${symbol} ${label}`, p.tool, p.createdAt.slice(0, 10)].filter(Boolean).join(' · ');
    return `- **${meta}:** ${text.replace(/\s+/g, ' ')}${p.note ? `\n  → ${p.note}` : ''}`;
  });
  return `## Prompts tried so far (newest first)\n${lines.join('\n')}`;
}

/**
 * Turns a task into a Markdown briefing to paste into any AI chat
 * (M10 copy-context). Reads as a natural hand-over: a one-line ask,
 * the facts, the description, the curated Context field as written, then the
 * prompt log (M12) so the AI knows what has already been tried.
 */
export function buildContextPrompt(task, stages) {
  const status = stages.find((s) => s.id === task.status)?.label ?? task.status;
  const type = task.type === 'bug' ? 'Bug' : 'Feature';

  const facts = [
    `- **ID:** ${task.id || 'new task'}`,
    `- **Type:** ${type}`,
    `- **Status:** ${status}`,
    `- **Owner:** ${task.assignee}`,
    task.dueDate && `- **Due:** ${task.dueDate}`,
    task.contextTool && `- **AI tool:** ${task.contextTool}`,
  ].filter(Boolean);

  const sections = [
    "I'm continuing a vibecoding task. Here's the briefing — please pick up where it leaves off.",
    `# ${task.title || 'Untitled task'}`,
    facts.join('\n'),
    task.description?.trim() && `## Description\n${task.description.trim()}`,
    task.context?.trim(),
    promptLogSection(task.prompts),
  ].filter(Boolean);

  return sections.join('\n\n') + '\n';
}

/** Clipboard API, with a fallback for browsers/contexts that block it. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}
