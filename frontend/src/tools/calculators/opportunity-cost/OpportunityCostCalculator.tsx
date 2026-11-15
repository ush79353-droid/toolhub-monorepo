'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  CURRENCY_DENOMINATION_NOTE,
  formatCurrencyValue,
} from '@/tools/shared/currency';
import { OpportunityCostForm } from './OpportunityCostForm';
import { OpportunityCostResults } from './OpportunityCostResults';
import {
  createDefaultInput,
  type OpportunityCostFieldErrors,
  type OpportunityCostInput,
  type OpportunityCostResult,
} from './types';
import { validateOpportunityCostInput } from './validation';

export function OpportunityCostCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<OpportunityCostInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<OpportunityCostFieldErrors>({});
  const [result, setResult] = React.useState<OpportunityCostResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: OpportunityCostInput) => {
    setInput(next);
    const validation = validateOpportunityCostInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Money to spend: ${formatCurrencyValue(result.moneyToSpend, result.currency)}`,
        `Annual return: ${result.annualReturnPercent}%`,
        `Period: ${result.years || '0'} yrs, ${result.months || '0'} mos`,
        `Income tax: ${result.incomeTaxPercent}%`,
        `Inflation: ${result.inflationPercent}%`,
        `Total savings (after tax): ${formatCurrencyValue(result.totalSavingsAfterTax, result.currency)}`,
        `Opportunity cost (inflation adjusted): ${formatCurrencyValue(result.opportunityCost, result.currency)}`,
        ...(input.showSupplementary
          ? [
              `Inflation-adjusted savings: ${formatCurrencyValue(result.realSavings, result.currency)}`,
              `Nominal investment gain: ${formatCurrencyValue(result.nominalGain, result.currency)}`,
            ]
          : []),
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
            Real forgone gain of spending vs investing · {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <OpportunityCostForm
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
        <OpportunityCostResults />
      </div>
    </section>
  );
}
