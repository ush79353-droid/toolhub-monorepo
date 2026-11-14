'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateTorqueToHp, formatPowerNumber } from './calculation';
import {
  TorqueToHpForm,
  draftToInput,
  inputToDraft,
  type TorqueToHpDraft,
} from './TorqueToHpForm';
import { TorqueToHpResults } from './TorqueToHpResults';
import {
  DEFAULT_TORQUE_TO_HP_INPUT,
  EMPTY_TORQUE_TO_HP_INPUT,
  WATTS_PER_MECHANICAL_HP,
  type TorqueToHpFieldErrors,
  type TorqueToHpResult,
} from './types';
import { validateTorqueToHp } from './validation';

function summaryText(result: TorqueToHpResult): string {
  const hpLabel = result.hpUnit === 'PS' ? 'PS (metric)' : 'hp (mechanical)';
  return [
    'Torque to HP Calculator',
    'Omega Calculators',
    '',
    `Torque: ${formatPowerNumber(result.torqueDisplay)} (${formatPowerNumber(result.torqueNm)} N·m)`,
    `Speed: ${formatPowerNumber(result.speedDisplay)} (${formatPowerNumber(result.angularSpeedRadS)} rad/s)`,
    `Power: ${formatPowerNumber(result.powerDisplay)} ${result.powerUnit} (${formatPowerNumber(result.powerW)} W)`,
    `Horsepower: ${formatPowerNumber(result.horsepowerDisplay)} ${hpLabel}`,
    '',
    'Formula: Power = Torque × Angular Velocity',
  ].join('\n');
}

function syncDraftFromResult(
  draft: TorqueToHpDraft,
  result: TorqueToHpResult
): TorqueToHpDraft {
  const next = { ...draft };
  const kinds = new Set([draft.primary, draft.secondary]);

  if (!kinds.has('torque')) {
    next.torque = formatPowerNumber(result.torqueDisplay);
  }
  if (!kinds.has('speed')) {
    next.speed = formatPowerNumber(result.speedDisplay);
  }
  if (!kinds.has('power') || draft.powerVia !== 'power') {
    next.power = formatPowerNumber(result.powerDisplay);
  }
  if (!kinds.has('power') || draft.powerVia !== 'horsepower') {
    next.horsepower = formatPowerNumber(result.horsepowerDisplay);
  }
  // Always keep power and hp synchronized when the pair does not treat power as independent source of both
  if (!kinds.has('power')) {
    next.power = formatPowerNumber(result.powerDisplay);
    next.horsepower = formatPowerNumber(result.horsepowerDisplay);
  } else if (draft.powerVia === 'power') {
    next.horsepower = formatPowerNumber(result.horsepowerDisplay);
  } else {
    next.power = formatPowerNumber(result.powerDisplay);
  }

  return next;
}

export function TorqueToHpCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<TorqueToHpDraft>(() => {
    const initial = calculateTorqueToHp(DEFAULT_TORQUE_TO_HP_INPUT);
    return syncDraftFromResult(inputToDraft(DEFAULT_TORQUE_TO_HP_INPUT), initial);
  });
  const [errors, setErrors] = React.useState<TorqueToHpFieldErrors>({});
  const [result, setResult] = React.useState<TorqueToHpResult | null>(() =>
    calculateTorqueToHp(DEFAULT_TORQUE_TO_HP_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: TorqueToHpDraft) => {
    const parsed = draftToInput(next);
    const validation = validateTorqueToHp(parsed);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateTorqueToHp(parsed);
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
            P = τ × ω · 1 mech. hp = {formatPowerNumber(WATTS_PER_MECHANICAL_HP)} W
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <TorqueToHpForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_TORQUE_TO_HP_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <TorqueToHpResults
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
