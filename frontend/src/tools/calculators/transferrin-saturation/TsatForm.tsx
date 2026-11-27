'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  IronUnit,
  TransferrinSaturationFieldErrors,
  TransferrinSaturationInput,
  TransferrinSaturationResult,
  TransferrinUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';

const IRON_UNITS: { value: IronUnit; label: string }[] = [
  { value: 'ug_dl', label: 'µg/dL' },
  { value: 'umol_l', label: 'µmol/L' },
];

const TF_UNITS: { value: TransferrinUnit; label: string }[] = [
  { value: 'mg_dl', label: 'mg/dL' },
  { value: 'g_l', label: 'g/L' },
];

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: TransferrinSaturationInput;
  errors: TransferrinSaturationFieldErrors;
  result: TransferrinSaturationResult | null;
  onChange: (input: TransferrinSaturationInput) => void;
}

export function TsatForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<TransferrinSaturationInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="First method Fe and TIBC">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          aria-expanded={input.method1Open}
          onClick={() => set({ method1Open: !input.method1Open })}
        >
          <span className="text-sm font-semibold text-accent">First method</span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform ${
              input.method1Open ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.method1Open ? (
          <div className="space-y-3.5 pt-1">
            <p className="font-mono text-xs text-muted-foreground">
              TSAT = (Fe / TIBC) × 100
            </p>
            <div>
              <label className={labelClass} htmlFor="tsat-fe1">
                Serum iron concentration (Fe)
                <InfoTooltip text="Serum iron. Converted to µg/dL before TSAT = 100 × Fe / TIBC." />
              </label>
              <FieldShell error={errors.fe1Text}>
                <input
                  id="tsat-fe1"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.fe1Text}
                  onChange={(e) => set({ fe1Text: e.target.value })}
                  aria-invalid={Boolean(errors.fe1Text)}
                />
                <select
                  className={unitSelectClass}
                  value={input.fe1Unit}
                  onChange={(e) =>
                    set({ fe1Unit: e.target.value as IronUnit })
                  }
                  aria-label="Serum iron unit (method 1)"
                >
                  {IRON_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </FieldShell>
              {errors.fe1Text ? (
                <p className="mt-1 text-xs text-rose-600">{errors.fe1Text}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="tsat-tibc">
                Total iron-binding capacity (TIBC)
                <InfoTooltip text="TIBC in the same iron concentration basis as Fe. Must be greater than zero." />
              </label>
              <FieldShell error={errors.tibcText}>
                <input
                  id="tsat-tibc"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.tibcText}
                  onChange={(e) => set({ tibcText: e.target.value })}
                  aria-invalid={Boolean(errors.tibcText)}
                />
                <select
                  className={unitSelectClass}
                  value={input.tibcUnit}
                  onChange={(e) =>
                    set({ tibcUnit: e.target.value as IronUnit })
                  }
                  aria-label="TIBC unit"
                >
                  {IRON_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </FieldShell>
              {errors.tibcText ? (
                <p className="mt-1 text-xs text-rose-600">{errors.tibcText}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="tsat-out1">
                Transferrin saturation (TSAT)
              </label>
              <FieldShell muted>
                <input
                  id="tsat-out1"
                  type="text"
                  readOnly
                  tabIndex={0}
                  className={`${inputClass} text-muted-foreground`}
                  value={result?.formattedTsat1 ?? ''}
                  aria-live="polite"
                />
                <span className={unitFixed}>%</span>
              </FieldShell>
            </div>
          </div>
        ) : null}
      </section>

      <section
        className={sectionClass}
        aria-label="Second method Fe and transferrin"
      >
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          aria-expanded={input.method2Open}
          onClick={() => set({ method2Open: !input.method2Open })}
        >
          <span className="text-sm font-semibold text-accent">Second method</span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform ${
              input.method2Open ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.method2Open ? (
          <div className="space-y-3.5 pt-1">
            <p className="font-mono text-xs text-muted-foreground">
              TSAT = (Fe / TF) × 70.9
            </p>
            <div>
              <label className={labelClass} htmlFor="tsat-fe2">
                Serum iron concentration (Fe)
                <InfoTooltip text="Serum iron for the transferrin-based formula. Converted to µg/dL before applying the 70.9 factor." />
              </label>
              <FieldShell error={errors.fe2Text}>
                <input
                  id="tsat-fe2"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.fe2Text}
                  onChange={(e) => set({ fe2Text: e.target.value })}
                  aria-invalid={Boolean(errors.fe2Text)}
                />
                <select
                  className={unitSelectClass}
                  value={input.fe2Unit}
                  onChange={(e) =>
                    set({ fe2Unit: e.target.value as IronUnit })
                  }
                  aria-label="Serum iron unit (method 2)"
                >
                  {IRON_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </FieldShell>
              {errors.fe2Text ? (
                <p className="mt-1 text-xs text-rose-600">{errors.fe2Text}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="tsat-tf">
                Serum transferrin concentration (TF)
                <InfoTooltip text="Immunologic transferrin. Converted to mg/dL for TSAT = 70.9 × Fe / TF." />
              </label>
              <FieldShell error={errors.tfText}>
                <input
                  id="tsat-tf"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.tfText}
                  onChange={(e) => set({ tfText: e.target.value })}
                  aria-invalid={Boolean(errors.tfText)}
                />
                <select
                  className={unitSelectClass}
                  value={input.tfUnit}
                  onChange={(e) =>
                    set({ tfUnit: e.target.value as TransferrinUnit })
                  }
                  aria-label="Transferrin unit"
                >
                  {TF_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </FieldShell>
              {errors.tfText ? (
                <p className="mt-1 text-xs text-rose-600">{errors.tfText}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="tsat-out2">
                Transferrin saturation (TSAT)
              </label>
              <FieldShell muted>
                <input
                  id="tsat-out2"
                  type="text"
                  readOnly
                  tabIndex={0}
                  className={`${inputClass} text-muted-foreground`}
                  value={result?.formattedTsat2 ?? ''}
                  aria-live="polite"
                />
                <span className={unitFixed}>%</span>
              </FieldShell>
            </div>
          </div>
        ) : null}
      </section>

      {result?.statusHeadline ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
          {result.statusDetail}
        </p>
      ) : null}
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
        {result?.disclaimer ??
          'Educational iron-status worksheet — not a diagnosis or treatment decision.'}
      </p>
    </form>
  );
}
