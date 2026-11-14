'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ExpectedReturnFieldErrors,
  ExpectedReturnInput,
  ExpectedReturnResult,
  ScenarioDraft,
} from './types';

interface ExpectedReturnFormProps {
  input: ExpectedReturnInput;
  errors: ExpectedReturnFieldErrors;
  result: ExpectedReturnResult | null;
  onChange: (input: ExpectedReturnInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor?: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function ExpectedReturnForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: ExpectedReturnFormProps) {
  const setScenario = (index: number, patch: Partial<ScenarioDraft>) => {
    const scenarios = input.scenarios.map((row, i) =>
      i === index ? { ...row, ...patch } : row
    );
    onChange({ scenarios });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
        Enter the probability, Stock A return, and Stock B return for each scenario. New scenarios
        appear automatically as you enter data.
      </p>

      <div className="space-y-3">
        {input.scenarios.map((scenario, index) => {
          const n = index + 1;
          const probErr = errors[`scenario${n}Probability`];
          const aErr = errors[`scenario${n}StockA`];
          const bErr = errors[`scenario${n}StockB`];

          return (
            <div
              key={n}
              className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-muted/10 p-3 sm:grid-cols-3 sm:gap-2.5"
            >
              <div>
                <FieldLabel
                  htmlFor={`er-prob-${n}`}
                  label={`Prob. scn. ${n}`}
                  tip="Probability of this scenario (0–100%). All scenario probabilities must total 100%."
                />
                <div className="relative">
                  <input
                    id={`er-prob-${n}`}
                    className={`${inputClass} pr-8`}
                    inputMode="decimal"
                    value={scenario.probability}
                    aria-invalid={Boolean(probErr)}
                    onChange={(e) => setScenario(index, { probability: e.target.value })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    %
                  </span>
                </div>
                {probErr ? <p className="mt-1 text-xs text-rose-600">{probErr}</p> : null}
              </div>

              <div>
                <FieldLabel
                  htmlFor={`er-a-${n}`}
                  label="Stock A"
                  tip="Return for Stock A in this scenario (%). Negatives are allowed."
                />
                <div className="relative">
                  <input
                    id={`er-a-${n}`}
                    className={`${inputClass} pr-8`}
                    inputMode="decimal"
                    value={scenario.stockA}
                    aria-invalid={Boolean(aErr)}
                    onChange={(e) => setScenario(index, { stockA: e.target.value })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    %
                  </span>
                </div>
                {aErr ? <p className="mt-1 text-xs text-rose-600">{aErr}</p> : null}
              </div>

              <div>
                <FieldLabel
                  htmlFor={`er-b-${n}`}
                  label="Stock B"
                  tip="Return for Stock B in this scenario (%). Negatives are allowed."
                />
                <div className="relative">
                  <input
                    id={`er-b-${n}`}
                    className={`${inputClass} pr-8`}
                    inputMode="decimal"
                    value={scenario.stockB}
                    aria-invalid={Boolean(bErr)}
                    onChange={(e) => setScenario(index, { stockB: e.target.value })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    %
                  </span>
                </div>
                {bErr ? <p className="mt-1 text-xs text-rose-600">{bErr}</p> : null}
              </div>
            </div>
          );
        })}
      </div>

      <section
        className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        aria-labelledby="er-results-heading"
      >
        <h3 id="er-results-heading" className="text-[13px] font-semibold text-accent">
          Results
        </h3>

        {errors.probabilityTotal || errors.form ? (
          <p className="text-center text-sm text-rose-600" role="status">
            {errors.probabilityTotal ?? errors.form}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel
              htmlFor="er-result-a"
              label="Expected return of Stock A"
              tip="Σ [(Probability_i ÷ 100) × Stock A Return_i]"
            />
            <div className="relative">
              <input
                id="er-result-a"
                type="text"
                readOnly
                className={`${inputClass} bg-muted/20 pr-8 font-semibold text-accent`}
                value={result ? result.formattedExpectedReturnA : ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            </div>
          </div>

          <div>
            <FieldLabel
              htmlFor="er-result-b"
              label="Expected return of Stock B"
              tip="Σ [(Probability_i ÷ 100) × Stock B Return_i]"
            />
            <div className="relative">
              <input
                id="er-result-b"
                type="text"
                readOnly
                className={`${inputClass} bg-muted/20 pr-8 font-semibold text-accent`}
                value={result ? result.formattedExpectedReturnB : ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
