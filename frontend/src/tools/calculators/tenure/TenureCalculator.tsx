'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { TenureForm } from './TenureForm';
import { TenureResults } from './TenureResults';
import {
  emptyTenureDraft,
  type TenureDraft,
  type TenureFieldErrors,
  type TenureResult,
} from './types';
import { validateTenureDraft } from './validation';

function summaryText(metadataTitle: string, draft: TenureDraft, result: TenureResult): string {
  const lines = [`${metadataTitle} — Omega Calculators`];
  if (result.average) {
    lines.push(
      `Employees: ${draft.employeeCount}`,
      `Combined service: ${draft.combinedDuration} ${draft.combinedUnit}`,
      `Average tenure: ${result.average.display} years`
    );
  }
  if (result.specific) {
    lines.push(
      `Starting date: ${draft.startDate}`,
      `Ending date: ${draft.endDate}`,
      `Service duration: ${result.specific.display}`
    );
  }
  return lines.join('\n');
}

export function TenureCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<TenureDraft>(emptyTenureDraft);
  const [errors, setErrors] = React.useState<TenureFieldErrors>({});
  const [result, setResult] = React.useState<TenureResult>({
    average: null,
    specific: null,
  });
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: TenureDraft) => {
    const validation = validateTenureDraft(next);
    setDraft(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const resetAll = () => {
    setDraft(emptyTenureDraft());
    setErrors({});
    setResult({ average: null, specific: null });
    setCopied(false);
    setShared(false);
  };

  const hasResult = Boolean(result.average || result.specific);
  const sharePayload = hasResult ? summaryText(metadata.title, draft, result) : '';
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
            Average tenure = combined service ÷ employees; specific tenure = end − start
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <TenureForm
          draft={draft}
          averageDisplay={result.average?.display ?? ''}
          specificDisplay={result.specific?.display ?? ''}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={resetAll}
        />
        <TenureResults
          result={result}
          hasErrors={hasFieldErrors}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!hasResult) return;
            void copyTextToClipboard(summaryText(metadata.title, draft, result)).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!hasResult || typeof navigator.share !== 'function') return;
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
