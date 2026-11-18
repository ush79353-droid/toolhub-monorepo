'use client';

import * as React from 'react';
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
import { CagrForm } from './CagrForm';
import { CagrResults } from './CagrResults';
import {
  emptyCagrDraft,
  type CagrDraft,
  type CagrField,
  type CagrFieldErrors,
  type CagrResult,
} from './types';
import { validateCagrDraft } from './validation';

const MONEY_FIELDS = ['initialValue', 'finalValue'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts initial and final values using stored exchange rates. CAGR percent and periods stay the same.';

function summaryText(
  metadataTitle: string,
  draft: CagrDraft,
  result: CagrResult,
  note: string
): string {
  const lines = [
    `${metadataTitle} — Omega Calculators`,
    `CAGR: ${result.displays.cagrPercent}%`,
    `Periods: ${result.displays.periods}`,
    `Initial value: ${draft.currency} ${result.displays.initialValue}`,
    `Final value: ${draft.currency} ${result.displays.finalValue}`,
  ];
  if (result.change) {
    lines.push(
      `Change: ${draft.currency} ${result.change.absoluteDisplay} (${result.change.percentDisplay}%)`
    );
  }
  lines.push(note);
  return lines.join('\n');
}

export function CagrCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<CagrDraft>(emptyCagrDraft);
  const [errors, setErrors] = React.useState<CagrFieldErrors>({});
  const [result, setResult] = React.useState<CagrResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [changeOpen, setChangeOpen] = React.useState(false);
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

  const evaluate = (next: CagrDraft) => {
    const validation = validateCagrDraft(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.result);
    setDraft(validation.nextDraft ?? next);
  };

  const onFieldChange = (field: CagrField, value: string) => {
    setConversionError(null);
    const owned = { ...draft.userOwned };
    if (value.trim() === '') {
      delete owned[field];
    } else {
      owned[field] = true;
    }
    // If user edits the previously solved field, it becomes user-owned
    const solvedField =
      draft.solvedField === field && value.trim() !== '' ? null : draft.solvedField;
    evaluate({ ...draft, [field]: value, userOwned: owned, solvedField });
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === draft.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      {
        initialValue: draft.initialValue,
        finalValue: draft.finalValue,
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
    evaluate({
      ...draft,
      ...converted.values,
      currency,
    });
  };

  const resetAll = () => {
    setDraft(emptyCagrDraft());
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setChangeOpen(false);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const sharePayload = result
    ? summaryText(metadata.title, draft, result, currencyNote)
    : '';
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
          <p className="text-xs font-normal text-muted-foreground">
            Enter any three values to solve CAGR, periods, initial, or final. {currencyNote}
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
        <CagrForm
          draft={draft}
          errors={errors}
          change={result?.change ?? null}
          changeOpen={changeOpen}
          onChangeOpen={setChangeOpen}
          onFieldChange={onFieldChange}
          onCurrencyChange={handleCurrencyChange}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={resetAll}
        />
        <CagrResults
          result={result}
          hasErrors={hasFieldErrors}
          incomplete={incomplete}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(
              summaryText(metadata.title, draft, result, currencyNote)
            ).then((ok) => {
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
