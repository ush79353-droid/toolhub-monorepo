'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  formatDecimal,
  minutesAndSecondsToSeconds,
  minutesToSeconds,
  shareResultText,
  valuesFromSeconds,
} from './calculation';
import {
  MinutesToSecondsForm,
  emptyDraft,
  type MinutesToSecondsDraft,
} from './MinutesToSecondsForm';
import { MinutesToSecondsResults } from './MinutesToSecondsResults';
import type { MinSecSource, MinutesToSecondsFieldErrors } from './types';
import { parseDurationInput } from './validation';

function formatCombinedMinutes(totalSeconds: number): string {
  const v = valuesFromSeconds(totalSeconds);
  if (v.sign < 0 && Math.abs(v.combinedMinutes) === 0 && v.combinedSeconds !== 0) {
    return '-0';
  }
  return formatDecimal(v.combinedMinutes === 0 && Object.is(v.combinedMinutes, -0) ? 0 : v.combinedMinutes);
}

function draftFromSeconds(
  totalSeconds: number,
  preserve: { field: MinSecSource; text: string } | null,
): MinutesToSecondsDraft {
  const values = valuesFromSeconds(totalSeconds);
  const texts = emptyDraft().texts;
  texts.minutes = preserve?.field === 'minutes' ? preserve.text : formatDecimal(values.minutes);
  texts.seconds = preserve?.field === 'seconds' ? preserve.text : formatDecimal(values.seconds);
  texts.combinedMinutes =
    preserve?.field === 'combinedMinutes' ? preserve.text : formatCombinedMinutes(totalSeconds);
  texts.combinedSeconds =
    preserve?.field === 'combinedSeconds' ? preserve.text : formatDecimal(values.combinedSeconds);
  return { texts, activeField: preserve?.field ?? null };
}

function parseCombined(
  draft: MinutesToSecondsDraft,
):
  | { ok: true; seconds: number }
  | { ok: false; incomplete?: boolean; error?: string; field?: MinSecSource } {
  const minRaw = draft.texts.combinedMinutes.trim();
  const secRaw = draft.texts.combinedSeconds.trim();
  if (minRaw === '' && secRaw === '') {
    return { ok: false, incomplete: true };
  }

  let minutes = 0;
  let seconds = 0;

  if (minRaw !== '') {
    const minParsed = parseDurationInput(minRaw);
    if (minParsed.incomplete) return { ok: false, incomplete: true };
    if (minParsed.blank) return { ok: false, incomplete: true };
    if (minParsed.value == null) {
      return {
        ok: false,
        error: minParsed.error ?? 'Enter a valid finite number.',
        field: 'combinedMinutes',
      };
    }
    minutes = minParsed.value;
  }

  if (secRaw !== '') {
    const secParsed = parseDurationInput(secRaw);
    if (secParsed.incomplete) return { ok: false, incomplete: true };
    if (secParsed.blank) return { ok: false, incomplete: true };
    if (secParsed.value == null) {
      return {
        ok: false,
        error: secParsed.error ?? 'Enter a valid finite number.',
        field: 'combinedSeconds',
      };
    }
    seconds = secParsed.value;
  }

  try {
    return { ok: true, seconds: minutesAndSecondsToSeconds(minutes, seconds) };
  } catch {
    return { ok: false, error: 'Enter a valid finite duration.', field: 'combinedMinutes' };
  }
}

export function MinutesToSecondsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MinutesToSecondsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<MinutesToSecondsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const secondsRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MinutesToSecondsDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    if (field === 'combinedMinutes' || field === 'combinedSeconds') {
      const combined = parseCombined(next);
      if (!combined.ok) {
        if (combined.incomplete) {
          setDraft(next);
          setErrors({});
          return;
        }
        setDraft(next);
        setErrors({
          [combined.field ?? field]: combined.error ?? 'Enter a valid finite number.',
        });
        setHasResult(false);
        secondsRef.current = null;
        return;
      }
      secondsRef.current = combined.seconds;
      setDraft(draftFromSeconds(combined.seconds, { field, text: next.texts[field] }));
      setErrors({});
      setHasResult(true);
      return;
    }

    const source = next.texts[field];
    const parsed = parseDurationInput(source);

    if (parsed.blank) {
      secondsRef.current = null;
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
      secondsRef.current = null;
      return;
    }

    let totalSeconds: number;
    try {
      totalSeconds = field === 'minutes' ? minutesToSeconds(parsed.value) : parsed.value;
    } catch {
      setDraft(next);
      setErrors({ [field]: 'Enter a valid finite duration.' });
      setHasResult(false);
      secondsRef.current = null;
      return;
    }

    secondsRef.current = totalSeconds;
    setDraft(draftFromSeconds(totalSeconds, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    secondsRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const totalSeconds = secondsRef.current;
  const values = totalSeconds != null && hasResult ? valuesFromSeconds(totalSeconds) : null;
  const summaryLines = values
    ? [
        `${formatDecimal(values.minutes)} min = ${formatDecimal(values.seconds)} sec`,
        `Combined: ${formatCombinedMinutes(totalSeconds!)} min ${formatDecimal(values.combinedSeconds)} sec`,
      ]
    : null;
  const payload = totalSeconds != null && hasResult ? shareResultText(totalSeconds) : '';

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
            Minutes ↔ seconds (1 min = 60 s)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MinutesToSecondsForm
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
          <MinutesToSecondsResults
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
        </MinutesToSecondsForm>
      </div>
    </section>
  );
}
