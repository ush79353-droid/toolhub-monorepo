'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  MAX_CREDIT_LINES,
  createLineId,
  type CreditLineEntry,
  type CreditUtilizationFieldErrors,
  type CreditUtilizationInput,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring border-border bg-white ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function CollapsibleSection({
  title,
  open,
  onToggle,
  onRemove,
  canRemove,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  canRemove?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={open}
          onClick={onToggle}
        >
          <span>{title}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {canRemove && onRemove ? (
          <button
            type="button"
            className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:text-rose-700"
            aria-label={`Remove ${title}`}
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface CreditUtilizationFormProps {
  input: CreditUtilizationInput;
  errors: CreditUtilizationFieldErrors;
  onChange: (input: CreditUtilizationInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function CreditUtilizationForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: CreditUtilizationFormProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const line of input.lines) map[line.id] = true;
    return map;
  });
  const [targetOpen, setTargetOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const updateLine = (
    id: string,
    patch: Partial<Pick<CreditLineEntry, 'moneyUsed' | 'creditLimit'>>
  ) => {
    onChange({
      ...input,
      lines: input.lines.map((line) =>
        line.id === id ? { ...line, ...patch } : line
      ),
    });
  };

  const addLine = () => {
    if (input.lines.length >= MAX_CREDIT_LINES) return;
    const id = createLineId();
    onChange({
      ...input,
      lines: [...input.lines, { id, moneyUsed: '', creditLimit: '' }],
    });
    setOpenIds((prev) => ({ ...prev, [id]: true }));
  };

  const removeLine = (id: string) => {
    if (input.lines.length <= 1) return;
    onChange({
      ...input,
      lines: input.lines.filter((line) => line.id !== id),
    });
  };

  const atMax = input.lines.length >= MAX_CREDIT_LINES;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        For each credit card or revolving line, enter the outstanding balance
        (money used) and its credit limit. The calculator reports overall
 utilization as total used ÷ total limits; not an average of per-card
        percentages.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="cu-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for credit utilization amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Amounts share one currency label (denomination only; no FX).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-use"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use the credit utilization calculator
        </a>
      </p>

      {input.lines.map((line, index) => {
        const lineErr = errors.lines?.[line.id];
        const open = openIds[line.id] !== false;
        return (
          <CollapsibleSection
            key={line.id}
            title={`Credit line ${index + 1}`}
            open={open}
            onToggle={() =>
              setOpenIds((prev) => ({ ...prev, [line.id]: !open }))
            }
            canRemove={input.lines.length > 1}
            onRemove={() => removeLine(line.id)}
          >
            <div>
              <label htmlFor={`cu-used-${line.id}`} className={labelClass}>
                Money used
                <InfoTooltip
                  label="Money used"
                  text="Outstanding revolving balance on this credit line."
                />
              </label>
              <FieldShell error={lineErr?.moneyUsed}>
                <span
                  className="pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {symbol}
                </span>
                <input
                  id={`cu-used-${line.id}`}
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={line.moneyUsed}
                  onChange={(e) =>
                    updateLine(line.id, { moneyUsed: e.target.value })
                  }
                  placeholder="Enter money used"
                  aria-invalid={Boolean(lineErr?.moneyUsed)}
                />
              </FieldShell>
              {lineErr?.moneyUsed ? (
                <p className="mt-1 text-xs text-rose-600">
                  {lineErr.moneyUsed}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor={`cu-limit-${line.id}`} className={labelClass}>
                Credit limit
                <InfoTooltip
                  label="Credit limit"
                  text="Approved revolving credit limit for this line."
                />
              </label>
              <FieldShell error={lineErr?.creditLimit}>
                <span
                  className="pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {symbol}
                </span>
                <input
                  id={`cu-limit-${line.id}`}
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={line.creditLimit}
                  onChange={(e) =>
                    updateLine(line.id, { creditLimit: e.target.value })
                  }
                  placeholder="Enter credit limit"
                  aria-invalid={Boolean(lineErr?.creditLimit)}
                />
              </FieldShell>
              {lineErr?.creditLimit ? (
                <p className="mt-1 text-xs text-rose-600">
                  {lineErr.creditLimit}
                </p>
              ) : null}
            </div>
          </CollapsibleSection>
        );
      })}

      <button
        type="button"
        onClick={addLine}
        disabled={atMax}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-white text-sm font-semibold text-accent hover:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Add another credit line
      </button>
      {atMax ? (
        <p className="text-xs text-muted-foreground">
          Maximum of {MAX_CREDIT_LINES} credit lines reached.
        </p>
      ) : null}

      <CollapsibleSection
        title="Target utilization"
        open={targetOpen}
        onToggle={() => setTargetOpen((o) => !o)}
      >
        <div>
          <label htmlFor="cu-target" className={labelClass}>
            Target utilization rate
            <InfoTooltip
              label="Target utilization"
              text="Desired overall utilization (0–100%). Used to estimate balance reduction or extra limit needed. Not a credit-score guarantee."
            />
          </label>
          <FieldShell error={errors.targetUtilization}>
            <input
              id="cu-target"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.targetUtilization}
              onChange={(e) =>
                onChange({ ...input, targetUtilization: e.target.value })
              }
              placeholder="30"
              aria-invalid={Boolean(errors.targetUtilization)}
            />
            <span
              className="pr-3 text-sm text-muted-foreground"
              aria-hidden
            >
              %
            </span>
          </FieldShell>
          {errors.targetUtilization ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.targetUtilization}
            </p>
          ) : null}
        </div>
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
