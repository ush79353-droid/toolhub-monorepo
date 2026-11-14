/** Lightweight rectangular-prism diagram labeling length, width, and height. */
export function PrismIllustration() {
  return (
    <figure
      className="mx-auto w-full max-w-[280px]"
      aria-label="Rectangular prism showing length, width, and height"
    >
      <svg
        viewBox="0 0 280 160"
        className="h-auto w-full text-accent"
        role="img"
        aria-labelledby="prism-title prism-desc"
      >
        <title id="prism-title">Rectangular prism</title>
        <desc id="prism-desc">
          A box outline with length along the bottom front edge, width along the bottom side edge,
          and height along the vertical front edge.
        </desc>
        {/* Back face */}
        <polygon
          points="70,28 210,28 240,52 100,52"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Left face */}
        <polygon
          points="70,28 100,52 100,128 70,104"
          fill="currentColor"
          fillOpacity="0.04"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Front face */}
        <polygon
          points="100,52 240,52 240,128 100,128"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        {/* Length label */}
        <text
          x="170"
          y="148"
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize="11"
          fontFamily="system-ui, sans-serif"
        >
          Length
        </text>
        {/* Width label */}
        <text
          x="52"
          y="78"
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize="11"
          fontFamily="system-ui, sans-serif"
          transform="rotate(-55 52 78)"
        >
          Width
        </text>
        {/* Height label */}
        <text
          x="252"
          y="92"
          textAnchor="start"
          className="fill-muted-foreground"
          fontSize="11"
          fontFamily="system-ui, sans-serif"
        >
          Height
        </text>
      </svg>
    </figure>
  );
}
