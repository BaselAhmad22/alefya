type Props = {
  size?: number;
  className?: string;
  priority?: boolean;
  /** Override mark: v1–v6 */
  variant?: "v1" | "v2" | "v3" | "v4" | "v5" | "v6";
};

/**
 * AlefYa mark — professional SVG from logo-generator-skill patterns.
 * Default: V1 Path Nodes (learning journey Alef → Ya).
 * No decorative corner squares.
 */
export function BrandLogo({
  size = 36,
  className = "",
  variant = "v1",
}: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-sm bg-[#0c0f14] text-[#e8a54b] ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <Mark variant={variant} size={Math.round(size * 0.72)} />
    </span>
  );
}

function Mark({
  variant,
  size,
}: {
  variant: NonNullable<Props["variant"]>;
  size: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
    className: "block",
  };

  switch (variant) {
    case "v2":
      return (
        <svg {...common} fill="none">
          <path
            d="M22 78 A28 28 0 0 1 78 78"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M32 78 A18 18 0 0 1 68 78"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="50" cy="42" r="7" fill="currentColor" />
          <circle cx="22" cy="78" r="4" fill="currentColor" />
          <circle cx="78" cy="78" r="4" fill="currentColor" />
        </svg>
      );
    case "v3":
      return (
        <svg {...common} fill="currentColor">
          <circle cx="34" cy="52" r="16" />
          <circle cx="66" cy="48" r="12" />
          <circle cx="58" cy="66" r="7" />
        </svg>
      );
    case "v4":
      return (
        <svg {...common} fill="currentColor">
          <circle cx="50" cy="38" r="3.2" />
          <circle cx="61.5" cy="44.5" r="3.2" />
          <circle cx="61.5" cy="57.5" r="3.2" />
          <circle cx="50" cy="64" r="3.2" />
          <circle cx="38.5" cy="57.5" r="3.2" />
          <circle cx="38.5" cy="44.5" r="3.2" />
          <circle cx="50" cy="24" r="2.4" />
          <circle cx="63" cy="27.5" r="2.4" />
          <circle cx="72.5" cy="37" r="2.4" />
          <circle cx="76" cy="50" r="2.4" />
          <circle cx="72.5" cy="63" r="2.4" />
          <circle cx="63" cy="72.5" r="2.4" />
          <circle cx="50" cy="76" r="2.4" />
          <circle cx="37" cy="72.5" r="2.4" />
          <circle cx="27.5" cy="63" r="2.4" />
          <circle cx="24" cy="50" r="2.4" />
          <circle cx="27.5" cy="37" r="2.4" />
          <circle cx="37" cy="27.5" r="2.4" />
          <circle
            cx="50"
            cy="50"
            r="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      );
    case "v5":
      return (
        <svg {...common} fill="none">
          <path
            d="M24 72 H48 V56 H64 V40 H80"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="72" r="5" fill="currentColor" />
          <circle cx="48" cy="56" r="5" fill="currentColor" />
          <circle cx="64" cy="40" r="5" fill="currentColor" />
          <circle cx="80" cy="40" r="6.5" fill="currentColor" />
        </svg>
      );
    case "v6":
      return (
        <svg {...common}>
          <defs>
            <mask id="ay-cut">
              <rect width="100" height="100" fill="white" />
              <circle cx="58" cy="46" r="14" fill="black" />
              <circle cx="42" cy="58" r="9" fill="black" />
            </mask>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="currentColor"
            mask="url(#ay-cut)"
          />
          <circle cx="58" cy="46" r="5" fill="currentColor" />
        </svg>
      );
    case "v1":
    default:
      return (
        <svg {...common} fill="none" role="img" aria-label="AlefYa">
          <title>AlefYa</title>
          <path
            d="M18 68 C34 68, 40 32, 50 32 C60 32, 66 68, 82 68"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="18" cy="68" r="5.5" fill="currentColor" />
          <circle cx="50" cy="32" r="6.5" fill="currentColor" />
          <circle cx="82" cy="68" r="5.5" fill="currentColor" />
        </svg>
      );
  }
}
