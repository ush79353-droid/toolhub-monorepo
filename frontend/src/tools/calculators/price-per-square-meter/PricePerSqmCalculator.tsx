'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { PricePerSqmForm } from './PricePerSqmForm';
import { PricePerSqmResults } from './PricePerSqmResults';
import {
  createDefaultInput,
  type PricePerSqmFieldErrors,
  type PricePerSqmInput,
  type PricePerSqmResult,
} from './types';
import { validatePricePerSqmInput } from './validation';

function inputsEqual(a: PricePerSqmInput, b: PricePerSqmInput): boolean {
  return (
    a.calculationMode === b.calculationMode &&
    a.pricingContext === b.pricingContext &&
    a.rentalPeriod === b.rentalPeriod &&
    a.currency === b.currency &&
    a.price === b.price &&
    a.area === b.area &&
    a.pricePerArea === b.pricePerArea &&
    a.areaUnit === b.areaUnit &&
    a.compareSecondProperty === b.compareSecondProperty &&
    a.secondPrice === b.secondPrice &&
    a.secondArea === b.secondArea &&
    a.secondPricePerArea === b.secondPricePerArea &&
    a.secondAreaUnit === b.secondAreaUnit
  );
}

export function PricePerSquareMeterCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<PricePerSqmInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<PricePerSqmInput>(() => defaults);
  const [errors, setErrors] = React.useState<PricePerSqmFieldErrors>({});
  const [result, setResult] = React.useState<PricePerSqmResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: PricePerSqmInput) => {
    const validation = validatePricePerSqmInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.currency) return;
    apply({ ...input, currency: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validatePricePerSqmInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const symbol = getCurrencySymbol(input.currency);
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Unit price: ${result.formattedPricePerArea} ${result.pricePerAreaUnitLabel}`,
        `Price/rent: ${symbol}${result.formattedPrice} ${result.currency}`,
        `Area: ${result.formattedArea}`,
        result.formattedAbsoluteDifference !== null
          ? `Difference (B−A): ${result.formattedAbsoluteDifference}`
          : null,
        result.formattedPercentageDifference !== null
          ? `Relative vs A: ${result.formattedPercentageDifference}%`
          : null,
        result.cheaperLabel,
        'Formula: Price per area = Price / Area',
      ]
        .filter(Boolean)
        .join('\n')
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
          <p className="text-xs font-normal text-muted-foreground">
            Calculate price or rent per square meter (or foot), reverse to total
            price or area, and optionally compare a second property.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <PricePerSqmForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onCurrencyChange={handleCurrencyChange}
        />

        <PricePerSqmResults result={result} />

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
                  ? 'border-primary bg-primary/10 text-accent'
                  : 'border-border bg-white'
              }`}
              aria-pressed={feedback === 'yes'}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary/10 text-accent'
                  : 'border-border bg-white'
              }`}
              aria-pressed={feedback === 'no'}
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
