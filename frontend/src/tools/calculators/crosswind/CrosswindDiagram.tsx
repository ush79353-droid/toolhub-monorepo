'use client';

import type { CrosswindResult } from './types';
import { fmt } from './calculation';

interface CrosswindDiagramProps {
  result: CrosswindResult;
}

/**
 * Top-down schematic: runway along +Y (nose up = runway heading),
 * wind FROM direction rotated relative to runway.
 */
export function CrosswindDiagram({ result }: CrosswindDiagramProps) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const runwayLen = 110;
  const maxArrow = 70;
  const v = Math.max(result.windSpeedKnots, 1e-6);
  const scale = maxArrow / v;

  // Relative: θ positive → wind from right → arrow from +X in runway frame
  const thetaRad = (result.relativeWindAngleDegrees * Math.PI) / 180;
  // Wind FROM direction in runway frame: 0 = from ahead = −Y
  // Meteorological FROM: angle from runway heading. Wind vector TO = FROM + 180
  const fromAngle = -Math.PI / 2 + thetaRad; // 0 θ → from nose (−Y)
  const windLen = Math.min(maxArrow, result.windSpeedKnots * scale);
  const wx = cx + Math.cos(fromAngle) * windLen;
  const wy = cy + Math.sin(fromAngle) * windLen;

  // signed + = right: draw from right toward center (from +X)
  const crossFromX =
    cx +
    (result.crosswindDirection === 'right'
      ? maxArrow * 0.85
      : result.crosswindDirection === 'left'
        ? -maxArrow * 0.85
        : 0);
  const crossToX = cx;

  const hwLen = result.signedHeadwindKnots * scale;
  const hwFromY =
    result.longitudinalWindType === 'headwind'
      ? cy - Math.abs(hwLen)
      : result.longitudinalWindType === 'tailwind'
        ? cy + Math.abs(hwLen)
        : cy;
  const hwToY = cy;

  const headingLabel =
    result.runwayHeadingDegrees === 0
      ? '360°/0°'
      : `${fmt(result.runwayHeadingDegrees, 0)}°`;

  return (
    <div
      className="space-y-2"
      role="img"
      aria-label={`Runway ${result.runwayNumber} facing ${headingLabel}. Relative wind angle ${fmt(result.relativeWindAngleDegrees, 1)} degrees. Crosswind ${fmt(result.crosswindMagnitudeKnots)} knots ${result.crosswindDirection}. ${result.longitudinalWindType} ${fmt(result.longitudinalWindType === 'tailwind' ? result.tailwindMagnitudeKnots : result.headwindMagnitudeKnots)} knots.`}
    >
      <h4 className="text-sm font-semibold text-accent">
        Runway &amp; wind diagram
      </h4>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto h-auto w-full max-w-xs rounded-xl border border-border bg-white"
      >
        <defs>
          <marker
            id="xw-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#087E8B" />
          </marker>
          <marker
            id="xw-arrow-rose"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#e11d48" />
          </marker>
          <marker
            id="xw-arrow-amber"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#d97706" />
          </marker>
        </defs>

        {/* Runway */}
        <rect
          x={cx - 18}
          y={cy - runwayLen / 2}
          width={36}
          height={runwayLen}
          rx={4}
          fill="#e8eef0"
          stroke="#163C43"
          strokeWidth={1.5}
        />
        <line
          x1={cx}
          y1={cy - runwayLen / 2 + 8}
          x2={cx}
          y2={cy + runwayLen / 2 - 8}
          stroke="#163C43"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        {/* Nose triangle */}
        <polygon
          points={`${cx},${cy - runwayLen / 2 + 4} ${cx - 8},${cy - runwayLen / 2 + 22} ${cx + 8},${cy - runwayLen / 2 + 22}`}
          fill="#163C43"
        />
        <text
          x={cx}
          y={cy + runwayLen / 2 + 16}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={10}
        >
          RWY {result.runwayNumber} · {headingLabel}
        </text>

        {/* Wind FROM arrow */}
        <line
          x1={wx}
          y1={wy}
          x2={cx}
          y2={cy}
          stroke="#087E8B"
          strokeWidth={2.5}
          markerEnd="url(#xw-arrow)"
        />
        <text
          x={wx}
          y={wy - 8}
          textAnchor="middle"
          fill="#087E8B"
          fontSize={10}
          fontWeight={600}
        >
          Wind
        </text>

        {/* Crosswind component */}
        {result.crosswindDirection !== 'none' ? (
          <line
            x1={crossFromX}
            y1={cy}
            x2={crossToX}
            y2={cy}
            stroke="#e11d48"
            strokeWidth={2}
            markerEnd="url(#xw-arrow-rose)"
          />
        ) : null}

        {/* Head/tail component */}
        {result.longitudinalWindType !== 'none' ? (
          <line
            x1={cx}
            y1={hwFromY}
            x2={cx}
            y2={hwToY}
            stroke="#d97706"
            strokeWidth={2}
            markerEnd="url(#xw-arrow-amber)"
          />
        ) : null}

        <text x={12} y={20} fill="#087E8B" fontSize={9}>
          Wind from {fmt(result.windDirectionMagneticDegrees, 0)}°
        </text>
        <text x={12} y={34} fill="#e11d48" fontSize={9}>
          Cross {fmt(result.crosswindMagnitudeKnots)} kt{' '}
          {result.crosswindDirection}
        </text>
        <text x={12} y={48} fill="#d97706" fontSize={9}>
          {result.longitudinalWindType === 'tailwind'
            ? `Tail ${fmt(result.tailwindMagnitudeKnots)} kt`
            : result.longitudinalWindType === 'headwind'
              ? `Head ${fmt(result.headwindMagnitudeKnots)} kt`
              : 'No head/tail'}
        </text>
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Schematic only. Blue = wind FROM; rose = crosswind; amber =
        head/tail. Positive crosswind = from the right.
      </p>
    </div>
  );
}
