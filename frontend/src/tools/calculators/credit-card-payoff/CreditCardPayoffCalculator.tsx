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
import { CreditCardPayoffForm } from './CreditCardPayoffForm';
import {
  createDefaultInput,
  type CreditCardPayoffFieldErrors,
  type CreditCardPayoffInput,
  type CreditCardPayoffResult,
} from './types';
import { validateCreditCardPayoffInput } from './validation';

const FX_NOTE =
  'Balance, monthly payment, and total paid each have their own currency. Payment amounts are normalized into the balance currency before calculating; total paid converts for display. APR and years/months/days are never converted.';

function inputsEqual(
  a: CreditCardPayoffInput,
  b: CreditCardPayoffInput
): boolean {
  return (
    a.balance === b.balance &&
    a.balanceCurrency === b.balanceCurrency &&
    a.aprPercent === b.aprPercent &&
    a.monthlyPayment === b.monthlyPayment &&
    a.monthlyPaymentCurrency === b.monthlyPaymentCurrency &&
    a.totalPaidCurrency === b.totalPaidCurrency
  );
}

type MoneyCurrencyField =
  | 'balanceCurrency'
  | 'monthlyPaymentCurrency'
  | 'totalPaidCurrency';

type MoneyAmountField = 'balance' | 'monthlyPayment';

const CURRENCY_AMOUNT: Partial<Record<MoneyCurrencyField, MoneyAmountField>> = {
  balanceCurrency: 'balance',
  monthlyPaymentCurrency: 'monthlyPayment',
};

export function CreditCardPayoffCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<CreditCardPayoffInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<CreditCardPayoffInput>(
    () => defaults
  );
  const [errors, setErrors] = React.useState<CreditCardPayoffFieldErrors>({});
  const [result, setResult] = React.useState<CreditCardPayoffResult | null>(
    null
  );
  const [conversionError, setConversionError] = React.useState<string | null>(
    null
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    const validation = validateCreditCardPayoffInput(defaults, rates);
    if (validation.isValid && validation.result) {
      setResult(validation.result);
      setErrors({});
    }
    // Initial sample only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: CreditCardPayoffInput) => {
    const validation = validateCreditCardPayoffInput(next, rates);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    setConversionError(null);
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const handleMoneyCurrencyChange =
    (currencyField: MoneyCurrencyField) => (next: SupportedCurrency) => {
      if (input[currencyField] === next) return;

      // Result-only currency: convert display target, keep amount untouched.
      if (currencyField === 'totalPaidCurrency') {
        if (
          next !== input.balanceCurrency &&
          !canConvertPair(input.balanceCurrency, next)
        ) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          return;
        }
        apply({ ...input, totalPaidCurrency: next });
        return;
      }

      const amountField = CURRENCY_AMOUNT[currencyField]!;
      const amount = parseMoneyInput(input[amountField]);
      const hasAmount = Number.isFinite(amount);

      if (currencyField === 'balanceCurrency') {
        if (
          input.monthlyPaymentCurrency !== next &&
          !canConvertPair(input.monthlyPaymentCurrency, next)
        ) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          return;
        }
        if (
          input.totalPaidCurrency !== next &&
          !canConvertPair(next, input.totalPaidCurrency)
        ) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          return;
        }
      } else if (
        next !== input.balanceCurrency &&
        !canConvertPair(next, input.balanceCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }

      if (!hasAmount) {
        apply({ ...input, [currencyField]: next });
        return;
      }

      if (!canConvertPair(input[currencyField], next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }

      const converted = convertCurrency({
        amount,
        from: input[currencyField],
        to: next,
        rates: rates.rates,
      });
      if (!converted.ok) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }

      apply({
        ...input,
        [currencyField]: next,
        [amountField]: moneyAmountToInputString(converted.amount),
      });
    };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateCreditCardPayoffInput(fresh, rates);
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
  const balanceSymbol = getCurrencySymbol(input.balanceCurrency);
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        result.summary,
        result.breakdown,
        `Balance currency: ${balanceSymbol}`,
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
        <CreditCardPayoffForm
          input={input}
          errors={errors}
          result={result}
          conversionError={conversionError}
          ratesWarning={ratesStatus.warning}
          onChange={apply}
          onBalanceCurrencyChange={handleMoneyCurrencyChange('balanceCurrency')}
          onMonthlyPaymentCurrencyChange={handleMoneyCurrencyChange(
            'monthlyPaymentCurrency'
          )}
          onTotalPaidCurrencyChange={handleMoneyCurrencyChange(
            'totalPaidCurrency'
          )}
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
