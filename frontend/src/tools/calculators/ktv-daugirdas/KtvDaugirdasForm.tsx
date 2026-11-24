'use client';

import type { ReactNode } from 'react';
import type {
  BunUnit,
  DurationUnit,
  KtvDaugirdasFieldErrors,
  KtvDaugirdasInput,
  KtvDaugirdasResult,
  VolumeUnit,
  WeightUnit,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-accent outline-none sm:min-w-[5.5rem]';

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

interface Props {
  input: KtvDaugirdasInput;
  errors: KtvDaugirdasFieldErrors;
  result: KtvDaugirdasResult | null;
  onChange: (input: KtvDaugirdasInput) => void;
}

export function KtvDaugirdasForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<KtvDaugirdasInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational single-pool second-generation Daugirdas Kt/V and URR. Not a
        dialysis prescription.
      </p>

      <div>
        <label className={labelClass} htmlFor="ktv-pre">
          Pre-dialysis BUN
        </label>
        <FieldShell error={errors.preBun}>
          <input
            id="ktv-pre"
            className={inputClass}
            inputMode="decimal"
            value={input.preBun}
            aria-invalid={Boolean(errors.preBun)}
            onChange={(e) => set({ preBun: e.target.value })}
          />
          <select
            className={unitSelectClass}
            aria-label="Pre-dialysis BUN unit"
            value={input.preBunUnit}
            onChange={(e) => set({ preBunUnit: e.target.value as BunUnit })}
          >
            <option value="mg/dL">mg/dL</option>
            <option value="mmol/L">mmol/L</option>
          </select>
        </FieldShell>
        {errors.preBun ? (
          <p className="mt-1 text-xs text-rose-600">{errors.preBun}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ktv-post">
          Post-dialysis BUN
        </label>
        <FieldShell error={errors.postBun}>
          <input
            id="ktv-post"
            className={inputClass}
            inputMode="decimal"
            value={input.postBun}
            aria-invalid={Boolean(errors.postBun)}
            onChange={(e) => set({ postBun: e.target.value })}
          />
          <select
            className={unitSelectClass}
            aria-label="Post-dialysis BUN unit"
            value={input.postBunUnit}
            onChange={(e) => set({ postBunUnit: e.target.value as BunUnit })}
          >
            <option value="mg/dL">mg/dL</option>
            <option value="mmol/L">mmol/L</option>
          </select>
        </FieldShell>
        {errors.postBun ? (
          <p className="mt-1 text-xs text-rose-600">{errors.postBun}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ktv-dur">
          Duration of dialysis
        </label>
        <FieldShell error={errors.duration}>
          <input
            id="ktv-dur"
            className={inputClass}
            inputMode="decimal"
            value={input.duration}
            aria-invalid={Boolean(errors.duration)}
            onChange={(e) => set({ duration: e.target.value })}
          />
          <select
            className={unitSelectClass}
            aria-label="Duration unit"
            value={input.durationUnit}
            onChange={(e) =>
              set({ durationUnit: e.target.value as DurationUnit })
            }
          >
            <option value="hrs">hrs</option>
            <option value="min">min</option>
          </select>
        </FieldShell>
        {errors.duration ? (
          <p className="mt-1 text-xs text-rose-600">{errors.duration}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ktv-uf">
          Volume of removed ultrafiltrate
        </label>
        <FieldShell error={errors.ultrafiltrate}>
          <input
            id="ktv-uf"
            className={inputClass}
            inputMode="decimal"
            value={input.ultrafiltrate}
            aria-invalid={Boolean(errors.ultrafiltrate)}
            onChange={(e) => set({ ultrafiltrate: e.target.value })}
          />
          <select
            className={unitSelectClass}
            aria-label="Ultrafiltrate unit"
            value={input.ultrafiltrateUnit}
            onChange={(e) =>
              set({ ultrafiltrateUnit: e.target.value as VolumeUnit })
            }
          >
            <option value="L">L</option>
            <option value="mL">mL</option>
          </select>
        </FieldShell>
        {errors.ultrafiltrate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ultrafiltrate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ktv-wt">
          Post-dialysis weight
        </label>
        <FieldShell error={errors.postWeight}>
          <input
            id="ktv-wt"
            className={inputClass}
            inputMode="decimal"
            value={input.postWeight}
            aria-invalid={Boolean(errors.postWeight)}
            onChange={(e) => set({ postWeight: e.target.value })}
          />
          <select
            className={unitSelectClass}
            aria-label="Weight unit"
            value={input.postWeightUnit}
            onChange={(e) =>
              set({ postWeightUnit: e.target.value as WeightUnit })
            }
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </FieldShell>
        {errors.postWeight ? (
          <p className="mt-1 text-xs text-rose-600">{errors.postWeight}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ktv-out">
          Kt/V
        </label>
        <FieldShell muted>
          <input
            id="ktv-out"
            className={inputClass}
            readOnly
            value={result?.formattedKtv ?? ''}
            aria-live="polite"
          />
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="ktv-urr">
          URR
        </label>
        <FieldShell muted>
          <input
            id="ktv-urr"
            className={inputClass}
            readOnly
            value={result?.formattedUrr ?? ''}
            aria-live="polite"
          />
          <span className="shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
