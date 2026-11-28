'use client';

/** Original SVG — head circumference measuring guide (front + side). */
export function HatMeasureDiagram() {
  return (
    <figure className="rounded-xl border border-border bg-muted/15 p-3">
      <svg
        viewBox="0 0 320 160"
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-labelledby="hat-measure-title hat-measure-desc"
      >
        <title id="hat-measure-title">How to measure head circumference</title>
        <desc id="hat-measure-desc">
          Front and side views of a head with a measuring tape above the
          eyebrows and ears, around the fullest part of the head.
        </desc>
        {/* Front */}
        <ellipse cx="80" cy="78" rx="42" ry="52" fill="#f8fafc" stroke="#163c43" strokeWidth="2" />
        <ellipse cx="80" cy="78" rx="42" ry="52" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="4 3" />
        <circle cx="66" cy="72" r="3" fill="#163c43" />
        <circle cx="94" cy="72" r="3" fill="#163c43" />
        <path d="M68 96 Q80 104 92 96" fill="none" stroke="#163c43" strokeWidth="1.5" />
        <text x="80" y="148" textAnchor="middle" className="fill-accent" fontSize="11" fontWeight="600">
          Front
        </text>
        <text x="80" y="22" textAnchor="middle" className="fill-rose-600" fontSize="10">
          Above eyebrows
        </text>
        {/* Side */}
        <ellipse cx="230" cy="78" rx="48" ry="52" fill="#f8fafc" stroke="#163c43" strokeWidth="2" />
        <path
          d="M200 70 Q230 55 260 70 Q265 90 250 110 Q230 125 210 110 Q195 90 200 70"
          fill="none"
          stroke="#e11d48"
          strokeWidth="2.5"
          strokeDasharray="4 3"
        />
        <line x1="198" y1="88" x2="205" y2="88" stroke="#163c43" strokeWidth="2" />
        <text x="230" y="148" textAnchor="middle" className="fill-accent" fontSize="11" fontWeight="600">
          Side
        </text>
        <text x="230" y="22" textAnchor="middle" className="fill-rose-600" fontSize="10">
          Above ears · fullest back
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        Wrap a soft tape level around the widest part of the head — snug, not
        tight.
      </figcaption>
    </figure>
  );
}
