'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateAtmConversion, formatPressure, shareResultText } from './calculation';
import {
  AtmConversionForm,
  draftToInput,
  emptyDraft,
  type AtmConversionDraft,
} from './AtmConversionForm';
import { AtmConversionResults } from './AtmConversionResults';
import {
  DEFAULT_ATM_CONVERSION_INPUT,
  type AtmConversionFieldErrors,
  type AtmConversionResult,
} from './types';
import { validateAtmConversion } from './validation';

function syncDraftFromResult(
  draft: AtmConversionDraft,
  result: AtmConversionResult,
): AtmConversionDraft {
  if (draft.source === 'atm') {
    return {
      ...draft,
      bar: formatPressure(result.bar),
      psi: formatPressure(result.psi),
      Pa: formatPressure(result.Pa),
    };
  }
  if (draft.source === 'bar') {
    return {
      ...draft,
      atm: formatPressure(result.atm),
      psi: formatPressure(result.psi),
      Pa: formatPressure(result.Pa),
    };
  }
  if (draft.source === 'psi') {
    return {
      ...draft,
      atm: formatPressure(result.atm),
      bar: formatPressure(result.bar),
      Pa: formatPressure(result.Pa),
    };
  }
  return {
    ...draft,
    atm: formatPressure(result.atm),
    bar: formatPressure(result.bar),
    psi: formatPressure(result.psi),
  };
}

function initialDraft(): AtmConversionDraft {
  const initial = calculateAtmConversion(DEFAULT_ATM_CONVERSION_INPUT);
  return {
    source: 'atm',
    atm: formatPressure(initial.atm),
    bar: formatPressure(initial.bar),
    psi: formatPressure(initial.psi),
    Pa: formatPressure(initial.Pa),
    otherOpen: true,
  };
}

export function AtmConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AtmConversionDraft>(initialDraft);
  const [errors, setErrors] = React.useState<AtmConversionFieldErrors>({});
  const [result, setResult] = React.useState<AtmConversionResult | null>(() =>
    calculateAtmConversion(DEFAULT_ATM_CONVERSION_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: AtmConversionDraft) => {
    if (
      next.atm === draft.atm &&
      next.bar === draft.bar &&
      next.psi === draft.psi &&
      next.Pa === draft.Pa &&
      next.source === draft.source &&
      next.otherOpen !== draft.otherOpen
    ) {
      setDraft(next);
      return;
    }

    const input = draftToInput(next);
    const validation = validateAtmConversion(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateAtmConversion(input);
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
            1 atm = 101,325 Pa = 1.01325 bar
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AtmConversionForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(initialDraft());
            setErrors({});
            setResult(calculateAtmConversion(DEFAULT_ATM_CONVERSION_INPUT));
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
          <AtmConversionResults
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
        </AtmConversionForm>
      </div>
    </section>
  );
}
