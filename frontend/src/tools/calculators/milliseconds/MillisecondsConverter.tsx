'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { DecimalValue } from '../billion-to-trillion/types';
import {
  MS_PER_SECOND,
  shareResultText,
  summaryRows,
  syncFromSeconds,
  toSeconds,
} from './calculation';
import { MillisecondsForm, emptyDraft, type MillisecondsDraft } from './MillisecondsForm';
import { MillisecondsResults } from './MillisecondsResults';
import {
  CORE_UNITS,
  type CoreTimeUnit,
  type MillisecondsFieldErrors,
  type OtherTimeUnit,
  type TimeUnit,
} from './types';
import { parseTimeInput } from './validation';

function isCoreUnit(unit: TimeUnit): unit is CoreTimeUnit {
  return (CORE_UNITS as readonly string[]).includes(unit);
}

function draftFromSeconds(
  seconds: DecimalValue,
  otherUnit: OtherTimeUnit,
  preserve: { field: TimeUnit; text: string } | null,
): MillisecondsDraft {
  const synced = syncFromSeconds(seconds, otherUnit);
  const texts = { ...synced.texts };
  let otherText = synced.otherText;
  if (preserve) {
    if (isCoreUnit(preserve.field)) {
      texts[preserve.field] = preserve.text;
    } else if (preserve.field === otherUnit) {
      otherText = preserve.text;
    }
  }
  return {
    texts,
    otherUnit,
    otherText,
    activeField: preserve?.field ?? null,
  };
}

export function MillisecondsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MillisecondsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<MillisecondsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const secondsRef = React.useRef<DecimalValue | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MillisecondsDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = isCoreUnit(field) ? next.texts[field] : next.otherText;
    const parsed = parseTimeInput(source);

    if (parsed.blank) {
      secondsRef.current = null;
      setDraft({
        ...emptyDraft(next.otherUnit),
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
    setDraft(draftFromSeconds(seconds, next.otherUnit, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const changeOtherUnit = (unit: OtherTimeUnit) => {
    const seconds = secondsRef.current;
    if (seconds == null || !hasResult) {
      setDraft({ ...draft, otherUnit: unit, otherText: '' });
      return;
    }
    setDraft(draftFromSeconds(seconds, unit, null));
  };

  const clearFields = () => {
    secondsRef.current = null;
    setDraft(emptyDraft(draft.otherUnit));
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    secondsRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const seconds = secondsRef.current;
  const rows = seconds != null && hasResult ? summaryRows(seconds) : null;
  const payload = seconds != null && hasResult ? shareResultText(seconds) : '';

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
            1 second = {MS_PER_SECOND} ms exactly
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MillisecondsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onOtherUnitChange={changeOtherUnit}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <MillisecondsResults
            rows={rows}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(rows)}
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
        </MillisecondsForm>
      </div>
    </section>
  );
}
