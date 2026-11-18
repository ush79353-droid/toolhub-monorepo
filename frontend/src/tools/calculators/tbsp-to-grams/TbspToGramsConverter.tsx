'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateTbspToGrams,
  formatKitchen,
  formatMeasure,
  shareResultText,
} from './calculation';
import {
  TbspToGramsForm,
  draftToInput,
  emptyDraft,
  type TbspToGramsDraft,
} from './TbspToGramsForm';
import { TbspToGramsResults } from './TbspToGramsResults';
import type { TbspToGramsFieldErrors, TbspToGramsResult } from './types';
import { isIncompleteNumber, validateTbspToGrams } from './validation';

function syncDraftFromResult(
  draft: TbspToGramsDraft,
  result: TbspToGramsResult,
): TbspToGramsDraft {
  if (draft.source === 'tablespoons') {
    return { ...draft, grams: formatKitchen(result.grams) };
  }
  return { ...draft, tablespoons: formatMeasure(result.tablespoons) };
}

function clearOpposite(draft: TbspToGramsDraft): TbspToGramsDraft {
  if (draft.source === 'tablespoons') return { ...draft, grams: '' };
  return { ...draft, tablespoons: '' };
}

export function TbspToGramsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<TbspToGramsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<TbspToGramsFieldErrors>({});
  const [result, setResult] = React.useState<TbspToGramsResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: TbspToGramsDraft) => {
    if (
      next.showDensity !== draft.showDensity &&
      next.ingredientId === draft.ingredientId &&
      next.tablespoons === draft.tablespoons &&
      next.grams === draft.grams &&
      next.source === draft.source
    ) {
      setDraft(next);
      return;
    }

    if (next.ingredientId !== draft.ingredientId) {
      const sourceRaw =
        next.source === 'tablespoons' ? next.tablespoons : next.grams;
      if (
        sourceRaw.trim() === '' ||
        isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))
      ) {
        setDraft(clearOpposite(next));
        setErrors({});
        setResult(null);
        return;
      }
      const input = draftToInput(next);
      const validation = validateTbspToGrams(input);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateTbspToGrams(input);
      setResult(nextResult);
      setDraft(syncDraftFromResult(next, nextResult));
      return;
    }

    const sourceRaw =
      next.source === 'tablespoons' ? next.tablespoons : next.grams;
    if (
      sourceRaw.trim() === '' ||
      isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))
    ) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateTbspToGrams(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateTbspToGrams(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const clearFields = () => {
    setDraft(emptyDraft());
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
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
            US tbsp ↔ grams by ingredient density
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <TbspToGramsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={clearFields}
          onReset={clearFields}
        >
          <TbspToGramsResults
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
        </TbspToGramsForm>
      </div>
    </section>
  );
}
