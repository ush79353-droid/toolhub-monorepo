'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateLToGal,
  formatVolume,
  litersToGallons,
  litersToOther,
  shareResultText,
} from './calculation';
import { LToGalForm, draftToInput, emptyDraft, type LToGalDraft } from './LToGalForm';
import { LToGalResults } from './LToGalResults';
import {
  DEFAULT_L_TO_GAL_INPUT,
  type LToGalFieldErrors,
  type LToGalResult,
} from './types';
import { validateLToGal } from './validation';

function syncDraftFromResult(draft: LToGalDraft, result: LToGalResult): LToGalDraft {
  if (draft.source === 'liters') {
    return {
      ...draft,
      gallons: formatVolume(result.gallons),
      other: formatVolume(result.other),
    };
  }
  if (draft.source === 'gallons') {
    return {
      ...draft,
      liters: formatVolume(result.liters),
      other: formatVolume(result.other),
    };
  }
  return {
    ...draft,
    liters: formatVolume(result.liters),
    gallons: formatVolume(result.gallons),
  };
}

function initialDraft(): LToGalDraft {
  const initial = calculateLToGal(DEFAULT_L_TO_GAL_INPUT);
  return {
    source: 'liters',
    liters: formatVolume(initial.liters),
    gallons: formatVolume(initial.gallons),
    other: formatVolume(initial.other),
    gallonKind: 'usGal',
    otherUnit: 'usFlOz',
  };
}

export function LToGalConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LToGalDraft>(initialDraft);
  const [errors, setErrors] = React.useState<LToGalFieldErrors>({});
  const [result, setResult] = React.useState<LToGalResult | null>(() =>
    calculateLToGal(DEFAULT_L_TO_GAL_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const litersRef = React.useRef<number | null>(1);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: LToGalDraft) => {
    if (
      next.liters === draft.liters &&
      next.gallons === draft.gallons &&
      next.other === draft.other &&
      next.source === draft.source &&
      (next.gallonKind !== draft.gallonKind || next.otherUnit !== draft.otherUnit)
    ) {
      const liters = litersRef.current;
      if (liters === null) {
        setDraft(next);
        return;
      }
      const gallons = litersToGallons(liters, next.gallonKind);
      const other = litersToOther(liters, next.otherUnit);
      const synced: LToGalDraft = {
        ...next,
        liters: formatVolume(liters),
        gallons: formatVolume(gallons),
        other: formatVolume(other),
      };
      setDraft(synced);
      setErrors({});
      setResult(
        calculateLToGal({
          source: 'liters',
          liters,
          gallons: null,
          other: null,
          gallonKind: next.gallonKind,
          otherUnit: next.otherUnit,
        }),
      );
      return;
    }

    const input = draftToInput(next);
    const validation = validateLToGal(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setDraft(next);
      setResult(null);
      if (Object.keys(validation.errors).length === 0) {
        litersRef.current = null;
      }
      return;
    }

    const nextResult = calculateLToGal(input);
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
            1 US gal = 3.785411784 L
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LToGalForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            litersRef.current = 1;
            setDraft(initialDraft());
            setErrors({});
            setResult(calculateLToGal(DEFAULT_L_TO_GAL_INPUT));
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
          <LToGalResults
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
        </LToGalForm>
      </div>
    </section>
  );
}
