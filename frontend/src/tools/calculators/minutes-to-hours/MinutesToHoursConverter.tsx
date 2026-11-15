'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { DecimalValue } from '../billion-to-trillion/types';
import {
  combineHms,
  formatDurationDisplay,
  formatHms,
  fromSeconds,
  splitHms,
  toSeconds,
} from './calculation';
import {
  MinutesToHoursForm,
  defaultDraft,
  emptyDraft,
  type MinutesToHoursDraft,
} from './MinutesToHoursForm';
import { MinutesToHoursResults } from './MinutesToHoursResults';
import type { DurationField, MinutesToHoursFieldErrors } from './types';
import { parseDurationInput, parseHmsComponent } from './validation';

function draftFromSeconds(
  seconds: DecimalValue,
  preserve: { field: MinutesToHoursDraft['activeField']; text: string } | null,
): MinutesToHoursDraft {
  const parts = splitHms(seconds);
  const hoursText = formatDurationDisplay(fromSeconds(seconds, 'hours'));
  const minutesText = formatDurationDisplay(fromSeconds(seconds, 'minutes'));
  const secondsText = formatDurationDisplay(fromSeconds(seconds, 'seconds'));
  const paddedHours = parts.hours.padStart(2, '0');
  return {
    hours: preserve?.field === 'hours' ? preserve.text : hoursText,
    minutes: preserve?.field === 'minutes' ? preserve.text : minutesText,
    seconds: preserve?.field === 'seconds' ? preserve.text : secondsText,
    hmsHours: preserve?.field === 'hmsHours' ? preserve.text.replace(/^\s*-/, '') : paddedHours,
    hmsMinutes: preserve?.field === 'hmsMinutes' ? preserve.text : parts.minutes,
    hmsSeconds: preserve?.field === 'hmsSeconds' ? preserve.text : parts.seconds,
    negative: parts.sign < 0,
    activeField: preserve?.field ?? null,
  };
}

function summaryText(draft: MinutesToHoursDraft, time: string): string {
  const lines = [
    'Minutes to Hours Converter',
    'Omega Calculators',
    '',
    `Hours: ${draft.hours}`,
    `Minutes: ${draft.minutes}`,
    `Seconds: ${draft.seconds}`,
    `Time: ${time}`,
    '',
    'Formula:',
    'Hours = Minutes / 60',
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function MinutesToHoursConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MinutesToHoursDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<MinutesToHoursFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const secondsRef = React.useRef<DecimalValue | null>(
    toSeconds({ sign: 1, digits: '150', exp: 0 }, 'minutes'),
  );

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MinutesToHoursDraft) => {
    const field = next.activeField ?? 'minutes';
    if (field === 'hours' || field === 'minutes' || field === 'seconds') {
      const source = next[field];
      const parsed = parseDurationInput(source);
      if (parsed.blank) {
        secondsRef.current = null;
        setDraft({ ...emptyDraft(), activeField: field, [field]: source });
        setErrors({});
        setHasResult(false);
        return;
      }
      if (!parsed.value) {
        setDraft(next);
        if (parsed.error) {
          setErrors({ [field]: parsed.error });
          setHasResult(false);
          secondsRef.current = null;
        }
        return;
      }
      const seconds = toSeconds(parsed.value, field as DurationField);
      secondsRef.current = seconds;
      setDraft(draftFromSeconds(seconds, { field, text: source }));
      setErrors({});
      setHasResult(true);
      return;
    }

    const hoursParsed = parseDurationInput(next.hmsHours);
    const minutesParsed = parseHmsComponent(next.hmsMinutes, 'minutes');
    const secondsParsed = parseHmsComponent(next.hmsSeconds, 'seconds');
    if (hoursParsed.blank && minutesParsed.blank && secondsParsed.blank) {
      secondsRef.current = null;
      setDraft({ ...emptyDraft(), activeField: field });
      setErrors({});
      setHasResult(false);
      return;
    }
    if (hoursParsed.incomplete || minutesParsed.incomplete || secondsParsed.incomplete) {
      setDraft(next);
      return;
    }
    if (hoursParsed.error || minutesParsed.error || secondsParsed.error) {
      setDraft(next);
      setErrors({
        hmsHours: hoursParsed.error,
        hmsMinutes: minutesParsed.error,
        hmsSeconds: secondsParsed.error,
      });
      setHasResult(false);
      secondsRef.current = null;
      return;
    }
    if (!hoursParsed.value && next.hmsHours.trim() !== '' && next.hmsHours.trim() !== '-') {
      setDraft(next);
      return;
    }

    const seconds = combineHms({
      sign: next.negative ? -1 : 1,
      hours: next.hmsHours.trim() === '' ? '0' : next.hmsHours,
      minutes: next.hmsMinutes.trim() === '' ? '0' : next.hmsMinutes,
      seconds: next.hmsSeconds.trim() === '' ? '0' : next.hmsSeconds,
    });
    secondsRef.current = seconds;
    setDraft(
      draftFromSeconds(seconds, {
        field,
        text: field === 'hmsHours' ? next.hmsHours : field === 'hmsMinutes' ? next.hmsMinutes : next.hmsSeconds,
      }),
    );
    setErrors({});
    setHasResult(true);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      secondsRef.current = toSeconds({ sign: 1, digits: '150', exp: 0 }, 'minutes');
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      secondsRef.current = null;
      setDraft(emptyDraft());
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const timeLabel = hasResult
    ? formatHms({
        sign: draft.negative ? -1 : 1,
        hours: draft.hmsHours || '0',
        minutes: draft.hmsMinutes || '0',
        seconds: draft.hmsSeconds || '0',
      })
    : null;

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
          <p className="text-xs font-normal text-muted-foreground">Hours · minutes · seconds · HH:MM:SS</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MinutesToHoursForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'minutes' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <MinutesToHoursResults
            hours={hasResult ? draft.hours : null}
            minutes={hasResult ? draft.minutes : null}
            seconds={hasResult ? draft.seconds : null}
            time={timeLabel}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!timeLabel) return;
              void copyTextToClipboard(summaryText(draft, timeLabel)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!timeLabel) return;
              const payload = summaryText(draft, timeLabel);
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text: payload,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(payload).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
                return;
              }
              void copyTextToClipboard(payload).then((ok) => {
                if (!ok) return;
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              });
            }}
          />
        </MinutesToHoursForm>
      </div>
    </section>
  );
}
