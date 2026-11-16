'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateLitersToPounds, formatMeasure, kgPerLToDensity, shareResultText } from './calculation';
import {
  LitersToPoundsForm,
  draftToInput,
  emptyVolumeDraft,
  type LitersToPoundsDraft,
} from './LitersToPoundsForm';
import { LitersToPoundsResults } from './LitersToPoundsResults';
import {
  DEFAULT_LITERS_TO_POUNDS_INPUT,
  WATER_DENSITY_KG_PER_L,
  type LitersToPoundsFieldErrors,
  type LitersToPoundsResult,
} from './types';
import { validateLitersToPounds } from './validation';

function syncDraftFromResult(
  draft: LitersToPoundsDraft,
  result: LitersToPoundsResult,
): LitersToPoundsDraft {
  if (draft.source === 'liters') {
    return { ...draft, pounds: formatMeasure(result.pounds) };
  }
  return { ...draft, liters: formatMeasure(result.liters) };
}

function initialDraft(): LitersToPoundsDraft {
  const initial = calculateLitersToPounds(DEFAULT_LITERS_TO_POUNDS_INPUT);
  return {
    source: 'liters',
    category: 'food',
    substanceId: 'water',
    densityValue: formatMeasure(kgPerLToDensity(WATER_DENSITY_KG_PER_L, 'kgPerM3')),
    densityUnit: 'kgPerM3',
    liters: formatMeasure(initial.liters),
    pounds: formatMeasure(initial.pounds),
    densityOpen: true,
  };
}

export function LitersToPoundsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LitersToPoundsDraft>(initialDraft);
  const [errors, setErrors] = React.useState<LitersToPoundsFieldErrors>({});
  const [result, setResult] = React.useState<LitersToPoundsResult | null>(() =>
    calculateLitersToPounds(DEFAULT_LITERS_TO_POUNDS_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: LitersToPoundsDraft) => {
    if (
      next.liters === draft.liters &&
      next.pounds === draft.pounds &&
      next.densityValue === draft.densityValue &&
      next.densityUnit === draft.densityUnit &&
      next.substanceId === draft.substanceId &&
      next.category === draft.category &&
      next.source === draft.source &&
      next.densityOpen !== draft.densityOpen
    ) {
      setDraft(next);
      return;
    }

    const input = draftToInput(next);
    const validation = validateLitersToPounds(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateLitersToPounds(input);
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
            Mass = density × volume · 1 lb = 0.45359237 kg
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LitersToPoundsForm
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
            setResult(calculateLitersToPounds(DEFAULT_LITERS_TO_POUNDS_INPUT));
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            const cleared = emptyVolumeDraft({
              ...initialDraft(),
              liters: '',
              pounds: '',
            });
            setDraft(cleared);
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <LitersToPoundsResults
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
        </LitersToPoundsForm>
      </div>
    </section>
  );
}
