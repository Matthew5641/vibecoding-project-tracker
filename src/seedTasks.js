/**
 * Mock tasks shown on first load (M4 data-model).
 *
 * Dates are relative to today so the board always has a realistic mix of
 * due states once M8 due-tint lands — one overdue, one due soon, one calm.
 */

export function isoDaysFromToday(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  // Local date, not UTC, so "today" matches the user's calendar
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function createSeedTasks([owner]) {
  return [
    {
      id: 'T-101',
      title: 'Write the PRD',
      description: 'Lock sections 1–7, fill in team, milestone owners and identity.',
      type: 'feature',
      status: 'done',
      assignee: owner,
      dueDate: isoDaysFromToday(-1),
      createdDate: isoDaysFromToday(-2),
    },
    {
      id: 'T-102',
      title: 'Build the Kanban board',
      description: 'Four columns from STAGES, cards show title and assignee.',
      context: `## Background
M4 of the hackathon: get the Kanban on screen. Everything else hangs off it.

## Constraints
- React + Vite + Tailwind, localStorage only
- Columns are labelled sections (DESIGN.md §7)

## Tried so far
- Scaffolded Board and TaskCard components

## Pick up
Seed 3–4 tasks and show title + assignee on each card.
`,
      contextTool: 'Claude',
      contextUpdatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      prompts: [
        {
          id: 'p-seed-2',
          prompt: 'Render the four STAGES as labelled <section> columns and show title + assignee on each card. Use the Tailwind tokens from DESIGN.md.',
          tool: 'Claude',
          outcome: 'worked',
          note: 'Board renders; columns announce their task count.',
          createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        },
        {
          id: 'p-seed-1',
          prompt: 'Build a Kanban board for my tracker.',
          tool: 'ChatGPT',
          outcome: 'failed',
          note: 'Too vague — invented its own data model and ignored the starter.',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ],
      type: 'feature',
      status: 'in-progress',
      assignee: owner,
      dueDate: isoDaysFromToday(0),
      createdDate: isoDaysFromToday(-1),
    },
    {
      id: 'T-103',
      title: 'Focus ring missing on cards',
      description: 'Keyboard users cannot see which card is focused.',
      type: 'bug',
      status: 'review',
      // In Review for 3 days, so the M12 stuck-task nudge shows on first load
      statusChangedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: owner,
      dueDate: isoDaysFromToday(-1),
      createdDate: isoDaysFromToday(-4),
    },
    {
      id: 'T-104',
      title: 'Add / edit task modal',
      description: 'One modal for create and edit, with a status dropdown.',
      type: 'feature',
      status: 'todo',
      assignee: owner,
      dueDate: isoDaysFromToday(4),
      createdDate: isoDaysFromToday(0),
    },
  ];
}
