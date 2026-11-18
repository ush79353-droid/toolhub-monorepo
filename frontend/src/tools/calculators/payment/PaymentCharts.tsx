'use client';

import type { PaymentChartPoint, PaymentResult } from './types';
import { formatPaymentUsd } from './calculation';

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlice(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
): string {
  const sweep = endAngle - startAngle;
  if (!(sweep > 0)) return '';
  const large = sweep > 180 ? 1 : 0;
  const o0 = polar(cx, cy, outerR, startAngle);
  const o1 = polar(cx, cy, outerR, endAngle);
  const i1 = polar(cx, cy, innerR, endAngle);
  const i0 = polar(cx, cy, innerR, startAngle);
  return [
    `M ${o0.x} ${o0.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o1.x} ${o1.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i0.x} ${i0.y}`,
    'Z',
  ].join(' ');
}

export function PaymentDonutChart({ result }: { result: PaymentResult }) {
  const cx = 90;
  const cy = 90;
  const outerR = 70;
  const innerR = 40;
  const principalSweep = (Math.max(0, result.principalPercent) / 100) * 360;
  const principalPath = donutSlice(cx, cy, outerR, innerR, 0, principalSweep);
  const interestPath = donutSlice(cx, cy, outerR, innerR, principalSweep, 360);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      <svg
        viewBox="0 0 180 180"
        className="h-36 w-36 shrink-0"
        role="img"
        aria-label={`Principal ${Math.round(result.principalPercent)} percent, interest ${Math.round(result.interestPercent)} percent`}
      >
        {principalPath ? <path d={principalPath} fill="#3B82F6" /> : null}
        {interestPath ? <path d={interestPath} fill="#16A34A" /> : null}
        <circle cx={cx} cy={cy} r={innerR} fill="#FFFFFF" />
      </svg>
      <ul className="space-y-1.5 text-xs text-accent sm:text-sm">
        <li className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#3B82F6]" aria-hidden />
          Principal ({Math.round(result.principalPercent)}%)
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#16A34A]" aria-hidden />
          Interest ({Math.round(result.interestPercent)}%)
        </li>
      </ul>
    </div>
  );
}

function buildLinePath(
  points: PaymentChartPoint[],
  key: keyof Omit<PaymentChartPoint, 'year'>,
  toX: (year: number) => number,
  toY: (value: number) => number
): string {
  return points
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${toX(pt.year).toFixed(1)} ${toY(pt[key]).toFixed(1)}`)
    .join(' ');
}

export function PaymentRepaymentChart({
  points,
}: {
  points: PaymentChartPoint[];
}) {
  const width = 360;
  const height = 200;
  const padL = 44;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const maxYear = Math.max(1, ...points.map((p) => p.year));
  const maxValue = Math.max(
    1,
    ...points.flatMap((p) => [p.balance, p.cumulativeInterest, p.cumulativePayment])
  );

  const toX = (year: number) => padL + (year / maxYear) * plotW;
  const toY = (value: number) => padT + plotH - (value / maxValue) * plotH;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxValue);

  return (
    <div className="rounded-xl border border-border bg-white p-3 sm:p-4">
      <div className="mb-2 flex flex-wrap gap-3 text-xs text-accent">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#3B82F6]" aria-hidden />
          Balance
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#16A34A]" aria-hidden />
          Interest
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#9F1239]" aria-hidden />
          Payment
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Repayment chart of balance, cumulative interest, and cumulative payments"
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padL}
              x2={width - padR}
              y1={toY(tick)}
              y2={toY(tick)}
              stroke="#E2E8F0"
              strokeWidth={1}
            />
            <text
              x={padL - 6}
              y={toY(tick) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={9}
            >
              {tick >= 1000 ? `${Math.round(tick / 1000)}K` : Math.round(tick)}
            </text>
          </g>
        ))}
        <text
          x={padL + plotW / 2}
          y={height - 4}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={10}
        >
          Year
        </text>
        <path
          d={buildLinePath(points, 'balance', toX, toY)}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={2}
        />
        <path
          d={buildLinePath(points, 'cumulativeInterest', toX, toY)}
          fill="none"
          stroke="#16A34A"
          strokeWidth={2}
        />
        <path
          d={buildLinePath(points, 'cumulativePayment', toX, toY)}
          fill="none"
          stroke="#9F1239"
          strokeWidth={2}
        />
      </svg>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Ends near {formatPaymentUsd(points[points.length - 1]?.cumulativePayment ?? 0)} total
        payments
      </p>
    </div>
  );
}
