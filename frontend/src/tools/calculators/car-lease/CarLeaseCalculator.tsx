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
import { CarLeaseForm } from './CarLeaseForm';
import {
  createDefaultInput,
  type CarLeaseFieldErrors,
  type CarLeaseInput,
  type CarLeaseResult,
} from './types';
import { validateCarLeaseInput } from './validation';

const FX_NOTE =
  'Money fields use independent currencies. Lease math normalizes amounts into the negotiated-price currency; results convert for display. Sales tax %, residual factor, money factor, and lease term never convert. Missing rates block conversion; stale rates warn but still convert.';

type MoneyCurrencyField =
  | 'msrpCurrency'
  | 'negotiatedPriceCurrency'
  | 'dealerFeeCurrency'
  | 'registrationFeeCurrency'
  | 'downPaymentCurrency'
  | 'tradeInValueCurrency'
  | 'otherReductionsCurrency';

type ResultCurrencyField =
  | 'netCapCostCurrency'
  | 'residualValueCurrency'
  | 'monthlyDepreciationCurrency'
  | 'monthlyLeaseFeeCurrency'
  | 'monthlyBasePaymentCurrency'
  | 'monthlySalesTaxCurrency'
  | 'monthlyLeasePaymentCurrency';

const MONEY_AMOUNT_BY_CURRENCY: Record<
  MoneyCurrencyField,
  keyof CarLeaseInput
> = {
  msrpCurrency: 'msrp',
  negotiatedPriceCurrency: 'negotiatedPrice',
  dealerFeeCurrency: 'dealerFee',
  registrationFeeCurrency: 'registrationFee',
  downPaymentCurrency: 'downPayment',
  tradeInValueCurrency: 'tradeInValue',
  otherReductionsCurrency: 'otherReductions',
};

function inputsEqual(a: CarLeaseInput, b: CarLeaseInput): boolean {
  return (
    a.msrp === b.msrp &&
    a.msrpCurrency === b.msrpCurrency &&
    a.negotiatedPrice === b.negotiatedPrice &&
    a.negotiatedPriceCurrency === b.negotiatedPriceCurrency &&
    a.leaseTermMonths === b.leaseTermMonths &&
    a.salesTaxPercent === b.salesTaxPercent &&
    a.residualFactorPercent === b.residualFactorPercent &&
    a.moneyFactor === b.moneyFactor &&
    a.dealerFee === b.dealerFee &&
    a.dealerFeeCurrency === b.dealerFeeCurrency &&
    a.registrationFee === b.registrationFee &&
    a.registrationFeeCurrency === b.registrationFeeCurrency &&
    a.downPayment === b.downPayment &&
    a.downPaymentCurrency === b.downPaymentCurrency &&
    a.tradeInValue === b.tradeInValue &&
    a.tradeInValueCurrency === b.tradeInValueCurrency &&
    a.otherReductions === b.otherReductions &&
    a.otherReductionsCurrency === b.otherReductionsCurrency &&
    a.netCapCostCurrency === b.netCapCostCurrency &&
    a.residualValueCurrency === b.residualValueCurrency &&
    a.monthlyDepreciationCurrency === b.monthlyDepreciationCurrency &&
    a.monthlyLeaseFeeCurrency === b.monthlyLeaseFeeCurrency &&
    a.monthlyBasePaymentCurrency === b.monthlyBasePaymentCurrency &&
    a.monthlySalesTaxCurrency === b.monthlySalesTaxCurrency &&
    a.monthlyLeasePaymentCurrency === b.monthlyLeasePaymentCurrency &&
    a.basicOpen === b.basicOpen &&
    a.additionalOpen === b.additionalOpen &&
    a.resultsOpen === b.resultsOpen
  );
}

export function CarLeaseCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<CarLeaseInput>(() => defaults);
  const [input, setInput] = React.useState<CarLeaseInput>(() => defaults);
  const [errors, setErrors] = React.useState<CarLeaseFieldErrors>({});
  const [result, setResult] = React.useState<CarLeaseResult | null>(null);
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

  const apply = (next: CarLeaseInput) => {
    const validation = validateCarLeaseInput(next, rates);
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

  const handleMoneyCurrencyChange = (
    field: MoneyCurrencyField,
    next: SupportedCurrency
  ) => {
    const current = input[field];
    if (next === current) return;
    const amountKey = MONEY_AMOUNT_BY_CURRENCY[field];
    const converted = convertFieldAmount(
      String(input[amountKey]),
      current,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({
      ...input,
      [field]: next,
      [amountKey]: converted.text,
    });
  };

  const handleResultCurrencyChange = (
    field: ResultCurrencyField,
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.negotiatedPriceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, [field]: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateCarLeaseInput(fresh, rates);
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
  const negotiatedSymbol = getCurrencySymbol(input.negotiatedPriceCurrency);
  const paymentSymbol = getCurrencySymbol(
    result?.monthlyLeasePaymentCurrency ?? input.monthlyLeasePaymentCurrency
  );
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `MSRP: ${getCurrencySymbol(input.msrpCurrency)}${input.msrp} ${input.msrpCurrency}`,
        `Negotiated: ${negotiatedSymbol}${input.negotiatedPrice} ${input.negotiatedPriceCurrency}`,
        `Term: ${input.leaseTermMonths} months`,
        `Sales tax: ${input.salesTaxPercent}%`,
        `Residual factor: ${input.residualFactorPercent}%`,
        `Money factor: ${input.moneyFactor}`,
        `Net cap cost: ${getCurrencySymbol(result.netCapCostCurrency)}${result.formattedNetCapitalizedCost} ${result.netCapCostCurrency}`,
        `Residual: ${getCurrencySymbol(result.residualValueCurrency)}${result.formattedResidualValue} ${result.residualValueCurrency}`,
        `Monthly payment (incl. tax): ${paymentSymbol}${result.formattedMonthlyLeasePayment} ${result.monthlyLeasePaymentCurrency}`,
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
        <CarLeaseForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onMoneyCurrencyChange={handleMoneyCurrencyChange}
          onResultCurrencyChange={handleResultCurrencyChange}
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
