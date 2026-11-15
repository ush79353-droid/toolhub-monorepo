'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SortinoAssetDraft,
  SortinoAssetResult,
  SortinoRatioFieldErrors,
  SortinoRatioInput,
  SortinoRatioResult,
} from './types';

interface SortinoRatioFormProps {
  input: SortinoRatioInput;
  errors: SortinoRatioFieldErrors;
  result: SortinoRatioResult | null;
  onChange: (input: SortinoRatioInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor?: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

function AssetSection({
  n,
  open,
  onToggle,
  asset,
  result,
  averageError,
  downsideError,
  onChange,
}: {
  n: 1 | 2;
  open: boolean;
  onToggle: () => void;
  asset: SortinoAssetDraft;
  result: SortinoAssetResult | null;
  averageError?: string;
  downsideError?: string;
  onChange: (patch: Partial<SortinoAssetDraft>) => void;
}) {
  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        Asset #{n}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4">
          <div>
            <FieldLabel
              htmlFor={`sr-ra-${n}`}
              label={`Average return on asset #${n} (Ra)`}
              tip="Average asset return as a percent. Zero and negatives are allowed."
            />
            <div className="relative">
              <input
                id={`sr-ra-${n}`}
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={asset.averageReturn}
                aria-invalid={Boolean(averageError)}
                onChange={(e) => onChange({ averageReturn: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            </div>
            {averageError ? (
              <p className="mt-1 text-xs text-rose-600">{averageError}</p>
            ) : null}
          </div>

          <div>
            <FieldLabel
              htmlFor={`sr-dd-${n}`}
              label={`Standard deviation of the downside #${n}`}
              tip="Downside deviation in percentage points (same scale as the return %). Must be greater than zero."
            />
            <input
              id={`sr-dd-${n}`}
              className={inputClass}
              inputMode="decimal"
              value={asset.downsideDeviation}
              aria-invalid={Boolean(downsideError)}
              onChange={(e) => onChange({ downsideDeviation: e.target.value })}
            />
            {downsideError ? (
              <p className="mt-1 text-xs text-rose-600">{downsideError}</p>
            ) : null}
          </div>

          <div>
            <FieldLabel
              htmlFor={`sr-result-${n}`}
              label={`Sortino ratio #${n}`}
              tip="(Ra − Rf) ÷ downside deviation. Unitless — not a percent."
            />
            <input
              id={`sr-result-${n}`}
              type="text"
              readOnly
              className={`${inputClass} bg-muted/20 font-semibold text-accent`}
              value={result ? result.formattedSortinoRatio : ''}
              aria-live="polite"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SortinoRatioForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: SortinoRatioFormProps) {
  const [asset1Open, setAsset1Open] = React.useState(true);
  const [asset2Open, setAsset2Open] = React.useState(false);

  const set = (patch: Partial<SortinoRatioInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="sr-rf"
          label="Risk free rate (Rf)"
          tip="Shared risk-free rate (%) used for both assets."
        />
        <div className="relative">
          <input
            id="sr-rf"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.riskFreeRate}
            aria-invalid={Boolean(errors.riskFreeRate)}
            onChange={(e) => set({ riskFreeRate: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
        {errors.riskFreeRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.riskFreeRate}</p>
        ) : null}
      </div>

      <AssetSection
        n={1}
        open={asset1Open}
        onToggle={() => setAsset1Open((o) => !o)}
        asset={input.asset1}
        result={result?.asset1 ?? null}
        averageError={errors.asset1AverageReturn}
        downsideError={errors.asset1DownsideDeviation}
        onChange={(patch) => set({ asset1: { ...input.asset1, ...patch } })}
      />

      <AssetSection
        n={2}
        open={asset2Open}
        onToggle={() => setAsset2Open((o) => !o)}
        asset={input.asset2}
        result={result?.asset2 ?? null}
        averageError={errors.asset2AverageReturn}
        downsideError={errors.asset2DownsideDeviation}
        onChange={(patch) => set({ asset2: { ...input.asset2, ...patch } })}
      />

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
