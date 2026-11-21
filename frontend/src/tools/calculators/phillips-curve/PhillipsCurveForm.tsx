'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  NEW_CLASSICAL_TARGET_OPTIONS,
  NEW_KEYNESIAN_TARGET_OPTIONS,
  PHILLIPS_VERSION_OPTIONS,
  TRADITIONAL_TARGET_OPTIONS,
  type NewClassicalTarget,
  type NewKeynesianTarget,
  type PhillipsCurveInput,
  type PhillipsCurveResult,
  type PhillipsFieldErrors,
  type PhillipsVersion,
  type TraditionalTarget,
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

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-rose-600" role="alert">
      {msg}
    </p>
  );
}

interface Props {
  input: PhillipsCurveInput;
  errors: PhillipsFieldErrors;
  result: PhillipsCurveResult | null;
  onChange: (input: PhillipsCurveInput) => void;
  onLoadExample: () => void;
}

export function PhillipsCurveForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PhillipsCurveInput>) =>
    onChange({ ...input, ...patch });
  const versionHelp =
    PHILLIPS_VERSION_OPTIONS.find((o) => o.id === input.version)?.short ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Three educational Phillips Curve specifications. Coefficients are
 explicit; never silently reused across Traditional, New Classical, and
        New Keynesian modes.
      </p>

      <fieldset>
        <legend className={labelClass}>Phillips Curve version</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {PHILLIPS_VERSION_OPTIONS.map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                input.version === o.id
                  ? 'border-primary bg-primary/5 font-medium text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="phillips-version"
                value={o.id}
                checked={input.version === o.id}
                onChange={() => set({ version: o.id as PhillipsVersion })}
                className="accent-primary"
              />
              {o.label}
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">{versionHelp}</p>
      </fieldset>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example for this version
      </button>

      {errors.form ? <Err msg={errors.form} /> : null}

      {input.version === 'traditional' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <div>
            <label htmlFor="pc-trad-target" className={labelClass}>
              Calculate
            </label>
            <select
              id="pc-trad-target"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.traditionalTarget}
              onChange={(e) =>
                set({
                  traditionalTarget: e.target.value as TraditionalTarget,
                })
              }
            >
              {TRADITIONAL_TARGET_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {input.traditionalTarget !== 'wage-growth' ? (
            <div>
              <label htmlFor="pc-w" className={labelClass}>
                Money-wage growth (w)
              </label>
              <FieldShell error={errors.wageGrowth}>
                <input
                  id="pc-w"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.wageGrowth}
                  onChange={(e) => set({ wageGrowth: e.target.value })}
                  placeholder="3.5"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              <Err msg={errors.wageGrowth} />
            </div>
          ) : null}

          {input.traditionalTarget !== 'trend-wage-growth' ? (
            <div>
              <label htmlFor="pc-wt" className={labelClass}>
                Trend money-wage growth (w_T)
              </label>
              <FieldShell error={errors.trendWageGrowth}>
                <input
                  id="pc-wt"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.trendWageGrowth}
                  onChange={(e) => set({ trendWageGrowth: e.target.value })}
                  placeholder="4"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              <Err msg={errors.trendWageGrowth} />
            </div>
          ) : null}

          {input.traditionalTarget !== 'unemployment-change' ? (
            <div>
              <label htmlFor="pc-du" className={labelClass}>
                Change in unemployment (Δu)
                <InfoTooltip
                  label="Δu"
                  text="Change in unemployment in percentage points (not percent of the old rate)."
                />
              </label>
              <FieldShell error={errors.unemploymentChange}>
                <input
                  id="pc-du"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.unemploymentChange}
                  onChange={(e) =>
                    set({ unemploymentChange: e.target.value })
                  }
                  placeholder="1"
                />
                <span className="pr-3 text-xs text-muted-foreground">pp</span>
              </FieldShell>
              <Err msg={errors.unemploymentChange} />
            </div>
          ) : null}

          <div>
            <label htmlFor="pc-beta" className={labelClass}>
              Sensitivity (β, positive)
              <InfoTooltip
                label="β"
                text="Explicit positive sensitivity. Screenshot-style three-field demos often imply a fixed β; here it is editable and required."
              />
            </label>
            <FieldShell error={errors.traditionalSensitivity}>
              <input
                id="pc-beta"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.traditionalSensitivity}
                onChange={(e) =>
                  set({ traditionalSensitivity: e.target.value })
                }
                placeholder="0.5"
              />
            </FieldShell>
            <Err msg={errors.traditionalSensitivity} />
          </div>

          <div>
            <label className={labelClass}>Calculated result</label>
            <FieldShell muted>
              <input
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedPrimary ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}

      {input.version === 'new-classical' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <div>
            <label htmlFor="pc-nc-target" className={labelClass}>
              Calculate
            </label>
            <select
              id="pc-nc-target"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.newClassicalTarget}
              onChange={(e) =>
                set({
                  newClassicalTarget: e.target.value as NewClassicalTarget,
                })
              }
            >
              {NEW_CLASSICAL_TARGET_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {input.newClassicalTarget !== 'inflation' ? (
            <div>
              <label htmlFor="pc-pi" className={labelClass}>
                Actual inflation (π)
              </label>
              <FieldShell error={errors.inflation}>
                <input
                  id="pc-pi"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.inflation}
                  onChange={(e) => set({ inflation: e.target.value })}
                  placeholder="2.5"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              <Err msg={errors.inflation} />
            </div>
          ) : null}

          {input.newClassicalTarget !== 'expected-inflation' ? (
            <div>
              <label htmlFor="pc-pe" className={labelClass}>
                Expected inflation (πᵉ)
              </label>
              <FieldShell error={errors.expectedInflation}>
                <input
                  id="pc-pe"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.expectedInflation}
                  onChange={(e) => set({ expectedInflation: e.target.value })}
                  placeholder="3"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              <Err msg={errors.expectedInflation} />
            </div>
          ) : null}

          {input.newClassicalTarget !== 'unemployment' ? (
            <div>
              <label htmlFor="pc-u" className={labelClass}>
                Unemployment rate (u)
              </label>
              <FieldShell error={errors.unemploymentRate}>
                <input
                  id="pc-u"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.unemploymentRate}
                  onChange={(e) => set({ unemploymentRate: e.target.value })}
                  placeholder="6"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              <Err msg={errors.unemploymentRate} />
            </div>
          ) : null}

          {input.newClassicalTarget !== 'natural-unemployment' ? (
            <div>
              <label htmlFor="pc-un" className={labelClass}>
                Natural unemployment (uₙ)
                <InfoTooltip
                  label="uₙ"
                  text="Benchmark unemployment consistent with the chosen expectations-augmented model."
                />
              </label>
              <FieldShell error={errors.naturalUnemploymentRate}>
                <input
                  id="pc-un"
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
              <Err msg={errors.naturalUnemploymentRate} />
            </div>
          ) : null}

          <div>
            <label htmlFor="pc-alpha" className={labelClass}>
              Slope coefficient (α, positive)
            </label>
            <FieldShell error={errors.classicalSlope}>
              <input
                id="pc-alpha"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.classicalSlope}
                onChange={(e) => set({ classicalSlope: e.target.value })}
                placeholder="0.5"
              />
            </FieldShell>
            <Err msg={errors.classicalSlope} />
          </div>

          {input.newClassicalTarget !== 'supply-shock' ? (
            <div>
              <label htmlFor="pc-s" className={labelClass}>
                Supply shock (s)
                <InfoTooltip
                  label="s"
                  text="Optional supply/cost shock in percentage points. Use 0 when assuming no shock."
                />
              </label>
              <FieldShell error={errors.supplyShock}>
                <input
                  id="pc-s"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.supplyShock}
                  onChange={(e) => set({ supplyShock: e.target.value })}
                  placeholder="0"
                />
                <span className="pr-3 text-xs text-muted-foreground">pp</span>
              </FieldShell>
              <Err msg={errors.supplyShock} />
            </div>
          ) : null}

          <div>
            <label className={labelClass}>Calculated result</label>
            <FieldShell muted>
              <input
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedPrimary ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}

      {input.version === 'new-keynesian' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <div>
            <label htmlFor="pc-nk-target" className={labelClass}>
              Calculate
            </label>
            <select
              id="pc-nk-target"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.newKeynesianTarget}
              onChange={(e) =>
                set({
                  newKeynesianTarget: e.target.value as NewKeynesianTarget,
                })
              }
            >
              {NEW_KEYNESIAN_TARGET_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {input.newKeynesianTarget !== 'inflation' ? (
            <div>
              <label htmlFor="pc-nk-pi" className={labelClass}>
                Current inflation (πₜ)
              </label>
              <FieldShell error={errors.nkInflation}>
                <input
                  id="pc-nk-pi"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.nkInflation}
                  onChange={(e) => set({ nkInflation: e.target.value })}
                  placeholder="3.97"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              <Err msg={errors.nkInflation} />
            </div>
          ) : null}

          {input.newKeynesianTarget !== 'expected-inflation' ? (
            <div>
              <label htmlFor="pc-nk-pe" className={labelClass}>
                Expected next-period inflation
              </label>
              <FieldShell error={errors.nkExpectedInflation}>
                <input
                  id="pc-nk-pe"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.nkExpectedInflation}
                  onChange={(e) =>
                    set({ nkExpectedInflation: e.target.value })
                  }
                  placeholder="3"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              <Err msg={errors.nkExpectedInflation} />
            </div>
          ) : null}

          <div>
            <label htmlFor="pc-disc" className={labelClass}>
              Discount factor (β)
              <InfoTooltip
                label="β"
                text="Standard model uses 0 &lt; β ≤ 1. Separate from Traditional sensitivity β."
              />
            </label>
            <FieldShell error={errors.discountFactor}>
              <input
                id="pc-disc"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.discountFactor}
                onChange={(e) => set({ discountFactor: e.target.value })}
                placeholder="0.99"
              />
            </FieldShell>
            <Err msg={errors.discountFactor} />
          </div>

          {input.newKeynesianTarget !== 'output-gap' ? (
            <div>
              <label htmlFor="pc-x" className={labelClass}>
                Output gap (xₜ)
              </label>
              <FieldShell error={errors.outputGap}>
                <input
                  id="pc-x"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.outputGap}
                  onChange={(e) => set({ outputGap: e.target.value })}
                  placeholder="2"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              <Err msg={errors.outputGap} />
            </div>
          ) : null}

          <div>
            <label htmlFor="pc-kappa" className={labelClass}>
              Slope (κ, positive)
            </label>
            <FieldShell error={errors.nkSlope}>
              <input
                id="pc-kappa"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.nkSlope}
                onChange={(e) => set({ nkSlope: e.target.value })}
                placeholder="0.25"
              />
            </FieldShell>
            <Err msg={errors.nkSlope} />
          </div>

          {input.newKeynesianTarget !== 'cost-push' ? (
            <div>
              <label htmlFor="pc-st" className={labelClass}>
                Cost-push shock (sₜ)
              </label>
              <FieldShell error={errors.costPushShock}>
                <input
                  id="pc-st"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.costPushShock}
                  onChange={(e) => set({ costPushShock: e.target.value })}
                  placeholder="0.5"
                />
                <span className="pr-3 text-xs text-muted-foreground">pp</span>
              </FieldShell>
              <Err msg={errors.costPushShock} />
            </div>
          ) : null}

          <div>
            <label className={labelClass}>Calculated result</label>
            <FieldShell muted>
              <input
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedPrimary ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}
    </form>
  );
}
