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
import { SemiMonthlyPayForm } from './SemiMonthlyPayForm';
import {
  createDefaultInput,
  type SemiMonthlyPayFieldErrors,
  type SemiMonthlyPayInput,
  type SemiMonthlyPayResult,
  type SemiMonthlyPaySourceField,
} from './types';
import { validateSemiMonthlyPayInput } from './validation';

const FX_NOTE =
  'Each wage input and the semi-monthly result have independent currencies. Math runs in the last-edited wage currency; peers and the answer convert for display. Hours and days per week are never converted. Missing rates block conversion; stale rates warn but still convert. Semi-monthly means twice per month (24 periods/year), not biweekly (26).';

function inputsEqual(a: SemiMonthlyPayInput, b: SemiMonthlyPayInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function sourceCurrencyOf(state: SemiMonthlyPayInput): SupportedCurrency {
  switch (state.sourceField) {
    case 'hourly':
      return state.hourlyWageCurrency;
    case 'daily':
      return state.dailyWageCurrency;
    case 'weekly':
      return state.weeklyWageCurrency;
    case 'monthly':
      return state.monthlyWageCurrency;
    case 'yearly':
      return state.yearlyWageCurrency;
  }
}

function sourceRawOf(state: SemiMonthlyPayInput): string {
  switch (state.sourceField) {
    case 'hourly':
      return state.hourlyWage;
    case 'daily':
      return state.dailyWage;
    case 'weekly':
      return state.weeklyWage;
    case 'monthly':
      return state.monthlyWage;
    case 'yearly':
      return state.yearlyWage;
  }
}

export function SemiMonthlyPayCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<SemiMonthlyPayInput>(
    () => defaults,
  );
  const [input, setInput] = React.useState<SemiMonthlyPayInput>(() => defaults);
  const [errors, setErrors] = React.useState<SemiMonthlyPayFieldErrors>({});
  const [result, setResult] = React.useState<SemiMonthlyPayResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [conversionError, setConversionError] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: SemiMonthlyPayInput) => {
    const validation = validateSemiMonthlyPayInput(next, rates);
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
    to: SupportedCurrency,
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

  const handleWageCurrencyChange = (
    field: SemiMonthlyPaySourceField,
    next: SupportedCurrency,
  ) => {
    const currencyKey = {
      hourly: 'hourlyWageCurrency',
      daily: 'dailyWageCurrency',
      weekly: 'weeklyWageCurrency',
      monthly: 'monthlyWageCurrency',
      yearly: 'yearlyWageCurrency',
    }[field] as keyof SemiMonthlyPayInput;
    const amountKey = {
      hourly: 'hourlyWage',
      daily: 'dailyWage',
      weekly: 'weeklyWage',
      monthly: 'monthlyWage',
      yearly: 'yearlyWage',
    }[field] as keyof SemiMonthlyPayInput;

    const currentCurrency = input[currencyKey] as SupportedCurrency;
    if (currentCurrency === next) return;

    if (input.sourceField === field) {
      const converted = convertFieldAmount(
        sourceRawOf(input),
        currentCurrency,
        next,
      );
      if (!converted.ok) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      apply({
        ...input,
        [currencyKey]: next,
        [amountKey]: converted.text,
      } as SemiMonthlyPayInput);
      return;
    }

    if (!canConvertPair(sourceCurrencyOf(input), next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, [currencyKey]: next } as SemiMonthlyPayInput);
  };

  const handleSemiMonthlyCurrencyChange = (next: SupportedCurrency) => {
    if (input.semiMonthlyCurrency === next) return;
    if (!canConvertPair(sourceCurrencyOf(input), next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, semiMonthlyCurrency: next });
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
  const currencyNote = ratesStatus.available
    ? FX_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Source: ${result.sourceField} wage`,
        `Semi-monthly: ${getCurrencySymbol(result.semiMonthlyCurrency)}${result.formattedSemiMonthly} ${result.semiMonthlyCurrency}`,
        `Hours/week: ${input.hoursPerWeek}`,
        `Days/week: ${input.daysPerWeek}`,
        `Assumptions: 52 paid weeks/year; 24 semi-monthly periods (twice per month, not biweekly)`,
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
        <SemiMonthlyPayForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onWageCurrencyChange={handleWageCurrencyChange}
          onSemiMonthlyCurrencyChange={handleSemiMonthlyCurrencyChange}
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
