'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  decimalHoursToMinutes,
  formatDecimal,
  secondsToMinutes,
  shareResultText,
  valuesFromMinutes,
} from './calculation';
import {
  MinutesToDecimalForm,
  emptyDraft,
  type MinutesToDecimalDraft,
} from './MinutesToDecimalForm';
import { MinutesToDecimalResults } from './MinutesToDecimalResults';
import type { DecimalSource, MinutesToDecimalFieldErrors } from './types';
import { parseDurationInput } from './validation';

function minutesFromField(
  value: number,
  field: DecimalSource,
): { ok: true; minutes: number } | { ok: false; error: string } {
  try {
    if (field === 'clockMinutes' || field === 'minutes') {
      return { ok: true, minutes: value };
    }
    if (field === 'hours') {
      return { ok: true, minutes: decimalHoursToMinutes(value) };
    }
    return { ok: true, minutes: secondsToMinutes(value) };
  } catch {
    return { ok: false, error: 'Enter a valid finite duration.' };
  }
}

function draftFromMinutes(
  minutes: number,
  preserve: { field: DecimalSource; text: string } | null,
): MinutesToDecimalDraft {
  const values = valuesFromMinutes(minutes);
  const texts = emptyDraft().texts;
  texts.clockMinutes =
    preserve?.field === 'clockMinutes' ? preserve.text : formatDecimal(values.clockMinutes);
  texts.hours = preserve?.field === 'hours' ? preserve.text : formatDecimal(values.hours);
  texts.minutes = preserve?.field === 'minutes' ? preserve.text : formatDecimal(values.minutes);
  texts.seconds = preserve?.field === 'seconds' ? preserve.text : formatDecimal(values.seconds);
  return { texts, activeField: preserve?.field ?? null };
}

export function MinutesToDecimalCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MinutesToDecimalDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<MinutesToDecimalFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const minutesRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MinutesToDecimalDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parseDurationInput(source);

    if (parsed.blank) {
      minutesRef.current = null;
      setDraft({ ...emptyDraft(), activeField: field });
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
      minutesRef.current = null;
      return;
    }

    const converted = minutesFromField(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      minutesRef.current = null;
      return;
    }

    minutesRef.current = converted.minutes;
    setDraft(draftFromMinutes(converted.minutes, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    minutesRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const minutes = minutesRef.current;
  const values = minutes != null && hasResult ? valuesFromMinutes(minutes) : null;
  const summaryLines = values
    ? [
        `${formatDecimal(values.clockMinutes)} min (clock) = ${formatDecimal(values.hours)} decimal hours`,
        `${formatDecimal(values.minutes)} min equivalent`,
        `${formatDecimal(values.seconds)} sec equivalent`,
      ]
    : null;
  const payload = minutes != null && hasResult ? shareResultText(minutes) : '';

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
            Minutes ↔ decimal hours (1 h = 60 min = 3,600 s)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MinutesToDecimalForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={clearFields}
          onReset={clearFields}
        >
          <MinutesToDecimalResults
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
        </MinutesToDecimalForm>
      </div>
    </section>
  );
}
