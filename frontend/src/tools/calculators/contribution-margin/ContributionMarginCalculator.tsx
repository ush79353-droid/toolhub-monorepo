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
import {
  ContributionMarginForm,
  draftToInput,
  emptyDraft,
  type ContributionMarginDraft,
} from './ContributionMarginForm';
import { ContributionMarginResults } from './ContributionMarginResults';
import { calculateContributionMargin } from './calculation';
import type { ContributionMarginFieldErrors, ContributionMarginResult } from './types';
import { validateContributionMargin } from './validation';

const MONEY_FIELDS = ['sellingPricePerUnit', 'variableCostPerUnit', 'fixedCosts'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts price, variable cost, and fixed costs using stored exchange rates. Unit counts and margin % stay the same.';

function summaryText(metadataTitle: string, result: ContributionMarginResult, note: string): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const ratio =
    result.contributionMarginRatioPercent === null
      ? 'n/a (selling price is zero)'
      : `${result.contributionMarginRatioPercent}%`;
  return [
    `${metadataTitle} | Omega Calculators`,
    `Currency: ${result.currency}`,
    `Selling price per unit: ${money(result.sellingPricePerUnit)}`,
    `Variable cost per unit: ${money(result.variableCostPerUnit)}`,
    `Number of units: ${result.numberOfUnits}`,
    `Fixed costs: ${money(result.fixedCosts)}`,
    `Contribution margin: ${money(result.contributionMargin)}`,
    `Contribution margin ratio: ${ratio}`,
    `Profit generated: ${money(result.profitGenerated)}`,
    note,
  ].join('\n');
}

export function ContributionMarginCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<ContributionMarginDraft>(() => emptyDraft());
  const [errors, setErrors] = React.useState<ContributionMarginFieldErrors>({});
  const [result, setResult] = React.useState<ContributionMarginResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
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

  const evaluate = React.useCallback((next: ContributionMarginDraft, reportBlanks = false) => {
    const parsed = draftToInput(next);
    const validation = validateContributionMargin(parsed, { reportBlanks });
    setDraft(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.isValid ? calculateContributionMargin(parsed) : null);
  }, []);

  const handleDraftChange = (next: ContributionMarginDraft) => {
    setConversionError(null);
    evaluate(next);
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
    evaluate({ ...draft, ...converted.values, currency });
  };

  const resetAll = () => {
    setDraft(emptyDraft());
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const sharePayload = result ? summaryText(metadata.title, result, currencyNote) : '';
  const hasFieldErrors = Object.keys(errors).length > 0;

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
        <ContributionMarginForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={handleDraftChange}
          onCurrencyChange={handleCurrencyChange}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft, true);
          }}
          onReset={resetAll}
        />
        <ContributionMarginResults
          result={result}
          invalid={hasFieldErrors}
          incomplete={incomplete}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(metadata.title, result, currencyNote)).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
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
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`,
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