'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateGramsToFlOz, formatMeasure, shareResultText } from './calculation';
import {
  GramsToFlOzForm,
  draftToInput,
  initialDraft,
  type GramsToFlOzDraft,
} from './GramsToFlOzForm';
import { GramsToFlOzResults } from './GramsToFlOzResults';
import type { GramsToFlOzFieldErrors, GramsToFlOzResult } from './types';
import { isIncompleteNumber, validateGramsToFlOz } from './validation';

function syncDraftFromResult(draft: GramsToFlOzDraft, result: GramsToFlOzResult): GramsToFlOzDraft {
  if (draft.source === 'mass') {
    return { ...draft, volume: formatMeasure(result.volume) };
  }
  return { ...draft, mass: formatMeasure(result.mass) };
}

function clearOpposite(draft: GramsToFlOzDraft): GramsToFlOzDraft {
  if (draft.source === 'mass') return { ...draft, volume: '' };
  return { ...draft, mass: '' };
}

export function GramsToFlOzConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<GramsToFlOzDraft>(initialDraft);
  const [errors, setErrors] = React.useState<GramsToFlOzFieldErrors>({});
  const [result, setResult] = React.useState<GramsToFlOzResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: GramsToFlOzDraft) => {
    if (
      next.mass === draft.mass &&
      next.volume === draft.volume &&
      next.densityValue === draft.densityValue &&
      next.densityUnit === draft.densityUnit &&
      next.massUnit === draft.massUnit &&
      next.volumeUnit === draft.volumeUnit &&
      next.substanceId === draft.substanceId &&
      next.source === draft.source &&
      next.densityOpen !== draft.densityOpen
    ) {
      setDraft(next);
      return;
    }

    const sourceRaw = next.source === 'mass' ? next.mass : next.volume;
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
    const validation = validateGramsToFlOz(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateGramsToFlOz(input);
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
            Mass = density × volume · US fl oz ≠ UK fl oz
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GramsToFlOzForm
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
            setDraft(initialDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <GramsToFlOzResults
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
        </GramsToFlOzForm>
      </div>
    </section>
  );
}
