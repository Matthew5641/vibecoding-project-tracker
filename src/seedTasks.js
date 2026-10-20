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

export function createSeedTasks([human, agent = human]) {
  return [
    {
      id: 'T-101',
      title: 'Write the PRD',
      description: 'Lock sections 1–7, fill in team, milestone owners and identity.',
      type: 'feature',
      status: 'done',
      assignee: human,
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
      type: 'feature',
      status: 'in-progress',
      assignee: agent,
      dueDate: isoDaysFromToday(0),
      createdDate: isoDaysFromToday(-1),
    },
    {
      id: 'T-103',
      title: 'Focus ring missing on cards',
      description: 'Keyboard users cannot see which card is focused.',
      type: 'bug',
      status: 'review',
      assignee: human,
      dueDate: isoDaysFromToday(-1),
      createdDate: isoDaysFromToday(-1),
    },
    {
      id: 'T-104',
      title: 'Add / edit task modal',
      description: 'One modal for create and edit, with a status dropdown.',
      type: 'feature',
      status: 'todo',
      assignee: human,
      dueDate: isoDaysFromToday(4),
      createdDate: isoDaysFromToday(0),
    },
  ];
}
