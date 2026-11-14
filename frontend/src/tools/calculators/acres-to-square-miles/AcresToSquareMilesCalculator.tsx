'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateAcresToSquareMiles, formatArea } from './calculation';
import {
  AcresToSquareMilesForm,
  draftToInput,
  inputToDraft,
  type AcresToSquareMilesDraft,
} from './AcresToSquareMilesForm';
import { AcresToSquareMilesResults } from './AcresToSquareMilesResults';
import {
  DEFAULT_ACRES_TO_SQUARE_MILES_INPUT,
  type AcresToSquareMilesFieldErrors,
  type AcresToSquareMilesResult,
} from './types';
import { validateAcresToSquareMiles } from './validation';

function summaryText(result: AcresToSquareMilesResult): string {
  return [
    'Acres to Square Miles Calculator — Omega Calculators',
    `${formatArea(result.acres)} acres = ${formatArea(result.squareMiles)} square miles`,
    result.explanation,
    '1 square mile = 640 acres',
  ].join('\n');
}

function syncDraftFromResult(
  draft: AcresToSquareMilesDraft,
  result: AcresToSquareMilesResult
): AcresToSquareMilesDraft {
  if (draft.source === 'acres') {
    return { ...draft, squareMiles: formatArea(result.squareMiles) };
  }
  return { ...draft, acres: formatArea(result.acres) };
}

export function AcresToSquareMilesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AcresToSquareMilesDraft>(() =>
    inputToDraft(DEFAULT_ACRES_TO_SQUARE_MILES_INPUT)
  );
  const [errors, setErrors] = React.useState<AcresToSquareMilesFieldErrors>({});
  const [result, setResult] = React.useState<AcresToSquareMilesResult | null>(() =>
    calculateAcresToSquareMiles(DEFAULT_ACRES_TO_SQUARE_MILES_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: AcresToSquareMilesDraft) => {
    const parsed = draftToInput(next);
    const validation = validateAcresToSquareMiles(parsed);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateAcresToSquareMiles(parsed);
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
          <p className="text-xs font-normal text-muted-foreground">1 mi² = 640 acres</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AcresToSquareMilesForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            const fresh = inputToDraft(DEFAULT_ACRES_TO_SQUARE_MILES_INPUT);
            setDraft(fresh);
            setErrors({});
            setResult(calculateAcresToSquareMiles(DEFAULT_ACRES_TO_SQUARE_MILES_INPUT));
            setCopied(false);
            setShared(false);
          }}
        />
        <AcresToSquareMilesResults
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
