'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildBradfordFactorResult } from './calculation';
import {
  BradfordFactorForm,
  emptyDraft,
  type BradfordFactorDraft,
} from './BradfordFactorForm';
import { BradfordFactorResults } from './BradfordFactorResults';
import type { BradfordFactorFieldErrors, BradfordFactorResult } from './types';
import { validateBradfordFactorDraft } from './validation';

function summaryText(result: BradfordFactorResult): string {
  return [
    'Bradford Factor Calculator',
    'Omega Calculators',
    '',
    `# of times absent (S): ${result.spells}`,
    `Days absent (D): ${result.daysAbsent}`,
    `Bradford factor (B): ${result.factorDisplay}`,
  ].join('\n');
}

export function BradfordFactorCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<BradfordFactorDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<BradfordFactorFieldErrors>({});
  const [result, setResult] = React.useState<BradfordFactorResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: BradfordFactorDraft) => {
    const validation = validateBradfordFactorDraft(next);
    setDraft(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);

    if (!validation.isValid || !validation.input) {
      setResult(null);
      return;
    }

    setResult(buildBradfordFactorResult(validation.input));
  }, []);

  const resetAll = () => {
    setDraft(emptyDraft());
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setCopied(false);
    setShared(false);
  };

  const sharePayload = result ? summaryText(result) : '';
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
          <p className="text-xs font-normal text-muted-foreground">B = S × S × D</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <BradfordFactorForm
          draft={draft}
          factorDisplay={result?.factorDisplay ?? ''}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={resetAll}
          onReset={resetAll}
        />
        <BradfordFactorResults
          result={result}
          invalid={hasFieldErrors}
          incomplete={incomplete}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(result)).then((ok) => {
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
