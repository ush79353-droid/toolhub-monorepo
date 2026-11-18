'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getUnit } from './catalog';
import { DEFAULT_SOURCE_VALUE, type ConversionFieldErrors } from './types';
import { convertValue, formatAmount, shareResultText } from './calculation';
import {
  ConversionForm,
  defaultDraft,
  emptyDraft,
  type ConversionDraft,
} from './ConversionForm';
import { ConversionResults } from './ConversionResults';
import { parseAmountInput } from './validation';

export function ConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<ConversionDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<ConversionFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const sourceRef = React.useRef<number | null>(DEFAULT_SOURCE_VALUE);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const applyConversion = (
    next: ConversionDraft,
    field: 'source' | 'dest',
    value: number,
  ) => {
    const fromUnit = field === 'source' ? next.sourceUnit : next.destUnit;
    const toUnit = field === 'source' ? next.destUnit : next.sourceUnit;
    const result = convertValue(next.category, fromUnit, toUnit, value);
    if (!result.ok) {
      setDraft(next);
      setErrors({ [field]: result.error });
      setHasResult(false);
      sourceRef.current = null;
      return;
    }

    const sourceValue = field === 'source' ? value : result.value;
    const destValue = field === 'dest' ? value : result.value;
    sourceRef.current = sourceValue;
    setDraft({
      ...next,
      source: field === 'source' ? next.source : formatAmount(sourceValue),
      dest: field === 'dest' ? next.dest : formatAmount(destValue),
    });
    setErrors({});
    setHasResult(true);
  };

  const evaluate = (next: ConversionDraft) => {
    if (next.category !== draft.category && next.activeField == null) {
      sourceRef.current = null;
      setDraft(next);
      setErrors({});
      setHasResult(false);
      return;
    }

    if (next.sourceUnit !== draft.sourceUnit || next.destUnit !== draft.destUnit) {
      const field = next.activeField === 'dest' ? 'dest' : 'source';
      const raw = field === 'source' ? next.source : next.dest;
      const parsed = parseAmountInput(raw);
      if (!parsed.blank && !parsed.incomplete && parsed.value != null) {
        applyConversion(next, field, parsed.value);
        return;
      }
      if (sourceRef.current != null && field === 'source') {
        applyConversion({ ...next, activeField: 'source' }, 'source', sourceRef.current);
        return;
      }
      if (parsed.blank) {
        sourceRef.current = null;
        setDraft({
          ...next,
          source: field === 'source' ? raw : '',
          dest: field === 'dest' ? raw : '',
        });
        setErrors({});
        setHasResult(false);
        return;
      }
      if (parsed.incomplete) {
        setDraft(next);
        setErrors({});
        return;
      }
      setDraft(next);
      setErrors({ [field]: parsed.error ?? 'Enter a valid finite number.' });
      setHasResult(false);
      sourceRef.current = null;
      return;
    }

    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const raw = field === 'source' ? next.source : next.dest;
    const parsed = parseAmountInput(raw);
    if (parsed.blank) {
      sourceRef.current = null;
      setDraft({
        ...next,
        source: field === 'source' ? raw : '',
        dest: field === 'dest' ? raw : '',
      });
      setErrors({});
      setHasResult(false);
      return;
    }
    if (parsed.incomplete) {
      setDraft(next);
      setErrors({});
      return;
    }
    if (parsed.value == null) {
      setDraft(next);
      setErrors({ [field]: parsed.error ?? 'Enter a valid finite number.' });
      setHasResult(false);
      sourceRef.current = null;
      return;
    }

    applyConversion(next, field, parsed.value);
  };

  const swapUnits = () => {
    const swapped: ConversionDraft = {
      ...draft,
      source: draft.dest,
      dest: draft.source,
      sourceUnit: draft.destUnit,
      destUnit: draft.sourceUnit,
      activeField: 'source',
    };
    const parsed = parseAmountInput(swapped.source);
    if (parsed.blank) {
      sourceRef.current = null;
      setDraft({ ...swapped, dest: '' });
      setErrors({});
      setHasResult(false);
      return;
    }
    if (parsed.incomplete) {
      setDraft(swapped);
      setErrors({});
      return;
    }
    if (parsed.value == null) {
      setDraft(swapped);
      setErrors({ source: parsed.error ?? 'Enter a valid finite number.' });
      setHasResult(false);
      return;
    }
    applyConversion(swapped, 'source', parsed.value);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      sourceRef.current = DEFAULT_SOURCE_VALUE;
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      sourceRef.current = null;
      setDraft(emptyDraft(draft.category, draft.sourceUnit, draft.destUnit));
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const sourceUnit = getUnit(draft.category, draft.sourceUnit);
  const destUnit = getUnit(draft.category, draft.destUnit);
  const summary =
    hasResult && draft.source !== '' && draft.dest !== ''
      ? `${draft.source} ${sourceUnit?.symbol ?? ''} = ${draft.dest} ${destUnit?.symbol ?? ''}`.trim()
      : null;
  const payload =
    hasResult && draft.source !== '' && draft.dest !== ''
      ? shareResultText({
          categoryId: draft.category,
          sourceValue: draft.source,
          destValue: draft.dest,
          sourceUnitId: draft.sourceUnit,
          destUnitId: draft.destUnit,
        })
      : '';

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
            Universal unit converter
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ConversionForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSwap={swapUnits}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'source' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <ConversionResults
            summary={summary}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined' ? `${payload}\n\nExplore: ${window.location.href}` : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined' ? `${payload}\n\nExplore: ${window.location.href}` : payload;
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
        </ConversionForm>
      </div>
    </section>
  );
}
