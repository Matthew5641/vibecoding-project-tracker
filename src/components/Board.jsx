import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import TaskCard from './TaskCard.jsx';

/**
 * The four-column Kanban. Each column is a labelled <section> so screen
 * reader users can jump between them by heading (DESIGN.md §7).
 *
 * M12 secret-sauce: drag cards between columns. Mouse and touch drag the
 * whole card; keyboard users focus the grip handle, press Space, use the
 * arrow keys to jump column to column, and Space again to drop (Esc cancels).
 * The status dropdown in the modal stays as the non-drag alternative.
 */

// Pointer first (drop where the cursor is); keyboard drags have no pointer,
// so fall back to whichever column the card overlaps.
function collisionDetection(args) {
  const hits = pointerWithin(args);
  return hits.length > 0 ? hits : rectIntersection(args);
}

/** Arrow keys jump straight to the previous / next column in STAGES order. */
function columnKeyboardCoordinates(stageIds) {
  return (event, { active, context: { over, droppableRects, collisionRect } }) => {
    const forward = event.code === 'ArrowRight' || event.code === 'ArrowDown';
    const backward = event.code === 'ArrowLeft' || event.code === 'ArrowUp';
    if (!forward && !backward) return undefined;
    event.preventDefault();

    const current = over?.id ?? active?.data.current?.task.status;
    const index = stageIds.indexOf(current);
    const nextIndex = Math.min(stageIds.length - 1, Math.max(0, index + (forward ? 1 : -1)));
    const target = droppableRects.get(stageIds[nextIndex]);
    if (!target || !collisionRect) return undefined;

    // Centre the card horizontally in the column, just under its heading
    return {
      x: target.left + (target.width - collisionRect.width) / 2,
      y: target.top + 48,
    };
  };
}

function DraggableCard({ task, ...cardProps }) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  return (
    <TaskCard
      task={task}
      {...cardProps}
      drag={{
        setNodeRef,
        setActivatorNodeRef,
        handleAttributes: attributes,
        onPointerDown: listeners?.onPointerDown,
        onKeyDown: listeners?.onKeyDown,
        isDragging,
      }}
    />
  );
}

function Column({ stage, tasks, children }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const headingId = `column-${stage.id}`;

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={`flex flex-col rounded-xl border bg-surface-column p-3 ${
        isOver ? 'border-dashed border-brand-primary outline outline-1 outline-brand-primary' : 'border-line-subtle'
      }`}
    >
      <h3
        id={headingId}
        className="mb-3 flex items-center justify-between px-1 font-heading text-base font-semibold uppercase tracking-wide text-ink-primary"
      >
        {stage.label}
        <span className="rounded-full bg-surface-card px-2 py-0.5 font-mono text-xs font-medium text-ink-muted">
          {tasks.length}
          <span className="sr-only">{tasks.length === 1 ? ' task' : ' tasks'}</span>
        </span>
      </h3>

      {tasks.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-line-subtle p-4 text-center text-sm text-ink-muted">
          Nothing here yet — your next idea goes here.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">{children}</ul>
      )}
    </section>
  );
}

export default function Board({
  stages,
  tasks,
  team,
  roles,
  now,
  onOpenTask,
  onHandOff,
  onContextCopied,
  onMoveTask,
  highlightedId,
}) {
  const [activeTask, setActiveTask] = useState(null);
  const stageIds = stages.map((s) => s.id);
  const labelOf = (id) => stages.find((s) => s.id === id)?.label ?? id;
  const titleOf = (id) => tasks.find((t) => t.id === id)?.title ?? 'task';

  const sensors = useSensors(
    // 5 px of movement before a drag starts, so a plain click still opens the card
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: columnKeyboardCoordinates(stageIds) })
  );

  const accessibility = {
    screenReaderInstructions: {
      draggable:
        'To move this task, press Space. Use the arrow keys to move between columns, Space to drop, or Escape to cancel.',
    },
    announcements: {
      onDragStart: ({ active }) => `Picked up "${titleOf(active.id)}".`,
      onDragOver: ({ active, over }) =>
        over ? `"${titleOf(active.id)}" is over ${labelOf(over.id)}.` : `"${titleOf(active.id)}" is not over a column.`,
      onDragEnd: ({ active, over }) =>
        over ? `"${titleOf(active.id)}" dropped in ${labelOf(over.id)}.` : `"${titleOf(active.id)}" dropped. Nothing changed.`,
      onDragCancel: ({ active }) => `Move cancelled. "${titleOf(active.id)}" stayed where it was.`,
    },
  };

  function handleDragEnd({ active, over }) {
    setActiveTask(null);
    if (!over) return;
    const task = active.data.current.task;
    if (task.status === over.id) return;

    // Where the card landed, for the ship-moment sparks
    const rect = active.rect.current.translated;
    const point = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
    onMoveTask(task.id, over.id, point);
  }

  const cardProps = { team, roles, stages, now, onOpen: onOpenTask, onHandOff, onContextCopied };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={accessibility}
      onDragStart={({ active }) => setActiveTask(active.data.current.task)}
      onDragCancel={() => setActiveTask(null)}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage) => {
          const columnTasks = tasks.filter((t) => t.status === stage.id);
          return (
            <Column key={stage.id} stage={stage} tasks={columnTasks}>
              {columnTasks.map((task) => (
                <li key={task.id}>
                  <DraggableCard task={task} {...cardProps} highlighted={task.id === highlightedId} />
                </li>
              ))}
            </Column>
          );
        })}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask && <TaskCard task={activeTask} {...cardProps} overlay />}
      </DragOverlay>
    </DndContext>
  );
}
