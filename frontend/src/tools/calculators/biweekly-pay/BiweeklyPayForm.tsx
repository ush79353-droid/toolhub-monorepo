'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BiweeklyPayFieldErrors,
  BiweeklyPayInput,
  BiweeklyPayResult,
  BiweeklyPaySourceField,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitClass =
  'shrink-0 pr-3 text-xs text-muted-foreground whitespace-nowrap';

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

interface MoneyRowProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  onValueChange: (raw: string) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onFocusSource: () => void;
}

function MoneyRow({
  id,
  label,
  tooltip,
  value,
  currency,
  error,
  onValueChange,
  onCurrencyChange,
  onFocusSource,
}: MoneyRowProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={onFocusSource}
            aria-invalid={Boolean(error)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface BiweeklyPayFormProps {
  input: BiweeklyPayInput;
  errors: BiweeklyPayFieldErrors;
  result: BiweeklyPayResult | null;
  onChange: (next: BiweeklyPayInput) => void;
  onWageCurrencyChange: (
    field: BiweeklyPaySourceField,
    next: SupportedCurrency
  ) => void;
  onBiweeklyCurrencyChange: (next: SupportedCurrency) => void;
  conversionError: string | null;
  ratesWarning: string | null;
}

export function BiweeklyPayForm({
  input,
  errors,
  result,
  onChange,
  onWageCurrencyChange,
  onBiweeklyCurrencyChange,
  conversionError,
  ratesWarning,
}: BiweeklyPayFormProps) {
  const setSource = (field: BiweeklyPaySourceField) => {
    if (input.sourceField === field) return;
    onChange({ ...input, sourceField: field });
  };

  const patch = (partial: Partial<BiweeklyPayInput>) => {
    onChange({ ...input, ...partial });
  };

  const biweeklySymbol = getCurrencySymbol(input.biweeklyCurrency);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 bg-muted/30 px-4 py-3 text-left"
          onClick={() => patch({ wagesOpen: !input.wagesOpen })}
          aria-expanded={input.wagesOpen}
        >
          <span className="text-sm font-semibold text-accent">
            Input any of the wages below to obtain the answer.
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              input.wagesOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.wagesOpen ? (
          <div className="space-y-3 border-t border-border px-4 py-4">
            <MoneyRow
              id="biweekly-annual"
              label="Annual salary"
              tooltip="Yearly salary. Biweekly = annual ÷ 26 (every two weeks)."
              value={input.annualSalary}
              currency={input.annualSalaryCurrency}
              error={errors.annualSalary}
              onValueChange={(raw) =>
                onChange({
                  ...input,
                  sourceField: 'annual',
                  annualSalary: raw,
                })
              }
              onCurrencyChange={(next) => onWageCurrencyChange('annual', next)}
              onFocusSource={() => setSource('annual')}
            />
            <MoneyRow
              id="biweekly-monthly"
              label="Monthly wage"
              tooltip="Monthly wage. Biweekly = monthly × 12 ÷ 26."
              value={input.monthlyWage}
              currency={input.monthlyWageCurrency}
              error={errors.monthlyWage}
              onValueChange={(raw) =>
                onChange({
                  ...input,
                  sourceField: 'monthly',
                  monthlyWage: raw,
                })
              }
              onCurrencyChange={(next) => onWageCurrencyChange('monthly', next)}
              onFocusSource={() => setSource('monthly')}
            />
            <MoneyRow
              id="biweekly-weekly"
              label="Weekly wage"
              tooltip="Weekly wage. Biweekly = weekly × 2."
              value={input.weeklyWage}
              currency={input.weeklyWageCurrency}
              error={errors.weeklyWage}
              onValueChange={(raw) =>
                onChange({
                  ...input,
                  sourceField: 'weekly',
                  weeklyWage: raw,
                })
              }
              onCurrencyChange={(next) => onWageCurrencyChange('weekly', next)}
              onFocusSource={() => setSource('weekly')}
            />
            <MoneyRow
              id="biweekly-daily"
              label="Daily wage"
              tooltip="Daily wage. Biweekly = daily × days per week × 2."
              value={input.dailyWage}
              currency={input.dailyWageCurrency}
              error={errors.dailyWage}
              onValueChange={(raw) =>
                onChange({
                  ...input,
                  sourceField: 'daily',
                  dailyWage: raw,
                })
              }
              onCurrencyChange={(next) => onWageCurrencyChange('daily', next)}
              onFocusSource={() => setSource('daily')}
            />
            <MoneyRow
              id="biweekly-hourly"
              label="Hourly wage"
              tooltip="Hourly wage. Biweekly = hourly × hours per week × 2."
              value={input.hourlyWage}
              currency={input.hourlyWageCurrency}
              error={errors.hourlyWage}
              onValueChange={(raw) =>
                onChange({
                  ...input,
                  sourceField: 'hourly',
                  hourlyWage: raw,
                })
              }
              onCurrencyChange={(next) => onWageCurrencyChange('hourly', next)}
              onFocusSource={() => setSource('hourly')}
            />

            <div>
              <label className={labelClass} htmlFor="biweekly-hours">
                <span>Hours per week</span>
                <InfoTooltip
                  label="Hours per week"
                  text="Used when hourly wage is authoritative. Never FX-converted. Default 40."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.hoursPerWeek}>
                  <input
                    id="biweekly-hours"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.hoursPerWeek}
                    onChange={(e) => patch({ hoursPerWeek: e.target.value })}
                    aria-invalid={Boolean(errors.hoursPerWeek)}
                  />
                  <span className={unitClass}>hrs</span>
                </FieldShell>
              </div>
              {errors.hoursPerWeek ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.hoursPerWeek}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="biweekly-days">
                <span>Days per week</span>
                <InfoTooltip
                  label="Days per week"
                  text="Used when daily wage is authoritative. Never FX-converted. Default 5."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.daysPerWeek}>
                  <input
                    id="biweekly-days"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.daysPerWeek}
                    onChange={(e) => patch({ daysPerWeek: e.target.value })}
                    aria-invalid={Boolean(errors.daysPerWeek)}
                  />
                  <span className={unitClass}>days</span>
                </FieldShell>
              </div>
              {errors.daysPerWeek ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.daysPerWeek}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 bg-muted/30 px-4 py-3 text-left"
          onClick={() => patch({ resultsOpen: !input.resultsOpen })}
          aria-expanded={input.resultsOpen}
        >
          <span className="text-sm font-semibold text-accent">Answer</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              input.resultsOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.resultsOpen ? (
          <div className="space-y-3 border-t border-border px-4 py-4">
            <div>
              <label className={labelClass} htmlFor="biweekly-result">
                <span>Biweekly wage</span>
                <InfoTooltip
                  label="Biweekly wage"
                  text="Pay every two weeks (26 periods/year), not twice per month. Math runs in the last-edited wage currency, then converts for display."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {biweeklySymbol}
                  </span>
                  <input
                    id="biweekly-result"
                    className={`${inputClass} text-accent`}
                    readOnly
                    tabIndex={-1}
                    value={result?.formattedBiweekly ?? ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="biweekly-result-currency"
                    value={input.biweeklyCurrency}
                    onChange={onBiweeklyCurrencyChange}
                    aria-label="Biweekly wage currency"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {conversionError ? (
        <p className="text-xs text-amber-700" role="status">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {ratesWarning}
        </p>
      ) : null}
    </div>
  );
}
