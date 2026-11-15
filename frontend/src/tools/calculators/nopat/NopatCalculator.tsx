'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { NopatForm } from './NopatForm';
import { NopatResults } from './NopatResults';
import { formatMoney } from './calculation';
import {
  createDefaultInput,
  type NopatFieldErrors,
  type NopatInput,
  type NopatResult,
} from './types';
import { validateNopat } from './validation';

export function NopatCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<NopatInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<NopatFieldErrors>({});
  const [result, setResult] = React.useState<NopatResult | null>(() => {
    const initial = validateNopat(createDefaultInput());
    return initial.result;
  });
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: NopatInput) => {
    const validation = validateNopat(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(validateNopat(fresh).result);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary =
    result && result.nopat !== null
      ? input.mode === 'simple'
        ? [
            `${metadata.title} — Omega Calculators`,
            'Mode: Simple NOPAT formula',
            `Operating profit: ${symbol}${formatMoney(input.operatingProfit, input.currency)}`,
            `Tax rate: ${input.taxRatePercent}%`,
            `NOPAT: ${symbol}${result.nopatDisplay}`,
            CURRENCY_DENOMINATION_NOTE,
          ].join('\n')
        : [
            `${metadata.title} — Omega Calculators`,
            'Mode: Precise NOPAT formula',
            `Net income: ${symbol}${formatMoney(input.netIncome, input.currency)}`,
            `Non-operating income loss: ${symbol}${formatMoney(input.nonOperatingIncomeLoss, input.currency)}`,
            `Non-operating income gain: ${symbol}${formatMoney(input.nonOperatingIncomeGain, input.currency)}`,
            `Interest expense: ${symbol}${formatMoney(input.interestExpense, input.currency)}`,
            `Tax: ${symbol}${formatMoney(input.tax, input.currency)}`,
            `Tax rate: ${input.taxRatePercent}%`,
            `NOPAT: ${symbol}${result.nopatDisplay}`,
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
            NOPAT = operating profit after tax, excluding financing effects.{' '}
            {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <NopatForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
        />
        <NopatResults />
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
      </div>
    </section>
  );
}
