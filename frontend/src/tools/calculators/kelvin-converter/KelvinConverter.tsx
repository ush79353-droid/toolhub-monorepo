'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { allFromCelsius, formatTemp, shareResultText } from './calculation';
import {
  KelvinConverterForm,
  emptyDraft,
  type KelvinDraft,
} from './KelvinConverterForm';
import { KelvinConverterResults } from './KelvinConverterResults';
import {
  TEMPERATURE_UNITS,
  TEMP_SYMBOLS,
  type KelvinFieldErrors,
  type TemperatureUnit,
} from './types';
import { celsiusFromUnit, parseTempInput } from './validation';

export function KelvinConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<KelvinDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<KelvinFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const amountsRef = React.useRef<Record<TemperatureUnit, number> | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: KelvinDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parseTempInput(source);
    if (parsed.blank) {
      amountsRef.current = null;
      setDraft({ ...emptyDraft(), otherOpen: next.otherOpen, activeField: field });
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
      amountsRef.current = null;
      setHasResult(false);
      return;
    }

    const converted = celsiusFromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      amountsRef.current = null;
      setHasResult(false);
      return;
    }

    const amounts = allFromCelsius(converted.celsius);
    amountsRef.current = amounts;
    const texts = {} as Record<TemperatureUnit, string>;
    for (const unit of TEMPERATURE_UNITS) {
      texts[unit] = unit === field ? source : formatTemp(amounts[unit]);
    }
    setDraft({ texts, activeField: field, otherOpen: next.otherOpen });
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    amountsRef.current = null;
    setDraft({ ...emptyDraft(), otherOpen: draft.otherOpen });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    amountsRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const amounts = amountsRef.current;
  const summaryLines =
    amounts != null && hasResult
      ? (['kelvin', 'celsius', 'fahrenheit', 'rankine'] as const).map((unit) =>
          unit === 'kelvin'
            ? `${formatTemp(amounts[unit])} ${TEMP_SYMBOLS[unit]}`
            : `${formatTemp(amounts[unit])}${TEMP_SYMBOLS[unit]}`,
        )
      : null;
  const payload = amounts != null && hasResult ? shareResultText(amounts) : '';

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
            K · °C · °F · °R · °De · °N · °Ré · °Rø
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <KelvinConverterForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'kelvin' });
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <KelvinConverterResults
            summaryLines={summaryLines}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(summaryLines)}
            onCopy={() => {
              if (!amounts) return;
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
              if (!amounts) return;
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
        </KelvinConverterForm>
      </div>
    </section>
  );
}
