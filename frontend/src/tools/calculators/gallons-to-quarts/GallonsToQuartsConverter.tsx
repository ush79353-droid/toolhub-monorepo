'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { fromLiters } from '../volume-conversion/calculation';
import {
  calculateGalToQuarts,
  formatVolume,
  shareResultText,
} from './calculation';
import {
  GalToQuartsForm,
  draftToInput,
  emptyDraft,
  type GalToQuartsDraft,
} from './GalToQuartsForm';
import { GalToQuartsResults } from './GalToQuartsResults';
import {
  SOURCE_TO_VOLUME_ID,
  type GalToQuartsFieldErrors,
  type GalToQuartsResult,
} from './types';
import { isIncompleteNumber, validateGalToQuarts } from './validation';

function syncDraftFromResult(
  draft: GalToQuartsDraft,
  result: GalToQuartsResult,
): GalToQuartsDraft {
  return {
    ...draft,
    gallons: draft.source === 'gallons' ? draft.gallons : formatVolume(result.gallons),
    quarts: draft.source === 'quarts' ? draft.quarts : formatVolume(result.quarts),
  };
}

function clearOpposite(draft: GalToQuartsDraft): GalToQuartsDraft {
  if (draft.source === 'gallons') return { ...draft, quarts: '' };
  return { ...draft, gallons: '' };
}

export function GallonsToQuartsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<GalToQuartsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<GalToQuartsFieldErrors>({});
  const [result, setResult] = React.useState<GalToQuartsResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const litersRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: GalToQuartsDraft) => {
    // Unit-only change: preserve physical volume.
    if (
      next.gallons === draft.gallons &&
      next.quarts === draft.quarts &&
      next.source === draft.source &&
      (next.gallonUnit !== draft.gallonUnit || next.quartUnit !== draft.quartUnit) &&
      litersRef.current != null
    ) {
      const liters = litersRef.current;
      const gallons = fromLiters(liters, SOURCE_TO_VOLUME_ID[next.gallonUnit]);
      const quarts = fromLiters(liters, SOURCE_TO_VOLUME_ID[next.quartUnit]);
      const synced: GalToQuartsDraft = {
        ...next,
        gallons: formatVolume(gallons),
        quarts: formatVolume(quarts),
        source: 'gallons',
      };
      setDraft(synced);
      setErrors({});
      setResult(
        calculateGalToQuarts({
          source: 'gallons',
          value: gallons,
          gallonUnit: next.gallonUnit,
          quartUnit: next.quartUnit,
        }),
      );
      return;
    }

    const sourceRaw = next.source === 'gallons' ? next.gallons : next.quarts;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      litersRef.current = null;
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateGalToQuarts(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      litersRef.current = null;
      setDraft(next);
      return;
    }
    const nextResult = calculateGalToQuarts(input);
    litersRef.current = nextResult.liters;
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
            US · UK gallons and quarts · 1 gal = 4 qt same system
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GalToQuartsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            litersRef.current = null;
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            litersRef.current = null;
            setCopied(false);
            setShared(false);
          }}
        >
          <GalToQuartsResults
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
        </GalToQuartsForm>
      </div>
    </section>
  );
}
