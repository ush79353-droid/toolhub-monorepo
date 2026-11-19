'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  CURRENCY_DENOMINATION_NOTE,
  getCurrencySymbol,
} from '@/tools/shared/currency';
import { benchmarksForType, defaultGroupId } from './benchmarks';
import { formatMoneyWithSymbol } from './calculation';
import type {
  ComparisonType,
  NetWorthFieldErrors,
  NetWorthInput,
  NetWorthResult,
} from './types';
import { ASSET_FIELDS, LIABILITY_FIELDS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border bg-muted/15 p-3.5 sm:p-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}

interface NetWorthFormProps {
  input: NetWorthInput;
  errors: NetWorthFieldErrors;
  result: NetWorthResult | null;
  onChange: (next: NetWorthInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function NetWorthForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: NetWorthFormProps) {
  const [assetsOpen, setAssetsOpen] = React.useState(true);
  const [liabilitiesOpen, setLiabilitiesOpen] = React.useState(true);
  const [resultsOpen, setResultsOpen] = React.useState(true);
  const [compareOpen, setCompareOpen] = React.useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const money = (v: number) => formatMoneyWithSymbol(v, input.currency);
  const usd = (v: number) => formatMoneyWithSymbol(v, 'USD');
  const groups = benchmarksForType(input.comparisonType);

  const set = (patch: Partial<NetWorthInput>) => {
    onChange({ ...input, ...patch });
  };

  const setAsset = (key: keyof NetWorthInput['assets'], value: string) => {
    set({ assets: { ...input.assets, [key]: value } });
  };

  const setLiability = (
    key: keyof NetWorthInput['liabilities'],
    value: string,
  ) => {
    set({ liabilities: { ...input.liabilities, [key]: value } });
  };

  const netWorthClass =
    result == null
      ? 'text-accent'
      : result.netWorth > 0
        ? 'text-primary'
        : result.netWorth < 0
          ? 'text-rose-700'
          : 'text-accent';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Add assets and liabilities to estimate net worth, then compare with
          Federal Reserve SCF 2022 US household benchmarks (2022 USD).
        </p>
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 text-xs"
          onClick={onLoadExample}
        >
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="nw-currency">
          Display currency
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="nw-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {CURRENCY_DENOMINATION_NOTE} SCF comparison figures stay in 2022 USD.
        </p>
      </div>

      <Accordion
        title="Assets"
        open={assetsOpen}
        onToggle={() => setAssetsOpen((o) => !o)}
      >
        {ASSET_FIELDS.map((field) => (
          <div key={field.key}>
            <div className={labelClass}>
              <label htmlFor={`nw-asset-${field.key}`}>{field.label}</label>
            </div>
            <FieldShell error={Boolean(errors.assets)}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id={`nw-asset-${field.key}`}
                className={inputClass}
                inputMode="decimal"
                value={input.assets[field.key]}
                onChange={(e) => setAsset(field.key, e.target.value)}
              />
            </FieldShell>
          </div>
        ))}
        {errors.assets ? (
          <p className="text-xs text-rose-600">{errors.assets}</p>
        ) : null}
        <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm">
          <span className="text-muted-foreground">Total assets: </span>
          <span className="font-semibold tabular-nums text-accent">
            {result ? money(result.totalAssets) : '—'}
          </span>
        </div>
      </Accordion>

      <Accordion
        title="Liabilities"
        open={liabilitiesOpen}
        onToggle={() => setLiabilitiesOpen((o) => !o)}
      >
        {LIABILITY_FIELDS.map((field) => (
          <div key={field.key}>
            <div className={labelClass}>
              <label htmlFor={`nw-liab-${field.key}`}>{field.label}</label>
            </div>
            <FieldShell error={Boolean(errors.liabilities)}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id={`nw-liab-${field.key}`}
                className={inputClass}
                inputMode="decimal"
                value={input.liabilities[field.key]}
                onChange={(e) => setLiability(field.key, e.target.value)}
              />
            </FieldShell>
          </div>
        ))}
        {errors.liabilities ? (
          <p className="text-xs text-rose-600">{errors.liabilities}</p>
        ) : null}
        <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm">
          <span className="text-muted-foreground">Total liabilities: </span>
          <span className="font-semibold tabular-nums text-accent">
            {result ? money(result.totalLiabilities) : '—'}
          </span>
        </div>
      </Accordion>

      <Accordion
        title="Results"
        open={resultsOpen}
        onToggle={() => setResultsOpen((o) => !o)}
      >
        <div className="grid gap-2">
          <div className="rounded-lg border border-border bg-white px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Total assets</p>
            <p className="text-sm font-semibold tabular-nums text-accent">
              {result ? money(result.totalAssets) : '—'}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-white px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Total liabilities</p>
            <p className="text-sm font-semibold tabular-nums text-accent">
              {result ? money(result.totalLiabilities) : '—'}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-brand-softTeal/30 px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Your net worth</p>
            <p className={`text-base font-semibold tabular-nums ${netWorthClass}`}>
              {result ? money(result.netWorth) : '—'}
            </p>
          </div>
        </div>
      </Accordion>

      <Accordion
        title="Compare with US average net worth"
        open={compareOpen}
        onToggle={() => setCompareOpen((o) => !o)}
      >
        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-accent">
            Check by
          </legend>
          <div className="flex flex-wrap gap-4 text-sm text-accent">
            {(
              [
                { value: 'income', label: 'Income' },
                { value: 'age', label: 'Age' },
                { value: 'wealth', label: 'Wealth level' },
              ] as const
            ).map((opt) => (
              <label key={opt.value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="nw-compare-type"
                  checked={input.comparisonType === opt.value}
                  onChange={() => {
                    const type = opt.value as ComparisonType;
                    set({
                      comparisonType: type,
                      comparisonGroupId: defaultGroupId(type),
                    });
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <div className={labelClass}>
            <label htmlFor="nw-group">Comparison group</label>
          </div>
          <select
            id="nw-group"
            className={selectClass}
            value={input.comparisonGroupId}
            onChange={(e) => set({ comparisonGroupId: e.target.value })}
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {result?.comparison ? (
          <div className="space-y-2 rounded-lg border border-border bg-white p-3 text-sm text-accent">
            <p>
              Your personal net worth is{' '}
              <strong className="tabular-nums">
                {money(result.comparison.userNetWorth)}
              </strong>
              .
            </p>
            <p>
              Average (mean) household net worth for{' '}
              <strong>{result.comparison.groupLabel}</strong> is{' '}
              <strong className="tabular-nums">
                {usd(result.comparison.meanUsd)}
              </strong>{' '}
              (median{' '}
              <strong className="tabular-nums">
                {usd(result.comparison.medianUsd)}
              </strong>
              ).
            </p>
            <p>
              You are{' '}
              <strong className="tabular-nums">
                {usd(Math.abs(result.comparison.differenceFromMean))}
              </strong>{' '}
              {result.comparison.differenceFromMean >= 0
                ? 'above'
                : 'below'}{' '}
              the group average
              {result.comparison.percentVsMean != null
                ? ` (${result.comparison.percentVsMean >= 0 ? '+' : ''}${result.comparison.percentVsMean.toFixed(1)}%)`
                : ''}
              .
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {result.comparison.note} Source: {result.comparison.source}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter assets and liabilities to see a comparison.
          </p>
        )}
      </Accordion>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="h-10">
          Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={onReload}
        >
          Reload calculator
        </Button>
        <Button type="button" variant="ghost" className="h-10" onClick={onClear}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
