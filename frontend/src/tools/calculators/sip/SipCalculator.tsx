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
import { SipForm } from './SipForm';
import {
  createDefaultInput,
  type SipFieldErrors,
  type SipInput,
  type SipResult,
} from './types';
import { validateSipInput } from './validation';

const FX_NOTE =
  'Monthly SIP, total investment, and maturity each have their own currency. SIP math runs in the monthly-amount currency; results convert for display. Years and return % never convert.';

function inputsEqual(a: SipInput, b: SipInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function SipCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<SipInput>(() => defaults);
  const [input, setInput] = React.useState<SipInput>(() => defaults);
  const [errors, setErrors] = React.useState<SipFieldErrors>({});
  const [result, setResult] = React.useState<SipResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    const validation = validateSipInput(input, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rates-driven resync
  }, [rates]);

  const apply = (next: SipInput) => {
    const validation = validateSipInput(next, rates);
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
    const converted = convertCurrency({ amount, from, to, rates: rates.rates });
    if (!converted.ok) return { ok: false };
    return { ok: true, text: moneyAmountToInputString(converted.amount) };
  };

  const handleMonthlyCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.monthlyAmountCurrency) return;
    const converted = convertFieldAmount(
      input.monthlyAmount,
      input.monthlyAmountCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({
      ...input,
      monthlyAmountCurrency: next,
      monthlyAmount: converted.text,
    });
  };

  const handleTotalCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalInvestmentCurrency) return;
    if (!canConvertPair(input.monthlyAmountCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, totalInvestmentCurrency: next });
  };

  const handleMaturityCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.maturityCurrency) return;
    if (!canConvertPair(input.monthlyAmountCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({ ...input, maturityCurrency: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateSipInput(fresh, rates);
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
  const currencyNote = ratesStatus.available ? FX_NOTE : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Monthly SIP: ${getCurrencySymbol(input.monthlyAmountCurrency)}${input.monthlyAmount} ${input.monthlyAmountCurrency}`,
        `Years: ${input.years} · Return: ${input.annualReturnPercent}%`,
        `Total investment: ${result.formattedTotalInvestment} ${result.totalInvestmentCurrency}`,
        `Maturity: ${result.formattedMaturity} ${result.maturityCurrency}`,
        `Factor: ${result.formattedFactor}×`,
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
        <SipForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onMonthlyCurrencyChange={handleMonthlyCurrencyChange}
          onTotalCurrencyChange={handleTotalCurrencyChange}
          onMaturityCurrencyChange={handleMaturityCurrencyChange}
          conversionError={conversionError}
          ratesWarning={ratesStatus.warning}
        />
        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" className="h-10 rounded-xl text-xs font-semibold" onClick={handleReset}>
              Reload calculator
            </Button>
            <Button type="button" variant="outline" className="h-10 rounded-xl text-xs font-semibold" disabled={!dirty} onClick={handleReset}>
              Clear all changes
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex gap-1.5">
            <button type="button" onClick={() => setFeedback('yes')} className={`flex items-center gap-1 rounded-md border px-2 py-1 ${feedback==='yes'?'border-primary bg-primary text-white':'border-border bg-white'}`}>
              <ThumbsUp className="h-3 w-3" /> Yes
            </button>
            <button type="button" onClick={() => setFeedback('no')} className={`flex items-center gap-1 rounded-md border px-2 py-1 ${feedback==='no'?'border-primary bg-primary text-white':'border-border bg-white'}`}>
              <ThumbsDown className="h-3 w-3" /> No
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
