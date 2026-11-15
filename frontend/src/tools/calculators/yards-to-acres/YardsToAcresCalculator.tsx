'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateYardsToAcres, formatArea } from './calculation';
import {
  YardsToAcresForm,
  draftToInput,
  inputToDraft,
  type YardsToAcresDraft,
} from './YardsToAcresForm';
import { YardsToAcresResults } from './YardsToAcresResults';
import {
  DEFAULT_YARDS_TO_ACRES_INPUT,
  EMPTY_YARDS_TO_ACRES_INPUT,
  type YardsToAcresFieldErrors,
  type YardsToAcresResult,
} from './types';
import { validateYardsToAcres } from './validation';

function summaryText(result: YardsToAcresResult): string {
  const lines = [
    'Yards to Acres Calculator — Omega Calculators',
    result.source === 'acres'
      ? `${formatArea(result.acres)} acres = ${formatArea(result.squareYards)} yd²`
      : `${formatArea(result.squareYards)} yd² = ${formatArea(result.acres)} acres`,
    '1 acre = 4840 square yards',
  ];
  for (const row of result.otherUnits) {
    lines.push(`${row.label}: ${formatArea(row.value)} ${row.unit}`);
  }
  return lines.join('\n');
}

function syncDraftFromResult(
  draft: YardsToAcresDraft,
  result: YardsToAcresResult
): YardsToAcresDraft {
  if (draft.source === 'squareYards') {
    return { ...draft, acres: formatArea(result.acres) };
  }
  return { ...draft, squareYards: formatArea(result.squareYards) };
}

export function YardsToAcresCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<YardsToAcresDraft>(() => {
    const initial = calculateYardsToAcres(DEFAULT_YARDS_TO_ACRES_INPUT);
    return {
      source: 'squareYards',
      squareYards: formatArea(initial.squareYards),
      acres: formatArea(initial.acres),
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<YardsToAcresFieldErrors>({});
  const [result, setResult] = React.useState<YardsToAcresResult | null>(() =>
    calculateYardsToAcres(DEFAULT_YARDS_TO_ACRES_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: YardsToAcresDraft) => {
      if (
        next.squareYards === draft.squareYards &&
        next.acres === draft.acres &&
        next.source === draft.source &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateYardsToAcres(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateYardsToAcres(parsed);
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
          <p className="text-xs font-normal text-muted-foreground">
            1 acre = 4840 square yards (yd²)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <YardsToAcresForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_YARDS_TO_ACRES_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <YardsToAcresResults
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
