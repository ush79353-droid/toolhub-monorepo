'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateQuartsToPounds, formatMeasure } from './calculation';
import {
  draftToInput,
  inputToDraft,
  QuartsToPoundsForm,
  type QuartsToPoundsDraft,
} from './QuartsToPoundsForm';
import { QuartsToPoundsResults } from './QuartsToPoundsResults';
import {
  DEFAULT_QUARTS_TO_POUNDS_INPUT,
  EMPTY_QUARTS_TO_POUNDS_INPUT,
  MASS_UNIT_OPTIONS,
  QUART_STANDARD_OPTIONS,
  VOLUME_UNIT_OPTIONS,
  type QuartsToPoundsFieldErrors,
  type QuartsToPoundsResult,
} from './types';
import { validateQuartsToPounds } from './validation';

function unitLabel(
  options: readonly { value: string; label: string }[],
  value: string
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function summaryText(result: QuartsToPoundsResult): string {
  return [
    'Quarts to Pounds Conversion — Omega Calculators',
    `Ingredient: ${result.ingredientName}`,
    `Density: ${formatMeasure(result.densityGPerMl)} kg/L${
      result.densityApproximate ? ' (approximate assumption)' : ''
    }`,
    `Quart standard: ${unitLabel(QUART_STANDARD_OPTIONS, result.quartStandard)}`,
    `Volume: ${formatMeasure(result.volume)} ${unitLabel(VOLUME_UNIT_OPTIONS, result.volumeUnit)}`,
    `Mass: ≈ ${formatMeasure(result.mass)} ${unitLabel(MASS_UNIT_OPTIONS, result.massUnit)}`,
    `Mass (kg): ${formatMeasure(result.massG / 1000)} kg`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: QuartsToPoundsDraft,
  result: QuartsToPoundsResult
): QuartsToPoundsDraft {
  if (draft.source === 'volume') {
    return { ...draft, mass: formatMeasure(result.mass) };
  }
  return { ...draft, volume: formatMeasure(result.volume) };
}

export function QuartsToPoundsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<QuartsToPoundsDraft>(() => {
    const initial = calculateQuartsToPounds(DEFAULT_QUARTS_TO_POUNDS_INPUT);
    return {
      ...inputToDraft(DEFAULT_QUARTS_TO_POUNDS_INPUT, { showDensity: false }),
      volume: formatMeasure(initial.volume),
      mass: formatMeasure(initial.mass),
    };
  });
  const [errors, setErrors] = React.useState<QuartsToPoundsFieldErrors>({});
  const [result, setResult] = React.useState<QuartsToPoundsResult | null>(() =>
    calculateQuartsToPounds(DEFAULT_QUARTS_TO_POUNDS_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: QuartsToPoundsDraft) => {
      const uiOnly =
        next.volume === draft.volume &&
        next.mass === draft.mass &&
        next.densityValue === draft.densityValue &&
        next.densityUnit === draft.densityUnit &&
        next.volumeUnit === draft.volumeUnit &&
        next.massUnit === draft.massUnit &&
        next.ingredientId === draft.ingredientId &&
        next.quartStandard === draft.quartStandard &&
        next.source === draft.source &&
        (next.moreOpen !== draft.moreOpen || next.showDensity !== draft.showDensity);

      if (uiOnly) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateQuartsToPounds(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateQuartsToPounds(parsed);
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
            qt ↔ lb needs ingredient density
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <QuartsToPoundsForm
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
            setDraft(inputToDraft(EMPTY_QUARTS_TO_POUNDS_INPUT, { showDensity: false }));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <QuartsToPoundsResults
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
