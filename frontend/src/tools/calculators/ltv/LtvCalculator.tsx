'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import { LtvForm } from './LtvForm';
import {
  createDefaultInput,
  type LtvFieldErrors,
  type LtvInput,
  type LtvResult,
} from './types';
import { validateLtvInput } from './validation';

const FX_NOTE =
  'Purchase price, down payment, and loan amount each have their own currency. Amounts are normalized into the purchase-price currency before LTV math. Currency-only changes preserve LTV. The LTV percentage is never converted.';

function syncDerivedFields(input: LtvInput, result: LtvResult): LtvInput {
  const next = { ...input };
  if (input.driver === 'downPayment') {
    next.loanAmount = moneyAmountToInputString(result.loanAmount);
    next.ltvPercent = result.formattedLtvPercent;
  } else if (input.driver === 'loanAmount') {
    next.downPayment = moneyAmountToInputString(result.downPayment);
    next.ltvPercent = result.formattedLtvPercent;
  } else {
    next.loanAmount = moneyAmountToInputString(result.loanAmount);
    next.downPayment = moneyAmountToInputString(result.downPayment);
  }
  return next;
}

export function LtvCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [input, setInput] = React.useState<LtvInput>(() => defaults);
  const [errors, setErrors] = React.useState<LtvFieldErrors>({});
  const [result, setResult] = React.useState<LtvResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: LtvInput) => {
    const validation = validateLtvInput(next, rates);
    setErrors(validation.errors);
    if (validation.isValid && validation.result) {
      const synced = syncDerivedFields(next, validation.result);
      setInput(synced);
      setResult(validation.result);
    } else {
      setInput(next);
      setResult(null);
    }
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
  };

  const currencyNote = ratesStatus.available ? FX_NOTE : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Purchase price: ${getCurrencySymbol(result.purchaseCurrency)}${result.formattedPurchasePrice}`,
        `Down payment: ${getCurrencySymbol(result.downPaymentCurrency)}${result.formattedDownPayment}`,
        `Loan amount: ${getCurrencySymbol(result.loanAmountCurrency)}${result.formattedLoanAmount}`,
        `LTV: ${result.formattedLtvPercent}%`,
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
          <p className="text-xs font-normal text-muted-foreground">{currencyNote}</p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <LtvForm input={input} errors={errors} onChange={apply} onReset={handleReset} />
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
