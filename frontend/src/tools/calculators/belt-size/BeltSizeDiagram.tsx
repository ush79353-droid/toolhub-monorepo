'use client';

/** Schematic: measure buckle fastening point → used hole (not overall length). */
export function BeltSizeDiagram() {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        How to measure an existing belt
      </p>
      <svg
        viewBox="0 0 320 120"
        className="h-auto w-full max-w-full"
        role="img"
        aria-label="Schematic belt: measure from buckle fastening point to the hole you use, not the overall tip-to-tip length."
      >
        {/* Strap */}
        <rect
          x="40"
          y="48"
          width="240"
          height="18"
          rx="3"
          fill="#c4a574"
          stroke="#163c43"
          strokeWidth="1.5"
        />
        {/* Buckle */}
        <rect
          x="20"
          y="42"
          width="28"
          height="30"
          rx="2"
          fill="none"
          stroke="#163c43"
          strokeWidth="2.5"
        />
        <line
          x1="34"
          y1="42"
          x2="34"
          y2="72"
          stroke="#163c43"
          strokeWidth="2"
        />
        {/* Prong / fastening point */}
        <circle cx="48" cy="57" r="3" fill="#163c43" />
        <text x="42" y="38" className="fill-accent text-[8px]">
          fastening
        </text>
        {/* Holes */}
        {[170, 190, 210, 230, 250].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy="57"
            r="3.5"
            fill={i === 2 ? '#0d9488' : '#fff'}
            stroke="#163c43"
            strokeWidth="1.2"
          />
        ))}
        <text x="200" y="40" className="fill-teal-800 text-[8px]">
          used hole
        </text>
        {/* Measure line */}
        <line
          x1="48"
          y1="88"
          x2="210"
          y2="88"
          stroke="#0d9488"
          strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
        <line x1="48" y1="82" x2="48" y2="94" stroke="#0d9488" strokeWidth="1" />
        <line
          x1="210"
          y1="82"
          x2="210"
          y2="94"
          stroke="#0d9488"
          strokeWidth="1"
        />
        <text x="95" y="108" className="fill-teal-800 text-[9px]">
          Measure this length (nominal)
        </text>
        <text x="230" y="108" className="fill-muted-foreground text-[8px]">
          ≠ overall tip length
        </text>
      </svg>
    </div>
  );
}
