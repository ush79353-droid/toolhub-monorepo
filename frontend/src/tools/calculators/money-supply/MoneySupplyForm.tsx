'use client';

import { useState, type ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFINITION_OPTIONS,
  MONEY_MAGNITUDE_OPTIONS,
  type MoneyMagnitude,
  type MoneySupplyDefinition,
  type MoneySupplyFieldErrors,
  type MoneySupplyInput,
  type MoneySupplyResult,
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

function Section({
  title,
  open,
  onToggle,
  children,
  summary,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  summary?: string;
}) {
  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-accent">{title}</span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {summary ? `${summary} · ` : ''}
          {open ? 'Hide' : 'Show'}
        </span>
      </button>
      {open ? <div className="space-y-3 border-t border-border px-3 py-3">{children}</div> : null}
    </div>
  );
}

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function Readout({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <FieldShell muted>
        <input
          id={id}
          type="text"
          readOnly
          tabIndex={-1}
          className={`${inputClass} cursor-default font-semibold`}
          value={value}
          placeholder="—"
        />
      </FieldShell>
    </div>
  );
}

interface MoneySupplyFormProps {
  input: MoneySupplyInput;
  errors: MoneySupplyFieldErrors;
  result: MoneySupplyResult | null;
  onChange: (input: MoneySupplyInput) => void;
  onLoadExample: () => void;
}

export function MoneySupplyForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: MoneySupplyFormProps) {
  const [open, setOpen] = useState({
    m0: true,
    mb: true,
    m1: true,
    m2: true,
    mzm: false,
    m3: false,
    m4: false,
  });
  const set = (patch: Partial<MoneySupplyInput>) =>
    onChange({ ...input, ...patch });
  const toggle = (key: keyof typeof open) =>
    setOpen((o) => ({ ...o, [key]: !o[key] }));
  const broad =
    input.definition === 'textbook' || input.definition === 'custom';
  const defHelp =
    DEFINITION_OPTIONS.find((d) => d.id === input.definition)?.short ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
 Educational monetary aggregates; not official central bank series.
        Definitions of M0–M4 vary by country. Currency labels denomination only;
        one magnitude applies to all money inputs (no silent unit mixing).
      </p>

      <div>
        <label htmlFor="ms-definition" className={labelClass}>
          Monetary aggregate definition
        </label>
        <select
          id="ms-definition"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
          value={input.definition}
          onChange={(e) =>
            set({ definition: e.target.value as MoneySupplyDefinition })
          }
        >
          {DEFINITION_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {defHelp}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-accent">
            Currency
          </span>
          <CurrencySelect
            id="ms-currency"
            value={input.currency}
            onChange={(code: SupportedCurrency) => set({ currency: code })}
            aria-label="Money denomination"
          />
        </div>
        <div>
          <label htmlFor="ms-magnitude" className={labelClass}>
            Amount scale
          </label>
          <select
            id="ms-magnitude"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
            value={input.magnitude}
            onChange={(e) =>
              set({ magnitude: e.target.value as MoneyMagnitude })
            }
            aria-label="Money magnitude"
          >
            {MONEY_MAGNITUDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (M0 $2.1M · MB $6.15M · M1 $21.501M · M2 $22.641M)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <Section
        title="M0 Money Supply"
        open={open.m0}
        onToggle={() => toggle('m0')}
        summary={result?.formattedM0}
      >
        <p className="text-xs text-muted-foreground">
          Currency-only M0 = notes + coins. Not automatically identical to the
          monetary base.
        </p>
        <MoneyField
          id="ms-notes"
          label="Federal Reserve notes"
          tip="Value of currency notes included in the selected M0 definition."
          value={input.federalReserveNotes}
          error={errors.federalReserveNotes}
          onChange={(v) => set({ federalReserveNotes: v })}
        />
        <MoneyField
          id="ms-coins"
          label="Coins"
          tip="Coin currency included in currency-only M0."
          value={input.coins}
          error={errors.coins}
          onChange={(v) => set({ coins: v })}
        />
        <Readout id="ms-m0" label="M0" value={result?.formattedM0 ?? ''} />
      </Section>

      <Section
        title="Monetary Base (MB)"
        open={open.mb}
        onToggle={() => toggle('mb')}
        summary={result?.formattedMb}
      >
        <p className="text-xs text-muted-foreground">
          MB = currency in circulation + reserve balances at the central bank.
          Enter circulation separately from notes+coins when they differ.
        </p>
        <MoneyField
          id="ms-circ"
          label="Currency in circulation"
          tip="Currency held by the public outside banks for the selected MB definition."
          value={input.currencyInCirculation}
          error={errors.currencyInCirculation}
          onChange={(v) => set({ currencyInCirculation: v })}
        />
        <MoneyField
          id="ms-reserves"
          label="Reserve balances at the central bank"
          tip="Bank reserves held at the central bank included in the monetary base."
          value={input.reserveBalances}
          error={errors.reserveBalances}
          onChange={(v) => set({ reserveBalances: v })}
        />
        <Readout
          id="ms-mb"
          label="Monetary base"
          value={result?.formattedMb ?? ''}
        />
      </Section>

      <Section
        title="M1 Money Supply"
        open={open.m1}
        onToggle={() => toggle('m1')}
        summary={result?.formattedM1}
      >
        <p className="text-xs text-muted-foreground">
          Selected model: currency + demand + traveler&apos;s checks + other
          checkable + savings (nonoverlapping). Savings are included here so they
          are not added again in M2.
        </p>
        <MoneyField
          id="ms-demand"
          label="Demand deposits"
          tip="Non-interest or demand deposit balances in the selected M1 set."
          value={input.demandDeposits}
          error={errors.demandDeposits}
          onChange={(v) => set({ demandDeposits: v })}
        />
        <MoneyField
          id="ms-travelers"
          label="Traveler's checks"
          tip="Outstanding traveler's checks included in the selected M1 definition."
          value={input.travelersChecks}
          error={errors.travelersChecks}
          onChange={(v) => set({ travelersChecks: v })}
        />
        <MoneyField
          id="ms-ocd"
          label="Other checkable deposits"
          tip="Other checkable deposits not already counted in demand deposits."
          value={input.otherCheckableDeposits}
          error={errors.otherCheckableDeposits}
          onChange={(v) => set({ otherCheckableDeposits: v })}
        />
        <MoneyField
          id="ms-savings"
          label="Savings deposits"
          tip="Included in this model's M1 (aligned with post–May 2020 U.S.-style illustration)."
          value={input.savingsDeposits}
          error={errors.savingsDeposits}
          onChange={(v) => set({ savingsDeposits: v })}
        />
        <Readout id="ms-m1" label="M1" value={result?.formattedM1 ?? ''} />
      </Section>

      <Section
        title="M2 Money Supply"
        open={open.m2}
        onToggle={() => toggle('m2')}
        summary={result?.formattedM2}
      >
        <p className="text-xs text-muted-foreground">
          M2 = M1 + eligible money market funds + eligible time deposits. Do not
          re-enter savings already in M1.
        </p>
        <MoneyField
          id="ms-mmf"
          label="Eligible money market funds"
          tip="Retail / eligible money market fund balances added beyond M1."
          value={input.eligibleMoneyMarketFunds}
          error={errors.eligibleMoneyMarketFunds}
          onChange={(v) => set({ eligibleMoneyMarketFunds: v })}
        />
        <MoneyField
          id="ms-time"
          label="Eligible time deposits"
          tip="Small-denomination or otherwise eligible time deposits under the selected definition."
          value={input.eligibleTimeDeposits}
          error={errors.eligibleTimeDeposits}
          onChange={(v) => set({ eligibleTimeDeposits: v })}
        />
        <Readout id="ms-m2" label="M2" value={result?.formattedM2 ?? ''} />
      </Section>

      <Section
        title="Money Zero Maturity (MZM)"
        open={open.mzm}
        onToggle={() => toggle('mzm')}
        summary={result?.formattedMzm}
      >
        <p className="text-xs text-muted-foreground">
          Educational MZM-style total: currency + checkable/demand + savings +
          eligible MMF, excluding time deposits. Not an automatic official series.
        </p>
        <Readout id="ms-mzm" label="MZM" value={result?.formattedMzm ?? ''} />
      </Section>

      <Section
        title="M3 Money Supply"
        open={open.m3}
        onToggle={() => toggle('m3')}
        summary={result?.formattedM3}
      >
        {broad ? (
          <>
            <p className="text-xs text-muted-foreground">
              Teaching/custom M3 = M2 + large time deposits + institutional money
              market funds.
            </p>
            <MoneyField
              id="ms-large-time"
              label="Large time deposits"
              tip="Wholesale or large time deposits in the selected broader model."
              value={input.largeTimeDeposits}
              error={errors.largeTimeDeposits}
              onChange={(v) => set({ largeTimeDeposits: v })}
            />
            <MoneyField
              id="ms-inst-mmf"
              label="Institutional money market funds"
              tip="Institutional MMF balances in the selected M3 model."
              value={input.institutionalMoneyMarketFunds}
              error={errors.institutionalMoneyMarketFunds}
              onChange={(v) => set({ institutionalMoneyMarketFunds: v })}
            />
            <Readout id="ms-m3" label="M3" value={result?.formattedM3 ?? ''} />
          </>
        ) : (
          <p className="text-xs text-muted-foreground" role="status">
            {result?.m3UnavailableReason ??
              'M3 is not available for the selected monetary aggregate definition.'}
          </p>
        )}
      </Section>

      <Section
        title="M4 Money Supply"
        open={open.m4}
        onToggle={() => toggle('m4')}
        summary={result?.formattedM4}
      >
        {broad ? (
          <>
            <p className="text-xs text-muted-foreground">
              Custom/textbook M4 = M3 + other liquid instruments (explicitly
              labeled; not a universal official aggregate).
            </p>
            <MoneyField
              id="ms-other-liq"
              label="Other liquid instruments"
              tip="Additional wholesale or custom liquid instruments in this model only."
              value={input.otherLiquidInstruments}
              error={errors.otherLiquidInstruments}
              onChange={(v) => set({ otherLiquidInstruments: v })}
            />
            <Readout id="ms-m4" label="M4" value={result?.formattedM4 ?? ''} />
          </>
        ) : (
          <p className="text-xs text-muted-foreground" role="status">
            {result?.m4UnavailableReason ??
              'M4 is not available for the selected monetary aggregate definition.'}
          </p>
        )}
      </Section>
    </form>
  );
}
