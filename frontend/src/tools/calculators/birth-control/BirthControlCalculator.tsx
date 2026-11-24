'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { isCurrencyRateUsable } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { BirthControlForm } from './BirthControlForm';
import {
  createDefaultInput,
  type BirthControlInput,
} from './types';
import { validateBirthControlInput } from './validation';

const FX_NOTE =
  'Each money field keeps its own currency. Totals convert into the result currency with stored Phase 2 rates. Same-currency math needs no quote; missing rates block conversion; stale rates warn but still convert. Inputs stay on-device — share uses only the public page URL.';

function inputsEqual(a: BirthControlInput, b: BirthControlInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function BirthControlCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = React.useMemo(() => createDefaultInput(), []);
  const [baseline] = React.useState<BirthControlInput>(() => defaults);
  const [input, setInput] = React.useState<BirthControlInput>(() => defaults);
  const [condomsOpen, setCondomsOpen] = React.useState(true);
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

  const validation = React.useMemo(
    () => validateBirthControlInput(input, rates),
    [input, rates]
  );
  const errors = validation.errors;
  const result = validation.isValid ? validation.result : null;

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

  const handleChange = (next: BirthControlInput) => {
    setConversionError(null);
    let working = next;
    const moneyPairs: Array<{
      amountKey: keyof BirthControlInput;
      currencyKey: keyof BirthControlInput;
    }> = [
      { amountKey: 'costPerCycle', currencyKey: 'costPerCycleCurrency' },
      { amountKey: 'longActingPrice', currencyKey: 'longActingPriceCurrency' },
      { amountKey: 'procedureCost', currencyKey: 'procedureCostCurrency' },
      { amountKey: 'pricePerPackage', currencyKey: 'pricePerPackageCurrency' },
    ];

    for (const pair of moneyPairs) {
      const prevCcy = input[pair.currencyKey] as SupportedCurrency;
      const nextCcy = next[pair.currencyKey] as SupportedCurrency;
      if (prevCcy === nextCcy) continue;
      const converted = convertFieldAmount(
        String(next[pair.amountKey]),
        prevCcy,
        nextCcy
      );
      if (!converted.ok) {
        setConversionError(
          'Currency conversion is unavailable for that pair. Rates may be missing.'
        );
        working = { ...working, [pair.currencyKey]: prevCcy };
      } else {
        working = { ...working, [pair.amountKey]: converted.text };
      }
    }

    setInput(working);
  };

  const handleReload = () => {
    setInput(defaults);
    setFeedback(null);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const handleClear = () => {
    setInput({
      ...defaults,
      costPerCycle: '',
      longActingPrice: '',
      longevity: '',
      procedureCost: '',
      amountInPackage: '',
      condomUsage: '',
      pricePerPackage: '',
      horizon: '',
    });
    setFeedback(null);
    setCopied(false);
    setShared(false);
  };

  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  const handleShare = async () => {
    const shareData = {
      title: metadata.title || 'Birth Control Calculator',
      url: pageUrl,
    };
    try {
      if (canShare) {
        await navigator.share(shareData);
        setShared(true);
        return;
      }
      const ok = await copyTextToClipboard(pageUrl);
      setCopied(ok);
      setShared(ok);
    } catch {
      const ok = await copyTextToClipboard(pageUrl);
      setCopied(ok);
      setShared(ok);
    }
  };

  const dirty = !inputsEqual(input, baseline);

  return (
    <div className={`space-y-4 ${className}`}>
      {!isEmbed && headerActions ? (
        <div className="flex justify-end">{headerActions}</div>
      ) : null}

      <BirthControlForm
        input={input}
        errors={errors}
        result={result}
        condomsOpen={condomsOpen}
        onToggleCondoms={() => setCondomsOpen((o) => !o)}
        onChange={handleChange}
      />

      {ratesStatus.isStale && ratesStatus.available ? (
        <p className="text-xs text-amber-700">
          Exchange rates are older than 48 hours. Conversion still uses the
          stored snapshot.
        </p>
      ) : null}
      {conversionError ? (
        <p className="text-xs text-rose-600">{conversionError}</p>
      ) : null}
      <p className="text-xs text-muted-foreground">{FX_NOTE}</p>

      <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-11 shrink-0 px-0"
          onClick={() => void handleShare()}
          aria-label="Share result"
          title="Share result"
        >
          <Share2 className="h-4 w-4 text-rose-600" />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={handleReload}
        >
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={handleClear}
          disabled={!dirty && !result}
        >
          Clear all changes
        </Button>
      </div>
      {shared || copied ? (
        <p className="text-xs text-muted-foreground">
          {canShare && shared
            ? 'Share sheet opened (page URL only).'
            : 'Page URL copied. Calculator inputs were not included.'}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
        <p className="text-sm text-muted-foreground">
          Did we solve your problem today?
        </p>
        <Button
          type="button"
          variant={feedback === 'yes' ? 'default' : 'outline'}
          size="sm"
          className="gap-1.5"
          onClick={() => setFeedback('yes')}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Yes
        </Button>
        <Button
          type="button"
          variant={feedback === 'no' ? 'default' : 'outline'}
          size="sm"
          className="gap-1.5"
          onClick={() => setFeedback('no')}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          No
        </Button>
      </div>
    </div>
  );
}
