/** Non-blocking route wait — never cover the UI with a click-blocking overlay. */
export default function Loading() {
  return (
    <div className="ay-route-progress" role="status" aria-live="polite" aria-label="Loading">
      <span className="ay-route-progress-bar" />
    </div>
  );
}
