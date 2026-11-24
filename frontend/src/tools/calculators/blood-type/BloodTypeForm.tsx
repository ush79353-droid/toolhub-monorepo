'use client';

import { formatPercent } from './calculation';
import type {
  BloodTypeFieldErrors,
  BloodTypeInput,
  BloodTypeResult,
} from './types';
import { BLOOD_TYPE_OPTIONS, PHENOTYPE_GENOTYPE_ROWS } from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const resultClass =
  'h-11 w-full rounded-lg border border-sky-200 bg-sky-50/60 px-3 text-sm tabular-nums text-accent';

interface Props {
  input: BloodTypeInput;
  errors: BloodTypeFieldErrors;
  result: BloodTypeResult | null;
  onChange: (input: BloodTypeInput) => void;
}

export function BloodTypeForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<BloodTypeInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate>
      <section className={sectionClass} aria-label="Parent blood types">
        <div>
          <label className={labelClass} htmlFor="mother-blood-type">
            Mother blood type
          </label>
          <select
            id="mother-blood-type"
            className={selectClass}
            value={input.motherBloodType}
            onChange={(e) =>
              set({
                motherBloodType: e.target.value as BloodTypeInput['motherBloodType'],
              })
            }
            aria-invalid={Boolean(errors.motherBloodType)}
          >
            <option value="">Select</option>
            {BLOOD_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.motherBloodType ? (
            <p className="mt-1 text-xs text-rose-600">{errors.motherBloodType}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="father-blood-type">
            Father blood type
          </label>
          <select
            id="father-blood-type"
            className={selectClass}
            value={input.fatherBloodType}
            onChange={(e) =>
              set({
                fatherBloodType: e.target.value as BloodTypeInput['fatherBloodType'],
              })
            }
            aria-invalid={Boolean(errors.fatherBloodType)}
          >
            <option value="">Select</option>
            {BLOOD_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.fatherBloodType ? (
            <p className="mt-1 text-xs text-rose-600">{errors.fatherBloodType}</p>
          ) : null}
        </div>
      </section>

      {result?.abo && result.rh ? (
        <section className={sectionClass} aria-label="Offspring probabilities">
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultField label="Chance for type A" value={formatPercent(result.abo.A)} />
            <ResultField label="Chance for type B" value={formatPercent(result.abo.B)} />
            <ResultField label="Chance for type AB" value={formatPercent(result.abo.AB)} />
            <ResultField label="Chance for type O" value={formatPercent(result.abo.O)} />
            <ResultField
              label="Chance for Rh+"
              value={formatPercent(result.rh.positive)}
            />
            <ResultField
              label="Chance for Rh−"
              value={formatPercent(result.rh.negative)}
            />
          </div>
          {(result.motherGenotypeNote || result.fatherGenotypeNote) && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.motherGenotypeNote} {result.fatherGenotypeNote}
            </p>
          )}
          {result.statusDetail ? (
            <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
          ) : null}
        </section>
      ) : result ? (
        <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
      ) : null}

      {result?.punnett ? (
        <section className={sectionClass} aria-label="Punnett square">
          <h3 className="text-[13px] font-semibold text-accent">
            Punnett square for possible blood types
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[200px] border-collapse text-center text-xs text-accent">
              <thead>
                <tr>
                  <th className="border border-border bg-muted/40 p-2 font-medium">
                    ♂ \ ♀
                  </th>
                  {result.punnett.columnLabels.map((col) => (
                    <th
                      key={`col-${col}`}
                      className="border border-border bg-muted/40 p-2 font-medium"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.punnett.rowLabels.map((row, ri) => (
                  <tr key={`row-${row}`}>
                    <th className="border border-border bg-muted/40 p-2 font-medium">
                      {row}
                    </th>
                    {result.punnett!.cells[ri].map((cell, ci) => (
                      <td
                        key={`cell-${ri}-${ci}`}
                        className="border border-border bg-sky-50/50 p-2 font-mono"
                      >
                        {cell.genotype}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">{result.punnett.caption}</p>
        </section>
      ) : null}

      <section className={sectionClass} aria-label="Phenotype and genotype reference">
        <table className="w-full border-collapse text-left text-xs text-accent">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold">Phenotype</th>
              <th className="py-2 font-semibold">Genotype</th>
            </tr>
          </thead>
          <tbody>
            {PHENOTYPE_GENOTYPE_ROWS.map((row) => (
              <tr key={row.phenotype} className="border-b border-border/60">
                <td className="py-2 pr-3">{row.phenotype}</td>
                <td className="py-2">{row.genotype}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </form>
  );
}

function ResultField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className={resultClass} aria-live="polite">
        {value}
      </div>
    </div>
  );
}