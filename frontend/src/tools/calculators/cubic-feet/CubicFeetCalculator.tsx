'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCubicFeet,
  calculateMissingDimension,
  formatMeasure,
} from './calculation';
import {
  CubicFeetForm,
  draftToInput,
  emptyMissingDraft,
  inputToDraft,
  missingDraftToInput,
  type CubicFeetDraft,
  type MissingDraft,
} from './CubicFeetForm';
import { CubicFeetResults } from './CubicFeetResults';
import {
  DEFAULT_CUBIC_FEET_INPUT,
  EMPTY_CUBIC_FEET_INPUT,
  type CubicFeetFieldErrors,
  type CubicFeetResult,
  type MissingDimensionFieldErrors,
  type MissingDimensionResult,
} from './types';
import { validateCubicFeet, validateMissingDimension } from './validation';

function summaryText(result: CubicFeetResult): string {
  const lines = [
    'Cubic Feet Calculator — Omega Calculators',
    `Length: ${formatMeasure(result.length)} ${result.lengthUnit}`,
    `Width: ${formatMeasure(result.width)} ${result.widthUnit}`,
    `Height: ${formatMeasure(result.height)} ${result.heightUnit}`,
    `Volume: ${formatMeasure(result.cubicFeet)} ft³`,
    `Equivalent: ${formatMeasure(result.cubicMeters)} m³`,
  ];
  for (const row of result.otherUnits) {
    lines.push(`${row.label}: ${formatMeasure(row.value)} ${row.unit}`);
  }
  return lines.join('\n');
}

export function CubicFeetCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CubicFeetDraft>(() =>
    inputToDraft(DEFAULT_CUBIC_FEET_INPUT)
  );
  const [errors, setErrors] = React.useState<CubicFeetFieldErrors>({});
  const [result, setResult] = React.useState<CubicFeetResult | null>(() =>
    calculateCubicFeet(DEFAULT_CUBIC_FEET_INPUT)
  );
  const [missingDraft, setMissingDraft] = React.useState<MissingDraft>(() => emptyMissingDraft());
  const [missingErrors, setMissingErrors] = React.useState<MissingDimensionFieldErrors>({});
  const [missingResult, setMissingResult] = React.useState<MissingDimensionResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: CubicFeetDraft) => {
    const accordionOnly =
      next.length === draft.length &&
      next.width === draft.width &&
      next.height === draft.height &&
      next.lengthUnit === draft.lengthUnit &&
      next.widthUnit === draft.widthUnit &&
      next.heightUnit === draft.heightUnit &&
      (next.moreOpen !== draft.moreOpen || next.missingOpen !== draft.missingOpen);

    if (accordionOnly) {
      setDraft(next);
      return;
    }

    const parsed = draftToInput(next);
    const validation = validateCubicFeet(parsed);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    setResult(calculateCubicFeet(parsed));
    setDraft(next);
  }, [draft]);

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
            Volume = length × width × height
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CubicFeetForm
          draft={draft}
          errors={errors}
          volumeCubicFeet={result?.cubicFeet ?? null}
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
            setDraft(inputToDraft(EMPTY_CUBIC_FEET_INPUT));
            setErrors({});
            setResult(null);
            setMissingDraft(emptyMissingDraft());
            setMissingErrors({});
            setMissingResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <CubicFeetResults
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
