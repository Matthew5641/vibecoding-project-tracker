/**
 * Stuck-task nudge (M12 secret-sauce): how long a task has sat in its
 * column, and whether that's long enough to call it stuck.
 *
 * Every status change stamps `statusChangedAt`. Tasks from before this
 * existed fall back to their created date.
 */

const DAY = 24 * 60 * 60 * 1000;

// Days in a column before a task counts as stuck. To Do and Done never are.
export const STUCK_AFTER_DAYS = { 'in-progress': 3, review: 2 };

/** Returns { days, stuck } for In Progress / Review tasks, otherwise null. */
export function getTimeInColumn(task, now) {
  const limit = STUCK_AFTER_DAYS[task.status];
  if (limit === undefined) return null;

  const since = task.statusChangedAt
    ? new Date(task.statusChangedAt)
    : new Date(`${task.createdDate}T00:00:00`); // local midnight
  const days = Math.max(0, Math.floor((now - since) / DAY));
  return { days, stuck: days > limit };
}

/** Stamp a status change. Leaves the task untouched if the status is the same. */
export function withStatus(task, status) {
  return task.status === status ? task : { ...task, status, statusChangedAt: new Date().toISOString() };
}
