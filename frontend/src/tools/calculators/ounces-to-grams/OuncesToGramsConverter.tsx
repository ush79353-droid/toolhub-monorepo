'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateOuncesToGrams,
  formatMass,
  GRAMS_PER_OUNCE,
  shareResultText,
  type OuncesToGramsResult,
} from './calculation';
import {
  OuncesToGramsForm,
  draftToInput,
  emptyDraft,
  type OuncesToGramsDraft,
} from './OuncesToGramsForm';
import { OuncesToGramsResults } from './OuncesToGramsResults';
import { DEFAULT_OUNCES_TO_GRAMS_INPUT, type OuncesToGramsFieldErrors } from './types';
import { isIncompleteNumber, validateOuncesToGrams } from './validation';

function syncDraftFromResult(
  draft: OuncesToGramsDraft,
  result: OuncesToGramsResult,
): OuncesToGramsDraft {
  if (draft.source === 'oz') {
    return { ...draft, g: formatMass(result.g) };
  }
  return { ...draft, oz: formatMass(result.oz) };
}

function clearOpposite(draft: OuncesToGramsDraft): OuncesToGramsDraft {
  if (draft.source === 'oz') return { ...draft, g: '' };
  return { ...draft, oz: '' };
}

function initialDraft(): OuncesToGramsDraft {
  const initial = calculateOuncesToGrams(DEFAULT_OUNCES_TO_GRAMS_INPUT);
  return {
    source: 'oz',
    oz: formatMass(initial.oz),
    g: formatMass(initial.g),
  };
}

export function OuncesToGramsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<OuncesToGramsDraft>(initialDraft);
  const [errors, setErrors] = React.useState<OuncesToGramsFieldErrors>({});
  const [result, setResult] = React.useState<OuncesToGramsResult | null>(() =>
    calculateOuncesToGrams(DEFAULT_OUNCES_TO_GRAMS_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: OuncesToGramsDraft) => {
    const sourceRaw = next.source === 'oz' ? next.oz : next.g;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateOuncesToGrams(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateOuncesToGrams(input);
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
            1 oz = {GRAMS_PER_OUNCE} g (avoirdupois)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <OuncesToGramsForm
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
            setResult(calculateOuncesToGrams(DEFAULT_OUNCES_TO_GRAMS_INPUT));
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
          <OuncesToGramsResults
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
        </OuncesToGramsForm>
      </div>
    </section>
  );
}
