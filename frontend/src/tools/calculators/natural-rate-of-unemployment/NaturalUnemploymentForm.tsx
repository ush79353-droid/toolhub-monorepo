'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  NaturalUnemploymentFieldErrors,
  NaturalUnemploymentInput,
  NaturalUnemploymentResult,
  PopulationUnit,
} from './types';
import { POPULATION_UNITS, POPULATION_UNIT_LABEL } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-0 bg-transparent pr-1 text-sm font-medium text-primary outline-none';

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

interface NaturalUnemploymentFormProps {
  input: NaturalUnemploymentInput;
  errors: NaturalUnemploymentFieldErrors;
  result: NaturalUnemploymentResult | null;
  onChange: (input: NaturalUnemploymentInput) => void;
  onUnitChange: (
    field: 'frictionalUnit' | 'structuralUnit' | 'laborForceUnit',
    unit: PopulationUnit
  ) => void;
}

export function NaturalUnemploymentForm({
  input,
  errors,
  result,
  onChange,
  onUnitChange,
}: NaturalUnemploymentFormProps) {
  const set = (patch: Partial<NaturalUnemploymentInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="nru-frictional">
          <span>Frictionally unemployed</span>
          <InfoTooltip
            label="Frictionally unemployed"
            text="People temporarily between jobs or searching for a first/better job. Enter a nonnegative count; choose people, thousand, or million."
          />
        </label>
        <FieldShell error={errors.frictional}>
          <input
            id="nru-frictional"
            className={inputClass}
            inputMode="decimal"
            value={input.frictional}
            aria-invalid={Boolean(errors.frictional)}
            onChange={(e) => set({ frictional: e.target.value })}
          />
          <select
            id="nru-frictional-unit"
            className={selectClass}
            value={input.frictionalUnit}
            aria-label="Frictionally unemployed unit"
            onChange={(e) =>
              onUnitChange('frictionalUnit', e.target.value as PopulationUnit)
            }
          >
            {POPULATION_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {POPULATION_UNIT_LABEL[unit]}
              </option>
            ))}
          </select>
          {input.frictionalUnit !== 'people' ? (
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden>
              people
            </span>
          ) : (
            <span className="pr-2" aria-hidden />
          )}
        </FieldShell>
        {errors.frictional ? (
          <p className="mt-1 text-xs text-rose-600">{errors.frictional}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="nru-structural">
          <span>Structurally unemployed</span>
          <InfoTooltip
            label="Structurally unemployed"
            text="People unemployed because of lasting mismatches in skills, industry, or location. Nonnegative count with an independent population unit."
          />
        </label>
        <FieldShell error={errors.structural}>
          <input
            id="nru-structural"
            className={inputClass}
            inputMode="decimal"
            value={input.structural}
            aria-invalid={Boolean(errors.structural)}
            onChange={(e) => set({ structural: e.target.value })}
          />
          <select
            id="nru-structural-unit"
            className={selectClass}
            value={input.structuralUnit}
            aria-label="Structurally unemployed unit"
            onChange={(e) =>
              onUnitChange('structuralUnit', e.target.value as PopulationUnit)
            }
          >
            {POPULATION_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {POPULATION_UNIT_LABEL[unit]}
              </option>
            ))}
          </select>
          {input.structuralUnit !== 'people' ? (
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden>
              people
            </span>
          ) : (
            <span className="pr-2" aria-hidden />
          )}
        </FieldShell>
        {errors.structural ? (
          <p className="mt-1 text-xs text-rose-600">{errors.structural}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="nru-labor">
          <span>Total labor force</span>
          <InfoTooltip
            label="Total labor force"
            text="Employed plus unemployed people. Must be greater than zero and at least as large as frictional plus structural unemployment."
          />
        </label>
        <FieldShell error={errors.laborForce}>
          <input
            id="nru-labor"
            className={inputClass}
            inputMode="decimal"
            value={input.laborForce}
            aria-invalid={Boolean(errors.laborForce)}
            onChange={(e) => set({ laborForce: e.target.value })}
          />
          <select
            id="nru-labor-unit"
            className={selectClass}
            value={input.laborForceUnit}
            aria-label="Total labor force unit"
            onChange={(e) =>
              onUnitChange('laborForceUnit', e.target.value as PopulationUnit)
            }
          >
            {POPULATION_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {POPULATION_UNIT_LABEL[unit]}
              </option>
            ))}
          </select>
          {input.laborForceUnit !== 'people' ? (
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden>
              people
            </span>
          ) : (
            <span className="pr-2" aria-hidden />
          )}
        </FieldShell>
        {errors.laborForce ? (
          <p className="mt-1 text-xs text-rose-600">{errors.laborForce}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="nru-rate">
          <span>Natural rate of unemployment</span>
        </label>
        <FieldShell muted>
          <input
            id="nru-rate"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={result?.formattedNaturalRate ?? ''}
            aria-readonly="true"
          />
          <span className="shrink-0 pr-3 text-sm font-medium text-primary" aria-hidden>
            %
          </span>
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      <p className="text-xs leading-relaxed text-muted-foreground">
        Simplified natural-rate model: frictional + structural only. Cyclical unemployment is not
        included.
      </p>
    </form>
  );
}
