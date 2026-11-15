'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateFeetAndInches, formatDecimal } from './calculation';
import {
  DEFAULT_DRAFT,
  EMPTY_DRAFT,
  FeetAndInchesForm,
  type FeetAndInchesDraft,
} from './FeetAndInchesForm';
import { FeetAndInchesResults } from './FeetAndInchesResults';
import { OPERATION_OPTIONS, type FeetAndInchesFieldErrors, type FeetAndInchesResult } from './types';
import { draftScalars } from './validation';

function summaryText(draft: FeetAndInchesDraft, result: FeetAndInchesResult): string {
  const opLabel =
    OPERATION_OPTIONS.find((option) => option.value === result.operation)?.label ??
    result.operation;
  const lines = [
    'Feet and Inches Calculator — Omega Calculators',
    `Operation: ${opLabel}`,
    `First Measurement: ${draft.firstFeet || '0'} ft ${draft.firstInches || '0'} in`,
  ];
  if (result.operation === 'add' || result.operation === 'subtract') {
    lines.push(
      `Second Measurement: ${draft.secondFeet || '0'} ft ${draft.secondInches || '0'} in`
    );
  } else {
    lines.push(`Scalar: ${draft.scalar}`);
  }
  lines.push(`Result: ${result.normalized.mixedLabel}`);
  lines.push(`Total Inches: ${formatDecimal(result.totalInches)} in`);
  lines.push(`Decimal Feet: ${formatDecimal(result.decimalFeet)} ft`);
  return lines.join('\n');
}

export function FeetAndInchesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<FeetAndInchesDraft>(DEFAULT_DRAFT);
  const [errors, setErrors] = React.useState<FeetAndInchesFieldErrors>({});
  const [result, setResult] = React.useState<FeetAndInchesResult | null>(() => {
    const parsed = draftScalars(
      DEFAULT_DRAFT.operation,
      DEFAULT_DRAFT.firstFeet,
      DEFAULT_DRAFT.firstInches,
      DEFAULT_DRAFT.secondFeet,
      DEFAULT_DRAFT.secondInches,
      DEFAULT_DRAFT.scalar,
      DEFAULT_DRAFT.precision
    );
    return parsed.input ? calculateFeetAndInches(parsed.input) : null;
  });
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: FeetAndInchesDraft) => {
      if (
        next.firstFeet === draft.firstFeet &&
        next.firstInches === draft.firstInches &&
        next.secondFeet === draft.secondFeet &&
        next.secondInches === draft.secondInches &&
        next.scalar === draft.scalar &&
        next.operation === draft.operation &&
        next.precision === draft.precision &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftScalars(
        next.operation,
        next.firstFeet,
        next.firstInches,
        next.secondFeet,
        next.secondInches,
        next.scalar,
        next.precision
      );
      setErrors(parsed.errors);
      setDraft(next);
      if (!parsed.isValid || !parsed.input) {
        setResult(null);
        return;
      }
      setResult(calculateFeetAndInches(parsed.input));
    },
    [draft]
  );

  const sharePayload = result ? summaryText(draft, result) : '';

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
            Add · subtract · multiply · divide · 1 ft = 12 in
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <FeetAndInchesForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(EMPTY_DRAFT);
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <FeetAndInchesResults
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
