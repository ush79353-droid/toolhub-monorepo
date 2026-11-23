'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  estradiolToPgMl,
  formatFieldValue,
  parseConcentration,
  pgMlToEstradiolUnit,
  pgMlToProgesteroneUnit,
  progesteroneToPgMl,
} from './calculation';
import type {
  EstradiolUnit,
  PgE2FieldErrors,
  PgE2Input,
  PgE2Result,
  ProgesteroneUnit,
} from './types';
import {
  ESTRADIOL_UNIT_LABELS,
  PROGESTERONE_UNIT_LABELS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-primary outline-none';

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

interface Props {
  input: PgE2Input;
  errors: PgE2FieldErrors;
  result: PgE2Result | null;
  onChange: (input: PgE2Input) => void;
}

export function PgE2Form({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<PgE2Input>) => onChange({ ...input, ...patch });

  const switchProgesteroneUnit = (next: ProgesteroneUnit) => {
    if (next === input.progesteroneUnit) return;
    const raw = parseConcentration(input.progesterone);
    let nextValue = input.progesterone;
    if (raw != null) {
      const pg = progesteroneToPgMl(raw, input.progesteroneUnit);
      if (pg != null) {
        nextValue = formatFieldValue(pgMlToProgesteroneUnit(pg, next));
      }
    }
    set({ progesteroneUnit: next, progesterone: nextValue });
  };

  const switchEstradiolUnit = (next: EstradiolUnit) => {
    if (next === input.estradiolUnit) return;
    const raw = parseConcentration(input.estradiol);
    let nextValue = input.estradiol;
    if (raw != null) {
      const pg = estradiolToPgMl(raw, input.estradiolUnit);
      if (pg != null) {
        nextValue = formatFieldValue(pgMlToEstradiolUnit(pg, next));
      }
    }
    set({ estradiolUnit: next, estradiol: nextValue });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational mass-normalized Pg/E2 ratio. Values stay in your browser
        only and are not medical advice.
      </p>

      <div>
        <label className={labelClass} htmlFor="pge2-progesterone">
          <span>Progesterone</span>
          <InfoTooltip
            label="Progesterone"
            text="Enter the serum progesterone concentration from your lab report. Default unit is ng/mL; switch to pg/mL or nmol/L if needed. The ratio normalizes progesterone to pg/mL before dividing."
          />
        </label>
        <FieldShell error={errors.progesterone}>
          <input
            id="pge2-progesterone"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.progesterone}
            onChange={(e) => set({ progesterone: e.target.value })}
            aria-invalid={Boolean(errors.progesterone)}
          />
          <select
            className={selectClass}
            aria-label="Progesterone unit"
            value={input.progesteroneUnit}
            onChange={(e) =>
              switchProgesteroneUnit(e.target.value as ProgesteroneUnit)
            }
          >
            {(Object.keys(PROGESTERONE_UNIT_LABELS) as ProgesteroneUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {PROGESTERONE_UNIT_LABELS[u]}
                </option>
              )
            )}
          </select>
        </FieldShell>
        {errors.progesterone ? (
          <p className="mt-1 text-xs text-rose-600">{errors.progesterone}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pge2-estradiol">
          <span>Estradiol</span>
          <InfoTooltip
            label="Estradiol"
            text="Enter serum estradiol (E2). Default unit is pg/mL. Alternate units: ng/mL or pmol/L. Estrogen in this ratio means estradiol."
          />
        </label>
        <FieldShell error={errors.estradiol}>
          <input
            id="pge2-estradiol"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.estradiol}
            onChange={(e) => set({ estradiol: e.target.value })}
            aria-invalid={Boolean(errors.estradiol)}
          />
          <select
            className={selectClass}
            aria-label="Estradiol unit"
            value={input.estradiolUnit}
            onChange={(e) =>
              switchEstradiolUnit(e.target.value as EstradiolUnit)
            }
          >
            {(Object.keys(ESTRADIOL_UNIT_LABELS) as EstradiolUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {ESTRADIOL_UNIT_LABELS[u]}
                </option>
              )
            )}
          </select>
        </FieldShell>
        {errors.estradiol ? (
          <p className="mt-1 text-xs text-rose-600">{errors.estradiol}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pge2-ratio">
          <span>Ratio (Pg/E2 or P/E2)</span>
          <InfoTooltip
            label="Ratio (Pg/E2 or P/E2)"
            text="Dimensionless mass ratio after converting both hormones to pg/mL. Equivalent to 1000 × P(ng/mL) ÷ E2(pg/mL) when those units are selected."
          />
        </label>
        <FieldShell muted>
          <input
            id="pge2-ratio"
            type="text"
            readOnly
            tabIndex={0}
            className={inputClass}
            value={result?.formattedRatio ?? ''}
            aria-live="polite"
          />
        </FieldShell>
      </div>
    </form>
  );
}
