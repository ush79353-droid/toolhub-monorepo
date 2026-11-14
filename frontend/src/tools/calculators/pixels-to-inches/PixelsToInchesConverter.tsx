'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculatePixelsToInches, formatMeasure } from './calculation';
import {
  PixelsToInchesForm,
  draftToInput,
  inputToDraft,
  type PixelsToInchesDraft,
} from './PixelsToInchesForm';
import { PixelsToInchesResults } from './PixelsToInchesResults';
import {
  DEFAULT_PIXELS_TO_INCHES_INPUT,
  EMPTY_PIXELS_TO_INCHES_INPUT,
  type PixelsToInchesFieldErrors,
  type PixelsToInchesResult,
} from './types';
import { validatePixelsToInches } from './validation';

function summaryText(result: PixelsToInchesResult): string {
  const lines = [
    'Pixels to Inches Converter — Omega Calculators',
    `Pixels: ${formatMeasure(result.pixels)} px`,
    `PPI: ${formatMeasure(result.ppi)}`,
    `Inches: ${formatMeasure(result.inches)} in`,
  ];
  for (const row of result.otherUnits) {
    lines.push(`${row.label}: ${formatMeasure(row.value)} ${row.unit}`);
  }
  return lines.join('\n');
}

function syncDraftFromResult(
  draft: PixelsToInchesDraft,
  result: PixelsToInchesResult
): PixelsToInchesDraft {
  if (draft.source === 'inches') {
    return { ...draft, pixels: formatMeasure(result.pixels) };
  }
  return { ...draft, inches: formatMeasure(result.inches) };
}

export function PixelsToInchesConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PixelsToInchesDraft>(() =>
    inputToDraft(DEFAULT_PIXELS_TO_INCHES_INPUT)
  );
  const [errors, setErrors] = React.useState<PixelsToInchesFieldErrors>({});
  const [result, setResult] = React.useState<PixelsToInchesResult | null>(() =>
    calculatePixelsToInches(DEFAULT_PIXELS_TO_INCHES_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: PixelsToInchesDraft) => {
    const parsed = draftToInput(next);
    const validation = validatePixelsToInches(parsed);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculatePixelsToInches(parsed);
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
          <p className="text-xs font-normal text-muted-foreground">
            inches = pixels ÷ PPI · default 96 PPI
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PixelsToInchesForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            const fresh = inputToDraft(EMPTY_PIXELS_TO_INCHES_INPUT);
            setDraft(fresh);
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <PixelsToInchesResults
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
