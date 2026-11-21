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
import { moneyAmountToInputString, parseMoneyInput } from '@/tools/shared/money-value';
import { CreditCardInterestForm } from './CreditCardInterestForm';
import { CreditCardInterestResults } from './CreditCardInterestResults';
import {
  createDefaultInput,
  type CreditCardInterestFieldErrors,
  type CreditCardInterestInput,
  type CreditCardInterestResult,
} from './types';
import { validateCreditCardInterestInput } from './validation';

const FX_NOTE =
  'Balance, fixed payment, additional payment, and the minimum-payment floor each have their own currency and are normalized into the balance currency before amortization. APR %, percentages, months, and years are never converted.';

function inputsEqual(
  a: CreditCardInterestInput,
  b: CreditCardInterestInput
): boolean {
  return (
    a.balance === b.balance &&
    a.balanceCurrency === b.balanceCurrency &&
    a.aprPercent === b.aprPercent &&
    a.repaymentMode === b.repaymentMode &&
    a.fixedPayment === b.fixedPayment &&
    a.fixedPaymentCurrency === b.fixedPaymentCurrency &&
    a.additionalPayment === b.additionalPayment &&
    a.additionalPaymentCurrency === b.additionalPaymentCurrency &&
    a.minPaymentFloor === b.minPaymentFloor &&
    a.minPaymentFloorCurrency === b.minPaymentFloorCurrency &&
    a.minPaymentPercent === b.minPaymentPercent &&
    a.minPaymentMethod === b.minPaymentMethod &&
    a.compounding === b.compounding
  );
}

type MoneyCurrencyField =
  | 'balanceCurrency'
  | 'fixedPaymentCurrency'
  | 'additionalPaymentCurrency'
  | 'minPaymentFloorCurrency';

type MoneyAmountField =
  | 'balance'
  | 'fixedPayment'
  | 'additionalPayment'
  | 'minPaymentFloor';

const CURRENCY_AMOUNT: Record<MoneyCurrencyField, MoneyAmountField> = {
  balanceCurrency: 'balance',
  fixedPaymentCurrency: 'fixedPayment',
  additionalPaymentCurrency: 'additionalPayment',
  minPaymentFloorCurrency: 'minPaymentFloor',
};

export function CreditCardInterestCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<CreditCardInterestInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<CreditCardInterestInput>(
    () => defaults
  );
  const [errors, setErrors] = React.useState<CreditCardInterestFieldErrors>({});
  const [result, setResult] = React.useState<CreditCardInterestResult | null>(
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
    const validation = validateCreditCardInterestInput(defaults, rates);
    if (validation.isValid && validation.result) {
      setResult(validation.result);
      setErrors({});
    }
    // Initial sample only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: CreditCardInterestInput) => {
    const validation = validateCreditCardInterestInput(next, rates);
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
      const amountField = CURRENCY_AMOUNT[currencyField];
      const amount = parseMoneyInput(input[amountField]);
      const hasAmount = Number.isFinite(amount);

      if (currencyField === 'balanceCurrency') {
        const others: SupportedCurrency[] = [
          input.fixedPaymentCurrency,
          input.additionalPaymentCurrency,
          input.minPaymentFloorCurrency,
        ];
        for (const other of others) {
          if (other !== next && !canConvertPair(other, next)) {
            setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
            return;
          }
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
    const validation = validateCreditCardInterestInput(fresh, rates);
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
        <CreditCardInterestForm
          input={input}
          errors={errors}
          conversionError={conversionError}
          ratesWarning={ratesStatus.warning}
          onChange={apply}
          onBalanceCurrencyChange={handleMoneyCurrencyChange('balanceCurrency')}
          onFixedCurrencyChange={handleMoneyCurrencyChange('fixedPaymentCurrency')}
          onAdditionalCurrencyChange={handleMoneyCurrencyChange(
            'additionalPaymentCurrency'
          )}
          onFloorCurrencyChange={handleMoneyCurrencyChange(
            'minPaymentFloorCurrency'
          )}
        />

        <CreditCardInterestResults
          result={result}
          hasErrors={Object.keys(errors).length > 0}
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
