'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { CpcAndCpmForm } from './CpcAndCpmForm';
import { CpcAndCpmResults } from './CpcAndCpmResults';
import { formatMetric } from './calculation';
import {
  createDefaultDraft,
  type CpcCpmDraft,
  type CpcCpmField,
} from './types';
import { applySolvedDisplay, validateAndSolve } from './validation';

const MONEY_FIELDS = ['cpc', 'totalCost', 'cpm'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts CPC, total cost, and CPM using stored exchange rates. Impressions, clicks, and CTR stay the same.';

function formatField(field: CpcCpmField, value: number, currency: CpcCpmDraft['currency']): string {
  if (field === 'impressions' || field === 'clicks') return formatMetric(value, 'count', currency);
  if (field === 'ctr') return formatMetric(value, 'percent', currency);
  return formatMetric(value, 'money', currency);
}

export function CpcAndCpmCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<CpcCpmDraft>(() => createDefaultDraft());
  const [errors, setErrors] = React.useState<Partial<Record<CpcCpmField | 'form', string>>>({});
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

  const run = (next: CpcCpmDraft) => {
    const solved = validateAndSolve(next);
    setErrors(solved.errors);
    const formatted = applySolvedDisplay(next, solved.values, (field, value) =>
      formatField(field, value, next.currency)
    );
    setDraft(formatted);
  };

  const handleDraftChange = (next: CpcCpmDraft) => {
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
    setConversionError(null);
  };

  const solved = validateAndSolve(draft);
  const hasResult =
    !solved.inconsistent &&
    Object.keys(solved.errors).length === 0 &&
    Object.keys(draft.manual).length > 0 &&
    (solved.values.clicks !== undefined ||
      solved.values.totalCost !== undefined ||
      solved.values.cpm !== undefined);

  const summary = hasResult
    ? [
        `${metadata.title} — Omega Calculators`,
        solved.values.impressions !== undefined
          ? `Impressions: ${formatMetric(solved.values.impressions, 'count', draft.currency)}`
          : null,
        solved.values.cpc !== undefined
          ? `CPC: ${formatCurrencyValue(solved.values.cpc, draft.currency)}`
          : null,
        solved.values.ctr !== undefined
          ? `CTR: ${formatMetric(solved.values.ctr, 'percent', draft.currency)}%`
          : null,
        solved.values.clicks !== undefined
          ? `Clicks: ${formatMetric(solved.values.clicks, 'count', draft.currency)}`
          : null,
        solved.values.totalCost !== undefined
          ? `Total cost: ${formatCurrencyValue(solved.values.totalCost, draft.currency)}`
          : null,
        solved.values.cpm !== undefined
          ? `CPM: ${formatCurrencyValue(solved.values.cpm, draft.currency)}`
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
        <CpcAndCpmForm
          draft={draft}
          errors={errors}
          onDraftChange={handleDraftChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
        />
        <CpcAndCpmResults />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}