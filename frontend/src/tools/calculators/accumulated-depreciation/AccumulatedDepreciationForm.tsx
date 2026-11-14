'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEPRECIATION_METHODS,
  methodUsesProduction,
  methodUsesYears,
  type AccumulatedDepreciationFieldErrors,
  type AccumulatedDepreciationInput,
  type DepreciationMethod,
} from './types';
import { parseOptionalNumber } from './validation';

export interface AccumulatedDepreciationDraft {
  method: DepreciationMethod;
  assetCost: string;
  usefulLifeYears: string;
  yearsElapsed: string;
  salvageValue: string;
  estimatedLifetimeUnits: string;
  unitsProduced: string;
  currency: AccumulatedDepreciationInput['currency'];
}

const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

const METHOD_OPTIONS: { value: DepreciationMethod; label: string }[] = [
  { value: 'straight-line', label: 'Straight line' },
  { value: 'declining-balance', label: 'Declining balance' },
  { value: 'sum-of-years-digits', label: "Sum of the year's digits" },
  { value: 'units-of-production', label: 'Units of production' },
];

function formatAmount(value: number | null): string {
  return value === null || !Number.isFinite(value) ? '' : String(value);
}

export function inputToDraft(input: AccumulatedDepreciationInput): AccumulatedDepreciationDraft {
  return {
    method: input.method,
    assetCost: formatAmount(input.assetCost),
    usefulLifeYears: formatAmount(input.usefulLifeYears),
    yearsElapsed: formatAmount(input.yearsElapsed),
    salvageValue: formatAmount(input.salvageValue),
    estimatedLifetimeUnits: formatAmount(input.estimatedLifetimeUnits),
    unitsProduced: formatAmount(input.unitsProduced),
    currency: input.currency,
  };
}

export function draftToInput(draft: AccumulatedDepreciationDraft): AccumulatedDepreciationInput {
  return {
    method: draft.method,
    assetCost: parseOptionalNumber(draft.assetCost),
    usefulLifeYears: parseOptionalNumber(draft.usefulLifeYears),
    yearsElapsed: parseOptionalNumber(draft.yearsElapsed),
    salvageValue: parseOptionalNumber(draft.salvageValue),
    estimatedLifetimeUnits: parseOptionalNumber(draft.estimatedLifetimeUnits),
    unitsProduced: parseOptionalNumber(draft.unitsProduced),
    currency: draft.currency,
  };
}

interface AccumulatedDepreciationFormProps {
  draft: AccumulatedDepreciationDraft;
  errors: AccumulatedDepreciationFieldErrors;
  onDraftChange: (draft: AccumulatedDepreciationDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function AccumulatedDepreciationForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: AccumulatedDepreciationFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const patch = (next: Partial<AccumulatedDepreciationDraft>) => onDraftChange({ ...draft, ...next });
  const yearBased = methodUsesYears(draft.method);
  const productionBased = methodUsesProduction(draft.method);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset>
        <legend className="mb-2 text-[13px] font-medium text-accent">Depreciation method</legend>
        <div role="radiogroup" aria-label="Depreciation method" className="space-y-2">
          {METHOD_OPTIONS.map((option) => {
            const active = draft.method === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                  active
                    ? 'border-primary/40 bg-brand-softTeal/50 text-accent'
                    : 'border-border bg-white text-muted-foreground hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="depreciation-method"
                  className="accent-[hsl(var(--primary))]"
                  checked={active}
                  value={option.value}
                  onChange={() => {
                    if (!DEPRECIATION_METHODS.includes(option.value)) return;
                    patch({ method: option.value });
                  }}
                />
                <span className="font-medium text-accent">{option.label}</span>
              </label>
            );
          })}
        </div>
        {draft.method === 'declining-balance' ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Uses 200% declining balance (double-declining): rate = 2 ÷ useful life. Each year is capped so book
            value does not fall below salvage. That floor stays inside declining balance; the calculator does not
            switch to straight-line.
          </p>
        ) : null}
        {errors.method ? <p className="mt-1 text-xs text-rose-600">{errors.method}</p> : null}
      </fieldset>

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <Field
          id="ad-asset-cost"
          label="Cost of the asset"
          tip="Purchase price or capitalized cost before depreciation."
          prefix={symbol}
          value={draft.assetCost}
          error={errors.assetCost}
          placeholder="0.00"
          onChange={(assetCost) => patch({ assetCost })}
        />

        {yearBased ? (
          <>
            <Field
              id="ad-useful-life"
              label="Life of the asset"
              tip="Useful life in whole years. Fractional years are not used for these accounting-period methods."
              suffix="years"
              value={draft.usefulLifeYears}
              error={errors.usefulLifeYears}
              onChange={(usefulLifeYears) => patch({ usefulLifeYears })}
            />
            <Field
              id="ad-years-elapsed"
              label="Number of years"
              tip="Whole years of depreciation already recognized, from 0 through useful life."
              suffix="years"
              value={draft.yearsElapsed}
              error={errors.yearsElapsed}
              onChange={(yearsElapsed) => patch({ yearsElapsed })}
            />
          </>
        ) : null}

        <Field
          id="ad-salvage"
          label="Salvage value"
          tip="Estimated residual value at the end of useful life. Book value is never taken below this amount."
          prefix={symbol}
          value={draft.salvageValue}
          error={errors.salvageValue}
          placeholder="0.00"
          onChange={(salvageValue) => patch({ salvageValue })}
        />

        {productionBased ? (
          <>
            <Field
              id="ad-lifetime-units"
              label="Estimated total lifetime production"
              tip="Total units the asset is expected to produce over its life."
              suffix="units"
              value={draft.estimatedLifetimeUnits}
              error={errors.estimatedLifetimeUnits}
              onChange={(estimatedLifetimeUnits) => patch({ estimatedLifetimeUnits })}
            />
            <Field
              id="ad-units-produced"
              label="Units produced so far"
              tip="Cumulative units produced through the reporting date. Cannot exceed lifetime capacity."
              suffix="units"
              value={draft.unitsProduced}
              error={errors.unitsProduced}
              onChange={(unitsProduced) => patch({ unitsProduced })}
            />
          </>
        ) : null}
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

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
  tip,
  value,
  error,
  prefix,
  suffix,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <label className="text-[13px] font-medium text-accent" htmlFor={id}>
          {label}
        </label>
        <InfoTooltip label={label} text={tip} />
      </div>
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
          aria-describedby={errorId}
        />
        {suffix ? (
          <span className="pr-3 text-xs text-muted-foreground" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </FieldShell>
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
