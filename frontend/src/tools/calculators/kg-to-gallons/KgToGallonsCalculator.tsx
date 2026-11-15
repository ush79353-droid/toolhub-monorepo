'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateKgToGallons, formatMeasure } from './calculation';
import {
  draftToInput,
  inputToDraft,
  KgToGallonsForm,
  type KgToGallonsDraft,
} from './KgToGallonsForm';
import { KgToGallonsResults } from './KgToGallonsResults';
import {
  CATEGORY_OPTIONS,
  DEFAULT_KG_TO_GALLONS_INPUT,
  EMPTY_KG_TO_GALLONS_INPUT,
  GALLON_STANDARD_OPTIONS,
  MASS_UNIT_OPTIONS,
  VOLUME_UNIT_OPTIONS,
  type KgToGallonsFieldErrors,
  type KgToGallonsResult,
} from './types';
import { validateKgToGallons } from './validation';

function unitLabel(
  options: readonly { value: string; label: string }[],
  value: string
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function summaryText(result: KgToGallonsResult): string {
  return [
    'kg to Gallons Converter',
    'Omega Calculators',
    '',
    `Category: ${unitLabel(CATEGORY_OPTIONS, result.category)}`,
    `Item: ${result.substanceName}`,
    `Density: ${formatMeasure(result.densityKgPerL)} kg/L${
      result.densityApproximate ? ' (approximate)' : ''
    }`,
    `Gallon standard: ${unitLabel(GALLON_STANDARD_OPTIONS, result.gallonStandard)}`,
    `Weight: ${formatMeasure(result.mass)} ${unitLabel(MASS_UNIT_OPTIONS, result.massUnit)}`,
    `Volume: ${formatMeasure(result.volume)} ${unitLabel(VOLUME_UNIT_OPTIONS, result.volumeUnit)}`,
    `Volume (L): ${formatMeasure(result.volumeL)} L`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: KgToGallonsDraft,
  result: KgToGallonsResult
): KgToGallonsDraft {
  if (draft.source === 'mass') {
    return { ...draft, volume: formatMeasure(result.volume) };
  }
  return { ...draft, mass: formatMeasure(result.mass) };
}

export function KgToGallonsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<KgToGallonsDraft>(() => {
    const initial = calculateKgToGallons(DEFAULT_KG_TO_GALLONS_INPUT);
    return {
      ...inputToDraft(DEFAULT_KG_TO_GALLONS_INPUT, { showDensity: false }),
      mass: formatMeasure(initial.mass),
      volume: formatMeasure(initial.volume),
    };
  });
  const [errors, setErrors] = React.useState<KgToGallonsFieldErrors>({});
  const [result, setResult] = React.useState<KgToGallonsResult | null>(() =>
    calculateKgToGallons(DEFAULT_KG_TO_GALLONS_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: KgToGallonsDraft) => {
      const uiOnly =
        next.volume === draft.volume &&
        next.mass === draft.mass &&
        next.densityValue === draft.densityValue &&
        next.densityUnit === draft.densityUnit &&
        next.volumeUnit === draft.volumeUnit &&
        next.massUnit === draft.massUnit &&
        next.substanceId === draft.substanceId &&
        next.category === draft.category &&
        next.gallonStandard === draft.gallonStandard &&
        next.source === draft.source &&
        (next.moreOpen !== draft.moreOpen || next.showDensity !== draft.showDensity);

      if (uiOnly) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateKgToGallons(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateKgToGallons(parsed);
      setResult(nextResult);
      setDraft(syncDraftFromResult(next, nextResult));
    },
    [draft]
  );

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
            kg ↔ gal needs substance density
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <KgToGallonsForm
          draft={draft}
          errors={errors}
          otherVolumeUnits={result?.otherVolumeUnits ?? null}
          otherMassUnits={result?.otherMassUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_KG_TO_GALLONS_INPUT, { showDensity: false }));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <KgToGallonsResults
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
