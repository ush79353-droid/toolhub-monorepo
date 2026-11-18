'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  convertUnixDisplay,
  formatLongUtc,
  formatUtcDate,
  formatUtcTime,
  unixFromInstant,
} from './calculation';
import { DEFAULT_UNIX_SECONDS, DEFAULT_UNIT, type UnixFieldErrors, type UnixUnit } from './types';
import { UnixTimeForm, type UnixTimeDraft } from './UnixTimeForm';
import { UnixTimeResults } from './UnixTimeResults';
import { parseUnixInput, parseUtcInputs } from './validation';

function draftFromDate(date: Date, unit: UnixUnit, live = false): UnixTimeDraft {
  const unix = unixFromInstant(date, unit);
  return {
    unixText: String(unix),
    unit,
    utcDate: formatUtcDate(date),
    utcTime: formatUtcTime(date),
    live,
  };
}

function defaultDraft(): UnixTimeDraft {
  return draftFromDate(new Date(DEFAULT_UNIX_SECONDS * 1000), DEFAULT_UNIT, false);
}

function summaryText(draft: UnixTimeDraft, date: Date): string {
  const lines = [
    'Unix Time Converter',
    'Omega Calculators',
    '',
    'Unix Timestamp:',
    `${draft.unixText} ${draft.unit}`,
    '',
    'UTC Date:',
    formatLongUtc(date),
    '',
    'Time Zone:',
    'UTC',
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function UnixTimeConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<UnixTimeDraft>(defaultDraft);
  const [date, setDate] = React.useState<Date | null>(() => new Date(DEFAULT_UNIX_SECONDS * 1000));
  const [errors, setErrors] = React.useState<UnixFieldErrors>({});
  const [referenceOpen, setReferenceOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    if (!draft.live) return;
    const tick = () => {
      const now = new Date();
      setDate(now);
      setDraft((prev) => draftFromDate(now, prev.unit, true));
      setErrors({});
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [draft.live, draft.unit]);

  const applyInstant = (next: Date, unit: UnixUnit, live = false) => {
    setDate(next);
    setDraft(draftFromDate(next, unit, live));
    setErrors({});
  };

  const onUnixChange = (value: string) => {
    const parsed = parseUnixInput(value, draft.unit);
    if (!parsed.ok) {
      setDraft({ ...draft, unixText: value, live: false });
      setErrors(parsed.incomplete ? {} : parsed.errors);
      if (!parsed.incomplete) setDate(null);
      return;
    }
    setDraft({
      unixText: value,
      unit: draft.unit,
      utcDate: formatUtcDate(parsed.date),
      utcTime: formatUtcTime(parsed.date),
      live: false,
    });
    setDate(parsed.date);
    setErrors({});
  };

  const onUnitChange = (unit: UnixUnit) => {
    if (unit === draft.unit) return;
    if (date) {
      const display = convertUnixDisplay(Number(draft.unixText), draft.unit, unit);
      // Prefer exact instant conversion when current unix text parses.
      const parsed = parseUnixInput(draft.unixText, draft.unit);
      if (parsed.ok) {
        applyInstant(parsed.date, unit, false);
        return;
      }
      setDraft({ ...draft, unit, unixText: String(display), live: false });
      return;
    }
    setDraft({ ...draft, unit, live: false });
  };

  const onUtcChange = (utcDate: string, utcTime: string) => {
    const parsed = parseUtcInputs(utcDate, utcTime);
    if (!parsed.ok) {
      setDraft({ ...draft, utcDate, utcTime, live: false });
      setErrors(parsed.incomplete ? {} : parsed.errors);
      if (!parsed.incomplete) setDate(null);
      return;
    }
    applyInstant(parsed.date, draft.unit, false);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      const next = defaultDraft();
      setDraft(next);
      setDate(new Date(DEFAULT_UNIX_SECONDS * 1000));
    } else {
      setDraft({
        unixText: '',
        unit: draft.unit,
        utcDate: '',
        utcTime: '',
        live: false,
      });
      setDate(null);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

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
          <p className="text-xs font-normal text-muted-foreground">Unix epoch · UTC · time zones</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <UnixTimeForm
          draft={draft}
          errors={errors}
          referenceOpen={referenceOpen}
          onToggleReference={() => setReferenceOpen((v) => !v)}
          onUnixChange={onUnixChange}
          onUnitChange={onUnitChange}
          onUtcDateChange={(value) => onUtcChange(value, draft.utcTime)}
          onUtcTimeChange={(value) => onUtcChange(draft.utcDate, value)}
          onUseCurrent={() => applyInstant(new Date(), draft.unit, false)}
          onLiveChange={(live) => {
            if (live) {
              applyInstant(new Date(), draft.unit, true);
              return;
            }
            setDraft({ ...draft, live: false });
          }}
          onSubmit={(event) => event.preventDefault()}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <UnixTimeResults
            date={date}
            unixText={draft.unixText}
            unit={draft.unit}
            shared={shared}
            canShare={canShare}
            copied={copied}
            onCopySummary={() => {
              if (!date) return;
              void copyTextToClipboard(summaryText(draft, date)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!date) return;
              const payload = summaryText(draft, date);
              const markShared = () => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              };
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text: payload,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(markShared)
                  .catch(() => {
                    void copyTextToClipboard(payload).then((ok) => {
                      if (ok) markShared();
                    });
                  });
                return;
              }
              void copyTextToClipboard(payload).then((ok) => {
                if (ok) markShared();
              });
            }}
          />
        </UnixTimeForm>
      </div>
    </section>
  );
}
