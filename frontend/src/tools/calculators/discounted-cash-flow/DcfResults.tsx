'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { DcfResult } from './types';

interface DcfResultsProps {
  result: DcfResult | null;
}

export function DcfResults({ result }: DcfResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/15 p-4 text-sm text-muted-foreground">
        Expect results here upon entry of the parameters above.
      </div>
    );
  }

  const symbol = getCurrencySymbol(result.currency);

  return (
    <div className="space-y-2.5 rounded-xl border border-border p-4">
      <h3 className="text-[13px] font-semibold text-accent">Results</h3>
      {result.method === 'fcff' && result.formattedEnterpriseValue ? (
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Enterprise value</span>
          <span className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedEnterpriseValue}
          </span>
        </div>
      ) : null}
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted-foreground">Equity value</span>
        <span className="font-semibold tabular-nums text-accent">
          {symbol}
          {result.formattedEquityValue}
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted-foreground">Estimated share value</span>
        <span className="font-semibold tabular-nums text-accent">
          {symbol}
          {result.formattedShareValue}
        </span>
      </div>
      {result.method === 'eps' ? (
        <p className="pt-1 text-xs text-muted-foreground">
          EPS mode is an equity earnings model at cost of equity; enterprise value is not
          applicable.
        </p>
      ) : null}
    </div>
  );
}
