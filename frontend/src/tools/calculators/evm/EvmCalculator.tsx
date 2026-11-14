'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { draftToInput, emptyDraft, EvmForm, type EvmDraft } from './EvmForm';
import { EvmResults } from './EvmResults';
import { calculateEvm } from './calculation';
import type { EvmFieldErrors, EvmResult } from './types';
import { validateEvm } from './validation';

function formatIndex(value: number | null): string {
  if (value === null) return 'n/a';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function summaryText(metadataTitle: string, result: EvmResult): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  return [
    `${metadataTitle} — Omega Calculators`,
    `Currency: ${result.currency}`,
    `Scheduled progress: ${result.scheduledProgressPercent}%`,
    `Actual progress: ${result.actualProgressPercent}%`,
    `Budget: ${money(result.budget)}`,
    `Costs: ${money(result.costs)}`,
    `PV: ${money(result.plannedValue)}`,
    `EV: ${money(result.earnedValue)}`,
    `AC: ${money(result.actualCost)}`,
    `CV: ${money(result.costVariance)}`,
    `SV: ${money(result.scheduleVariance)}`,
    `CPI: ${formatIndex(result.costPerformanceIndex)}`,
    `SPI: ${formatIndex(result.schedulePerformanceIndex)}`,
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function EvmCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<EvmDraft>(() => emptyDraft());
  const [errors, setErrors] = React.useState<EvmFieldErrors>({});
  const [result, setResult] = React.useState<EvmResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: EvmDraft, reportBlanks = false) => {
    const parsed = draftToInput(next);
    const validation = validateEvm(parsed, { reportBlanks });
    setDraft(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.isValid ? calculateEvm(parsed) : null);
  }, []);

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
          <p className="text-xs font-normal text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <EvmForm
          draft={draft}
          errors={errors}
          onDraftChange={(next) => evaluate(next)}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft, true);
          }}
          onReset={resetAll}
        />
        <EvmResults
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
