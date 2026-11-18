'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  buildResult,
  formatVolume,
  shareResultText,
  summaryLines,
  valueFromMilliliters,
  valuesFromMilliliters,
} from './calculation';
import { TspToMlForm, emptyDraft, type TspToMlDraft } from './TspToMlForm';
import { TspToMlResults } from './TspToMlResults';
import {
  FIELD_KEYS,
  type TspMlField,
  type TspToMlFieldErrors,
  type VolumeUnitId,
} from './types';
import { millilitersFromParsed, parseVolumeInput } from './validation';

function draftFromMl(
  ml: number,
  units: Record<TspMlField, VolumeUnitId>,
  preserve: { field: TspMlField; text: string } | null,
): TspToMlDraft {
  const values = valuesFromMilliliters(ml, units);
  const texts = emptyDraft().texts;
  for (const field of FIELD_KEYS) {
    texts[field] = preserve?.field === field ? preserve.text : formatVolume(values[field]);
  }
  return { texts, units, activeField: preserve?.field ?? null };
}

export function TspToMlConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<TspToMlDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<TspToMlFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const mlRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: TspToMlDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parseVolumeInput(source);

    if (parsed.blank) {
      mlRef.current = null;
      setDraft({
        ...emptyDraft(),
        units: next.units,
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
      mlRef.current = null;
      return;
    }

    const converted = millilitersFromParsed(parsed.value, next.units[field]);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      mlRef.current = null;
      return;
    }

    mlRef.current = converted.ml;
    setDraft(draftFromMl(converted.ml, next.units, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const changeUnit = (field: TspMlField, unit: VolumeUnitId) => {
    const nextUnits = { ...draft.units, [field]: unit };
    const ml = mlRef.current;
    if (ml == null || !hasResult) {
      setDraft({ ...draft, units: nextUnits });
      return;
    }
    const nextTexts = { ...draft.texts };
    nextTexts[field] = formatVolume(valueFromMilliliters(ml, unit));
    setDraft({
      texts: nextTexts,
      units: nextUnits,
      activeField: draft.activeField,
    });
  };

  const clearFields = () => {
    mlRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const ml = mlRef.current;
  const result = ml != null && hasResult ? buildResult(ml, draft.units) : null;
  const lines = result ? summaryLines(result) : null;
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
            tsp ↔ mL (metric default · 5 mL)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <TspToMlForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onUnitChange={changeUnit}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={clearFields}
          onReset={clearFields}
        >
          <TspToMlResults
            summaryLines={lines}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(lines)}
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
                      setShared(true);
                      window.setTimeout(() => setShared(false), 2000);
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
        </TspToMlForm>
      </div>
    </section>
  );
}
