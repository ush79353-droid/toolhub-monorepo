'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateLiterToCc, formatVolume, shareResultText } from './calculation';
import {
  LiterToCcForm,
  draftToInput,
  emptyDraft,
  type LiterToCcDraft,
} from './LiterToCcForm';
import { LiterToCcResults } from './LiterToCcResults';
import {
  DEFAULT_LITER_TO_CC_INPUT,
  type LiterToCcFieldErrors,
  type LiterToCcResult,
} from './types';
import { validateLiterToCc } from './validation';

function syncDraftFromResult(draft: LiterToCcDraft, result: LiterToCcResult): LiterToCcDraft {
  if (draft.source === 'liters') {
    return { ...draft, cc: formatVolume(result.cc) };
  }
  return { ...draft, liters: formatVolume(result.liters) };
}

function initialDraft(): LiterToCcDraft {
  const initial = calculateLiterToCc(DEFAULT_LITER_TO_CC_INPUT);
  return {
    source: 'liters',
    liters: formatVolume(initial.liters),
    cc: formatVolume(initial.cc),
    litersFirst: true,
  };
}

export function LiterToCcConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LiterToCcDraft>(initialDraft);
  const [errors, setErrors] = React.useState<LiterToCcFieldErrors>({});
  const [result, setResult] = React.useState<LiterToCcResult | null>(() =>
    calculateLiterToCc(DEFAULT_LITER_TO_CC_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: LiterToCcDraft) => {
    if (
      next.liters === draft.liters &&
      next.cc === draft.cc &&
      next.source === draft.source &&
      next.litersFirst !== draft.litersFirst
    ) {
      setDraft(next);
      return;
    }

    const input = draftToInput(next);
    const validation = validateLiterToCc(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateLiterToCc(input);
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
          <p className="text-xs font-normal text-muted-foreground">1 L = 1000 cc = 1000 cm³</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LiterToCcForm
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
            setResult(calculateLiterToCc(DEFAULT_LITER_TO_CC_INPUT));
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
          onSwap={() => setDraft({ ...draft, litersFirst: !draft.litersFirst })}
        >
          <LiterToCcResults
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
        </LiterToCcForm>
      </div>
    </section>
  );
}
