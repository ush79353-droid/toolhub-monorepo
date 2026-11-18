'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculatePoundsToLbs, formatMass, shareResultText } from './calculation';
import {
  PoundsToLbsForm,
  draftToInput,
  emptyDraft,
  type PoundsToLbsDraft,
} from './PoundsToLbsForm';
import { PoundsToLbsResults } from './PoundsToLbsResults';
import {
  DEFAULT_POUNDS_TO_LBS_INPUT,
  type PoundsToLbsFieldErrors,
  type PoundsToLbsResult,
} from './types';
import { isIncompleteNumber, validatePoundsToLbs } from './validation';

/** Identity sync: copy the edited raw string so decimal typing stays intact. */
function syncDraftFromSource(draft: PoundsToLbsDraft): PoundsToLbsDraft {
  if (draft.source === 'pounds') {
    return { ...draft, lbs: draft.pounds };
  }
  return { ...draft, pounds: draft.lbs };
}

function clearOpposite(draft: PoundsToLbsDraft): PoundsToLbsDraft {
  if (draft.source === 'pounds') return { ...draft, lbs: '' };
  return { ...draft, pounds: '' };
}

function initialDraft(): PoundsToLbsDraft {
  const initial = calculatePoundsToLbs(DEFAULT_POUNDS_TO_LBS_INPUT);
  return {
    source: 'pounds',
    pounds: formatMass(initial.pounds),
    lbs: formatMass(initial.lbs),
  };
}

export function PoundsToLbsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PoundsToLbsDraft>(initialDraft);
  const [errors, setErrors] = React.useState<PoundsToLbsFieldErrors>({});
  const [result, setResult] = React.useState<PoundsToLbsResult | null>(() =>
    calculatePoundsToLbs(DEFAULT_POUNDS_TO_LBS_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PoundsToLbsDraft) => {
    const sourceRaw = next.source === 'pounds' ? next.pounds : next.lbs;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validatePoundsToLbs(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculatePoundsToLbs(input);
    setResult(nextResult);
    setDraft(syncDraftFromSource(next));
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
          <p className="text-xs font-normal text-muted-foreground">1 pound = 1 lb exactly</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PoundsToLbsForm
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
            setResult(calculatePoundsToLbs(DEFAULT_POUNDS_TO_LBS_INPUT));
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
          <PoundsToLbsResults
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
        </PoundsToLbsForm>
      </div>
    </section>
  );
}
