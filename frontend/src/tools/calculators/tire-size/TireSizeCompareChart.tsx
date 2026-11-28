'use client';

import { fmt } from './calculation';
import type { TireComparison, TireDimensions } from './types';

interface TireSizeCompareChartProps {
  comparison: TireComparison;
}

function TireCircle({
  tire,
  label,
  cx,
  maxD,
}: {
  tire: TireDimensions;
  label: string;
  cx: number;
  maxD: number;
}) {
  const scale = 70 / maxD;
  const rOuter = (tire.overallDiameterMm / 2) * scale;
  const rRim = (tire.rimDiameterMm / 2) * scale;
  const cy = 95;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={rOuter}
        fill="#e8f0f2"
        stroke="#163c43"
        strokeWidth={2}
      />
      <circle
        cx={cx}
        cy={cy}
        r={rRim}
        fill="#fff"
        stroke="#5b8a94"
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={cy + rOuter + 16}
        textAnchor="middle"
        className="fill-accent"
        style={{ fontSize: 11, fontWeight: 600 }}
      >
        {label}
      </text>
      <text
        x={cx}
        y={cy + rOuter + 30}
        textAnchor="middle"
        className="fill-muted-foreground"
        style={{ fontSize: 10 }}
      >
        {tire.tireCode}
      </text>
      <text
        x={cx}
        y={cy + rOuter + 44}
        textAnchor="middle"
        className="fill-muted-foreground"
        style={{ fontSize: 10 }}
      >
        Ø {fmt(tire.overallDiameterMm, 1)} mm · H {fmt(tire.sidewallHeightMm, 1)}{' '}
        mm
      </text>
    </g>
  );
}

export function TireSizeCompareChart({
  comparison,
}: TireSizeCompareChartProps) {
  const maxD = Math.max(
    comparison.original.overallDiameterMm,
    comparison.replacement.overallDiameterMm,
  );

  return (
    <div
      className="space-y-2"
      role="img"
      aria-label={`Tire size comparison. Original ${comparison.original.tireCode}, replacement ${comparison.replacement.tireCode}. Diameter difference ${fmt(comparison.diameterDifferencePercent, 2)} percent.`}
    >
      <h4 className="text-sm font-semibold text-accent">
        Tire size comparison
      </h4>
      <p className="text-[11px] text-muted-foreground">
        Circles scaled to theoretical overall diameter (unloaded).
      </p>
      <svg
        viewBox="0 0 360 170"
        className="h-auto w-full max-w-lg mx-auto"
      >
        <TireCircle
          tire={comparison.original}
          label="Original"
          cx={90}
          maxD={maxD}
        />
        <TireCircle
          tire={comparison.replacement}
          label="New"
          cx={270}
          maxD={maxD}
        />
      </svg>
      <p className="text-center text-xs tabular-nums text-accent">
        ΔD {fmt(comparison.diameterDifferenceMm, 2)} mm (
        {fmt(comparison.diameterDifferencePercent, 2)}%)
      </p>
    </div>
  );
}
