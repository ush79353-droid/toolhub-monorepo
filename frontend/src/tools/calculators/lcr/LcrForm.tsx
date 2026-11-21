'use client';

import { useState, type ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { LcrFieldErrors, LcrInput, LcrResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface LcrFormProps {
  input: LcrInput;
  errors: LcrFieldErrors;
  result: LcrResult | null;
  onChange: (input: LcrInput) => void;
  onLoadExample: () => void;
  onLoadHqlaExample: () => void;
}

export function LcrForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
  onLoadHqlaExample,
}: LcrFormProps) {
  const [showHqla, setShowHqla] = useState(false);
  const [showFlows, setShowFlows] = useState(false);
  const set = (patch: Partial<LcrInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        LCR = HQLA ÷ Expected 30-day net cash outflows × 100. Educational
 estimate only; not a regulatory compliance determination. Fixed USD
        formatting.
      </p>

      <div className="flex flex-wrap gap-3 text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example ($1.75M / $1.5M → 116.67%)
        </button>
        <button
          type="button"
          onClick={onLoadHqlaExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load HQLA helper example
        </button>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setShowHqla((v) => !v)}
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-accent"
          aria-expanded={showHqla}
        >
          Calculate high-quality liquid assets
          <span className="text-xs font-normal text-muted-foreground">
            {showHqla ? 'Hide' : 'Show'}
          </span>
        </button>
        {showHqla ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Simplified haircuts: L1 at 100%, L2A 15%, Level 2B RMBS-style 25%,
              Level 2B corporate/equity-style 50%. Illustrative 15%/40%
              composition caps applied. Not a full regulatory HQLA stock.
            </p>
            {(
              [
                ['level1Assets', 'Level 1 assets', errors.level1Assets],
                ['level2AAssets', 'Level 2A assets', errors.level2AAssets],
                [
                  'level2B25Assets',
                  'Level 2B assets (25% haircut)',
                  errors.level2B25Assets,
                ],
                [
                  'level2B50Assets',
                  'Level 2B assets (50% haircut)',
                  errors.level2B50Assets,
                ],
              ] as const
            ).map(([key, label, err]) => (
              <div key={key}>
                <label htmlFor={`lcr-${key}`} className={labelClass}>
                  {label}
                </label>
                <FieldShell error={err}>
                  <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                    $
                  </span>
                  <input
                    id={`lcr-${key}`}
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input[key]}
                    onChange={(e) => set({ [key]: e.target.value })}
                    placeholder="0"
                  />
                </FieldShell>
                {err ? (
                  <p className="mt-1 text-xs text-rose-600">{err}</p>
                ) : null}
              </div>
            ))}
            {result?.hqlaHelper ? (
              <div className="rounded-lg bg-muted/20 px-3 py-2 text-xs text-accent">
                <p>
                  Preliminary (haircuts):{' '}
                  <span className="font-semibold tabular-nums">
                    {result.hqlaHelper.formattedPreliminary}
                  </span>
                </p>
                <p>
                  Estimated after illustrative caps:{' '}
                  <span className="font-semibold tabular-nums">
                    {result.hqlaHelper.formattedAfterCaps}
                  </span>
                </p>
                <p className="mt-1 text-muted-foreground">
                  {result.hqlaHelper.note}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setShowFlows((v) => !v)}
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-accent"
          aria-expanded={showFlows}
        >
          Optional: estimate net cash outflows
          <span className="text-xs font-normal text-muted-foreground">
            {showFlows ? 'Hide' : 'Show'}
          </span>
        </button>
        {showFlows ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <p className="text-xs text-muted-foreground">
              Net = Outflows − min(Inflows, 75% × Outflows). Caps/exceptions
              vary by regulation.
            </p>
            <div>
              <label htmlFor="lcr-tout" className={labelClass}>
                Expected total cash outflows
              </label>
              <FieldShell error={errors.totalCashOutflows}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  $
                </span>
                <input
                  id="lcr-tout"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.totalCashOutflows}
                  onChange={(e) => set({ totalCashOutflows: e.target.value })}
                />
              </FieldShell>
              {errors.totalCashOutflows ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.totalCashOutflows}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="lcr-tin" className={labelClass}>
                Expected total cash inflows
              </label>
              <FieldShell error={errors.totalCashInflows}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  $
                </span>
                <input
                  id="lcr-tin"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.totalCashInflows}
                  onChange={(e) => set({ totalCashInflows: e.target.value })}
                />
              </FieldShell>
              {errors.totalCashInflows ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.totalCashInflows}
                </p>
              ) : null}
            </div>
            {result?.netOutflowsHelper ? (
              <p className="text-xs text-accent">
                Estimated net outflows:{' '}
                <span className="font-semibold tabular-nums">
                  {result.netOutflowsHelper.formattedNet}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor="lcr-hqla" className={labelClass}>
          High-quality liquid assets
          <InfoTooltip
            label="HQLA"
            text="Eligible stock of high-quality liquid assets after applicable haircuts, composition caps, and adjustments. Leave blank to use the HQLA helper estimate when available."
          />
        </label>
        <FieldShell error={errors.highQualityLiquidAssets}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="lcr-hqla"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.highQualityLiquidAssets}
            onChange={(e) => set({ highQualityLiquidAssets: e.target.value })}
            placeholder="1,750,000"
          />
        </FieldShell>
        {errors.highQualityLiquidAssets ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.highQualityLiquidAssets}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="lcr-out" className={labelClass}>
          Expected 30-day net cash outflows
          <InfoTooltip
            label="Net outflows"
            text="Expected net cash outflows during the regulatory 30-calendar-day stress period. Must be greater than zero."
          />
        </label>
        <FieldShell error={errors.netCashOutflows30Days}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="lcr-out"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.netCashOutflows30Days}
            onChange={(e) => set({ netCashOutflows30Days: e.target.value })}
            placeholder="1,500,000"
          />
        </FieldShell>
        {errors.netCashOutflows30Days ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.netCashOutflows30Days}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="lcr-result" className={labelClass}>
          Liquidity coverage ratio (LCR)
        </label>
        <FieldShell muted>
          <input
            id="lcr-result"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold`}
            value={result?.formattedLcr ?? ''}
            placeholder="—"
          />
        </FieldShell>
      </div>
    </form>
  );
}
