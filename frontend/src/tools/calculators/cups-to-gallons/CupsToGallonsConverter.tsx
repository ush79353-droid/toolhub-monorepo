'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCupsToGal,
  formatVolume,
  litersToExtra,
  shareResultText,
} from './calculation';
import {
  CupsToGalForm,
  draftToInput,
  emptyDraft,
  type CupsToGalDraft,
} from './CupsToGalForm';
import { CupsToGalResults } from './CupsToGalResults';
import {
  EXTRA_VOLUME_UNITS,
  LITERS_PER_CUP,
  LITERS_PER_GALLON,
  type CupsToGalFieldErrors,
  type CupsToGalResult,
  type ExtraVolumeUnit,
} from './types';
import { validateCupsToGal } from './validation';

function syncDraftFromResult(draft: CupsToGalDraft, result: CupsToGalResult): CupsToGalDraft {
  const extras = { ...draft.extras } as Partial<Record<ExtraVolumeUnit, string>>;
  for (const unit of EXTRA_VOLUME_UNITS) {
    if (draft.source === unit) continue;
    extras[unit] = formatVolume(result.extras[unit]);
  }

  return {
    ...draft,
    cups: draft.source === 'cups' ? draft.cups : formatVolume(result.cups),
    gallons: draft.source === 'gallons' ? draft.gallons : formatVolume(result.gallons),
    extras,
  };
}

function clearNonSource(draft: CupsToGalDraft): CupsToGalDraft {
  if (draft.source === 'cups') {
    return { ...draft, gallons: '', extras: {} };
  }
  if (draft.source === 'gallons') {
    return { ...draft, cups: '', extras: {} };
  }
  return {
    ...draft,
    cups: '',
    gallons: '',
    extras: { [draft.source]: draft.extras[draft.source] },
  };
}

export function CupsToGallonsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CupsToGalDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CupsToGalFieldErrors>({});
  const [result, setResult] = React.useState<CupsToGalResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const litersRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CupsToGalDraft) => {
    if (
      next.cups === draft.cups &&
      next.gallons === draft.gallons &&
      JSON.stringify(next.extras) === JSON.stringify(draft.extras) &&
      next.source === draft.source &&
      next.moreOpen !== draft.moreOpen
    ) {
      setDraft(next);
      return;
    }

    // Cup/gallon unit-only change: preserve physical volume.
    if (
      next.cups === draft.cups &&
      next.gallons === draft.gallons &&
      JSON.stringify(next.extras) === JSON.stringify(draft.extras) &&
      next.source === draft.source &&
      next.moreOpen === draft.moreOpen &&
      (next.cupUnit !== draft.cupUnit || next.gallonUnit !== draft.gallonUnit) &&
      litersRef.current != null
    ) {
      const liters = litersRef.current;
      const cups = liters / LITERS_PER_CUP[next.cupUnit];
      const gallons = liters / LITERS_PER_GALLON[next.gallonUnit];
      const extras = {} as Partial<Record<ExtraVolumeUnit, string>>;
      for (const unit of EXTRA_VOLUME_UNITS) {
        extras[unit] = formatVolume(litersToExtra(liters, unit));
      }
      const synced: CupsToGalDraft = {
        ...next,
        cups: formatVolume(cups),
        gallons: formatVolume(gallons),
        extras,
        source: 'cups',
      };
      setDraft(synced);
      setErrors({});
      setResult(
        calculateCupsToGal({
          source: 'cups',
          value: cups,
          cupUnit: next.cupUnit,
          gallonUnit: next.gallonUnit,
        }),
      );
      return;
    }

    const input = draftToInput(next);
    const validation = validateCupsToGal(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(input.value === null ? clearNonSource(next) : next);
      if (Object.keys(validation.errors).length === 0) {
        litersRef.current = null;
      }
      return;
    }
    const nextResult = calculateCupsToGal(input);
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
            1 US gal = 16 US cups · US / metric / UK cups
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CupsToGalForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            litersRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            litersRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <CupsToGalResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
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
                  ? `${payload}\n\nExplore: ${window.location.href}`
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
        </CupsToGalForm>
      </div>
    </section>
  );
}
