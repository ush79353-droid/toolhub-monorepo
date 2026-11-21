'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ComparativeAdvantageFieldErrors,
  ComparativeAdvantageInput,
  ComparativeAdvantageResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface ComparativeAdvantageFormProps {
  input: ComparativeAdvantageInput;
  errors: ComparativeAdvantageFieldErrors;
  result: ComparativeAdvantageResult | null;
  onChange: (input: ComparativeAdvantageInput) => void;
  onLoadExample: () => void;
}

export function ComparativeAdvantageForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: ComparativeAdvantageFormProps) {
  const [openX, setOpenX] = useState(true);
  const [openY, setOpenY] = useState(true);
  const set = (patch: Partial<ComparativeAdvantageInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Enter output per labor unit for each good (same resource assumption per
 country). Comparative advantage uses opportunity cost; not who produces
        more. Absolute advantage is shown separately.
      </p>
      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load worked example (100/80 vs 90/90)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between bg-muted/30 px-3 py-3 text-left text-sm font-semibold text-accent"
          onClick={() => setOpenX((v) => !v)}
          aria-expanded={openX}
        >
          Country X
          <ChevronDown
            className={`h-4 w-4 transition-transform ${openX ? 'rotate-180' : ''}`}
          />
        </button>
        {openX ? (
          <div className="space-y-3 p-3 sm:p-4">
            <div>
              <label htmlFor="ca-xa" className={labelClass}>
 Output per labor unit; Good A
                <InfoTooltip
                  label="Good A productivity X"
                  text="Maximum Good A Country X can produce per unit of labor under the linear PPF assumption."
                />
              </label>
              <FieldShell error={errors.countryXGoodA}>
                <input
                  id="ca-xa"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.countryXGoodA}
                  onChange={(e) => set({ countryXGoodA: e.target.value })}
                  placeholder="100"
                />
                <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
                  units/labor-h
                </span>
              </FieldShell>
              {errors.countryXGoodA ? (
                <p className="mt-1 text-xs text-rose-600">{errors.countryXGoodA}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ca-xb" className={labelClass}>
 Output per labor unit; Good B
              </label>
              <FieldShell error={errors.countryXGoodB}>
                <input
                  id="ca-xb"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.countryXGoodB}
                  onChange={(e) => set({ countryXGoodB: e.target.value })}
                  placeholder="80"
                />
                <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
                  units/labor-h
                </span>
              </FieldShell>
              {errors.countryXGoodB ? (
                <p className="mt-1 text-xs text-rose-600">{errors.countryXGoodB}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ca-cxa" className={labelClass}>
 Comparative advantage; Good A
              </label>
              <FieldShell muted>
                <input
                  id="ca-cxa"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default font-semibold`}
                  value={result?.labelCompXA ?? ''}
                  placeholder="—"
                />
              </FieldShell>
            </div>
            <div>
              <label htmlFor="ca-cxb" className={labelClass}>
 Comparative advantage; Good B
              </label>
              <FieldShell muted>
                <input
                  id="ca-cxb"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default font-semibold`}
                  value={result?.labelCompXB ?? ''}
                  placeholder="—"
                />
              </FieldShell>
            </div>
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between bg-muted/30 px-3 py-3 text-left text-sm font-semibold text-accent"
          onClick={() => setOpenY((v) => !v)}
          aria-expanded={openY}
        >
          Country Y
          <ChevronDown
            className={`h-4 w-4 transition-transform ${openY ? 'rotate-180' : ''}`}
          />
        </button>
        {openY ? (
          <div className="space-y-3 p-3 sm:p-4">
            <div>
              <label htmlFor="ca-ya" className={labelClass}>
 Output per labor unit; Good A
              </label>
              <FieldShell error={errors.countryYGoodA}>
                <input
                  id="ca-ya"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.countryYGoodA}
                  onChange={(e) => set({ countryYGoodA: e.target.value })}
                  placeholder="90"
                />
                <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
                  units/labor-h
                </span>
              </FieldShell>
              {errors.countryYGoodA ? (
                <p className="mt-1 text-xs text-rose-600">{errors.countryYGoodA}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ca-yb" className={labelClass}>
 Output per labor unit; Good B
              </label>
              <FieldShell error={errors.countryYGoodB}>
                <input
                  id="ca-yb"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.countryYGoodB}
                  onChange={(e) => set({ countryYGoodB: e.target.value })}
                  placeholder="90"
                />
                <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
                  units/labor-h
                </span>
              </FieldShell>
              {errors.countryYGoodB ? (
                <p className="mt-1 text-xs text-rose-600">{errors.countryYGoodB}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ca-cya" className={labelClass}>
 Comparative advantage; Good A
              </label>
              <FieldShell muted>
                <input
                  id="ca-cya"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default font-semibold`}
                  value={result?.labelCompYA ?? ''}
                  placeholder="—"
                />
              </FieldShell>
            </div>
            <div>
              <label htmlFor="ca-cyb" className={labelClass}>
 Comparative advantage; Good B
              </label>
              <FieldShell muted>
                <input
                  id="ca-cyb"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default font-semibold`}
                  value={result?.labelCompYB ?? ''}
                  placeholder="—"
                />
              </FieldShell>
            </div>
          </div>
        ) : null}
      </section>

      <div>
        <label htmlFor="ca-h" className={labelClass}>
          Common labor endowment H (for PPF chart)
          <InfoTooltip
            label="Labor endowment"
            text="Intercepts = H × productivity. Default H=1 shows productivity rates as intercepts. Does not change opportunity-cost ratios."
          />
        </label>
        <FieldShell error={errors.laborEndowment}>
          <input
            id="ca-h"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.laborEndowment}
            onChange={(e) => set({ laborEndowment: e.target.value })}
          />
        </FieldShell>
        {errors.laborEndowment ? (
          <p className="mt-1 text-xs text-rose-600">{errors.laborEndowment}</p>
        ) : null}
      </div>
    </form>
  );
}
