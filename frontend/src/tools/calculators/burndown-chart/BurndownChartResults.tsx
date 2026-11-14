'use client';

import { BurndownChartSvg } from './BurndownChartSvg';
import { formatPoints } from './calculation';
import type { BurndownChartResult } from './types';

interface BurndownChartResultsProps {
  result: BurndownChartResult | null;
}

export function BurndownChartResults({ result }: BurndownChartResultsProps) {
  if (!result) return null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-border/80 bg-muted/20 p-3 text-xs">
        <div>
          <span className="text-muted-foreground">Total burned</span>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-accent">
            {formatPoints(result.totalBurned)}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Remaining</span>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-accent">
            {formatPoints(result.remainingPoints)}
          </p>
        </div>
      </div>
      <BurndownChartSvg result={result} />
    </div>
  );
}
