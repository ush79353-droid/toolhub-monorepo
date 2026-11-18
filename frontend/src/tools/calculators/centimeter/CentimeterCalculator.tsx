'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  formatLength,
  metersFromUnit,
  shareResultText,
  syncUnitsFromMeters,
  valueInUnit,
} from './calculation';
import { CentimeterForm, emptyDraft, type CentimeterDraft } from './CentimeterForm';
import { CentimeterResults } from './CentimeterResults';
import type { CentimeterFieldErrors } from './types';
import type { LengthUnit, OtherImperialUnit, OtherMetricUnit } from './units';
import { parseCentimeterInput } from './validation';

function draftFromMeters(
  meters: number,
  preserve: { field: LengthUnit; text: string } | null,
  draftMeta: Pick<CentimeterDraft, 'openGroups' | 'otherImperial' | 'otherMetric'>,
): CentimeterDraft {
  const values = syncUnitsFromMeters(meters, draftMeta.otherImperial, draftMeta.otherMetric);
  const texts: Partial<Record<LengthUnit, string>> = {};
  for (const [unit, value] of Object.entries(values) as [LengthUnit, number][]) {
    texts[unit] =
      preserve?.field === unit ? preserve.text : formatLength(value);
  }
  return {
    texts,
    activeField: preserve?.field ?? null,
    openGroups: draftMeta.openGroups,
    otherImperial: draftMeta.otherImperial,
    otherMetric: draftMeta.otherMetric,
  };
}

export function CentimeterCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CentimeterDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CentimeterFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const baseRef = React.useRef<number | null>(null);
  const sourceUnitRef = React.useRef<LengthUnit | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CentimeterDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field] ?? '';
    const parsed = parseCentimeterInput(source);

    if (parsed.blank) {
      baseRef.current = null;
      sourceUnitRef.current = null;
      setDraft({
        ...emptyDraft(),
        openGroups: next.openGroups,
        otherImperial: next.otherImperial,
        otherMetric: next.otherMetric,
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
    setDraft(
      draftFromMeters(meters, { field, text: source }, {
        openGroups: next.openGroups,
        otherImperial: next.otherImperial,
        otherMetric: next.otherMetric,
      }),
    );
    setErrors({});
    setHasResult(true);
  };

  const changeOtherImperial = (unit: OtherImperialUnit) => {
    const meters = baseRef.current;
    if (meters == null || !hasResult) {
      setDraft({ ...draft, otherImperial: unit, texts: { ...draft.texts, [unit]: '' } });
      return;
    }
    const next = draftFromMeters(meters, null, {
      openGroups: draft.openGroups,
      otherImperial: unit,
      otherMetric: draft.otherMetric,
    });
    setDraft(next);
  };

  const changeOtherMetric = (unit: OtherMetricUnit) => {
    const meters = baseRef.current;
    if (meters == null || !hasResult) {
      setDraft({ ...draft, otherMetric: unit, texts: { ...draft.texts, [unit]: '' } });
      return;
    }
    const next = draftFromMeters(meters, null, {
      openGroups: draft.openGroups,
      otherImperial: draft.otherImperial,
      otherMetric: unit,
    });
    setDraft(next);
  };

  const clearFields = () => {
    baseRef.current = null;
    sourceUnitRef.current = null;
    setDraft({
      ...emptyDraft(),
      openGroups: draft.openGroups,
      otherImperial: draft.otherImperial,
      otherMetric: draft.otherMetric,
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
  const summaryLines =
    base != null && hasResult
      ? ([
          `${formatLength(valueInUnit(base, 'cm'))} cm = ${formatLength(valueInUnit(base, 'm'))} m`,
          `${formatLength(valueInUnit(base, 'cm'))} cm ≈ ${formatLength(valueInUnit(base, 'in'))} in`,
          `${formatLength(valueInUnit(base, 'mm'))} mm · ${formatLength(valueInUnit(base, 'ft'))} ft`,
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
            1 cm = 10 mm · 1 in = 2.54 cm
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CentimeterForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onOtherImperialChange={changeOtherImperial}
          onOtherMetricChange={changeOtherMetric}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <CentimeterResults
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
        </CentimeterForm>
      </div>
    </section>
  );
}
