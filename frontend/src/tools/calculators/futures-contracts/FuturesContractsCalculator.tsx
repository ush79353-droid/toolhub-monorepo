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
import { FuturesContractsForm } from './FuturesContractsForm';
import {
  createDefaultInput,
  createEmptyInput,
  FUTURES_CONTRACT_OPTIONS,
  type FuturesContractsFieldErrors,
  type FuturesContractsInput,
  type FuturesContractsResult,
} from './types';
import { validateFuturesContractsInput } from './validation';

const FX_NOTE =
  'Tick value, point value, and profit/loss each have an independent currency. P/L math runs in the tick currency; point value and P/L convert for display. Quote prices and ticks/point never convert. Missing rates block conversion; stale rates warn but still convert.';

function inputsEqual(
  a: FuturesContractsInput,
  b: FuturesContractsInput
): boolean {
  return (
    a.tradingDirection === b.tradingDirection &&
    a.futuresContract === b.futuresContract &&
    a.tickValue === b.tickValue &&
    a.tickValueCurrency === b.tickValueCurrency &&
    a.ticksPerPoint === b.ticksPerPoint &&
    a.pointValueCurrency === b.pointValueCurrency &&
    a.buyingPrice === b.buyingPrice &&
    a.sellingPrice === b.sellingPrice &&
    a.numberOfContracts === b.numberOfContracts &&
    a.profitLossCurrency === b.profitLossCurrency
  );
}

export function FuturesContractsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<FuturesContractsInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<FuturesContractsInput>(
    () => defaults
  );
  const [errors, setErrors] = React.useState<FuturesContractsFieldErrors>({});
  const [result, setResult] = React.useState<FuturesContractsResult | null>(
    null
  );
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

  const apply = (next: FuturesContractsInput) => {
    const validation = validateFuturesContractsInput(next, rates);
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
    field: 'tickValue' | 'pointValue' | 'profitLoss',
    next: SupportedCurrency
  ) => {
    if (field === 'tickValue') {
      const prev = input.tickValueCurrency;
      if (prev === next) return;
      const converted = convertFieldAmount(input.tickValue, prev, next);
      if (!converted.ok) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      apply({
        ...input,
        tickValueCurrency: next,
        tickValue: converted.text,
      });
      return;
    }

    if (field === 'pointValue') {
      if (input.pointValueCurrency === next) return;
      if (!canConvertPair(input.tickValueCurrency, next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      apply({ ...input, pointValueCurrency: next });
      return;
    }

    if (input.profitLossCurrency === next) return;
    if (!canConvertPair(input.tickValueCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, profitLossCurrency: next });
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    const validation = validateFuturesContractsInput(fresh, rates);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    setConversionError(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    setInput(createEmptyInput());
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
  const contractLabel =
    FUTURES_CONTRACT_OPTIONS.find((o) => o.id === input.futuresContract)
      ?.label ?? input.futuresContract;

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Direction: ${result.tradingDirection}`,
        `Contract: ${contractLabel}`,
        `Tick: ${getCurrencySymbol(result.tickValueCurrency)}${result.formattedTickValue} ${result.tickValueCurrency}`,
        `Ticks/point: ${result.ticksPerPoint}`,
        `Point value: ${result.formattedPointValue} ${result.pointValueCurrency}`,
        `Buy: ${input.buyingPrice} · Sell: ${input.sellingPrice}`,
        `Points: ${result.formattedNumberOfPoints}`,
        `Contracts: ${result.numberOfContracts}`,
        `P/L: ${result.formattedProfitLoss} ${result.profitLossCurrency}`,
        result.formulaBreakdown,
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
        <FuturesContractsForm
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
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty}
              onClick={handleClear}
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
