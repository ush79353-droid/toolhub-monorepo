'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
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

function summaryText(metadataTitle: string, draft: CagrDraft, result: CagrResult): string {
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
  return lines.join('\n');
}

export function CagrCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CagrDraft>(emptyCagrDraft);
  const [errors, setErrors] = React.useState<CagrFieldErrors>({});
  const [result, setResult] = React.useState<CagrResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [changeOpen, setChangeOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CagrDraft) => {
    const validation = validateCagrDraft(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.result);
    setDraft(validation.nextDraft ?? next);
  };

  const onFieldChange = (field: CagrField, value: string) => {
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

  const resetAll = () => {
    setDraft(emptyCagrDraft());
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setChangeOpen(false);
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
            Enter any three values to solve CAGR, periods, initial, or final
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CagrForm
          draft={draft}
          errors={errors}
          change={result?.change ?? null}
          changeOpen={changeOpen}
          onChangeOpen={setChangeOpen}
          onFieldChange={onFieldChange}
          onCurrencyChange={(currency) => evaluate({ ...draft, currency })}
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
