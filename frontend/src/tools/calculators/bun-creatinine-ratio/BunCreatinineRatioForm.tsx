'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  bunFromMgDl,
  bunToMgDl,
  creatinineFromMgDl,
  creatinineToMgDl,
  formatMeasure,
  formatRatio,
  parseNumber,
} from './calculation';
import type {
  BunCreatinineRatioFieldErrors,
  BunCreatinineRatioInput,
  BunCreatinineRatioResult,
  BunUnit,
  CreatinineUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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
  input: BunCreatinineRatioInput;
  errors: BunCreatinineRatioFieldErrors;
  result: BunCreatinineRatioResult | null;
  onChange: (input: BunCreatinineRatioInput) => void;
}

export function BunCreatinineRatioForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<BunCreatinineRatioInput>) =>
    onChange({ ...input, ...patch });

  const switchBunUnit = (next: BunUnit) => {
    if (next === input.bunUnit) return;
    const n = parseNumber(input.bunText);
    if (n === null) {
      set({ bunUnit: next });
      return;
    }
    const mg = bunToMgDl(n, input.bunUnit);
    const converted = bunFromMgDl(mg, next);
    set({ bunUnit: next, bunText: formatMeasure(converted, 4) });
  };

  const switchCreatinineUnit = (next: CreatinineUnit) => {
    if (next === input.creatinineUnit) return;
    const n = parseNumber(input.creatinineText);
    if (n === null) {
      set({ creatinineUnit: next });
      return;
    }
    const mg = creatinineToMgDl(n, input.creatinineUnit);
    const converted = creatinineFromMgDl(mg, next);
    set({ creatinineUnit: next, creatinineText: formatMeasure(converted, 4) });
  };

  const ratioDisplay =
    result?.ratio != null ? formatRatio(result.ratio) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="BUN creatinine ratio inputs">
        <div>
          <label className={labelClass} htmlFor="bun-cr-bun">
            BUN (blood urea nitrogen)
            <InfoTooltip text="BUN is nitrogen mass. Choose urea mmol/L or urea mg/dL if your lab reports whole urea — values convert to BUN mg/dL before the ratio." />
          </label>
          <FieldShell error={errors.bunText}>
            <input
              id="bun-cr-bun"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.bunText}
              onChange={(e) => set({ bunText: e.target.value })}
              aria-invalid={Boolean(errors.bunText)}
            />
            <select
              className={unitSelectClass}
              value={input.bunUnit}
              onChange={(e) => switchBunUnit(e.target.value as BunUnit)}
              aria-label="BUN unit"
            >
              <option value="mg_dl_bun">mg/dL</option>
              <option value="mmol_l_urea">mmol/L urea</option>
              <option value="mg_dl_urea">mg/dL urea</option>
            </select>
          </FieldShell>
          {errors.bunText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bunText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bun-cr-scr">
            Serum creatinine
            <InfoTooltip text="Conventional mg/dL or SI µmol/L. µmol/L is divided by 88.4 to reach mg/dL before the ratio." />
          </label>
          <FieldShell error={errors.creatinineText}>
            <input
              id="bun-cr-scr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.creatinineText}
              onChange={(e) => set({ creatinineText: e.target.value })}
              aria-invalid={Boolean(errors.creatinineText)}
            />
            <select
              className={unitSelectClass}
              value={input.creatinineUnit}
              onChange={(e) =>
                switchCreatinineUnit(e.target.value as CreatinineUnit)
              }
              aria-label="Creatinine unit"
            >
              <option value="mg_dl">mg/dL</option>
              <option value="umol_l">µmol/L</option>
            </select>
          </FieldShell>
          {errors.creatinineText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.creatinineText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bun-cr-ratio">
            BUN creatinine ratio
            <InfoTooltip text="Dimensionless BUN (mg/dL) ÷ creatinine (mg/dL). Blank when either input is missing or creatinine is zero." />
          </label>
          <FieldShell muted>
            <input
              id="bun-cr-ratio"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={ratioDisplay}
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        {result?.ratio != null && result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}

        <p className="text-sm">
          <a
            href="#how-to-calculate"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Check out <strong>how to use this calculator!</strong>
          </a>
        </p>
      </section>
    </form>
  );
}
