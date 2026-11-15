'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateScale,
  formatMeasure,
  scaleKindLabel,
  unitLabel,
} from './calculation';
import { ScaleForm, emptyDraft, type ScaleDraft } from './ScaleForm';
import { ScaleResults } from './ScaleResults';
import type { ScaleCalculatorResult, ScaleFieldErrors } from './types';
import { validateScaleDraft } from './validation';

function modeLabel(mode: ScaleDraft['mode']): string {
  if (mode === 'scaled-measurement') return 'Scaled measurement';
  if (mode === 'real-measurement') return 'Real measurement';
  return 'Scale factor';
}

function summaryText(result: ScaleCalculatorResult): string {
  const noun =
    result.dimension === 'area'
      ? 'area'
      : result.dimension === 'volume'
        ? 'volume'
        : 'length';
  return [
    'Scale Calculator',
    'Omega Calculators',
    '',
    `Conversion type: ${result.dimension[0].toUpperCase()}${result.dimension.slice(1)}`,
    `Calculation: ${modeLabel(result.mode)}`,
    '',
    `Scaled ${noun}: ${formatMeasure(result.scaledValue, result.dimension)} ${unitLabel(result.scaledUnit, result.dimension)}`,
    `Real ${noun}: ${formatMeasure(result.realValue, result.dimension)} ${unitLabel(result.realUnit, result.dimension)}`,
    '',
    `Scale factor: ${formatMeasure(result.scaleFactor, 'length')}`,
    `Scale ratio: ${result.scaleRatio}`,
    '',
    `Scale type: ${scaleKindLabel(result.scaleKind)}`,
  ].join('\n');
}

export function ScaleCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<ScaleDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<ScaleFieldErrors>({});
  const [result, setResult] = React.useState<ScaleCalculatorResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: ScaleDraft) => {
    const validated = validateScaleDraft({
      dimension: next.dimension,
      mode: next.mode,
      scaledRaw: next.scaledValue,
      realRaw: next.realValue,
      scaleRaw: next.scaleInput,
      scaledUnit: next.scaledUnit,
      realUnit: next.realUnit,
    });
    setErrors(validated.errors);
    setDraft(next);

    if (!validated.isValid) {
      setResult(null);
      return;
    }

    try {
      const nextResult = calculateScale(validated.input);
      setResult(nextResult);
    } catch (err) {
      setResult(null);
      const message = err instanceof Error ? err.message : 'Unable to calculate scale.';
      if (next.mode === 'scale-factor') {
        setErrors({ ...validated.errors, realValue: message });
      } else {
        setErrors({ ...validated.errors, scaleInput: message });
      }
    }
  }, []);

  const applyExample = React.useCallback((id: 1 | 2 | 3) => {
    if (id === 1) {
      evaluate({
        dimension: 'length',
        mode: 'scale-factor',
        scaledValue: '5',
        realValue: '10',
        scaleInput: '',
        scaledUnit: 'cm',
        realUnit: 'm',
      });
      return;
    }
    if (id === 2) {
      evaluate({
        dimension: 'length',
        mode: 'real-measurement',
        scaledValue: '2.5',
        realValue: '',
        scaleInput: '1:100',
        scaledUnit: 'cm',
        realUnit: 'm',
      });
      return;
    }
    evaluate({
      dimension: 'area',
      mode: 'scaled-measurement',
      scaledValue: '',
      realValue: '100',
      scaleInput: '1:10',
      scaledUnit: 'm2',
      realUnit: 'm2',
    });
  }, [evaluate]);

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
            Length · Area · Volume scales
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ScaleForm
          draft={draft}
          errors={errors}
          calculatedScaled={
            result && draft.mode === 'scaled-measurement'
              ? formatMeasure(result.scaledValue, result.dimension)
              : null
          }
          calculatedReal={
            result && draft.mode === 'real-measurement'
              ? formatMeasure(result.realValue, result.dimension)
              : null
          }
          calculatedScale={
            result ? formatMeasure(result.scaleFactor, 'length') : null
          }
          scaleRatio={result?.scaleRatio ?? null}
          scaleKind={result ? scaleKindLabel(result.scaleKind) : null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onApplyExample={applyExample}
        />
        <ScaleResults
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
