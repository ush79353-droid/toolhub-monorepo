'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { MarginAndMarkupForm } from './MarginAndMarkupForm';
import {
  createDefaultInput,
  type MarginAndMarkupFieldErrors,
  type MarginAndMarkupInput,
  type MarginAndMarkupResult,
} from './types';
import { validateMarginAndMarkupInput } from './validation';

const FX_NOTE =
  'Cost, revenue, and profit each have their own currency. Amounts normalize into the cost currency before formulas. Changing a currency converts that amount; margin and markup percentages never convert.';

function inputsEqual(a: MarginAndMarkupInput, b: MarginAndMarkupInput): boolean {
  return (
    a.cost === b.cost &&
    a.costCurrency === b.costCurrency &&
    a.compareTwo === b.compareTwo &&
    a.margin === b.margin &&
    a.markup === b.markup &&
    a.revenue === b.revenue &&
    a.revenueCurrency === b.revenueCurrency &&
    a.profit === b.profit &&
    a.profitCurrency === b.profitCurrency &&
    a.margin2 === b.margin2 &&
    a.markup2 === b.markup2 &&
    a.revenue2 === b.revenue2 &&
    a.profit2 === b.profit2
  );
}

export function MarginAndMarkupCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const initial = validateMarginAndMarkupInput(defaults, rates);
  const [baseline, setBaseline] = React.useState<MarginAndMarkupInput>(() => defaults);
  const [input, setInput] = React.useState<MarginAndMarkupInput>(() => defaults);
  const [errors, setErrors] = React.useState<MarginAndMarkupFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<MarginAndMarkupResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: MarginAndMarkupInput) => {
    const validation = validateMarginAndMarkupInput(next, rates);
    let merged = next;
    if (validation.synced) {
      const synced = { ...validation.synced };
      // Keep the active driver text as typed (avoid cursor jumps / circular writes).
      if (next.driver === 'margin') delete synced.margin;
      if (next.driver === 'markup') delete synced.markup;
      if (next.driver === 'revenue') delete synced.revenue;
      if (next.driver === 'profit') delete synced.profit;
      if (next.driver2 === 'margin') delete synced.margin2;
      if (next.driver2 === 'markup') delete synced.markup2;
      if (next.driver2 === 'revenue') delete synced.revenue2;
      if (next.driver2 === 'profit') delete synced.profit2;
      merged = { ...next, ...synced };
    }
    setInput(merged);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateMarginAndMarkupInput(fresh, rates);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const currencyNote = ratesStatus.available
    ? FX_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Cost: ${getCurrencySymbol(input.costCurrency)}${input.cost}`,
        `Margin: ${result.scenario1.formattedMargin}%`,
        `Markup: ${result.scenario1.formattedMarkup}%`,
        `Revenue: ${getCurrencySymbol(input.revenueCurrency)}${result.scenario1.formattedRevenue}`,
        `Profit: ${getCurrencySymbol(input.profitCurrency)}${result.scenario1.formattedProfit}`,
        ...(result.scenario2
          ? [
              `Scenario 2 margin: ${result.scenario2.formattedMargin}%`,
              `Scenario 2 markup: ${result.scenario2.formattedMarkup}%`,
              `Scenario 2 revenue: ${getCurrencySymbol(input.revenueCurrency)}${result.scenario2.formattedRevenue}`,
              `Scenario 2 profit: ${getCurrencySymbol(input.profitCurrency)}${result.scenario2.formattedProfit}`,
            ]
          : []),
        currencyNote,
      ].join('\n')
    : '';

  const handleShare = async () => {
    if (!summary) return;
    if (canShare) {
      try {
        await navigator.share({ title: metadata.title, text: summary });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through
      }
    }
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
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
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <MarginAndMarkupForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
        />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={handleReset}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty}
              onClick={handleReset}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'yes'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              <span>No</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
