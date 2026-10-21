import { useState, useEffect, useRef } from 'react';
import Board from './components/Board.jsx';
import TaskModal from './components/TaskModal.jsx';
import DrivingStrip from './components/DrivingStrip.jsx';
import Toast from './components/Toast.jsx';
import { DueLegend } from './components/DueLabel.jsx';
import SectionHeading from './components/SectionHeading.jsx';
import { CONTEXT_TEMPLATE } from './components/ContextField.jsx';
import DeliverableAnchors, { DELIVERABLES, EMPTY_ANCHORS, safeHref } from './components/DeliverableAnchors.jsx';
import Tabs from './components/Tabs.jsx';
import ShipSparks from './components/ShipSparks.jsx';
import ShippedCounter from './components/ShippedCounter.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import ShinyText from './components/ShinyText.jsx';
import { withStatus } from './stuck.js';
import { createSeedTasks, isoDaysFromToday } from './seedTasks.js';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 * @property {string} [context]        Markdown briefing for an AI tool (M9)
 * @property {string|null} [contextTool]  Claude, ChatGPT, Cursor, Lovable, Replit or Other
 * @property {string|null} [contextUpdatedAt]  ISO timestamp, set on every context edit
 * @property {import('./prompts.js').PromptEntry[]} [prompts]  Prompt log, newest first (M12)
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Starting team, from PRD §10 (solo project). Teammates can be added and
// removed in the app (M12); the live list is saved as `vibetracker.team` and
// is the only set of valid values for `Task.assignee`.
export const TEAM = ['Matthew Devon'];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage(
    'vibetracker.tasks',
    createSeedTasks(TEAM)
  );

  const [team, setTeam] = useLocalStorage('vibetracker.team', TEAM);
  // Role per teammate, by name (M12) — e.g. { 'Matthew Devon': 'Designer' }
  const [roles, setRoles] = useLocalStorage('vibetracker.roles', { [TEAM[0]]: 'Designer' });
  // Teammate whose tasks the board is filtered to, or null for everyone (M12)
  const [filter, setFilter] = useState(null);

  // The task open in the modal, or null. `isNew` marks an unsaved draft.
  const [editing, setEditing] = useState(null);

  const [toast, setToast] = useState(null);

  // Re-render every minute so due tints change on their own (M8)
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!highlightedId) return;
    const timer = setTimeout(() => setHighlightedId(null), 2000);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  function showToast(message) {
    setToast({ id: Date.now(), message });
  }

  function acknowledgeHandOff(taskId, name) {
    showToast(`Handed off to ${name}. They've got it from here.`);
    setHighlightedId(taskId);
  }

  // M12 ship moment: sparks where the card lands, plus a toast
  const sparksRef = useRef(null);
  // Bumped on every ship, replaying the shine across the title
  const [shipCount, setShipCount] = useState(0);

  function celebrateShip(task, point) {
    if (point) sparksRef.current?.burst(point.x, point.y);
    showToast(`Shipped "${task.title}". Nice work.`);
    setShipCount((n) => n + 1);
  }

  function moveTask(taskId, status, point) {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((ts) => ts.map((t) => (t.id === taskId ? withStatus(t, status) : t)));
    if (status === 'done') celebrateShip(task, point);
  }

  function addTeammate(name, role) {
    setTeam((t) => [...t, name]);
    setRoles((r) => ({ ...r, [name]: role }));
    showToast(`${name} (${role}) joined the team. You can hand tasks off to them now.`);
  }

  function removeTeammate(name) {
    const theirs = tasks.filter((t) => t.assignee === name);
    const fallback = team.find((n) => n !== name);
    const message =
      theirs.length > 0
        ? `Remove ${name} from the team? Their ${theirs.length} ${theirs.length === 1 ? 'task goes' : 'tasks go'} back to ${fallback}.`
        : `Remove ${name} from the team?`;
    if (!window.confirm(message)) return;

    setTeam((t) => t.filter((n) => n !== name));
    setRoles(({ [name]: _removed, ...rest }) => rest);
    if (filter === name) setFilter(null);
    if (theirs.length > 0) {
      setTasks((ts) => ts.map((t) => (t.assignee === name ? { ...t, assignee: fallback } : t)));
    }
    showToast(
      theirs.length > 0 ? `${name} removed. Their tasks went back to ${fallback}.` : `${name} removed from the team.`
    );
  }

  function handOff(taskId, name) {
    setTasks((ts) => ts.map((t) => (t.id === taskId ? { ...t, assignee: name } : t)));
    acknowledgeHandOff(taskId, name);
  }

  function nextTaskId() {
    const highest = tasks.reduce((max, t) => {
      const n = Number(t.id.replace(/^T-/, ''));
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 100);
    return `T-${highest + 1}`;
  }

  function openNewTask() {
    setEditing({
      isNew: true,
      task: {
        id: '',
        title: '',
        description: '',
        type: 'feature',
        status: 'todo',
        assignee: team[0],
        dueDate: null,
        createdDate: isoDaysFromToday(0),
        context: CONTEXT_TEMPLATE,
        contextTool: null,
        contextUpdatedAt: null,
        prompts: [],
      },
    });
  }

  function saveTask(task) {
    if (editing.isNew) {
      setTasks((ts) => [...ts, { ...task, id: nextTaskId(), statusChangedAt: new Date().toISOString() }]);
    } else {
      // Stamp statusChangedAt if the status dropdown changed (M12 stuck-task nudge)
      const saved = withStatus({ ...task, status: editing.task.status }, task.status);
      setTasks((ts) => ts.map((t) => (t.id === task.id ? saved : t)));
      if (task.assignee !== editing.task.assignee) acknowledgeHandOff(task.id, task.assignee);
      else if (task.status === 'done' && editing.task.status !== 'done') celebrateShip(task, null);
    }
    setEditing(null);
  }

  function deleteTask(id) {
    setTasks((ts) => ts.filter((t) => t.id !== id));
    setEditing(null);
  }

  const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', EMPTY_ANCHORS);
  const linkedCount = DELIVERABLES.filter(({ id }) => safeHref(anchors[id] ?? '')).length;

  // Board | Deliverables tabs (M12), remembered across reloads
  const [tab, setTab] = useLocalStorage('vibetracker.tab', 'board');

  return (
    <div className="mx-auto min-h-screen max-w-7xl p-4 sm:p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-ink-primary">
          <ShinyText replay={shipCount}>Vibecoding Project Tracker</ShinyText>
        </h1>
        <div className="flex items-end gap-6">
          <ShippedCounter
            shipped={tasks.filter((t) => t.status === 'done').length}
            total={tasks.length}
          />
          <button
            id="new-task-button"
            type="button"
            onClick={openNewTask}
            className="h-10 rounded-md bg-brand-primary px-4 text-sm font-medium text-ink-on-fill hover:bg-brand-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">+</span> New task
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <Tabs
          label="Views"
          selected={tab}
          onSelect={setTab}
          tabs={[
            { id: 'board', label: 'Board' },
            {
              id: 'deliverables',
              label: 'Deliverables',
              badge: `${linkedCount}/${DELIVERABLES.length}`,
              badgeLabel: `${linkedCount} of ${DELIVERABLES.length} linked`,
            },
          ]}
        />

        <div id="panel-board" role="tabpanel" aria-labelledby="tab-board" hidden={tab !== 'board'}>
          <DrivingStrip
            team={team}
            roles={roles}
            tasks={tasks}
            now={now}
            filter={filter}
            onFilter={setFilter}
            onAdd={addTeammate}
            onRemove={removeTeammate}
          />

          <SectionHeading id="board-heading" action={<DueLegend />}>
            Board
          </SectionHeading>

          {/* Filter notice (M12): visible banner + one screen reader announcement */}
          <p role="status" className="sr-only">
            {filter ? `Board filtered: showing only ${filter}'s tasks.` : ''}
          </p>
          {filter && (
            <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-brand-primary/40 bg-brand-primary/5 px-3 py-2 text-sm text-ink-primary">
              <span>
                Showing only <strong className="font-semibold">{filter}</strong>’s tasks
              </span>
              <button
                type="button"
                onClick={() => setFilter(null)}
                className="h-8 rounded-md border border-line-input bg-surface-card px-3 text-xs font-medium text-ink-primary hover:bg-surface-page focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Show everyone
              </button>
            </div>
          )}

          <Board
            stages={STAGES}
            tasks={filter ? tasks.filter((t) => t.assignee === filter) : tasks}
            team={team}
            roles={roles}
            now={now}
            onOpenTask={(task) => setEditing({ isNew: false, task })}
            onHandOff={handOff}
            onMoveTask={moveTask}
            onContextCopied={(ok) =>
              showToast(
                ok
                  ? 'Context copied — paste it into your AI and keep vibing.'
                  : "Couldn't copy. Open the task and copy the context manually."
              )
            }
            highlightedId={highlightedId}
          />
        </div>

        <div id="panel-deliverables" role="tabpanel" aria-labelledby="tab-deliverables" hidden={tab !== 'deliverables'}>
          <DeliverableAnchors anchors={anchors} onChange={setAnchors} />
        </div>
      </main>

      {editing && (
        <TaskModal
          key={editing.task.id || 'new'}
          task={editing.task}
          isNew={editing.isNew}
          stages={STAGES}
          team={team}
          roles={roles}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={() => setEditing(null)}
        />
      )}

      <ShipSparks ref={sparksRef} />
      <Toast toast={toast} />
    </div>
  );
}
