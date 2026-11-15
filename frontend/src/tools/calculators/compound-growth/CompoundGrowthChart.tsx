'use client';

import type { YearSnapshot } from './types';

interface CompoundGrowthChartProps {
  years: YearSnapshot[];
}

export function CompoundGrowthChart({ years }: CompoundGrowthChartProps) {
  if (years.length === 0) return null;

  const width = 560;
  const height = 200;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const maxBal = Math.max(...years.map((y) => y.balance), 1);
  const barGap = 2;
  const barW = Math.max(2, plotW / years.length - barGap);

  return (
    <div className="rounded-xl border border-border bg-white p-3 sm:p-4">
      <h3 className="text-sm font-medium text-accent">Balances</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Stacked yearly view: growth on initial deposit, growth on additional deposits, and
        additional principal.
      </p>
      <div className="mt-3 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-48 w-full min-w-[320px]"
          role="img"
          aria-label="Yearly balance chart"
        >
          <title>Yearly balances</title>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = padT + plotH * (1 - t);
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
                <text x={4} y={y + 3} className="fill-muted-foreground" fontSize="9">
                  {Math.round(maxBal * t).toLocaleString('en-US', { notation: 'compact' })}
                </text>
              </g>
            );
          })}
          {years.map((row, index) => {
            const x = padL + index * (barW + barGap);
            const initialGrowthH = (Math.max(0, row.growthOnInitial) / maxBal) * plotH;
            const additionalGrowthH = (Math.max(0, row.growthOnAdditional) / maxBal) * plotH;
            const additionalPrincipalH = (Math.max(0, row.additionalPrincipal) / maxBal) * plotH;
            let y = padT + plotH;
            y -= additionalPrincipalH;
            const yAddP = y;
            y -= additionalGrowthH;
            const yAddG = y;
            y -= initialGrowthH;
            const yInitG = y;
            return (
              <g key={row.year}>
                <rect x={x} y={yAddP} width={barW} height={additionalPrincipalH} fill="#94A3B8" />
                <rect x={x} y={yAddG} width={barW} height={additionalGrowthH} fill="#087E8B" />
                <rect x={x} y={yInitG} width={barW} height={initialGrowthH} fill="#163C43" />
                {(index === 0 ||
                  index === years.length - 1 ||
                  (years.length <= 12 && index % 2 === 0) ||
                  (years.length > 12 && index % 5 === 4)) && (
                  <text
                    x={x + barW / 2}
                    y={height - 8}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    fontSize="9"
                  >
                    {row.year}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#163C43]" /> Growth on initial
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" /> Growth on additional
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-400" /> Additional principal
        </li>
      </ul>
    </div>
  );
}
