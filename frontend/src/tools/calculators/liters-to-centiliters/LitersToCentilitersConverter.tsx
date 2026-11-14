'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateLitersToCentiliters, formatVolume } from './calculation';
import {
  LitersToCentilitersForm,
  draftToInput,
  inputToDraft,
  type LitersToCentilitersDraft,
} from './LitersToCentilitersForm';
import { LitersToCentilitersResults } from './LitersToCentilitersResults';
import {
  DEFAULT_LITERS_TO_CENTILITERS_INPUT,
  EMPTY_LITERS_TO_CENTILITERS_INPUT,
  type LitersToCentilitersFieldErrors,
  type LitersToCentilitersResult,
} from './types';
import { validateLitersToCentiliters } from './validation';

function summaryText(result: LitersToCentilitersResult): string {
  const lines = [
    'Liters to Centiliters Converter — Omega Calculators',
    result.source === 'centiliters'
      ? `${formatVolume(result.centiliters)} cL = ${formatVolume(result.liters)} L`
      : `${formatVolume(result.liters)} L = ${formatVolume(result.centiliters)} cL`,
    '1 L = 100 cL',
  ];
  for (const row of result.otherUnits) {
    lines.push(`${row.label}: ${formatVolume(row.value)} ${row.unit}`);
  }
  return lines.join('\n');
}

function syncDraftFromResult(
  draft: LitersToCentilitersDraft,
  result: LitersToCentilitersResult
): LitersToCentilitersDraft {
  if (draft.source === 'liters') {
    return { ...draft, centiliters: formatVolume(result.centiliters) };
  }
  return { ...draft, liters: formatVolume(result.liters) };
}

export function LitersToCentilitersConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LitersToCentilitersDraft>(() => {
    const initial = calculateLitersToCentiliters(DEFAULT_LITERS_TO_CENTILITERS_INPUT);
    return {
      source: 'liters',
      liters: formatVolume(initial.liters),
      centiliters: formatVolume(initial.centiliters),
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<LitersToCentilitersFieldErrors>({});
  const [result, setResult] = React.useState<LitersToCentilitersResult | null>(() =>
    calculateLitersToCentiliters(DEFAULT_LITERS_TO_CENTILITERS_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: LitersToCentilitersDraft) => {
      if (
        next.liters === draft.liters &&
        next.centiliters === draft.centiliters &&
        next.source === draft.source &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateLitersToCentiliters(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateLitersToCentiliters(parsed);
      setResult(nextResult);
      setDraft(syncDraftFromResult(next, nextResult));
    },
    [draft]
  );

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
          <p className="text-xs font-normal text-muted-foreground">1 L = 100 cL</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LitersToCentilitersForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_LITERS_TO_CENTILITERS_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <LitersToCentilitersResults
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
