'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCuInToGal,
  formatVolume,
  litersToCubicInches,
  litersToGallons,
  litersToOther,
  shareResultText,
} from './calculation';
import {
  CuInToGalForm,
  draftToInput,
  emptyDraft,
  type CuInToGalDraft,
} from './CuInToGalForm';
import { CuInToGalResults } from './CuInToGalResults';
import type { CuInToGalFieldErrors, CuInToGalResult } from './types';
import { validateCuInToGal } from './validation';

function syncDraftFromResult(draft: CuInToGalDraft, result: CuInToGalResult): CuInToGalDraft {
  if (draft.source === 'cubicInches') {
    return {
      ...draft,
      gallons: formatVolume(result.gallons),
      other: formatVolume(result.other),
    };
  }
  if (draft.source === 'gallons') {
    return {
      ...draft,
      cubicInches: formatVolume(result.cubicInches),
      other: formatVolume(result.other),
    };
  }
  return {
    ...draft,
    cubicInches: formatVolume(result.cubicInches),
    gallons: formatVolume(result.gallons),
  };
}

export function CubicInchesToGallonsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CuInToGalDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CuInToGalFieldErrors>({});
  const [result, setResult] = React.useState<CuInToGalResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const litersRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CuInToGalDraft) => {
    if (
      next.cubicInches === draft.cubicInches &&
      next.gallons === draft.gallons &&
      next.other === draft.other &&
      next.source === draft.source &&
      (next.gallonKind !== draft.gallonKind || next.otherUnit !== draft.otherUnit)
    ) {
      const liters = litersRef.current;
      if (liters === null) {
        setDraft(next);
        return;
      }
      const cubicInches = litersToCubicInches(liters);
      const gallons = litersToGallons(liters, next.gallonKind);
      const other = litersToOther(liters, next.otherUnit);
      const synced: CuInToGalDraft = {
        ...next,
        cubicInches: formatVolume(cubicInches),
        gallons: formatVolume(gallons),
        other: formatVolume(other),
      };
      setDraft(synced);
      setErrors({});
      setResult(
        calculateCuInToGal({
          source: 'cubicInches',
          cubicInches,
          gallons: null,
          other: null,
          gallonKind: next.gallonKind,
          otherUnit: next.otherUnit,
        }),
      );
      return;
    }

    const input = draftToInput(next);
    const validation = validateCuInToGal(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setDraft(next);
      setResult(null);
      if (Object.keys(validation.errors).length === 0) {
        litersRef.current = null;
      }
      return;
    }

    const nextResult = calculateCuInToGal(input);
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
            1 US gal = 231 in³ · US and UK gallons
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CuInToGalForm
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
          <CuInToGalResults
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
        </CuInToGalForm>
      </div>
    </section>
  );
}
