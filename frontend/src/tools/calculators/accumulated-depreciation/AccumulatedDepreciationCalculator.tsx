'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { Button } from '@/components/ui/button';
import {
  AccumulatedDepreciationForm,
  draftToInput,
  inputToDraft,
  type AccumulatedDepreciationDraft,
} from './AccumulatedDepreciationForm';
import { AccumulatedDepreciationResults } from './AccumulatedDepreciationResults';
import { calculateAccumulatedDepreciation, methodLabel } from './calculation';
import {
  createDefaultAccumulatedDepreciationInput,
  type AccumulatedDepreciationFieldErrors,
  type AccumulatedDepreciationResult,
} from './types';
import { validateAccumulatedDepreciation } from './validation';

const MONEY_FIELDS = ['assetCost', 'salvageValue'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts asset cost and salvage value using stored exchange rates. Useful life, years elapsed, units, and depreciation method stay the same.';

function summaryText(metadataTitle: string, result: AccumulatedDepreciationResult, note: string): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const lines = [
    `${metadataTitle} — Omega Calculators`,
    `Method: ${methodLabel(result.method)}`,
    `Asset cost: ${money(result.assetCost)}`,
    `Salvage value: ${money(result.salvageValue)}`,
  ];
  if (result.usefulLifeYears !== null) lines.push(`Useful life: ${result.usefulLifeYears} years`);
  if (result.yearsElapsed !== null) lines.push(`Number of years: ${result.yearsElapsed} years`);
  if (result.estimatedLifetimeUnits !== null) {
    lines.push(`Estimated lifetime units: ${result.estimatedLifetimeUnits}`);
  }
  if (result.unitsProduced !== null) lines.push(`Units produced: ${result.unitsProduced}`);
  lines.push(`Accumulated depreciation: ${money(result.accumulatedDepreciation)}`);
  lines.push(`Net book value: ${money(result.netBookValue)}`);
  lines.push(note);
  return lines.join('\n');
}

export function AccumulatedDepreciationCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<AccumulatedDepreciationDraft>(() =>
    inputToDraft(createDefaultAccumulatedDepreciationInput())
  );
  const [errors, setErrors] = React.useState<AccumulatedDepreciationFieldErrors>({});
  const [result, setResult] = React.useState<AccumulatedDepreciationResult | null>(() =>
    calculateAccumulatedDepreciation(createDefaultAccumulatedDepreciationInput())
  );
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

  const run = (nextDraft: AccumulatedDepreciationDraft) => {
    const input = draftToInput(nextDraft);
    const validation = validateAccumulatedDepreciation(input);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateAccumulatedDepreciation(input) : null);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === draft.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      draft,
      MONEY_FIELDS,
      draft.currency,
      currency,
      rates.rates
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    const next: AccumulatedDepreciationDraft = {
      ...draft,
      ...converted.values,
      currency,
    };
    setDraft(next);
    run(next);
  };

  const summary = result?.defined ? summaryText(metadata.title, result, currencyNote) : '';

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
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="ad-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="ad-currency"
              value={draft.currency}
              onChange={handleCurrencyChange}
            />
          </div>
        </div>
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
        <AccumulatedDepreciationForm
          draft={draft}
          errors={errors}
          onDraftChange={(next) => {
            setConversionError(null);
            setDraft(next);
            run(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            run(draft);
          }}
          onReset={() => {
            const fresh = createDefaultAccumulatedDepreciationInput();
            const nextDraft = inputToDraft(fresh);
            setDraft(nextDraft);
            setErrors({});
            setResult(calculateAccumulatedDepreciation(fresh));
            setConversionError(null);
          }}
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
        <AccumulatedDepreciationResults result={result} invalid={Object.keys(errors).length > 0} />
      </div>
    </section>
  );
}