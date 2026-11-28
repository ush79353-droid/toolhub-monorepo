'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  ExpenseBreakdownPoint,
  OccupancyChartPoint,
} from './types';
import type { SupportedCurrency } from '@/tools/shared/currency';

interface CarpoolingChartProps {
  occupancy: OccupancyChartPoint[];
  expenses: ExpenseBreakdownPoint[];
  sharedCost: number | null;
  separateCost: number | null;
  currency: SupportedCurrency;
}

export function CarpoolingChart({
  occupancy,
  expenses,
  sharedCost,
  separateCost,
  currency,
}: CarpoolingChartProps) {
  const width = 560;
  const height = 200;
  const padL = 48;
  const padR = 12;
  const padT = 16;
  const padB = 36;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  if (occupancy.length < 2) return null;

  const maxPeople = Math.max(...occupancy.map((p) => p.people));
  const maxCost = Math.max(...occupancy.map((p) => p.costPerPerson), 1);
  const toX = (n: number) => padL + ((n - 1) / Math.max(maxPeople - 1, 1)) * plotW;
  const toY = (c: number) => padT + plotH - (c / maxCost) * plotH;
  const poly = occupancy
    .map((p) => `${toX(p.people).toFixed(1)},${toY(p.costPerPerson).toFixed(1)}`)
    .join(' ');

  const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0) || 1;

  return (
    <div className="space-y-4">
      <div
        className="space-y-1"
        role="img"
        aria-label="Cost per person versus number of people"
      >
        <h4 className="text-sm font-semibold text-accent">
          Cost per Person vs. Number of People
        </h4>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
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
          <text
            x={padL}
            y={height - 10}
            className="fill-muted-foreground"
            fontSize={9}
          >
            People
          </text>
        </svg>
      </div>

      {expenseTotal > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-accent">
            Trip Expense Breakdown
          </h4>
          <ul className="space-y-1.5">
            {expenses.map((e) => {
              const pct = (e.amount / expenseTotal) * 100;
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
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {sharedCost != null && separateCost != null ? (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-accent">
            Shared Ride vs. Separate Travel
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-muted-foreground">Shared</p>
              <p className="mt-1 text-base font-semibold tabular-nums text-accent">
                {formatCurrencyValue(sharedCost, currency)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-muted-foreground">Separate (scenario)</p>
              <p className="mt-1 text-base font-semibold tabular-nums text-accent">
                {formatCurrencyValue(separateCost, currency)}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
