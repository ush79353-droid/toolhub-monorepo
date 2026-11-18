'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { AnnualizedReturnForm } from './AnnualizedReturnForm';
import { AnnualizedReturnResults } from './AnnualizedReturnResults';
import {
  emptyAnnualizedReturnDraft,
  type AnnualizedReturnDraft,
  type AnnualizedReturnFieldErrors,
  type AnnualizedReturnResult,
} from './types';
import { validateAnnualizedReturnDraft } from './validation';

function summaryText(
  metadataTitle: string,
  draft: AnnualizedReturnDraft,
  result: AnnualizedReturnResult
): string {
  const lines = [`${metadataTitle} — Omega Calculators`];
  if (draft.mode === 'total-return') {
    lines.push(
      `Method: Total return (%)`,
      `Total return (R): ${draft.totalReturnPercent}%`,
      `Holding period (n): ${draft.holdingPeriodYears} years`
    );
  } else {
    lines.push(
      `Method: Beginning and ending values`,
      `Beginning value: ${draft.currency} ${draft.beginningValue}`,
      `Ending value: ${draft.currency} ${draft.endingValue}`,
      `Holding period (n): ${draft.holdingPeriodYears} years`
    );
  }
  lines.push(`Annualized return: ${result.display}%`);
  return lines.join('\n');
}

export function AnnualizedReturnCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AnnualizedReturnDraft>(emptyAnnualizedReturnDraft);
  const [errors, setErrors] = React.useState<AnnualizedReturnFieldErrors>({});
  const [result, setResult] = React.useState<AnnualizedReturnResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: AnnualizedReturnDraft) => {
    const validation = validateAnnualizedReturnDraft(next);
    setDraft(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.result);
  };

  const resetAll = () => {
    setDraft(emptyAnnualizedReturnDraft());
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setCopied(false);
    setShared(false);
  };

  const sharePayload = result ? summaryText(metadata.title, draft, result) : '';
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
            Annualized return from total return or beginning/ending values. Currency change converts
            both monetary inputs together; holding period and return % stay economic.
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AnnualizedReturnForm
          draft={draft}
          resultDisplay={result?.display ?? ''}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={resetAll}
        />
        <AnnualizedReturnResults
          result={result}
          hasErrors={hasFieldErrors}
          incomplete={incomplete}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(metadata.title, draft, result)).then((ok) => {
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
