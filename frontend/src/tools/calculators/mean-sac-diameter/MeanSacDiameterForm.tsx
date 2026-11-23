'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { dimToMm, mmToDimUnit } from './calculation';
import type {
  GaDisplayUnit,
  MeanSacDiameterFieldErrors,
  MeanSacDiameterInput,
  MeanSacDiameterResult,
  SacDimUnit,
} from './types';
import { GA_DISPLAY_LABELS, SAC_DIM_UNIT_LABELS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

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

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatField(value: number, unit: SacDimUnit): string {
  const digits = unit === 'mm' ? 2 : 4;
  return String(Number(value.toFixed(digits)));
}

interface Props {
  input: MeanSacDiameterInput;
  errors: MeanSacDiameterFieldErrors;
  result: MeanSacDiameterResult | null;
  onChange: (input: MeanSacDiameterInput) => void;
  onLoadExample: () => void;
}

export function MeanSacDiameterForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<MeanSacDiameterInput>) =>
    onChange({ ...input, ...patch });

  const switchDim = (
    field: 'length' | 'width' | 'height',
    next: SacDimUnit
  ) => {
    const valueKey = `${field}Value` as const;
    const unitKey = `${field}Unit` as const;
    if (next === input[unitKey]) return;
    const raw = parseLoose(input[valueKey]);
    let nextValue = input[valueKey];
    if (raw != null) {
      const mm = dimToMm(raw, input[unitKey]);
      if (mm != null) nextValue = formatField(mmToDimUnit(mm, next), next);
    }
    set({ [unitKey]: next, [valueKey]: nextValue } as Partial<MeanSacDiameterInput>);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational mean sac diameter from three orthogonal inner diameters.
        Approximate age uses MSD + 30 days only in the early window — not a
        viability check or clinical due date.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (12 / 15 / 18 mm → MSD 15 mm ≈ 45 days)
        </button>
      </p>

      <div className="overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between bg-muted/30 px-4 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={input.dimensionsExpanded}
          onClick={() =>
            set({ dimensionsExpanded: !input.dimensionsExpanded })
          }
        >
          <span>Gestational sac dimensions</span>
          {input.dimensionsExpanded ? (
            <ChevronUp className="h-4 w-4 text-primary" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4 text-primary" aria-hidden />
          )}
        </button>

        {input.dimensionsExpanded ? (
          <div className="space-y-4 p-4">
            {(
              [
                ['length', 'Length', errors.lengthValue],
                ['width', 'Width', errors.widthValue],
                ['height', 'Height', errors.heightValue],
              ] as const
            ).map(([field, label, error]) => {
              const valueKey = `${field}Value` as const;
              const unitKey = `${field}Unit` as const;
              return (
                <div key={field}>
                  <label className={labelClass} htmlFor={`msd-${field}`}>
                    <span>{label}</span>
                  </label>
                  <FieldShell error={error}>
                    <input
                      id={`msd-${field}`}
                      className={inputClass}
                      inputMode="decimal"
                      value={input[valueKey]}
                      aria-invalid={Boolean(error)}
                      onChange={(e) =>
                        set({
                          [valueKey]: e.target.value,
                        } as Partial<MeanSacDiameterInput>)
                      }
                    />
                    <select
                      className={selectClass}
                      aria-label={`${label} unit`}
                      value={input[unitKey]}
                      onChange={(e) =>
                        switchDim(field, e.target.value as SacDimUnit)
                      }
                    >
                      {(Object.keys(SAC_DIM_UNIT_LABELS) as SacDimUnit[]).map(
                        (u) => (
                          <option key={u} value={u}>
                            {SAC_DIM_UNIT_LABELS[u]}
                          </option>
                        )
                      )}
                    </select>
                  </FieldShell>
                  {error ? (
                    <p className="mt-1 text-xs text-rose-600">{error}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-accent">Results</h3>

        <div>
          <label className={labelClass} htmlFor="msd-result">
            <span>Mean sac diameter</span>
            <InfoTooltip
              label="Mean sac diameter"
              text="Arithmetic mean of length, width, and height after converting each to millimeters."
            />
          </label>
          <FieldShell muted>
            <input
              id="msd-result"
              className={`${inputClass} cursor-default`}
              readOnly
              value={result?.formattedMsd ?? ''}
              aria-live="polite"
            />
            <select
              className={selectClass}
              aria-label="MSD display unit"
              value={input.msdDisplayUnit}
              onChange={(e) =>
                set({ msdDisplayUnit: e.target.value as SacDimUnit })
              }
            >
              {(Object.keys(SAC_DIM_UNIT_LABELS) as SacDimUnit[]).map((u) => (
                <option key={u} value={u}>
                  {SAC_DIM_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="msd-ga">
            <span>Gestational age</span>
            <InfoTooltip
              label="Gestational age"
              text="Approximate menstrual age ≈ MSD (mm) + 30 days when MSD is in the early educational window. Blank outside that window."
            />
          </label>
          <FieldShell muted>
            <input
              id="msd-ga"
              className={`${inputClass} cursor-default`}
              readOnly
              value={result?.formattedGestationalAge ?? ''}
              aria-live="polite"
            />
            <select
              className={selectClass}
              aria-label="Gestational age unit"
              value={input.gaDisplayUnit}
              onChange={(e) =>
                set({ gaDisplayUnit: e.target.value as GaDisplayUnit })
              }
            >
              {(Object.keys(GA_DISPLAY_LABELS) as GaDisplayUnit[]).map((u) => (
                <option key={u} value={u}>
                  {GA_DISPLAY_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
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
