'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateGramsToOunces, formatMass } from './calculation';
import {
  GramsToOuncesForm,
  draftToInput,
  inputToDraft,
  type GramsToOuncesDraft,
} from './GramsToOuncesForm';
import { GramsToOuncesResults } from './GramsToOuncesResults';
import {
  DEFAULT_GRAMS_TO_OUNCES_INPUT,
  EMPTY_GRAMS_TO_OUNCES_INPUT,
  GRAMS_PER_AVOIRDUPOIS_OUNCE,
  type GramsToOuncesFieldErrors,
  type GramsToOuncesResult,
} from './types';
import { validateGramsToOunces } from './validation';

function summaryText(result: GramsToOuncesResult): string {
  return [
    'Grams To Ounces Calculator — Omega Calculators',
    `Grams: ${formatMass(result.g)} g`,
    `Ounces: ≈ ${formatMass(result.oz)} oz`,
    `Conversion: 1 oz = ${GRAMS_PER_AVOIRDUPOIS_OUNCE} g`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: GramsToOuncesDraft,
  result: GramsToOuncesResult
): GramsToOuncesDraft {
  if (draft.source === 'g') {
    return { ...draft, oz: formatMass(result.oz) };
  }
  return { ...draft, g: formatMass(result.g) };
}

export function GramsToOuncesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<GramsToOuncesDraft>(() => {
    const initial = calculateGramsToOunces(DEFAULT_GRAMS_TO_OUNCES_INPUT);
    return {
      source: 'g',
      g: formatMass(initial.g),
      oz: formatMass(initial.oz),
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<GramsToOuncesFieldErrors>({});
  const [result, setResult] = React.useState<GramsToOuncesResult | null>(() =>
    calculateGramsToOunces(DEFAULT_GRAMS_TO_OUNCES_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: GramsToOuncesDraft) => {
      if (
        next.g === draft.g &&
        next.oz === draft.oz &&
        next.source === draft.source &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateGramsToOunces(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateGramsToOunces(parsed);
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
            1 oz = {GRAMS_PER_AVOIRDUPOIS_OUNCE} g
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GramsToOuncesForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_GRAMS_TO_OUNCES_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <GramsToOuncesResults
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
