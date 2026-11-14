'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { ParkingRatioForm } from './ParkingRatioForm';
import { ParkingRatioResults } from './ParkingRatioResults';
import { calculateParkingRatio, convertAreaString } from './calculation';
import {
  AREA_UNIT_OPTIONS,
  DEFAULT_INPUT,
  type ParkingAreaUnit,
  type ParkingRatioFieldErrors,
  type ParkingRatioInput,
  type ParkingRatioResult,
} from './types';
import { validateParkingRatioInput } from './validation';

export function ParkingRatioCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<ParkingRatioInput>(DEFAULT_INPUT);
  const [errors, setErrors] = React.useState<ParkingRatioFieldErrors>({});
  const [result, setResult] = React.useState<ParkingRatioResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: ParkingRatioInput) => {
    const validation = validateParkingRatioInput(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.parsedValues) {
      setResult(
        calculateParkingRatio(
          validation.parsedValues.rentableArea,
          validation.parsedValues.parkingSpots,
          next.areaUnit
        )
      );
    } else {
      setResult(null);
    }
  };

  const handleInputChange = (field: 'rentableArea' | 'parkingSpots', value: string) => {
    const next = { ...input, [field]: value };
    setInput(next);
    run(next);
  };

  const handleUnitChange = (unit: ParkingAreaUnit) => {
    const next: ParkingRatioInput = {
      ...input,
      areaUnit: unit,
      rentableArea: convertAreaString(input.rentableArea, input.areaUnit, unit),
    };
    setInput(next);
    run(next);
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setErrors({});
    setResult(null);
  };

  const unitLabel =
    AREA_UNIT_OPTIONS.find((o) => o.value === input.areaUnit)?.label ?? input.areaUnit;

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Rentable area: ${input.rentableArea} ${unitLabel}`,
        `Parking spots: ${input.parkingSpots}`,
        `Parking ratio: ${result.formattedRatio} : 1000`,
      ].join('\n')
    : '';

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
            Parking ratio = (spots ÷ area) × 1000
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <ParkingRatioForm
          input={input}
          errors={errors}
          result={result}
          onInputChange={handleInputChange}
          onUnitChange={handleUnitChange}
          onReset={handleReset}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
        <ParkingRatioResults />
      </div>
    </section>
  );
}
