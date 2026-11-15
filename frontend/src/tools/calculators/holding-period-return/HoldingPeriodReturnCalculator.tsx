'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  CURRENCY_DENOMINATION_NOTE,
  formatCurrencyValue,
} from '@/tools/shared/currency';
import { HoldingPeriodReturnForm } from './HoldingPeriodReturnForm';
import { HoldingPeriodReturnResults } from './HoldingPeriodReturnResults';
import {
  createDefaultInput,
  type HoldingPeriodReturnFieldErrors,
  type HoldingPeriodReturnInput,
  type HoldingPeriodReturnResult,
} from './types';
import { validateHoldingPeriodReturnInput } from './validation';

export function HoldingPeriodReturnCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<HoldingPeriodReturnInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<HoldingPeriodReturnFieldErrors>({});
  const [result, setResult] = React.useState<HoldingPeriodReturnResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: HoldingPeriodReturnInput) => {
    setInput(next);
    const validation = validateHoldingPeriodReturnInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Bought price: ${formatCurrencyValue(result.boughtPrice, result.currency)}`,
        `Current price: ${formatCurrencyValue(result.currentPrice, result.currency)}`,
        `Dividend income: ${formatCurrencyValue(result.dividendIncome, result.currency)}`,
        `Capital gains yield: ${result.formattedCapitalGainsYield}%`,
        `Dividend yield: ${result.formattedDividendYield}%`,
        `Holding period return: ${result.formattedHoldingPeriodReturn}%`,
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
            HPR = capital gains yield + dividend yield · {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <HoldingPeriodReturnForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
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
        <HoldingPeriodReturnResults />
      </div>
    </section>
  );
}
