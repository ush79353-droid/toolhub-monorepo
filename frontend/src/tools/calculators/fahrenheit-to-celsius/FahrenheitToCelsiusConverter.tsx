'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateFahrenheitToCelsius,
  formatTemp,
  shareResultText,
  type FahrenheitToCelsiusResult,
} from './calculation';
import {
  FahrenheitToCelsiusForm,
  draftToInput,
  emptyDraft,
  type FahrenheitToCelsiusDraft,
} from './FahrenheitToCelsiusForm';
import { FahrenheitToCelsiusResults } from './FahrenheitToCelsiusResults';
import type { FahrenheitToCelsiusFieldErrors } from './types';
import { isIncompleteNumber, validateFahrenheitToCelsius } from './validation';

function syncDraftFromResult(
  draft: FahrenheitToCelsiusDraft,
  result: FahrenheitToCelsiusResult,
): FahrenheitToCelsiusDraft {
  if (draft.source === 'fahrenheit') {
    return { ...draft, celsius: formatTemp(result.celsius) };
  }
  return { ...draft, fahrenheit: formatTemp(result.fahrenheit) };
}

function clearOpposite(draft: FahrenheitToCelsiusDraft): FahrenheitToCelsiusDraft {
  if (draft.source === 'fahrenheit') return { ...draft, celsius: '' };
  return { ...draft, fahrenheit: '' };
}

export function FahrenheitToCelsiusConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<FahrenheitToCelsiusDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<FahrenheitToCelsiusFieldErrors>({});
  const [result, setResult] = React.useState<FahrenheitToCelsiusResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: FahrenheitToCelsiusDraft) => {
    const sourceRaw = next.source === 'fahrenheit' ? next.fahrenheit : next.celsius;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateFahrenheitToCelsius(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateFahrenheitToCelsius(input);
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
            °C = (°F − 32) × 5/9 · °F = (°C × 9/5) + 32
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <FahrenheitToCelsiusForm
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
          <FahrenheitToCelsiusResults
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
        </FahrenheitToCelsiusForm>
      </div>
    </section>
  );
}
