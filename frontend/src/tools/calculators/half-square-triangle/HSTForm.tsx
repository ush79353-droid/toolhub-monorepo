'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertLength } from './calculation';
import { HSTDiagram } from './HSTDiagram';
import {
  CUTTING_LABELS,
  METHOD_LABELS,
  MODE_LABELS,
  UNIT_LABELS,
  createEmptyInput,
  type HSTCalculationMode,
  type HSTConstructionMethod,
  type HSTCuttingPreference,
  type HSTFieldErrors,
  type HSTInput,
  type LengthUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface HSTFormProps {
  input: HSTInput;
  errors: HSTFieldErrors;
  blocksPerPair: number;
  onChange: (next: HSTInput) => void;
}

export function HSTForm({
  input,
  errors,
  blocksPerPair,
  onChange,
}: HSTFormProps) {
  const set = (patch: Partial<HSTInput>) => onChange({ ...input, ...patch });

  const switchUnit = (next: LengthUnit) => {
    if (next === input.unit) return;
    const keys = [
      'finishedSize',
      'rawSquareSize',
      'diagonal',
      'seamAllowance',
      'extraTrimmingAllowance',
    ] as const;
    const patch: Partial<HSTInput> = { unit: next };
    for (const key of keys) {
      const raw = input[key].trim();
      const n = Number(raw.replace(/,/g, ''));
      if (raw !== '' && Number.isFinite(n)) {
        patch[key] = String(
          Number(convertLength(n, input.unit, next).toFixed(4)),
        );
      }
    }
    set(patch);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Calculate finished/unfinished HST sizes, raw cutting squares, and
        diagonals. Traditional shortcuts ≠ exact geometry — pick your preference.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (4″ finished · traditional)
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
        <div className="space-y-3">
          <div>
            <label className={labelClass} htmlFor="hst-method">
              Construction method
            </label>
            <select
              id="hst-method"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.constructionMethod}
              onChange={(e) =>
                set({
                  constructionMethod: e.target
                    .value as HSTConstructionMethod,
                })
              }
            >
              {(
                Object.keys(METHOD_LABELS) as HSTConstructionMethod[]
              ).map((m) => (
                <option key={m} value={m}>
                  {METHOD_LABELS[m]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="hst-mode">
              Calculation mode
            </label>
            <select
              id="hst-mode"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.calculationMode}
              onChange={(e) =>
                set({
                  calculationMode: e.target.value as HSTCalculationMode,
                })
              }
            >
              {(Object.keys(MODE_LABELS) as HSTCalculationMode[]).map((m) => (
                <option key={m} value={m}>
                  {MODE_LABELS[m]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="hst-cut">
              Cutting preference
            </label>
            <select
              id="hst-cut"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.cuttingPreference}
              onChange={(e) =>
                set({
                  cuttingPreference: e.target.value as HSTCuttingPreference,
                })
              }
            >
              {(
                Object.keys(CUTTING_LABELS) as HSTCuttingPreference[]
              ).map((c) => (
                <option key={c} value={c}>
                  {CUTTING_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="hst-unit">
              Units
            </label>
            <select
              id="hst-unit"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.unit}
              onChange={(e) => switchUnit(e.target.value as LengthUnit)}
            >
              {(Object.keys(UNIT_LABELS) as LengthUnit[]).map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <HSTDiagram blocksPerPair={blocksPerPair} />
      </div>

      {input.calculationMode === 'finished-to-raw' ? (
        <div>
          <label className={labelClass} htmlFor="hst-fin">
            Finished length and width
            <InfoTooltip content="Visible HST block side length after sewing into the quilt." />
          </label>
          <FieldShell error={errors.finishedSize}>
            <input
              id="hst-fin"
              className={inputClass}
              inputMode="decimal"
              value={input.finishedSize}
              onChange={(e) => set({ finishedSize: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              {UNIT_LABELS[input.unit]}
            </span>
          </FieldShell>
          {errors.finishedSize ? (
            <p className="mt-1 text-xs text-rose-600">{errors.finishedSize}</p>
          ) : null}
        </div>
      ) : null}

      {input.calculationMode === 'raw-to-finished' ? (
        <div>
          <label className={labelClass} htmlFor="hst-raw">
            Length and width of raw square
          </label>
          <FieldShell error={errors.rawSquareSize}>
            <input
              id="hst-raw"
              className={inputClass}
              inputMode="decimal"
              value={input.rawSquareSize}
              onChange={(e) => set({ rawSquareSize: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              {UNIT_LABELS[input.unit]}
            </span>
          </FieldShell>
          {errors.rawSquareSize ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.rawSquareSize}
            </p>
          ) : null}
        </div>
      ) : null}

      {input.calculationMode === 'diagonal-to-side' ? (
        <div>
          <label className={labelClass} htmlFor="hst-diag">
            Diagonal
          </label>
          <FieldShell error={errors.diagonal}>
            <input
              id="hst-diag"
              className={inputClass}
              inputMode="decimal"
              value={input.diagonal}
              onChange={(e) => set({ diagonal: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              {UNIT_LABELS[input.unit]}
            </span>
          </FieldShell>
          {errors.diagonal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.diagonal}</p>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.showAdvanced}
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
        >
          Advanced (seam, trim, quantity)
          <span className="text-xs font-normal text-muted-foreground">
            {input.showAdvanced ? 'Hide' : 'Show'}
          </span>
        </button>
        {input.showAdvanced ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="hst-seam">
                Seam allowance
              </label>
              <FieldShell error={errors.seamAllowance}>
                <input
                  id="hst-seam"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.seamAllowance}
                  onChange={(e) => set({ seamAllowance: e.target.value })}
                />
              </FieldShell>
              {errors.seamAllowance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.seamAllowance}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="hst-extra">
                Extra trimming allowance
              </label>
              <FieldShell error={errors.extraTrimmingAllowance}>
                <input
                  id="hst-extra"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.extraTrimmingAllowance}
                  onChange={(e) =>
                    set({ extraTrimmingAllowance: e.target.value })
                  }
                />
              </FieldShell>
              {errors.extraTrimmingAllowance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.extraTrimmingAllowance}
                </p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="hst-qty">
                Required HST blocks (optional)
              </label>
              <FieldShell error={errors.requiredBlocks}>
                <input
                  id="hst-qty"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.requiredBlocks}
                  onChange={(e) => set({ requiredBlocks: e.target.value })}
                />
              </FieldShell>
              {errors.requiredBlocks ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.requiredBlocks}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
