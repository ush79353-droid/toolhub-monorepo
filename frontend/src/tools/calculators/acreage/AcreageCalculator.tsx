'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { AcreageForm, draftToInput, inputToDraft, type AcreageDraft } from './AcreageForm';
import { AcreageResults } from './AcreageResults';
import { areaUnitLabel, calculateAcreage } from './calculation';
import {
  DEFAULT_ACREAGE_INPUT,
  type AcreageFieldErrors,
  type AcreageResult,
} from './types';
import { validateAcreage } from './validation';

function formatArea(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
}

function summaryText(result: AcreageResult): string {
  const lines = ['Acreage Calculator — Omega Calculators'];
  if (
    result.mode === 'dimensions' &&
    result.widthDisplay !== null &&
    result.lengthDisplay !== null
  ) {
    lines.push(
      `Dimensions: ${formatArea(result.widthDisplay)} ${result.widthUnit} × ${formatArea(result.lengthDisplay)} ${result.lengthUnit}`
    );
  } else {
    lines.push('Mode: area conversion (no invented width or length)');
  }
  lines.push(`Area: ${formatArea(result.areaDisplay)} ${areaUnitLabel(result.areaUnit)}`);
  for (const row of result.conversions) {
    if (row.unit === result.areaUnit) continue;
    lines.push(`${row.label}: ${formatArea(row.value)}`);
  }
  if (result.totalPrice !== null && result.pricePerUnit !== null) {
    lines.push(
      `Price: ${formatCurrencyValue(result.pricePerUnit, result.currency)} per ${areaUnitLabel(result.priceAreaUnit)}`
    );
    lines.push(`Total: ${formatCurrencyValue(result.totalPrice, result.currency)}`);
    lines.push(CURRENCY_DENOMINATION_NOTE);
  }
  lines.push('Rectangular plots only. Irregular boundaries need surveying.');
  return lines.join('\n');
}

export function AcreageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AcreageDraft>(() => inputToDraft(DEFAULT_ACREAGE_INPUT));
  const [errors, setErrors] = React.useState<AcreageFieldErrors>({});
  const [result, setResult] = React.useState<AcreageResult | null>(() =>
    calculateAcreage(DEFAULT_ACREAGE_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: AcreageDraft) => {
    const parsed = draftToInput(next);
    const validation = validateAcreage(parsed);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateAcreage(parsed) : null);
  }, []);

  const sharePayload = result ? summaryText(result) : '';

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
          <p className="text-xs font-normal text-muted-foreground">Rectangular land area</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="acreage-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="acreage-currency"
              aria-label="Display currency"
              value={draft.currency}
              onChange={(currency) => {
                const next = { ...draft, currency };
                setDraft(next);
                evaluate(next);
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AcreageForm
          draft={draft}
          errors={errors}
          onDraftChange={(next) => {
            setDraft(next);
            evaluate(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            const fresh = inputToDraft(DEFAULT_ACREAGE_INPUT);
            setDraft(fresh);
            setErrors({});
            setResult(calculateAcreage(DEFAULT_ACREAGE_INPUT));
            setCopied(false);
            setShared(false);
          }}
        />
        <AcreageResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
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
