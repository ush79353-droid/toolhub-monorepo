'use client';

import { fmt } from './calculation';
import type { LengthUnit } from './types';
import { convertCmToLength } from './calculation';

export function CrossStitchDiagram({
  finishedWidthCm,
  finishedHeightCm,
  fabricWidthCm,
  fabricHeightCm,
  unit,
}: {
  finishedWidthCm: number;
  finishedHeightCm: number;
  fabricWidthCm: number;
  fabricHeightCm: number;
  unit: LengthUnit;
}) {
  const max = 200;
  const scale = Math.min(
    max / Math.max(fabricWidthCm, 1),
    max / Math.max(fabricHeightCm, 1),
  );
  const fw = fabricWidthCm * scale;
  const fh = fabricHeightCm * scale;
  const ew = finishedWidthCm * scale;
  const eh = finishedHeightCm * scale;
  const ox = (240 - fw) / 2;
  const oy = (220 - fh) / 2;
  const ix = ox + (fw - ew) / 2;
  const iy = oy + (fh - eh) / 2;

  const lab = (cm: number) =>
    `${fmt(convertCmToLength(cm, unit), 1)} ${unit}`;

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="mb-2 text-[13px] font-semibold text-accent">
        Fabric vs embroidery area
      </p>
      <svg
        viewBox="0 0 240 230"
        className="mx-auto h-auto w-full max-w-[240px]"
        role="img"
        aria-label={`Fabric rectangle ${lab(fabricWidthCm)} by ${lab(fabricHeightCm)} with inner embroidery ${lab(finishedWidthCm)} by ${lab(finishedHeightCm)}.`}
      >
        <rect
          x={ox}
          y={oy}
          width={fw}
          height={fh}
          fill="#e8eef0"
          stroke="#163c43"
          strokeWidth="1.5"
        />
        <rect
          x={ix}
          y={iy}
          width={Math.max(ew, 1)}
          height={Math.max(eh, 1)}
          fill="#d4e4e8"
          stroke="#c45c6a"
          strokeWidth="1.5"
        />
        <text x={120} y={14} textAnchor="middle" fontSize="9" fill="#163c43">
          Cut {lab(fabricWidthCm)} × {lab(fabricHeightCm)}
        </text>
        <text x={120} y={224} textAnchor="middle" fontSize="9" fill="#c45c6a">
          Design {lab(finishedWidthCm)} × {lab(finishedHeightCm)}
        </text>
      </svg>
    </div>
  );
}
