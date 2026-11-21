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
import { EvToSalesForm } from './EvToSalesForm';
import {
  createDefaultInput,
  type EvToSalesFieldErrors,
  type EvToSalesInput,
  type EvToSalesResult,
} from './types';
import { validateEvToSalesInput } from './validation';

const FX_NOTE =
  'Each money field has its own currency. Amounts normalize into the market-cap currency before EV is calculated; EV converts for display. The dimensionless EV/Sales ratio never converts. Missing rates block conversion; stale rates warn but still convert.';

function inputsEqual(a: EvToSalesInput, b: EvToSalesInput): boolean {
  return (
    a.cash === b.cash &&
    a.cashCurrency === b.cashCurrency &&
    a.marketCap === b.marketCap &&
    a.marketCapCurrency === b.marketCapCurrency &&
    a.totalDebt === b.totalDebt &&
    a.totalDebtCurrency === b.totalDebtCurrency &&
    a.minorityInterest === b.minorityInterest &&
    a.minorityInterestCurrency === b.minorityInterestCurrency &&
    a.preferredShares === b.preferredShares &&
    a.preferredSharesCurrency === b.preferredSharesCurrency &&
    a.enterpriseValueCurrency === b.enterpriseValueCurrency &&
    a.sales === b.sales &&
    a.salesCurrency === b.salesCurrency &&
    a.enterpriseValueOpen === b.enterpriseValueOpen &&
    a.salesRatioOpen === b.salesRatioOpen
  );
}

export function EvToSalesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<EvToSalesInput>(() => defaults);
  const [input, setInput] = React.useState<EvToSalesInput>(() => defaults);
  const [errors, setErrors] = React.useState<EvToSalesFieldErrors>({});
  const [result, setResult] = React.useState<EvToSalesResult | null>(null);
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
    const validation = validateEvToSalesInput(input, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    // ponytail: rates-driven resync only
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rates identity
  }, [rates]);

  const apply = (next: EvToSalesInput) => {
    setConversionError(null);
    const validation = validateEvToSalesInput(next, rates);
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

  const changeInputCurrency = (
    field: keyof EvToSalesInput,
    currencyField: keyof EvToSalesInput,
    currentCurrency: SupportedCurrency,
    next: SupportedCurrency
  ) => {
    if (next === currentCurrency) return;
    const raw = String(input[field] ?? '');
    const converted = convertFieldAmount(raw, currentCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({
      ...input,
      [currencyField]: next,
      [field]: converted.text,
    } as EvToSalesInput);
  };

  const changeDisplayCurrency = (
    currencyField: keyof EvToSalesInput,
    current: SupportedCurrency,
    next: SupportedCurrency
  ) => {
    if (next === current) return;
    if (!canConvertPair(input.marketCapCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, [currencyField]: next } as EvToSalesInput);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateEvToSalesInput(fresh, rates);
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
  const evSymbol = getCurrencySymbol(
    result?.enterpriseValueCurrency ?? input.enterpriseValueCurrency
  );
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Cash: ${input.cash} ${input.cashCurrency}`,
        `Market cap: ${input.marketCap} ${input.marketCapCurrency}`,
        `Total debt: ${input.totalDebt} ${input.totalDebtCurrency}`,
        `Minority interest: ${input.minorityInterest} ${input.minorityInterestCurrency}`,
        `Preferred shares: ${input.preferredShares} ${input.preferredSharesCurrency}`,
        `Enterprise value: ${evSymbol}${result.formattedEnterpriseValue} ${result.enterpriseValueCurrency}`,
        `Sales: ${input.sales} ${input.salesCurrency}`,
        `EV to sales: ${
          result.ratioUndefined
            ? 'Undefined (zero sales)'
            : (result.formattedEvToSales ?? '')
        }`,
        `Formulas: EV = Market Cap + Debt + Minority + Preferred − Cash; EV/Sales = EV ÷ Sales`,
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
        <EvToSalesForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onCashCurrencyChange={(next) =>
            changeInputCurrency('cash', 'cashCurrency', input.cashCurrency, next)
          }
          onMarketCapCurrencyChange={(next) =>
            changeInputCurrency(
              'marketCap',
              'marketCapCurrency',
              input.marketCapCurrency,
              next
            )
          }
          onTotalDebtCurrencyChange={(next) =>
            changeInputCurrency(
              'totalDebt',
              'totalDebtCurrency',
              input.totalDebtCurrency,
              next
            )
          }
          onMinorityCurrencyChange={(next) =>
            changeInputCurrency(
              'minorityInterest',
              'minorityInterestCurrency',
              input.minorityInterestCurrency,
              next
            )
          }
          onPreferredCurrencyChange={(next) =>
            changeInputCurrency(
              'preferredShares',
              'preferredSharesCurrency',
              input.preferredSharesCurrency,
              next
            )
          }
          onEnterpriseValueCurrencyChange={(next) =>
            changeDisplayCurrency(
              'enterpriseValueCurrency',
              input.enterpriseValueCurrency,
              next
            )
          }
          onSalesCurrencyChange={(next) =>
            changeInputCurrency(
              'sales',
              'salesCurrency',
              input.salesCurrency,
              next
            )
          }
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
