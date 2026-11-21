'use client';

import * as React from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import { MarginAndVatForm } from './MarginAndVatForm';
import {
  createDefaultInput,
  type MarginVatFieldErrors,
  type MarginVatInput,
  type MarginVatResult,
} from './types';
import { validateMarginVatInput } from './validation';

const FX_NOTE =
  'Net cost, gross cost, net price, gross price, and profit each have their own currency. Amounts are normalized into the net-cost currency before margin/VAT math. Currency-only changes do not alter VAT, margin, or markup percentages.';

function syncDerivedFields(input: MarginVatInput, result: MarginVatResult): MarginVatInput {
  const next = { ...input };
  const driver = input.driver;

  if (driver !== 'vat') {
    next.vatPercent = result.formattedVatPercent;
  }

  if (driver !== 'netCost' && result.netCost !== null) {
    next.netCost = moneyAmountToInputString(result.netCost);
  }
  if (driver !== 'grossCost' && result.grossCost !== null) {
    next.grossCost = moneyAmountToInputString(result.grossCost);
  }
  if (driver !== 'margin' && result.marginPercent !== null) {
    next.marginPercent = result.formattedMarginPercent;
  }
  if (driver !== 'markup' && result.markupPercent !== null) {
    next.markupPercent = result.formattedMarkupPercent;
  }
  if (driver !== 'netPrice' && result.netPrice !== null) {
    next.netPrice = moneyAmountToInputString(result.netPrice);
  }
  if (driver !== 'grossPrice' && result.grossPrice !== null) {
    next.grossPrice = moneyAmountToInputString(result.grossPrice);
  }
  if (driver !== 'profit' && result.profit !== null) {
    next.profit = moneyAmountToInputString(result.profit);
  }

  return next;
}

function buildSummary(
  title: string,
  result: MarginVatResult,
  currencyNote: string
): string {
  const line = (label: string, symbol: string, formatted: string, unit = '') =>
    formatted ? `${label}: ${symbol}${formatted}${unit}` : null;

  return [
    `${title} | Omega Calculators`,
    result.formattedVatPercent ? `VAT: ${result.formattedVatPercent}%` : null,
    line(
      'Net cost',
      getCurrencySymbol(result.netCostCurrency),
      result.formattedNetCost
    ),
    line(
      'Gross cost',
      getCurrencySymbol(result.grossCostCurrency),
      result.formattedGrossCost
    ),
    result.formattedMarginPercent
      ? `Margin: ${result.formattedMarginPercent}%`
      : null,
    result.formattedMarkupPercent
      ? `Markup: ${result.formattedMarkupPercent}%`
      : null,
    line(
      'My net price',
      getCurrencySymbol(result.netPriceCurrency),
      result.formattedNetPrice
    ),
    line(
      'My gross price',
      getCurrencySymbol(result.grossPriceCurrency),
      result.formattedGrossPrice
    ),
    line('Profit', getCurrencySymbol(result.profitCurrency), result.formattedProfit),
    currencyNote,
  ]
    .filter(Boolean)
    .join('\n');
}

export function MarginAndVatCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [input, setInput] = React.useState<MarginVatInput>(() => defaults);
  const [errors, setErrors] = React.useState<MarginVatFieldErrors>({});
  const [result, setResult] = React.useState<MarginVatResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  const apply = (next: MarginVatInput) => {
    const validation = validateMarginVatInput(next, rates);
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

  const handleReload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setCopied(false);
    setFeedback(null);
  };

  const currencyNote = ratesStatus.available ? FX_NOTE : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const summary = result ? buildSummary(metadata.title, result, currencyNote) : '';
  const isDefault =
    input.vatPercent === defaults.vatPercent &&
    input.netCost === defaults.netCost &&
    input.grossCost === defaults.grossCost &&
    input.marginPercent === defaults.marginPercent &&
    input.markupPercent === defaults.markupPercent &&
    input.netPrice === defaults.netPrice &&
    input.grossPrice === defaults.grossPrice &&
    input.profit === defaults.profit;

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
        <MarginAndVatForm
          input={input}
          errors={errors}
          canShare={Boolean(summary)}
          shareLabel={copied ? 'Copied!' : 'Share result'}
          clearDisabled={isDefault}
          onChange={apply}
          onReload={handleReload}
          onClear={handleReload}
          onShare={async () => {
            if (!summary) return;
            if (await copyTextToClipboard(summary)) {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }
          }}
        />

        <div className="rounded-xl border border-border bg-muted/10 px-3.5 py-3">
          <p className="text-xs font-medium text-accent">Did we solve your problem today?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                feedback === 'yes'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Yes
            </button>
            <button
              type="button"
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              No
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
