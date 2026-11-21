'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { calculateThreeDPrinter } from './calculation';
import {
  DEFAULT_THREE_D_PRINTER_INPUT,
  type ThreeDPrinterFieldErrors,
  type ThreeDPrinterResult,
} from './types';
import { validateThreeDPrinterInput } from './validation';
import {
  draftToInput,
  inputToDraft,
  ThreeDPrinterBuyVsOutsourceForm,
  type ThreeDPrinterDraft,
} from './ThreeDPrinterBuyVsOutsourceForm';
import { ThreeDPrinterBuyVsOutsourceResults } from './ThreeDPrinterBuyVsOutsourceResults';

const MONEY_FIELDS = [
  'printerPrice',
  'setupCosts',
  'materialPricePerKg',
  'electricityPricePerKWh',
  'maintenancePerMonth',
  'laborHourlyRate',
  'resaleValue',
  'pricePerPart',
  'finishingCostPerPart',
  'shippingPerOrder',
  'oneTimeServiceFee',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts buy and outsource cost inputs using stored exchange rates. Quantities, hours, and failure rate stay the same.';

function summaryText(result: ThreeDPrinterResult, note: string): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const perPart = (value: number | null) => (value === null ? 'n/a' : money(value));
  const choice =
    result.recommendation === 'buy'
      ? 'Buying is cheaper'
      : result.recommendation === 'outsource'
        ? 'Outsourcing is cheaper'
        : 'Costs match';
  return [
    '3D Printer Buy vs Outsource | Omega Calculators',
    `${choice} by ${money(Math.abs(result.netSavings))}.`,
    `In-house: ${money(result.totalInHouseCost)} (${perPart(result.inHouseCostPerPart)} per successful part)`,
    `Outsource: ${money(result.totalOutsourcingCost)} (${perPart(result.outsourceCostPerPart)} per successful part)`,
    result.breakEvenParts === null
      ? 'No break-even under current assumptions.'
      : `Break-even: ${result.breakEvenParts} successful parts, about ${result.breakEvenMonths} months.`,
    note,
  ].join('\n');
}

export function ThreeDPrinterBuyVsOutsourceCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<ThreeDPrinterDraft>(() =>
    inputToDraft(DEFAULT_THREE_D_PRINTER_INPUT)
  );
  const [errors, setErrors] = React.useState<ThreeDPrinterFieldErrors>({});
  const [result, setResult] = React.useState<ThreeDPrinterResult | null>(() =>
    calculateThreeDPrinter(DEFAULT_THREE_D_PRINTER_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const evaluate = React.useCallback((next: ThreeDPrinterDraft) => {
    const parsed = draftToInput(next);
    const validation = validateThreeDPrinterInput(parsed);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateThreeDPrinter(parsed) : null);
  }, []);

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
    const next: ThreeDPrinterDraft = {
      ...draft,
      ...converted.values,
      currency,
    };
    setDraft(next);
    evaluate(next);
  };

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
            <label htmlFor="printer-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="printer-currency"
              aria-label="Display currency"
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
        <ThreeDPrinterBuyVsOutsourceForm
          draft={draft}
          errors={errors}
          onDraftChange={(next) => {
            setConversionError(null);
            setDraft(next);
            evaluate(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            const fresh = inputToDraft(DEFAULT_THREE_D_PRINTER_INPUT);
            setDraft(fresh);
            setErrors({});
            setResult(calculateThreeDPrinter(DEFAULT_THREE_D_PRINTER_INPUT));
            setCopied(false);
            setConversionError(null);
          }}
        />
        <ThreeDPrinterBuyVsOutsourceResults
          result={result}
          copied={copied}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(result, currencyNote)).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
        />
      </div>
    </section>
  );
}