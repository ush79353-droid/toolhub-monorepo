'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { fromLiters } from '../volume-conversion/calculation';
import {
  calculateQuartsToGallons,
  formatVolume,
  litersToExtra,
  shareResultText,
} from './calculation';
import {
  QuartsToGallonsForm,
  defaultDraft,
  draftToInput,
  emptyDraft,
  type QuartsToGallonsDraft,
} from './QuartsToGallonsForm';
import { QuartsToGallonsResults } from './QuartsToGallonsResults';
import {
  EXTRA_VOLUME_UNITS,
  SOURCE_TO_VOLUME_ID,
  type ExtraVolumeUnit,
  type QuartsToGallonsFieldErrors,
  type QuartsToGallonsResult,
} from './types';
import { isIncompleteNumber, validateQuartsToGallons } from './validation';

function syncDraftFromResult(
  draft: QuartsToGallonsDraft,
  result: QuartsToGallonsResult,
): QuartsToGallonsDraft {
  const extras = { ...draft.extras } as Partial<Record<ExtraVolumeUnit, string>>;
  for (const unit of EXTRA_VOLUME_UNITS) {
    if (draft.source === unit) continue;
    extras[unit] = formatVolume(result.extras[unit]);
  }

  return {
    ...draft,
    quarts: draft.source === 'quarts' ? draft.quarts : formatVolume(result.quarts),
    gallons: draft.source === 'gallons' ? draft.gallons : formatVolume(result.gallons),
    extras,
  };
}

function clearNonSource(draft: QuartsToGallonsDraft): QuartsToGallonsDraft {
  if (draft.source === 'quarts') {
    return { ...draft, gallons: '', extras: {} };
  }
  if (draft.source === 'gallons') {
    return { ...draft, quarts: '', extras: {} };
  }
  return {
    ...draft,
    quarts: '',
    gallons: '',
    extras: { [draft.source]: draft.extras[draft.source] },
  };
}

function initialResult(): QuartsToGallonsResult {
  return calculateQuartsToGallons({
    source: 'quarts',
    value: 4,
    gallonUnit: 'usGal',
    quartUnit: 'usQt',
  });
}

export function QuartsToGallonsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<QuartsToGallonsDraft>(() =>
    syncDraftFromResult(defaultDraft(), initialResult()),
  );
  const [errors, setErrors] = React.useState<QuartsToGallonsFieldErrors>({});
  const [result, setResult] = React.useState<QuartsToGallonsResult | null>(initialResult);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const litersRef = React.useRef<number | null>(initialResult().liters);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: QuartsToGallonsDraft) => {
    if (
      next.quarts === draft.quarts &&
      next.gallons === draft.gallons &&
      JSON.stringify(next.extras) === JSON.stringify(draft.extras) &&
      next.source === draft.source &&
      next.moreOpen !== draft.moreOpen
    ) {
      setDraft(next);
      return;
    }

    if (
      next.quarts === draft.quarts &&
      next.gallons === draft.gallons &&
      JSON.stringify(next.extras) === JSON.stringify(draft.extras) &&
      next.source === draft.source &&
      next.moreOpen === draft.moreOpen &&
      (next.gallonUnit !== draft.gallonUnit || next.quartUnit !== draft.quartUnit) &&
      litersRef.current != null
    ) {
      const liters = litersRef.current;
      const gallons = fromLiters(liters, SOURCE_TO_VOLUME_ID[next.gallonUnit]);
      const quarts = fromLiters(liters, SOURCE_TO_VOLUME_ID[next.quartUnit]);
      const extras = {} as Partial<Record<ExtraVolumeUnit, string>>;
      for (const unit of EXTRA_VOLUME_UNITS) {
        extras[unit] = formatVolume(litersToExtra(liters, unit));
      }
      const synced: QuartsToGallonsDraft = {
        ...next,
        gallons: formatVolume(gallons),
        quarts: formatVolume(quarts),
        extras,
        source: 'quarts',
      };
      setDraft(synced);
      setErrors({});
      setResult(
        calculateQuartsToGallons({
          source: 'quarts',
          value: quarts,
          gallonUnit: next.gallonUnit,
          quartUnit: next.quartUnit,
        }),
      );
      return;
    }

    const sourceRaw =
      next.source === 'quarts'
        ? next.quarts
        : next.source === 'gallons'
          ? next.gallons
          : (next.extras[next.source] ?? '');

    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      litersRef.current = null;
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateQuartsToGallons(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      litersRef.current = null;
      setDraft(next);
      return;
    }
    const nextResult = calculateQuartsToGallons(input);
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
            US · UK quarts and gallons · 1 gal = 4 qt same system
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <QuartsToGallonsForm
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
            litersRef.current = nextResult.liters;
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
          <QuartsToGallonsResults
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
        </QuartsToGallonsForm>
      </div>
    </section>
  );
}
