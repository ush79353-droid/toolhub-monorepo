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
import {
  HourlyToAnnualSalaryForm,
  type OutputCurrencyKey,
} from './HourlyToAnnualSalaryForm';
import {
  createDefaultInput,
  type HourlyToAnnualSalaryFieldErrors,
  type HourlyToAnnualSalaryInput,
  type HourlyToAnnualSalaryResult,
} from './types';
import { validateHourlyToAnnualSalaryInput } from './validation';

const FX_NOTE =
  'Hourly wage and each result (annual, monthly, weekly, daily) have their own currency. Salary math runs in the hourly wage currency; results convert for display. Hours and days per week are never converted. Missing rates block conversion; stale rates warn but still convert.';

function inputsEqual(
  a: HourlyToAnnualSalaryInput,
  b: HourlyToAnnualSalaryInput
): boolean {
  return (
    a.hourlyWage === b.hourlyWage &&
    a.hourlyWageCurrency === b.hourlyWageCurrency &&
    a.hoursPerWeek === b.hoursPerWeek &&
    a.daysPerWeek === b.daysPerWeek &&
    a.annualCurrency === b.annualCurrency &&
    a.monthlyCurrency === b.monthlyCurrency &&
    a.weeklyCurrency === b.weeklyCurrency &&
    a.dailyCurrency === b.dailyCurrency &&
    a.dataOpen === b.dataOpen &&
    a.resultsOpen === b.resultsOpen
  );
}

export function HourlyToAnnualSalaryCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<HourlyToAnnualSalaryInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<HourlyToAnnualSalaryInput>(
    () => defaults
  );
  const [errors, setErrors] = React.useState<HourlyToAnnualSalaryFieldErrors>(
    {}
  );
  const [result, setResult] =
    React.useState<HourlyToAnnualSalaryResult | null>(null);
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

  const apply = (next: HourlyToAnnualSalaryInput) => {
    const validation = validateHourlyToAnnualSalaryInput(next, rates);
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

  const handleHourlyWageCurrencyChange = (next: SupportedCurrency) => {
    if (input.hourlyWageCurrency === next) return;
    const converted = convertFieldAmount(
      input.hourlyWage,
      input.hourlyWageCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({
      ...input,
      hourlyWageCurrency: next,
      hourlyWage: converted.text,
    });
  };

  const handleOutputCurrencyChange = (
    key: OutputCurrencyKey,
    next: SupportedCurrency
  ) => {
    if (input[key] === next) return;
    if (!canConvertPair(input.hourlyWageCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, [key]: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateHourlyToAnnualSalaryInput(fresh, rates);
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
        `Hourly wage: ${getCurrencySymbol(input.hourlyWageCurrency)}${input.hourlyWage} ${input.hourlyWageCurrency}`,
        `Hours/week: ${input.hoursPerWeek}`,
        `Days/week: ${input.daysPerWeek}`,
        `Annual: ${getCurrencySymbol(result.annualCurrency)}${result.formattedAnnual} ${result.annualCurrency}`,
        `Monthly: ${getCurrencySymbol(result.monthlyCurrency)}${result.formattedMonthly} ${result.monthlyCurrency}`,
        `Per week: ${getCurrencySymbol(result.weeklyCurrency)}${result.formattedWeekly} ${result.weeklyCurrency}`,
        `Per day: ${getCurrencySymbol(result.dailyCurrency)}${result.formattedDaily} ${result.dailyCurrency}`,
        `Assumptions: weekly = hourly×hours; annual = weekly×52; monthly = annual/12; per day = weekly÷days`,
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
        <HourlyToAnnualSalaryForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onHourlyWageCurrencyChange={handleHourlyWageCurrencyChange}
          onOutputCurrencyChange={handleOutputCurrencyChange}
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
