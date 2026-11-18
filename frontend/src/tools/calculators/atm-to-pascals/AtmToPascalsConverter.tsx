'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateAtmToPascals, formatPressure, shareResultText } from './calculation';
import {
  AtmToPascalsForm,
  draftToInput,
  emptyDraft,
  type AtmToPascalsDraft,
} from './AtmToPascalsForm';
import { AtmToPascalsResults } from './AtmToPascalsResults';
import {
  DEFAULT_ATM_TO_PASCALS_INPUT,
  type AtmToPascalsFieldErrors,
  type AtmToPascalsResult,
} from './types';
import { validateAtmToPascals } from './validation';

function syncDraftFromResult(
  draft: AtmToPascalsDraft,
  result: AtmToPascalsResult,
): AtmToPascalsDraft {
  if (draft.source === 'atm') {
    return { ...draft, pascals: formatPressure(result.pascals) };
  }
  return { ...draft, atm: formatPressure(result.atm) };
}

function initialDraft(): AtmToPascalsDraft {
  const initial = calculateAtmToPascals(DEFAULT_ATM_TO_PASCALS_INPUT);
  return {
    source: 'atm',
    atm: formatPressure(initial.atm),
    pascals: formatPressure(initial.pascals),
    atmFirst: true,
  };
}

export function AtmToPascalsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AtmToPascalsDraft>(initialDraft);
  const [errors, setErrors] = React.useState<AtmToPascalsFieldErrors>({});
  const [result, setResult] = React.useState<AtmToPascalsResult | null>(() =>
    calculateAtmToPascals(DEFAULT_ATM_TO_PASCALS_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: AtmToPascalsDraft) => {
    if (
      next.atm === draft.atm &&
      next.pascals === draft.pascals &&
      next.source === draft.source &&
      next.atmFirst !== draft.atmFirst
    ) {
      setDraft(next);
      return;
    }

    const input = draftToInput(next);
    const validation = validateAtmToPascals(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateAtmToPascals(input);
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
          <p className="text-xs font-normal text-muted-foreground">1 atm = 101,325 Pa</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AtmToPascalsForm
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
            setResult(calculateAtmToPascals(DEFAULT_ATM_TO_PASCALS_INPUT));
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
          onSwap={() => setDraft({ ...draft, atmFirst: !draft.atmFirst })}
        >
          <AtmToPascalsResults
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
        </AtmToPascalsForm>
      </div>
    </section>
  );
}
