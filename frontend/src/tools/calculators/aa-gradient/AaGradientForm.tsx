'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AaGradientFieldErrors,
  AaGradientInput,
  AaGradientResult,
  PressureUnit,
} from './types';
import { PRESSURE_UNITS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

interface Props {
  input: AaGradientInput;
  errors: AaGradientFieldErrors;
  result: AaGradientResult | null;
  onChange: (input: AaGradientInput) => void;
  onLoadExample: () => void;
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function AaGradientForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<AaGradientInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational A–a gradient from the alveolar gas equation (R = 0.8, PH₂O
        = 47 mmHg at 37 °C). Not a diagnosis. Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (age 57 · room air · PaCO₂ 45 · PaO₂ 70 mmHg)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="aa-age">
          Age
        </label>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="aa-age"
            className={inputClass}
            inputMode="decimal"
            value={input.ageYears ?? ''}
            placeholder=""
            onChange={(e) => set({ ageYears: parseOptional(e.target.value) })}
          />
          <span className="shrink-0 pr-3 font-mono text-xs text-muted-foreground">
            years
          </span>
        </div>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-destructive">{errors.ageYears}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="aa-fio2">
          <span>FiO₂ (Fraction of Inspired Oxygen)</span>
          <InfoTooltip
            label="FiO₂"
            text="Enter as percent (21 = room air). Converted to a fraction for PAO₂ = FiO₂ × (Patm − PH₂O) − PaCO₂/R."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.fio2Percent ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="aa-fio2"
            className={inputClass}
            inputMode="decimal"
            value={input.fio2Percent ?? ''}
            onChange={(e) =>
              set({ fio2Percent: parseOptional(e.target.value) })
            }
          />
          <span className="shrink-0 pr-3 font-mono text-xs text-muted-foreground">
            %
          </span>
        </div>
        {errors.fio2Percent ? (
          <p className="mt-1 text-xs text-destructive">{errors.fio2Percent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="aa-paco2">
          <span>PaCO₂ (Partial Pressure of Carbon Dioxide)</span>
          <InfoTooltip
            label="PaCO₂"
            text="Arterial (or alveolar-approximated) PCO₂ from the blood gas. Divided by respiratory quotient R = 0.8 in the alveolar gas equation."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.paco2 ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="aa-paco2"
            className={inputClass}
            inputMode="decimal"
            value={input.paco2 ?? ''}
            onChange={(e) => set({ paco2: parseOptional(e.target.value) })}
          />
          <select
            className={selectClass}
            aria-label="PaCO₂ unit"
            value={input.gasUnit}
            onChange={(e) =>
              set({ gasUnit: e.target.value as PressureUnit })
            }
          >
            {PRESSURE_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        {errors.paco2 ? (
          <p className="mt-1 text-xs text-destructive">{errors.paco2}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="aa-pao2">
          <span>PaO₂ (Partial Pressure of Oxygen)</span>
          <InfoTooltip
            label="PaO₂"
            text="Measured arterial PO₂. A–a gradient = estimated alveolar PAO₂ − PaO₂."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.pao2 ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="aa-pao2"
            className={inputClass}
            inputMode="decimal"
            value={input.pao2 ?? ''}
            onChange={(e) => set({ pao2: parseOptional(e.target.value) })}
          />
          <select
            className={selectClass}
            aria-label="PaO₂ unit"
            value={input.gasUnit}
            onChange={(e) =>
              set({ gasUnit: e.target.value as PressureUnit })
            }
          >
            {PRESSURE_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        {errors.pao2 ? (
          <p className="mt-1 text-xs text-destructive">{errors.pao2}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="aa-atm">
          Atmospheric pressure
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.atmPressure ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="aa-atm"
            className={inputClass}
            inputMode="decimal"
            value={input.atmPressure ?? ''}
            onChange={(e) =>
              set({ atmPressure: parseOptional(e.target.value) })
            }
          />
          <select
            className={selectClass}
            aria-label="Atmospheric pressure unit"
            value={input.atmUnit}
            onChange={(e) =>
              set({ atmUnit: e.target.value as PressureUnit })
            }
          >
            {PRESSURE_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        {errors.atmPressure ? (
          <p className="mt-1 text-xs text-destructive">{errors.atmPressure}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-destructive" role="status">
          {errors.form}
        </p>
      ) : null}

      <div className="space-y-3 rounded-xl border border-border bg-muted/10 p-3">
        <div>
          <div className={labelClass}>AA gradient</div>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
            <div
              className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
              aria-live="polite"
            >
              {result ? result.formattedGradient.replace(/ (mmHg|kPa)$/, '') : '—'}
            </div>
            <select
              className={selectClass}
              aria-label="AA gradient unit"
              value={input.resultUnit}
              onChange={(e) =>
                set({ resultUnit: e.target.value as PressureUnit })
              }
            >
              {PRESSURE_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className={labelClass}>Expected AA gradient for age</div>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
            <div
              className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
              aria-live="polite"
            >
              {result
                ? result.formattedExpected.replace(/ (mmHg|kPa)$/, '')
                : '—'}
            </div>
            <select
              className={selectClass}
              aria-label="Expected AA gradient unit"
              value={input.resultUnit}
              onChange={(e) =>
                set({ resultUnit: e.target.value as PressureUnit })
              }
            >
              {PRESSURE_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
      </div>
    </form>
  );
}
