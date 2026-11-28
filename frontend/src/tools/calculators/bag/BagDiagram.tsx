'use client';

interface BagDiagramProps {
  boxCorners: boolean;
}

/** Schematic tote — not a pattern draft. */
export function BagDiagram({ boxCorners }: BagDiagramProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        Bag dimensions (schematic)
      </p>
      <svg
        viewBox="0 0 220 200"
        className="mx-auto h-auto w-full max-w-[220px]"
        role="img"
        aria-label={
          boxCorners
            ? 'Schematic boxed-corner tote with height, width, and depth markers.'
            : 'Schematic flat tote with height and width markers.'
        }
      >
        {/* Front panel */}
        <path
          d={
            boxCorners
              ? 'M55 40 H165 L175 55 V155 H45 V55 Z'
              : 'M50 40 H170 V155 H50 Z'
          }
          fill="#f1f5f9"
          stroke="#163c43"
          strokeWidth="2"
        />
        {/* Handles */}
        <path
          d="M75 40 Q75 18 95 18 Q110 18 110 40"
          fill="none"
          stroke="#163c43"
          strokeWidth="2"
        />
        <path
          d="M110 40 Q110 18 125 18 Q145 18 145 40"
          fill="none"
          stroke="#163c43"
          strokeWidth="2"
        />
        {boxCorners ? (
          <>
            <path
              d="M45 155 L55 170 H165 L175 155"
              fill="#e2e8f0"
              stroke="#163c43"
              strokeWidth="1.5"
            />
            <text x="100" y="188" className="fill-accent text-[9px]">
              depth (d)
            </text>
            <line
              x1="175"
              y1="55"
              x2="195"
              y2="55"
              stroke="#64748b"
              strokeWidth="1"
            />
            <line
              x1="195"
              y1="55"
              x2="195"
              y2="155"
              stroke="#0d9488"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
            <text x="198" y="110" className="fill-teal-800 text-[9px]">
              d
            </text>
          </>
        ) : null}
        {/* Height marker */}
        <line
          x1="30"
          y1="40"
          x2="30"
          y2="155"
          stroke="#0d9488"
          strokeWidth="1.5"
        />
        <text x="8" y="105" className="fill-teal-800 text-[9px]">
          h
        </text>
        {/* Width marker */}
        <line
          x1="55"
          y1="175"
          x2={boxCorners ? 165 : 170}
          y2="175"
          stroke="#0d9488"
          strokeWidth="1.5"
        />
        <text x="100" y="192" className="fill-teal-800 text-[9px]">
          {boxCorners ? 'w' : 'width (w)'}
        </text>
        {!boxCorners ? (
          <text x="60" y="188" className="fill-muted-foreground text-[8px]">
            flat fold · depth unused
          </text>
        ) : null}
      </svg>
    </div>
  );
}
