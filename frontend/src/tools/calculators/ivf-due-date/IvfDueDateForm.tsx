'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { eventLabelForTransferType } from './calculation';
import type {
  IvfDueDateFieldErrors,
  IvfDueDateInput,
  IvfDueDateResult,
  IvfTransferType,
  Plurality,
  PregnancyStatus,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function RadioCard({
  name,
  checked,
  label,
  onSelect,
}: {
  name: string;
  checked: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-sm ${
        checked
          ? 'border-primary bg-primary/5 text-accent'
          : 'border-border bg-white text-muted-foreground'
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="h-4 w-4 accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}

interface IvfDueDateFormProps {
  input: IvfDueDateInput;
  errors: IvfDueDateFieldErrors;
  result: IvfDueDateResult | null;
  onChange: (input: IvfDueDateInput) => void;
  onLoadExample: () => void;
}

export function IvfDueDateForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: IvfDueDateFormProps) {
  const set = (patch: Partial<IvfDueDateInput>) =>
    onChange({ ...input, ...patch });

  const eventLabel = eventLabelForTransferType(input.transferType);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <div className={labelClass}>
          <span>Are you pregnant or planning to be?</span>
        </div>
        <div className="flex flex-col gap-2" role="radiogroup">
          {(
            [
              ['pregnant', "I'm pregnant"],
              ['planning', "I'm planning my pregnancy"],
            ] as const
          ).map(([value, label]) => (
            <RadioCard
              key={value}
              name="ivf-pregnancy-status"
              checked={input.pregnancyStatus === value}
              label={label}
              onSelect={() => set({ pregnancyStatus: value as PregnancyStatus })}
            />
          ))}
        </div>
      </div>

      <div>
        <div className={labelClass}>
          <span>Are you expecting more than one baby?</span>
          <InfoTooltip text="Plurality does not change the educational 40-week estimated due date. Delivery timing for multiples is clinical and not calculated here." />
        </div>
        <div className="flex flex-col gap-2" role="radiogroup">
          {(
            [
              ['one', 'One baby'],
              ['twins', 'Twins'],
              ['triplets', 'Triplets'],
            ] as const
          ).map(([value, label]) => (
            <RadioCard
              key={value}
              name="ivf-plurality"
              checked={input.plurality === value}
              label={label}
              onSelect={() => set({ plurality: value as Plurality })}
            />
          ))}
        </div>
      </div>

      <div>
        <div className={labelClass}>
          <span>Type of transmission</span>
          <InfoTooltip text="Own/donor eggs use retrieval or fertilization + 266 days. Day-3 transfer adds 263 days; Day-5 transfer adds 261 days (ACOG Committee Opinion 700)." />
        </div>
        <div className="flex flex-col gap-2" role="radiogroup">
          {(
            [
              ['own_eggs', 'IVF with own eggs'],
              ['donor_eggs', 'IVF with donor eggs cycle'],
              ['day3_transfer', 'Day-3 embryo transfer'],
              ['day5_transfer', 'Day-5 embryo transfer'],
            ] as const
          ).map(([value, label]) => (
            <RadioCard
              key={value}
              name="ivf-transfer-type"
              checked={input.transferType === value}
              label={label}
              onSelect={() =>
                set({ transferType: value as IvfTransferType })
              }
            />
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="ivf-event-date">
          {eventLabel}
        </label>
        <FieldShell error={errors.eventDate}>
          <input
            id="ivf-event-date"
            type="date"
            className={inputClass}
            value={input.eventDate}
            onChange={(e) => set({ eventDate: e.target.value })}
            aria-invalid={Boolean(errors.eventDate)}
          />
        </FieldShell>
        {errors.eventDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.eventDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ivf-due-date">
          Approximate due date
        </label>
        <FieldShell muted>
          <input
            id="ivf-due-date"
            className={inputClass}
            readOnly
            value={result?.dueDateIso ?? ''}
            placeholder="YYYY-MM-DD"
            tabIndex={-1}
            aria-live="polite"
          />
        </FieldShell>
        {result ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {result.formattedDueDate}
          </p>
        ) : null}
      </div>

      {result ? (
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-accent">
          <p className="font-semibold">{result.formulaNote}</p>
          <p className="text-muted-foreground">{result.pluralityNote}</p>
          {result.planningNote ? (
            <p className="text-muted-foreground">{result.planningNote}</p>
          ) : null}
          <p className="text-muted-foreground">{result.disclaimer}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onLoadExample}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (Day-3 · 2026-01-01)
        </button>
      </div>
    </form>
  );
}
