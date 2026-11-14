'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateFeetToInches, formatLength } from './calculation';
import {
  FeetToInchesForm,
  draftToInput,
  inputToDraft,
  type FeetToInchesDraft,
} from './FeetToInchesForm';
import { FeetToInchesResults } from './FeetToInchesResults';
import {
  DEFAULT_FEET_TO_INCHES_INPUT,
  type FeetToInchesFieldErrors,
  type FeetToInchesResult,
} from './types';
import { validateFeetToInches } from './validation';

function summaryText(result: FeetToInchesResult): string {
  const lines = [
    'Feet to Inches Calculator — Omega Calculators',
    `${formatLength(result.feet)} feet = ${formatLength(result.inches)} inches`,
    '1 foot = 12 inches',
  ];
  for (const row of result.otherUnits) {
    lines.push(`${row.label}: ${formatLength(row.value)} ${row.unit}`);
  }
  return lines.join('\n');
}

function syncDraftFromResult(
  draft: FeetToInchesDraft,
  result: FeetToInchesResult
): FeetToInchesDraft {
  if (draft.source === 'feet') {
    return { ...draft, inches: formatLength(result.inches) };
  }
  return { ...draft, feet: formatLength(result.feet) };
}

export function FeetToInchesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<FeetToInchesDraft>(() =>
    inputToDraft(DEFAULT_FEET_TO_INCHES_INPUT)
  );
  const [errors, setErrors] = React.useState<FeetToInchesFieldErrors>({});
  const [result, setResult] = React.useState<FeetToInchesResult | null>(() =>
    calculateFeetToInches(DEFAULT_FEET_TO_INCHES_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: FeetToInchesDraft) => {
    const parsed = draftToInput(next);
    const validation = validateFeetToInches(parsed);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateFeetToInches(parsed);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
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
          <p className="text-xs font-normal text-muted-foreground">1 foot = 12 inches</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <FeetToInchesForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            const fresh = inputToDraft(DEFAULT_FEET_TO_INCHES_INPUT);
            setDraft(fresh);
            setErrors({});
            setResult(calculateFeetToInches(DEFAULT_FEET_TO_INCHES_INPUT));
            setCopied(false);
            setShared(false);
          }}
        />
        <FeetToInchesResults
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
