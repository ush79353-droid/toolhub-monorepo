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
import { formatCpmField } from './calculation';
import { CpmForm } from './CpmForm';
import { CpmResults } from './CpmResults';
import {
  createDefaultDraft,
  type CpmCampaignDraft,
  type CpmDraft,
  type CpmField,
} from './types';
import { applySolvedDisplay, validateAndSolveCampaign } from './validation';

const MONEY_FIELDS = ['totalCost', 'cpm'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts campaign cost and CPM using stored exchange rates. Impressions stay the same.';

function campaignSummary(
  label: string,
  campaign: CpmCampaignDraft,
  values: ReturnType<typeof validateAndSolveCampaign>['values']
): string[] {
  if (Object.keys(campaign.manual).length === 0) return [];
  const lines = [`${label}:`];
  if (values.totalCost !== undefined) {
    lines.push(`  Total cost: ${formatCurrencyValue(values.totalCost, campaign.currency)}`);
  }
  if (values.cpm !== undefined) {
    lines.push(`  CPM: ${formatCurrencyValue(values.cpm, campaign.currency)}`);
  }
  if (values.impressions !== undefined) {
    lines.push(`  Impressions: ${formatCpmField('impressions', values.impressions, campaign.currency)}`);
  }
  return lines;
}

function convertCampaignMoney(
  campaign: CpmCampaignDraft,
  currency: SupportedCurrency,
  rates: Record<string, number>
): CpmCampaignDraft | null {
  const converted = convertDraftMoneyFields(
    campaign,
    MONEY_FIELDS,
    campaign.currency,
    currency,
    rates
  );
  if (!converted.ok) return null;
  return { ...campaign, ...converted.values, currency };
}

export function CpmCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<CpmDraft>(() => createDefaultDraft());
  const [primaryErrors, setPrimaryErrors] = React.useState<
    Partial<Record<CpmField | 'form', string>>
  >({});
  const [secondaryErrors, setSecondaryErrors] = React.useState<
    Partial<Record<CpmField | 'form', string>>
  >({});
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

  const runPrimary = (campaign: CpmCampaignDraft) => {
    const solved = validateAndSolveCampaign(campaign);
    setPrimaryErrors(solved.errors);
    const formatted = applySolvedDisplay(campaign, solved.values, (field, value) =>
      formatCpmField(field, value, campaign.currency)
    );
    setDraft((prev) => ({ ...prev, primary: formatted }));
  };

  const runSecondary = (campaign: CpmCampaignDraft) => {
    const solved = validateAndSolveCampaign(campaign);
    setSecondaryErrors(solved.errors);
    const formatted = applySolvedDisplay(campaign, solved.values, (field, value) =>
      formatCpmField(field, value, campaign.currency)
    );
    setDraft((prev) => ({ ...prev, secondary: formatted }));
  };

  const handlePrimaryChange = (campaign: CpmCampaignDraft) => {
    setConversionError(null);
    runPrimary(campaign);
  };

  const handleSecondaryChange = (campaign: CpmCampaignDraft) => {
    setConversionError(null);
    runSecondary(campaign);
  };

  const handlePrimaryCurrencyChange = (currency: SupportedCurrency) => {
    const campaign = draft.primary;
    if (currency === campaign.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const next = convertCampaignMoney(campaign, currency, rates.rates);
    if (!next) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    handlePrimaryChange(next);
  };

  const handleSecondaryCurrencyChange = (currency: SupportedCurrency) => {
    const campaign = draft.secondary;
    if (currency === campaign.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const next = convertCampaignMoney(campaign, currency, rates.rates);
    if (!next) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    handleSecondaryChange(next);
  };

  const resetAll = () => {
    setDraft(createDefaultDraft());
    setPrimaryErrors({});
    setSecondaryErrors({});
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const primarySolved = validateAndSolveCampaign(draft.primary);
  const secondarySolved = validateAndSolveCampaign(draft.secondary);
  const primaryReady =
    !primarySolved.inconsistent &&
    Object.keys(primaryErrors).length === 0 &&
    Object.keys(draft.primary.manual).length >= 2 &&
    primarySolved.values.totalCost !== undefined &&
    primarySolved.values.cpm !== undefined &&
    primarySolved.values.impressions !== undefined;

  const hasBlockingErrors =
    Object.keys(primaryErrors).length > 0 ||
    (draft.secondOpen && Object.keys(secondaryErrors).length > 0);

  const summaryLines = [
    `${metadata.title} | Omega Calculators`,
    ...campaignSummary('Main campaign', draft.primary, primarySolved.values),
    ...(draft.secondOpen
      ? campaignSummary('Second campaign', draft.secondary, secondarySolved.values)
      : []),
    currencyNote,
  ];
  const sharePayload = primaryReady ? summaryLines.join('\n') : '';

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
        <CpmForm
          draft={draft}
          primaryErrors={primaryErrors}
          secondaryErrors={secondaryErrors}
          onPrimaryChange={handlePrimaryChange}
          onSecondaryChange={handleSecondaryChange}
          onPrimaryCurrencyChange={handlePrimaryCurrencyChange}
          onSecondaryCurrencyChange={handleSecondaryCurrencyChange}
          onToggleSecond={() =>
            setDraft((prev) => ({ ...prev, secondOpen: !prev.secondOpen }))
          }
          onReset={resetAll}
        />
        <CpmResults
          ready={primaryReady}
          incomplete={!primaryReady && !hasBlockingErrors}
          invalid={hasBlockingErrors}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!sharePayload) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!sharePayload || typeof navigator.share !== 'function') return;
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
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
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