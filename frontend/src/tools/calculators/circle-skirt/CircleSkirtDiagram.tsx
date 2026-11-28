'use client';

import type { CircleSkirtType } from './types';
import { SKIRT_TYPE_LABELS } from './types';

const ANGLES: Record<CircleSkirtType, number> = {
  full: 360,
  threeQuarter: 270,
  half: 180,
  quarter: 90,
};

function sectorPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  deg: number,
): string {
  if (deg >= 360) {
    return [
      `M ${cx} ${cy - rOuter}`,
      `A ${rOuter} ${rOuter} 0 1 1 ${cx - 0.01} ${cy - rOuter}`,
      `L ${cx - 0.01} ${cy - rInner}`,
      `A ${rInner} ${rInner} 0 1 0 ${cx} ${cy - rInner}`,
      'Z',
    ].join(' ');
  }
  const rad = (deg * Math.PI) / 180;
  const large = deg > 180 ? 1 : 0;
  const ox = cx + rOuter * Math.sin(rad);
  const oy = cy - rOuter * Math.cos(rad);
  const ix = cx + rInner * Math.sin(rad);
  const iy = cy - rInner * Math.cos(rad);
  return [
    `M ${cx} ${cy - rOuter}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${ox} ${oy}`,
    `L ${ix} ${iy}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${cx} ${cy - rInner}`,
    'Z',
  ].join(' ');
}

export function CircleSkirtDiagram({
  skirtType,
}: {
  skirtType: CircleSkirtType;
}) {
  const deg = ANGLES[skirtType];
  const cx = 120;
  const cy = 120;
  const rInner = 28;
  const rOuter = 95;

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        {SKIRT_TYPE_LABELS[skirtType]}
      </p>
      <svg
        viewBox="0 0 240 240"
        className="mx-auto h-auto w-full max-w-[220px]"
        role="img"
        aria-label={`Diagram of a ${SKIRT_TYPE_LABELS[skirtType]} showing waist opening, outer hem, waist radius, and skirt length.`}
      >
        <path
          d={sectorPath(cx, cy, rInner, rOuter, deg)}
          fill="#d4e4e8"
          stroke="#163c43"
          strokeWidth="2"
        />
        {/* Radius markers */}
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy - rInner}
          stroke="#c45c6a"
          strokeWidth="1.5"
        />
        <line
          x1={cx}
          y1={cy - rInner}
          x2={cx}
          y2={cy - rOuter}
          stroke="#163c43"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <circle cx={cx} cy={cy} r="2.5" fill="#163c43" />
        <text x={cx + 6} y={cy - rInner / 2} fontSize="9" fill="#c45c6a">
          R
        </text>
        <text
          x={cx + 6}
          y={cy - (rInner + rOuter) / 2}
          fontSize="9"
          fill="#163c43"
        >
          L
        </text>
        <text x={16} y={228} fontSize="10" fill="#163c43">
          {deg}° sector · waist hole + hem
        </text>
      </svg>
    </div>
  );
}
