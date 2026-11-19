'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
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
import { RevenueForm } from './RevenueForm';
import {
  createDefaultDraft,
  type RevenueDraft,
  type RevenueFieldErrors,
  type RevenueResult,
} from './types';
import { validateRevenueDraft } from './validation';

const FX_NOTE =
  'Price and total revenue each have their own currency. Amounts are normalized into the price currency before Price × Quantity. Quantity is never converted. Missing rates block conversion; stale rates warn but still convert.';

function draftsEqual(a: RevenueDraft, b: RevenueDraft): boolean {
  return (
    a.price === b.price &&
    a.priceCurrency === b.priceCurrency &&
    a.quantity === b.quantity &&
    a.totalRevenue === b.totalRevenue &&
    a.totalRevenueCurrency === b.totalRevenueCurrency &&
    a.solveFor === b.solveFor &&
    a.lastEdited === b.lastEdited
  );
}

export function RevenueCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultDraft();
  const [baseline, setBaseline] = React.useState<RevenueDraft>(() => defaults);
  const [draft, setDraft] = React.useState<RevenueDraft>(() => defaults);
  const [errors, setErrors] = React.useState<RevenueFieldErrors>({});
  const [result, setResult] = React.useState<RevenueResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    const validation = validateRevenueDraft(draft, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rates-driven resync
  }, [rates]);

  const apply = (next: RevenueDraft) => {
    const validation = validateRevenueDraft(next, rates);
    setConversionError(null);
    setDraft(next);
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

  const handlePriceCurrencyChange = (next: SupportedCurrency) => {
    const converted = convertFieldAmount(draft.price, draft.priceCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...draft, price: converted.text, priceCurrency: next });
  };

  const handleTotalRevenueCurrencyChange = (next: SupportedCurrency) => {
    const converted = convertFieldAmount(
      draft.totalRevenue,
      draft.totalRevenueCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({
      ...draft,
      totalRevenue: converted.text,
      totalRevenueCurrency: next,
    });
  };

  const dirty = !draftsEqual(draft, baseline);
  const currencyNote = ratesStatus.available ? FX_NOTE : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const sharePayload = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Price: ${result.formattedPrice} ${result.calcCurrency}`,
        `Quantity: ${result.formattedQuantity}`,
        `Total revenue: ${result.formattedTotalRevenue} ${result.totalRevenueCurrency}`,
        currencyNote,
      ].join('\n')
    : `${metadata.title} — Omega Calculators`;

  const handleShare = async () => {
    if (!result) return;
    try {
      if (canShare && navigator.share) {
        await navigator.share({ title: metadata.title, text: sharePayload });
        setShared(true);
        return;
      }
      const ok = await copyTextToClipboard(sharePayload);
      setCopied(ok);
      setShared(ok);
    } catch {
      setShared(false);
    }
  };

  const handleReload = () => {
    apply(baseline);
    setFeedback(null);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const handleClear = () => {
    const fresh = createDefaultDraft();
    setBaseline(fresh);
    apply(fresh);
    setFeedback(null);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!isEmbed && headerActions ? (
        <div className="flex flex-wrap items-center justify-end gap-2">{headerActions}</div>
      ) : null}

      <RevenueForm
        draft={draft}
        errors={errors}
        result={result}
        onChange={apply}
        onPriceCurrencyChange={handlePriceCurrencyChange}
        onTotalRevenueCurrencyChange={handleTotalRevenueCurrencyChange}
        conversionError={conversionError}
        ratesWarning={ratesStatus.warning}
      />

      <p className="text-xs leading-relaxed text-muted-foreground">{currencyNote}</p>

      <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-start">
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-11 flex-col gap-1 px-4 py-3 sm:w-36"
          disabled={!result}
          onClick={() => void handleShare()}
        >
          <Share2 className="h-4 w-4 text-primary" aria-hidden />
          <span className="text-xs">{shared || copied ? 'Shared' : 'Share result'}</span>
        </Button>
        <div className="flex flex-1 flex-col gap-2">
          <Button type="button" variant="outline" className="h-11" onClick={handleReload}>
            Reload calculator
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            disabled={!dirty}
            onClick={handleClear}
          >
            Clear all changes
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>Did we solve your problem today?</span>
        <Button
          type="button"
          variant={feedback === 'yes' ? 'default' : 'outline'}
          size="sm"
          className="h-8 gap-1"
          onClick={() => setFeedback('yes')}
        >
          <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
          Yes
        </Button>
        <Button
          type="button"
          variant={feedback === 'no' ? 'default' : 'outline'}
          size="sm"
          className="h-8 gap-1"
          onClick={() => setFeedback('no')}
        >
          <ThumbsDown className="h-3.5 w-3.5" aria-hidden />
          No
        </Button>
      </div>
    </div>
  );
}
