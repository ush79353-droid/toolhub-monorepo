'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  NopatFieldErrors,
  NopatFormulaMode,
  NopatInput,
  NopatResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function numberOrBlank(value: number): string {
  return Number.isFinite(value) ? String(value) : '';
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function ReadOnlyShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
      {children}
    </div>
  );
}

interface NopatFormProps {
  input: NopatInput;
  errors: NopatFieldErrors;
  result: NopatResult | null;
  onChange: (input: NopatInput) => void;
  onReset: () => void;
}

export function NopatForm({ input, errors, result, onChange, onReset }: NopatFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<NopatInput>) => onChange({ ...input, ...patch });

  const onNumber =
    (key: keyof NopatInput) => (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({
        [key]: text === '' ? Number.NaN : Number(text),
      } as Partial<NopatInput>);
    };

  const setMode = (mode: NopatFormulaMode) => set({ mode });

  const moneyInput = (
    key:
      | 'operatingProfit'
      | 'netIncome'
      | 'nonOperatingIncomeLoss'
      | 'nonOperatingIncomeGain'
      | 'interestExpense'
      | 'tax',
    id: string,
    label: string,
    tip: string
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={errors[key]}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={numberOrBlank(input[key])}
            aria-invalid={Boolean(errors[key])}
            onChange={onNumber(key)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={(currency) => set({ currency })}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  const taxRateField = (
    <div>
      <label htmlFor="nopat-tax-rate" className={labelClass}>
        Tax rate
      </label>
      <FieldShell error={errors.taxRatePercent}>
        <input
          id="nopat-tax-rate"
          className={inputClass}
          inputMode="decimal"
          value={numberOrBlank(input.taxRatePercent)}
          aria-invalid={Boolean(errors.taxRatePercent)}
          onChange={onNumber('taxRatePercent')}
        />
        <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
          %
        </span>
      </FieldShell>
      {errors.taxRatePercent ? (
        <p className="mt-1 text-xs text-rose-600">{errors.taxRatePercent}</p>
      ) : null}
    </div>
  );

  const nopatOutput = (
    <div>
      <label htmlFor="nopat-result" className={labelClass}>
        Net operating profit after tax (NOPAT)
        <InfoTooltip
          label="Net operating profit after tax (NOPAT)"
          text="Operating profit after estimated taxes, excluding financing effects."
        />
      </label>
      <div className="flex gap-2">
        <ReadOnlyShell>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id="nopat-result"
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={result?.nopatDisplay ?? ''}
            aria-live="polite"
          />
        </ReadOnlyShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="nopat-result-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
            aria-label="NOPAT currency"
          />
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="nopat-formula-heading">
        <h3 id="nopat-formula-heading" className={sectionTitleClass}>
          NOPAT formula
        </h3>
        <div role="radiogroup" aria-label="NOPAT formula" className="space-y-2">
          {(
            [
              { value: 'simple' as const, label: 'Simple NOPAT formula' },
              { value: 'precise' as const, label: 'Precise NOPAT formula' },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="nopat-formula-mode"
                className="h-4 w-4 accent-primary"
                checked={input.mode === option.value}
                onChange={() => setMode(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </section>

      {input.mode === 'simple' ? (
        <section className={sectionClass} aria-labelledby="nopat-simple-heading">
          <h3 id="nopat-simple-heading" className={sectionTitleClass}>
            Simple NOPAT formula
          </h3>
          {moneyInput(
            'operatingProfit',
            'nopat-operating-profit',
            'Operating profit',
            'Also called operating income or EBIT. Profit from core operations before interest and taxes.'
          )}
          {taxRateField}
          {nopatOutput}
        </section>
      ) : (
        <section className={sectionClass} aria-labelledby="nopat-precise-heading">
          <h3 id="nopat-precise-heading" className={sectionTitleClass}>
            Precise NOPAT formula
          </h3>
          {moneyInput(
            'netIncome',
            'nopat-net-income',
            'Net income',
            'Bottom-line net income from the income statement.'
          )}
          {moneyInput(
            'nonOperatingIncomeLoss',
            'nopat-non-op-loss',
            'Non-operating income loss',
            'Non-operating losses added back when reconstructing operating income.'
          )}
          {moneyInput(
            'nonOperatingIncomeGain',
            'nopat-non-op-gain',
            'Non-operating income gain',
            'Non-operating gains deducted when reconstructing operating income.'
          )}
          {moneyInput(
            'interestExpense',
            'nopat-interest-expense',
            'Interest expense',
            'Interest expense added back to remove financing effects.'
          )}
          {moneyInput(
            'tax',
            'nopat-tax',
            'Tax',
            'Income tax expense from the income statement.'
          )}
          {taxRateField}
          {nopatOutput}
        </section>
      )}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
