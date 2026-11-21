'use client';

import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { BodyFatResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const outputClass =
  'flex h-11 items-center justify-between rounded-lg border border-border bg-muted/25 px-3 text-sm tabular-nums text-accent';

interface BodyFatResultsProps {
  result: BodyFatResult | null;
  detailsOpen: boolean;
  onDetailsOpenChange: (open: boolean) => void;
}

export function BodyFatResults({
  result,
  detailsOpen,
  onDetailsOpenChange,
}: BodyFatResultsProps) {
  return (
    <div className="space-y-3">
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Body fat results
        </legend>

        <div>
          <p className={labelClass}>Estimated body fat</p>
          <div className={outputClass} aria-live="polite">
            <span>
              {result ? result.formattedBodyFatPercent : '—'}
            </span>
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </div>

        <div>
          <p className={labelClass}>
            Body fat weight
            <InfoTooltip text="Fat mass = body weight × (body fat % ÷ 100), using your entered weight after unit conversion to kilograms." />
          </p>
          <div className={outputClass} aria-live="polite">
            <span>{result ? result.formattedFatMassKg : '—'}</span>
            <span className="text-xs text-muted-foreground">kg</span>
          </div>
        </div>

        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.methodLabel}. {result.sourceNote}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter age, height, and weight to estimate body fat. Navy method also
            needs neck, waist, and (for women) hip.
          </p>
        )}
      </fieldset>

      <div className="rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={detailsOpen}
          onClick={() => onDetailsOpenChange(!detailsOpen)}
        >
          BMI and lean body mass
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              detailsOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {detailsOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">
            <div>
              <p className={labelClass}>BMI</p>
              <div className={outputClass}>
                <span>{result ? result.formattedBmi : '—'}</span>
                <span className="text-xs text-muted-foreground">kg/m²</span>
              </div>
            </div>
            <div>
              <p className={labelClass}>Lean body mass</p>
              <div className={outputClass}>
                <span>{result ? result.formattedLeanMassKg : '—'}</span>
                <span className="text-xs text-muted-foreground">kg</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Lean mass = weight − fat mass. BMI = weight(kg) ÷ height(m)².
            </p>
          </div>
        ) : null}
      </div>

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.disclaimer}
        </p>
      ) : null}
    </div>
  );
}
