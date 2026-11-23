'use client';

import {
  BENZODIAZEPINE_DRUGS,
  DURATION_GROUP_LABEL,
  type DurationGroup,
} from './drug-data';
import { formatDoseMg } from './calculation';
import type {
  BenzodiazepineConversionInput,
  BenzodiazepineConversionResult,
  BenzodiazepineFieldErrors,
} from './types';
import { createEmptyDoses } from './types';

const labelClass = 'text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface Props {
  input: BenzodiazepineConversionInput;
  errors: BenzodiazepineFieldErrors;
  result: BenzodiazepineConversionResult | null;
  onChange: (input: BenzodiazepineConversionInput) => void;
}

const GROUP_ORDER: DurationGroup[] = ['short', 'intermediate', 'long'];

export function BenzodiazepineConversionForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const setDose = (
    id: (typeof BENZODIAZEPINE_DRUGS)[number]['id'],
    value: string,
  ) => {
    const doses = createEmptyDoses();
    doses[id] = value;
    onChange({ doses });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate>
      <p className="rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2 text-xs text-muted-foreground">
        Enter the dose of one drug (mg) to receive approximate equivalents in the other
        fields. Educational comparisons only—not for switching or taper schedules.
      </p>
      {GROUP_ORDER.map((group) => (
        <section key={group} className={sectionClass} aria-label={DURATION_GROUP_LABEL[group]}>
          <h3 className="text-sm font-semibold text-accent">
            {DURATION_GROUP_LABEL[group]}
          </h3>
          <div className="mt-2 space-y-3">
            {BENZODIAZEPINE_DRUGS.filter((d) => d.durationGroup === group).map(
              (drug) => {
                const isSource = result?.activeSourceId === drug.id;
                const showConverted =
                  !isSource &&
                  result?.convertedDoses[drug.id] != null &&
                  input.doses[drug.id].trim() === '';
                const fieldValue = showConverted
                  ? formatDoseMg(result!.convertedDoses[drug.id])
                  : input.doses[drug.id];
                return (
                  <div key={drug.id}>
                    <label className={labelClass} htmlFor={`bz-${drug.id}`}>
                      {drug.label} ({drug.brand})
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id={`bz-${drug.id}`}
                        type="text"
                        inputMode="decimal"
                        className={`${inputClass} ${
                          showConverted ? 'bg-sky-50/60 text-muted-foreground' : ''
                        }`}
                        value={fieldValue}
                        readOnly={showConverted}
                        onChange={(e) => setDose(drug.id, e.target.value)}
                        aria-invalid={Boolean(errors[drug.id])}
                      />
                      <span className="shrink-0 text-xs text-muted-foreground">mg</span>
                    </div>
                    {errors[drug.id] ? (
                      <p className="text-xs text-rose-600">{errors[drug.id]}</p>
                    ) : null}
                  </div>
                );
              },
            )}
          </div>
        </section>
      ))}
      {result?.statusDetail ? (
        <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
      ) : null}
    </form>
  );
}