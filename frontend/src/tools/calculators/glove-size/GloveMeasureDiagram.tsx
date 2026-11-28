'use client';

export function GloveMeasureDiagram() {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        How to measure
      </p>
      <svg
        viewBox="0 0 160 200"
        className="mx-auto h-auto w-full max-w-[160px]"
        role="img"
        aria-label="Open hand with measuring tape around the palm below the knuckles, excluding the thumb."
      >
        {/* Palm */}
        <ellipse
          cx="78"
          cy="110"
          rx="32"
          ry="40"
          fill="#e8eef0"
          stroke="#163c43"
          strokeWidth="1.4"
        />
        {/* Fingers */}
        <rect x="52" y="48" width="10" height="48" rx="5" fill="#e8eef0" stroke="#163c43" strokeWidth="1.2" />
        <rect x="66" y="40" width="10" height="56" rx="5" fill="#e8eef0" stroke="#163c43" strokeWidth="1.2" />
        <rect x="80" y="38" width="10" height="58" rx="5" fill="#e8eef0" stroke="#163c43" strokeWidth="1.2" />
        <rect x="94" y="46" width="10" height="50" rx="5" fill="#e8eef0" stroke="#163c43" strokeWidth="1.2" />
        {/* Thumb (excluded) */}
        <ellipse
          cx="42"
          cy="105"
          rx="10"
          ry="22"
          transform="rotate(-35 42 105)"
          fill="#e8eef0"
          stroke="#163c43"
          strokeWidth="1.2"
        />
        {/* Measuring tape around palm */}
        <ellipse
          cx="78"
          cy="92"
          rx="36"
          ry="14"
          fill="none"
          stroke="#c45c6a"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />
        <text x="78" y="175" textAnchor="middle" fontSize="9" fill="#163c43">
          Below knuckles · no thumb
        </text>
        <text x="78" y="188" textAnchor="middle" fontSize="8" fill="#64748b">
          Schematic — not a scan
        </text>
      </svg>
    </div>
  );
}
