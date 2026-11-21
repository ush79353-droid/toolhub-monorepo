'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { Button } from '@/components/ui/button';
import {
  SalesCommissionForm,
  draftToInput,
  inputToDraft,
  type SalesCommissionDraft,
} from './SalesCommissionForm';
import { SalesCommissionResults } from './SalesCommissionResults';
import { calculateSalesCommission, methodLabel } from './calculation';
import {
  createDefaultSalesCommissionInput,
  type SalesCommissionFieldErrors,
  type SalesCommissionResult,
} from './types';
import { validateSalesCommission } from './validation';

const MONEY_FIELDS = [
  'revenue',
  'cogs',
  'sellingExpenses',
  'baseSalary',
  'salesQuota',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts sales, costs, commissions, and thresholds using stored exchange rates. Percentage rates, brackets, and margin % stay the same.';

function summaryText(title: string, result: SalesCommissionResult, currencyNote: string): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  return [
    `${title} | Omega Calculators`,
    `Method: ${methodLabel(result.commissionBase)}`,
    `Gross sales: ${money(result.revenue)}`,
    `Gross profit: ${money(result.grossProfit)}`,
    `Commission base: ${money(result.commissionBaseAmount)}`,
    `Commission: ${money(result.commission)}`,
    `Total labor cost (OTE): ${money(result.totalLaborCost)}`,
    `Operational profit: ${money(result.operationalProfit)}`,
    currencyNote,
  ].join('\n');
}

export function SalesCommissionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<SalesCommissionDraft>(() =>
    inputToDraft(createDefaultSalesCommissionInput())
  );
  const [errors, setErrors] = React.useState<SalesCommissionFieldErrors>({});
  const [result, setResult] = React.useState<SalesCommissionResult | null>(() =>
    calculateSalesCommission(createDefaultSalesCommissionInput())
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

  const run = (nextDraft: SalesCommissionDraft) => {
    const input = draftToInput(nextDraft);
    const validation = validateSalesCommission(input);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateSalesCommission(input) : null);
  };

  const handleDraftChange = (nextDraft: SalesCommissionDraft) => {
    setConversionError(null);
    setDraft(nextDraft);
    run(nextDraft);
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
    handleDraftChange({ ...draft, ...converted.values, currency });
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
            <label htmlFor="sc-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect id="sc-currency" value={draft.currency} onChange={handleCurrencyChange} />
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
        <SalesCommissionForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={handleDraftChange}
          onSubmit={(event) => {
            event.preventDefault();
            run(draft);
          }}
          onReset={() => {
            const fresh = createDefaultSalesCommissionInput();
            const nextDraft = inputToDraft(fresh);
            setDraft(nextDraft);
            setErrors({});
            setResult(calculateSalesCommission(fresh));
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
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
        <SalesCommissionResults result={result} invalid={Object.keys(errors).length > 0} />
      </div>
    </section>
  );
}