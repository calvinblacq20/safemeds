export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="text-center">
        <div
          role="status"
          aria-label="Loading"
          className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-line border-t-ink"
        />
        <p className="mt-4 text-sm text-ink-muted">Loading…</p>
      </div>
    </div>
  );
}
