/** Non-blocking learn-route wait. */
export default function LearnLoading() {
  return (
    <div className="ay-route-progress" role="status" aria-live="polite" aria-label="Loading">
      <span className="ay-route-progress-bar" />
    </div>
  );
}
