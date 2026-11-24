'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DeadSpaceFieldErrors,
  DeadSpaceInput,
  DeadSpaceResult,
  PressureUnit,
  VolumeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

interface Props {
  input: DeadSpaceInput;
  errors: DeadSpaceFieldErrors;
  result: DeadSpaceResult | null;
  onChange: (input: DeadSpaceInput) => void;
  onLoadExample: () => void;
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function DeadSpaceForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<DeadSpaceInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Bohr physiologic dead space: VD = VT × (PACO₂ − PECO₂) /
        PACO₂. Not a ventilator order. Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (40 / 28 mmHg · 500 mL → 150 mL)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="ds-paco2">
          <span>Alveolar CO₂</span>
          <InfoTooltip
            label="Alveolar CO2"
            text="PACO₂ for the Bohr equation. Arterial PaCO₂ (Enghoff) is sometimes substituted clinically — label that choice clearly."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.alveolarCo2 ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="ds-paco2"
            className={inputClass}
            inputMode="decimal"
            value={input.alveolarCo2 ?? ''}
            onChange={(e) =>
              set({ alveolarCo2: parseOptional(e.target.value) })
            }
          />
          <select
            className={selectClass}
            aria-label="Alveolar CO2 unit"
            value={input.pressureUnit}
            onChange={(e) =>
              set({ pressureUnit: e.target.value as PressureUnit })
            }
          >
            <option value="mmHg">mmHg</option>
            <option value="kPa">kPa</option>
          </select>
        </div>
        {errors.alveolarCo2 ? (
          <p className="mt-1 text-xs text-destructive">{errors.alveolarCo2}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ds-peco2">
          <span>Exhaled CO₂</span>
          <InfoTooltip
            label="Exhaled CO2"
            text="Mixed-expired PECO₂ (mean expired). Missing PECO₂ makes Bohr VD unavailable."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.exhaledCo2 ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="ds-peco2"
            className={inputClass}
            inputMode="decimal"
            value={input.exhaledCo2 ?? ''}
            onChange={(e) =>
              set({ exhaledCo2: parseOptional(e.target.value) })
            }
          />
          <select
            className={selectClass}
            aria-label="Exhaled CO2 unit"
            value={input.pressureUnit}
            onChange={(e) =>
              set({ pressureUnit: e.target.value as PressureUnit })
            }
          >
            <option value="mmHg">mmHg</option>
            <option value="kPa">kPa</option>
          </select>
        </div>
        {errors.exhaledCo2 ? (
          <p className="mt-1 text-xs text-destructive">{errors.exhaledCo2}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ds-vt">
          Tidal volume
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.tidalVolume ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="ds-vt"
            className={inputClass}
            inputMode="decimal"
            value={input.tidalVolume ?? ''}
            onChange={(e) =>
              set({ tidalVolume: parseOptional(e.target.value) })
            }
          />
          <select
            className={selectClass}
            aria-label="Tidal volume unit"
            value={input.tidalUnit}
            onChange={(e) =>
              set({ tidalUnit: e.target.value as VolumeUnit })
            }
          >
            <option value="mL">mL</option>
            <option value="L">L</option>
          </select>
        </div>
        {errors.tidalVolume ? (
          <p className="mt-1 text-xs text-destructive">{errors.tidalVolume}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-destructive" role="status">
          {errors.form}
        </p>
      ) : null}

      <div>
        <div className={labelClass}>Physiological dead space</div>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
          <div
            className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
            aria-live="polite"
          >
            {result
              ? result.formattedDeadSpace.replace(/ (mL|L)$/, '')
              : '—'}
          </div>
          <select
            className={selectClass}
            aria-label="Dead space unit"
            value={input.resultUnit}
            onChange={(e) =>
              set({ resultUnit: e.target.value as VolumeUnit })
            }
          >
            <option value="mL">mL</option>
            <option value="L">L</option>
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
