'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateMgToTablespoon, formatMeasure, shareResultText } from './calculation';
import {
  MgToTablespoonForm,
  clearMeasureDraft,
  draftToInput,
  initialDraft,
  type MgToTablespoonDraft,
} from './MgToTablespoonForm';
import { MgToTablespoonResults } from './MgToTablespoonResults';
import type { MgToTablespoonFieldErrors, MgToTablespoonResult } from './types';
import { isIncompleteNumber, validateMgToTablespoon } from './validation';

function syncDraftFromResult(
  draft: MgToTablespoonDraft,
  result: MgToTablespoonResult,
): MgToTablespoonDraft {
  if (draft.source === 'milligrams') {
    return { ...draft, tablespoons: formatMeasure(result.tablespoons) };
  }
  return { ...draft, milligrams: formatMeasure(result.milligrams) };
}

function clearOpposite(draft: MgToTablespoonDraft): MgToTablespoonDraft {
  if (draft.source === 'milligrams') return { ...draft, tablespoons: '' };
  return { ...draft, milligrams: '' };
}

export function MgToTablespoonConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MgToTablespoonDraft>(initialDraft);
  const [errors, setErrors] = React.useState<MgToTablespoonFieldErrors>({});
  const [result, setResult] = React.useState<MgToTablespoonResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MgToTablespoonDraft) => {
    if (
      next.milligrams === draft.milligrams &&
      next.tablespoons === draft.tablespoons &&
      next.densityValue === draft.densityValue &&
      next.densityUnit === draft.densityUnit &&
      next.tablespoonStandard === draft.tablespoonStandard &&
      next.substanceId === draft.substanceId &&
      next.source === draft.source &&
      next.densityOpen !== draft.densityOpen
    ) {
      setDraft(next);
      return;
    }

    const sourceRaw = next.source === 'milligrams' ? next.milligrams : next.tablespoons;
    const densityIncomplete =
      next.densityValue.trim() === '' ||
      isIncompleteNumber(next.densityValue.trim().replace(/,/g, ''));

    if (
      sourceRaw.trim() === '' ||
      isIncompleteNumber(sourceRaw.trim().replace(/,/g, '')) ||
      densityIncomplete
    ) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateMgToTablespoon(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateMgToTablespoon(input);
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
            Mass ↔ volume · density required · US tbsp default
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MgToTablespoonForm
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
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(clearMeasureDraft(draft));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <MgToTablespoonResults
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
        </MgToTablespoonForm>
      </div>
    </section>
  );
}
