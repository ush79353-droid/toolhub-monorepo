'use client';

import type { BikiniBodyShape } from './types';

/** Simple educational silhouette — non-sexualized flat SVG by shape. */
export function BikiniShapeIllustration({
  shape,
  className = '',
}: {
  shape: BikiniBodyShape | null;
  className?: string;
}) {
  const key = shape ?? 'mixed';
  const label = shape ?? 'measurement guide';

  return (
    <div className={`rounded-xl border border-border bg-muted/20 p-3 ${className}`}>
      <p className="mb-2 text-[13px] font-semibold text-accent">
        {shape
          ? `Shape sketch: ${label.replace(/-/g, ' ')}`
          : 'How to measure'}
      </p>
      <svg
        viewBox="0 0 160 220"
        className="mx-auto h-auto w-full max-w-[140px]"
        role="img"
        aria-label={
          shape
            ? `Educational silhouette illustrating ${label} proportions`
            : 'Silhouette with bust, waist, high-hip, and hip measurement bands'
        }
      >
        <ellipse cx="80" cy="28" rx="18" ry="20" fill="#e8eef0" stroke="#163c43" strokeWidth="2" />
        <path
          d={pathFor(key)}
          fill="#d4e4e8"
          stroke="#163c43"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {!shape ? (
          <>
            <line x1="40" y1="72" x2="120" y2="72" stroke="#c45c6a" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="48" y1="100" x2="112" y2="100" stroke="#c45c6a" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="44" y1="120" x2="116" y2="120" stroke="#c45c6a" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="42" y1="145" x2="118" y2="145" stroke="#c45c6a" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="122" y="75" fontSize="8" fill="#163c43">
              Bust
            </text>
            <text x="122" y="103" fontSize="8" fill="#163c43">
              Waist
            </text>
            <text x="122" y="123" fontSize="8" fill="#163c43">
              High hip
            </text>
            <text x="122" y="148" fontSize="8" fill="#163c43">
              Hip
            </text>
          </>
        ) : null}
      </svg>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        Illustrative proportions only — not a beauty standard.
      </p>
    </div>
  );
}

function pathFor(shape: BikiniBodyShape | 'mixed'): string {
  // Torso outline from neck (y=48) to legs start (y=200). Vary mid/hip widths.
  switch (shape) {
    case 'hourglass':
      return 'M62 48 C58 70 70 78 72 88 C55 95 52 110 58 120 C52 135 48 155 55 170 L55 200 L105 200 L105 170 C112 155 108 135 102 120 C108 110 105 95 88 88 C90 78 102 70 98 48 Z';
    case 'top-hourglass':
      return 'M58 48 C52 68 68 76 74 86 C50 94 48 112 56 122 C54 138 52 155 58 170 L58 200 L102 200 L102 170 C108 155 106 138 104 122 C112 112 110 94 90 86 C94 76 108 68 102 48 Z';
    case 'bottom-hourglass':
      return 'M64 48 C60 70 72 78 74 88 C60 96 58 112 62 122 C48 138 42 158 50 172 L50 200 L110 200 L110 172 C118 158 112 138 98 122 C102 112 100 96 86 88 C88 78 100 70 96 48 Z';
    case 'spoon':
      return 'M64 48 C60 70 72 80 74 90 C62 98 60 112 64 120 C50 130 40 150 48 168 L48 200 L112 200 L112 168 C120 150 110 130 96 120 C100 112 98 98 86 90 C88 80 100 70 96 48 Z';
    case 'triangle':
      return 'M66 48 C62 70 74 80 76 90 C68 100 66 114 68 124 C52 140 44 160 50 175 L50 200 L110 200 L110 175 C116 160 108 140 92 124 C94 114 92 100 84 90 C86 80 98 70 94 48 Z';
    case 'inverted-triangle':
      return 'M56 48 C48 68 66 76 72 86 C46 94 44 110 54 122 C56 138 58 155 62 170 L62 200 L98 200 L98 170 C102 155 104 138 106 122 C116 110 114 94 92 86 C96 76 112 68 104 48 Z';
    case 'rectangle':
      return 'M64 48 C60 70 70 82 72 92 C62 100 60 115 62 128 C60 145 58 162 60 175 L60 200 L100 200 L100 175 C102 162 100 145 98 128 C100 115 98 100 88 92 C90 82 100 70 96 48 Z';
    default:
      return 'M64 48 C58 70 70 80 74 90 C58 98 56 115 60 128 C56 145 54 162 58 175 L58 200 L102 200 L102 175 C106 162 104 145 100 128 C104 115 102 98 86 90 C90 80 102 70 96 48 Z';
  }
}
