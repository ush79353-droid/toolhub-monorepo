'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateBarToPsi,
  formatPressure,
  fromPascals,
  toPascals,
  shareResultText,
} from './calculation';
import { BarToPsiForm, draftToInput, emptyDraft, type BarToPsiDraft } from './BarToPsiForm';
import { BarToPsiResults } from './BarToPsiResults';
import {
  DEFAULT_BAR_TO_PSI_INPUT,
  PSI_PER_BAR,
  type BarToPsiFieldErrors,
  type BarToPsiResult,
} from './types';
import { validateBarToPsi } from './validation';

function syncDraftFromResult(draft: BarToPsiDraft, result: BarToPsiResult): BarToPsiDraft {
  if (draft.source === 'primary') {
    return { ...draft, secondary: formatPressure(result.secondary) };
  }
  return { ...draft, primary: formatPressure(result.primary) };
}

function initialDraft(): BarToPsiDraft {
  const initial = calculateBarToPsi(DEFAULT_BAR_TO_PSI_INPUT);
  return {
    source: 'primary',
    primary: formatPressure(initial.primary),
    secondary: formatPressure(initial.secondary),
    primaryUnit: 'bar',
    secondaryUnit: 'psi',
  };
}

export function BarToPsiConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<BarToPsiDraft>(initialDraft);
  const [errors, setErrors] = React.useState<BarToPsiFieldErrors>({});
  const [result, setResult] = React.useState<BarToPsiResult | null>(() =>
    calculateBarToPsi(DEFAULT_BAR_TO_PSI_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const pascalsRef = React.useRef<number | null>(toPascals(1, 'bar'));

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: BarToPsiDraft) => {
    if (
      next.primary === draft.primary &&
      next.secondary === draft.secondary &&
      next.source === draft.source &&
      (next.primaryUnit !== draft.primaryUnit || next.secondaryUnit !== draft.secondaryUnit)
    ) {
      const pascals = pascalsRef.current;
      if (pascals === null) {
        setDraft(next);
        return;
      }
      const primary = fromPascals(pascals, next.primaryUnit);
      const secondary = fromPascals(pascals, next.secondaryUnit);
      const synced: BarToPsiDraft = {
        ...next,
        primary: formatPressure(primary),
        secondary: formatPressure(secondary),
      };
      setDraft(synced);
      setErrors({});
      setResult(
        calculateBarToPsi({
          source: 'primary',
          primary,
          secondary: null,
          primaryUnit: next.primaryUnit,
          secondaryUnit: next.secondaryUnit,
        }),
      );
      return;
    }

    const input = draftToInput(next);
    const validation = validateBarToPsi(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setDraft(next);
      setResult(null);
      if (Object.keys(validation.errors).length === 0) {
        pascalsRef.current = null;
      }
      return;
    }

    const nextResult = calculateBarToPsi(input);
    pascalsRef.current = toPascals(
      nextResult.source === 'primary' ? nextResult.primary : nextResult.secondary,
      nextResult.source === 'primary' ? nextResult.primaryUnit : nextResult.secondaryUnit,
    );
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
            1 bar ≈ {PSI_PER_BAR.toFixed(6)} psi
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <BarToPsiForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            pascalsRef.current = toPascals(1, 'bar');
            setDraft(initialDraft());
            setErrors({});
            setResult(calculateBarToPsi(DEFAULT_BAR_TO_PSI_INPUT));
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            pascalsRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <BarToPsiResults
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
        </BarToPsiForm>
      </div>
    </section>
  );
}
