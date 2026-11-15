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
import { type SupportedCurrency } from '@/tools/shared/currency';
import { formatOmcField } from './calculation';
import { OnlineMarketingConversionForm } from './OnlineMarketingConversionForm';
import { OnlineMarketingConversionResults } from './OnlineMarketingConversionResults';
import { createDefaultDraft, type OmcDraft, type OmcFieldErrors } from './types';
import { applySolvedDisplay, validateAndSolve } from './validation';

const CONVERTIBLE_MONEY_FIELDS = [
  'totalCost',
  'cpm',
  'cpc',
  'costPerLead',
  'costPerCustomer',
  'revenue',
  'revenuePerClick',
  'revenuePerLead',
  'revenuePerCustomer',
  'customerLtv',
  'totalLifetimeRevenue',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts ad spend, order value, and revenue metrics using stored exchange rates. Visits, leads, customers, and conversion percentages stay the same.';

export function OnlineMarketingConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<OmcDraft>(() => createDefaultDraft());
  const [errors, setErrors] = React.useState<OmcFieldErrors>({});
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

  const run = (next: OmcDraft) => {
    const solved = validateAndSolve(next);
    setErrors(solved.errors);
    const formatted = applySolvedDisplay(next, solved.values, (field, value) =>
      formatOmcField(field, value, next.currency)
    );
    setDraft(formatted);
  };

  const handleDraftChange = (next: OmcDraft) => {
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
      CONVERTIBLE_MONEY_FIELDS,
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
    Object.keys(draft.manual).length > 0 && Object.keys(errors).length === 0;

  const shareText = hasResult
    ? [
        `${metadata.title} — Omega Calculators`,
        draft.visits ? `Visits: ${draft.visits}` : '',
        draft.leads ? `Leads: ${draft.leads}` : '',
        draft.customers ? `Customers: ${draft.customers}` : '',
        draft.totalCost ? `Total cost: ${draft.totalCost}` : '',
        draft.revenue ? `Revenue: ${draft.revenue}` : '',
        draft.roi ? `ROI: ${draft.roi}%` : '',
        draft.customerLtv ? `Customer LTV: ${draft.customerLtv}` : '',
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
        <OnlineMarketingConversionForm
          draft={draft}
          errors={errors}
          onChange={handleDraftChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
        />
        <OnlineMarketingConversionResults
          hasResult={hasResult && Object.keys(solved.values).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!shareText) return;
            void copyTextToClipboard(shareText).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!shareText || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: shareText,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${shareText}\n${typeof window !== 'undefined' ? window.location.href : ''}`
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