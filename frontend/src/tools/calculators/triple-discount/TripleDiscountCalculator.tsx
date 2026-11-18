'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { TripleDiscountForm } from './TripleDiscountForm';
import {
  createDefaultInput,
  type TripleDiscountFieldErrors,
  type TripleDiscountInput,
  type TripleDiscountResult,
} from './types';

const FX_NOTE =
  'Original price, final price, and price difference each have their own currency. Discount math runs in the original-price currency; results convert for display. The three discount percents and effective discount % are never converted.';

function inputsEqual(a: TripleDiscountInput, b: TripleDiscountInput): boolean {
  return (
    a.originalPrice === b.originalPrice &&
    a.originalPriceCurrency === b.originalPriceCurrency &&
    a.firstDiscountPercent === b.firstDiscountPercent &&
    a.secondDiscountPercent === b.secondDiscountPercent &&
    a.thirdDiscountPercent === b.thirdDiscountPercent &&
    a.finalPriceCurrency === b.finalPriceCurrency &&
    a.priceDifferenceCurrency === b.priceDifferenceCurrency &&
    a.effectiveOpen === b.effectiveOpen
  );
}

export function TripleDiscountCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<TripleDiscountInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<TripleDiscountInput>(() => defaults);
  const [errors, setErrors] = React.useState<TripleDiscountFieldErrors>({});
  const [result, setResult] = React.useState<TripleDiscountResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [conversionError, setConversionError] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: TripleDiscountInput) => {
    setConversionError(null);
    setInput(next);
    setErrors({});
    setResult(null);
  };

  const handleOriginalPriceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.originalPriceCurrency) return;
    apply({ ...input, originalPriceCurrency: next });
  };

  const handleFinalPriceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.finalPriceCurrency) return;
    apply({ ...input, finalPriceCurrency: next });
  };

  const handlePriceDifferenceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.priceDifferenceCurrency) return;
    apply({ ...input, priceDifferenceCurrency: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
    setConversionError(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const priceSymbol = getCurrencySymbol(input.originalPriceCurrency);
  const finalSymbol = getCurrencySymbol(
    result?.finalPriceCurrency ?? input.finalPriceCurrency
  );
  const diffSymbol = getCurrencySymbol(
    result?.priceDifferenceCurrency ?? input.priceDifferenceCurrency
  );
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Original price: ${priceSymbol}${input.originalPrice} ${input.originalPriceCurrency}`,
        `1st discount: ${input.firstDiscountPercent}%`,
        `2nd discount: ${input.secondDiscountPercent}%`,
        `3rd discount: ${input.thirdDiscountPercent}%`,
        `Final price: ${finalSymbol}${result.formattedFinalPrice} ${result.finalPriceCurrency}`,
        `Price difference: ${diffSymbol}${result.formattedPriceDifference} ${result.priceDifferenceCurrency}`,
        `Effective discount: ${result.formattedEffectiveDiscountPercent}%`,
        `Formulas: Final = P×(1−D1/100)×(1−D2/100)×(1−D3/100); Diff = P−Final; Effective = [1−∏(1−Di/100)]×100`,
        FX_NOTE,
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
          <p className="text-xs font-normal text-muted-foreground">{FX_NOTE}</p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <TripleDiscountForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onOriginalPriceCurrencyChange={handleOriginalPriceCurrencyChange}
          onFinalPriceCurrencyChange={handleFinalPriceCurrencyChange}
          onPriceDifferenceCurrencyChange={handlePriceDifferenceCurrencyChange}
          conversionError={conversionError}
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
