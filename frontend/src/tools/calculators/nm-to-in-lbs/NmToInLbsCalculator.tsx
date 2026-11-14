'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateNmToInLbs, formatTorque } from './calculation';
import {
  NmToInLbsForm,
  draftToInput,
  inputToDraft,
  type NmToInLbsDraft,
} from './NmToInLbsForm';
import { NmToInLbsResults } from './NmToInLbsResults';
import {
  DEFAULT_NM_TO_IN_LBS_INPUT,
  EMPTY_NM_TO_IN_LBS_INPUT,
  NEWTON_METERS_PER_INCH_POUND,
  type NmToInLbsFieldErrors,
  type NmToInLbsResult,
} from './types';
import { validateNmToInLbs } from './validation';

function summaryText(result: NmToInLbsResult): string {
  return [
    'Nm to in-lbs Converter',
    'Omega Calculators',
    '',
    `Newton-meters: ${formatTorque(result.nm)} N·m`,
    `Inch-pounds: ≈ ${formatTorque(result.inlbf)} in·lbf`,
    '',
    result.source === 'nm'
      ? `Formula: in·lbf = N·m / ${NEWTON_METERS_PER_INCH_POUND}`
      : `Formula: N·m = in·lbf × ${NEWTON_METERS_PER_INCH_POUND}`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: NmToInLbsDraft,
  result: NmToInLbsResult
): NmToInLbsDraft {
  if (draft.source === 'nm') {
    return { ...draft, inlbf: formatTorque(result.inlbf) };
  }
  return { ...draft, nm: formatTorque(result.nm) };
}

export function NmToInLbsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<NmToInLbsDraft>(() => {
    const initial = calculateNmToInLbs(DEFAULT_NM_TO_IN_LBS_INPUT);
    return {
      source: 'nm',
      nm: formatTorque(initial.nm),
      inlbf: formatTorque(initial.inlbf),
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<NmToInLbsFieldErrors>({});
  const [result, setResult] = React.useState<NmToInLbsResult | null>(() =>
    calculateNmToInLbs(DEFAULT_NM_TO_IN_LBS_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: NmToInLbsDraft) => {
      if (
        next.nm === draft.nm &&
        next.inlbf === draft.inlbf &&
        next.source === draft.source &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateNmToInLbs(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateNmToInLbs(parsed);
      setResult(nextResult);
      setDraft(syncDraftFromResult(next, nextResult));
    },
    [draft]
  );

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
            1 in·lbf = {NEWTON_METERS_PER_INCH_POUND} N·m
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <NmToInLbsForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_NM_TO_IN_LBS_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <NmToInLbsResults
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
