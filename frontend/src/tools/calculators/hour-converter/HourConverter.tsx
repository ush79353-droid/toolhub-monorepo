'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateHour, formatDuration, shareResultText } from './calculation';
import {
  HourConverterForm,
  draftToInput,
  emptyDraft,
  type HourDraft,
} from './HourConverterForm';
import { HourConverterResults } from './HourConverterResults';
import type { HourFieldErrors, HourResult } from './types';
import { isIncompleteNumber, validateHour } from './validation';

function syncDraftFromResult(draft: HourDraft, result: HourResult): HourDraft {
  const next: HourDraft = {
    ...draft,
    hours: formatDuration(result.hours),
    years: formatDuration(result.years),
    months: formatDuration(result.months),
    weeks: formatDuration(result.weeks),
    days: formatDuration(result.days),
    minutes: formatDuration(result.minutes),
    seconds: formatDuration(result.seconds),
    hmsHours: formatDuration(result.combined.hours),
    hmsMinutes: formatDuration(result.combined.minutes),
    hmsSeconds: formatDuration(result.combined.seconds),
  };

  if (draft.source === 'hours') next.hours = draft.hours;
  else if (draft.source === 'years') next.years = draft.years;
  else if (draft.source === 'months') next.months = draft.months;
  else if (draft.source === 'weeks') next.weeks = draft.weeks;
  else if (draft.source === 'days') next.days = draft.days;
  else if (draft.source === 'minutes') next.minutes = draft.minutes;
  else if (draft.source === 'seconds') next.seconds = draft.seconds;
  else if (draft.source === 'hms') {
    next.hmsHours = draft.hmsHours;
    next.hmsMinutes = draft.hmsMinutes;
    next.hmsSeconds = draft.hmsSeconds;
  }

  return next;
}

function clearNonSource(draft: HourDraft): HourDraft {
  const cleared: HourDraft = {
    ...draft,
    hours: '',
    years: '',
    months: '',
    weeks: '',
    days: '',
    minutes: '',
    seconds: '',
    hmsHours: '',
    hmsMinutes: '',
    hmsSeconds: '',
  };
  if (draft.source === 'hours') cleared.hours = draft.hours;
  else if (draft.source === 'years') cleared.years = draft.years;
  else if (draft.source === 'months') cleared.months = draft.months;
  else if (draft.source === 'weeks') cleared.weeks = draft.weeks;
  else if (draft.source === 'days') cleared.days = draft.days;
  else if (draft.source === 'minutes') cleared.minutes = draft.minutes;
  else if (draft.source === 'seconds') cleared.seconds = draft.seconds;
  else if (draft.source === 'hms') {
    cleared.hmsHours = draft.hmsHours;
    cleared.hmsMinutes = draft.hmsMinutes;
    cleared.hmsSeconds = draft.hmsSeconds;
  }
  return cleared;
}

function sourceIncomplete(draft: HourDraft): boolean {
  if (draft.source === 'hms') {
    const parts = [draft.hmsHours, draft.hmsMinutes, draft.hmsSeconds].map((raw) =>
      raw.trim().replace(/,/g, ''),
    );
    if (parts.every((part) => part === '')) return true;
    return parts.some((part) => part !== '' && isIncompleteNumber(part));
  }
  const raw =
    draft.source === 'hours'
      ? draft.hours
      : draft.source === 'years'
        ? draft.years
        : draft.source === 'months'
          ? draft.months
          : draft.source === 'weeks'
            ? draft.weeks
            : draft.source === 'days'
              ? draft.days
              : draft.source === 'minutes'
                ? draft.minutes
                : draft.seconds;
  const cleaned = raw.trim().replace(/,/g, '');
  return cleaned === '' || isIncompleteNumber(cleaned);
}

export function HourConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<HourDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<HourFieldErrors>({});
  const [result, setResult] = React.useState<HourResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: HourDraft) => {
    if (sourceIncomplete(next)) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateHour(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateHour(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

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
            Hours → years, months, weeks, days, minutes, seconds
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <HourConverterForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <HourConverterResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
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
              if (!result) return;
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
        </HourConverterForm>
      </div>
    </section>
  );
}
