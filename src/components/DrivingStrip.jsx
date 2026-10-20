import Avatar from './Avatar.jsx';

/** "Who's driving what" — each teammate's In Progress tasks at a glance (M7). */
export default function DrivingStrip({ team, tasks }) {
  return (
    <section aria-labelledby="driving-heading">
      <h2 id="driving-heading" className="sr-only">
        Who's driving
      </h2>
      <ul className="flex flex-wrap gap-3">
        {team.map((name) => {
          const driving = tasks.filter((t) => t.assignee === name && t.status === 'in-progress');
          return (
            <li
              key={name}
              className="flex min-w-0 items-center gap-2 rounded-full border border-line-subtle bg-surface-card py-1 pl-1 pr-4"
            >
              <Avatar name={name} team={team} size="sm" />
              <p className="min-w-0 truncate text-xs text-ink-muted">
                <span className="font-medium text-ink-primary">{name}</span>
                {' · '}
                {driving.length === 0
                  ? 'Nothing in progress'
                  : `Driving: ${driving.map((t) => t.title).join(', ')}`}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
