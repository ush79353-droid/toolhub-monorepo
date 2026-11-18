'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getQuantity, getUnit } from './catalog';
import {
  compareValues,
  convertWithinQuantity,
  formatValue,
  shareCompareText,
  shareConvertText,
  type CompareResult,
} from './calculation';
import { formatDimension } from './dimensions';
import {
  DimensionalAnalysisForm,
  emptyDraft,
  type DimensionalDraft,
} from './DimensionalAnalysisForm';
import { DimensionalAnalysisResults } from './DimensionalAnalysisResults';
import type { FieldErrors } from './types';
import { parseNumericInput, validateTemperatureAbsolute } from './validation';

export function DimensionalAnalysisCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<DimensionalDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [lines, setLines] = React.useState<string[] | null>(null);
  const [payload, setPayload] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: DimensionalDraft) => {
    setDraft(next);
    const quantity = getQuantity(next.quantityId);
    if (!quantity) {
      setErrors({ quantity: 'Select a physical quantity.' });
      setLines(null);
      setPayload('');
      return;
    }

    if (next.mode === 'compare') {
      const p1 = parseNumericInput(next.value1);
      const p2 = parseNumericInput(next.value2);
      if (p1.blank || p2.blank) {
        setErrors({});
        setLines(null);
        setPayload('');
        return;
      }
      if (p1.incomplete || p2.incomplete) {
        setErrors({});
        return;
      }
      const nextErrors: FieldErrors = {};
      if (p1.value == null) nextErrors.value1 = p1.error ?? 'Enter a valid finite number.';
      if (p2.value == null) nextErrors.value2 = p2.error ?? 'Enter a valid finite number.';
      if (p1.value != null) {
        const t = validateTemperatureAbsolute(next.quantityId, p1.value, next.unit1Id);
        if (t) nextErrors.value1 = t;
      }
      if (p2.value != null) {
        const t = validateTemperatureAbsolute(next.quantityId, p2.value, next.unit2Id);
        if (t) nextErrors.value2 = t;
      }
      if (Object.keys(nextErrors).length > 0 || p1.value == null || p2.value == null) {
        setErrors(nextErrors);
        setLines(null);
        setPayload('');
        return;
      }

      const result: CompareResult = compareValues(
        next.quantityId,
        p1.value,
        next.unit1Id,
        p2.value,
        next.unit2Id,
      );
      if (!result.ok) {
        setErrors({ value1: result.error });
        setLines(null);
        setPayload('');
        return;
      }

      setErrors({});
      const cmp =
        result.greater === 'equal'
          ? 'The two measurements are equal.'
          : result.greater === 'first'
            ? `${formatValue(result.value1)} ${result.unit1.symbol} is greater than ${formatValue(result.value2)} ${result.unit2.symbol}.`
            : `${formatValue(result.value2)} ${result.unit2.symbol} is greater than ${formatValue(result.value1)} ${result.unit1.symbol}.`;
      setLines([
        `Physical quantity: ${result.quantity.label}`,
        `Dimension: [${result.dimensionLabel}]`,
        `${formatValue(result.value1)} ${result.unit1.symbol} = ${formatValue(result.value1InUnit2)} ${result.unit2.symbol}`,
        `${formatValue(result.value2)} ${result.unit2.symbol} = ${formatValue(result.value2InUnit1)} ${result.unit1.symbol}`,
        `Difference: ${formatValue(result.differenceSi)} ${result.quantity.siSymbol}`,
        cmp,
      ]);
      setPayload(shareCompareText(result));
      return;
    }

    // convert
    const parsed = parseNumericInput(next.value);
    if (parsed.blank) {
      setErrors({});
      setLines(null);
      setPayload('');
      return;
    }
    if (parsed.incomplete) {
      setErrors({});
      return;
    }
    if (parsed.value == null) {
      setErrors({ value: parsed.error ?? 'Enter a valid finite number.' });
      setLines(null);
      setPayload('');
      return;
    }
    const tempErr = validateTemperatureAbsolute(next.quantityId, parsed.value, next.fromId);
    if (tempErr) {
      setErrors({ value: tempErr });
      setLines(null);
      setPayload('');
      return;
    }

    const converted = convertWithinQuantity(quantity, parsed.value, next.fromId, next.toId);
    if (!converted.ok) {
      setErrors({ value: converted.error });
      setLines(null);
      setPayload('');
      return;
    }

    const from = getUnit(next.quantityId, next.fromId)!;
    const to = getUnit(next.quantityId, next.toId)!;
    setErrors({});
    setLines([
      `Physical quantity: ${quantity.label}`,
      `Dimension: [${formatDimension(quantity.dimension)}]`,
      `Original: ${formatValue(parsed.value)} ${from.symbol}`,
      `Converted: ${formatValue(converted.value)} ${to.symbol}`,
    ]);
    setPayload(
      shareConvertText({
        quantity,
        value: parsed.value,
        from,
        to,
        result: converted.value,
      }),
    );
  };

  const clearFields = () => {
    setDraft({
      ...draft,
      value1: '',
      value2: '',
      value: '',
    });
    setErrors({});
    setLines(null);
    setPayload('');
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    setDraft(emptyDraft());
    setErrors({});
    setLines(null);
    setPayload('');
    setCopied(false);
    setShared(false);
  };

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Dimensional Analysis Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Compare · convert · SI dimensions
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <DimensionalAnalysisForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <DimensionalAnalysisResults
            lines={lines}
            placeholder={
              draft.mode === 'compare'
                ? 'Enter both values to compare measurements of the same physical quantity.'
                : 'Enter a value and choose From / To units to convert.'
            }
            copied={copied}
            shared={shared}
            canShare={canShare && Boolean(payload)}
            onCopy={() => {
              if (!payload) return;
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
              if (!payload) return;
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
        </DimensionalAnalysisForm>
      </div>
    </section>
  );
}
