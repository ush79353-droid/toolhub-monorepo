'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateOuncesToMilliliters,
  formatVolume,
  shareResultText,
} from './calculation';
import {
  OuncesToMillilitersForm,
  draftToInput,
  emptyDraft,
  type OuncesToMillilitersDraft,
} from './OuncesToMillilitersForm';
import { OuncesToMillilitersResults } from './OuncesToMillilitersResults';
import {
  DEFAULT_OUNCES_TO_MILLILITERS_INPUT,
  type OuncesToMillilitersFieldErrors,
  type OuncesToMillilitersResult,
} from './types';
import { isIncompleteNumber, validateOuncesToMilliliters } from './validation';

function syncDraftFromResult(
  draft: OuncesToMillilitersDraft,
  result: OuncesToMillilitersResult,
): OuncesToMillilitersDraft {
  if (draft.source === 'oz') {
    return { ...draft, ml: formatVolume(result.ml) };
  }
  return { ...draft, oz: formatVolume(result.oz) };
}

function clearOpposite(draft: OuncesToMillilitersDraft): OuncesToMillilitersDraft {
  if (draft.source === 'oz') return { ...draft, ml: '' };
  return { ...draft, oz: '' };
}

function initialDraft(): OuncesToMillilitersDraft {
  const initial = calculateOuncesToMilliliters(DEFAULT_OUNCES_TO_MILLILITERS_INPUT);
  return {
    source: 'oz',
    system: 'us',
    oz: formatVolume(initial.oz),
    ml: formatVolume(initial.ml),
  };
}

export function OuncesToMillilitersConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<OuncesToMillilitersDraft>(initialDraft);
  const [errors, setErrors] = React.useState<OuncesToMillilitersFieldErrors>({});
  const [result, setResult] = React.useState<OuncesToMillilitersResult | null>(() =>
    calculateOuncesToMilliliters(DEFAULT_OUNCES_TO_MILLILITERS_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: OuncesToMillilitersDraft) => {
    if (
      next.oz === draft.oz &&
      next.ml === draft.ml &&
      next.source === draft.source &&
      next.system !== draft.system
    ) {
      const sourceRaw = next.source === 'oz' ? next.oz : next.ml;
      if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
        setDraft(next);
        return;
      }
      const input = draftToInput(next);
      const validation = validateOuncesToMilliliters(input);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateOuncesToMilliliters(input);
      setResult(nextResult);
      setDraft(syncDraftFromResult(next, nextResult));
      return;
    }

    const sourceRaw = next.source === 'oz' ? next.oz : next.ml;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateOuncesToMilliliters(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateOuncesToMilliliters(input);
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
            1 US fl oz = 29.5735295625 mL · 1 UK fl oz = 28.4130625 mL
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <OuncesToMillilitersForm
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
            setResult(calculateOuncesToMilliliters(DEFAULT_OUNCES_TO_MILLILITERS_INPUT));
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
          <OuncesToMillilitersResults
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
        </OuncesToMillilitersForm>
      </div>
    </section>
  );
}
