'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FreeFloatFieldErrors,
  FreeFloatInput,
  FreeFloatResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitClass =
  'shrink-0 pr-3 text-xs font-medium text-muted-foreground';

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

interface FreeFloatFormProps {
  input: FreeFloatInput;
  errors: FreeFloatFieldErrors;
  result: FreeFloatResult | null;
  onChange: (input: FreeFloatInput) => void;
}

export function FreeFloatForm({
  input,
  errors,
  result,
  onChange,
}: FreeFloatFormProps) {
  const fields = [
    {
      id: 'ff-outstanding',
      key: 'outstandingShares' as const,
      label: 'Outstanding shares',
      tip: "The total number of a company's shares currently outstanding.",
      placeholder: '10,000',
      unit: 'shares',
    },
    {
      id: 'ff-restricted',
      key: 'restrictedShares' as const,
      label: 'Restricted shares',
      tip: 'Shares that cannot currently be freely traded because of legal, contractual, or other restrictions.',
      placeholder: '2,000',
      unit: 'shares',
    },
    {
      id: 'ff-closely',
      key: 'closelyHeldShares' as const,
      label: 'Closely held shares',
      tip: 'Shares held by insiders, controlling shareholders, or strategic holders that are excluded from the public float.',
      placeholder: '1,000',
      unit: 'shares',
    },
  ] as const;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Free float = outstanding − restricted − closely held. Treat restricted
        and closely held as mutually exclusive categories so the same share is
        not subtracted twice.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate free float shares
        </a>
      </p>

      {fields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className={labelClass}>
            {field.label}
            <InfoTooltip label={field.label} text={field.tip} />
          </label>
          <FieldShell error={errors[field.key]}>
            <input
              id={field.id}
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input[field.key]}
              onChange={(e) =>
                onChange({ ...input, [field.key]: e.target.value })
              }
              placeholder={field.placeholder}
              aria-invalid={Boolean(errors[field.key])}
            />
            <span className={unitClass}>{field.unit}</span>
          </FieldShell>
          {errors[field.key] ? (
            <p className="mt-1 text-xs text-rose-600">{errors[field.key]}</p>
          ) : null}
        </div>
      ))}

      <div>
        <label htmlFor="ff-float" className={labelClass}>
          Free float
        </label>
        <FieldShell muted>
          <input
            id="ff-float"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-medium text-accent`}
            value={result?.formattedFreeFloat ?? ''}
            placeholder="—"
            aria-readonly="true"
          />
          <span className={unitClass}>shares</span>
        </FieldShell>
      </div>

      <div>
        <label htmlFor="ff-pct" className={labelClass}>
          Free float percentage
        </label>
        <FieldShell muted>
          <input
            id="ff-pct"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-medium text-accent`}
            value={
              result
                ? result.formattedPercentage.replace(/%$/, '')
                : ''
            }
            placeholder="—"
            aria-readonly="true"
            aria-label={
              result
                ? `Free float percentage ${result.formattedPercentage}`
                : 'Free float percentage'
            }
          />
          <span className={unitClass}>%</span>
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
