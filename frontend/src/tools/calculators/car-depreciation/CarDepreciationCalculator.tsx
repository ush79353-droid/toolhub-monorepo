'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  isCurrencyRateUsable,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { CarDepreciationForm } from './CarDepreciationForm';
import { CAR_DEPRECIATION_ANNUAL_RATE } from './content';
import {
  createDefaultInput,
  type CarDepreciationFieldErrors,
  type CarDepreciationInput,
  type CarDepreciationResult,
} from './types';
import { validateCarDepreciationInput } from './validation';

const FX_NOTE =
  'Initial value and every money result have independent currencies. Declining-balance math runs in the initial-value currency at a disclosed 15% annual rate; results convert for display. Car age and the depreciation rate are never converted. Missing rates block conversion; stale rates warn but still convert.';

function inputsEqual(a: CarDepreciationInput, b: CarDepreciationInput): boolean {
  return (
    a.initialValue === b.initialValue &&
    a.initialValueCurrency === b.initialValueCurrency &&
    a.carAgeYears === b.carAgeYears &&
    a.reducedValueCurrency === b.reducedValueCurrency &&
    a.after1MinuteCurrency === b.after1MinuteCurrency &&
    a.after1YearCurrency === b.after1YearCurrency &&
    a.after2YearsCurrency === b.after2YearsCurrency &&
    a.after3YearsCurrency === b.after3YearsCurrency &&
    a.after4YearsCurrency === b.after4YearsCurrency &&
    a.after5YearsCurrency === b.after5YearsCurrency &&
    a.afterOpen === b.afterOpen
  );
}

export function CarDepreciationCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<CarDepreciationInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<CarDepreciationInput>(() => defaults);
  const [errors, setErrors] = React.useState<CarDepreciationFieldErrors>({});
  const [result, setResult] = React.useState<CarDepreciationResult | null>(null);
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

  const apply = (next: CarDepreciationInput) => {
    const validation = validateCarDepreciationInput(next, rates);
    setConversionError(null);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const convertFieldAmount = (
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): { ok: true; text: string } | { ok: false } => {
    if (from === to) return { ok: true, text: raw };
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return { ok: true, text: raw };
    if (!canConvertPair(from, to)) return { ok: false };
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return { ok: false };
    return { ok: true, text: moneyAmountToInputString(converted.amount) };
  };

  const handleInitialValueCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.initialValueCurrency) return;
    const converted = convertFieldAmount(
      input.initialValue,
      input.initialValueCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({
      ...input,
      initialValueCurrency: next,
      initialValue: converted.text,
    });
  };

  const handleDisplayCurrencyChange =
    (
      key:
        | 'reducedValueCurrency'
        | 'after1MinuteCurrency'
        | 'after1YearCurrency'
        | 'after2YearsCurrency'
        | 'after3YearsCurrency'
        | 'after4YearsCurrency'
        | 'after5YearsCurrency'
    ) =>
    (next: SupportedCurrency) => {
      if (next === input[key]) return;
      if (!canConvertPair(input.initialValueCurrency, next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      apply({ ...input, [key]: next });
    };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateCarDepreciationInput(fresh, rates);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setConversionError(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const currencyNote = ratesStatus.available
    ? FX_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const reducedSymbol = getCurrencySymbol(
    result?.reducedValueCurrency ?? input.reducedValueCurrency
  );
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Initial: ${input.initialValue} ${input.initialValueCurrency}`,
        `Age: ${input.carAgeYears} yrs`,
        `Illustrative rate: ${CAR_DEPRECIATION_ANNUAL_RATE * 100}% / year`,
        `Reduced value: ${reducedSymbol}${result.formattedReducedValue} ${result.reducedValueCurrency}`,
        `After 1 year: ${result.formattedAfter1Year} ${result.after1YearCurrency}`,
        `After 5 years: ${result.formattedAfter5Years} ${result.after5YearsCurrency}`,
        `Formulas: V(t)=Initial×(1−r)^t; Reduced=V(age); After Δt=Reduced×(1−r)^Δt`,
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
          <p className="text-xs font-normal text-muted-foreground">
            {currencyNote}
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <CarDepreciationForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onInitialValueCurrencyChange={handleInitialValueCurrencyChange}
          onReducedValueCurrencyChange={handleDisplayCurrencyChange(
            'reducedValueCurrency'
          )}
          onAfter1MinuteCurrencyChange={handleDisplayCurrencyChange(
            'after1MinuteCurrency'
          )}
          onAfter1YearCurrencyChange={handleDisplayCurrencyChange(
            'after1YearCurrency'
          )}
          onAfter2YearsCurrencyChange={handleDisplayCurrencyChange(
            'after2YearsCurrency'
          )}
          onAfter3YearsCurrencyChange={handleDisplayCurrencyChange(
            'after3YearsCurrency'
          )}
          onAfter4YearsCurrencyChange={handleDisplayCurrencyChange(
            'after4YearsCurrency'
          )}
          onAfter5YearsCurrencyChange={handleDisplayCurrencyChange(
            'after5YearsCurrency'
          )}
          conversionError={conversionError}
          ratesWarning={ratesStatus.warning}
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
