'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatMillion,
  mlnPerMlToConcentrationUnit,
  mlToVolumeUnit,
} from './calculation';
import type {
  ConcentrationUnit,
  SpermAnalysisFieldErrors,
  SpermAnalysisInput,
  SpermAnalysisResult,
  VolumeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-r-lg border-l border-border bg-muted/30 px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';
const readOnlyClass =
  'h-11 w-full min-w-0 bg-muted/20 px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: SpermAnalysisInput;
  errors: SpermAnalysisFieldErrors;
  result: SpermAnalysisResult | null;
  onChange: (input: SpermAnalysisInput) => void;
}

export function SpermAnalysisForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<SpermAnalysisInput>) =>
    onChange({ ...input, ...patch });

  const switchVolume = (unit: VolumeUnit) => {
    const n = Number(input.volumeText.trim().replace(/,/g, ''));
    if (Number.isFinite(n) && input.volumeText.trim() !== '') {
      const ml = input.volumeUnit === 'uL' ? n / 1000 : n;
      const next = mlToVolumeUnit(ml, unit);
      set({
        volumeUnit: unit,
        volumeText: String(Number(next.toPrecision(12))),
      });
    } else {
      set({ volumeUnit: unit });
    }
  };

  const switchConcentration = (unit: ConcentrationUnit) => {
    const n = Number(input.concentrationText.trim().replace(/,/g, ''));
    if (Number.isFinite(n) && input.concentrationText.trim() !== '') {
      const mlnPerMl =
        input.concentrationUnit === 'mln_per_uL' ? n * 1000 : n;
      const next = mlnPerMlToConcentrationUnit(mlnPerMl, unit);
      set({
        concentrationUnit: unit,
        concentrationText: String(Number(next.toPrecision(12))),
      });
    } else {
      set({ concentrationUnit: unit });
    }
  };

  const totalDisplay =
    result?.totalSpermMillion != null
      ? formatMillion(result.totalSpermMillion)
      : '';
  const functionalDisplay =
    result?.functionalSpermMillion != null
      ? formatMillion(result.functionalSpermMillion)
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent">
        <p className="font-semibold text-amber-950">
          Educational semen worksheet — not a fertility diagnosis
        </p>
        <p className="mt-1.5 text-foreground/85">
          Values stay in your browser. Share uses the page URL only. Functional
          sperm is a product-based estimate; percentages do not measure true
          overlap of living, motile, and normally shaped sperm.
        </p>
      </div>

      <section className={sectionClass} aria-label="Sperm analysis inputs">
        <div>
          <label className={labelClass} htmlFor="sa-volume">
            Ejaculate volume
            <InfoTooltip text="Semen volume of the sample. Converted to mL before multiplying by concentration." />
          </label>
          <FieldShell error={errors.volumeText}>
            <input
              id="sa-volume"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.volumeText}
              onChange={(e) => set({ volumeText: e.target.value })}
            />
            <select
              aria-label="Volume unit"
              className={selectClass}
              value={input.volumeUnit}
              onChange={(e) => switchVolume(e.target.value as VolumeUnit)}
            >
              <option value="mL">mL</option>
              <option value="uL">µL</option>
            </select>
          </FieldShell>
          {errors.volumeText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.volumeText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sa-conc">
            Sperm concentration
            <InfoTooltip text="Sperm density. mln/mL means millions per milliliter; mln/µL is converted to mln/mL (×1000)." />
          </label>
          <FieldShell error={errors.concentrationText}>
            <input
              id="sa-conc"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.concentrationText}
              onChange={(e) => set({ concentrationText: e.target.value })}
            />
            <select
              aria-label="Concentration unit"
              className={selectClass}
              value={input.concentrationUnit}
              onChange={(e) =>
                switchConcentration(e.target.value as ConcentrationUnit)
              }
            >
              <option value="mln_per_mL">mln/ml</option>
              <option value="mln_per_uL">mln/µL</option>
            </select>
          </FieldShell>
          {errors.concentrationText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.concentrationText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sa-morph">
            Normal morphology
            <InfoTooltip text="Percent of sperm with normal shape (0–100). Required with motility and vitality for the functional estimate." />
          </label>
          <FieldShell error={errors.morphologyText}>
            <input
              id="sa-morph"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.morphologyText}
              onChange={(e) => set({ morphologyText: e.target.value })}
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          {errors.morphologyText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.morphologyText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sa-mot">
            Normal motility
            <InfoTooltip text="Percent motile sperm used as the motility fraction (often progressive motility in teaching tools). Not a graded WHO A/B/C/D class report." />
          </label>
          <FieldShell error={errors.motilityText}>
            <input
              id="sa-mot"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.motilityText}
              onChange={(e) => set({ motilityText: e.target.value })}
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          {errors.motilityText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.motilityText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sa-vit">
            Vitality
            <InfoTooltip text="Percent live sperm (0–100). Required with motility and morphology for the functional estimate." />
          </label>
          <FieldShell error={errors.vitalityText}>
            <input
              id="sa-vit"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.vitalityText}
              onChange={(e) => set({ vitalityText: e.target.value })}
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          {errors.vitalityText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.vitalityText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sa-total">
            Total sperm
            <InfoTooltip text="Volume (mL) × concentration (million/mL). Read-only." />
          </label>
          <FieldShell>
            <input
              id="sa-total"
              type="text"
              readOnly
              tabIndex={-1}
              className={readOnlyClass}
              value={totalDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>mln</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="sa-func">
            Functional sperm
            <InfoTooltip text="Product estimate: total × motility × vitality × morphology fractions. Blank until all three percentages are entered." />
          </label>
          <FieldShell>
            <input
              id="sa-func"
              type="text"
              readOnly
              tabIndex={-1}
              className={readOnlyClass}
              value={functionalDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>mln</span>
          </FieldShell>
        </div>

        {result ? (
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}.</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
