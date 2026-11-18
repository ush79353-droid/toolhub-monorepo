'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import { useCurrencyRatesStatus } from '@/tools/shared/CurrencyRatesProvider';
import { ApyForm } from './ApyForm';
import { ApyResults } from './ApyResults';
import {
  createDefaultInput,
  type ApyFieldErrors,
  type ApyInput,
  type ApyResult,
} from './types';
import { validateApyInput } from './validation';

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts the deposit and final balance using stored exchange rates. APR, compounding, term, and APY % stay the same.';

const COMPOUND_LABEL: Record<ApyResult['compoundFrequency'], string> = {
  annually: 'Annually',
  'semi-annually': 'Semi-annually',
  quarterly: 'Quarterly',
  monthly: 'Monthly',
  'bi-weekly': 'Bi-weekly',
  weekly: 'Weekly',
  daily: 'Daily',
};

export function ApyCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<ApyInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<ApyFieldErrors>(() => {
    return validateApyInput(createDefaultInput()).errors;
  });
  const [result, setResult] = React.useState<ApyResult | null>(() => {
    const validation = validateApyInput(createDefaultInput());
    return validation.isValid ? validation.result : null;
  });
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const apply = (next: ApyInput) => {
    setInput(next);
    const validation = validateApyInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    const validation = validateApyInput(fresh);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    setCopied(false);
    setShared(false);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Initial deposit: ${formatCurrencyValue(result.initialDeposit, result.currency)}`,
        `APR: ${result.aprPercent}%`,
        `Compound frequency: ${COMPOUND_LABEL[result.compoundFrequency]}`,
        `APY: ${result.formattedApyPercent}%`,
        `Term: ${result.term} ${result.termUnit}`,
        `Final deposit: ${formatCurrencyValue(result.finalDeposit, result.currency)}`,
        currencyNote,
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
            APY = (1 + APR/n)^n − 1 · {currencyNote}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <ApyForm
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
        <ApyResults />
      </div>
    </section>
  );
}
