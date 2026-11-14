'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateLbsToNewtons, formatForce } from './calculation';
import {
  LbsToNewtonsForm,
  draftToInput,
  inputToDraft,
  type LbsToNewtonsDraft,
} from './LbsToNewtonsForm';
import { LbsToNewtonsResults } from './LbsToNewtonsResults';
import {
  DEFAULT_LBS_TO_NEWTONS_INPUT,
  EMPTY_LBS_TO_NEWTONS_INPUT,
  NEWTONS_PER_POUND_FORCE,
  type LbsToNewtonsFieldErrors,
  type LbsToNewtonsResult,
} from './types';
import { validateLbsToNewtons } from './validation';

function summaryText(result: LbsToNewtonsResult): string {
  return [
    'Lbs to Newtons Converter',
    'Omega Calculators',
    '',
    `Pounds-force: ${formatForce(result.lbf)} lbf`,
    `Newtons: ${formatForce(result.newtons)} N`,
    '',
    result.source === 'lbf'
      ? `Formula: N = lbf × ${formatForce(NEWTONS_PER_POUND_FORCE)}`
      : `Formula: lbf = N / ${formatForce(NEWTONS_PER_POUND_FORCE)}`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: LbsToNewtonsDraft,
  result: LbsToNewtonsResult
): LbsToNewtonsDraft {
  if (draft.source === 'lbf') {
    return { ...draft, newtons: formatForce(result.newtons) };
  }
  return { ...draft, lbf: formatForce(result.lbf) };
}

export function LbsToNewtonsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LbsToNewtonsDraft>(() => {
    const initial = calculateLbsToNewtons(DEFAULT_LBS_TO_NEWTONS_INPUT);
    return {
      source: 'lbf',
      lbf: formatForce(initial.lbf),
      newtons: formatForce(initial.newtons),
    };
  });
  const [errors, setErrors] = React.useState<LbsToNewtonsFieldErrors>({});
  const [result, setResult] = React.useState<LbsToNewtonsResult | null>(() =>
    calculateLbsToNewtons(DEFAULT_LBS_TO_NEWTONS_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: LbsToNewtonsDraft) => {
    const parsed = draftToInput(next);
    const validation = validateLbsToNewtons(parsed);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateLbsToNewtons(parsed);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  }, []);

  const sharePayload = result ? summaryText(result) : '';

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
            1 lbf = {formatForce(NEWTONS_PER_POUND_FORCE)} N
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LbsToNewtonsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_LBS_TO_NEWTONS_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <LbsToNewtonsResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}
