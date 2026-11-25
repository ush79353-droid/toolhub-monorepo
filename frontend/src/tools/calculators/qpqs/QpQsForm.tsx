'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DiameterUnit,
  FlowUnit,
  QpQsFieldErrors,
  QpQsInput,
  QpQsMethod,
  QpQsResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

interface Props {
  input: QpQsInput;
  errors: QpQsFieldErrors;
  result: QpQsResult | null;
  onChange: (input: QpQsInput) => void;
  onLoadExample: () => void;
}

export function QpQsForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<QpQsInput>) => onChange({ ...input, ...patch });

  const switchDiameter = (
    field: 'rvotDiameter' | 'lvotDiameter',
    unitField: 'rvotDiameterUnit' | 'lvotDiameterUnit',
    next: DiameterUnit,
  ) => {
    const currentUnit = input[unitField];
    if (next === currentUnit) return;
    const value = input[field];
    const patch: Partial<QpQsInput> = { [unitField]: next };
    if (value != null) {
      const cm = currentUnit === 'cm' ? value : value / 10;
      const converted = next === 'cm' ? cm : cm * 10;
      patch[field] = Math.round(converted * 1000) / 1000;
    }
    set(patch);
  };

  const switchFlowUnit = (next: FlowUnit) => {
    if (next === input.flowUnit) return;
    const patch: Partial<QpQsInput> = { flowUnit: next };
    const convert = (v: number | null) => {
      if (v == null) return null;
      if (input.flowUnit === 'L_min' && next === 'mL_min') return v * 1000;
      if (input.flowUnit === 'mL_min' && next === 'L_min') return v / 1000;
      return v;
    };
    patch.qpFlow = convert(input.qpFlow);
    patch.qsFlow = convert(input.qsFlow);
    set(patch);
  };

  const methodOptions: { value: QpQsMethod; label: string }[] = [
    { value: 'echo', label: 'Echocardiography' },
    { value: 'fick', label: 'Fick principle (from O₂ content)' },
    { value: 'direct', label: 'Use Qp and Qs values' },
  ];

  const exampleLabel =
    input.method === 'echo'
      ? 'Load example (equal RVOT/LVOT → Qp/Qs = 1)'
      : input.method === 'fick'
        ? 'Load example (matched O₂ step-ups → 1)'
        : 'Load example (Qp = Qs → 1)';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Qp/Qs (pulmonary/systemic flow ratio). Not a diagnosis or
        cath-lab report. Entries stay in your browser only.
      </p>

      <section
        className={sectionClass}
        aria-label="Calculation method"
      >
        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-accent">
            Calculation method
          </legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
            {methodOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="qpqs-method"
                  checked={input.method === opt.value}
                  onChange={() => set({ method: opt.value })}
                  className="h-4 w-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {exampleLabel}
        </button>
      </p>

      {input.method === 'echo' ? (
        <section className={sectionClass} aria-label="Echocardiography inputs">
          <div>
            <label className={labelClass} htmlFor="qpqs-rvot-d">
              <span>RVOT</span>
              <InfoTooltip text="Right ventricular outflow tract diameter at the measurement site used with RVOT VTI." />
            </label>
            <div
              className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.rvotDiameter ? 'border-rose-400' : 'border-border'
              }`}
            >
              <input
                id="qpqs-rvot-d"
                className={inputClass}
                inputMode="decimal"
                value={input.rvotDiameter ?? ''}
                onChange={(e) =>
                  set({ rvotDiameter: parseOptional(e.target.value) })
                }
              />
              <select
                className={selectClass}
                aria-label="RVOT diameter unit"
                value={input.rvotDiameterUnit}
                onChange={(e) =>
                  switchDiameter(
                    'rvotDiameter',
                    'rvotDiameterUnit',
                    e.target.value as DiameterUnit,
                  )
                }
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
              </select>
            </div>
            {errors.rvotDiameter ? (
              <p className="mt-1 text-xs text-destructive">{errors.rvotDiameter}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="qpqs-rvot-vti">
              <span>RVOT VTI</span>
              <InfoTooltip text="Velocity-time integral for RVOT flow (typically cm)." />
            </label>
            <div
              className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.rvotVti ? 'border-rose-400' : 'border-border'
              }`}
            >
              <input
                id="qpqs-rvot-vti"
                className={inputClass}
                inputMode="decimal"
                value={input.rvotVti ?? ''}
                onChange={(e) =>
                  set({ rvotVti: parseOptional(e.target.value) })
                }
              />
              <span className={selectClass.replace('outline-none', '')}>cm</span>
            </div>
            {errors.rvotVti ? (
              <p className="mt-1 text-xs text-destructive">{errors.rvotVti}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="qpqs-lvot-d">
              <span>LVOT</span>
              <InfoTooltip text="Left ventricular outflow tract diameter paired with LVOT VTI." />
            </label>
            <div
              className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.lvotDiameter ? 'border-rose-400' : 'border-border'
              }`}
            >
              <input
                id="qpqs-lvot-d"
                className={inputClass}
                inputMode="decimal"
                value={input.lvotDiameter ?? ''}
                onChange={(e) =>
                  set({ lvotDiameter: parseOptional(e.target.value) })
                }
              />
              <select
                className={selectClass}
                aria-label="LVOT diameter unit"
                value={input.lvotDiameterUnit}
                onChange={(e) =>
                  switchDiameter(
                    'lvotDiameter',
                    'lvotDiameterUnit',
                    e.target.value as DiameterUnit,
                  )
                }
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
              </select>
            </div>
            {errors.lvotDiameter ? (
              <p className="mt-1 text-xs text-destructive">{errors.lvotDiameter}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="qpqs-lvot-vti">
              <span>LVOT VTI</span>
              <InfoTooltip text="LVOT velocity-time integral (typically cm)." />
            </label>
            <div
              className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.lvotVti ? 'border-rose-400' : 'border-border'
              }`}
            >
              <input
                id="qpqs-lvot-vti"
                className={inputClass}
                inputMode="decimal"
                value={input.lvotVti ?? ''}
                onChange={(e) =>
                  set({ lvotVti: parseOptional(e.target.value) })
                }
              />
              <span className={selectClass.replace('outline-none', '')}>cm</span>
            </div>
            {errors.lvotVti ? (
              <p className="mt-1 text-xs text-destructive">{errors.lvotVti}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {input.method === 'fick' ? (
        <section className={sectionClass} aria-label="Fick oxygen content">
          {(
            [
              {
                id: 'qpqs-sao2',
                key: 'systemicArterialContent' as const,
                label: 'Systemic arterial O₂ content',
                tip: 'Arterial oxygen content (mL O₂/dL).',
              },
              {
                id: 'qpqs-svo2',
                key: 'mixedVenousContent' as const,
                label: 'Mixed venous O₂ content',
                tip: 'Mixed venous (pulmonary artery) oxygen content.',
              },
              {
                id: 'qpqs-pvo2',
                key: 'pulmonaryVenousContent' as const,
                label: 'Pulmonary venous O₂ content',
                tip: 'Oxygen content from pulmonary veins.',
              },
              {
                id: 'qpqs-pao2',
                key: 'pulmonaryArterialContent' as const,
                label: 'Pulmonary arterial O₂ content',
                tip: 'Pulmonary artery oxygen content.',
              },
            ] as const
          ).map((field) => (
            <div key={field.id}>
              <label className={labelClass} htmlFor={field.id}>
                <span>{field.label}</span>
                <InfoTooltip text={field.tip} />
              </label>
              <div
                className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                  errors[field.key] ? 'border-rose-400' : 'border-border'
                }`}
              >
                <input
                  id={field.id}
                  className={inputClass}
                  inputMode="decimal"
                  value={input[field.key] ?? ''}
                  onChange={(e) =>
                    set({
                      [field.key]: parseOptional(e.target.value),
                    } as Partial<QpQsInput>)
                  }
                />
                <span className="shrink-0 px-2 text-sm text-muted-foreground">
                  mL O₂/dL
                </span>
              </div>
              {errors[field.key] ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors[field.key]}
                </p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {input.method === 'direct' ? (
        <section className={sectionClass} aria-label="Direct flows">
          <div>
            <label className={labelClass} htmlFor="qpqs-qp">
              <span>Qp</span>
              <InfoTooltip text="Pulmonary blood flow in the selected unit." />
            </label>
            <div
              className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.qpFlow ? 'border-rose-400' : 'border-border'
              }`}
            >
              <input
                id="qpqs-qp"
                className={inputClass}
                inputMode="decimal"
                value={input.qpFlow ?? ''}
                onChange={(e) =>
                  set({ qpFlow: parseOptional(e.target.value) })
                }
              />
              <select
                className={selectClass}
                aria-label="Flow unit"
                value={input.flowUnit}
                onChange={(e) =>
                  switchFlowUnit(e.target.value as FlowUnit)
                }
              >
                <option value="L_min">L/min</option>
                <option value="mL_min">mL/min</option>
              </select>
            </div>
            {errors.qpFlow ? (
              <p className="mt-1 text-xs text-destructive">{errors.qpFlow}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="qpqs-qs">
              <span>Qs</span>
              <InfoTooltip text="Systemic blood flow in the same unit as Qp." />
            </label>
            <div
              className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.qsFlow ? 'border-rose-400' : 'border-border'
              }`}
            >
              <input
                id="qpqs-qs"
                className={inputClass}
                inputMode="decimal"
                value={input.qsFlow ?? ''}
                onChange={(e) =>
                  set({ qsFlow: parseOptional(e.target.value) })
                }
              />
              <span className="shrink-0 px-2 text-sm text-muted-foreground">
                {input.flowUnit === 'L_min' ? 'L/min' : 'mL/min'}
              </span>
            </div>
            {errors.qsFlow ? (
              <p className="mt-1 text-xs text-destructive">{errors.qsFlow}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-destructive" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div
        className="rounded-xl border border-border bg-muted/15 px-4 py-3"
        aria-live="polite"
      >
        <p className="text-[13px] font-medium text-accent">
          Q<sub>p</sub>/Q<sub>s</sub>
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">
          {result ? result.formattedRatio : '—'}
        </p>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Enter values for the selected method to compute Qp/Qs.
          </p>
        )}
      </div>
    </form>
  );
}