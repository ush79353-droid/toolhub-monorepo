'use client';

import type { MoneySupplyResult } from './types';

interface MoneySupplyChartProps {
  result: MoneySupplyResult;
}

const W = 360;
const H = 210;
const PAD = { l: 36, r: 12, t: 16, b: 48 };

export function MoneySupplyChart({ result }: MoneySupplyChartProps) {
  const bars = result.chartAggregates;
  const max = Math.max(...bars.map((b) => b.value), 1);
  const chartH = H - PAD.t - PAD.b;
  const gap = 8;
  const barW = Math.min(
    36,
    (W - PAD.l - PAD.r - gap * (bars.length - 1)) / bars.length
  );

  const m1Total = Math.max(
    result.m1Parts.reduce((s, p) => s + p.value, 0),
    1
  );

  return (
    <div className="space-y-3">
      <figure>
        <figcaption className="mb-1 text-xs font-medium text-accent">
          Monetary aggregates comparison
        </figcaption>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full rounded-xl border border-border bg-white"
          role="img"
          aria-label={bars
            .map((b) => `${b.label} ${b.formatted}`)
            .join(', ')}
        >
          {bars.map((b, i) => {
            const h = (b.value / max) * chartH;
            const x = PAD.l + i * (barW + gap);
            const y = H - PAD.b - h;
            return (
              <g key={b.label}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={Math.max(h, 1)}
                  rx={3}
                  className="fill-primary/80"
                />
                <text
                  x={x + barW / 2}
                  y={H - PAD.b + 14}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize={10}
                >
                  {b.label}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-1 text-[11px] text-muted-foreground">
          MB is not assumed to sit in a strictly increasing M0–M4 sequence.
        </p>
      </figure>

      <figure>
        <figcaption className="mb-1 text-xs font-medium text-accent">
          M1 composition · monetary base split
        </figcaption>
        <svg
          viewBox="0 0 360 120"
          className="h-auto w-full rounded-xl border border-border bg-white"
          role="img"
          aria-label={`M1 ${result.formattedM1}; base ${result.formattedMb}`}
        >
          {(() => {
            let x = 12;
            const colors = [
              '#0f766e',
              '#14b8a6',
              '#5eead4',
              '#99f6e4',
              '#ccfbf1',
            ];
            return result.m1Parts.map((p, i) => {
              const w = Math.max((p.value / m1Total) * 220, p.value > 0 ? 2 : 0);
              const el = (
                <rect
                  key={p.label}
                  x={x}
                  y={20}
                  width={w}
                  height={28}
                  className="stroke-white"
                  strokeWidth={1}
                  fill={colors[i % colors.length]}
                />
              );
              x += w;
              return el;
            });
          })()}
          <text x={12} y={66} className="fill-accent" fontSize={10}>
            M1 stacked components (nonoverlapping)
          </text>
          {(() => {
            const base = Math.max(result.monetaryBase, 1);
            const cw =
              (result.mbParts[0]!.value / base) * 220;
            return (
              <>
                <rect
                  x={12}
                  y={78}
                  width={Math.max(cw, 1)}
                  height={20}
                  rx={2}
                  className="fill-amber-500/80"
                />
                <rect
                  x={12 + Math.max(cw, 1)}
                  y={78}
                  width={Math.max(220 - cw, 1)}
                  height={20}
                  rx={2}
                  className="fill-orange-700/70"
                />
                <text x={12} y={112} className="fill-muted-foreground" fontSize={10}>
                  MB: currency vs reserves
                </text>
              </>
            );
          })()}
        </svg>
      </figure>
    </div>
  );
}
