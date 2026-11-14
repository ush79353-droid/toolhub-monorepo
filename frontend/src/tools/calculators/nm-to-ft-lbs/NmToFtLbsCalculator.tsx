'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateNmToFtLbs, formatTorque } from './calculation';
import {
  NmToFtLbsForm,
  draftToInput,
  inputToDraft,
  type NmToFtLbsDraft,
} from './NmToFtLbsForm';
import { NmToFtLbsResults } from './NmToFtLbsResults';
import {
  DEFAULT_NM_TO_FT_LBS_INPUT,
  EMPTY_NM_TO_FT_LBS_INPUT,
  NEWTON_METERS_PER_FOOT_POUND,
  type NmToFtLbsFieldErrors,
  type NmToFtLbsResult,
} from './types';
import { validateNmToFtLbs } from './validation';

function summaryText(result: NmToFtLbsResult): string {
  return [
    'Nm to ft-lbs Converter',
    'Omega Calculators',
    '',
    result.source === 'nm'
      ? `Torque: ${formatTorque(result.nm)} N·m\nEquivalent: ${formatTorque(result.ftlbf)} ft·lbf`
      : `Torque: ${formatTorque(result.ftlbf)} ft·lbf\nEquivalent: ${formatTorque(result.nm)} N·m`,
    '',
    result.source === 'nm'
      ? `Formula:\nft·lbf = N·m / ${NEWTON_METERS_PER_FOOT_POUND}`
      : `Formula:\nN·m = ft·lbf × ${NEWTON_METERS_PER_FOOT_POUND}`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: NmToFtLbsDraft,
  result: NmToFtLbsResult
): NmToFtLbsDraft {
  if (draft.source === 'nm') {
    return { ...draft, ftlbf: formatTorque(result.ftlbf) };
  }
  return { ...draft, nm: formatTorque(result.nm) };
}

function defaultDraft(): NmToFtLbsDraft {
  const initial = calculateNmToFtLbs(DEFAULT_NM_TO_FT_LBS_INPUT);
  return {
    source: 'nm',
    nm: formatTorque(initial.nm),
    ftlbf: formatTorque(initial.ftlbf),
    moreOpen: false,
  };
}

export function NmToFtLbsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<NmToFtLbsDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<NmToFtLbsFieldErrors>({});
  const [result, setResult] = React.useState<NmToFtLbsResult | null>(() =>
    calculateNmToFtLbs(DEFAULT_NM_TO_FT_LBS_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: NmToFtLbsDraft) => {
      if (
        next.nm === draft.nm &&
        next.ftlbf === draft.ftlbf &&
        next.source === draft.source &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateNmToFtLbs(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateNmToFtLbs(parsed);
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
            1 ft·lbf = {NEWTON_METERS_PER_FOOT_POUND} N·m
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <NmToFtLbsForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(defaultDraft());
            setErrors({});
            setResult(calculateNmToFtLbs(DEFAULT_NM_TO_FT_LBS_INPUT));
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_NM_TO_FT_LBS_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <NmToFtLbsResults
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
