'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { DecimalValue } from '../billion-to-trillion/types';
import {
  extraUnitRows,
  formatTimeGrouped,
  formatTimeValue,
  fromSeconds,
  mainUnitRows,
  shareResultText,
  toSeconds,
} from './calculation';
import { TimeUnitForm, emptyDraft, type TimeUnitDraft } from './TimeUnitForm';
import { TimeUnitResults } from './TimeUnitResults';
import {
  EXTRA_TIME_UNITS,
  MAIN_TIME_UNITS,
  TIME_UNIT_DEFS,
  type ExtraTimeUnit,
  type MainTimeUnit,
  type TimeUnit,
  type TimeUnitFieldErrors,
} from './types';
import { parseTimeInput } from './validation';

function isMainUnit(unit: TimeUnit): unit is MainTimeUnit {
  return (MAIN_TIME_UNITS as readonly string[]).includes(unit);
}

function draftFromSeconds(
  seconds: DecimalValue,
  extraUnit: ExtraTimeUnit,
  extraOpen: boolean,
  preserve: { field: TimeUnit; text: string } | null,
): TimeUnitDraft {
  const texts = {} as Record<MainTimeUnit, string>;
  for (const unit of MAIN_TIME_UNITS) {
    texts[unit] =
      preserve?.field === unit ? preserve.text : formatTimeValue(fromSeconds(seconds, unit));
  }
  return {
    texts,
    extraUnit,
    extraText:
      preserve?.field === extraUnit
        ? preserve.text
        : formatTimeValue(fromSeconds(seconds, extraUnit)),
    extraOpen,
    activeField: preserve?.field ?? null,
  };
}

function defaultSeconds(): DecimalValue {
  return toSeconds({ sign: 1, digits: '24', exp: 0 }, 'hours');
}

export function TimeUnitConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<TimeUnitDraft>(() =>
    draftFromSeconds(defaultSeconds(), 'milliseconds', false, null),
  );
  const [errors, setErrors] = React.useState<TimeUnitFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const secondsRef = React.useRef<DecimalValue | null>(defaultSeconds());

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: TimeUnitDraft) => {
    if (
      next.extraOpen !== draft.extraOpen &&
      next.texts === draft.texts &&
      next.extraText === draft.extraText &&
      next.extraUnit === draft.extraUnit
    ) {
      setDraft(next);
      return;
    }

    if (next.extraUnit !== draft.extraUnit && secondsRef.current) {
      const preserve =
        next.activeField && isMainUnit(next.activeField)
          ? { field: next.activeField, text: next.texts[next.activeField] }
          : null;
      setDraft(draftFromSeconds(secondsRef.current, next.extraUnit, next.extraOpen, preserve));
      setErrors({});
      setHasResult(true);
      return;
    }

    if (next.extraUnit !== draft.extraUnit && !secondsRef.current) {
      setDraft({ ...next, extraText: '' });
      return;
    }

    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = isMainUnit(field) ? next.texts[field] : next.extraText;
    const parsed = parseTimeInput(source);

    if (parsed.blank) {
      secondsRef.current = null;
      setDraft({
        ...emptyDraft(next.extraUnit),
        extraOpen: next.extraOpen,
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
    if (!parsed.value) {
      setDraft(next);
      setErrors({ [field]: parsed.error ?? 'Please enter a valid finite number.' });
      setHasResult(false);
      secondsRef.current = null;
      return;
    }

    const seconds = toSeconds(parsed.value, field);
    secondsRef.current = seconds;
    setDraft(draftFromSeconds(seconds, next.extraUnit, next.extraOpen, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      const seconds = defaultSeconds();
      secondsRef.current = seconds;
      setDraft(draftFromSeconds(seconds, 'milliseconds', false, null));
      setHasResult(true);
    } else {
      secondsRef.current = null;
      setDraft(emptyDraft(draft.extraUnit));
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const seconds = secondsRef.current;
  const summaryRows = seconds ? mainUnitRows(seconds) : null;
  const extraRows = seconds ? extraUnitRows(seconds, EXTRA_TIME_UNITS) : null;
  const shareRows = seconds
    ? [
        ...mainUnitRows(seconds),
        { unit: draft.extraUnit, value: formatTimeGrouped(fromSeconds(seconds, draft.extraUnit)) },
      ]
    : [];
  const inputLabel = seconds
    ? `${draft.activeField && isMainUnit(draft.activeField) ? draft.texts[draft.activeField] : draft.extraText || formatTimeValue(fromSeconds(seconds, draft.activeField ?? 'hours'))} ${TIME_UNIT_DEFS[draft.activeField ?? 'hours'].symbol}`
    : '';

  const payload = shareResultText(inputLabel, shareRows);

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
            Years · months · weeks · days · hours · minutes · seconds
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <TimeUnitForm
          draft={draft}
          errors={errors}
          extraRows={extraRows}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'hours' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <TimeUnitResults
            rows={hasResult ? summaryRows : null}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!hasResult) return;
              void copyTextToClipboard(
                typeof window !== 'undefined' ? `${payload}\n\nExplore: ${window.location.href}` : payload,
              ).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!hasResult) return;
              const text =
                typeof window !== 'undefined' ? `${payload}\n\nExplore: ${window.location.href}` : payload;
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
        </TimeUnitForm>
      </div>
    </section>
  );
}
