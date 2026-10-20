/**
 * Toast notifications (M7 handoff, reused by M10 Copy Context).
 *
 * The live region is always in the DOM so screen readers announce new
 * messages; only its contents change. The 200 ms fade is motion-safe only
 * (DESIGN.md §7–8).
 */
export default function Toast({ toast }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      {toast && (
        <p
          key={toast.id}
          className="rounded-lg bg-ink-primary px-4 py-3 text-sm font-medium text-white shadow-lg motion-safe:animate-toast-in"
        >
          {toast.message}
        </p>
      )}
    </div>
  );
}
