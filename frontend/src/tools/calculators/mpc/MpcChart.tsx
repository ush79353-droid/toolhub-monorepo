'use client';

import type { MpcResult } from './types';

interface MpcChartProps {
  result: MpcResult;
  showIncomeEqualsSpendingLine: boolean;
}

const W = 360;
const H = 220;
const PAD = { l: 48, r: 14, t: 16, b: 40 };

export function MpcChart({
  result,
  showIncomeEqualsSpendingLine,
}: MpcChartProps) {
  const points = result.curvePoints;
  if (points.length < 2) return null;

  const maxX = Math.max(...points.map((p) => p.disposableIncome), 1);
  const maxY = Math.max(
    ...points.map((p) => p.consumerSpending),
    result.currentPoint?.consumerSpending ?? 0,
    maxX,
    1
  );

  const xScale = (x: number) => PAD.l + (x / maxX) * (W - PAD.l - PAD.r);
  const yScale = (y: number) =>
    H - PAD.b - (y / maxY) * (H - PAD.t - PAD.b);

  const linePath = points
    .map((p, i) => {
      const cmd = i === 0 ? 'M' : 'L';
      return `${cmd} ${xScale(p.disposableIncome)} ${yScale(p.consumerSpending)}`;
    })
    .join(' ');

  const interceptY = yScale(result.autonomousConsumption);
  const current = result.currentPoint;

  return (
    <figure className="space-y-1">
      <figcaption className="text-xs font-medium text-accent">
        Consumption Function
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`Consumption function C = ${result.formattedAutonomous} + ${result.formattedMpc} × Yd. At disposable income ${result.formattedDisposableIncome}, consumer spending is ${result.formattedConsumerSpending}.`}
      >
        {/* axes */}
        <line
          x1={PAD.l}
          y1={H - PAD.b}
          x2={W - PAD.r}
          y2={H - PAD.b}
          className="stroke-border"
          strokeWidth={1}
        />
        <line
          x1={PAD.l}
          y1={PAD.t}
          x2={PAD.l}
          y2={H - PAD.b}
          className="stroke-border"
          strokeWidth={1}
        />
        <text
          x={W / 2}
          y={H - 8}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={10}
        >
          Disposable income
        </text>
        <text
          x={12}
          y={H / 2}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={10}
          transform={`rotate(-90 12 ${H / 2})`}
        >
          Consumer spending
        </text>

        {showIncomeEqualsSpendingLine ? (
          <line
            x1={xScale(0)}
            y1={yScale(0)}
            x2={xScale(Math.min(maxX, maxY))}
            y2={yScale(Math.min(maxX, maxY))}
            className="stroke-amber-500/70"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        ) : null}

        <path
          d={linePath}
          fill="none"
          className="stroke-primary"
          strokeWidth={2.5}
        />

        {/* intercept */}
        <circle
          cx={xScale(0)}
          cy={interceptY}
          r={4}
          className="fill-teal-700"
        />
        <title>{`Autonomous consumption ${result.formattedAutonomous}`}</title>

        {current ? (
          <circle
            cx={xScale(current.disposableIncome)}
            cy={yScale(current.consumerSpending)}
            r={5}
            className="fill-rose-500"
          >
            <title>{`Yd ${result.formattedDisposableIncome}, C ${result.formattedConsumerSpending}`}</title>
          </circle>
        ) : null}
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Teal: autonomous intercept · Red: current (Yd, C)
        {showIncomeEqualsSpendingLine ? ' · Amber dashed: C = Yd' : ''}.
      </p>
    </figure>
  );
}
