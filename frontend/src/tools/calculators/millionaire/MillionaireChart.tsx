'use client';

import type { MillionaireResult } from './types';
import { formatMoneyWithSymbol } from './calculation';

interface MillionaireChartProps {
  result: MillionaireResult;
}

export function MillionaireChart({ result }: MillionaireChartProps) {
  if (!result.goalReachable || result.projection.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/10 px-3 py-8 text-center text-sm text-muted-foreground">
        No savings growth data to display
      </p>
    );
  }

  const rows = result.projection;
  const width = 560;
  const height = 220;
  const padL = 44;
  const padR = 12;
  const padT = 16;
  const padB = 36;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const maxBal = Math.max(
    result.targetAmount,
    ...rows.map((r) => r.balance),
    1,
  );
  const barGap = rows.length > 30 ? 1 : 2;
  const barW = Math.max(2, plotW / rows.length - barGap);
  const labelStep = Math.max(1, Math.ceil(rows.length / 12));
  const targetY = padT + plotH * (1 - result.targetAmount / maxBal);
  const money = (v: number) => formatMoneyWithSymbol(v, result.currency);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-52 w-full min-w-[280px]"
          role="img"
          aria-label="Savings growth over time toward your goal"
        >
          <title>Savings growth over time</title>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = padT + plotH * (1 - t);
            const label = maxBal * t;
            const text =
              label >= 1_000_000
                ? `${(label / 1_000_000).toFixed(1)}M`
                : label >= 1000
                  ? `${(label / 1000).toFixed(label >= 10_000 ? 0 : 1)}k`
                  : String(Math.round(label));
            return (
              <g key={t}>
                <line
                  x1={padL}
                  x2={width - padR}
                  y1={y}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text
                  x={padL - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  fontSize="9"
                >
                  {text}
                </text>
              </g>
            );
          })}
          <line
            x1={padL}
            x2={width - padR}
            y1={targetY}
            y2={targetY}
            stroke="#087E8B"
            strokeDasharray="4 3"
            strokeWidth="1.5"
          />
          {rows.map((row, index) => {
            const x = padL + index * (barW + barGap);
            const initialH = (Math.max(0, row.initialSavings) / maxBal) * plotH;
            const contribH = (Math.max(0, row.contributions) / maxBal) * plotH;
            const interestH = (Math.max(0, row.interestEarned) / maxBal) * plotH;
            const yInterest = padT + plotH - interestH;
            const yContrib = yInterest - contribH;
            const yInitial = yContrib - initialH;
            const showLabel =
              index === 0 ||
              index === rows.length - 1 ||
              index % labelStep === 0;
            return (
              <g key={`${row.year}-${index}`}>
                <title>{`Year ${row.year}: ${money(row.balance)} (contributions ${money(row.contributions)}, interest ${money(row.interestEarned)})`}</title>
                <rect
                  x={x}
                  y={yInterest}
                  width={barW}
                  height={Math.max(0, interestH)}
                  fill="#5EEAD4"
                />
                <rect
                  x={x}
                  y={yContrib}
                  width={barW}
                  height={Math.max(0, contribH)}
                  fill="#38BDF8"
                />
                <rect
                  x={x}
                  y={yInitial}
                  width={barW}
                  height={Math.max(0, initialH)}
                  fill="#087E8B"
                  rx={0.5}
                />
                {showLabel ? (
                  <text
                    x={x + barW / 2}
                    y={height - 18}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    fontSize="8"
                  >
                    {row.year}
                  </text>
                ) : null}
              </g>
            );
          })}
          <text
            x={width / 2}
            y={height - 4}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize="10"
          >
            Year
          </text>
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden />
          Initial savings
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: '#38BDF8' }}
            aria-hidden
          />
          Contributions
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: '#5EEAD4' }}
            aria-hidden
          />
          Accumulated interest
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-px w-4 border-t border-dashed border-primary" aria-hidden />
          Target
        </span>
      </div>
    </div>
  );
}
