'use client';

import Link from 'next/link';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { US_STATES } from './states';
import type { StateTaxInput } from './types';
import type { validateStateTaxInput } from './validation';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';

interface StateTaxFormProps {
  input: StateTaxInput;
  validation: ReturnType<typeof validateStateTaxInput>;
  onChange: (input: StateTaxInput) => void;
}

export function StateTaxForm({ input, validation, onChange }: StateTaxFormProps) {
  const dest = validation.destination;
  const stateName = dest?.state?.name ?? 'selected state';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
    >
      <div>
        <label className={labelClass} htmlFor="state-tax-state">
          <span>Where do you live?</span>
          <InfoTooltip
            label="Where do you live?"
            text="Choose a US state. When a dedicated state tax calculator is available, a link appears below."
          />
        </label>
        <select
          id="state-tax-state"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
          value={input.stateCode}
          aria-invalid={Boolean(validation.errors.stateCode)}
          onChange={(e) => onChange({ stateCode: e.target.value })}
        >
          {US_STATES.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
        {validation.errors.stateCode ? (
          <p className="mt-1 text-xs text-rose-600">{validation.errors.stateCode}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/15 px-3.5 py-3 sm:px-4">
        {dest?.available && dest.href ? (
          <p className="text-sm text-accent">
            Visit our{' '}
            <Link
              href={dest.href}
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              {stateName} Tax Calculator
            </Link>
            .
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            A dedicated tax calculator for this state is not available yet.
          </p>
        )}
      </div>
    </form>
  );
}
