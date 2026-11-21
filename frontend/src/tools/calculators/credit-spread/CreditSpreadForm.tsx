'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CreditSpreadFieldErrors,
  CreditSpreadInput,
  CreditSpreadResult,
  CreditSpreadSolveTarget,
  SpreadInputUnit,
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

const SOLVE_LABELS: Record<CreditSpreadSolveTarget, string> = {
  spread: 'Credit spread',
  corporateYield: 'Corporate bond yield',
  governmentYield: 'Government bond yield',
};

interface CreditSpreadFormProps {
  input: CreditSpreadInput;
  errors: CreditSpreadFieldErrors;
  result: CreditSpreadResult | null;
  onChange: (input: CreditSpreadInput) => void;
  onLoadExample: () => void;
}

export function CreditSpreadForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: CreditSpreadFormProps) {
  const set = (patch: Partial<CreditSpreadInput>) =>
    onChange({ ...input, ...patch });
  const solving = (t: CreditSpreadSolveTarget) => input.solveTarget === t;

  const corpDisplay = solving('corporateYield')
    ? (result?.formattedCorporateYield.replace(/%$/, '') ?? '')
    : input.corporateBondYield;
  const govDisplay = solving('governmentYield')
    ? (result?.formattedGovernmentYield.replace(/%$/, '') ?? '')
    : input.governmentBondYield;
  const spreadDisplay = solving('spread')
    ? result
      ? input.spreadInputUnit === 'basisPoints'
        ? String(result.spreadBasisPoints)
        : String(result.spreadPercentagePoints)
      : ''
    : input.creditSpread;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Credit spread = corporate yield − government yield (percentage points).
        One percentage point = 100 basis points. Prefer comparable yield-to-maturity
        figures with similar maturity and the same currency — this is not OAS,
        Z-spread, or CDS spread.
      </p>

      <div>
        <label htmlFor="cs-solve" className={labelClass}>
          Solve for
        </label>
        <select
          id="cs-solve"
          className={selectClass}
          value={input.solveTarget}
          onChange={(e) =>
            set({
              solveTarget: e.target.value as CreditSpreadSolveTarget,
            })
          }
        >
          {(Object.keys(SOLVE_LABELS) as CreditSpreadSolveTarget[]).map(
            (t) => (
              <option key={t} value={t}>
                {SOLVE_LABELS[t]}
              </option>
            ),
          )}
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (5.30% − 1.80% → 350 bps)
      </button>

      <div>
        <label htmlFor="cs-corp" className={labelClass}>
          Corporate Bond Yield
          <InfoTooltip
            label="Corporate Bond Yield"
            text="The yield of the corporate bond being analyzed. For a meaningful comparison, use the same type of yield measure as the government bond, such as yield to maturity."
          />
        </label>
        <FieldShell
          error={errors.corporateBondYield}
          muted={solving('corporateYield')}
        >
          <input
            id="cs-corp"
            className={inputClass}
            inputMode="decimal"
            value={corpDisplay}
            readOnly={solving('corporateYield')}
            aria-readonly={solving('corporateYield')}
            onChange={(e) => set({ corporateBondYield: e.target.value })}
            placeholder="5.30"
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.corporateBondYield ? (
          <p className="mt-1 text-xs text-rose-600">{errors.corporateBondYield}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cs-gov" className={labelClass}>
          Government Bond Yield
          <InfoTooltip
            label="Government Bond Yield"
            text="The yield of a government bond used as the benchmark. Ideally, choose a benchmark with a similar maturity, currency, and yield convention. Government yields are not automatically risk-free in every jurisdiction."
          />
        </label>
        <FieldShell
          error={errors.governmentBondYield}
          muted={solving('governmentYield')}
        >
          <input
            id="cs-gov"
            className={inputClass}
            inputMode="decimal"
            value={govDisplay}
            readOnly={solving('governmentYield')}
            aria-readonly={solving('governmentYield')}
            onChange={(e) => set({ governmentBondYield: e.target.value })}
            placeholder="1.80"
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.governmentBondYield ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.governmentBondYield}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cs-spread" className={labelClass}>
          Credit Spread
          <InfoTooltip
            label="Credit Spread"
            text="Absolute difference between corporate and government yields in percentage points or basis points (1 pp = 100 bps). Not a relative percentage increase."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.creditSpread} muted={solving('spread')}>
            <input
              id="cs-spread"
              className={inputClass}
              inputMode="decimal"
              value={spreadDisplay}
              readOnly={solving('spread')}
              aria-readonly={solving('spread')}
              onChange={(e) => set({ creditSpread: e.target.value })}
              placeholder={
                input.spreadInputUnit === 'basisPoints' ? '350' : '3.50'
              }
            />
          </FieldShell>
          <select
            id="cs-spread-unit"
            className={`${selectClass} w-[9.5rem] shrink-0`}
            value={input.spreadInputUnit}
            aria-label="Credit spread unit"
            onChange={(e) => {
              const next = e.target.value as SpreadInputUnit;
              // Keep the financial value when switching units on an editable spread.
              if (!solving('spread') && input.creditSpread.trim() !== '') {
                const raw = Number(input.creditSpread.trim().replace(/,/g, ''));
                if (Number.isFinite(raw) && next !== input.spreadInputUnit) {
                  const asPp =
                    input.spreadInputUnit === 'basisPoints' ? raw / 100 : raw;
                  const display =
                    next === 'basisPoints' ? asPp * 100 : asPp;
                  set({
                    spreadInputUnit: next,
                    creditSpread: String(display),
                  });
                  return;
                }
              }
              set({ spreadInputUnit: next });
            }}
          >
            <option value="basisPoints">bps</option>
            <option value="percentagePoints">pp</option>
          </select>
        </div>
        {errors.creditSpread ? (
          <p className="mt-1 text-xs text-rose-600">{errors.creditSpread}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
