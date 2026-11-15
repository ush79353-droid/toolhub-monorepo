'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCubicMeter,
  calculateMissingDimension,
  cubicMetersToVolume,
  formatMeasure,
} from './calculation';
import {
  CubicMeterForm,
  draftToInput,
  draftToVolumeInput,
  emptyMissingDraft,
  inputToDraft,
  missingDraftToInput,
  type CubicMeterDraft,
  type MissingDraft,
} from './CubicMeterForm';
import { CubicMeterResults } from './CubicMeterResults';
import {
  DEFAULT_CUBIC_METER_INPUT,
  EMPTY_CUBIC_METER_INPUT,
  type CubicMeterFieldErrors,
  type CubicMeterResult,
  type MissingDimensionFieldErrors,
  type MissingDimensionResult,
} from './types';
import { validateCubicMeter, validateMissingDimension } from './validation';

function summaryText(result: CubicMeterResult): string {
  const lines = ['Cubic Meter Calculator — Omega Calculators'];
  if (
    result.source === 'dimensions' &&
    result.length !== null &&
    result.width !== null &&
    result.height !== null
  ) {
    lines.push(`Height: ${formatMeasure(result.height)} ${result.heightUnit}`);
    lines.push(`Length: ${formatMeasure(result.length)} ${result.lengthUnit}`);
    lines.push(`Width: ${formatMeasure(result.width)} ${result.widthUnit}`);
  }
  lines.push(`Volume: ${formatMeasure(result.cubicMeters)} m³`);
  lines.push(`Cubic Feet: ≈ ${formatMeasure(result.cubicFeet)} ft³`);
  for (const row of result.otherUnits) {
    lines.push(`${row.label}: ${formatMeasure(row.value)} ${row.unit}`);
  }
  return lines.join('\n');
}

function syncVolumeDisplays(
  draft: CubicMeterDraft,
  cubicMeters: number
): Pick<CubicMeterDraft, 'volumeOther' | 'volumeM3'> {
  return {
    volumeM3: formatMeasure(cubicMeters),
    volumeOther: formatMeasure(cubicMetersToVolume(cubicMeters, draft.volumeUnit)),
  };
}

export function CubicMeterCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CubicMeterDraft>(() => {
    const initial = calculateCubicMeter(DEFAULT_CUBIC_METER_INPUT);
    const base = inputToDraft(DEFAULT_CUBIC_METER_INPUT);
    return { ...base, ...syncVolumeDisplays(base, initial.cubicMeters) };
  });
  const [errors, setErrors] = React.useState<CubicMeterFieldErrors>({});
  const [result, setResult] = React.useState<CubicMeterResult | null>(() =>
    calculateCubicMeter(DEFAULT_CUBIC_METER_INPUT)
  );
  const [missingDraft, setMissingDraft] = React.useState<MissingDraft>(() => emptyMissingDraft());
  const [missingErrors, setMissingErrors] = React.useState<MissingDimensionFieldErrors>({});
  const [missingResult, setMissingResult] = React.useState<MissingDimensionResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  /** Which volume text is active while typing (avoid reformatting it). */
  const [activeVolumeField, setActiveVolumeField] = React.useState<'other' | 'm3' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: CubicMeterDraft, volumeEdited?: 'other' | 'm3') => {
      const accordionOnly =
        next.length === draft.length &&
        next.width === draft.width &&
        next.height === draft.height &&
        next.lengthUnit === draft.lengthUnit &&
        next.widthUnit === draft.widthUnit &&
        next.heightUnit === draft.heightUnit &&
        next.volumeOther === draft.volumeOther &&
        next.volumeM3 === draft.volumeM3 &&
        next.volumeUnit === draft.volumeUnit &&
        next.source === draft.source &&
        (next.moreOpen !== draft.moreOpen || next.missingOpen !== draft.missingOpen);

      if (accordionOnly) {
        setDraft(next);
        return;
      }

      // Unit-only change on volume while keeping displays in sync.
      if (
        next.source === draft.source &&
        next.volumeUnit !== draft.volumeUnit &&
        next.volumeOther !== draft.volumeOther &&
        next.length === draft.length &&
        next.width === draft.width &&
        next.height === draft.height &&
        !volumeEdited
      ) {
        setDraft(next);
        if (result) {
          const synced = syncVolumeDisplays(next, result.cubicMeters);
          setDraft({ ...next, ...synced });
          setResult({
            ...result,
            volumeUnit: next.volumeUnit,
            volumeInSelectedUnit: cubicMetersToVolume(result.cubicMeters, next.volumeUnit),
          });
        }
        return;
      }

      const parsed =
        volumeEdited != null
          ? draftToVolumeInput(next, volumeEdited)
          : draftToInput(next);
      const validation = validateCubicMeter(parsed);
      setErrors(validation.errors);

      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        if (volumeEdited) setActiveVolumeField(volumeEdited);
        else setActiveVolumeField(null);
        return;
      }

      const nextResult = calculateCubicMeter(parsed);
      setResult(nextResult);
      setActiveVolumeField(volumeEdited ?? null);

      if (volumeEdited === 'other') {
        setDraft({
          ...next,
          source: 'volume',
          volumeM3: formatMeasure(nextResult.cubicMeters),
        });
      } else if (volumeEdited === 'm3') {
        setDraft({
          ...next,
          source: 'volume',
          volumeUnit: next.volumeUnit,
          volumeOther: formatMeasure(
            cubicMetersToVolume(nextResult.cubicMeters, next.volumeUnit)
          ),
        });
      } else {
        setDraft({
          ...next,
          source: nextResult.source,
          ...syncVolumeDisplays(next, nextResult.cubicMeters),
        });
      }
    },
    [draft, result]
  );

  const evaluateMissing = React.useCallback((next: MissingDraft) => {
    setMissingDraft(next);
    const parsed = missingDraftToInput(next);
    const validation = validateMissingDimension(parsed);
    setMissingErrors(validation.errors);
    if (!validation.isValid) {
      setMissingResult(null);
      return;
    }
    setMissingResult(calculateMissingDimension(parsed));
  }, []);

  const volumeOtherDisplay =
    activeVolumeField === 'other' ? draft.volumeOther : draft.volumeOther;
  const volumeM3Display = activeVolumeField === 'm3' ? draft.volumeM3 : draft.volumeM3;

  const sharePayload = result ? summaryText(result) : '';

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
            Volume = height × length × width
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CubicMeterForm
          draft={draft}
          errors={errors}
          cubicMeters={result?.cubicMeters ?? null}
          volumeOtherDisplay={volumeOtherDisplay}
          volumeM3Display={volumeM3Display}
          otherUnits={result?.otherUnits ?? null}
          missingDraft={missingDraft}
          missingErrors={missingErrors}
          missingResult={missingResult}
          onDraftChange={evaluate}
          onMissingChange={evaluateMissing}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
            if (draft.missingOpen) evaluateMissing(missingDraft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_CUBIC_METER_INPUT));
            setErrors({});
            setResult(null);
            setMissingDraft(emptyMissingDraft());
            setMissingErrors({});
            setMissingResult(null);
            setActiveVolumeField(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <CubicMeterResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}
