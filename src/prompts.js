/**
 * Prompt log (M12 secret-sauce): every prompt you send for a task, the AI
 * tool, and how it went. Answers the hackathon brief's "store the prompt +
 * AI tool + outcome for every task".
 *
 * @typedef {Object} PromptEntry
 * @property {string} id
 * @property {string} prompt
 * @property {string|null} tool        One of AI_TOOLS
 * @property {'worked'|'partly'|'failed'} outcome
 * @property {string} note             Optional "what happened"
 * @property {string} createdAt        ISO timestamp
 */

export const OUTCOMES = {
  worked: { label: 'Worked', symbol: '✓' },
  partly: { label: 'Partly', symbol: '~' },
  failed: { label: 'Failed', symbol: '✗' },
};

export function createPromptEntry({ prompt, tool, outcome, note }) {
  return {
    id: `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    prompt: prompt.trim(),
    tool: tool || null,
    outcome,
    note: note.trim(),
    createdAt: new Date().toISOString(),
  };
}

/** { worked: 2, partly: 0, failed: 1 } */
export function outcomeCounts(prompts = []) {
  const counts = { worked: 0, partly: 0, failed: 0 };
  for (const p of prompts) counts[p.outcome] += 1;
  return counts;
}
