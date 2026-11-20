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
import { MonthlyIncomeForm } from './MonthlyIncomeForm';
import {
  createDefaultInput,
  type MonthlyIncomeFieldErrors,
  type MonthlyIncomeInput,
  type MonthlyIncomeResult,
  type MonthlyIncomeSourceField,
} from './types';
import { validateMonthlyIncomeInput } from './validation';

const FX_NOTE =
  'Each earnings field and monthly income has its own currency. Math runs in the last-edited earnings currency; other amounts convert for display. Hours, days, and weeks are never converted.';

const CURRENCY_KEY: Record<
  MonthlyIncomeSourceField,
  keyof Pick<
    MonthlyIncomeInput,
    'hourlyCurrency' | 'dailyCurrency' | 'weeklyCurrency' | 'yearlyCurrency'
  >
> = {
  hourly: 'hourlyCurrency',
  daily: 'dailyCurrency',
  weekly: 'weeklyCurrency',
  yearly: 'yearlyCurrency',
};

function inputsEqual(a: MonthlyIncomeInput, b: MonthlyIncomeInput): boolean {
  return (
    a.sourceField === b.sourceField &&
    a.hourly === b.hourly &&
    a.hourlyCurrency === b.hourlyCurrency &&
    a.daily === b.daily &&
    a.dailyCurrency === b.dailyCurrency &&
    a.weekly === b.weekly &&
    a.weeklyCurrency === b.weeklyCurrency &&
    a.yearly === b.yearly &&
    a.yearlyCurrency === b.yearlyCurrency &&
    a.adjustSchedule === b.adjustSchedule &&
    a.hoursPerDay === b.hoursPerDay &&
    a.daysPerWeek === b.daysPerWeek &&
    a.weeksPerYear === b.weeksPerYear &&
    a.monthlyCurrency === b.monthlyCurrency &&
    a.earnOpen === b.earnOpen
  );
}

function sourceCurrency(state: MonthlyIncomeInput): SupportedCurrency {
  return state[CURRENCY_KEY[state.sourceField]];
}

export function MonthlyIncomeCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState(defaults);
  const [input, setInput] = React.useState(defaults);
  const [errors, setErrors] = React.useState<MonthlyIncomeFieldErrors>({});
  const [result, setResult] = React.useState<MonthlyIncomeResult | null>(null);
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

  const apply = (next: MonthlyIncomeInput) => {
    const validation = validateMonthlyIncomeInput(next, rates);
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

  const handleEarnCurrencyChange = (
    field: MonthlyIncomeSourceField,
    next: SupportedCurrency
  ) => {
    const cKey = CURRENCY_KEY[field];
    if (input[cKey] === next) return;
    if (input.sourceField === field) {
      const amount = parseMoneyInput(input[field]);
      if (Number.isFinite(amount) && input[field].trim() !== '') {
        if (!canConvertPair(input[cKey], next)) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          return;
        }
        const converted = convertCurrency({
          amount,
          from: input[cKey],
          to: next,
          rates: rates.rates,
        });
        if (!converted.ok) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          return;
        }
        apply({
          ...input,
          [cKey]: next,
          [field]: moneyAmountToInputString(converted.amount),
        });
        return;
      }
    } else if (!canConvertPair(sourceCurrency(input), next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, [cKey]: next });
  };

  const handleMonthlyCurrencyChange = (next: SupportedCurrency) => {
    if (input.monthlyCurrency === next) return;
    if (!canConvertPair(sourceCurrency(input), next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, monthlyCurrency: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateMonthlyIncomeInput(fresh, rates);
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
        `Source: ${result.sourceField}`,
        `Hourly: ${result.formattedHourly} ${result.hourlyCurrency}`,
        `Daily: ${result.formattedDaily} ${result.dailyCurrency}`,
        `Weekly: ${result.formattedWeekly} ${result.weeklyCurrency}`,
        `Yearly: ${result.formattedYearly} ${result.yearlyCurrency}`,
        `Monthly: ${getCurrencySymbol(result.monthlyCurrency)}${result.formattedMonthly} ${result.monthlyCurrency}`,
        `Schedule: ${input.hoursPerDay}h/day · ${input.daysPerWeek}d/week · ${input.weeksPerYear}w/year`,
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
        <MonthlyIncomeForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onEarnCurrencyChange={handleEarnCurrencyChange}
          onMonthlyCurrencyChange={handleMonthlyCurrencyChange}
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
