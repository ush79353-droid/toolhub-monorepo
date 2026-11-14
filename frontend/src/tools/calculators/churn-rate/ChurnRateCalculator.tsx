'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  ChurnRateForm,
  emptyDraft,
  type ChurnRateDraft,
} from './ChurnRateForm';
import { ChurnRateResults } from './ChurnRateResults';
import type { ChurnRateFieldErrors, ChurnRateResult } from './types';
import { validateChurnRateDraft } from './validation';

function summaryText(metadataTitle: string, result: ChurnRateResult): string {
  return [
    `${metadataTitle} — Omega Calculators`,
    `Customers at start: ${result.startingCustomers}`,
    `Customers lost: ${result.customersLost}`,
    `Churn rate: ${result.churnRateDisplay}%`,
    `Customer lifetime: ${result.lifetimeDisplay}${
      result.customerLifetimePeriods === null ? '' : ' periods'
    }`,
  ].join('\n');
}

export function ChurnRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<ChurnRateDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<ChurnRateFieldErrors>({});
  const [result, setResult] = React.useState<ChurnRateResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: ChurnRateDraft) => {
    const validation = validateChurnRateDraft(next);
    setDraft(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.isValid ? validation.result : null);
  };

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
            Churn % = lost ÷ starting × 100; lifetime = starting ÷ lost
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ChurnRateForm
          draft={draft}
          churnRateDisplay={result?.churnRateDisplay ?? ''}
          lifetimeDisplay={result?.lifetimeDisplay ?? ''}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={resetAll}
        />
        <ChurnRateResults
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
