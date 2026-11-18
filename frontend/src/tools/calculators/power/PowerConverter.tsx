'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { allFromWatts, formatPower, shareResultText } from './calculation';
import { emptyDraft, PowerForm, type PowerDraft } from './PowerForm';
import { PowerResults } from './PowerResults';
import {
  POWER_UNITS,
  POWER_UNIT_SYMBOLS,
  type PowerFieldErrors,
  type PowerUnit,
} from './types';
import { parsePowerInput, wattsFromUnit } from './validation';

function draftFromWatts(
  watts: number,
  preserve: { field: PowerUnit; text: string } | null,
  open: Pick<PowerDraft, 'siOpen' | 'horsepowerOpen' | 'otherOpen'>,
): PowerDraft {
  const amounts = allFromWatts(watts);
  const texts = {} as Record<PowerUnit, string>;
  for (const unit of POWER_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatPower(amounts[unit]);
  }
  return { texts, activeField: preserve?.field ?? null, ...open };
}

export function PowerConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PowerDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<PowerFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const wattsRef = React.useRef<number | null>(null);
  const sourceRef = React.useRef<PowerUnit>('watt');

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PowerDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parsePowerInput(source);
    if (parsed.blank) {
      wattsRef.current = null;
      setDraft({
        ...emptyDraft(),
        siOpen: next.siOpen,
        horsepowerOpen: next.horsepowerOpen,
        otherOpen: next.otherOpen,
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
      wattsRef.current = null;
      return;
    }

    const converted = wattsFromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      wattsRef.current = null;
      return;
    }

    wattsRef.current = converted.watts;
    sourceRef.current = field;
    setDraft(
      draftFromWatts(converted.watts, { field, text: source }, {
        siOpen: next.siOpen,
        horsepowerOpen: next.horsepowerOpen,
        otherOpen: next.otherOpen,
      }),
    );
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    wattsRef.current = null;
    setDraft({
      ...emptyDraft(),
      siOpen: draft.siOpen,
      horsepowerOpen: draft.horsepowerOpen,
      otherOpen: draft.otherOpen,
    });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    wattsRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const watts = wattsRef.current;
  const summaryLines =
    hasResult && watts != null
      ? POWER_UNITS.map((unit) => {
          const amounts = allFromWatts(watts);
          return `${formatPower(amounts[unit])} ${POWER_UNIT_SYMBOLS[unit]}`;
        })
      : null;
  const payload =
    hasResult && watts != null ? shareResultText(watts, sourceRef.current) : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Power Converter</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Watts · horsepower · BTU/h
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PowerForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'watt' });
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <PowerResults
            summaryLines={summaryLines}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!payload) return;
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
              if (!payload) return;
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
        </PowerForm>
      </div>
    </section>
  );
}
