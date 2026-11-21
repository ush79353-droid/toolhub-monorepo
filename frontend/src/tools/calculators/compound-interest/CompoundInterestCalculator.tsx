'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { CompoundInterestBalances } from './CompoundInterestBalances';
import { CompoundInterestForm } from './CompoundInterestForm';
import {
  createDefaultDraft,
  type BalanceView,
  type CompoundInterestDraft,
  type CompoundInterestFieldErrors,
  type CompoundInterestResult,
} from './types';
import { validateCompoundInterestDraft } from './validation';

const MONEY_FIELDS = ['initialBalance', 'depositAmount'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts principal and deposit amounts using stored exchange rates. Interest rate, term, and compounding stay the same.';

function summaryText(
  title: string,
  draft: CompoundInterestDraft,
  result: CompoundInterestResult,
  note: string
): string {
  return [
    `${title} | Omega Calculators`,
    `Initial balance: ${draft.initialBalance} ${draft.currency}`,
    `Interest rate: ${draft.interestRate}%`,
    `Term: ${draft.termYears} yrs, ${draft.termMonths} mos`,
    `Compounding: ${draft.compounding}`,
    `Additional deposits: ${draft.depositFrequency}`,
    `Final balance: ${result.formattedFinalBalance}`,
    `Total compound interest: ${result.formattedInterest}`,
    note,
  ].join('\n');
}

export function CompoundInterestCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<CompoundInterestDraft>(createDefaultDraft);
  const [errors, setErrors] = React.useState<CompoundInterestFieldErrors>(() =>
    validateCompoundInterestDraft(createDefaultDraft()).errors
  );
  const [result, setResult] = React.useState<CompoundInterestResult | null>(() =>
    validateCompoundInterestDraft(createDefaultDraft()).result
  );
  const [depositsOpen, setDepositsOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const evaluate = (next: CompoundInterestDraft) => {
    setConversionError(null);
    setDraft(next);
    const validation = validateCompoundInterestDraft(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === draft.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      {
        initialBalance: draft.initialBalance,
        depositAmount: draft.depositAmount,
      },
      MONEY_FIELDS,
      draft.currency,
      currency,
      rates.rates
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    const next: CompoundInterestDraft = {
      ...draft,
      ...converted.values,
      currency,
    };
    setDraft(next);
    const validation = validateCompoundInterestDraft(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const resetAll = () => {
    const fresh = createDefaultDraft();
    setDraft(fresh);
    setDepositsOpen(true);
    setCopied(false);
    setShared(false);
    setConversionError(null);
    const validation = validateCompoundInterestDraft(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const sharePayload = result ? summaryText(metadata.title, draft, result, currencyNote) : '';

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
            Compound interest with optional deposits. {currencyNote}
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
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
        <CompoundInterestForm
          draft={draft}
          errors={errors}
          result={result}
          depositsOpen={depositsOpen}
          onDepositsOpen={setDepositsOpen}
          onChange={evaluate}
          onCurrencyChange={handleCurrencyChange}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={resetAll}
        />

        {result ? (
          <CompoundInterestBalances
            draft={draft}
            result={result}
            onViewChange={(balanceView: BalanceView) => evaluate({ ...draft, balanceView })}
          />
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10"
            disabled={!result}
            onClick={() => {
              if (!result) return;
              void copyTextToClipboard(
                summaryText(metadata.title, draft, result, currencyNote)
              ).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
          >
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            {copied ? 'Copied' : 'Copy result'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={!result}
              onClick={() => {
                if (!result || typeof navigator.share !== 'function') return;
                void navigator
                  .share({
                    title: metadata.title,
                    text: sharePayload,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => undefined);
              }}
            >
              {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
              {shared ? 'Shared' : 'Share result'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
