'use client';

/** Original educational SVG: underbust vs fullest-bust tape placement. */
export function BraMeasureDiagram() {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        How to measure
      </p>
      <svg
        viewBox="0 0 320 160"
        className="h-auto w-full max-w-full"
        role="img"
        aria-label="Educational diagram: underbust tape beneath the bust and bust tape around the fullest part, shown on a simple torso outline."
      >
        {/* Left: underbust */}
        <text x="70" y="16" textAnchor="middle" fontSize="11" fill="#163c43" fontWeight="600">
          Underbust
        </text>
        <ellipse cx="70" cy="36" rx="14" ry="16" fill="#e8eef0" stroke="#163c43" strokeWidth="1.5" />
        <path
          d="M52 52 C48 70 55 78 58 88 C50 100 48 118 52 130 L52 145 L88 145 L88 130 C92 118 90 100 82 88 C85 78 92 70 88 52 Z"
          fill="#d4e4e8"
          stroke="#163c43"
          strokeWidth="1.5"
        />
        <ellipse
          cx="70"
          cy="92"
          rx="22"
          ry="7"
          fill="none"
          stroke="#c45c6a"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
        <text x="70" y="155" textAnchor="middle" fontSize="9" fill="#163c43">
          Snug under bust
        </text>

        {/* Right: bust */}
        <text x="230" y="16" textAnchor="middle" fontSize="11" fill="#163c43" fontWeight="600">
          Bust
        </text>
        <ellipse cx="230" cy="36" rx="14" ry="16" fill="#e8eef0" stroke="#163c43" strokeWidth="1.5" />
        <path
          d="M212 52 C208 70 215 78 218 88 C210 100 208 118 212 130 L212 145 L248 145 L248 130 C252 118 250 100 242 88 C245 78 252 70 248 52 Z"
          fill="#d4e4e8"
          stroke="#163c43"
          strokeWidth="1.5"
        />
        <ellipse
          cx="230"
          cy="78"
          rx="26"
          ry="10"
          fill="none"
          stroke="#c45c6a"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
        <text x="230" y="155" textAnchor="middle" fontSize="9" fill="#163c43">
          Fullest bust, tape level
        </text>
      </svg>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        Keep the tape parallel to the floor. Do not cinch or leave large slack.
      </p>
    </div>
  );
}
