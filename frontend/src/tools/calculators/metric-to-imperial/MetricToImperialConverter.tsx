'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertMeasurement, formatValue, shareResultText } from './calculation';
import {
  emptyDraft,
  MetricToImperialForm,
  type MetricToImperialDraft,
} from './MetricToImperialForm';
import { MetricToImperialResults } from './MetricToImperialResults';
import type { ConversionCategory, MetricImperialFieldErrors } from './types';
import { getUnit } from './units';
import { parseField } from './validation';

export function MetricToImperialConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MetricToImperialDraft>(() => emptyDraft('length'));
  const [errors, setErrors] = React.useState<MetricImperialFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const valuesRef = React.useRef<{ metric: number; imperial: number } | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MetricToImperialDraft) => {
    const sourceRaw = next.activeField === 'metric' ? next.metric : next.imperial;
    const fromUnit = next.activeField === 'metric' ? next.metricUnit : next.imperialUnit;
    const toUnit = next.activeField === 'metric' ? next.imperialUnit : next.metricUnit;
    const parsed = parseField(sourceRaw);

    if (parsed.blank) {
      valuesRef.current = null;
      setDraft(
        next.activeField === 'metric'
          ? { ...next, imperial: '' }
          : { ...next, metric: '' },
      );
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
      setErrors({ [next.activeField]: parsed.error ?? 'Enter a valid finite number.' });
      valuesRef.current = null;
      setHasResult(false);
      return;
    }

    const converted = convertMeasurement(parsed.value, next.category, fromUnit, toUnit);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [next.activeField]: converted.error });
      valuesRef.current = null;
      setHasResult(false);
      return;
    }

    const metricValue = next.activeField === 'metric' ? parsed.value : converted.value;
    const imperialValue = next.activeField === 'imperial' ? parsed.value : converted.value;
    valuesRef.current = { metric: metricValue, imperial: imperialValue };

    setDraft({
      ...next,
      metric: next.activeField === 'metric' ? sourceRaw : formatValue(metricValue),
      imperial: next.activeField === 'imperial' ? sourceRaw : formatValue(imperialValue),
    });
    setErrors({});
    setHasResult(true);
  };

  /** Unit-only change: recalculate from last active physical value when possible. */
  const onDraftChange = (next: MetricToImperialDraft) => {
    const unitsOnly =
      next.metric === draft.metric &&
      next.imperial === draft.imperial &&
      next.activeField === draft.activeField &&
      next.category === draft.category &&
      (next.metricUnit !== draft.metricUnit || next.imperialUnit !== draft.imperialUnit);

    if (unitsOnly && valuesRef.current) {
      const sourceValue =
        next.activeField === 'metric' ? valuesRef.current.metric : valuesRef.current.imperial;
      const fromUnit = next.activeField === 'metric' ? next.metricUnit : next.imperialUnit;
      const toUnit = next.activeField === 'metric' ? next.imperialUnit : next.metricUnit;
      const converted = convertMeasurement(sourceValue, next.category, fromUnit, toUnit);
      if (!converted.ok) {
        setDraft(next);
        setErrors({ [next.activeField]: converted.error });
        setHasResult(false);
        return;
      }
      const metricValue = next.activeField === 'metric' ? sourceValue : converted.value;
      const imperialValue = next.activeField === 'imperial' ? sourceValue : converted.value;
      valuesRef.current = { metric: metricValue, imperial: imperialValue };
      setDraft({
        ...next,
        metric: formatValue(metricValue),
        imperial: formatValue(imperialValue),
      });
      setErrors({});
      setHasResult(true);
      return;
    }

    evaluate(next);
  };

  const onCategoryChange = (category: ConversionCategory) => {
    valuesRef.current = null;
    setDraft(emptyDraft(category));
    setErrors({});
    setHasResult(false);
    setCopied(false);
    setShared(false);
  };

  const clearFields = () => {
    valuesRef.current = null;
    setDraft({
      ...draft,
      metric: '',
      imperial: '',
      activeField: 'metric',
    });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    valuesRef.current = null;
    setDraft(emptyDraft('length'));
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const values = valuesRef.current;
  const metricUnit = getUnit(draft.category, draft.metricUnit);
  const imperialUnit = getUnit(draft.category, draft.imperialUnit);
  const summary =
    values != null && hasResult
      ? `${formatValue(values.metric)} ${metricUnit?.symbol ?? ''} = ${formatValue(values.imperial)} ${imperialUnit?.symbol ?? ''}`
      : null;
  const payload =
    values != null && hasResult
      ? shareResultText({
          category: draft.category,
          metricValue: values.metric,
          imperialValue: values.imperial,
          metricUnitId: draft.metricUnit,
          imperialUnitId: draft.imperialUnit,
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
            Metric ↔ imperial · length · area · volume · mass · temperature · speed
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MetricToImperialForm
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
          onCategoryChange={onCategoryChange}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <MetricToImperialResults
            summary={summary}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(summary)}
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
        </MetricToImperialForm>
      </div>
    </section>
  );
}
