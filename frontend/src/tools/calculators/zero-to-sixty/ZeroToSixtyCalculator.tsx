'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateZeroToSixty } from './calculation';
import {
  DEFAULT_ZERO_TO_SIXTY_INPUT,
  type ZeroToSixtyFieldErrors,
  type ZeroToSixtyInput,
  type ZeroToSixtyResult,
} from './types';
import { validateZeroToSixtyInput } from './validation';
import {
  ZeroToSixtyForm,
  draftToInput,
  inputToDraft,
  type ZeroToSixtyDraft,
} from './ZeroToSixtyForm';
import { ZeroToSixtyResults } from './ZeroToSixtyResults';

function buildZeroToSixtySummaryText(
  input: ZeroToSixtyInput,
  result: ZeroToSixtyResult
): string {
  if (!result.reachable) {
    return `0–60 Acceleration Calculator — Omega Calculators\nResult: Target speed unreachable (${result.reason})`;
  }

  return [
    '0–60 Acceleration Calculator — Omega Calculators',
    'https://omegacalculators.com/tools/0-60-calculator',
    '',
    `Estimated 0–60 mph Time: ${result.timeTo60Mph.toFixed(2)} seconds`,
    `Estimated 0–100 km/h Time: ${result.timeTo100Kmh.toFixed(2)} seconds`,
    `Estimated Wheel Power: ${result.wheelHorsepower} whp`,
    `Power-to-Weight Ratio: ${result.powerToWeightHpPerTon} hp/ton (${result.powerToWeightLbPerHp} lb/hp)`,
    `Distance to 60 mph: ${result.distanceTo60MphFeet} ft (${result.distanceTo60MphMeters} m)`,
    `Average 0–60 Acceleration: ${result.averageAcceleration60MphG} g (${result.averageAcceleration60MphMps2} m/s²)`,
    `Peak Launch Acceleration: ${result.peakAccelerationG} g`,
    '',
    'Modeled Vehicle Specifications:',
    `• Engine Power: ${input.enginePower} ${input.powerUnit}`,
    `• Vehicle Weight: ${input.vehicleWeight} ${input.weightUnit}`,
    `• Drivetrain: ${input.drivetrain.toUpperCase()}`,
    `• Transmission: ${input.transmission}`,
    `• Tires: ${input.tireCategory}`,
    `• Surface: ${input.roadSurface}`,
    `• Gradient: ${input.roadGradientPercent}%`,
  ].join('\n');
}

export function ZeroToSixtyCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<ZeroToSixtyDraft>(() =>
    inputToDraft(DEFAULT_ZERO_TO_SIXTY_INPUT)
  );
  const [errors, setErrors] = React.useState<ZeroToSixtyFieldErrors>({});
  const [result, setResult] = React.useState<ZeroToSixtyResult | null>(() =>
    calculateZeroToSixty(DEFAULT_ZERO_TO_SIXTY_INPUT)
  );
  const [copied, setCopied] = React.useState(false);

  const evaluateDraft = React.useCallback((nextDraft: ZeroToSixtyDraft) => {
    const parsed = draftToInput(nextDraft);
    const validation = validateZeroToSixtyInput(parsed);
    setErrors(validation.errors);
    if (validation.isValid) {
      setResult(calculateZeroToSixty(parsed));
    }
  }, []);

  const handleDraftChange = (patch: Partial<ZeroToSixtyDraft>) => {
    const nextDraft = { ...draft, ...patch };
    setDraft(nextDraft);
    evaluateDraft(nextDraft);
  };

  const handleSubmit = () => {
    evaluateDraft(draft);
  };

  const handleReset = () => {
    const freshDraft = inputToDraft(DEFAULT_ZERO_TO_SIXTY_INPUT);
    setDraft(freshDraft);
    setErrors({});
    setResult(calculateZeroToSixty(DEFAULT_ZERO_TO_SIXTY_INPUT));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const summary = buildZeroToSixtySummaryText(draftToInput(draft), result);
    const ok = await copyTextToClipboard(summary);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      {/* Calculator Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Physics simulation &amp; performance estimation
          </p>
        </div>

        {headerActions && (
          <div className="flex items-center justify-end gap-2">{headerActions}</div>
        )}
      </div>

      {/* Main Card Content */}
      <div className="space-y-6 p-4 sm:p-5">
        <ZeroToSixtyForm
          draft={draft}
          errors={errors}
          onChange={handleDraftChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />

        <ZeroToSixtyResults
          result={result}
          hasErrors={hasErrors}
          onCopy={handleCopy}
          copied={copied}
        />
      </div>
    </section>
  );
}

