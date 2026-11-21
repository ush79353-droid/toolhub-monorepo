'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  TaxEquivalentYieldFieldErrors,
  TaxEquivalentYieldInput,
  TaxEquivalentYieldResult,
  TaxEquivalentYieldSolveTarget,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

const SOLVE_LABELS: Record<TaxEquivalentYieldSolveTarget, string> = {
  taxableEquivalentYield: 'Taxable equivalent yield',
  taxExemptYield: 'Tax-exempt bond yield',
  impliedTaxRate: 'Implied marginal tax rate',
};

interface TaxEquivalentYieldFormProps {
  input: TaxEquivalentYieldInput;
  errors: TaxEquivalentYieldFieldErrors;
  result: TaxEquivalentYieldResult | null;
  onChange: (input: TaxEquivalentYieldInput) => void;
  onLoadExample: () => void;
}

export function TaxEquivalentYieldForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: TaxEquivalentYieldFormProps) {
  const set = (patch: Partial<TaxEquivalentYieldInput>) =>
    onChange({ ...input, ...patch });
  const solving = input.solveTarget;

  const bondDisplay =
    solving === 'taxExemptYield'
      ? (result?.formattedBondYield.replace(/%$/, '') ?? '')
      : input.bondYieldPercent;
  const taxDisplay =
    solving === 'impliedTaxRate'
      ? (result?.formattedTaxRate.replace(/%$/, '') ?? '')
      : input.marginalTaxRatePercent;
  const teyDisplay =
    solving === 'taxableEquivalentYield'
      ? (result?.formattedTey.replace(/%$/, '') ?? '')
      : input.taxableEquivalentYieldPercent;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Taxable equivalent yield = tax-exempt yield ÷ (1 − marginal tax rate).
        Enter percentages (6 means 6%, not 600%). The marginal rate is not the
        same as an average or effective tax rate.
      </p>

      <div>
        <label htmlFor="tey-solve" className={labelClass}>
          Solve for
        </label>
        <select
          id="tey-solve"
          className={selectClass}
          value={input.solveTarget}
          onChange={(e) =>
            set({
              solveTarget: e.target.value as TaxEquivalentYieldSolveTarget,
            })
          }
        >
          {(
            Object.keys(SOLVE_LABELS) as TaxEquivalentYieldSolveTarget[]
          ).map((t) => (
            <option key={t} value={t}>
              {SOLVE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (6% tax-exempt · 30% tax → 8.57% TEY)
      </button>

      <div>
        <label htmlFor="tey-bond" className={labelClass}>
          Bond Yield
          <InfoTooltip
            label="Bond Yield"
            text="The annual yield of the tax-exempt bond or investment, expressed as a percentage. For a valid comparison, use a yield measure consistent with the taxable investment being evaluated."
          />
        </label>
        <FieldShell
          error={errors.bondYieldPercent}
          muted={solving === 'taxExemptYield'}
        >
          <input
            id="tey-bond"
            className={inputClass}
            inputMode="decimal"
            value={bondDisplay}
            readOnly={solving === 'taxExemptYield'}
            aria-readonly={solving === 'taxExemptYield'}
            onChange={(e) => set({ bondYieldPercent: e.target.value })}
            placeholder="6"
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.bondYieldPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.bondYieldPercent}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="tey-tax" className={labelClass}>
          Marginal Tax Rate
          <InfoTooltip
            label="Marginal Tax Rate"
            text="The marginal income tax rate applicable to the taxable investment's interest income. This is the rate used to estimate the tax reduction in the investment's return; not necessarily your average or effective tax rate."
          />
        </label>
        <FieldShell
          error={errors.marginalTaxRatePercent}
          muted={solving === 'impliedTaxRate'}
        >
          <input
            id="tey-tax"
            className={inputClass}
            inputMode="decimal"
            value={taxDisplay}
            readOnly={solving === 'impliedTaxRate'}
            aria-readonly={solving === 'impliedTaxRate'}
            onChange={(e) => set({ marginalTaxRatePercent: e.target.value })}
            placeholder="30"
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.marginalTaxRatePercent ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.marginalTaxRatePercent}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="tey-out" className={labelClass}>
          Taxable Equivalent Yield
          <InfoTooltip
            label="Taxable Equivalent Yield"
            text="The annual yield a fully taxable investment would need to earn to match the after-tax yield of the tax-exempt investment, assuming the specified tax rate applies."
          />
        </label>
        <FieldShell
          error={errors.taxableEquivalentYieldPercent}
          muted={solving === 'taxableEquivalentYield'}
        >
          <input
            id="tey-out"
            className={inputClass}
            inputMode="decimal"
            value={teyDisplay}
            readOnly={solving === 'taxableEquivalentYield'}
            aria-readonly={solving === 'taxableEquivalentYield'}
            onChange={(e) =>
              set({ taxableEquivalentYieldPercent: e.target.value })
            }
            placeholder="8.57"
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.taxableEquivalentYieldPercent ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.taxableEquivalentYieldPercent}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/10 p-3 space-y-3">
        <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showComparison}
            onChange={(e) => set({ showComparison: e.target.checked })}
          />
          Compare a taxable investment yield (optional)
        </label>
        {input.showComparison ? (
          <div>
            <label htmlFor="tey-taxable-y" className={labelClass}>
              Taxable Investment Yield
              <InfoTooltip
                label="Taxable Investment Yield"
                text="A fully taxable investment's quoted yield used only for the optional after-tax comparison. After-tax yield = taxable yield × (1 − t)."
              />
            </label>
            <FieldShell error={errors.taxableInvestmentYieldPercent}>
              <input
                id="tey-taxable-y"
                className={inputClass}
                inputMode="decimal"
                value={input.taxableInvestmentYieldPercent}
                onChange={(e) =>
                  set({ taxableInvestmentYieldPercent: e.target.value })
                }
                placeholder="7.5"
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.taxableInvestmentYieldPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.taxableInvestmentYieldPercent}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
