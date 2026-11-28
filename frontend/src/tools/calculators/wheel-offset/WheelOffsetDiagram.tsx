'use client';

import type { WheelOffsetResult } from './types';
import { fmt } from './calculation';

interface WheelOffsetDiagramProps {
  result: WheelOffsetResult;
}

/**
 * Side-view schematic: hub plane at x=0, +x toward fender (outer), −x toward suspension (inner).
 * Positions use calculated I/O extents in mm, scaled to viewBox.
 */
export function WheelOffsetDiagram({ result }: WheelOffsetDiagramProps) {
  const hubX = 180;
  const yCur = 55;
  const yNew = 115;
  const halfH = 18;

  const extents = [
    result.currentInnerPositionMm,
    result.currentOuterPositionMm,
    result.newInnerPositionMm,
    result.newOuterPositionMm,
  ];
  const maxExt = Math.max(40, ...extents.map((v) => Math.abs(v)));
  const scale = 120 / maxExt;

  const toX = (outerPositive: number) => hubX + outerPositive * scale;
  // Inner extent is toward suspension (−x); outer toward fender (+x)
  const curInnerX = toX(-result.currentInnerPositionMm);
  const curOuterX = toX(result.currentOuterPositionMm);
  const newInnerX = toX(-result.newInnerPositionMm);
  const newOuterX = toX(result.newOuterPositionMm);

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        Wheel position comparison
      </p>
      <svg
        viewBox="0 0 360 170"
        className="h-auto w-full max-w-full"
        role="img"
        aria-label={`Hub-plane diagram. Clearance change ${result.clearanceDisplay}. Position change ${result.positionDisplay}.`}
      >
        <text x="12" y="14" className="fill-muted-foreground text-[9px]">
          ← Suspension (inner)
        </text>
        <text x="248" y="14" className="fill-muted-foreground text-[9px]">
          Fender (outer) →
        </text>

        {/* Hub mounting plane */}
        <line
          x1={hubX}
          y1={28}
          x2={hubX}
          y2={150}
          stroke="#163c43"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text
          x={hubX + 4}
          y={40}
          className="fill-accent text-[8px]"
        >
          Hub plane
        </text>

        {/* Current wheel */}
        <rect
          x={Math.min(curInnerX, curOuterX)}
          y={yCur - halfH}
          width={Math.abs(curOuterX - curInnerX)}
          height={halfH * 2}
          fill="#94a3b8"
          fillOpacity="0.35"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        <line
          x1={(curInnerX + curOuterX) / 2}
          y1={yCur - halfH}
          x2={(curInnerX + curOuterX) / 2}
          y2={yCur + halfH}
          stroke="#475569"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <text x="12" y={yCur + 4} className="fill-slate-600 text-[9px]">
          Current
        </text>

        {/* New wheel */}
        <rect
          x={Math.min(newInnerX, newOuterX)}
          y={yNew - halfH}
          width={Math.abs(newOuterX - newInnerX)}
          height={halfH * 2}
          fill="#0d9488"
          fillOpacity="0.3"
          stroke="#0f766e"
          strokeWidth="1.5"
        />
        <line
          x1={(newInnerX + newOuterX) / 2}
          y1={yNew - halfH}
          x2={(newInnerX + newOuterX) / 2}
          y2={yNew + halfH}
          stroke="#0f766e"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <text x="12" y={yNew + 4} className="fill-teal-800 text-[9px]">
          New
        </text>

        <text x="12" y="162" className="fill-muted-foreground text-[8px]">
          C {result.clearanceDisplay} · P {result.positionDisplay} · scale ≈{' '}
          {fmt(scale, 2)} px/mm
        </text>
      </svg>
    </div>
  );
}
