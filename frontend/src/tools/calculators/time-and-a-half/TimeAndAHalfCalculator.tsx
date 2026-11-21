'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
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
import { TimeAndAHalfForm } from './TimeAndAHalfForm';
import {
  createDefaultInput,
  type TimeAndAHalfFieldErrors,
  type TimeAndAHalfInput,
  type TimeAndAHalfResult,
} from './types';
import { validateTimeAndAHalfInput } from './validation';

const FX_NOTE =
  'Each money field has its own currency. Math runs in the standard pay rate currency; premium rates and earnings convert for display. Hours and 1.5/2/3 multipliers never convert. Missing rates block conversion; stale rates warn but still convert.';

type MoneyCurrencyKey = keyof Pick<
  TimeAndAHalfInput,
  | 'standardRateCurrency'
  | 'timeAndHalfRateCurrency'
  | 'doubleTimeRateCurrency'
  | 'tripleTimeRateCurrency'
  | 'standardPayCurrency'
  | 'timeAndHalfPayCurrency'
  | 'doubleTimePayCurrency'
  | 'tripleTimePayCurrency'
  | 'totalPayCurrency'
>;

function inputsEqual(a: TimeAndAHalfInput, b: TimeAndAHalfInput): boolean {
  return (
    a.standardRate === b.standardRate &&
    a.standardRateCurrency === b.standardRateCurrency &&
    a.timeAndHalfRateCurrency === b.timeAndHalfRateCurrency &&
    a.doubleTimeRateCurrency === b.doubleTimeRateCurrency &&
    a.tripleTimeRateCurrency === b.tripleTimeRateCurrency &&
    a.standardHours === b.standardHours &&
    a.timeAndHalfHours === b.timeAndHalfHours &&
    a.doubleTimeHours === b.doubleTimeHours &&
    a.tripleTimeHours === b.tripleTimeHours &&
    a.standardPayCurrency === b.standardPayCurrency &&
    a.timeAndHalfPayCurrency === b.timeAndHalfPayCurrency &&
    a.doubleTimePayCurrency === b.doubleTimePayCurrency &&
    a.tripleTimePayCurrency === b.tripleTimePayCurrency &&
    a.totalPayCurrency === b.totalPayCurrency &&
    a.ratesOpen === b.ratesOpen &&
    a.hoursOpen === b.hoursOpen &&
    a.earningsOpen === b.earningsOpen
  );
}

export function TimeAndAHalfCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<TimeAndAHalfInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<TimeAndAHalfInput>(() => defaults);
  const [errors, setErrors] = React.useState<TimeAndAHalfFieldErrors>({});
  const [result, setResult] = React.useState<TimeAndAHalfResult | null>(null);
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

  const apply = (next: TimeAndAHalfInput) => {
    const validation = validateTimeAndAHalfInput(next, rates);
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

  const handleMoneyCurrencyChange = (
    key: MoneyCurrencyKey,
    next: SupportedCurrency
  ) => {
    const prev = input[key];
    if (prev === next) return;

    if (key === 'standardRateCurrency') {
      const amount = parseMoneyInput(input.standardRate);
      if (Number.isFinite(amount) && input.standardRate.trim() !== '') {
        if (!canConvertPair(prev, next)) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          return;
        }
        const converted = convertCurrency({
          amount,
          from: prev,
          to: next,
          rates: rates.rates,
        });
        if (!converted.ok) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          return;
        }
        apply({
          ...input,
          standardRateCurrency: next,
          standardRate: moneyAmountToInputString(converted.amount),
        });
        return;
      }
      apply({ ...input, standardRateCurrency: next });
      return;
    }

    if (!canConvertPair(input.standardRateCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, [key]: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateTimeAndAHalfInput(fresh, rates);
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

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Standard rate: ${getCurrencySymbol(result.standardRateCurrency)}${result.formattedStandardRate} ${result.standardRateCurrency}`,
        `Time-and-a-half rate: ${getCurrencySymbol(result.timeAndHalfRateCurrency)}${result.formattedTimeAndHalfRate}`,
        `Double-time rate: ${getCurrencySymbol(result.doubleTimeRateCurrency)}${result.formattedDoubleTimeRate}`,
        `Triple-time rate: ${getCurrencySymbol(result.tripleTimeRateCurrency)}${result.formattedTripleTimeRate}`,
        `Hours: standard ${input.standardHours || '0'} · 1.5× ${input.timeAndHalfHours || '0'} · 2× ${input.doubleTimeHours || '0'} · 3× ${input.tripleTimeHours || '0'}`,
        `Standard pay: ${getCurrencySymbol(result.standardPayCurrency)}${result.formattedStandardPay}`,
        `Time-and-a-half pay: ${getCurrencySymbol(result.timeAndHalfPayCurrency)}${result.formattedTimeAndHalfPay}`,
        `Double-time pay: ${getCurrencySymbol(result.doubleTimePayCurrency)}${result.formattedDoubleTimePay}`,
        `Triple-time pay: ${getCurrencySymbol(result.tripleTimePayCurrency)}${result.formattedTripleTimePay}`,
        `Total: ${getCurrencySymbol(result.totalPayCurrency)}${result.formattedTotalPay} ${result.totalPayCurrency}`,
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
        <TimeAndAHalfForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onMoneyCurrencyChange={handleMoneyCurrencyChange}
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
