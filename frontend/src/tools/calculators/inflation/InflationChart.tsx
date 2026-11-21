'use client';

import type { InflationChartData } from './types';

interface InflationChartProps {
  chart: InflationChartData;
}

const W = 340;
const H = 200;
const PAD = { l: 44, r: 12, t: 14, b: 36 };

export function InflationChart({ chart }: InflationChartProps) {
  if (chart.kind === 'historical-cpi') {
    const { points, referenceYear, targetYear } = chart;
    if (points.length < 2) {
      return (
        <p className="text-xs text-muted-foreground">{chart.note}</p>
      );
    }
    const xs = points.map((p) => p.year);
    const ys = points.map((p) => p.cpi);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys) * 0.95;
    const maxY = Math.max(...ys) * 1.05;
    const mapX = (x: number) =>
      PAD.l + ((x - minX) / (maxX - minX || 1)) * (W - PAD.l - PAD.r);
    const mapY = (y: number) =>
      H - PAD.b - ((y - minY) / (maxY - minY || 1)) * (H - PAD.t - PAD.b);
    const path = points
      .map(
        (p, i) =>
          `${i === 0 ? 'M' : 'L'} ${mapX(p.year)} ${mapY(p.cpi)}`
      )
      .join(' ');
    const ref = points.find((p) => p.year === referenceYear);
    const tgt = points.find((p) => p.year === targetYear);

    return (
      <figure className="space-y-2">
        <figcaption className="text-xs font-medium text-accent">
          CPI trend (annual average)
        </figcaption>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full rounded-xl border border-border bg-white"
          role="img"
          aria-label={`CPI index from ${minX} to ${maxX} with reference ${referenceYear} and target ${targetYear}`}
        >
          <line
            x1={PAD.l}
            y1={H - PAD.b}
            x2={W - PAD.r}
            y2={H - PAD.b}
            className="stroke-border"
            strokeWidth={1.5}
          />
          <line
            x1={PAD.l}
            y1={PAD.t}
            x2={PAD.l}
            y2={H - PAD.b}
            className="stroke-border"
            strokeWidth={1.5}
          />
          <path d={path} fill="none" stroke="#0f766e" strokeWidth={2} />
          {ref ? (
            <circle
              cx={mapX(ref.year)}
              cy={mapY(ref.cpi)}
              r={4}
              fill="#ea580c"
            />
          ) : null}
          {tgt ? (
            <circle
              cx={mapX(tgt.year)}
              cy={mapY(tgt.cpi)}
              r={4}
              fill="#2563eb"
            />
          ) : null}
          <text
            x={(PAD.l + W - PAD.r) / 2}
            y={H - 10}
            textAnchor="middle"
            fontSize={9}
            className="fill-muted-foreground"
          >
            Year
          </text>
          <text
            x={12}
            y={(PAD.t + H - PAD.b) / 2}
            textAnchor="middle"
            fontSize={9}
            className="fill-muted-foreground"
            transform={`rotate(-90 12 ${(PAD.t + H - PAD.b) / 2})`}
          >
            CPI index
          </text>
        </svg>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {chart.note} Orange = reference, blue = target.
        </p>
      </figure>
    );
  }

  const { points } = chart;
  if (points.length < 2) {
    return <p className="text-xs text-muted-foreground">{chart.note}</p>;
  }
  const maxT = Math.max(...points.map((p) => p.yearFraction), 1e-9);
  const maxA = Math.max(
    ...points.flatMap((p) => [p.amount, p.purchasingPower]),
    1e-9
  );
  const mapX = (t: number) =>
    PAD.l + (t / maxT) * (W - PAD.l - PAD.r);
  const mapY = (v: number) =>
    H - PAD.b - (v / maxA) * (H - PAD.t - PAD.b);
  const amountPath = points
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'} ${mapX(p.yearFraction)} ${mapY(p.amount)}`
    )
    .join(' ');
  const ppPath = points
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'} ${mapX(p.yearFraction)} ${mapY(p.purchasingPower)}`
    )
    .join(' ');

  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-medium text-accent">
        Custom inflation projection (estimate)
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label="Projected inflation-adjusted amount and purchasing power remaining over time"
      >
        <line
          x1={PAD.l}
          y1={H - PAD.b}
          x2={W - PAD.r}
          y2={H - PAD.b}
          className="stroke-border"
          strokeWidth={1.5}
        />
        <line
          x1={PAD.l}
          y1={PAD.t}
          x2={PAD.l}
          y2={H - PAD.b}
          className="stroke-border"
          strokeWidth={1.5}
        />
        <path d={amountPath} fill="none" stroke="#0f766e" strokeWidth={2} />
        <path
          d={ppPath}
          fill="none"
          stroke="#ea580c"
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        <text x={W - PAD.r - 4} y={PAD.t + 12} textAnchor="end" fontSize={9} fill="#0f766e">
          Adjusted $
        </text>
        <text x={W - PAD.r - 4} y={PAD.t + 24} textAnchor="end" fontSize={9} fill="#ea580c">
          Purchasing power of $ held
        </text>
        <text
          x={(PAD.l + W - PAD.r) / 2}
          y={H - 10}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
        >
          Years
        </text>
      </svg>
      <p className="text-xs leading-relaxed text-muted-foreground">{chart.note}</p>
    </figure>
  );
}
