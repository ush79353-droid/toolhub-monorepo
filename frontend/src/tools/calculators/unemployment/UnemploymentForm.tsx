'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PopulationUnit,
  UnemploymentFieldErrors,
  UnemploymentInput,
  UnemploymentResult,
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

interface UnemploymentFormProps {
  input: UnemploymentInput;
  errors: UnemploymentFieldErrors;
  result: UnemploymentResult | null;
  participationOpen: boolean;
  dirty: boolean;
  onChange: (input: UnemploymentInput) => void;
  onUnitChange: (
    field: 'employedUnit' | 'unemployedUnit' | 'laborForceUnit' | 'workingAgeUnit',
    unit: PopulationUnit
  ) => void;
  onToggleParticipation: () => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function UnemploymentForm({
  input,
  errors,
  result,
  participationOpen,
  dirty,
  onChange,
  onUnitChange,
  onToggleParticipation,
  onLoadExample,
  onClear,
  onReset,
}: UnemploymentFormProps) {
  const set = (
    patch: Partial<UnemploymentInput>,
    driver?: UnemploymentInput['driver']
  ) =>
    onChange({
      ...input,
      ...patch,
      ...(driver ? { driver } : {}),
    });

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Enter employed and unemployed people (or any two of employed, unemployed, and labor force).
        Population selectors convert people / thousand / million before calculating. Unemployed means
        people without a job who are actively seeking and available for work — not everyone without
        employment.
      </p>

      <form
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        <div>
          <label className={labelClass} htmlFor="ue-employed">
            <span>Employed people</span>
            <InfoTooltip
              label="Employed people"
              text="People with a job. Nonnegative count. Choose people, thousand, or million. Zero is allowed."
            />
          </label>
          <FieldShell error={errors.employed}>
            <input
              id="ue-employed"
              className={inputClass}
              inputMode="decimal"
              value={input.employed}
              aria-invalid={Boolean(errors.employed)}
              onChange={(e) => set({ employed: e.target.value }, 'employed')}
            />
            <select
              id="ue-employed-unit"
              className={selectClass}
              value={input.employedUnit}
              aria-label="Employed people unit"
              onChange={(e) =>
                onUnitChange('employedUnit', e.target.value as PopulationUnit)
              }
            >
              {POPULATION_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {POPULATION_UNIT_LABEL[unit]}
                </option>
              ))}
            </select>
            {input.employedUnit !== 'people' ? (
              <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden>
                people
              </span>
            ) : (
              <span className="pr-2" aria-hidden />
            )}
          </FieldShell>
          {errors.employed ? (
            <p className="mt-1 text-xs text-rose-600">{errors.employed}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ue-unemployed">
            <span>Unemployed people</span>
            <InfoTooltip
              label="Unemployed people"
              text="People without a job who are actively seeking and available for work. Do not count everyone without employment. Nonnegative; zero allowed."
            />
          </label>
          <FieldShell error={errors.unemployed}>
            <input
              id="ue-unemployed"
              className={inputClass}
              inputMode="decimal"
              value={input.unemployed}
              aria-invalid={Boolean(errors.unemployed)}
              onChange={(e) => set({ unemployed: e.target.value }, 'unemployed')}
            />
            <select
              id="ue-unemployed-unit"
              className={selectClass}
              value={input.unemployedUnit}
              aria-label="Unemployed people unit"
              onChange={(e) =>
                onUnitChange('unemployedUnit', e.target.value as PopulationUnit)
              }
            >
              {POPULATION_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {POPULATION_UNIT_LABEL[unit]}
                </option>
              ))}
            </select>
            {input.unemployedUnit !== 'people' ? (
              <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden>
                people
              </span>
            ) : (
              <span className="pr-2" aria-hidden />
            )}
          </FieldShell>
          {errors.unemployed ? (
            <p className="mt-1 text-xs text-rose-600">{errors.unemployed}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ue-labor">
            <span>Labor force</span>
            <InfoTooltip
              label="Labor force"
              text="Employed + unemployed. Enter any two of employed, unemployed, and labor force to derive the third when consistent. Must be at least as large as unemployed."
            />
          </label>
          <FieldShell error={errors.laborForce}>
            <input
              id="ue-labor"
              className={inputClass}
              inputMode="decimal"
              value={input.laborForce}
              aria-invalid={Boolean(errors.laborForce)}
              onChange={(e) => set({ laborForce: e.target.value }, 'laborForce')}
            />
            <select
              id="ue-labor-unit"
              className={selectClass}
              value={input.laborForceUnit}
              aria-label="Labor force unit"
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
          <label className={labelClass} htmlFor="ue-rate">
            <span>Unemployment rate</span>
            <InfoTooltip
              label="Unemployment rate"
              text="Unemployed ÷ labor force × 100. Undefined when labor force is zero. Display only — not unit-converted."
            />
          </label>
          <FieldShell muted>
            <input
              id="ue-rate"
              className={inputClass}
              readOnly
              tabIndex={-1}
              value={result?.formattedUnemploymentRate ?? ''}
              aria-readonly="true"
              aria-label="Unemployment rate percent"
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
        {result?.interpretation ? (
          <p className="text-xs leading-relaxed text-muted-foreground">{result.interpretation}</p>
        ) : null}
      </form>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <button
          type="button"
          className="flex w-full items-center gap-2 text-left text-sm font-semibold text-accent"
          aria-expanded={participationOpen}
          onClick={onToggleParticipation}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              participationOpen ? 'rotate-0' : '-rotate-90'
            }`}
            aria-hidden
          />
          Labor force participation
        </button>

        {participationOpen ? (
          <div className="space-y-3.5 border-t border-border pt-3.5">
            <div>
              <label className={labelClass} htmlFor="ue-working-age">
                <span>Working-age population</span>
                <InfoTooltip
                  label="Working-age population"
                  text="Population used as the participation-rate denominator. Must be greater than zero and at least as large as the labor force."
                />
              </label>
              <FieldShell error={errors.workingAge}>
                <input
                  id="ue-working-age"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.workingAge}
                  aria-invalid={Boolean(errors.workingAge)}
                  onChange={(e) => set({ workingAge: e.target.value })}
                />
                <select
                  id="ue-working-age-unit"
                  className={selectClass}
                  value={input.workingAgeUnit}
                  aria-label="Working-age population unit"
                  onChange={(e) =>
                    onUnitChange('workingAgeUnit', e.target.value as PopulationUnit)
                  }
                >
                  {POPULATION_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {POPULATION_UNIT_LABEL[unit]}
                    </option>
                  ))}
                </select>
                {input.workingAgeUnit !== 'people' ? (
                  <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden>
                    people
                  </span>
                ) : (
                  <span className="pr-2" aria-hidden />
                )}
              </FieldShell>
              {errors.workingAge ? (
                <p className="mt-1 text-xs text-rose-600">{errors.workingAge}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ue-lfpr">
                <span>Labor force participation rate</span>
              </label>
              <FieldShell muted>
                <input
                  id="ue-lfpr"
                  className={inputClass}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedParticipationRate ?? ''}
                  aria-readonly="true"
                  aria-label="Labor force participation rate percent"
                />
                <span className="shrink-0 pr-3 text-sm font-medium text-primary" aria-hidden>
                  %
                </span>
              </FieldShell>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
            Example — 6.25%
          </Button>
          <Button type="button" variant="outline" className="h-11" onClick={onReset}>
            Reload calculator
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-11"
            disabled={!dirty}
            onClick={onClear}
          >
            Clear all changes
          </Button>
        </div>
      </div>
    </div>
  );
}
