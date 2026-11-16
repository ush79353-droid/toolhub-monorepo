'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCubicMeterToTon,
  formatMeasure,
  shareResultText,
} from './calculation';
import {
  CuMToTonForm,
  draftToInput,
  emptyVolumeDraft,
  type CuMToTonDraft,
} from './CuMToTonForm';
import { CuMToTonResults } from './CuMToTonResults';
import {
  KG_PER_TON,
  WATER_DENSITY_KG_PER_M3,
  type CubicMeterToTonFieldErrors,
  type CubicMeterToTonResult,
} from './types';
import { validateCubicMeterToTon } from './validation';

function syncDraftFromResult(
  draft: CuMToTonDraft,
  result: CubicMeterToTonResult,
): CuMToTonDraft {
  if (draft.source === 'volume') {
    return { ...draft, massTons: formatMeasure(result.massTons) };
  }
  return { ...draft, volumeM3: formatMeasure(result.volumeM3) };
}

function initialDraft(): CuMToTonDraft {
  return {
    source: 'volume',
    category: 'liquids',
    materialId: 'fresh-water-4c',
    densityValue: formatMeasure(WATER_DENSITY_KG_PER_M3),
    densityUnit: 'kgPerM3',
    volumeM3: '',
    massTons: '',
    tonUnit: 'metricTonne',
    densityOpen: true,
  };
}

export function CubicMeterToTonConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CuMToTonDraft>(initialDraft);
  const [errors, setErrors] = React.useState<CubicMeterToTonFieldErrors>({});
  const [result, setResult] = React.useState<CubicMeterToTonResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const massKgRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CuMToTonDraft) => {
    if (
      next.volumeM3 === draft.volumeM3 &&
      next.massTons === draft.massTons &&
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

    // Ton-unit-only change: preserve physical mass from last valid result.
    if (
      next.volumeM3 === draft.volumeM3 &&
      next.massTons === draft.massTons &&
      next.densityValue === draft.densityValue &&
      next.densityUnit === draft.densityUnit &&
      next.materialId === draft.materialId &&
      next.category === draft.category &&
      next.source === draft.source &&
      next.tonUnit !== draft.tonUnit &&
      massKgRef.current != null
    ) {
      const massTons = massKgRef.current / KG_PER_TON[next.tonUnit];
      const synced: CuMToTonDraft = {
        ...next,
        massTons: formatMeasure(massTons),
        source: 'mass',
      };
      const input = draftToInput(synced);
      const validation = validateCubicMeterToTon(input);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setDraft(synced);
        setResult(null);
        return;
      }
      const nextResult = calculateCubicMeterToTon(input);
      massKgRef.current = nextResult.massKg;
      setResult(nextResult);
      setDraft(syncDraftFromResult(synced, nextResult));
      return;
    }

    const input = draftToInput(next);
    const validation = validateCubicMeterToTon(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      if (Object.keys(validation.errors).length === 0) {
        massKgRef.current = null;
      }
      return;
    }
    const nextResult = calculateCubicMeterToTon(input);
    massKgRef.current = nextResult.massKg;
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
            Mass = density × volume · metric / US / UK tons
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CuMToTonForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            massKgRef.current = null;
            setDraft(initialDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            massKgRef.current = null;
            setDraft(emptyVolumeDraft(initialDraft()));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <CuMToTonResults
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
        </CuMToTonForm>
      </div>
    </section>
  );
}
