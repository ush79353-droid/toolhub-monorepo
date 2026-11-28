'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type { CostBreakdownPoint, OccupancyPoint } from './types';

interface CommuteChartProps {
  carMonthly: number | null;
  transitMonthly: number | null;
  carYearly: number | null;
  transitYearly: number | null;
  breakdown: CostBreakdownPoint[];
  occupancy: OccupancyPoint[];
  currency: SupportedCurrency;
}

function BarPair({
  title,
  aLabel,
  aValue,
  bLabel,
  bValue,
  currency,
}: {
  title: string;
  aLabel: string;
  aValue: number;
  bLabel: string;
  bValue: number;
  currency: SupportedCurrency;
}) {
  const max = Math.max(aValue, bValue, 1);
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-accent">{title}</h4>
      {(
        [
          [aLabel, aValue],
          [bLabel, bValue],
        ] as const
      ).map(([label, value]) => (
        <div key={label} className="text-xs">
          <div className="mb-0.5 flex justify-between gap-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="tabular-nums text-accent">
              {formatCurrencyValue(value, currency)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CommuteChart({
  carMonthly,
  transitMonthly,
  carYearly,
  transitYearly,
  breakdown,
  occupancy,
  currency,
}: CommuteChartProps) {
  const width = 560;
  const height = 180;
  const padL = 40;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  return (
    <div className="space-y-4">
      {carMonthly != null && transitMonthly != null ? (
        <BarPair
          title="Monthly Commute Cost Comparison"
          aLabel="Car (per person)"
          aValue={carMonthly}
          bLabel="Public transport"
          bValue={transitMonthly}
          currency={currency}
        />
      ) : null}

      {carYearly != null && transitYearly != null ? (
        <BarPair
          title="Annual Commuting Costs"
          aLabel="Car (per person)"
          aValue={carYearly}
          bLabel="Public transport"
          bValue={transitYearly}
          currency={currency}
        />
      ) : null}

      {breakdown.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-accent">
            Car Cost Breakdown
          </h4>
          <ul className="space-y-1.5">
            {breakdown.map((e) => {
              const total =
                breakdown.reduce((s, x) => s + x.amount, 0) || 1;
              return (
                <li key={e.label} className="text-xs">
                  <div className="mb-0.5 flex justify-between gap-2">
                    <span className="text-muted-foreground">{e.label}</span>
                    <span className="tabular-nums text-accent">
                      {formatCurrencyValue(e.amount, currency)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(100, (e.amount / total) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {occupancy.length >= 2 ? (
        <div
          className="space-y-1"
          role="img"
          aria-label="Cost per person versus carpool occupancy"
        >
          <h4 className="text-sm font-semibold text-accent">
            Cost per Person vs. Occupancy
          </h4>
          <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
            {(() => {
              const maxP = Math.max(...occupancy.map((p) => p.people));
              const maxC = Math.max(
                ...occupancy.map((p) => p.costPerPerson),
                1,
              );
              const toX = (n: number) =>
                padL + ((n - 1) / Math.max(maxP - 1, 1)) * plotW;
              const toY = (c: number) =>
                padT + plotH - (c / maxC) * plotH;
              const poly = occupancy
                .map(
                  (p) =>
                    `${toX(p.people).toFixed(1)},${toY(p.costPerPerson).toFixed(1)}`,
                )
                .join(' ');
              return (
                <>
                  <polyline
                    fill="none"
                    stroke="#087E8B"
                    strokeWidth={2}
                    points={poly}
                  />
                  {occupancy.map((p) => (
                    <circle
                      key={p.people}
                      cx={toX(p.people)}
                      cy={toY(p.costPerPerson)}
                      r={3}
                      fill="#087E8B"
                    />
                  ))}
                </>
              );
            })()}
            <text
              x={padL}
              y={height - 8}
              className="fill-muted-foreground"
              fontSize={9}
            >
              People
            </text>
          </svg>
        </div>
      ) : null}
    </div>
  );
}
