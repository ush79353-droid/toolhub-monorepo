'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateMlToCups, formatVolume } from './calculation';
import { MlToCupsForm, draftToInput, inputToDraft, type MlToCupsDraft } from './MlToCupsForm';
import { MlToCupsResults } from './MlToCupsResults';
import {
  CUP_STANDARD_OPTIONS,
  DEFAULT_ML_TO_CUPS_INPUT,
  EMPTY_ML_TO_CUPS_INPUT,
  type MlToCupsFieldErrors,
  type MlToCupsResult,
} from './types';
import { validateMlToCups } from './validation';

function summaryText(result: MlToCupsResult): string {
  const standard =
    CUP_STANDARD_OPTIONS.find((o) => o.value === result.cupStandard)?.label ??
    result.cupStandard;
  const lines = [
    'mL to Cups Converter — Omega Calculators',
    `Milliliters: ${formatVolume(result.ml)} mL`,
    `Cup standard: ${standard}`,
    `Cups: ${formatVolume(result.cups)}`,
  ];
  return lines.join('\n');
}

function syncDraftFromResult(draft: MlToCupsDraft, result: MlToCupsResult): MlToCupsDraft {
  if (draft.source === 'ml') {
    return { ...draft, cups: formatVolume(result.cups) };
  }
  return { ...draft, ml: formatVolume(result.ml) };
}

export function MlToCupsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MlToCupsDraft>(() => {
    const initial = calculateMlToCups(DEFAULT_ML_TO_CUPS_INPUT);
    return {
      source: 'cups',
      ml: formatVolume(initial.ml),
      cups: formatVolume(initial.cups),
      cupStandard: 'usCustomary',
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<MlToCupsFieldErrors>({});
  const [result, setResult] = React.useState<MlToCupsResult | null>(() =>
    calculateMlToCups(DEFAULT_ML_TO_CUPS_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: MlToCupsDraft) => {
      if (
        next.ml === draft.ml &&
        next.cups === draft.cups &&
        next.source === draft.source &&
        next.cupStandard === draft.cupStandard &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateMlToCups(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateMlToCups(parsed);
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
          <h2 className="text-[15px] font-semibold text-accent">Converter</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Cup size depends on the selected standard
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MlToCupsForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_ML_TO_CUPS_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <MlToCupsResults
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
