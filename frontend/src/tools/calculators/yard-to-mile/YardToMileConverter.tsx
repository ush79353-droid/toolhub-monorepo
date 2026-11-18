'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateYardToMile, formatLength, shareResultText } from './calculation';
import {
  YardToMileForm,
  draftToInput,
  emptyDraft,
  type YardToMileDraft,
} from './YardToMileForm';
import { YardToMileResults } from './YardToMileResults';
import { YARDS_PER_MILE, type YardToMileFieldErrors, type YardToMileResult } from './types';
import { isIncompleteNumber, validateYardToMile } from './validation';

function syncDraftFromResult(
  draft: YardToMileDraft,
  result: YardToMileResult,
): YardToMileDraft {
  if (draft.source === 'yards') {
    return { ...draft, miles: formatLength(result.miles) };
  }
  return { ...draft, yards: formatLength(result.yards) };
}

function clearOpposite(draft: YardToMileDraft): YardToMileDraft {
  if (draft.source === 'yards') return { ...draft, miles: '' };
  return { ...draft, yards: '' };
}

export function YardToMileConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<YardToMileDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<YardToMileFieldErrors>({});
  const [result, setResult] = React.useState<YardToMileResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: YardToMileDraft) => {
    if (
      next.yards === draft.yards &&
      next.miles === draft.miles &&
      next.source === draft.source &&
      next.moreOpen !== draft.moreOpen
    ) {
      setDraft(next);
      return;
    }

    const sourceRaw = next.source === 'yards' ? next.yards : next.miles;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateYardToMile(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateYardToMile(input);
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
            1 mi = {YARDS_PER_MILE.toLocaleString('en-US')} yd exactly
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <YardToMileForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft({ ...emptyDraft(), moreOpen: draft.moreOpen });
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <YardToMileResults
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
        </YardToMileForm>
      </div>
    </section>
  );
}
