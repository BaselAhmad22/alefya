/** Plus → minus accordion affordance used by FAQ + profile danger zone. */
export function AccordionToggle({
  open,
  tone = "teal",
  className = "",
}: {
  open: boolean;
  tone?: "teal" | "danger";
  className?: string;
}) {
  return (
    <span
      className={`toggle-chip tone-${tone} ${open ? "is-open" : ""} ${className}`}
      aria-hidden
    >
      <span className="toggle-chip-bar is-h" />
      <span className="toggle-chip-bar is-v" />
    </span>
  );
}
