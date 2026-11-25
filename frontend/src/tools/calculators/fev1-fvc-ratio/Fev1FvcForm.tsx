'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  Ethnicity,
  Fev1FvcFieldErrors,
  Fev1FvcInput,
  Fev1FvcResult,
  PredictionStudy,
  VolumeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

interface Props {
  input: Fev1FvcInput;
  errors: Fev1FvcFieldErrors;
  result: Fev1FvcResult | null;
  onChange: (input: Fev1FvcInput) => void;
  onLoadExample: () => void;
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function Fev1FvcForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<Fev1FvcInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational FEV1/FVC (Tiffeneau) worksheet. Choose real measured ratio
        or a published predicted ratio. Entries stay in your browser only.
      </p>

      <p className="text-xs text-muted-foreground">
        Please choose between calculating real ratio or its prediction.
      </p>

      <fieldset>
        <legend className="sr-only">Calculation type</legend>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="fev1-mode"
              checked={input.mode === 'real'}
              onChange={() => set({ mode: 'real' })}
              className="h-4 w-4 accent-primary"
            />
            Real ratio
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="fev1-mode"
              checked={input.mode === 'prediction'}
              onChange={() => set({ mode: 'prediction' })}
              className="h-4 w-4 accent-primary"
            />
            Prediction
          </label>
        </div>
      </fieldset>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {input.mode === 'real'
            ? 'Load example (3 / 4 L → 75%)'
            : input.study === 'american1999'
              ? 'Load example (male Caucasian age 40 → ≈79.8%)'
              : 'Load example (female 40 y · 165 cm)'}
        </button>
      </p>

      {input.mode === 'real' ? (
        <>
          <div>
            <label className={labelClass} htmlFor="fev1-value">
              <span>FEV1</span>
              <InfoTooltip
                label="FEV1"
                text="Forced expiratory volume in one second from spirometry."
              />
            </label>
            <div
              className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.fev1 ? 'border-rose-400' : 'border-border'
              }`}
            >
              <input
                id="fev1-value"
                className={inputClass}
                inputMode="decimal"
                value={input.fev1 ?? ''}
                onChange={(e) => set({ fev1: parseOptional(e.target.value) })}
              />
              <select
                className={selectClass}
                aria-label="FEV1 unit"
                value={input.volumeUnit}
                onChange={(e) =>
                  set({ volumeUnit: e.target.value as VolumeUnit })
                }
              >
                <option value="L">L</option>
                <option value="mL">mL</option>
              </select>
            </div>
            {errors.fev1 ? (
              <p className="mt-1 text-xs text-destructive">{errors.fev1}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fvc-value">
              <span>FVC</span>
              <InfoTooltip
                label="FVC"
                text="Forced vital capacity. Must be greater than zero and at least FEV1."
              />
            </label>
            <div
              className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.fvc ? 'border-rose-400' : 'border-border'
              }`}
            >
              <input
                id="fvc-value"
                className={inputClass}
                inputMode="decimal"
                value={input.fvc ?? ''}
                onChange={(e) => set({ fvc: parseOptional(e.target.value) })}
              />
              <select
                className={selectClass}
                aria-label="FVC unit"
                value={input.volumeUnit}
                onChange={(e) =>
                  set({ volumeUnit: e.target.value as VolumeUnit })
                }
              >
                <option value="L">L</option>
                <option value="mL">mL</option>
              </select>
            </div>
            {errors.fvc ? (
              <p className="mt-1 text-xs text-destructive">{errors.fvc}</p>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div>
            <label className={labelClass} htmlFor="fev1-study">
              Study population
            </label>
            <select
              id="fev1-study"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
              value={input.study}
              onChange={(e) =>
                set({ study: e.target.value as PredictionStudy })
              }
            >
              <option value="american1999">American (Hankinson 1999)</option>
              <option value="european2004">European (Falaschetti 2004)</option>
            </select>
          </div>

          <div>
            <span className={labelClass}>Sex</span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="fev1-sex"
                  checked={input.sex === 'female'}
                  onChange={() => set({ sex: 'female' })}
                  className="h-4 w-4 accent-primary"
                />
                Female
              </label>
              <label className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="fev1-sex"
                  checked={input.sex === 'male'}
                  onChange={() => set({ sex: 'male' })}
                  className="h-4 w-4 accent-primary"
                />
                Male
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="fev1-age">
              Age
            </label>
            <div
              className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.ageYears ? 'border-rose-400' : 'border-border'
              }`}
            >
              <input
                id="fev1-age"
                className={inputClass}
                inputMode="decimal"
                value={input.ageYears ?? ''}
                onChange={(e) =>
                  set({ ageYears: parseOptional(e.target.value) })
                }
              />
              <span className="shrink-0 px-3 text-sm text-muted-foreground">
                years
              </span>
            </div>
            {errors.ageYears ? (
              <p className="mt-1 text-xs text-destructive">{errors.ageYears}</p>
            ) : null}
          </div>

          {input.study === 'american1999' ? (
            <div>
              <label className={labelClass} htmlFor="fev1-ethnicity">
                Ethnicity
              </label>
              <select
                id="fev1-ethnicity"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                value={input.ethnicity}
                onChange={(e) =>
                  set({ ethnicity: e.target.value as Ethnicity })
                }
              >
                <option value="caucasian">Caucasian</option>
                <option value="africanAmerican">African-American</option>
                <option value="mexicanAmerican">Mexican-American</option>
              </select>
            </div>
          ) : (
            <div>
              <label className={labelClass} htmlFor="fev1-height">
                Height
              </label>
              <div
                className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                  errors.heightCm ? 'border-rose-400' : 'border-border'
                }`}
              >
                <input
                  id="fev1-height"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.heightCm ?? ''}
                  onChange={(e) =>
                    set({ heightCm: parseOptional(e.target.value) })
                  }
                />
                <span className="shrink-0 px-3 text-sm text-muted-foreground">
                  cm
                </span>
              </div>
              {errors.heightCm ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.heightCm}
                </p>
              ) : null}
            </div>
          )}
        </>
      )}

      {errors.form ? (
        <p className="text-xs text-destructive" role="status">
          {errors.form}
        </p>
      ) : null}

      <div>
        <div className={labelClass}>
          <span>FEV1/FVC</span>
          <InfoTooltip
            label="FEV1/FVC"
            text={
              input.mode === 'real'
                ? 'Measured ratio as a percentage.'
                : 'Predicted population ratio as a percentage — not percent of predicted of a measured ratio.'
            }
          />
        </div>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
          <div
            className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
            aria-live="polite"
          >
            {result
              ? result.formattedRatio.replace(/%$/, '')
              : '—'}
          </div>
          <span className="shrink-0 px-3 text-sm font-medium text-muted-foreground">
            %
          </span>
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
