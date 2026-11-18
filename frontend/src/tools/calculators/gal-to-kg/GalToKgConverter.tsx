'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateGalToKg, formatMeasure, shareResultText } from './calculation';
import {
  emptyMeasureDraft,
  GalToKgForm,
  draftToInput,
  initialDraft,
  type GalToKgDraft,
} from './GalToKgForm';
import { GalToKgResults } from './GalToKgResults';
import type { GalToKgFieldErrors, GalToKgResult } from './types';
import { isIncompleteNumber, validateGalToKg } from './validation';

function syncDraftFromResult(draft: GalToKgDraft, result: GalToKgResult): GalToKgDraft {
  return {
    ...draft,
    gallons: draft.source === 'gallons' ? draft.gallons : formatMeasure(result.gallons),
    kg: draft.source === 'kg' ? draft.kg : formatMeasure(result.kg),
    otherMass: draft.source === 'otherMass' ? draft.otherMass : formatMeasure(result.otherMass),
  };
}

function clearNonSource(draft: GalToKgDraft): GalToKgDraft {
  if (draft.source === 'gallons') return { ...draft, kg: '', otherMass: '' };
  if (draft.source === 'kg') return { ...draft, gallons: '', otherMass: '' };
  return { ...draft, gallons: '', kg: '' };
}

export function GalToKgConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<GalToKgDraft>(initialDraft);
  const [errors, setErrors] = React.useState<GalToKgFieldErrors>({});
  const [result, setResult] = React.useState<GalToKgResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: GalToKgDraft) => {
    if (
      next.gallons === draft.gallons &&
      next.kg === draft.kg &&
      next.otherMass === draft.otherMass &&
      next.densityValue === draft.densityValue &&
      next.densityUnit === draft.densityUnit &&
      next.gallonUnit === draft.gallonUnit &&
      next.otherMassUnit === draft.otherMassUnit &&
      next.materialId === draft.materialId &&
      next.category === draft.category &&
      next.source === draft.source &&
      next.densityOpen !== draft.densityOpen
    ) {
      setDraft(next);
      return;
    }

    const sourceRaw =
      next.source === 'gallons'
        ? next.gallons
        : next.source === 'kg'
          ? next.kg
          : next.otherMass;
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
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateGalToKg(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateGalToKg(input);
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
            Mass = volume × density · US / UK gallons
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GalToKgForm
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
            setDraft(emptyMeasureDraft(draft));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <GalToKgResults
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
        </GalToKgForm>
      </div>
    </section>
  );
}
