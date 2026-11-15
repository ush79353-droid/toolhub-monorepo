'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { BitcoinEtfForm } from './BitcoinEtfForm';
import { BitcoinEtfResults } from './BitcoinEtfResults';
import {
  BITCOIN_ETF_OPTIONS,
  createDefaultInput,
  type BitcoinEtfFieldErrors,
  type BitcoinEtfInput,
  type BitcoinEtfResult,
} from './types';
import { validateBitcoinEtfInput } from './validation';

export function BitcoinEtfCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<BitcoinEtfInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<BitcoinEtfFieldErrors>({});
  const [result, setResult] = React.useState<BitcoinEtfResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: BitcoinEtfInput) => {
    const validation = validateBitcoinEtfInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleChange = (next: BitcoinEtfInput) => {
    setInput(next);
    run(next);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
  };

  const symbol = getCurrencySymbol(input.currency);
  const etfLabel =
    BITCOIN_ETF_OPTIONS.find((option) => option.id === input.etfId)?.label ?? 'Not selected';

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `ETF: ${etfLabel}`,
        `Investment: ${symbol}${input.investmentAmount}`,
        `Duration: ${input.durationYears} yrs`,
        `Expense ratio: ${input.expenseRatio}%`,
        `Other costs: ${symbol}${input.otherCosts}`,
        `Expected return: ${input.expectedReturn}% (estimate)`,
        `Effective return: ${result.formattedEffectiveReturn}%`,
        `Future value: ${symbol}${result.formattedFutureValue}`,
        `Total cost of ETF: ${symbol}${result.formattedTotalCost}`,
        'Returns are estimates, not guarantees.',
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
            Estimate Bitcoin ETF growth after expense ratio. {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <BitcoinEtfForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onReset={handleReset}
        />
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
        </div>
        <BitcoinEtfResults />
      </div>
    </section>
  );
}
