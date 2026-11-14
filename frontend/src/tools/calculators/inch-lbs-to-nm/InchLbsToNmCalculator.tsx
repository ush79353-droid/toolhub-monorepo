'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateInchLbsToNm, formatTorque } from './calculation';
import {
  InchLbsToNmForm,
  draftToInput,
  inputToDraft,
  type InchLbsToNmDraft,
} from './InchLbsToNmForm';
import { InchLbsToNmResults } from './InchLbsToNmResults';
import {
  DEFAULT_INCH_LBS_TO_NM_INPUT,
  EMPTY_INCH_LBS_TO_NM_INPUT,
  NEWTON_METERS_PER_INCH_POUND,
  type InchLbsToNmFieldErrors,
  type InchLbsToNmResult,
} from './types';
import { validateInchLbsToNm } from './validation';

function summaryText(result: InchLbsToNmResult): string {
  return [
    'Inch-lbs to Nm Converter',
    'Omega Calculators',
    '',
    `Inch-pounds: ${formatTorque(result.inlbf)} in·lbf`,
    `Newton-meters: ${formatTorque(result.nm)} N·m`,
    '',
    result.source === 'inlbf'
      ? `Formula: N·m = in·lbf × ${NEWTON_METERS_PER_INCH_POUND}`
      : `Formula: in·lbf = N·m / ${NEWTON_METERS_PER_INCH_POUND}`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: InchLbsToNmDraft,
  result: InchLbsToNmResult
): InchLbsToNmDraft {
  if (draft.source === 'inlbf') {
    return { ...draft, nm: formatTorque(result.nm) };
  }
  return { ...draft, inlbf: formatTorque(result.inlbf) };
}

export function InchLbsToNmConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<InchLbsToNmDraft>(() => {
    const initial = calculateInchLbsToNm(DEFAULT_INCH_LBS_TO_NM_INPUT);
    return {
      source: 'inlbf',
      inlbf: formatTorque(initial.inlbf),
      nm: formatTorque(initial.nm),
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<InchLbsToNmFieldErrors>({});
  const [result, setResult] = React.useState<InchLbsToNmResult | null>(() =>
    calculateInchLbsToNm(DEFAULT_INCH_LBS_TO_NM_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: InchLbsToNmDraft) => {
      if (
        next.inlbf === draft.inlbf &&
        next.nm === draft.nm &&
        next.source === draft.source &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateInchLbsToNm(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateInchLbsToNm(parsed);
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
        <InchLbsToNmForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_INCH_LBS_TO_NM_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <InchLbsToNmResults
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
