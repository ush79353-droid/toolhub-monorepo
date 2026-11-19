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
import { ProfitForm } from './ProfitForm';
import {
  createDefaultInput,
  type ProfitFieldErrors,
  type ProfitInput,
  type ProfitResult,
} from './types';
import { validateProfitInput } from './validation';

const FX_NOTE =
  'Cost, price, total cost, revenue, and total profit each have their own currency. Profit math runs in the buying-cost currency after Phase 2 FX conversion. Unit counts and discount % are never converted. Missing rates block conversion; stale rates warn but still convert.';

function inputsEqual(a: ProfitInput, b: ProfitInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function ProfitCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<ProfitInput>(() => defaults);
  const [input, setInput] = React.useState<ProfitInput>(() => defaults);
  const [errors, setErrors] = React.useState<ProfitFieldErrors>({});
  const [result, setResult] = React.useState<ProfitResult | null>(null);
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

  const apply = (next: ProfitInput) => {
    const validation = validateProfitInput(next, rates);
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

  const handleCostCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.costCurrency) return;
    const converted = convertFieldAmount(
      input.cost,
      input.costCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({
      ...input,
      costCurrency: next,
      cost: converted.text,
    });
  };

  const handlePriceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.priceCurrency) return;
    const converted = convertFieldAmount(
      input.price,
      input.priceCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({
      ...input,
      priceCurrency: next,
      price: converted.text,
    });
  };

  const handleTotalCostCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalCostCurrency) return;
    if (!canConvertPair(input.costCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, totalCostCurrency: next });
  };

  const handleRevenueCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.revenueCurrency) return;
    if (!canConvertPair(input.costCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, revenueCurrency: next });
  };

  const handleTotalProfitCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalProfitCurrency) return;
    if (!canConvertPair(input.costCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, totalProfitCurrency: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateProfitInput(fresh, rates);
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
  const costSymbol = getCurrencySymbol(input.costCurrency);
  const totalCostSymbol = getCurrencySymbol(
    result?.totalCostCurrency ?? input.totalCostCurrency
  );
  const revenueSymbol = getCurrencySymbol(
    result?.revenueCurrency ?? input.revenueCurrency
  );
  const profitSymbol = getCurrencySymbol(
    result?.totalProfitCurrency ?? input.totalProfitCurrency
  );
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Cost: ${costSymbol}${input.cost} ${input.costCurrency} per ${input.costPer}`,
        `Price: ${getCurrencySymbol(input.priceCurrency)}${input.price} ${input.priceCurrency} per ${input.pricePer}`,
        `Quantity: ${input.quantity} · Discount: ${input.discountPercent}%`,
        `Total cost: ${totalCostSymbol}${result.formattedTotalCost} ${result.totalCostCurrency}`,
        `Revenue: ${revenueSymbol}${result.formattedRevenue} ${result.revenueCurrency}`,
        `Total profit: ${profitSymbol}${result.formattedTotalProfit} ${result.totalProfitCurrency}`,
        `Formulas: UnitCost=C/Cq; UnitPrice=P/Pq; TotalCost=UnitCost×Q; Revenue=UnitPrice×Q×(1−D/100); Profit=Revenue−TotalCost`,
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
        <ProfitForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onCostCurrencyChange={handleCostCurrencyChange}
          onPriceCurrencyChange={handlePriceCurrencyChange}
          onTotalCostCurrencyChange={handleTotalCostCurrencyChange}
          onRevenueCurrencyChange={handleRevenueCurrencyChange}
          onTotalProfitCurrencyChange={handleTotalProfitCurrencyChange}
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
