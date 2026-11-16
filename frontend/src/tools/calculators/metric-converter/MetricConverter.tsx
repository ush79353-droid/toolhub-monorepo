'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  allFromBase,
  formatMetricNumber,
  shareResultText,
} from './calculation';
import { emptyDraft, MetricConverterForm, type MetricDraft } from './MetricConverterForm';
import { MetricConverterResults } from './MetricConverterResults';
import type { ConversionCategory, MetricFieldErrors } from './types';
import { getCategory, getUnit } from './units';
import { baseFromField, parseMetricInput } from './validation';

function draftFromBase(
  category: ConversionCategory,
  base: number,
  preserve: { field: string; text: string } | null,
  openGroups: Record<string, boolean>,
): MetricDraft {
  const values = allFromBase(category, base);
  const texts: Record<string, string> = {};
  for (const [unitId, value] of Object.entries(values)) {
    texts[unitId] =
      preserve?.field === unitId ? preserve.text : formatMetricNumber(value);
  }
  return {
    category,
    texts,
    activeField: preserve?.field ?? null,
    openGroups,
  };
}

export function MetricConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MetricDraft>(() => emptyDraft('length'));
  const [errors, setErrors] = React.useState<MetricFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const baseRef = React.useRef<number | null>(null);
  const sourceUnitRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MetricDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field] ?? '';
    const parsed = parseMetricInput(source);

    if (parsed.blank) {
      baseRef.current = null;
      sourceUnitRef.current = null;
      setDraft({
        ...emptyDraft(next.category),
        openGroups: next.openGroups,
        activeField: field,
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
      baseRef.current = null;
      sourceUnitRef.current = null;
      return;
    }

    const converted = baseFromField(parsed.value, next.category, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      baseRef.current = null;
      sourceUnitRef.current = null;
      return;
    }

    baseRef.current = converted.base;
    sourceUnitRef.current = field;
    setDraft(
      draftFromBase(next.category, converted.base, { field, text: source }, next.openGroups),
    );
    setErrors({});
    setHasResult(true);
  };

  const onCategoryChange = (category: ConversionCategory) => {
    baseRef.current = null;
    sourceUnitRef.current = null;
    setDraft(emptyDraft(category));
    setErrors({});
    setHasResult(false);
    setCopied(false);
    setShared(false);
  };

  const clearFields = () => {
    baseRef.current = null;
    sourceUnitRef.current = null;
    setDraft({
      ...emptyDraft(draft.category),
      openGroups: draft.openGroups,
    });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    baseRef.current = null;
    sourceUnitRef.current = null;
    setDraft(emptyDraft('length'));
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const base = baseRef.current;
  const cat = getCategory(draft.category);
  const values = base != null && hasResult ? allFromBase(draft.category, base) : null;
  const summaryLines = values
    ? cat.summaryUnitIds.map((id) => {
        const unit = getUnit(draft.category, id)!;
        return `${formatMetricNumber(values[id])} ${unit.symbol}`;
      })
    : null;
  const payload =
    base != null && hasResult && sourceUnitRef.current
      ? shareResultText(draft.category, base, sourceUnitRef.current)
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
            Length · mass · area · volume · temperature · more
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MetricConverterForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onCategoryChange={onCategoryChange}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <MetricConverterResults
            summaryLines={summaryLines}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(summaryLines)}
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
        </MetricConverterForm>
      </div>
    </section>
  );
}
