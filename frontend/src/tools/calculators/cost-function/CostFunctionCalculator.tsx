'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { type SupportedCurrency } from '@/tools/shared/currency';
import { Button } from '@/components/ui/button';
import { CostFunctionForm } from './CostFunctionForm';
import { CostFunctionResults } from './CostFunctionResults';
import {
  calculateFromFixedVariable,
  calculateFromTwoPoints,
  describeResult,
} from './calculation';
import {
  createDefaultInput,
  type CostFunctionFieldErrors,
  type CostFunctionInput,
  type CostFunctionResult,
} from './types';
import { validateCostFunctionInput } from './validation';

const MONEY_FIELDS = ['fixedCost', 'variableCostPerUnit', 'totalCost1', 'totalCost2'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts fixed cost, variable cost, and total-cost points using stored exchange rates. Quantities and derived slopes stay the same.';

function summaryText(metadataTitle: string, result: CostFunctionResult, note: string): string {
  const lines = [`${metadataTitle} | Omega Calculators`, describeResult(result)];
  if (result.method === 'fixed-variable' && result.quantity !== null) {
    lines.push(`Quantity: ${result.quantity}`);
  }
  lines.push(note);
  return lines.join('\n');
}

export function CostFunctionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<CostFunctionInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<CostFunctionFieldErrors>({});
  const [result, setResult] = React.useState<CostFunctionResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const run = (next: CostFunctionInput) => {
    const validation = validateCostFunctionInput(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    if (validation.isValid && validation.parsed) {
      if (validation.parsed.method === 'fixed-variable') {
        setResult(
          calculateFromFixedVariable(
            validation.parsed.fixedCost,
            validation.parsed.variableCostPerUnit,
            validation.parsed.quantity,
            validation.parsed.currency
          )
        );
      } else {
        setResult(
          calculateFromTwoPoints(
            validation.parsed.quantity1,
            validation.parsed.totalCost1,
            validation.parsed.quantity2,
            validation.parsed.totalCost2,
            validation.parsed.currency
          )
        );
      }
    } else {
      setResult(null);
    }
  };

  const handleChange = (next: CostFunctionInput) => {
    setConversionError(null);
    setInput(next);
    run(next);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      input,
      MONEY_FIELDS,
      input.currency,
      currency,
      rates.rates
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    handleChange({
      ...input,
      ...converted.values,
      currency,
    });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setConversionError(null);
  };

  const summary = result ? summaryText(metadata.title, result, currencyNote) : '';

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
        <div className="flex flex-wrap items-center justify-end gap-2">{headerActions}</div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        <CostFunctionForm
          input={input}
          errors={errors}
          result={result}
          incomplete={incomplete}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
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
                  // User dismissed the share sheet.
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
        <CostFunctionResults />
      </div>
    </section>
  );
}