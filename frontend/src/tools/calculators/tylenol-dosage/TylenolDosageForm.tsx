'use client';

import {
  defaultProductForSymptom,
  productsForSymptom,
  TYLENOL_SYMPTOMS,
  type TylenolDosageFieldErrors,
  type TylenolDosageInput,
  type TylenolDosageResult,
  type TylenolProductId,
  type TylenolSymptomId,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface TylenolDosageFormProps {
  input: TylenolDosageInput;
  errors: TylenolDosageFieldErrors;
  result: TylenolDosageResult | null;
  onChange: (input: TylenolDosageInput) => void;
}

export function TylenolDosageForm({
  input,
  errors,
  result,
  onChange,
}: TylenolDosageFormProps) {
  const products = productsForSymptom(input.symptom);

  const setSymptom = (symptom: TylenolSymptomId) => {
    const stillOk = productsForSymptom(symptom).some(
      (p) => p.id === input.product,
    );
    onChange({
      symptom,
      product: stillOk ? input.product : defaultProductForSymptom(symptom),
    });
  };

  return (
    <form
      className="space-y-4"
      noValidate
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational US OTC TYLENOL® Drug Facts lookup for adults and children
        12+. Schedules follow DailyMed labels — Extra Strength is every 6 hours
        (not a legacy 4–6 hour interval). Not medical advice; read your carton.
      </p>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Symptoms
        </legend>
        <div className="flex flex-col gap-2.5">
          {TYLENOL_SYMPTOMS.map((s) => (
            <label
              key={s.id}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="tylenol-symptom"
                className="h-4 w-4 border-border text-primary focus:ring-ring"
                checked={input.symptom === s.id}
                onChange={() => setSymptom(s.id)}
              />
              {s.label}
            </label>
          ))}
        </div>
        {errors.symptom ? (
          <p className="text-xs text-rose-600" role="alert">
            {errors.symptom}
          </p>
        ) : null}
      </fieldset>

      <div>
        <label htmlFor="tylenol-product" className={labelClass}>
          Tylenol product
        </label>
        <select
          id="tylenol-product"
          className={selectClass}
          value={input.product}
          aria-invalid={Boolean(errors.product)}
          onChange={(e) =>
            onChange({
              ...input,
              product: e.target.value as TylenolProductId,
            })
          }
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        {errors.product ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.product}
          </p>
        ) : null}
      </div>

      {result ? (
        <div className="space-y-2.5 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          {result.mismatchMessage ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-xs leading-relaxed text-amber-950/90">
              {result.mismatchMessage}
            </p>
          ) : null}
          <p className="text-sm leading-relaxed text-accent">
            {result.doseLine}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.maxLine}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.ingredientsLine}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.ageLine}
          </p>
          <p className="text-xs leading-relaxed text-rose-800/90">
            {result.comboWarning}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
          <p className="text-[11px] leading-relaxed text-muted-foreground/90">
            {result.sourceNote}
          </p>
        </div>
      ) : null}
    </form>
  );
}
