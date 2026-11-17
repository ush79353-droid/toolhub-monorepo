'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateFlOzToLb, formatMeasure, shareResultText } from './calculation';
import {
  emptyMeasureDraft,
  FlOzToLbForm,
  draftToInput,
  type FlOzToLbDraft,
} from './FlOzToLbForm';
import { FlOzToLbResults } from './FlOzToLbResults';
import {
  WATER_DENSITY_KG_PER_M3,
  type FlOzToLbFieldErrors,
  type FlOzToLbResult,
} from './types';
import { validateFlOzToLb } from './validation';

function syncDraftFromResult(draft: FlOzToLbDraft, result: FlOzToLbResult): FlOzToLbDraft {
  if (draft.source === 'volume') {
    return { ...draft, mass: formatMeasure(result.mass) };
  }
  return { ...draft, volume: formatMeasure(result.volume) };
}

function initialDraft(): FlOzToLbDraft {
  return {
    source: 'volume',
    substanceId: 'water',
    densityValue: formatMeasure(WATER_DENSITY_KG_PER_M3),
    densityUnit: 'kgPerM3',
    volume: '',
    mass: '',
    volumeUnit: 'usFlOz',
    massUnit: 'lb',
    densityOpen: true,
  };
}

export function FluidOuncesToPoundsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<FlOzToLbDraft>(initialDraft);
  const [errors, setErrors] = React.useState<FlOzToLbFieldErrors>({});
  const [result, setResult] = React.useState<FlOzToLbResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: FlOzToLbDraft) => {
    if (
      next.volume === draft.volume &&
      next.mass === draft.mass &&
      next.densityValue === draft.densityValue &&
      next.densityUnit === draft.densityUnit &&
      next.volumeUnit === draft.volumeUnit &&
      next.massUnit === draft.massUnit &&
      next.substanceId === draft.substanceId &&
      next.source === draft.source &&
      next.densityOpen !== draft.densityOpen
    ) {
      setDraft(next);
      return;
    }

    const input = draftToInput(next);
    const validation = validateFlOzToLb(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateFlOzToLb(input);
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
            Mass = density × volume · US fl oz ≠ UK fl oz ≠ oz mass
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <FlOzToLbForm
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
            const cleared = emptyMeasureDraft(initialDraft());
            setDraft(cleared);
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <FlOzToLbResults
            result={result}
            volumeUnit={draft.volumeUnit}
            massUnit={draft.massUnit}
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
        </FlOzToLbForm>
      </div>
    </section>
  );
}
