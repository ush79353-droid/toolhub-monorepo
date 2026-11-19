'use client';

import { Button } from '@/components/ui/button';
import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  DISABILITY_RATINGS,
  nextConditionId,
  type DisabilityRating,
  type LimbSide,
  type MaritalStatus,
  type VaDisabilityFieldErrors,
  type VaDisabilityInput,
  type VaDisabilityResult,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const controlClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface VaDisabilityFormProps {
  input: VaDisabilityInput;
  errors: VaDisabilityFieldErrors;
  result: VaDisabilityResult | null;
  onChange: (next: VaDisabilityInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
}

export function VaDisabilityForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
}: VaDisabilityFormProps) {
  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
    >
      <section className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5">
        <h3 className="text-sm font-semibold text-accent">Disability ranking</h3>
        {input.conditions.map((condition, index) => (
          <div key={condition.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1.2fr_auto] sm:items-end">
            <div>
              <label className={labelClass} htmlFor={`${condition.id}-rating`}>
                Condition #{index + 1}
              </label>
              <select
                id={`${condition.id}-rating`}
                className={controlClass}
                value={condition.rating}
                onChange={(event) => {
                  const rating = Number(event.target.value) as DisabilityRating;
                  onChange({
                    ...input,
                    conditions: input.conditions.map((row) =>
                      row.id === condition.id ? { ...row, rating } : row,
                    ),
                  });
                }}
              >
                {DISABILITY_RATINGS.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}%
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor={`${condition.id}-limb`}>
                Paired limb
              </label>
              <select
                id={`${condition.id}-limb`}
                className={controlClass}
                value={condition.limb}
                onChange={(event) => {
                  const limb = event.target.value as LimbSide;
                  onChange({
                    ...input,
                    conditions: input.conditions.map((row) =>
                      row.id === condition.id ? { ...row, limb } : row,
                    ),
                  });
                }}
              >
                <option value="none">Not a paired limb</option>
                <option value="left-arm">Left arm</option>
                <option value="right-arm">Right arm</option>
                <option value="left-leg">Left leg</option>
                <option value="right-leg">Right leg</option>
              </select>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() =>
                onChange({
                  ...input,
                  conditions: input.conditions.filter((row) => row.id !== condition.id),
                })
              }
            >
              Remove
            </Button>
          </div>
        ))}
        {errors.conditions ? <p className="text-xs text-rose-600">{errors.conditions}</p> : null}
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() =>
            onChange({
              ...input,
              conditions: [
                ...input.conditions,
                { id: nextConditionId(), rating: 0, limb: 'none' },
              ],
            })
          }
        >
          Add condition
        </Button>
        <p className="text-xs text-muted-foreground">
          Mark a limb only for a rating you believe qualifies under 38 CFR 4.26. One limb alone does not get the bilateral factor.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5">
        <h3 className="text-sm font-semibold text-accent">Dependent family members</h3>
        <fieldset>
          <legend className={labelClass}>Marital status</legend>
          <div className="flex gap-4 text-sm">
            {(['single', 'married'] as const).map((status) => (
              <label key={status} className="inline-flex items-center gap-2 capitalize">
                <input
                  type="radio"
                  name="va-marital"
                  className="h-4 w-4 accent-primary"
                  checked={input.dependents.maritalStatus === status}
                  onChange={() =>
                    onChange({
                      ...input,
                      dependents: {
                        ...input.dependents,
                        maritalStatus: status as MaritalStatus,
                      },
                    })
                  }
                />
                {status}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="va-minors">
              Children under age 18
            </label>
            <select
              id="va-minors"
              className={controlClass}
              value={input.dependents.childrenUnder18}
              onChange={(event) =>
                onChange({
                  ...input,
                  dependents: {
                    ...input.dependents,
                    childrenUnder18: Number(event.target.value),
                  },
                })
              }
            >
              {Array.from({ length: 11 }, (_, count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="va-school">
              Children over 18 in school
            </label>
            <select
              id="va-school"
              className={controlClass}
              value={input.dependents.childrenOver18InSchool}
              onChange={(event) =>
                onChange({
                  ...input,
                  dependents: {
                    ...input.dependents,
                    childrenOver18InSchool: Number(event.target.value),
                  },
                })
              }
            >
              {Array.from({ length: 11 }, (_, count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="va-parents">
              Parent
            </label>
            <select
              id="va-parents"
              className={controlClass}
              value={input.dependents.dependentParents}
              onChange={(event) =>
                onChange({
                  ...input,
                  dependents: {
                    ...input.dependents,
                    dependentParents: Number(event.target.value) as 0 | 1 | 2,
                  },
                })
              }
            >
              <option value={0}>None</option>
              <option value={1}>1 dependent parent</option>
              <option value={2}>2 dependent parents</option>
            </select>
          </div>
        </div>
        {errors.dependents ? <p className="text-xs text-rose-600">{errors.dependents}</p> : null}
        <p className="text-xs text-muted-foreground">
          Dependents change the payment estimate only when the rounded rating is 30% or higher. They do not change the combined percentage.
        </p>
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section aria-live="polite" className="space-y-2 rounded-xl border border-border bg-white p-3.5">
          <h3 className="text-sm font-semibold text-accent">Results</h3>
          <p className="text-2xl font-semibold tabular-nums text-accent">{result.combinedRating}%</p>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Before rounding</dt>
              <dd className="font-medium tabular-nums">{result.combinedBeforeRounding}%</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Estimated monthly compensation</dt>
              <dd className="font-medium tabular-nums">
                {formatCurrencyValue(result.monthlyCompensation, 'USD')}
              </dd>
            </div>
          </dl>
          <p className="text-sm leading-relaxed text-foreground/90">{result.explanation}</p>
          <p className="text-xs text-muted-foreground">
            {result.bilateralApplied
              ? `Bilateral factor applied. Bilateral subtotal ${result.bilateralCombined}%.`
              : 'Bilateral factor not applied.'}{' '}
            Rates effective {result.effectiveDate}. Aid and Attendance is not included.
          </p>
        </section>
      ) : null}
    </form>
  );
}
