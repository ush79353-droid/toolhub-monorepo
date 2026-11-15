'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  convertFromMilitary,
  convertFromStandard,
  militaryPartsToStandard,
} from './calculation';
import {
  MilitaryTimeForm,
  defaultDraft,
  emptyDraft,
  type MilitaryTimeDraft,
} from './MilitaryTimeForm';
import { MilitaryTimeResults } from './MilitaryTimeResults';
import type {
  ConversionDirection,
  DayPeriod,
  MilitaryFieldErrors,
  MilitaryTimeResult,
} from './types';
import { parseMilitaryInput, parseStandardParts } from './validation';

function summaryText(result: MilitaryTimeResult): string {
  const lines = [
    'Military Time Converter',
    'Omega Calculators',
    '',
    `Military Time: ${result.military}`,
    `Standard Time: ${result.standard}`,
    `24-Hour Time: ${result.twentyFour}`,
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function MilitaryTimeConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MilitaryTimeDraft>(defaultDraft);
  const [result, setResult] = React.useState<MilitaryTimeResult | null>(() =>
    convertFromMilitary('1830'),
  );
  const [errors, setErrors] = React.useState<MilitaryFieldErrors>({});
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const applyMilitary = (text: string, direction: ConversionDirection) => {
    const parsed = parseMilitaryInput(text);
    if (parsed.blank) {
      setDraft((prev) => ({ ...prev, direction, militaryText: text }));
      setResult(null);
      setErrors({});
      return;
    }
    if (parsed.incomplete || !parsed.value) {
      setDraft((prev) => ({ ...prev, direction, militaryText: text }));
      setResult(null);
      setErrors(parsed.error ? { military: parsed.error } : {});
      return;
    }
    const next = convertFromMilitary(text);
    const standard = militaryPartsToStandard(parsed.value.hours, parsed.value.minutes);
    setDraft({
      direction,
      militaryText: text,
      hour: standard.hours,
      minute: standard.minutes,
      period: standard.period,
    });
    setResult(next);
    setErrors({});
  };

  const applyStandard = (
    hour: number,
    minute: number,
    period: DayPeriod,
    direction: ConversionDirection,
    militaryText?: string,
  ) => {
    const parsed = parseStandardParts(hour, minute, period);
    if (!parsed.ok) {
      setDraft((prev) => ({
        ...prev,
        direction,
        hour,
        minute,
        period,
        militaryText: militaryText ?? prev.militaryText,
      }));
      setResult(null);
      setErrors({ hour: parsed.error });
      return;
    }
    const next = convertFromStandard(hour, minute, period);
    setDraft({
      direction,
      militaryText: militaryText ?? next.military,
      hour,
      minute,
      period,
    });
    setResult(next);
    setErrors({});
  };

  const onDirectionChange = (direction: ConversionDirection) => {
    if (direction === draft.direction) return;
    if (result) {
      if (direction === 'military-to-standard') {
        applyMilitary(result.military, direction);
        return;
      }
      applyStandard(draft.hour, draft.minute, draft.period, direction, result.military);
      return;
    }
    setDraft({ ...draft, direction });
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      setDraft(defaultDraft());
      setResult(convertFromMilitary('1830'));
    } else {
      setDraft(emptyDraft());
      setResult(null);
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
          <p className="text-xs font-normal text-muted-foreground">
            Military · 12-hour · 24-hour
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MilitaryTimeForm
          draft={draft}
          errors={errors}
          onDirectionChange={onDirectionChange}
          onMilitaryChange={(value) => applyMilitary(value, draft.direction)}
          onHourChange={(hour) => applyStandard(hour, draft.minute, draft.period, draft.direction)}
          onMinuteChange={(minute) => applyStandard(draft.hour, minute, draft.period, draft.direction)}
          onPeriodChange={(period) => applyStandard(draft.hour, draft.minute, period, draft.direction)}
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.direction === 'military-to-standard') {
              applyMilitary(draft.militaryText, draft.direction);
              return;
            }
            applyStandard(draft.hour, draft.minute, draft.period, draft.direction);
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <MilitaryTimeResults
            result={result}
            direction={draft.direction}
            copied={copied}
            shared={shared}
            canShare={canShare && Boolean(result)}
            onCopy={() => {
              if (!result) return;
              void copyTextToClipboard(summaryText(result)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!result) return;
              const payload = summaryText(result);
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
        </MilitaryTimeForm>
      </div>
    </section>
  );
}
