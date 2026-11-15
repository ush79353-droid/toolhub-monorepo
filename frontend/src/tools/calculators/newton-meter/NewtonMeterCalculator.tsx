'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateNewtonMeter, formatTorque } from './calculation';
import {
  NewtonMeterForm,
  draftToInput,
  inputToDraft,
  type NewtonMeterDraft,
} from './NewtonMeterForm';
import { NewtonMeterResults } from './NewtonMeterResults';
import {
  DEFAULT_NEWTON_METER_INPUT,
  EMPTY_NEWTON_METER_INPUT,
  NEWTON_METERS_PER_FOOT_POUND,
  type NewtonMeterFieldErrors,
  type NewtonMeterResult,
  type TorqueUnit,
} from './types';
import { validateNewtonMeter } from './validation';

const UNIT_LABEL: Record<TorqueUnit, string> = {
  Nm: 'N·m',
  kNm: 'kN·m',
  mNm: 'mN·m',
  Ncm: 'N·cm',
  Nmm: 'N·mm',
  ftlbf: 'ft·lbf',
  inlbf: 'in·lbf',
  kgfm: 'kgf·m',
  kgfcm: 'kgf·cm',
};

function summaryText(result: NewtonMeterResult): string {
  return [
    'Newton Meter Calculator',
    'Omega Calculators',
    '',
    `Torque: ${formatTorque(result.first)} ${UNIT_LABEL[result.firstUnit]}`,
    `Equivalent: ${formatTorque(result.second)} ${UNIT_LABEL[result.secondUnit]}`,
    `Canonical: ${formatTorque(result.nm)} N·m`,
    '',
    result.source === 'first'
      ? `Formula: convert via N·m (1 ft·lbf = ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)} N·m)`
      : `Formula: convert via N·m (1 ft·lbf = ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)} N·m)`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: NewtonMeterDraft,
  result: NewtonMeterResult
): NewtonMeterDraft {
  if (draft.source === 'first') {
    return { ...draft, second: formatTorque(result.second) };
  }
  return { ...draft, first: formatTorque(result.first) };
}

export function NewtonMeterCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<NewtonMeterDraft>(() => {
    const initial = calculateNewtonMeter(DEFAULT_NEWTON_METER_INPUT);
    return syncDraftFromResult(inputToDraft(DEFAULT_NEWTON_METER_INPUT), initial);
  });
  const [errors, setErrors] = React.useState<NewtonMeterFieldErrors>({});
  const [result, setResult] = React.useState<NewtonMeterResult | null>(() =>
    calculateNewtonMeter(DEFAULT_NEWTON_METER_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: NewtonMeterDraft) => {
      if (
        next.first === draft.first &&
        next.second === draft.second &&
        next.source === draft.source &&
        next.firstUnit === draft.firstUnit &&
        next.secondUnit === draft.secondUnit &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateNewtonMeter(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateNewtonMeter(parsed);
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
            1 ft·lbf = {formatTorque(NEWTON_METERS_PER_FOOT_POUND)} N·m
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <NewtonMeterForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_NEWTON_METER_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <NewtonMeterResults
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
