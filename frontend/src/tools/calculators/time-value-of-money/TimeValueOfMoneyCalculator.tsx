'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  CURRENCY_DENOMINATION_NOTE,
  formatCurrencyValue,
} from '@/tools/shared/currency';
import { TimeValueOfMoneyForm } from './TimeValueOfMoneyForm';
import { TimeValueOfMoneyResults } from './TimeValueOfMoneyResults';
import {
  COMPOUNDING_OPTIONS,
  createDefaultInput,
  type TimeValueOfMoneyFieldErrors,
  type TimeValueOfMoneyInput,
  type TimeValueOfMoneyResult,
} from './types';
import { validateTimeValueOfMoneyInput } from './validation';

export function TimeValueOfMoneyCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<TimeValueOfMoneyInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<TimeValueOfMoneyFieldErrors>(() => {
    return validateTimeValueOfMoneyInput(createDefaultInput()).errors;
  });
  const [result, setResult] = React.useState<TimeValueOfMoneyResult | null>(() => {
    const seed = validateTimeValueOfMoneyInput(createDefaultInput());
    return seed.isValid ? seed.result : null;
  });
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: TimeValueOfMoneyInput) => {
    setInput(next);
    const validation = validateTimeValueOfMoneyInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    const validation = validateTimeValueOfMoneyInput(fresh);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    setCopied(false);
    setShared(false);
  };

  const compoundingLabel =
    COMPOUNDING_OPTIONS.find((o) => o.value === input.compounding)?.label ?? input.compounding;

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Interest rate: ${result.interestRatePercent}%`,
        `Term: ${result.years || '0'} yrs, ${result.months || '0'} mos`,
        `Compound frequency: ${compoundingLabel}`,
        `Present value: ${formatCurrencyValue(result.presentValue, result.currency)}`,
        `Future value: ${formatCurrencyValue(result.futureValue, result.currency)}`,
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
            Bidirectional PV ↔ FV with compounding · {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <TimeValueOfMoneyForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onReset={handleReset}
        />
        <TimeValueOfMoneyResults />
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
