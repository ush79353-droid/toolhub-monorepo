'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { formatPpmField } from './calculation';
import { PreAndPostMoneyValuationForm } from './PreAndPostMoneyValuationForm';
import { PreAndPostMoneyValuationResults } from './PreAndPostMoneyValuationResults';
import { createDefaultDraft, type PpmDraft, type PpmField } from './types';
import { applySolvedDisplay, validateAndSolve } from './validation';

const MONEY_FIELDS = ['investment', 'preMoney', 'postMoney'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts investment and valuation amounts using stored exchange rates. Investor equity % is unchanged.';

export function PreAndPostMoneyValuationCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<PpmDraft>(() => createDefaultDraft());
  const [errors, setErrors] = React.useState<Partial<Record<PpmField | 'form', string>>>({});
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

  const run = (next: PpmDraft) => {
    const solved = validateAndSolve(next);
    setErrors(solved.errors);
    const formatted = applySolvedDisplay(next, solved.values, (field, value) =>
      formatPpmField(field, value, next.currency)
    );
    setDraft(formatted);
  };

  const handleDraftChange = (next: PpmDraft) => {
    setConversionError(null);
    run(next);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === draft.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      draft,
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
    handleDraftChange({ ...draft, ...converted.values, currency });
  };

  const handleReset = () => {
    setDraft(createDefaultDraft());
    setErrors({});
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const solved = validateAndSolve(draft);
  const hasResult =
    !solved.inconsistent &&
    Object.keys(solved.errors).length === 0 &&
    Object.keys(draft.manual).length >= 2 &&
    Object.keys(solved.values).length >= 3;

  const summary = hasResult
    ? [
        `${metadata.title} | Omega Calculators`,
        solved.values.investment !== undefined
          ? `Investment: ${formatCurrencyValue(solved.values.investment, draft.currency)}`
          : null,
        solved.values.equity !== undefined
          ? `Investor's equity: ${formatPpmField('equity', solved.values.equity, draft.currency)}%`
          : null,
        solved.values.preMoney !== undefined
          ? `Pre-money: ${formatCurrencyValue(solved.values.preMoney, draft.currency)}`
          : null,
        solved.values.postMoney !== undefined
          ? `Post-money: ${formatCurrencyValue(solved.values.postMoney, draft.currency)}`
          : null,
        currencyNote,
      ]
        .filter(Boolean)
        .join('\n')
    : '';

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
        <PreAndPostMoneyValuationForm
          draft={draft}
          errors={errors}
          onDraftChange={handleDraftChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
        />
        <PreAndPostMoneyValuationResults
          hasResult={Boolean(summary)}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!summary) return;
            void copyTextToClipboard(summary).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!summary || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: summary,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${summary}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}