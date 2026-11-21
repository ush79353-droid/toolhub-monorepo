'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  GDP_MAGNITUDE_OPTIONS,
  POPULATION_MAGNITUDE_OPTIONS,
  type GdpMagnitude,
  type GdpMeasureType,
  type GdpPerCapitaFieldErrors,
  type GdpPerCapitaInput,
  type GdpPerCapitaMode,
  type GdpPerCapitaResult,
  type PopulationMagnitude,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-xs text-accent outline-none focus:ring-2 focus:ring-ring';

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

const MODES: { id: GdpPerCapitaMode; label: string }[] = [
  { id: 'perCapita', label: 'GDP per Capita' },
  { id: 'gdp', label: 'GDP' },
  { id: 'population', label: 'Population' },
];

interface GdpPerCapitaFormProps {
  input: GdpPerCapitaInput;
  errors: GdpPerCapitaFieldErrors;
  result: GdpPerCapitaResult | null;
  onChange: (input: GdpPerCapitaInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function GdpPerCapitaForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: GdpPerCapitaFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<GdpPerCapitaInput>) =>
    onChange({ ...input, ...patch });

  const setMode = (mode: GdpPerCapitaMode) => {
    if (mode === input.mode) return;
    onChange({ ...input, mode });
  };

  const gdpEditable = input.mode !== 'gdp';
  const popEditable = input.mode !== 'population';
  const pcEditable = input.mode !== 'perCapita';

  const gdpLabel =
    input.measureType === 'nominal'
      ? 'Nominal GDP'
      : input.measureType === 'ppp'
        ? 'PPP-adjusted GDP'
        : 'Real GDP';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        GDP per Capita = GDP / Population. This is average economic output per
        person — not every resident’s income. The measure selector only labels
        your inputs; it does not convert real ↔ nominal ↔ PPP.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="gdppc-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="GDP currency denomination"
        />
      </div>

      <div>
        <label htmlFor="gdppc-measure" className={labelClass}>
          GDP measurement type
        </label>
        <select
          id="gdppc-measure"
          className={`${selectClass} w-full`}
          value={input.measureType}
          onChange={(e) =>
            set({ measureType: e.target.value as GdpMeasureType })
          }
        >
          <option value="real">Real GDP</option>
          <option value="nominal">Nominal GDP</option>
          <option value="ppp">PPP-adjusted GDP</option>
        </select>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Calculation mode"
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={input.mode === m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              input.mode === m.id
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-accent hover:bg-muted/30'
            }`}
          >
            Calculate {m.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load worked example ($2T / 50M → $40,000)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label htmlFor="gdppc-gdp" className={labelClass}>
          {gdpLabel}
          <InfoTooltip
            label="GDP"
            text="Real GDP is the inflation-adjusted value of goods and services produced within an economy during a specified period. Supply figures that already match the selected measurement type."
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FieldShell error={errors.gdp} muted={!gdpEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gdppc-gdp"
              type="text"
              inputMode="decimal"
              readOnly={!gdpEditable}
              tabIndex={gdpEditable ? 0 : -1}
              className={`${inputClass} ${!gdpEditable ? 'cursor-default font-semibold' : ''}`}
              value={gdpEditable ? input.gdp : (result?.displayGdp ?? '')}
              onChange={(e) => set({ gdp: e.target.value })}
              placeholder="2"
            />
          </FieldShell>
          <select
            className={selectClass}
            aria-label="GDP magnitude"
            value={input.gdpMagnitude}
            disabled={!gdpEditable}
            onChange={(e) =>
              set({ gdpMagnitude: e.target.value as GdpMagnitude })
            }
          >
            {GDP_MAGNITUDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {errors.gdp ? (
          <p className="mt-1 text-xs text-rose-600">{errors.gdp}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gdppc-pop" className={labelClass}>
          Population
          <InfoTooltip
            label="Population"
            text="Population is the number of people living in the economy being analyzed during the GDP measurement period."
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FieldShell error={errors.population} muted={!popEditable}>
            <input
              id="gdppc-pop"
              type="text"
              inputMode="decimal"
              readOnly={!popEditable}
              tabIndex={popEditable ? 0 : -1}
              className={`${inputClass} ${!popEditable ? 'cursor-default font-semibold' : ''}`}
              value={
                popEditable ? input.population : (result?.displayPopulation ?? '')
              }
              onChange={(e) => set({ population: e.target.value })}
              placeholder="50"
            />
          </FieldShell>
          <select
            className={selectClass}
            aria-label="Population magnitude"
            value={input.populationMagnitude}
            disabled={!popEditable}
            onChange={(e) =>
              set({
                populationMagnitude: e.target.value as PopulationMagnitude,
              })
            }
          >
            {POPULATION_MAGNITUDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {errors.population ? (
          <p className="mt-1 text-xs text-rose-600">{errors.population}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gdppc-pc" className={labelClass}>
          GDP per Capita
          <InfoTooltip
            label="GDP per Capita"
            text="GDP per capita is GDP divided by the population, representing average economic output per person."
          />
        </label>
        <FieldShell error={errors.gdpPerCapita} muted={!pcEditable}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="gdppc-pc"
            type="text"
            inputMode="decimal"
            readOnly={!pcEditable}
            tabIndex={pcEditable ? 0 : -1}
            className={`${inputClass} ${!pcEditable ? 'cursor-default font-semibold' : ''}`}
            value={
              pcEditable ? input.gdpPerCapita : (result?.displayPerCapita ?? '')
            }
            onChange={(e) => set({ gdpPerCapita: e.target.value })}
            placeholder="—"
          />
          <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
            /person
          </span>
        </FieldShell>
        {errors.gdpPerCapita ? (
          <p className="mt-1 text-xs text-rose-600">{errors.gdpPerCapita}</p>
        ) : null}
      </div>
    </form>
  );
}
