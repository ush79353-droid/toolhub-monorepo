'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCubicFeetToPounds,
  formatMeasure,
  shareResultText,
} from './calculation';
import {
  CuFtToLbForm,
  draftToInput,
  emptyVolumeDraft,
  type CuFtToLbDraft,
} from './CuFtToLbForm';
import { CuFtToLbResults } from './CuFtToLbResults';
import {
  CONCRETE_DENSITY_LB_PER_FT3,
  type CubicFeetToPoundsFieldErrors,
  type CubicFeetToPoundsResult,
} from './types';
import { validateCubicFeetToPounds } from './validation';

function syncDraftFromResult(
  draft: CuFtToLbDraft,
  result: CubicFeetToPoundsResult,
): CuFtToLbDraft {
  if (draft.source === 'cubicFeet') {
    return { ...draft, pounds: formatMeasure(result.pounds) };
  }
  return { ...draft, cubicFeet: formatMeasure(result.cubicFeet) };
}

function initialDraft(): CuFtToLbDraft {
  return {
    source: 'cubicFeet',
    category: 'nonMetals',
    materialId: 'concrete',
    densityValue: formatMeasure(CONCRETE_DENSITY_LB_PER_FT3),
    densityUnit: 'lbPerFt3',
    cubicFeet: '',
    pounds: '',
    densityOpen: true,
  };
}

export function CubicFeetToPoundsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CuFtToLbDraft>(initialDraft);
  const [errors, setErrors] = React.useState<CubicFeetToPoundsFieldErrors>({});
  const [result, setResult] = React.useState<CubicFeetToPoundsResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CuFtToLbDraft) => {
    if (
      next.cubicFeet === draft.cubicFeet &&
      next.pounds === draft.pounds &&
      next.densityValue === draft.densityValue &&
      next.densityUnit === draft.densityUnit &&
      next.materialId === draft.materialId &&
      next.category === draft.category &&
      next.source === draft.source &&
      next.densityOpen !== draft.densityOpen
    ) {
      setDraft(next);
      return;
    }

    const input = draftToInput(next);
    const validation = validateCubicFeetToPounds(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateCubicFeetToPounds(input);
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
            Mass = density × volume · default concrete ≈ 149.83 lb/ft³
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CuFtToLbForm
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
            const cleared = emptyVolumeDraft(initialDraft());
            setDraft(cleared);
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <CuFtToLbResults
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
        </CuFtToLbForm>
      </div>
    </section>
  );
}
