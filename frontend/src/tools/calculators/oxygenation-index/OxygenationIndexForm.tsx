'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  OxygenationIndexFieldErrors,
  OxygenationIndexInput,
  OxygenationIndexResult,
  PaO2Unit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const readonlyClass =
  'flex h-11 items-center rounded-lg border border-border bg-muted/30 px-3 text-sm tabular-nums text-accent';

interface Props {
  input: OxygenationIndexInput;
  errors: OxygenationIndexFieldErrors;
  result: OxygenationIndexResult | null;
  onChange: (input: OxygenationIndexInput) => void;
  onLoadExample: () => void;
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function OxygenationIndexForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<OxygenationIndexInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational P/F and oxygenation index from FiO₂ %, ventilator mean
        airway pressure, and arterial PaO₂. Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (50% · 10 cmH₂O · 100 mmHg → P/F 200 · OI 5)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="oi-fio2">
          <span>FiO₂</span>
          <InfoTooltip
            label="FiO2"
            text="Fraction of inspired oxygen entered as percent (room air ≈ 21%). Converted once to a decimal fraction for math."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.fio2Percent ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="oi-fio2"
            className={inputClass}
            inputMode="decimal"
            value={input.fio2Percent ?? ''}
            onChange={(e) =>
              set({ fio2Percent: parseOptional(e.target.value) })
            }
          />
          <span className="shrink-0 px-3 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
        {errors.fio2Percent ? (
          <p className="mt-1 text-xs text-destructive">{errors.fio2Percent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="oi-map">
          <span>MAP (Mean Airway Pressure)</span>
          <InfoTooltip
            label="MAP"
            text="Ventilator mean airway pressure (not blood-pressure MAP), matched to the same FiO₂ and PaO₂."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.map ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="oi-map"
            className={inputClass}
            inputMode="decimal"
            value={input.map ?? ''}
            onChange={(e) => set({ map: parseOptional(e.target.value) })}
          />
          <select
            className={selectClass}
            aria-label="Mean airway pressure unit"
            value={input.mapUnit}
            onChange={() => set({ mapUnit: 'cmH2O' })}
          >
            <option value="cmH2O">cmH₂O</option>
          </select>
        </div>
        {errors.map ? (
          <p className="mt-1 text-xs text-destructive">{errors.map}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="oi-pao2">
          <span>PaO₂ (Partial Pressure of Oxygen)</span>
          <InfoTooltip
            label="PaO2"
            text="Arterial oxygen tension from the ABG paired with the ventilator settings above."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.pao2 ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="oi-pao2"
            className={inputClass}
            inputMode="decimal"
            value={input.pao2 ?? ''}
            onChange={(e) => set({ pao2: parseOptional(e.target.value) })}
          />
          <select
            className={selectClass}
            aria-label="PaO2 unit"
            value={input.pao2Unit}
            onChange={(e) =>
              set({
                pao2Unit: e.target.value as PaO2Unit,
                pao2: null,
              })
            }
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
        <p className={labelClass}>
          <span>PaO₂/FiO₂ ratio</span>
          <InfoTooltip
            label="PF ratio"
            text="PaO₂ in mmHg divided by FiO₂ as a decimal fraction (e.g. 100 ÷ 0.50 = 200)."
          />
        </p>
        <div className={readonlyClass} aria-live="polite">
          {result ? result.formattedPf : '—'}
        </div>
      </div>

      <div>
        <p className={labelClass}>
          <span>Oxygenation Index (OI)</span>
          <InfoTooltip
            label="OI"
            text="OI = 100 × FiO₂ fraction × MAP ÷ PaO₂. Higher values mean more support for the observed PaO₂."
          />
        </p>
        <div className={readonlyClass} aria-live="polite">
          {result ? result.formattedOi : '—'}
        </div>
      </div>

      {errors.form && !result ? (
        <p className="text-xs text-muted-foreground">{errors.form}</p>
      ) : null}
    </form>
  );
}
