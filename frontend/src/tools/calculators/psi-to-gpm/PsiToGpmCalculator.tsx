'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculatePsiToGpm,
  formatFlowNumber,
  fromMeters,
  fromM3s,
  fromSquareMeters,
} from './calculation';
import {
  draftToInput,
  inputToDraft,
  PsiToGpmForm,
  type PsiToGpmDraft,
} from './PsiToGpmForm';
import { PsiToGpmResults } from './PsiToGpmResults';
import {
  DEFAULT_PSI_TO_GPM_INPUT,
  EMPTY_PSI_TO_GPM_INPUT,
  type PsiToGpmFieldErrors,
  type PsiToGpmResult,
} from './types';
import { validatePsiToGpm } from './validation';

function summaryText(result: PsiToGpmResult): string {
  return [
    'PSI to GPM Calculator',
    'Omega Calculators',
    '',
    `Inlet / exit ΔP: ${formatFlowNumber(result.deltaPPa)} Pa`,
    `Pipe diameter: ${formatFlowNumber(fromMeters(result.diameterM, 'cm'))} cm`,
    `Flow area: ${formatFlowNumber(fromSquareMeters(result.areaM2, 'cm2'))} cm²`,
    `Fluid density: ${formatFlowNumber(result.densityKgM3)} kg/m³`,
    `Discharge coefficient: ${formatFlowNumber(result.dischargeCoefficient)}`,
    `Pressure reference: ${result.pressureReference}`,
    `Model: Ideal pressure-driven flow`,
    '',
    `Calculated flow: ${formatFlowNumber(result.flowUsGpm)} US gpm`,
    `Velocity: ${formatFlowNumber(result.velocityMs)} m/s`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: PsiToGpmDraft,
  result: PsiToGpmResult
): PsiToGpmDraft {
  if (draft.geometrySource === 'diameter') {
    return {
      ...draft,
      area: formatFlowNumber(fromSquareMeters(result.areaM2, draft.areaUnit)),
    };
  }
  return {
    ...draft,
    diameter: formatFlowNumber(fromMeters(result.diameterM, draft.lengthUnit)),
  };
}

export function PsiToGpmCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PsiToGpmDraft>(() => {
    const initial = calculatePsiToGpm(DEFAULT_PSI_TO_GPM_INPUT);
    return syncDraftFromResult(inputToDraft(DEFAULT_PSI_TO_GPM_INPUT), initial);
  });
  const [errors, setErrors] = React.useState<PsiToGpmFieldErrors>({});
  const [result, setResult] = React.useState<PsiToGpmResult | null>(() =>
    calculatePsiToGpm(DEFAULT_PSI_TO_GPM_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: PsiToGpmDraft) => {
    const parsed = draftToInput(next);
    const validation = validatePsiToGpm(parsed);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculatePsiToGpm(parsed);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  }, []);

  const flowDisplay =
    result === null ? '' : formatFlowNumber(fromM3s(result.flowM3s, draft.flowUnit));

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
            Pressure difference → ideal liquid flow (US gpm)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PsiToGpmForm
          draft={draft}
          errors={errors}
          result={result}
          flowDisplay={flowDisplay}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_PSI_TO_GPM_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <PsiToGpmResults
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
