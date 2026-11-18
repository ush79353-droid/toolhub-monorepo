'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateMeasurement,
  convertMeasurement,
  formatWithPrecision,
  shareResultText,
} from './calculation';
import {
  MeasurementConverterForm,
  draftActiveValue,
  emptyDraft,
  type MeasurementDraft,
} from './MeasurementConverterForm';
import { MeasurementConverterResults } from './MeasurementConverterResults';
import type { MeasurementFieldErrors, MeasurementResult } from './types';
import { getCategory } from './units';
import { validateMeasurement } from './validation';

function syncDraft(draft: MeasurementDraft): {
  draft: MeasurementDraft;
  result: MeasurementResult | null;
  errors: MeasurementFieldErrors;
} {
  const value = draftActiveValue(draft);
  const input = {
    dimension: draft.dimension,
    fromUnit: draft.fromUnit,
    toUnit: draft.toUnit,
    value,
    activeField: draft.activeField,
    precision: draft.precision,
  };
  const validation = validateMeasurement(input);
  if (!validation.isValid) {
    const cleared =
      Object.keys(validation.errors).length === 0
        ? draft.activeField === 'input'
          ? { ...draft, output: '' }
          : { ...draft, input: '' }
        : draft;
    return { draft: cleared, result: null, errors: validation.errors };
  }

  const result = calculateMeasurement(input);
  if (!result) {
    return { draft, result: null, errors: validation.errors };
  }

  return {
    draft: {
      ...draft,
      input: formatWithPrecision(
        draft.activeField === 'input' ? value! : result.inputValue,
        draft.precision,
      ),
      output: formatWithPrecision(
        draft.activeField === 'input' ? result.outputValue : value!,
        draft.precision,
      ),
    },
    result,
    errors: {},
  };
}

export function MeasurementConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MeasurementDraft>(() => emptyDraft('length'));
  const [errors, setErrors] = React.useState<MeasurementFieldErrors>({});
  const [result, setResult] = React.useState<MeasurementResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MeasurementDraft) => {
    // Unit/precision-only change: preserve active physical value when possible.
    if (
      next.input === draft.input &&
      next.output === draft.output &&
      next.activeField === draft.activeField &&
      next.dimension === draft.dimension &&
      (next.fromUnit !== draft.fromUnit ||
        next.toUnit !== draft.toUnit ||
        next.precision !== draft.precision)
    ) {
      const value = draftActiveValue(draft);
      if (value === null || !Number.isFinite(value)) {
        setDraft(next);
        setResult(null);
        setErrors({});
        return;
      }
      const converted = convertMeasurement({
        value,
        category: next.dimension,
        fromUnit: next.activeField === 'input' ? next.fromUnit : next.toUnit,
        toUnit: next.activeField === 'input' ? next.toUnit : next.fromUnit,
      });
      if (!converted.ok) {
        setDraft(next);
        setResult(null);
        setErrors({ value: converted.error });
        return;
      }
      const synced: MeasurementDraft = {
        ...next,
        input:
          next.activeField === 'input'
            ? formatWithPrecision(value, next.precision)
            : formatWithPrecision(converted.value, next.precision),
        output:
          next.activeField === 'input'
            ? formatWithPrecision(converted.value, next.precision)
            : formatWithPrecision(value, next.precision),
      };
      const evaluated = syncDraft(synced);
      setDraft(evaluated.draft);
      setResult(evaluated.result);
      setErrors(evaluated.errors);
      return;
    }

    const evaluated = syncDraft(next);
    setDraft(evaluated.draft);
    setResult(evaluated.result);
    setErrors(evaluated.errors);
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
            {getCategory(draft.dimension).label} {getCategory(draft.dimension).symbol}
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MeasurementConverterForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft('length'));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft(draft.dimension));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onSwap={() =>
            evaluate({
              ...draft,
              fromUnit: draft.toUnit,
              toUnit: draft.fromUnit,
              input: draft.output,
              output: draft.input,
              activeField: draft.activeField === 'input' ? 'output' : 'input',
            })
          }
        >
          <MeasurementConverterResults
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
        </MeasurementConverterForm>
      </div>
    </section>
  );
}
