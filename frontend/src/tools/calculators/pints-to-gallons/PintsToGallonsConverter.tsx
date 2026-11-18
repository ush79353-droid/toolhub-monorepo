'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculatePintsToGallons,
  formatVolume,
  shareResultText,
} from './calculation';
import {
  PintsToGallonsForm,
  defaultDraft,
  draftToInput,
  emptyDraft,
  type PintsToGallonsDraft,
} from './PintsToGallonsForm';
import { PintsToGallonsResults } from './PintsToGallonsResults';
import type { PintsToGallonsFieldErrors, PintsToGallonsResult } from './types';
import { isIncompleteNumber, validatePintsToGallons } from './validation';

function syncDraftFromResult(
  draft: PintsToGallonsDraft,
  result: PintsToGallonsResult,
): PintsToGallonsDraft {
  return {
    ...draft,
    usPt: draft.source === 'usPt' ? draft.usPt : formatVolume(result.usPt),
    ukPt: draft.source === 'ukPt' ? draft.ukPt : formatVolume(result.ukPt),
    usGal: draft.source === 'usGal' ? draft.usGal : formatVolume(result.usGal),
    ukGal: draft.source === 'ukGal' ? draft.ukGal : formatVolume(result.ukGal),
  };
}

function clearNonSource(draft: PintsToGallonsDraft): PintsToGallonsDraft {
  const next = { ...draft };
  for (const key of ['usPt', 'ukPt', 'usGal', 'ukGal'] as const) {
    if (key !== draft.source) next[key] = '';
  }
  return next;
}

function initialResult(): PintsToGallonsResult {
  return calculatePintsToGallons({ source: 'usPt', value: 1 });
}

export function PintsToGallonsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PintsToGallonsDraft>(() => {
    const base = defaultDraft();
    return syncDraftFromResult(base, initialResult());
  });
  const [errors, setErrors] = React.useState<PintsToGallonsFieldErrors>({});
  const [result, setResult] = React.useState<PintsToGallonsResult | null>(initialResult);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PintsToGallonsDraft) => {
    if (
      next.usPt === draft.usPt &&
      next.ukPt === draft.ukPt &&
      next.usGal === draft.usGal &&
      next.ukGal === draft.ukGal &&
      next.source === draft.source &&
      (next.pintsOpen !== draft.pintsOpen || next.gallonsOpen !== draft.gallonsOpen)
    ) {
      setDraft(next);
      return;
    }

    const sourceRaw = next[next.source];
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validatePintsToGallons(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculatePintsToGallons(input);
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
            US · UK pints and gallons · 1 gal = 8 pt (same system)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PintsToGallonsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            const nextResult = initialResult();
            setDraft(syncDraftFromResult(defaultDraft(), nextResult));
            setErrors({});
            setResult(nextResult);
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
          <PintsToGallonsResults
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
        </PintsToGallonsForm>
      </div>
    </section>
  );
}
