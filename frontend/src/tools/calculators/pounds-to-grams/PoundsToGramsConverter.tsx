'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculatePoundsToGrams,
  formatMass,
  GRAMS_PER_POUND,
  shareResultText,
} from './calculation';
import {
  PoundsToGramsForm,
  draftToInput,
  emptyDraft,
  type PoundsToGramsDraft,
} from './PoundsToGramsForm';
import { PoundsToGramsResults } from './PoundsToGramsResults';
import {
  DEFAULT_POUNDS_TO_GRAMS_INPUT,
  type PoundsToGramsFieldErrors,
  type PoundsToGramsResult,
} from './types';
import { isIncompleteNumber, validatePoundsToGrams } from './validation';

function syncDraftFromResult(
  draft: PoundsToGramsDraft,
  result: PoundsToGramsResult,
): PoundsToGramsDraft {
  if (draft.source === 'pounds') {
    return { ...draft, grams: formatMass(result.grams) };
  }
  return { ...draft, pounds: formatMass(result.pounds) };
}

function clearOpposite(draft: PoundsToGramsDraft): PoundsToGramsDraft {
  if (draft.source === 'pounds') return { ...draft, grams: '' };
  return { ...draft, pounds: '' };
}

function initialDraft(): PoundsToGramsDraft {
  const initial = calculatePoundsToGrams(DEFAULT_POUNDS_TO_GRAMS_INPUT);
  return {
    source: 'pounds',
    pounds: formatMass(initial.pounds),
    grams: formatMass(initial.grams),
  };
}

export function PoundsToGramsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PoundsToGramsDraft>(initialDraft);
  const [errors, setErrors] = React.useState<PoundsToGramsFieldErrors>({});
  const [result, setResult] = React.useState<PoundsToGramsResult | null>(() =>
    calculatePoundsToGrams(DEFAULT_POUNDS_TO_GRAMS_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PoundsToGramsDraft) => {
    const sourceRaw = next.source === 'pounds' ? next.pounds : next.grams;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validatePoundsToGrams(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculatePoundsToGrams(input);
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
          <p className="text-xs font-normal text-muted-foreground">
            1 lb = {GRAMS_PER_POUND} g exactly
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PoundsToGramsForm
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
            setResult(calculatePoundsToGrams(DEFAULT_POUNDS_TO_GRAMS_INPUT));
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
        >
          <PoundsToGramsResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\n${window.location.href}`
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
                  ? `${payload}\n\n${window.location.href}`
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
        </PoundsToGramsForm>
      </div>
    </section>
  );
}
