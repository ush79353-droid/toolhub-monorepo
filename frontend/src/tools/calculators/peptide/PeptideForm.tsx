'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { MassUnit, PeptideFieldErrors, PeptideInput, PeptideResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

interface Props {
  input: PeptideInput;
  errors: PeptideFieldErrors;
  result: PeptideResult | null;
  onChange: (input: PeptideInput) => void;
}

export function PeptideForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<PeptideInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <div>
        <label className={labelClass} htmlFor="pep-vial">
          Vial capacity
          <InfoTooltip text="Labeled peptide mass in the vial (already prescribed product)." />
        </label>
        <div
          className={`flex h-11 items-center rounded-lg border ${
            errors.vialMassText ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="pep-vial"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.vialMassText}
            onChange={(e) => set({ vialMassText: e.target.value })}
          />
          <select
            className={unitSelectClass}
            value={input.vialMassUnit}
            onChange={(e) => set({ vialMassUnit: e.target.value as MassUnit })}
            aria-label="Vial mass unit"
          >
            <option value="mg">mg</option>
            <option value="mcg">mcg</option>
          </select>
        </div>
        {errors.vialMassText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.vialMassText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pep-diluent">
          Bacteriostatic water
          <InfoTooltip text="Final diluent volume used for concentration = mass ÷ volume." />
        </label>
        <div
          className={`flex h-11 items-center rounded-lg border ${
            errors.diluentMlText ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="pep-diluent"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.diluentMlText}
            onChange={(e) => set({ diluentMlText: e.target.value })}
          />
          <span className={unitFixed}>ml</span>
        </div>
        {errors.diluentMlText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.diluentMlText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pep-dose">
          Dose
          <InfoTooltip text="Prescribed dose mass for this draw (mcg or mg)." />
        </label>
        <div
          className={`flex h-11 items-center rounded-lg border ${
            errors.doseText ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="pep-dose"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.doseText}
            onChange={(e) => set({ doseText: e.target.value })}
          />
          <select
            className={unitSelectClass}
            value={input.doseUnit}
            onChange={(e) => set({ doseUnit: e.target.value as MassUnit })}
            aria-label="Dose unit"
          >
            <option value="mcg">mcg</option>
            <option value="mg">mg</option>
          </select>
        </div>
        {errors.doseText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.doseText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pep-scale">
          Syringe scale
          <InfoTooltip text="Explicit marks per mL on the syringe barrel (e.g. 100 for a U-100 insulin syringe). Never treat “units” as peptide activity." />
        </label>
        <div
          className={`flex h-11 items-center rounded-lg border ${
            errors.syringeUnitsPerMlText ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="pep-scale"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.syringeUnitsPerMlText}
            onChange={(e) => set({ syringeUnitsPerMlText: e.target.value })}
          />
          <span className={unitFixed}>marks/ml</span>
        </div>
        {errors.syringeUnitsPerMlText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.syringeUnitsPerMlText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pep-out">
          Pull the syringe to…
        </label>
        <div className="flex h-11 items-center rounded-lg border border-sky-200 bg-sky-50/60">
          <input
            id="pep-out"
            readOnly
            className={`${inputClass} text-muted-foreground`}
            value={result?.formattedUnits ?? ''}
            aria-live="polite"
          />
          <span className={unitFixed}>units</span>
        </div>
        {result?.statusDetail ? (
          <p className="mt-2 text-xs text-muted-foreground">{result.statusDetail}</p>
        ) : null}
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-2.5 text-left text-sm font-medium text-accent"
        onClick={() => set({ showTotalAmount: !input.showTotalAmount })}
        aria-expanded={input.showTotalAmount}
      >
        Total amount of peptide
        <span className="text-primary">{input.showTotalAmount ? '▾' : '▸'}</span>
      </button>
      {input.showTotalAmount && result?.concentrationMcgPerMl != null ? (
        <div className="space-y-1 rounded-lg border border-border bg-muted/15 p-3 text-xs text-muted-foreground">
          <p>Vial mass: {result.formattedConcentration ? `${result.vialMassMcg} mcg` : '—'}</p>
          <p>Concentration: {result.formattedConcentration} mcg/mL</p>
          <p>Draw volume: {result.formattedDrawMl} mL</p>
        </div>
      ) : null}
    </form>
  );
}
