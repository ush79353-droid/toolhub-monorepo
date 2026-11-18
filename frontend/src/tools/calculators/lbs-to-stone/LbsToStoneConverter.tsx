'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateLbsToStone, formatWeight, shareResultText } from './calculation';
import {
  LbsToStoneForm,
  draftToInput,
  emptyDraft,
  type LbsToStoneDraft,
} from './LbsToStoneForm';
import { LbsToStoneResults } from './LbsToStoneResults';
import {
  DEFAULT_LBS_TO_STONE_INPUT,
  type LbsToStoneFieldErrors,
  type LbsToStoneResult,
} from './types';
import { validateLbsToStone } from './validation';

function syncDraftFromResult(draft: LbsToStoneDraft, result: LbsToStoneResult): LbsToStoneDraft {
  if (draft.source === 'pounds') {
    return { ...draft, stones: formatWeight(result.stones) };
  }
  return { ...draft, pounds: formatWeight(result.pounds) };
}

function initialDraft(): LbsToStoneDraft {
  const initial = calculateLbsToStone(DEFAULT_LBS_TO_STONE_INPUT);
  return {
    source: 'pounds',
    pounds: formatWeight(initial.pounds),
    stones: formatWeight(initial.stones),
    poundsFirst: true,
  };
}

export function LbsToStoneConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LbsToStoneDraft>(initialDraft);
  const [errors, setErrors] = React.useState<LbsToStoneFieldErrors>({});
  const [result, setResult] = React.useState<LbsToStoneResult | null>(() =>
    calculateLbsToStone(DEFAULT_LBS_TO_STONE_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: LbsToStoneDraft) => {
    if (
      next.pounds === draft.pounds &&
      next.stones === draft.stones &&
      next.source === draft.source &&
      next.poundsFirst !== draft.poundsFirst
    ) {
      setDraft(next);
      return;
    }

    const input = draftToInput(next);
    const validation = validateLbsToStone(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateLbsToStone(input);
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
          <p className="text-xs font-normal text-muted-foreground">1 stone = 14 pounds</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LbsToStoneForm
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
            setResult(calculateLbsToStone(DEFAULT_LBS_TO_STONE_INPUT));
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
          onSwap={() => setDraft({ ...draft, poundsFirst: !draft.poundsFirst })}
        >
          <LbsToStoneResults
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
        </LbsToStoneForm>
      </div>
    </section>
  );
}
