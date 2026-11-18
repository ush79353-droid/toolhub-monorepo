'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  feetAndInchesToMeters,
  formatLength,
  METERS_PER_YARD,
  shareResultText,
  syncUnitsFromMeters,
} from './calculation';
import { YardConversionForm, emptyDraft, type YardDraft } from './YardConversionForm';
import { YardConversionResults } from './YardConversionResults';
import {
  UNIT_SYMBOLS,
  type ImperialOtherMode,
  type LengthUnit,
  type MetricOtherUnit,
  type YardActiveField,
  type YardFieldErrors,
} from './types';
import { metersFromField, parseLengthInput } from './validation';

type DraftMeta = Pick<
  YardDraft,
  'imperialOpen' | 'metricOpen' | 'otherMetric' | 'otherImperial'
>;

type FormErrors = YardFieldErrors & { ftIn?: string };

function draftFromMeters(
  meters: number,
  preserve: { field: YardActiveField; text?: string; feetPart?: string; inchesPart?: string } | null,
  meta: DraftMeta,
): YardDraft {
  const values = syncUnitsFromMeters(meters, meta.otherMetric, meta.otherImperial);
  const texts: Partial<Record<LengthUnit, string>> = {};
  for (const [unit, value] of Object.entries(values) as [string, number][]) {
    if (unit === 'feetPart' || unit === 'inchesPart') continue;
    const lengthUnit = unit as LengthUnit;
    texts[lengthUnit] =
      preserve?.field === lengthUnit && preserve.text != null
        ? preserve.text
        : formatLength(value);
  }
  return {
    texts,
    feetPart:
      preserve?.field === 'ftIn' && preserve.feetPart != null
        ? preserve.feetPart
        : formatLength(values.feetPart),
    inchesPart:
      preserve?.field === 'ftIn' && preserve.inchesPart != null
        ? preserve.inchesPart
        : formatLength(values.inchesPart),
    activeField: preserve?.field ?? null,
    ...meta,
  };
}

function metaFrom(draft: YardDraft): DraftMeta {
  return {
    imperialOpen: draft.imperialOpen,
    metricOpen: draft.metricOpen,
    otherMetric: draft.otherMetric,
    otherImperial: draft.otherImperial,
  };
}

export function YardConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<YardDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const metersRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: YardDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const meta = metaFrom(next);

    if (field === 'ftIn') {
      const feetRaw = next.feetPart;
      const inchesRaw = next.inchesPart;
      const feetBlank = feetRaw.trim() === '';
      const inchesBlank = inchesRaw.trim() === '';

      if (feetBlank && inchesBlank) {
        metersRef.current = null;
        setDraft({ ...emptyDraft(), ...meta, activeField: 'ftIn' });
        setErrors({});
        setHasResult(false);
        return;
      }

      const feetParsed = feetBlank
        ? ({ value: 0 } as const)
        : parseLengthInput(feetRaw);
      const inchesParsed = inchesBlank
        ? ({ value: 0 } as const)
        : parseLengthInput(inchesRaw);

      if (
        ('incomplete' in feetParsed && feetParsed.incomplete) ||
        ('incomplete' in inchesParsed && inchesParsed.incomplete)
      ) {
        setDraft(next);
        setErrors({});
        return;
      }
      if ('blank' in feetParsed && feetParsed.blank === true && !feetBlank) {
        setDraft(next);
        return;
      }
      if (feetParsed.value == null && !feetBlank) {
        setDraft(next);
        setErrors({ ftIn: feetParsed.error ?? 'Enter a valid finite number.' });
        setHasResult(false);
        metersRef.current = null;
        return;
      }
      if (inchesParsed.value == null && !inchesBlank) {
        setDraft(next);
        setErrors({ ftIn: inchesParsed.error ?? 'Enter a valid finite number.' });
        setHasResult(false);
        metersRef.current = null;
        return;
      }

      const feet = feetParsed.value ?? 0;
      const inches = inchesParsed.value ?? 0;
      const meters = feetAndInchesToMeters(feet, inches);
      if (!Number.isFinite(meters)) {
        setDraft(next);
        setErrors({ ftIn: 'Result is not a finite length.' });
        setHasResult(false);
        metersRef.current = null;
        return;
      }

      metersRef.current = meters;
      setDraft(
        draftFromMeters(
          meters,
          { field: 'ftIn', feetPart: feetRaw, inchesPart: inchesRaw },
          meta,
        ),
      );
      setErrors({});
      setHasResult(true);
      return;
    }

    const source = next.texts[field] ?? '';
    const parsed = parseLengthInput(source);

    if (parsed.blank) {
      metersRef.current = null;
      setDraft({ ...emptyDraft(), ...meta, activeField: field });
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
      metersRef.current = null;
      return;
    }

    const converted = metersFromField(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      metersRef.current = null;
      return;
    }

    metersRef.current = converted.meters;
    setDraft(draftFromMeters(converted.meters, { field, text: source }, meta));
    setErrors({});
    setHasResult(true);
  };

  const changeOtherMetric = (unit: MetricOtherUnit) => {
    const meters = metersRef.current;
    if (meters == null || !hasResult) {
      setDraft({ ...draft, otherMetric: unit, texts: { ...draft.texts, [unit]: '' } });
      return;
    }
    setDraft(draftFromMeters(meters, null, { ...metaFrom(draft), otherMetric: unit }));
  };

  const changeOtherImperial = (mode: ImperialOtherMode) => {
    const meters = metersRef.current;
    if (meters == null || !hasResult) {
      setDraft({
        ...draft,
        otherImperial: mode,
        feetPart: '',
        inchesPart: '',
        texts: mode === 'ftIn' ? draft.texts : { ...draft.texts, [mode]: '' },
      });
      return;
    }
    setDraft(draftFromMeters(meters, null, { ...metaFrom(draft), otherImperial: mode }));
  };

  const clearFields = () => {
    metersRef.current = null;
    setDraft({ ...emptyDraft(), ...metaFrom(draft) });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    metersRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const meters = metersRef.current;
  const values =
    meters != null && hasResult
      ? syncUnitsFromMeters(meters, draft.otherMetric, draft.otherImperial)
      : null;
  const summaryLines = values
    ? ([
        `${formatLength(values.yd!)} ${UNIT_SYMBOLS.yd}`,
        `${formatLength(values.ft!)} ${UNIT_SYMBOLS.ft}`,
        `${formatLength(values.in!)} ${UNIT_SYMBOLS.in}`,
        `${formatLength(values.m!)} ${UNIT_SYMBOLS.m}`,
        `${formatLength(values.feetPart)} ft ${formatLength(values.inchesPart)} in`,
      ] as const)
    : null;
  const payload = meters != null && hasResult ? shareResultText(meters) : '';

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
            1 yd = {METERS_PER_YARD} m exactly
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <YardConversionForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onOtherMetricChange={changeOtherMetric}
          onOtherImperialChange={changeOtherImperial}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <YardConversionResults
            summaryLines={summaryLines}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(summaryLines)}
            onCopy={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\n${window.location.href}`
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
                  ? `${payload}\n\n${window.location.href}`
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
        </YardConversionForm>
      </div>
    </section>
  );
}
