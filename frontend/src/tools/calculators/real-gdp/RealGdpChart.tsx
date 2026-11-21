'use client';

import type { RealGdpResult } from './types';
import { fromBaseUnits, formatDisplayAmount, magnitudeLabel } from './calculation';

interface RealGdpChartProps {
  result: RealGdpResult;
}

const W = 360;
const H = 200;
const PAD = { l: 40, r: 16, t: 20, b: 44 };

export function RealGdpChart({ result }: RealGdpChartProps) {
  const mag = result.magnitude;
  const nominal = fromBaseUnits(result.nominalBase, mag);
  const real = fromBaseUnits(result.realBase, mag);
  const max = Math.max(nominal, real, 1);
  const chartH = H - PAD.t - PAD.b;
  const barW = 72;
  const gap = 48;
  const startX = PAD.l + 40;

  const bars = [
    {
      label: 'Nominal',
      value: nominal,
      formatted: `${result.currency} ${formatDisplayAmount(nominal)}`,
      className: 'fill-primary/70',
    },
    {
      label: 'Real',
      value: real,
      formatted: `${result.currency} ${formatDisplayAmount(real)}`,
      className: 'fill-teal-600/80',
    },
  ];

  const alt = `Nominal GDP ${bars[0].formatted} ${magnitudeLabel(mag).toLowerCase()} versus Real GDP ${bars[1].formatted} ${magnitudeLabel(mag).toLowerCase()}. Comparison of calculated values only; the gap is not an economic gain or loss.`;

  return (
    <figure className="mt-3">
      <figcaption className="mb-1 text-xs font-medium text-accent">
        Nominal GDP vs. Real GDP
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={alt}
      >
        {bars.map((b, i) => {
          const h = (b.value / max) * chartH;
          const x = startX + i * (barW + gap);
          const y = H - PAD.b - h;
          return (
            <g key={b.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, 1)}
                rx={4}
                className={b.className}
              />
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                className="fill-accent"
                fontSize={10}
              >
                {formatDisplayAmount(b.value)}
              </text>
              <text
                x={x + barW / 2}
                y={H - PAD.b + 16}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={11}
              >
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Same currency and magnitude ({magnitudeLabel(mag).toLowerCase()}). The
        difference reflects price-level adjustment, not a gain or loss.
      </p>
    </figure>
  );
}
