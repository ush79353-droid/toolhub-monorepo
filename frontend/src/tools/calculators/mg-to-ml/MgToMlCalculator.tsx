'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateMgToMl, formatMeasure } from './calculation';
import {
  MgToMlForm,
  draftToInput,
  inputToDraft,
  type MgToMlDraft,
} from './MgToMlForm';
import { MgToMlResults } from './MgToMlResults';
import {
  DEFAULT_MG_TO_ML_INPUT,
  EMPTY_MG_TO_ML_INPUT,
  type MgToMlFieldErrors,
  type MgToMlResult,
} from './types';
import { validateMgToMl } from './validation';

function summaryText(result: MgToMlResult): string {
  const lines = [
    'mg to mL Calculator — Omega Calculators',
    result.mode === 'medication'
      ? 'Mode: Medication Concentration'
      : 'Mode: Density-Based Conversion',
    result.substanceLabel,
    result.factorLabel,
    `Mass: ${formatMeasure(result.massMg)} mg`,
    `Volume: ${formatMeasure(result.volumeMl)} mL`,
  ];
  if (result.mode === 'medication') {
    lines.push('Mathematical conversion only.');
  }
  return lines.join('\n');
}

function syncDraftFromResult(draft: MgToMlDraft, result: MgToMlResult): MgToMlDraft {
  if (draft.source === 'mass') {
    return { ...draft, volumeMl: formatMeasure(result.volumeMl) };
  }
  return { ...draft, massMg: formatMeasure(result.massMg) };
}

export function MgToMlCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MgToMlDraft>(() => {
    const initial = calculateMgToMl(DEFAULT_MG_TO_ML_INPUT);
    return {
      ...inputToDraft(DEFAULT_MG_TO_ML_INPUT),
      massMg: formatMeasure(initial.massMg),
      volumeMl: formatMeasure(initial.volumeMl),
    };
  });
  const [errors, setErrors] = React.useState<MgToMlFieldErrors>({});
  const [result, setResult] = React.useState<MgToMlResult | null>(() =>
    calculateMgToMl(DEFAULT_MG_TO_ML_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: MgToMlDraft) => {
      const accordionOnly =
        next.massMg === draft.massMg &&
        next.volumeMl === draft.volumeMl &&
        next.mode === draft.mode &&
        next.source === draft.source &&
        next.substance === draft.substance &&
        next.densityValue === draft.densityValue &&
        next.densityUnit === draft.densityUnit &&
        next.concentrationFormat === draft.concentrationFormat &&
        next.concentrationMgPerMl === draft.concentrationMgPerMl &&
        next.labelMassMg === draft.labelMassMg &&
        next.labelVolumeMl === draft.labelVolumeMl &&
        next.moreOpen !== draft.moreOpen;

      if (accordionOnly) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateMgToMl(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateMgToMl(parsed);
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
            mg ↔ mL needs density or concentration
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MgToMlForm
          draft={draft}
          errors={errors}
          otherMassUnits={result?.otherMassUnits ?? null}
          otherVolumeUnits={result?.otherVolumeUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_MG_TO_ML_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <MgToMlResults
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
