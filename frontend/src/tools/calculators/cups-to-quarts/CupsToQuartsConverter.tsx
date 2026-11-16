'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateCupsToQuarts, formatVolume, shareResultText } from './calculation';
import {
  CupsToQuartsForm,
  draftToInput,
  emptyDraft,
  type CupsToQuartsDraft,
} from './CupsToQuartsForm';
import { CupsToQuartsResults } from './CupsToQuartsResults';
import {
  LITERS_PER_CUP,
  LITERS_PER_QUART,
  type CupsToQuartsFieldErrors,
  type CupsToQuartsResult,
} from './types';
import { validateCupsToQuarts } from './validation';

function syncDraftFromResult(
  draft: CupsToQuartsDraft,
  result: CupsToQuartsResult,
): CupsToQuartsDraft {
  return {
    ...draft,
    cups: draft.source === 'cups' ? draft.cups : formatVolume(result.cups),
    quarts: draft.source === 'quarts' ? draft.quarts : formatVolume(result.quarts),
  };
}

export function CupsToQuartsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CupsToQuartsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CupsToQuartsFieldErrors>({});
  const [result, setResult] = React.useState<CupsToQuartsResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const litersRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CupsToQuartsDraft) => {
    // Cup/quart unit-only change: preserve physical volume.
    if (
      next.cups === draft.cups &&
      next.quarts === draft.quarts &&
      next.source === draft.source &&
      (next.cupUnit !== draft.cupUnit || next.quartUnit !== draft.quartUnit) &&
      litersRef.current != null
    ) {
      const liters = litersRef.current;
      const cups = liters / LITERS_PER_CUP[next.cupUnit];
      const quarts = liters / LITERS_PER_QUART[next.quartUnit];
      const synced: CupsToQuartsDraft = {
        ...next,
        cups: formatVolume(cups),
        quarts: formatVolume(quarts),
        source: 'cups',
      };
      setDraft(synced);
      setErrors({});
      setResult(
        calculateCupsToQuarts({
          source: 'cups',
          value: cups,
          cupUnit: next.cupUnit,
          quartUnit: next.quartUnit,
        }),
      );
      return;
    }

    const input = draftToInput(next);
    const validation = validateCupsToQuarts(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      if (input.value === null) {
        setDraft({
          ...next,
          cups: next.source === 'cups' ? next.cups : '',
          quarts: next.source === 'quarts' ? next.quarts : '',
        });
        litersRef.current = null;
      } else {
        setDraft(next);
      }
      return;
    }
    const nextResult = calculateCupsToQuarts(input);
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
            Volume · 4 US cups = 1 US liquid quart
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CupsToQuartsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            litersRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
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
          <CupsToQuartsResults
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
        </CupsToQuartsForm>
      </div>
    </section>
  );
}
