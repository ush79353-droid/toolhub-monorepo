'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateDayConverter, formatDuration, shareResultText } from './calculation';
import {
  DayConverterForm,
  draftToInput,
  emptyDraft,
  type DayConverterDraft,
} from './DayConverterForm';
import { DayConverterResults } from './DayConverterResults';
import type { DayConverterFieldErrors, DayConverterResult, DayTimeUnit } from './types';
import { validateDayConverter } from './validation';

const ALL_UNITS: readonly DayTimeUnit[] = [
  'days',
  'years',
  'months',
  'weeks',
  'hours',
  'minutes',
  'seconds',
];

function syncDraftFromResult(
  draft: DayConverterDraft,
  result: DayConverterResult,
): DayConverterDraft {
  return {
    ...draft,
    days: draft.source === 'days' ? draft.days : formatDuration(result.days),
    years: draft.source === 'years' ? draft.years : formatDuration(result.years),
    months: draft.source === 'months' ? draft.months : formatDuration(result.months),
    weeks: draft.source === 'weeks' ? draft.weeks : formatDuration(result.weeks),
    hours: draft.source === 'hours' ? draft.hours : formatDuration(result.hours),
    minutes: draft.source === 'minutes' ? draft.minutes : formatDuration(result.minutes),
    seconds: draft.source === 'seconds' ? draft.seconds : formatDuration(result.seconds),
  };
}

export function DayConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<DayConverterDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<DayConverterFieldErrors>({});
  const [result, setResult] = React.useState<DayConverterResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: DayConverterDraft) => {
    const input = draftToInput(next);
    const validation = validateDayConverter(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      if (input.value === null) {
        const cleared = emptyDraft();
        cleared.source = next.source;
        for (const unit of ALL_UNITS) {
          cleared[unit] = unit === next.source ? next[unit] : '';
        }
        setDraft(cleared);
      } else {
        setDraft(next);
      }
      return;
    }
    const nextResult = calculateDayConverter(input);
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
            Days → years, months, weeks, hours, minutes, seconds
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <DayConverterForm
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
          <DayConverterResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
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
              if (!result) return;
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
        </DayConverterForm>
      </div>
    </section>
  );
}
