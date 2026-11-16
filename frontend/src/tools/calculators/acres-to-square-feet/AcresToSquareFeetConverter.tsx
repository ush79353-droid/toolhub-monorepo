'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateAcresToSquareFeet, formatArea, shareResultText } from './calculation';
import {
  AcresToSquareFeetForm,
  draftToInput,
  emptyDraft,
  type AcresToSquareFeetDraft,
} from './AcresToSquareFeetForm';
import { AcresToSquareFeetResults } from './AcresToSquareFeetResults';
import {
  DEFAULT_ACRES_TO_SQUARE_FEET_INPUT,
  type AcresToSquareFeetFieldErrors,
  type AcresToSquareFeetResult,
} from './types';
import { validateAcresToSquareFeet } from './validation';

function syncDraftFromResult(
  draft: AcresToSquareFeetDraft,
  result: AcresToSquareFeetResult,
): AcresToSquareFeetDraft {
  if (draft.source === 'acres') {
    return { ...draft, squareFeet: formatArea(result.squareFeet) };
  }
  return { ...draft, acres: formatArea(result.acres) };
}

function initialDraft(): AcresToSquareFeetDraft {
  const initial = calculateAcresToSquareFeet(DEFAULT_ACRES_TO_SQUARE_FEET_INPUT);
  return {
    source: 'acres',
    acres: formatArea(initial.acres),
    squareFeet: formatArea(initial.squareFeet),
    acresFirst: true,
  };
}

export function AcresToSquareFeetConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AcresToSquareFeetDraft>(initialDraft);
  const [errors, setErrors] = React.useState<AcresToSquareFeetFieldErrors>({});
  const [result, setResult] = React.useState<AcresToSquareFeetResult | null>(() =>
    calculateAcresToSquareFeet(DEFAULT_ACRES_TO_SQUARE_FEET_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: AcresToSquareFeetDraft) => {
    if (
      next.acres === draft.acres &&
      next.squareFeet === draft.squareFeet &&
      next.source === draft.source &&
      next.acresFirst !== draft.acresFirst
    ) {
      setDraft(next);
      return;
    }

    const input = draftToInput(next);
    const validation = validateAcresToSquareFeet(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateAcresToSquareFeet(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const payload = result ? shareResultText(result) : '';

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
          <p className="text-xs font-normal text-muted-foreground">1 acre = 43,560 square feet</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AcresToSquareFeetForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(initialDraft());
            setErrors({});
            setResult(calculateAcresToSquareFeet(DEFAULT_ACRES_TO_SQUARE_FEET_INPUT));
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onSwap={() => setDraft({ ...draft, acresFirst: !draft.acresFirst })}
        >
          <AcresToSquareFeetResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(text).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
                return;
              }
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              });
            }}
          />
        </AcresToSquareFeetForm>
      </div>
    </section>
  );
}
