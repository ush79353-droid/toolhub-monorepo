'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  allFromMeters,
  formatLength,
  metersFromUnit,
  shareResultText,
} from './calculation';
import { emptyDraft, MetricToSaeForm, type MetricToSaeDraft } from './MetricToSaeForm';
import { MetricToSaeResults } from './MetricToSaeResults';
import type { MetricToSaeFieldErrors } from './types';
import { ALL_UNITS, type LengthUnit } from './units';
import { parseMetricSaeInput } from './validation';

function draftFromMeters(
  meters: number,
  preserve: { field: LengthUnit; text: string } | null,
  openGroups: MetricToSaeDraft['openGroups'],
): MetricToSaeDraft {
  const values = allFromMeters(meters);
  const texts: Partial<Record<LengthUnit, string>> = {};
  for (const unit of ALL_UNITS) {
    texts[unit] =
      preserve?.field === unit ? preserve.text : formatLength(values[unit]);
  }
  return {
    texts,
    activeField: preserve?.field ?? null,
    openGroups,
  };
}

export function MetricToSaeCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MetricToSaeDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<MetricToSaeFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const baseRef = React.useRef<number | null>(null);
  const sourceUnitRef = React.useRef<LengthUnit | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MetricToSaeDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field] ?? '';
    const parsed = parseMetricSaeInput(source);

    if (parsed.blank) {
      baseRef.current = null;
      sourceUnitRef.current = null;
      setDraft({
        ...emptyDraft(),
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

    const meters = metersFromUnit(parsed.value, field);
    if (!Number.isFinite(meters)) {
      setDraft(next);
      setErrors({ [field]: 'Enter a valid finite number.' });
      setHasResult(false);
      baseRef.current = null;
      sourceUnitRef.current = null;
      return;
    }

    baseRef.current = meters;
    sourceUnitRef.current = field;
    setDraft(draftFromMeters(meters, { field, text: source }, next.openGroups));
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    baseRef.current = null;
    sourceUnitRef.current = null;
    setDraft({
      ...emptyDraft(),
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
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const base = baseRef.current;
  const values = base != null && hasResult ? allFromMeters(base) : null;
  const summaryLines = values
    ? ([
        `${formatLength(values.mm)} mm = ${formatLength(values.in)} in`,
        `${formatLength(values.m)} m = ${formatLength(values.ft)} ft`,
        `${formatLength(values.km)} km = ${formatLength(values.mi)} mi`,
      ] as const)
    : null;
  const payload =
    base != null && hasResult && sourceUnitRef.current
      ? shareResultText(base, sourceUnitRef.current)
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
            Metric ↔ SAE length · 1 in = 25.4 mm
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MetricToSaeForm
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
          <MetricToSaeResults
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
        </MetricToSaeForm>
      </div>
    </section>
  );
}
