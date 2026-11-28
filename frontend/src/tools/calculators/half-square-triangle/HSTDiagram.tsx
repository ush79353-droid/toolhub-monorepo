'use client';

export function HSTDiagram({ blocksPerPair }: { blocksPerPair: number }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        HST layout preview
      </p>
      <svg
        viewBox="0 0 200 120"
        className="mx-auto h-auto w-full max-w-[220px]"
        role="img"
        aria-label={`Conceptual half-square triangle: fabric square with diagonal, stitching lines, and ${blocksPerPair} HST units per pair.`}
      >
        {/* Raw square */}
        <rect
          x="10"
          y="15"
          width="70"
          height="70"
          fill="#d4e4e8"
          stroke="#163c43"
          strokeWidth="1.5"
        />
        <rect
          x="10"
          y="15"
          width="70"
          height="70"
          fill="#c45c6a"
          opacity="0.35"
        />
        {/* Diagonal */}
        <line
          x1="10"
          y1="85"
          x2="80"
          y2="15"
          stroke="#163c43"
          strokeWidth="1.5"
        />
        {/* Stitch lines */}
        <line
          x1="14"
          y1="78"
          x2="73"
          y2="19"
          stroke="#c45c6a"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <line
          x1="19"
          y1="82"
          x2="78"
          y2="23"
          stroke="#c45c6a"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        {/* Finished HSTs */}
        <polygon
          points="100,20 150,20 100,70"
          fill="#d4e4e8"
          stroke="#163c43"
          strokeWidth="1.2"
        />
        <polygon
          points="100,20 150,20 150,70"
          fill="#e8c4c8"
          stroke="#163c43"
          strokeWidth="1.2"
        />
        <polygon
          points="160,20 200,20 160,70"
          fill="#e8c4c8"
          stroke="#163c43"
          strokeWidth="1.2"
        />
        <polygon
          points="160,20 200,20 200,70"
          fill="#d4e4e8"
          stroke="#163c43"
          strokeWidth="1.2"
        />
        <text x="45" y="105" textAnchor="middle" fontSize="8" fill="#163c43">
          Raw square
        </text>
        <text x="150" y="105" textAnchor="middle" fontSize="8" fill="#163c43">
          {blocksPerPair} HST / pair
        </text>
      </svg>
    </div>
  );
}
