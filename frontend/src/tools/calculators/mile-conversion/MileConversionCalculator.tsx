'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  formatLength,
  KM_PER_MILE,
  shareResultText,
  syncUnitsFromMeters,
} from './calculation';
import { MileConversionForm, emptyDraft, type MileDraft } from './MileConversionForm';
import { MileConversionResults } from './MileConversionResults';
import {
  UNIT_SYMBOLS,
  type ImperialOtherUnit,
  type LengthUnit,
  type MetricOtherUnit,
  type MileFieldErrors,
  type OtherExtraUnit,
} from './types';
import { metersFromField, parseLengthInput } from './validation';

type DraftMeta = Pick<
  MileDraft,
  | 'metricOpen'
  | 'imperialOpen'
  | 'otherOpen'
  | 'otherMetric'
  | 'otherImperial'
  | 'otherExtra'
>;

function draftFromMeters(
  meters: number,
  preserve: { field: LengthUnit; text: string } | null,
  meta: DraftMeta,
): MileDraft {
  const values = syncUnitsFromMeters(
    meters,
    meta.otherMetric,
    meta.otherImperial,
    meta.otherExtra,
  );
  const texts: Partial<Record<LengthUnit, string>> = {};
  for (const [unit, value] of Object.entries(values) as [LengthUnit, number][]) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatLength(value);
  }
  return {
    texts,
    activeField: preserve?.field ?? null,
    ...meta,
  };
}

function metaFrom(draft: MileDraft): DraftMeta {
  return {
    metricOpen: draft.metricOpen,
    imperialOpen: draft.imperialOpen,
    otherOpen: draft.otherOpen,
    otherMetric: draft.otherMetric,
    otherImperial: draft.otherImperial,
    otherExtra: draft.otherExtra,
  };
}

export function MileConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MileDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<MileFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const metersRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MileDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const meta = metaFrom(next);
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

  const changeOtherImperial = (unit: ImperialOtherUnit) => {
    const meters = metersRef.current;
    if (meters == null || !hasResult) {
      setDraft({ ...draft, otherImperial: unit, texts: { ...draft.texts, [unit]: '' } });
      return;
    }
    setDraft(draftFromMeters(meters, null, { ...metaFrom(draft), otherImperial: unit }));
  };

  const changeOtherExtra = (unit: OtherExtraUnit) => {
    const meters = metersRef.current;
    if (meters == null || !hasResult) {
      setDraft({ ...draft, otherExtra: unit, texts: { ...draft.texts, [unit]: '' } });
      return;
    }
    setDraft(draftFromMeters(meters, null, { ...metaFrom(draft), otherExtra: unit }));
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
      ? syncUnitsFromMeters(
          meters,
          draft.otherMetric,
          draft.otherImperial,
          draft.otherExtra,
        )
      : null;
  const summaryLines = values
    ? ([
        `${formatLength(values.mi!)} ${UNIT_SYMBOLS.mi}`,
        `${formatLength(values.km!)} ${UNIT_SYMBOLS.km}`,
        `${formatLength(values.m!)} ${UNIT_SYMBOLS.m}`,
        `${formatLength(values.ft!)} ${UNIT_SYMBOLS.ft}`,
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
            1 statute mile = {KM_PER_MILE} km exactly
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MileConversionForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onOtherMetricChange={changeOtherMetric}
          onOtherImperialChange={changeOtherImperial}
          onOtherExtraChange={changeOtherExtra}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <MileConversionResults
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
        </MileConversionForm>
      </div>
    </section>
  );
}
