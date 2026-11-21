'use client';

import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatRoeMoney } from './calculation';
import type { ReturnOnEquityResult } from './types';

interface ReturnOnEquityResultsProps {
  result: ReturnOnEquityResult | null;
}

export function ReturnOnEquityResults({ result }: ReturnOnEquityResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const perUnit = `${symbol}${formatRoeMoney(result.returnPerEquityUnit, result.currency)}`;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {result.usedAverageEquity
              ? "Average shareholders' equity"
              : "Shareholders' equity"}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedEquityBase}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Return on equity (ROE)</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedRoe}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Profit per {symbol}1 of equity
          </dt>
          <dd className="tabular-nums font-medium text-accent">{perUnit}</dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        ROE = (Net Profit ÷ Equity) × 100
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/return-on-assets-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROA
        </Link>
        {' · '}
        <Link
          href="/tools/dupont-analysis-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DuPont
        </Link>
        {' · '}
        <Link
          href="/tools/net-profit-margin-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Profit Margin
        </Link>
        {' · '}
        <Link
          href="/tools/financial-leverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Financial Leverage
        </Link>
        {' · '}
        <Link
          href="/tools/return-on-capital-employed-calculator-roce"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROCE
        </Link>
        {' · '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt-to-Equity
        </Link>
        .
      </p>
    </div>
  );
}
