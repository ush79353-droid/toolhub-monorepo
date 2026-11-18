'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculatePintsToCups, formatVolume, shareResultText } from './calculation';
import {
  PintsToCupsForm,
  defaultDraft,
  draftToInput,
  emptyDraft,
  type PintsToCupsDraft,
} from './PintsToCupsForm';
import { PintsToCupsResults } from './PintsToCupsResults';
import {
  DEFAULT_CUP_UNIT,
  DEFAULT_PINT_UNIT,
  LITERS_PER_CUP,
  LITERS_PER_PINT,
  type PintsToCupsFieldErrors,
  type PintsToCupsResult,
} from './types';
import { validatePintsToCups } from './validation';

function syncDraftFromResult(draft: PintsToCupsDraft, result: PintsToCupsResult): PintsToCupsDraft {
  return {
    ...draft,
    pints: draft.source === 'pints' ? draft.pints : formatVolume(result.pints),
    cups: draft.source === 'cups' ? draft.cups : formatVolume(result.cups),
  };
}

function initialResult(): PintsToCupsResult {
  return calculatePintsToCups({
    source: 'pints',
    value: 1,
    cupUnit: DEFAULT_CUP_UNIT,
    pintUnit: DEFAULT_PINT_UNIT,
  });
}

export function PintsToCupsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PintsToCupsDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<PintsToCupsFieldErrors>({});
  const [result, setResult] = React.useState<PintsToCupsResult | null>(initialResult);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const litersRef = React.useRef<number | null>(LITERS_PER_PINT.usLiquid);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PintsToCupsDraft) => {
    // Cup/pint unit-only change: preserve physical volume.
    if (
      next.cups === draft.cups &&
      next.pints === draft.pints &&
      next.source === draft.source &&
      (next.cupUnit !== draft.cupUnit || next.pintUnit !== draft.pintUnit) &&
      litersRef.current != null
    ) {
      const liters = litersRef.current;
      const cups = liters / LITERS_PER_CUP[next.cupUnit];
      const pints = liters / LITERS_PER_PINT[next.pintUnit];
      const synced: PintsToCupsDraft = {
        ...next,
        cups: formatVolume(cups),
        pints: formatVolume(pints),
        source: 'pints',
      };
      setDraft(synced);
      setErrors({});
      setResult(
        calculatePintsToCups({
          source: 'pints',
          value: pints,
          cupUnit: next.cupUnit,
          pintUnit: next.pintUnit,
        }),
      );
      return;
    }

    const input = draftToInput(next);
    const validation = validatePintsToCups(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      if (input.value === null) {
        setDraft({
          ...next,
          pints: next.source === 'pints' ? next.pints : '',
          cups: next.source === 'cups' ? next.cups : '',
        });
        litersRef.current = null;
      } else {
        setDraft(next);
      }
      return;
    }
    const nextResult = calculatePintsToCups(input);
    litersRef.current = nextResult.liters;
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
            Volume · 1 US liquid pint = 2 US cups
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PintsToCupsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            const next = defaultDraft();
            const nextResult = initialResult();
            litersRef.current = nextResult.liters;
            setDraft(next);
            setErrors({});
            setResult(nextResult);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            litersRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <PintsToCupsResults
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
        </PintsToCupsForm>
      </div>
    </section>
  );
}
