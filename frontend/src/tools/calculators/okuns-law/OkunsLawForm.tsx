'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  OKUNS_LAW_MODE_OPTIONS,
  type OkunsLawFieldErrors,
  type OkunsLawInput,
  type OkunsLawMode,
  type OkunsLawResult,
} from './types';

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

interface OkunsLawFormProps {
  input: OkunsLawInput;
  errors: OkunsLawFieldErrors;
  result: OkunsLawResult | null;
  onChange: (input: OkunsLawInput) => void;
  onLoadExample: () => void;
}

export function OkunsLawForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: OkunsLawFormProps) {
  const set = (patch: Partial<OkunsLawInput>) =>
    onChange({ ...input, ...patch });
  const modeHelp =
    OKUNS_LAW_MODE_OPTIONS.find((o) => o.id === input.mode)?.short ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
 Empirical Okun relationships; not a universal law. Output-gap mode uses
        positive β in OutputGap = −β(u−u*). Growth modes use positive α in Δu =
        −α(g−g*). Do not mix coefficients across formulations.
      </p>

      <div>
        <label htmlFor="okun-mode" className={labelClass}>
          Calculation mode
        </label>
        <select
          id="okun-mode"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
          value={input.mode}
          onChange={(e) => set({ mode: e.target.value as OkunsLawMode })}
        >
          {OKUNS_LAW_MODE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-muted-foreground">{modeHelp}</p>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example for this mode
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {input.mode === 'output-gap' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <h3 className="text-sm font-semibold text-accent">Labor market</h3>
          <div>
            <label htmlFor="okun-u" className={labelClass}>
              Unemployment Rate (u)
              <InfoTooltip label="u" text="Actual unemployment rate (0–100%)." />
            </label>
            <FieldShell error={errors.unemploymentRate}>
              <input
                id="okun-u"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.unemploymentRate}
                onChange={(e) => set({ unemploymentRate: e.target.value })}
                placeholder="7"
              />
              <span className="pr-3 text-xs text-muted-foreground">%</span>
            </FieldShell>
            {errors.unemploymentRate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.unemploymentRate}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-ustar" className={labelClass}>
              Natural Rate of Unemployment (u*)
              <InfoTooltip
                label="u*"
                text="Unemployment rate consistent with sustainable activity under the selected model."
              />
            </label>
            <FieldShell error={errors.naturalUnemploymentRate}>
              <input
                id="okun-ustar"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.naturalUnemploymentRate}
                onChange={(e) =>
                  set({ naturalUnemploymentRate: e.target.value })
                }
                placeholder="5"
              />
              <span className="pr-3 text-xs text-muted-foreground">%</span>
            </FieldShell>
            {errors.naturalUnemploymentRate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.naturalUnemploymentRate}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-beta" className={labelClass}>
              Okun Coefficient (β, positive)
              <InfoTooltip
                label="β"
                text="Positive output-gap coefficient. Formula uses OutputGap = −β(u−u*). A screenshot value of −0.45 corresponds to β = 0.45."
              />
            </label>
            <FieldShell error={errors.outputGapCoefficient}>
              <input
                id="okun-beta"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.outputGapCoefficient}
                onChange={(e) =>
                  set({ outputGapCoefficient: e.target.value })
                }
                placeholder="2"
              />
            </FieldShell>
            {errors.outputGapCoefficient ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.outputGapCoefficient}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-og" className={labelClass}>
              Output Gap
            </label>
            <FieldShell muted>
              <input
                id="okun-og"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedOutputGap ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}

      {input.mode === 'unemployment-change' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <h3 className="text-sm font-semibold text-accent">Output / growth</h3>
          <div>
            <label htmlFor="okun-g" className={labelClass}>
              Actual Real GDP Growth Rate (g)
            </label>
            <FieldShell error={errors.actualGDPGrowthRate}>
              <input
                id="okun-g"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.actualGDPGrowthRate}
                onChange={(e) => set({ actualGDPGrowthRate: e.target.value })}
                placeholder="4.5"
              />
              <span className="pr-3 text-xs text-muted-foreground">%</span>
            </FieldShell>
            {errors.actualGDPGrowthRate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.actualGDPGrowthRate}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-gstar" className={labelClass}>
              Trend Real GDP Growth Rate (g*)
            </label>
            <FieldShell error={errors.trendGDPGrowthRate}>
              <input
                id="okun-gstar"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.trendGDPGrowthRate}
                onChange={(e) => set({ trendGDPGrowthRate: e.target.value })}
                placeholder="2.5"
              />
              <span className="pr-3 text-xs text-muted-foreground">%</span>
            </FieldShell>
            {errors.trendGDPGrowthRate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.trendGDPGrowthRate}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-alpha" className={labelClass}>
              Growth Okun Coefficient (α, positive)
              <InfoTooltip
                label="α"
                text="Positive growth-version coefficient. Δu = −α(g−g*). Not interchangeable with output-gap β."
              />
            </label>
            <FieldShell error={errors.growthCoefficient}>
              <input
                id="okun-alpha"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.growthCoefficient}
                onChange={(e) => set({ growthCoefficient: e.target.value })}
                placeholder="0.4"
              />
            </FieldShell>
            {errors.growthCoefficient ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.growthCoefficient}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-du" className={labelClass}>
              Change in Unemployment (Δu)
            </label>
            <FieldShell muted>
              <input
                id="okun-du"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedUnemploymentChange ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}

      {input.mode === 'required-gdp-growth' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <div>
            <label htmlFor="okun-du-in" className={labelClass}>
              Expected Change in Unemployment (Δu)
              <InfoTooltip
                label="Δu"
                text="Percentage points. Negative means unemployment falls."
              />
            </label>
            <FieldShell error={errors.unemploymentChange}>
              <input
                id="okun-du-in"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.unemploymentChange}
                onChange={(e) => set({ unemploymentChange: e.target.value })}
                placeholder="-1"
              />
              <span className="pr-3 text-xs text-muted-foreground">pp</span>
            </FieldShell>
            {errors.unemploymentChange ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.unemploymentChange}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-gstar2" className={labelClass}>
              Trend Real GDP Growth Rate (g*)
            </label>
            <FieldShell error={errors.trendGDPGrowthRate}>
              <input
                id="okun-gstar2"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.trendGDPGrowthRate}
                onChange={(e) => set({ trendGDPGrowthRate: e.target.value })}
                placeholder="2"
              />
              <span className="pr-3 text-xs text-muted-foreground">%</span>
            </FieldShell>
            {errors.trendGDPGrowthRate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.trendGDPGrowthRate}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-alpha2" className={labelClass}>
              Growth Okun Coefficient (α)
            </label>
            <FieldShell error={errors.growthCoefficient}>
              <input
                id="okun-alpha2"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.growthCoefficient}
                onChange={(e) => set({ growthCoefficient: e.target.value })}
                placeholder="0.5"
              />
            </FieldShell>
            {errors.growthCoefficient ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.growthCoefficient}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-req-g" className={labelClass}>
              Required Actual GDP Growth (g)
            </label>
            <FieldShell muted>
              <input
                id="okun-req-g"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedRequiredGrowth ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}

      {input.mode === 'gdp-growth-gap' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <div>
            <label htmlFor="okun-du3" className={labelClass}>
              Change in Unemployment (Δu)
            </label>
            <FieldShell error={errors.unemploymentChange}>
              <input
                id="okun-du3"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.unemploymentChange}
                onChange={(e) => set({ unemploymentChange: e.target.value })}
                placeholder="-0.8"
              />
              <span className="pr-3 text-xs text-muted-foreground">pp</span>
            </FieldShell>
            {errors.unemploymentChange ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.unemploymentChange}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-alpha3" className={labelClass}>
              Growth Okun Coefficient (α)
            </label>
            <FieldShell error={errors.growthCoefficient}>
              <input
                id="okun-alpha3"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.growthCoefficient}
                onChange={(e) => set({ growthCoefficient: e.target.value })}
                placeholder="0.4"
              />
            </FieldShell>
            {errors.growthCoefficient ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.growthCoefficient}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="okun-ggap" className={labelClass}>
              GDP Growth Gap (g − g*)
            </label>
            <FieldShell muted>
              <input
                id="okun-ggap"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedGrowthGap ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}
    </form>
  );
}
