import TaskCard from './TaskCard.jsx';

/**
 * The four-column Kanban. Each column is a labelled <section> so screen
 * reader users can jump between them by heading (DESIGN.md §7).
 */
export default function Board({ stages, tasks, team, onOpenTask, onHandOff, highlightedId }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stages.map((stage) => {
        const columnTasks = tasks.filter((t) => t.status === stage.id);
        const headingId = `column-${stage.id}`;

        return (
          <section
            key={stage.id}
            aria-labelledby={headingId}
            className="flex flex-col rounded-xl border border-line-subtle bg-stone-100/60 p-3"
          >
            <h2
              id={headingId}
              className="mb-3 flex items-center justify-between px-1 font-heading text-base font-semibold uppercase tracking-wide text-ink-primary"
            >
              {stage.label}
              <span className="rounded-full bg-surface-card px-2 py-0.5 font-mono text-xs font-medium text-ink-muted">
                {columnTasks.length}
                <span className="sr-only">
                  {columnTasks.length === 1 ? ' task' : ' tasks'}
                </span>
              </span>
            </h2>

            {columnTasks.length === 0 ? (
              <p className="rounded-lg border-2 border-dashed border-line-subtle p-4 text-center text-sm text-ink-muted">
                Nothing here yet — your next idea goes here.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {columnTasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard
                      task={task}
                      team={team}
                      onOpen={onOpenTask}
                      onHandOff={onHandOff}
                      highlighted={task.id === highlightedId}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
