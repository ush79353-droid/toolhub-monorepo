'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import {
  CURRENCY_CONVERSION_STALE_NOTE,
  isCurrencyRateUsable,
} from '@/tools/shared/currency-rates';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { RentalCommissionForm } from './RentalCommissionForm';
import {
  createDefaultInput,
  type RentalCommissionFieldErrors,
  type RentalCommissionInput,
  type RentalCommissionResult,
} from './types';
import { validateRentalCommissionInput } from './validation';

const FX_NOTE =
  'Each money field has its own currency. Mixed currencies are normalized with live rates before calculating; percentages are never converted.';

function inputsEqual(a: RentalCommissionInput, b: RentalCommissionInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function RentalCommissionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<RentalCommissionInput>(() => defaults);
  const [input, setInput] = React.useState<RentalCommissionInput>(() => defaults);
  const [errors, setErrors] = React.useState<RentalCommissionFieldErrors>({});
  const [result, setResult] = React.useState<RentalCommissionResult | null>(null);
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const apply = (next: RentalCommissionInput) => {
    const validation = validateRentalCommissionInput(next, rates);
    let synced = next;
    if (validation.isValid && validation.result) {
      const r = validation.result;
      // Sync the paired rent field from canonical amounts (full precision strings).
      if (next.rentSource === 'annual' && next.annualRent.trim() !== '') {
        const monthlyInDisplay = convertCurrency({
          amount: r.monthlyRentCanonical,
          from: r.annualCurrency,
          to: next.monthlyCurrency,
          rates: rates.rates,
        });
        if (monthlyInDisplay.ok) {
          synced = {
            ...next,
            monthlyRent: moneyAmountToInputString(monthlyInDisplay.amount),
          };
        }
      } else if (next.rentSource === 'monthly' && next.monthlyRent.trim() !== '') {
        const annualInDisplay = convertCurrency({
          amount: r.annualRentCanonical,
          from: r.annualCurrency,
          to: next.annualCurrency,
          rates: rates.rates,
        });
        if (annualInDisplay.ok) {
          synced = {
            ...next,
            annualRent: moneyAmountToInputString(annualInDisplay.amount),
          };
        }
      }
    }
    setInput(synced);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateRentalCommissionInput(fresh, rates);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setConversionError(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const convertFieldAmount = (
    amountText: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(amountText);
    if (!Number.isFinite(amount)) return amountText === '' ? '' : null;
    if (from === to) return moneyAmountToInputString(amount);
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return null;
    return moneyAmountToInputString(converted.amount);
  };

  const handleAnnualCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.annualCurrency) return;
    const convertedText = convertFieldAmount(
      input.annualRent,
      input.annualCurrency,
      next
    );
    if (convertedText === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    apply({
      ...input,
      annualCurrency: next,
      annualRent: convertedText,
      rentSource: 'annual',
    });
  };

  const handleMonthlyCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.monthlyCurrency) return;
    const convertedText = convertFieldAmount(
      input.monthlyRent,
      input.monthlyCurrency,
      next
    );
    if (convertedText === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    apply({
      ...input,
      monthlyCurrency: next,
      monthlyRent: convertedText,
      rentSource: 'monthly',
    });
  };

  const handleResultCurrencyChange = (
    field:
      | 'halfMonthCurrency'
      | 'oneMonthCurrency'
      | 'oneHalfMonthCurrency'
      | 'customAmountCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    // Result currencies only re-express outputs; require a path from annual currency.
    if (!canConvertPair(input.annualCurrency, next) && !canConvertPair(input.monthlyCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    apply({ ...input, [field]: next });
  };

  const dirty = !inputsEqual(input, baseline);
  const currencyNote = !ratesStatus.available
    ? CURRENCY_CONVERSION_UNAVAILABLE_NOTE
    : ratesStatus.isStale
      ? `${FX_NOTE} ${CURRENCY_CONVERSION_STALE_NOTE}`
      : FX_NOTE;
  const ratesWarning = ratesStatus.warning;

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Annual rent: ${getCurrencySymbol(result.annualCurrency)}${result.formattedAnnualRent}`,
        `Monthly rent: ${getCurrencySymbol(result.monthlyCurrency)}${result.formattedMonthlyRent}`,
        `½ month: ${getCurrencySymbol(result.halfMonthCurrency)}${result.formattedHalfMonth}`,
        `1 month: ${getCurrencySymbol(result.oneMonthCurrency)}${result.formattedOneMonth}`,
        `1½ months: ${getCurrencySymbol(result.oneHalfMonthCurrency)}${result.formattedOneHalfMonth}`,
        `Custom ${result.customPercent}%: ${getCurrencySymbol(result.customAmountCurrency)}${result.formattedCustomAmount}`,
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
        <RentalCommissionForm
          input={input}
          errors={errors}
          result={result}
          conversionError={conversionError}
          ratesWarning={ratesWarning}
          onChange={apply}
          onAnnualCurrencyChange={handleAnnualCurrencyChange}
          onMonthlyCurrencyChange={handleMonthlyCurrencyChange}
          onResultCurrencyChange={handleResultCurrencyChange}
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
