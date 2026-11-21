'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  CURRENCY_DENOMINATION_NOTE,
  getCurrencySymbol,
} from '@/tools/shared/currency';
import { BetaStockChart } from './BetaStockChart';
import { BetaStockForm } from './BetaStockForm';
import {
  createDefaultInput,
  type BetaStockFieldErrors,
  type BetaStockInput,
  type BetaStockResult,
  type PricePair,
} from './types';
import { ensureTrailingPairs, validateBetaStockInput } from './validation';

export function BetaStockCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<BetaStockInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<BetaStockFieldErrors>({});
  const [result, setResult] = React.useState<BetaStockResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [chartPairs, setChartPairs] = React.useState<PricePair[]>([]);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: BetaStockInput) => {
    const withTrailing = ensureTrailingPairs(next);
    const validation = validateBetaStockInput(withTrailing);
    setInput(withTrailing);
    setErrors(validation.errors);
    setResult(validation.result);
    setIncomplete(validation.incomplete);
    setChartPairs(validation.chartPairs);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setChartPairs([]);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary =
    result !== null
      ? [
          `${metadata.title} | Omega Calculators`,
          ...result.pairs.map(
            (pair, index) =>
              `Day ${index + 1}: asset ${symbol}${pair.asset}, benchmark ${symbol}${pair.benchmark}`
          ),
          `Stock Beta (β): ${result.formattedBeta}`,
          CURRENCY_DENOMINATION_NOTE,
        ].join('\n')
      : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            β = Cov(asset returns, benchmark returns) ÷ Var(benchmark returns).{' '}
            {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <BetaStockForm
          input={input}
          errors={errors}
          result={result}
          onChange={run}
        />

        {incomplete ? (
          <div
            role="status"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-accent"
          >
            <p className="font-semibold">Input some data!</p>
            <p className="mt-1">
              The calculator requires <strong>at least four pairs</strong> of asset and
              benchmark prices to operate.
            </p>
          </div>
        ) : null}

        {input.graphPrices && chartPairs.length >= 2 ? (
          <BetaStockChart pairs={chartPairs} />
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}
