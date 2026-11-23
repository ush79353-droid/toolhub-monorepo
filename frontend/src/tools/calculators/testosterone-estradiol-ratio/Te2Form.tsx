'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  estradiolToPgMl,
  formatFieldValue,
  parseConcentration,
  pgMlToEstradiolUnit,
  ngDlToTestosteroneUnit,
  testosteroneToNgDl,
} from './calculation';
import type {
  EstradiolUnit,
  Te2FieldErrors,
  Te2Input,
  Te2Result,
  TestosteroneUnit,
} from './types';
import {
  ESTRADIOL_UNIT_LABELS,
  TESTOSTERONE_UNIT_LABELS,
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
  input: Te2Input;
  errors: Te2FieldErrors;
  result: Te2Result | null;
  onChange: (input: Te2Input) => void;
}

export function Te2Form({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<Te2Input>) => onChange({ ...input, ...patch });

  const switchTestosteroneUnit = (next: TestosteroneUnit) => {
    if (next === input.testosteroneUnit) return;
    const raw = parseConcentration(input.testosterone);
    let nextValue = input.testosterone;
    if (raw != null) {
      const ngDl = testosteroneToNgDl(raw, input.testosteroneUnit);
      if (ngDl != null) {
        nextValue = formatFieldValue(ngDlToTestosteroneUnit(ngDl, next));
      }
    }
    set({ testosteroneUnit: next, testosterone: nextValue });
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
        Educational mixed-unit T/E2 index: T(ng/dL) ÷ E2(pg/mL) after converting
        your entries to those units. Not the same as dividing both hormones after
        normalizing to one mass unit (e.g. 500 ng/dL and 25 pg/mL → 20 here, not
        200). Lab values stay in your browser only.
      </p>

      <div>
        <label className={labelClass} htmlFor="te2-testosterone">
          <span>Testosterone (T)</span>
          <InfoTooltip
            label="Testosterone (T)"
            text="Enter serum testosterone from your lab report. Default unit is ng/dL; switch to ng/mL or nmol/L if needed. Physical concentration is preserved when you change units."
          />
        </label>
        <FieldShell error={errors.testosterone}>
          <input
            id="te2-testosterone"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.testosterone}
            onChange={(e) => set({ testosterone: e.target.value })}
            aria-invalid={Boolean(errors.testosterone)}
          />
          <select
            className={selectClass}
            aria-label="Testosterone unit"
            value={input.testosteroneUnit}
            onChange={(e) =>
              switchTestosteroneUnit(e.target.value as TestosteroneUnit)
            }
          >
            {(
              Object.keys(TESTOSTERONE_UNIT_LABELS) as TestosteroneUnit[]
            ).map((u) => (
              <option key={u} value={u}>
                {TESTOSTERONE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.testosterone ? (
          <p className="mt-1 text-xs text-rose-600">{errors.testosterone}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="te2-estradiol">
          <span>Estradiol (E2)</span>
          <InfoTooltip
            label="Estradiol (E2)"
            text="Enter serum estradiol (E2). Default unit is pg/mL. Alternate units: ng/mL or pmol/L."
          />
        </label>
        <FieldShell error={errors.estradiol}>
          <input
            id="te2-estradiol"
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
            {(Object.keys(ESTRADIOL_UNIT_LABELS) as EstradiolUnit[]).map((u) => (
              <option key={u} value={u}>
                {ESTRADIOL_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.estradiol ? (
          <p className="mt-1 text-xs text-rose-600">{errors.estradiol}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="te2-ratio">
          <span>Ratio (T/E2)</span>
          <InfoTooltip
            label="Ratio (T/E2)"
            text="Mixed-unit index: testosterone in ng/dL divided by estradiol in pg/mL. Example: 500 ng/dL and 25 pg/mL → 20."
          />
        </label>
        <FieldShell muted>
          <input
            id="te2-ratio"
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