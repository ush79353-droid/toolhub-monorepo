'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { PPP_COUNTRIES, PPP_YEARS, type PppYear } from './ppp-data';
import type {
  MarketRateSource,
  PppFieldErrors,
  PppInput,
  PppMode,
  PppResult,
  SalaryPeriod,
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

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-rose-600" role="alert">
      {msg}
    </p>
  );
}

interface Props {
  input: PppInput;
  errors: PppFieldErrors;
  result: PppResult | null;
  onChange: (input: PppInput) => void;
  onLoadExample: () => void;
}

export function PppForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PppInput>) => onChange({ ...input, ...patch });
  const source = PPP_COUNTRIES.find((c) => c.iso2 === input.sourceIso2);
  const target = PPP_COUNTRIES.find((c) => c.iso2 === input.targetIso2);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
 GDP PPP conversion factors (World Bank WDI); annual statistical
        estimates, not live FX. Prefer same-year official market rates for
        PPP-vs-market comparisons. Manual mode accepts user-supplied factors.
      </p>

      <fieldset>
        <legend className={labelClass}>Mode</legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: 'dataset', label: 'Dataset countries' },
              { id: 'manual', label: 'Manual PPP factors' },
            ] as const
          ).map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                input.mode === o.id
                  ? 'border-primary bg-primary/5 font-medium text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="ppp-mode"
                checked={input.mode === o.id}
                onChange={() => set({ mode: o.id as PppMode })}
                className="accent-primary"
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example
      </button>

      <Err msg={errors.form} />

      {input.mode === 'dataset' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <h3 className="text-sm font-semibold text-accent">Source country</h3>
          <div>
            <label htmlFor="ppp-year" className={labelClass}>
              Reference year
              <InfoTooltip
                label="Year"
                text="Source and target PPP factors must share this year. Market rates default to the same-year WDI official rate."
              />
            </label>
            <select
              id="ppp-year"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.year}
              onChange={(e) =>
                set({ year: Number(e.target.value) as PppYear })
              }
            >
              {PPP_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <Err msg={errors.year} />
          </div>
          <div>
            <label htmlFor="ppp-src" className={labelClass}>
              Source country
            </label>
            <select
              id="ppp-src"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.sourceIso2}
              onChange={(e) => set({ sourceIso2: e.target.value })}
            >
              {PPP_COUNTRIES.map((c) => (
                <option key={c.iso2} value={c.iso2}>
 {c.name}; {c.currency} ({c.iso2})
                </option>
              ))}
            </select>
            <Err msg={errors.sourceIso2} />
          </div>
          <div>
            <label htmlFor="ppp-sal" className={labelClass}>
              Salary ({source?.currency ?? 'LCU'})
            </label>
            <FieldShell error={errors.salary}>
              <input
                id="ppp-sal"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.salary}
                onChange={(e) => set({ salary: e.target.value })}
                placeholder="50000"
              />
            </FieldShell>
            <Err msg={errors.salary} />
          </div>
          <div>
            <label htmlFor="ppp-period" className={labelClass}>
              Salary period
            </label>
            <select
              id="ppp-period"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.period}
              onChange={(e) =>
                set({ period: e.target.value as SalaryPeriod })
              }
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>
              Source salary in intl $ (read-only)
            </label>
            <FieldShell muted>
              <input
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedIntl ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}

      {input.mode === 'dataset' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <h3 className="text-sm font-semibold text-accent">Target country</h3>
          <div>
            <label htmlFor="ppp-tgt" className={labelClass}>
              Target country
            </label>
            <select
              id="ppp-tgt"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.targetIso2}
              onChange={(e) => set({ targetIso2: e.target.value })}
            >
              {PPP_COUNTRIES.map((c) => (
                <option key={c.iso2} value={c.iso2}>
 {c.name}; {c.currency} ({c.iso2})
                </option>
              ))}
            </select>
            <Err msg={errors.targetIso2} />
          </div>
          <div>
            <label htmlFor="ppp-fx-src" className={labelClass}>
              Market exchange rate source
            </label>
            <select
              id="ppp-fx-src"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.marketRateSource}
              onChange={(e) =>
                set({
                  marketRateSource: e.target.value as MarketRateSource,
                })
              }
            >
              <option value="wdi-official">
                Same-year WDI official rate
              </option>
              <option value="manual">Enter rate manually</option>
            </select>
          </div>
          {input.marketRateSource === 'manual' ? (
            <div>
              <label htmlFor="ppp-fx" className={labelClass}>
                Market rate ({target?.currency ?? 'TGT'} per 1{' '}
                {source?.currency ?? 'SRC'})
              </label>
              <FieldShell error={errors.manualMarketRate}>
                <input
                  id="ppp-fx"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.manualMarketRate}
                  onChange={(e) => set({ manualMarketRate: e.target.value })}
                  placeholder="1.35"
                />
              </FieldShell>
              <Err msg={errors.manualMarketRate} />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {result?.formattedMarketRate ??
                'Derived from official LCU-per-USD rates for the selected year.'}
            </p>
          )}
          <div>
            <label className={labelClass}>PPP-adjusted salary</label>
            <FieldShell muted>
              <input
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedPppSalary ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
          <div>
            <label className={labelClass}>
              Equivalent at market exchange rate
            </label>
            <FieldShell muted>
              <input
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default`}
                value={result?.formattedMarketSalary ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}

      {input.mode === 'manual' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <h3 className="text-sm font-semibold text-accent">
            Manual PPP factors
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ppp-m-sc" className={labelClass}>
                Source currency
              </label>
              <FieldShell error={errors.manualSourceCurrency}>
                <input
                  id="ppp-m-sc"
                  type="text"
                  className={inputClass}
                  value={input.manualSourceCurrency}
                  onChange={(e) =>
                    set({
                      manualSourceCurrency: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="USD"
                  maxLength={3}
                />
              </FieldShell>
              <Err msg={errors.manualSourceCurrency} />
            </div>
            <div>
              <label htmlFor="ppp-m-tc" className={labelClass}>
                Target currency
              </label>
              <FieldShell error={errors.manualTargetCurrency}>
                <input
                  id="ppp-m-tc"
                  type="text"
                  className={inputClass}
                  value={input.manualTargetCurrency}
                  onChange={(e) =>
                    set({
                      manualTargetCurrency: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="CAD"
                  maxLength={3}
                />
              </FieldShell>
              <Err msg={errors.manualTargetCurrency} />
            </div>
          </div>
          <div>
            <label htmlFor="ppp-m-sal" className={labelClass}>
              Salary
            </label>
            <FieldShell error={errors.salary}>
              <input
                id="ppp-m-sal"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.salary}
                onChange={(e) => set({ salary: e.target.value })}
                placeholder="50000"
              />
            </FieldShell>
            <Err msg={errors.salary} />
          </div>
          <div>
            <label htmlFor="ppp-m-period" className={labelClass}>
              Salary period
            </label>
            <select
              id="ppp-m-period"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.period}
              onChange={(e) =>
                set({ period: e.target.value as SalaryPeriod })
              }
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label htmlFor="ppp-m-spa" className={labelClass}>
              Source PPP factor (LCU per intl $)
            </label>
            <FieldShell error={errors.manualSourcePpp}>
              <input
                id="ppp-m-spa"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.manualSourcePpp}
                onChange={(e) => set({ manualSourcePpp: e.target.value })}
                placeholder="1"
              />
            </FieldShell>
            <Err msg={errors.manualSourcePpp} />
          </div>
          <div>
            <label htmlFor="ppp-m-tpb" className={labelClass}>
              Target PPP factor (LCU per intl $)
            </label>
            <FieldShell error={errors.manualTargetPpp}>
              <input
                id="ppp-m-tpb"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.manualTargetPpp}
                onChange={(e) => set({ manualTargetPpp: e.target.value })}
                placeholder="2"
              />
            </FieldShell>
            <Err msg={errors.manualTargetPpp} />
          </div>
          <div>
            <label htmlFor="ppp-m-fx" className={labelClass}>
              Market rate (optional, target per 1 source)
            </label>
            <FieldShell error={errors.manualMarketRate}>
              <input
                id="ppp-m-fx"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.manualMarketRate}
                onChange={(e) => set({ manualMarketRate: e.target.value })}
                placeholder="1.35"
              />
            </FieldShell>
            <Err msg={errors.manualMarketRate} />
          </div>
          <div>
            <label className={labelClass}>PPP-adjusted salary</label>
            <FieldShell muted>
              <input
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedPppSalary ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}
    </form>
  );
}
