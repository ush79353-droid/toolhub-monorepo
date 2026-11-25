'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  Fio2Unit,
  PfRatioFieldErrors,
  PfRatioInput,
  PfRatioResult,
  PressureUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

interface Props {
  input: PfRatioInput;
  errors: PfRatioFieldErrors;
  result: PfRatioResult | null;
  onChange: (input: PfRatioInput) => void;
  onLoadExample: () => void;
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function PfRatioForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PfRatioInput>) => onChange({ ...input, ...patch });

  const switchPao2Unit = (next: PressureUnit) => {
    if (next === input.pao2Unit) return;
    if (input.pao2 == null) {
      set({ pao2Unit: next, resultUnit: next });
      return;
    }
    const mmHg =
      input.pao2Unit === 'mmHg' ? input.pao2 : input.pao2 / 0.133322387415;
    const converted = next === 'mmHg' ? mmHg : mmHg * 0.133322387415;
    set({
      pao2: Math.round(converted * 1000) / 1000,
      pao2Unit: next,
      resultUnit: next,
    });
  };

  const switchFio2Unit = (next: Fio2Unit) => {
    if (next === input.fio2Unit) return;
    if (input.fio2 == null) {
      set({ fio2Unit: next });
      return;
    }
    const frac = input.fio2Unit === 'fraction' ? input.fio2 : input.fio2 / 100;
    const converted = next === 'fraction' ? frac : frac * 100;
    set({ fio2: Math.round(converted * 1000) / 1000, fio2Unit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational PaO₂/FiO₂ (Horovitz) index. Ratio alone does not establish
        ARDS. Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (80 mmHg · 40% → 200 mmHg)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="pf-pao2">
          <span>PaO₂</span>
          <InfoTooltip
            label="PaO2"
            text="Arterial partial pressure of oxygen from an ABG. Switch mmHg ↔ kPa; the physical value is preserved."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.pao2 ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="pf-pao2"
            className={inputClass}
            inputMode="decimal"
            value={input.pao2 ?? ''}
            onChange={(e) => set({ pao2: parseOptional(e.target.value) })}
          />
          <select
            className={selectClass}
            aria-label="PaO2 unit"
            value={input.pao2Unit}
            onChange={(e) => switchPao2Unit(e.target.value as PressureUnit)}
          >
            <option value="mmHg">mmHg</option>
            <option value="kPa">kPa</option>
          </select>
        </div>
        {errors.pao2 ? (
          <p className="mt-1 text-xs text-destructive">{errors.pao2}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pf-fio2">
          <span>FiO₂</span>
          <InfoTooltip
            label="FiO2"
            text="Fraction of inspired oxygen as percent (40) or fraction (0.40). Ambient air ≈ 21%."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.fio2 ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="pf-fio2"
            className={inputClass}
            inputMode="decimal"
            value={input.fio2 ?? ''}
            onChange={(e) => set({ fio2: parseOptional(e.target.value) })}
          />
          <select
            className={selectClass}
            aria-label="FiO2 unit"
            value={input.fio2Unit}
            onChange={(e) => switchFio2Unit(e.target.value as Fio2Unit)}
          >
            <option value="%">%</option>
            <option value="fraction">fraction</option>
          </select>
        </div>
        {errors.fio2 ? (
          <p className="mt-1 text-xs text-destructive">{errors.fio2}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-destructive" role="status">
          {errors.form}
        </p>
      ) : null}

      <div>
        <div className={labelClass}>PaO₂/FiO₂ ratio</div>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
          <div
            className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
            aria-live="polite"
          >
            {result
              ? String(Math.round(result.ratioDisplay * 10) / 10)
              : '—'}
          </div>
          <select
            className={selectClass}
            aria-label="P/F ratio unit"
            value={input.resultUnit}
            onChange={(e) =>
              set({ resultUnit: e.target.value as PressureUnit })
            }
          >
            <option value="mmHg">mmHg</option>
            <option value="kPa">kPa</option>
          </select>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
      </div>
    </form>
  );
}
