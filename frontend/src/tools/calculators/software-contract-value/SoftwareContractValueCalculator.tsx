'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import {
  draftToInput,
  emptyDraft,
  SoftwareContractValueForm,
  type SoftwareContractValueDraft,
} from './SoftwareContractValueForm';
import { SoftwareContractValueResults } from './SoftwareContractValueResults';
import { calculateSoftwareContractValue } from './calculation';
import type {
  SoftwareContractValueFieldErrors,
  SoftwareContractValueResult,
} from './types';
import { validateSoftwareContractValue } from './validation';

function summaryText(metadataTitle: string, result: SoftwareContractValueResult): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  return [
    `${metadataTitle} — Omega Calculators`,
    `Currency: ${result.currency}`,
    `Retail price (per seat / month): ${money(result.retailPrice)}`,
    `Seats: ${result.seats}`,
    `Discount: ${result.discountPercent}%`,
    `Discount amount (per seat): ${money(result.discountAmount)}`,
    `Discounted price (per seat / month): ${money(result.discountedPrice)}`,
    `Monthly cost: ${money(result.monthlyCost)}`,
    `Annual cost: ${money(result.annualCost)}`,
    `Duration: ${result.durationYears} yrs ${result.durationMonths} mos (${result.contractMonths} months)`,
    `Contract value: ${money(result.contractValue)}`,
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function SoftwareContractValueCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<SoftwareContractValueDraft>(() => emptyDraft());
  const [errors, setErrors] = React.useState<SoftwareContractValueFieldErrors>({});
  const [result, setResult] = React.useState<SoftwareContractValueResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: SoftwareContractValueDraft, reportBlanks = false) => {
      const parsed = draftToInput(next);
      const validation = validateSoftwareContractValue(parsed, { reportBlanks });
      setDraft(next);
      setErrors(validation.errors);
      setIncomplete(validation.incomplete);
      setResult(validation.isValid ? calculateSoftwareContractValue(parsed) : null);
    },
    [],
  );

  const resetAll = () => {
    setDraft(emptyDraft());
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setCopied(false);
    setShared(false);
  };

  const sharePayload = result ? summaryText(metadata.title, result) : '';
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
            Contract value = discounted seat price × seats × months
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SoftwareContractValueForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={(next) => evaluate(next)}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft, true);
          }}
          onReset={resetAll}
        />
        <SoftwareContractValueResults
          result={result}
          invalid={hasFieldErrors}
          incomplete={incomplete}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(metadata.title, result)).then((ok) => {
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
