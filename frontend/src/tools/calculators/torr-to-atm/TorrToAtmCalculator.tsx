'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateTorrToAtm, formatPressure } from './calculation';
import {
  TorrToAtmForm,
  draftToInput,
  inputToDraft,
  type TorrToAtmDraft,
} from './TorrToAtmForm';
import { TorrToAtmResults } from './TorrToAtmResults';
import {
  DEFAULT_TORR_TO_ATM_INPUT,
  EMPTY_TORR_TO_ATM_INPUT,
  TORR_PER_ATMOSPHERE,
  type TorrToAtmFieldErrors,
  type TorrToAtmResult,
} from './types';
import { validateTorrToAtm } from './validation';

function summaryText(result: TorrToAtmResult): string {
  return [
    'Torr to atm Conversion',
    'Omega Calculators',
    '',
    result.source === 'Torr'
      ? `Pressure: ${formatPressure(result.torr)} Torr\nEquivalent: ${formatPressure(result.atm)} atm`
      : `Pressure: ${formatPressure(result.atm)} atm\nEquivalent: ${formatPressure(result.torr)} Torr`,
    '',
    result.source === 'Torr'
      ? `Formula:\natm = Torr / ${TORR_PER_ATMOSPHERE}`
      : `Formula:\nTorr = atm × ${TORR_PER_ATMOSPHERE}`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: TorrToAtmDraft,
  result: TorrToAtmResult
): TorrToAtmDraft {
  if (draft.source === 'Torr') {
    return { ...draft, atm: formatPressure(result.atm) };
  }
  return { ...draft, torr: formatPressure(result.torr) };
}

function defaultDraft(): TorrToAtmDraft {
  const initial = calculateTorrToAtm(DEFAULT_TORR_TO_ATM_INPUT);
  return syncDraftFromResult(inputToDraft(DEFAULT_TORR_TO_ATM_INPUT), initial);
}

export function TorrToAtmConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<TorrToAtmDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<TorrToAtmFieldErrors>({});
  const [result, setResult] = React.useState<TorrToAtmResult | null>(() =>
    calculateTorrToAtm(DEFAULT_TORR_TO_ATM_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: TorrToAtmDraft) => {
      if (
        next.torr === draft.torr &&
        next.atm === draft.atm &&
        next.source === draft.source &&
        (next.primaryOpen !== draft.primaryOpen || next.moreOpen !== draft.moreOpen)
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateTorrToAtm(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateTorrToAtm(parsed);
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
            1 atm = {TORR_PER_ATMOSPHERE} Torr
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <TorrToAtmForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            const next = defaultDraft();
            setDraft(next);
            setErrors({});
            setResult(calculateTorrToAtm(DEFAULT_TORR_TO_ATM_INPUT));
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_TORR_TO_ATM_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <TorrToAtmResults
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
