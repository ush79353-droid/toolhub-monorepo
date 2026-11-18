'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateCupsToOz, formatVolume, shareResultText } from './calculation';
import {
  CupsToOzForm,
  draftToInput,
  emptyDraft,
  type CupsToOzDraft,
} from './CupsToOzForm';
import { CupsToOzResults } from './CupsToOzResults';
import {
  LITERS_PER_CUP,
  LITERS_PER_FLUID_OUNCE,
  type CupsToOzFieldErrors,
  type CupsToOzResult,
} from './types';
import { validateCupsToOz } from './validation';

function syncDraftFromResult(draft: CupsToOzDraft, result: CupsToOzResult): CupsToOzDraft {
  return {
    ...draft,
    cups: draft.source === 'cups' ? draft.cups : formatVolume(result.cups),
    ounces: draft.source === 'ounces' ? draft.ounces : formatVolume(result.ounces),
  };
}

export function CupsToOzConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CupsToOzDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CupsToOzFieldErrors>({});
  const [result, setResult] = React.useState<CupsToOzResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const litersRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CupsToOzDraft) => {
    // Cup/ounce unit-only change: preserve physical volume.
    if (
      next.cups === draft.cups &&
      next.ounces === draft.ounces &&
      next.source === draft.source &&
      (next.cupUnit !== draft.cupUnit || next.ounceUnit !== draft.ounceUnit) &&
      litersRef.current != null
    ) {
      const liters = litersRef.current;
      const cups = liters / LITERS_PER_CUP[next.cupUnit];
      const ounces = liters / LITERS_PER_FLUID_OUNCE[next.ounceUnit];
      const synced: CupsToOzDraft = {
        ...next,
        cups: formatVolume(cups),
        ounces: formatVolume(ounces),
        source: 'cups',
      };
      setDraft(synced);
      setErrors({});
      setResult(
        calculateCupsToOz({
          source: 'cups',
          value: cups,
          cupUnit: next.cupUnit,
          ounceUnit: next.ounceUnit,
        }),
      );
      return;
    }

    const input = draftToInput(next);
    const validation = validateCupsToOz(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      if (input.value === null) {
        setDraft({
          ...next,
          cups: next.source === 'cups' ? next.cups : '',
          ounces: next.source === 'ounces' ? next.ounces : '',
        });
        litersRef.current = null;
      } else {
        setDraft(next);
      }
      return;
    }
    const nextResult = calculateCupsToOz(input);
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
            Fluid ounces (volume) · 1 US cup = 8 US fl oz
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CupsToOzForm
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
          <CupsToOzResults
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
        </CupsToOzForm>
      </div>
    </section>
  );
}
