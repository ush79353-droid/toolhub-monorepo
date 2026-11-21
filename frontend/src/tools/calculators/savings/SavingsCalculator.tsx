'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { SavingsForm } from './SavingsForm';
import { SavingsResults } from './SavingsResults';
import {
  createDefaultDraft,
  type SavingsDraft,
  type SavingsFieldErrors,
  type SavingsResult,
} from './types';
import { validateSavingsDraft } from './validation';

const FX_NOTE =
  'Initial savings and additional deposits each have their own currency. Changing a selector converts that amount using stored rates; mixed currencies are normalized into the initial-savings currency before calculation. Rates, APY, and time periods are never converted.';

function draftsEqual(a: SavingsDraft, b: SavingsDraft): boolean {
  return (
    a.goalMode === b.goalMode &&
    a.knownRate === b.knownRate &&
    a.initialSavings === b.initialSavings &&
    a.initialCurrency === b.initialCurrency &&
    a.ratePercent === b.ratePercent &&
    a.termYears === b.termYears &&
    a.termMonths === b.termMonths &&
    a.compounding === b.compounding &&
    a.adjustInflation === b.adjustInflation &&
    a.inflationPercent === b.inflationPercent &&
    a.depositGrowthPercent === b.depositGrowthPercent &&
    a.depositAmount === b.depositAmount &&
    a.depositCurrency === b.depositCurrency &&
    a.depositFrequency === b.depositFrequency &&
    a.depositTiming === b.depositTiming &&
    a.resultCurrency === b.resultCurrency
  );
}

function summaryText(title: string, draft: SavingsDraft, result: SavingsResult, note: string): string {
  return [
    `${title} | Omega Calculators`,
    `Initial savings: ${draft.initialSavings} ${draft.initialCurrency}`,
    `Rate (${draft.knownRate}): ${draft.ratePercent}%`,
    `Term: ${draft.termYears} yrs, ${draft.termMonths} mos`,
    `Compounding: ${draft.compounding}`,
    `Deposits: ${draft.depositAmount} ${draft.depositCurrency} ${draft.depositFrequency} (${draft.depositTiming})`,
    `APY: ${result.apyPercent.toFixed(4)}%`,
    `Final balance: ${formatCurrencyValue(result.finalBalance, result.resultCurrency)}`,
    `Total deposits: ${formatCurrencyValue(result.totalAdditionalDeposits, result.resultCurrency)}`,
    `Total interest: ${formatCurrencyValue(result.totalInterest, result.resultCurrency)}`,
    note,
  ].join('\n');
}

export function SavingsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultDraft();
  const [baseline, setBaseline] = React.useState<SavingsDraft>(() => defaults);
  const [draft, setDraft] = React.useState<SavingsDraft>(() => defaults);
  const [errors, setErrors] = React.useState<SavingsFieldErrors>({});
  const [result, setResult] = React.useState<SavingsResult | null>(null);
  const [mainOpen, setMainOpen] = React.useState(true);
  const [depositsOpen, setDepositsOpen] = React.useState(true);
  const [breakdownOpen, setBreakdownOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    const validation = validateSavingsDraft(defaults, rates);
    setErrors(validation.errors);
    setResult(validation.result);
    // Initial defaults only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: SavingsDraft) => {
    setConversionError(null);
    const validation = validateSavingsDraft(next, rates);
    setDraft(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const convertFieldAmount = (
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): { ok: true; value: string } | { ok: false } => {
    if (from === to) return { ok: true, value: raw };
    if (!rates.available) return { ok: false };
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return { ok: true, value: raw };
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return { ok: false };
    return { ok: true, value: moneyAmountToInputString(converted.amount) };
  };

  const handleInitialCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === draft.initialCurrency) return;
    const converted = convertFieldAmount(
      draft.initialSavings,
      draft.initialCurrency,
      currency
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({
      ...draft,
      initialSavings: converted.value,
      initialCurrency: currency,
      resultCurrency: currency,
    });
  };

  const handleDepositCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === draft.depositCurrency) return;
    const converted = convertFieldAmount(
      draft.depositAmount,
      draft.depositCurrency,
      currency
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    apply({
      ...draft,
      depositAmount: converted.value,
      depositCurrency: currency,
    });
  };

  const handleReset = () => {
    const fresh = createDefaultDraft();
    const validation = validateSavingsDraft(fresh, rates);
    setDraft(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setMainOpen(true);
    setDepositsOpen(true);
    setBreakdownOpen(true);
    setCopied(false);
    setShared(false);
    setFeedback(null);
    setConversionError(null);
  };

  const dirty = !draftsEqual(draft, baseline);
  const currencyNote = ratesStatus.available ? FX_NOTE : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const summary = result ? summaryText(metadata.title, draft, result, currencyNote) : '';

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
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}

        <SavingsForm
          draft={draft}
          errors={errors}
          mainOpen={mainOpen}
          depositsOpen={depositsOpen}
          onMainOpen={setMainOpen}
          onDepositsOpen={setDepositsOpen}
          onChange={apply}
          onInitialCurrencyChange={handleInitialCurrencyChange}
          onDepositCurrencyChange={handleDepositCurrencyChange}
          onSubmit={(event) => {
            event.preventDefault();
            apply(draft);
          }}
        />

        {result ? (
          <SavingsResults
            draft={draft}
            result={result}
            breakdownOpen={breakdownOpen}
            onBreakdownOpen={setBreakdownOpen}
          />
        ) : null}

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
              Clear changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className={`h-8 gap-1 px-2.5 text-xs ${
                feedback === 'yes' ? 'border-primary text-primary' : ''
              }`}
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Yes
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`h-8 gap-1 px-2.5 text-xs ${
                feedback === 'no' ? 'border-primary text-primary' : ''
              }`}
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              No
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
