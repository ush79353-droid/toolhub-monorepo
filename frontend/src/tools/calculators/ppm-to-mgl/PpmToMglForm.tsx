'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { densityToKgM3, formatConc, kgM3ToDensity } from './calculation';
import { parsePositive } from './validation';
import {
  DEFAULT_DENSITY_KG_M3,
  DENSITY_UNITS,
  DENSITY_UNIT_SYMBOLS,
  MOLAR_CONC_SYMBOLS,
  MOLAR_CONC_UNITS,
  MOLAR_MASS_SYMBOLS,
  MOLAR_MASS_UNITS,
  type ConcentrationSource,
  type DensityUnit,
  type FieldErrors,
  type MolarConcUnit,
  type MolarMassUnit,
} from './types';

export interface PpmToMglDraft {
  ppm: string;
  density: string;
  densityUnit: DensityUnit;
  mgL: string;
  molarMass: string;
  molarMassUnit: MolarMassUnit;
  molar: string;
  molarUnit: MolarConcUnit;
  activeSource: ConcentrationSource | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';

export function emptyDraft(): PpmToMglDraft {
  return {
    ppm: '',
    density: String(DEFAULT_DENSITY_KG_M3),
    densityUnit: 'kg_m3',
    mgL: '',
    molarMass: '',
    molarMassUnit: 'g_mol',
    molar: '',
    molarUnit: 'mol_L',
    activeSource: null,
  };
}

interface PpmToMglFormProps {
  draft: PpmToMglDraft;
  errors: FieldErrors;
  molarHint: string | null;
  onDraftChange: (draft: PpmToMglDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function PpmToMglForm({
  draft,
  errors,
  molarHint,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PpmToMglFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Mass-based ppm (mg/kg). mg/L = ppm × density(kg/m³) / 1000. Default density 1000 kg/m³
 approximates dilute water; actual density depends on temperature and composition. Enter
        molar mass to convert molarity.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ppm-mgl-ppm" className={labelClass}>
          Parts per million
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ppm-mgl-ppm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.ppm}
              aria-invalid={Boolean(errors.ppm)}
              onChange={(event) =>
                onDraftChange({ ...draft, ppm: event.target.value, activeSource: 'ppm' })
              }
            />
          </div>
          <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
            ppm
          </span>
        </div>
        {errors.ppm ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.ppm}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ppm-mgl-density" className={labelClass}>
          Solution density
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ppm-mgl-density"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.density}
              aria-invalid={Boolean(errors.density)}
              onChange={(event) => onDraftChange({ ...draft, density: event.target.value })}
            />
          </div>
          <select
            className={selectClass}
            value={draft.densityUnit}
            aria-label="Density unit"
            onChange={(event) => {
              const nextUnit = event.target.value as DensityUnit;
              const parsed = parsePositive(draft.density, 'Solution density');
              let density = draft.density;
              if (parsed.value != null) {
                const kgM3 = densityToKgM3(parsed.value, draft.densityUnit);
                density = formatConc(kgM3ToDensity(kgM3, nextUnit));
              }
              onDraftChange({
                ...draft,
                density,
                densityUnit: nextUnit,
              });
            }}
          >
            {DENSITY_UNITS.map((u) => (
              <option key={u} value={u}>
                {DENSITY_UNIT_SYMBOLS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.density ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.density}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ppm-mgl-mgl" className={labelClass}>
          Milligrams per liter
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ppm-mgl-mgl"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.mgL}
              aria-invalid={Boolean(errors.mgL)}
              onChange={(event) =>
                onDraftChange({ ...draft, mgL: event.target.value, activeSource: 'mgL' })
              }
            />
          </div>
          <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
            mg/L
          </span>
        </div>
        {errors.mgL ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.mgL}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ppm-mgl-mm" className={labelClass}>
          Solute molar mass
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ppm-mgl-mm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.molarMass}
              aria-invalid={Boolean(errors.molarMass)}
              onChange={(event) => onDraftChange({ ...draft, molarMass: event.target.value })}
            />
          </div>
          <select
            className={selectClass}
            value={draft.molarMassUnit}
            aria-label="Molar mass unit"
            onChange={(event) =>
              onDraftChange({
                ...draft,
                molarMassUnit: event.target.value as MolarMassUnit,
              })
            }
          >
            {MOLAR_MASS_UNITS.map((u) => (
              <option key={u} value={u}>
                {MOLAR_MASS_SYMBOLS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.molarMass ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.molarMass}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ppm-mgl-molar" className={labelClass}>
          Molar concentration
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ppm-mgl-molar"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.molar}
              aria-invalid={Boolean(errors.molar)}
              onChange={(event) =>
                onDraftChange({ ...draft, molar: event.target.value, activeSource: 'molar' })
              }
            />
          </div>
          <select
            className={selectClass}
            value={draft.molarUnit}
            aria-label="Molar concentration unit"
            onChange={(event) =>
              onDraftChange({
                ...draft,
                molarUnit: event.target.value as MolarConcUnit,
              })
            }
          >
            {MOLAR_CONC_UNITS.map((u) => (
              <option key={u} value={u}>
                {MOLAR_CONC_SYMBOLS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.molar ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.molar}
          </p>
        ) : null}
        {molarHint ? <p className="text-xs text-muted-foreground">{molarHint}</p> : null}
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Convert
        </button>
      </div>
    </form>
  );
}
