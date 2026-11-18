'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { formatMeasure, fromCc, fromGrams, shareResultText } from './calculation';
import {
  CcToGramsForm,
  draftToInput,
  emptyMeasureDraft,
  type CcToGramsDraft,
} from './CcToGramsForm';
import { CcToGramsResults } from './CcToGramsResults';
import {
  WATER_DENSITY_G_PER_CM3,
  type CcToGramsFieldErrors,
  type CcToGramsResult,
} from './types';
import { calculateCcToGrams } from './calculation';
import { validateCcToGrams } from './validation';

function syncDraftFromResult(draft: CcToGramsDraft, result: CcToGramsResult): CcToGramsDraft {
  if (draft.source === 'volume') {
    return { ...draft, mass: formatMeasure(fromGrams(result.massG, draft.massUnit)) };
  }
  return { ...draft, volume: formatMeasure(fromCc(result.volumeCc, draft.volumeUnit)) };
}

function initialDraft(): CcToGramsDraft {
  return {
    source: 'volume',
    substanceId: 'water',
    densityValue: formatMeasure(WATER_DENSITY_G_PER_CM3),
    densityUnit: 'gPerCm3',
    volume: '',
    mass: '',
    volumeUnit: 'cc',
    massUnit: 'g',
    densityOpen: true,
  };
}

export function CcToGramsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CcToGramsDraft>(initialDraft);
  const [errors, setErrors] = React.useState<CcToGramsFieldErrors>({});
  const [result, setResult] = React.useState<CcToGramsResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CcToGramsDraft) => {
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
    const validation = validateCcToGrams(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateCcToGrams(input);
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
            Mass = density × volume · 1 cc = 1 cm³ = 1 mL
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CcToGramsForm
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
          <CcToGramsResults
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
        </CcToGramsForm>
      </div>
    </section>
  );
}
