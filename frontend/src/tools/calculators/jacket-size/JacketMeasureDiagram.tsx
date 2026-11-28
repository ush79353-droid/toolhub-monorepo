'use client';

interface JacketMeasureDiagramProps {
  highlight?: 'height' | 'chest' | 'hips' | null;
}

export function JacketMeasureDiagram({
  highlight = null,
}: JacketMeasureDiagramProps) {
  const chestStroke = highlight === 'chest' ? '#e11d48' : '#163c43';
  const hipStroke = highlight === 'hips' ? '#e11d48' : '#163c43';
  const heightStroke = highlight === 'height' ? '#e11d48' : '#94a3b8';

  return (
    <figure className="rounded-xl border border-border bg-muted/15 p-3">
      <svg
        viewBox="0 0 320 200"
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-labelledby="jacket-measure-title jacket-measure-desc"
      >
        <title id="jacket-measure-title">Body measurement guide for jackets</title>
        <desc id="jacket-measure-desc">
          Front and back silhouettes showing chest circumference, hip
          circumference, and height measurement guides.
        </desc>
        {/* Height guide */}
        <line
          x1="18"
          y1="20"
          x2="18"
          y2="180"
          stroke={heightStroke}
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        <text x="28" y="100" fontSize="10" fill={heightStroke}>
          Height
        </text>

        {/* Front silhouette */}
        <ellipse cx="100" cy="40" rx="18" ry="22" fill="#f1f5f9" stroke="#163c43" strokeWidth="2" />
        <path
          d="M82 60 Q100 58 118 60 L125 120 Q100 130 75 120 Z"
          fill="#f8fafc"
          stroke="#163c43"
          strokeWidth="2"
        />
        <path d="M88 120 L85 175 M112 120 L115 175" fill="none" stroke="#163c43" strokeWidth="2" />
        <ellipse
          cx="100"
          cy="78"
          rx="28"
          ry="10"
          fill="none"
          stroke={chestStroke}
          strokeWidth={highlight === 'chest' ? 3 : 2}
          strokeDasharray="5 3"
        />
        <text x="100" y="195" textAnchor="middle" fontSize="11" fontWeight="600" fill="#163c43">
          Front · chest
        </text>
        <text x="140" y="78" fontSize="10" fill={chestStroke}>
          Chest
        </text>

        {/* Back silhouette */}
        <ellipse cx="230" cy="40" rx="18" ry="22" fill="#f1f5f9" stroke="#163c43" strokeWidth="2" />
        <path
          d="M212 60 Q230 58 248 60 L255 120 Q230 130 205 120 Z"
          fill="#f8fafc"
          stroke="#163c43"
          strokeWidth="2"
        />
        <path d="M218 120 L215 175 M242 120 L245 175" fill="none" stroke="#163c43" strokeWidth="2" />
        <ellipse
          cx="230"
          cy="115"
          rx="30"
          ry="11"
          fill="none"
          stroke={hipStroke}
          strokeWidth={highlight === 'hips' ? 3 : 2}
          strokeDasharray="5 3"
        />
        <text x="230" y="195" textAnchor="middle" fontSize="11" fontWeight="600" fill="#163c43">
          Back · hips
        </text>
        <text x="270" y="115" fontSize="10" fill={hipStroke}>
          Hips
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        Measure chest around the fullest part — not flat garment width.
      </figcaption>
    </figure>
  );
}
