'use client';

interface CompressionRatioDiagramProps {
  staticCR: number | null;
  hasGeometry: boolean;
}

/** Illustrative SVG — not to scale. */
export function CompressionRatioDiagram({
  staticCR,
  hasGeometry,
}: CompressionRatioDiagramProps) {
  return (
    <div
      className="space-y-2"
      role="img"
      aria-label="Illustrative engine cylinder showing swept volume between TDC and BDC and clearance volume at TDC"
    >
      <h4 className="text-sm font-semibold text-accent">
        Cylinder Geometry (illustrative)
      </h4>
      <svg viewBox="0 0 280 260" className="mx-auto h-auto w-full max-w-xs">
        {/* Block */}
        <rect
          x="70"
          y="40"
          width="140"
          height="180"
          fill="#f8fafc"
          stroke="#163C43"
          strokeWidth="2"
          rx="4"
        />
        {/* Head / chamber */}
        <path
          d="M80 40 Q140 10 200 40"
          fill="#e0f2f1"
          stroke="#087E8B"
          strokeWidth="2"
        />
        <text x="140" y="28" textAnchor="middle" fontSize="9" fill="#087E8B">
          Chamber (Vc)
        </text>
        {/* Piston */}
        <rect
          x="85"
          y="100"
          width="110"
          height="28"
          fill="#087E8B"
          opacity="0.85"
          rx="2"
        />
        <text
          x="140"
          y="118"
          textAnchor="middle"
          fontSize="9"
          fill="#fff"
        >
          Piston
        </text>
        {/* Stroke arrow */}
        <line
          x1="230"
          y1="100"
          x2="230"
          y2="200"
          stroke="#163C43"
          strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
        <defs>
          <marker
            id="arrow"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#163C43" />
          </marker>
        </defs>
        <text x="238" y="155" fontSize="9" fill="#163C43">
          Stroke (L)
        </text>
        <text x="140" y="160" textAnchor="middle" fontSize="9" fill="#64748b">
          Swept volume (Vs)
        </text>
        <text x="78" y="95" fontSize="8" fill="#64748b">
          TDC
        </text>
        <text x="78" y="210" fontSize="8" fill="#64748b">
          BDC
        </text>
        <text x="140" y="248" textAnchor="middle" fontSize="10" fill="#163C43">
          {hasGeometry && staticCR != null
            ? `CR ≈ ${staticCR.toFixed(2)} : 1`
            : 'Enter bore & stroke'}
        </text>
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Diagram is schematic and not drawn to scale.
      </p>
    </div>
  );
}
