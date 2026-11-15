'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateHeightInInches, formatLength } from './calculation';
import {
  HeightInInchesForm,
  draftToInput,
  inputToDraft,
  type HeightInInchesDraft,
} from './HeightInInchesForm';
import { HeightInInchesResults } from './HeightInInchesResults';
import {
  DEFAULT_HEIGHT_IN_INCHES_INPUT,
  type HeightInInchesFieldErrors,
  type HeightInInchesResult,
} from './types';
import { validateHeightInInches } from './validation';

function summaryText(result: HeightInInchesResult): string {
  return [
    'Height in Inches Calculator — Omega Calculators',
    `${formatLength(result.feet)} ft ${formatLength(result.inches)} in = ${formatLength(result.totalInches)} in`,
    `${formatLength(result.centimeters)} cm · ${formatLength(result.meters)} m`,
    '1 foot = 12 inches · 1 inch = 2.54 cm',
  ].join('\n');
}

function syncDraftFromResult(
  draft: HeightInInchesDraft,
  result: HeightInInchesResult
): HeightInInchesDraft {
  const next: HeightInInchesDraft = {
    ...draft,
    totalInches: formatLength(result.totalInches),
    centimeters: formatLength(result.centimeters),
    meters: formatLength(result.meters),
  };

  if (draft.source === 'feetInches') {
    // Preserve the feet/inches strings the user is typing; do not round them mid-edit.
    return next;
  }

  next.feet = formatLength(result.feet);
  next.inches = formatLength(result.inches);

  if (draft.source === 'totalInches') {
    next.totalInches = draft.totalInches;
  } else if (draft.source === 'centimeters') {
    next.centimeters = draft.centimeters;
  } else if (draft.source === 'meters') {
    next.meters = draft.meters;
  }

  return next;
}

export function HeightInInchesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<HeightInInchesDraft>(() => {
    const base = inputToDraft(DEFAULT_HEIGHT_IN_INCHES_INPUT);
    const initial = calculateHeightInInches(DEFAULT_HEIGHT_IN_INCHES_INPUT);
    return {
      ...base,
      totalInches: formatLength(initial.totalInches),
      centimeters: formatLength(initial.centimeters),
      meters: formatLength(initial.meters),
    };
  });
  const [errors, setErrors] = React.useState<HeightInInchesFieldErrors>({});
  const [result, setResult] = React.useState<HeightInInchesResult | null>(() =>
    calculateHeightInInches(DEFAULT_HEIGHT_IN_INCHES_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: HeightInInchesDraft) => {
    const parsed = draftToInput(next);
    const validation = validateHeightInInches(parsed);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateHeightInInches(parsed);
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
          <p className="text-xs font-normal text-muted-foreground">1 ft = 12 in · 1 in = 2.54 cm</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <HeightInInchesForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            const initial = calculateHeightInInches(DEFAULT_HEIGHT_IN_INCHES_INPUT);
            const fresh = inputToDraft(DEFAULT_HEIGHT_IN_INCHES_INPUT);
            setDraft({
              ...fresh,
              totalInches: formatLength(initial.totalInches),
              centimeters: formatLength(initial.centimeters),
              meters: formatLength(initial.meters),
            });
            setErrors({});
            setResult(initial);
            setCopied(false);
            setShared(false);
          }}
        />
        <HeightInInchesResults
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
