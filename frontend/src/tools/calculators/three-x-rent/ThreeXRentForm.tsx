'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { equalSharePercents } from './calculation';
import {
  MAX_TENANT_COUNT,
  MIN_TENANT_COUNT,
  type IncomeSplit,
  type ThreeXRentFieldErrors,
  type ThreeXRentInput,
  type ThreeXRentMode,
} from './types';
import { parseOptionalNumber } from './validation';

export interface ThreeXRentDraft {
  mode: ThreeXRentMode;
  monthlyRent: string;
  multiplier: string;
  multipleTenants: boolean;
  tenantCount: string;
  split: IncomeSplit;
  sharePercents: string[];
  grossMonthlyIncome: string;
  tenantIncomes: string[];
  currency: ThreeXRentInput['currency'];
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function formatAmount(value: number | null): string {
  return value === null ? '' : String(value);
}

export function inputToDraft(input: ThreeXRentInput): ThreeXRentDraft {
  return {
    mode: input.mode,
    monthlyRent: formatAmount(input.monthlyRent),
    multiplier: formatAmount(input.multiplier),
    multipleTenants: input.multipleTenants,
    tenantCount: formatAmount(input.tenantCount),
    split: input.split,
    sharePercents: input.sharePercents.map((share) => formatAmount(share)),
    grossMonthlyIncome: formatAmount(input.grossMonthlyIncome),
    tenantIncomes: input.tenantIncomes.map((income) => formatAmount(income)),
    currency: input.currency,
  };
}

export function draftToInput(draft: ThreeXRentDraft): ThreeXRentInput {
  return {
    mode: draft.mode,
    monthlyRent: parseOptionalNumber(draft.monthlyRent),
    multiplier: parseOptionalNumber(draft.multiplier),
    multipleTenants: draft.multipleTenants,
    tenantCount: parseOptionalNumber(draft.tenantCount),
    split: draft.split,
    sharePercents: draft.sharePercents.map((share) => parseOptionalNumber(share)),
    grossMonthlyIncome: parseOptionalNumber(draft.grossMonthlyIncome),
    tenantIncomes: draft.tenantIncomes.map((income) => parseOptionalNumber(income)),
    currency: draft.currency,
  };
}

function resize(values: string[], count: number, fill: string): string[] {
  return Array.from({ length: count }, (_, index) => values[index] ?? fill);
}

interface ThreeXRentFormProps {
  draft: ThreeXRentDraft;
  errors: ThreeXRentFieldErrors;
  onDraftChange: (draft: ThreeXRentDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function ThreeXRentForm({ draft, errors, onDraftChange, onSubmit, onReset }: ThreeXRentFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const patch = (next: Partial<ThreeXRentDraft>) => onDraftChange({ ...draft, ...next });

  const onTenantCount = (tenantCount: string) => {
    const parsed = parseOptionalNumber(tenantCount);
    if (parsed !== null && Number.isInteger(parsed) && parsed >= MIN_TENANT_COUNT && parsed <= MAX_TENANT_COUNT) {
      patch({
        tenantCount,
        sharePercents: equalSharePercents(parsed).map((share) => String(share)),
        tenantIncomes: resize(draft.tenantIncomes, parsed, ''),
      });
      return;
    }
    patch({ tenantCount });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div
        role="group"
        aria-label="Calculation mode"
        className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1"
      >
        {(
          [
            ['required-income', 'Required income'],
            ['affordable-rent', 'Affordable rent'],
          ] as const
        ).map(([value, label]) => {
          const active = draft.mode === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              className={`h-10 rounded-md px-2 text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => patch({ mode: value })}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        {draft.mode === 'required-income' ? (
          <Field
            id="three-x-rent-amount"
            label="Monthly rent"
            prefix={symbol}
            value={draft.monthlyRent}
            error={errors.monthlyRent}
            placeholder="0.00"
            onChange={(monthlyRent) => patch({ monthlyRent })}
          />
        ) : draft.multipleTenants ? null : (
          <Field
            id="three-x-gross-income"
            label="Gross monthly income before taxes"
            prefix={symbol}
            value={draft.grossMonthlyIncome}
            error={errors.grossMonthlyIncome}
            placeholder="0.00"
            hint="Pay before tax and other deductions."
            onChange={(grossMonthlyIncome) => patch({ grossMonthlyIncome })}
          />
        )}

        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <label className="text-[13px] font-medium text-accent" htmlFor="three-x-multiplier">
              Rent multiplier
            </label>
            <InfoTooltip
              label="Rent multiplier"
              text="3 is a common screening guideline. It is not a legal requirement. A different landlord may use another multiple, or none."
            />
          </div>
          <FieldShell error={errors.multiplier}>
            <input
              id="three-x-multiplier"
              inputMode="decimal"
              className={inputClass}
              value={draft.multiplier}
              aria-invalid={Boolean(errors.multiplier)}
              aria-describedby={errors.multiplier ? 'three-x-multiplier-error' : 'three-x-multiplier-hint'}
              onChange={(event) => patch({ multiplier: event.target.value })}
            />
            <span className="pr-3 text-xs text-muted-foreground" aria-hidden="true">
              ×
            </span>
          </FieldShell>
          {errors.multiplier ? (
            <p id="three-x-multiplier-error" className="mt-1 text-xs text-rose-600">
              {errors.multiplier}
            </p>
          ) : (
            <p id="three-x-multiplier-hint" className="mt-1 text-xs text-muted-foreground">
              Default is 3. Rent is then about one third of gross monthly income.
            </p>
          )}
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={draft.multipleTenants}
          onChange={(event) => patch({ multipleTenants: event.target.checked })}
        />
        <span>
          Consider two or more tenants
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            {draft.mode === 'required-income'
              ? 'An equal split is only an assumption. A landlord may judge combined household gross income instead of asking each person to earn the same amount.'
              : 'Enter each tenant’s gross monthly income. The calculator combines them first.'}
          </span>
        </span>
      </label>

      {draft.multipleTenants ? (
        <div className="space-y-3.5 rounded-xl border border-border bg-muted/20 p-3">
          <Field
            id="three-x-tenant-count"
            label="Number of tenants"
            value={draft.tenantCount}
            error={errors.tenantCount}
            onChange={onTenantCount}
          />
          {draft.mode === 'affordable-rent' ? (
            <div>
              <p className={labelClass}>Gross monthly income before taxes</p>
              <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
                {draft.tenantIncomes.map((income, index) => (
                  <Field
                    key={`income-${index}`}
                    id={`three-x-tenant-income-${index + 1}`}
                    label={`Tenant ${index + 1}`}
                    prefix={symbol}
                    value={income}
                    placeholder="0.00"
                    onChange={(value) => {
                      const tenantIncomes = draft.tenantIncomes.slice();
                      tenantIncomes[index] = value;
                      patch({ tenantIncomes });
                    }}
                  />
                ))}
              </div>
              {errors.tenantIncomes ? (
                <p className="mt-1 text-xs text-rose-600">{errors.tenantIncomes}</p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  Each amount is gross income before taxes. They are added together before the multiplier is applied.
                </p>
              )}
            </div>
          ) : null}
          {draft.mode === 'required-income' ? (
            <>
              <label className="flex items-start gap-2 text-sm text-accent">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={draft.split === 'custom'}
                  onChange={(event) => {
                    const custom = event.target.checked;
                    const count = parseOptionalNumber(draft.tenantCount);
                    const nextShares =
                      custom && count !== null && Number.isInteger(count)
                        ? equalSharePercents(count).map((share) => String(share))
                        : draft.sharePercents;
                    patch({ split: custom ? 'custom' : 'equal', sharePercents: nextShares });
                  }}
                />
                <span>
                  Use unequal income shares
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    Percents of the household requirement. They must add up to 100%. Changing the tenant count resets them to an equal split.
                  </span>
                </span>
              </label>
              {draft.split === 'custom' ? (
                <div>
                  <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
                    {draft.sharePercents.map((share, index) => (
                      <Field
                        key={`share-${index}`}
                        id={`three-x-share-${index + 1}`}
                        label={`Tenant ${index + 1} share`}
                        suffix="%"
                        value={share}
                        onChange={(value) => {
                          const sharePercents = draft.sharePercents.slice();
                          sharePercents[index] = value;
                          patch({ sharePercents });
                        }}
                      />
                    ))}
                  </div>
                  {errors.sharePercents ? (
                    <p className="mt-1 text-xs text-rose-600">{errors.sharePercents}</p>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="submit" className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  hint,
  prefix,
  suffix,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <FieldShell error={error}>
        {prefix ? (
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          inputMode="decimal"
          placeholder={placeholder}
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        />
        {suffix ? (
          <span className="pr-3 text-xs text-muted-foreground" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </FieldShell>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 items-center overflow-hidden rounded-lg border bg-white ${
        error ? 'border-rose-500' : 'border-border'
      } focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1`}
    >
      {children}
    </div>
  );
}
