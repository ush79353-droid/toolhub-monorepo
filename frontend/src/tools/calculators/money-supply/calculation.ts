/**
 * Money supply aggregates (definition-aware, no double-counting).
 * M0 (currency-only) = Notes + Coins
 * MB = Currency in circulation + Reserve balances
 * M1 = Currency + demand + travelers + OCD + savings (selected models)
 * M2 = M1 + eligible retail MMF + eligible time deposits
 * MZM / M3 / M4 — only when the selected definition supports them
 */

import type { SupportedCurrency } from '@/tools/shared/currency';
import { getCurrencyFractionDigits } from '@/tools/shared/currency';
import {
  DEFINITION_OPTIONS,
  MONEY_MAGNITUDE_OPTIONS,
  type MoneyMagnitude,
  type MoneySupplyDefinition,
} from './types';

export function magnitudeFactor(magnitude: MoneyMagnitude): number {
  return MONEY_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.factor ?? 1;
}

export function toBaseUnits(amount: number, magnitude: MoneyMagnitude): number {
  return amount * magnitudeFactor(magnitude);
}

export function calculateM0(notes: number, coins: number): number {
  assertNonNeg(notes, 'Federal Reserve notes');
  assertNonNeg(coins, 'Coins');
  return notes + coins;
}

export function calculateMonetaryBase(
  currencyInCirculation: number,
  reserveBalances: number
): number {
  assertNonNeg(currencyInCirculation, 'Currency in circulation');
  assertNonNeg(reserveBalances, 'Reserve balances');
  return currencyInCirculation + reserveBalances;
}

export function calculateM1(parts: {
  currency: number;
  demandDeposits: number;
  travelersChecks: number;
  otherCheckableDeposits: number;
  savingsDeposits: number;
}): number {
  assertNonNeg(parts.currency, 'Currency');
  assertNonNeg(parts.demandDeposits, 'Demand deposits');
  assertNonNeg(parts.travelersChecks, "Traveler's checks");
  assertNonNeg(parts.otherCheckableDeposits, 'Other checkable deposits');
  assertNonNeg(parts.savingsDeposits, 'Savings deposits');
  return (
    parts.currency +
    parts.demandDeposits +
    parts.travelersChecks +
    parts.otherCheckableDeposits +
    parts.savingsDeposits
  );
}

export function calculateM2(
  m1: number,
  eligibleMoneyMarketFunds: number,
  eligibleTimeDeposits: number
): number {
  assertNonNeg(m1, 'M1');
  assertNonNeg(eligibleMoneyMarketFunds, 'Eligible money market funds');
  assertNonNeg(eligibleTimeDeposits, 'Eligible time deposits');
  return m1 + eligibleMoneyMarketFunds + eligibleTimeDeposits;
}

/** MZM-style: liquid at-par balances; excludes time deposits. */
export function calculateMZM(parts: {
  currency: number;
  demandDeposits: number;
  travelersChecks: number;
  otherCheckableDeposits: number;
  savingsDeposits: number;
  eligibleMoneyMarketFunds: number;
}): number {
  assertNonNeg(parts.currency, 'Currency');
  assertNonNeg(parts.demandDeposits, 'Demand deposits');
  assertNonNeg(parts.travelersChecks, "Traveler's checks");
  assertNonNeg(parts.otherCheckableDeposits, 'Other checkable deposits');
  assertNonNeg(parts.savingsDeposits, 'Savings deposits');
  assertNonNeg(parts.eligibleMoneyMarketFunds, 'Eligible money market funds');
  return (
    parts.currency +
    parts.demandDeposits +
    parts.travelersChecks +
    parts.otherCheckableDeposits +
    parts.savingsDeposits +
    parts.eligibleMoneyMarketFunds
  );
}

export function calculateM3(
  m2: number,
  largeTimeDeposits: number,
  institutionalMoneyMarketFunds: number
): number {
  assertNonNeg(m2, 'M2');
  assertNonNeg(largeTimeDeposits, 'Large time deposits');
  assertNonNeg(
    institutionalMoneyMarketFunds,
    'Institutional money market funds'
  );
  return m2 + largeTimeDeposits + institutionalMoneyMarketFunds;
}

export function calculateM4(
  m3: number,
  otherLiquidInstruments: number
): number {
  assertNonNeg(m3, 'M3');
  assertNonNeg(otherLiquidInstruments, 'Other liquid instruments');
  return m3 + otherLiquidInstruments;
}

export function definitionSupportsM3(def: MoneySupplyDefinition): boolean {
  return def === 'textbook' || def === 'custom';
}

export function definitionSupportsM4(def: MoneySupplyDefinition): boolean {
  return def === 'textbook' || def === 'custom';
}

export function definitionSupportsMZM(def: MoneySupplyDefinition): boolean {
  return true;
}

export interface MoneySupplyBundleInput {
  definition: MoneySupplyDefinition;
  currency: SupportedCurrency;
  magnitude: MoneyMagnitude;
  federalReserveNotes: number;
  coins: number;
  currencyInCirculation: number;
  reserveBalances: number;
  demandDeposits: number;
  travelersChecks: number;
  otherCheckableDeposits: number;
  savingsDeposits: number;
  eligibleMoneyMarketFunds: number;
  eligibleTimeDeposits: number;
  largeTimeDeposits: number;
  institutionalMoneyMarketFunds: number;
  otherLiquidInstruments: number;
}

export function calculateMoneySupplyBundle(input: MoneySupplyBundleInput) {
  const mag = input.magnitude;
  const notes = toBaseUnits(input.federalReserveNotes, mag);
  const coins = toBaseUnits(input.coins, mag);
  const circ = toBaseUnits(input.currencyInCirculation, mag);
  const reserves = toBaseUnits(input.reserveBalances, mag);
  const demand = toBaseUnits(input.demandDeposits, mag);
  const travelers = toBaseUnits(input.travelersChecks, mag);
  const ocd = toBaseUnits(input.otherCheckableDeposits, mag);
  const savings = toBaseUnits(input.savingsDeposits, mag);
  const mmf = toBaseUnits(input.eligibleMoneyMarketFunds, mag);
  const time = toBaseUnits(input.eligibleTimeDeposits, mag);
  const largeTime = toBaseUnits(input.largeTimeDeposits, mag);
  const instMmf = toBaseUnits(input.institutionalMoneyMarketFunds, mag);
  const otherLiq = toBaseUnits(input.otherLiquidInstruments, mag);

  const m0 = calculateM0(notes, coins);
  const monetaryBase = calculateMonetaryBase(circ, reserves);
  const m1 = calculateM1({
    currency: circ,
    demandDeposits: demand,
    travelersChecks: travelers,
    otherCheckableDeposits: ocd,
    savingsDeposits: savings,
  });
  const m2 = calculateM2(m1, mmf, time);
  const mzm = calculateMZM({
    currency: circ,
    demandDeposits: demand,
    travelersChecks: travelers,
    otherCheckableDeposits: ocd,
    savingsDeposits: savings,
    eligibleMoneyMarketFunds: mmf,
  });

  let m3: number | null = null;
  let m4: number | null = null;
  let m3UnavailableReason: string | null = null;
  let m4UnavailableReason: string | null = null;

  if (definitionSupportsM3(input.definition)) {
    m3 = calculateM3(m2, largeTime, instMmf);
  } else {
    m3UnavailableReason =
      'M3 is not available for the selected monetary aggregate definition (U.S. Federal Reserve discontinued M3 publication in 2006).';
  }

  if (definitionSupportsM4(input.definition)) {
    m4 = calculateM4(m3!, otherLiq);
  } else {
    m4UnavailableReason =
      'M4 is not available for the selected monetary aggregate definition.';
  }

  return {
    m0,
    monetaryBase,
    m1,
    m2,
    mzm: definitionSupportsMZM(input.definition) ? mzm : null,
    m3,
    m4,
    m3UnavailableReason,
    m4UnavailableReason,
    currencyFromNotesCoins: m0,
    components: {
      notes,
      coins,
      circ,
      reserves,
      demand,
      travelers,
      ocd,
      savings,
      mmf,
      time,
      largeTime,
      instMmf,
      otherLiq,
    },
  };
}

function assertNonNeg(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite number ≥ 0.`);
  }
}

export function formatMoneyAmount(
  value: number,
  currency: SupportedCurrency
): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function definitionLabel(def: MoneySupplyDefinition): string {
  return DEFINITION_OPTIONS.find((o) => o.id === def)?.label ?? def;
}

export function buildMoneySupplyPresentation(
  input: MoneySupplyBundleInput,
  bundle: ReturnType<typeof calculateMoneySupplyBundle>
) {
  const cur = input.currency;
  const fmt = (v: number) => formatMoneyAmount(v, cur);
  const defLabel = definitionLabel(input.definition);
  const c = bundle.components;

  const m1Parts = [
    { label: 'Currency in circulation', value: c.circ, formatted: fmt(c.circ) },
    { label: 'Demand deposits', value: c.demand, formatted: fmt(c.demand) },
    {
      label: "Traveler's checks",
      value: c.travelers,
      formatted: fmt(c.travelers),
    },
    {
      label: 'Other checkable deposits',
      value: c.ocd,
      formatted: fmt(c.ocd),
    },
    { label: 'Savings deposits', value: c.savings, formatted: fmt(c.savings) },
  ];

  const m2Parts = [
    { label: 'M1', value: bundle.m1, formatted: fmt(bundle.m1) },
    {
      label: 'Eligible money market funds',
      value: c.mmf,
      formatted: fmt(c.mmf),
    },
    {
      label: 'Eligible time deposits',
      value: c.time,
      formatted: fmt(c.time),
    },
  ];

  const mbParts = [
    {
      label: 'Currency in circulation',
      value: c.circ,
      formatted: fmt(c.circ),
    },
    {
      label: 'Reserve balances',
      value: c.reserves,
      formatted: fmt(c.reserves),
    },
  ];

  const chartAggregates: { label: string; value: number; formatted: string }[] =
    [
      { label: 'M0', value: bundle.m0, formatted: fmt(bundle.m0) },
      { label: 'MB', value: bundle.monetaryBase, formatted: fmt(bundle.monetaryBase) },
      { label: 'M1', value: bundle.m1, formatted: fmt(bundle.m1) },
      { label: 'M2', value: bundle.m2, formatted: fmt(bundle.m2) },
    ];
  if (bundle.mzm != null) {
    chartAggregates.push({
      label: 'MZM',
      value: bundle.mzm,
      formatted: fmt(bundle.mzm),
    });
  }
  if (bundle.m3 != null) {
    chartAggregates.push({
      label: 'M3',
      value: bundle.m3,
      formatted: fmt(bundle.m3),
    });
  }
  if (bundle.m4 != null) {
    chartAggregates.push({
      label: 'M4',
      value: bundle.m4,
      formatted: fmt(bundle.m4),
    });
  }

  const steps = [
    `M0 (currency-only) = notes + coins = ${fmt(c.notes)} + ${fmt(c.coins)} = ${fmt(bundle.m0)}.`,
    `MB = currency in circulation + reserve balances = ${fmt(c.circ)} + ${fmt(c.reserves)} = ${fmt(bundle.monetaryBase)}.`,
    `M1 = currency + demand + traveler's checks + other checkable + savings = ${fmt(bundle.m1)} under the ${defLabel}.`,
    `M2 = M1 + eligible money market funds + eligible time deposits = ${fmt(bundle.m1)} + ${fmt(c.mmf)} + ${fmt(c.time)} = ${fmt(bundle.m2)}.`,
  ];
  if (bundle.mzm != null) {
    steps.push(
      `MZM (educational) excludes time deposits: ${fmt(bundle.mzm)}.`
    );
  }
  if (bundle.m3 != null) {
    steps.push(
      `M3 = M2 + large time deposits + institutional MMF = ${fmt(bundle.m3)}.`
    );
  } else if (bundle.m3UnavailableReason) {
    steps.push(bundle.m3UnavailableReason);
  }
  if (bundle.m4 != null) {
    steps.push(
      `M4 = M3 + other liquid instruments = ${fmt(bundle.m4)} (custom/textbook model).`
    );
  } else if (bundle.m4UnavailableReason) {
    steps.push(bundle.m4UnavailableReason);
  }

  const formulaBreakdown = [
    'M0 = Notes + Coins (currency-only)',
    'MB = Currency in circulation + Reserve balances',
    'M1 = Currency + Demand + Traveler\'s checks + Other checkable + Savings',
    'M2 = M1 + Eligible MMF + Eligible time deposits',
  ].join(' · ');

  const interpretation = [
    `M0 = ${fmt(bundle.m0)}; notes and coins in the selected currency-only M0 definition.`,
    `Monetary base = ${fmt(bundle.monetaryBase)}; currency in circulation plus reserve balances.`,
    `M1 = ${fmt(bundle.m1)}; liquid monetary assets in the selected M1 definition.`,
    `M2 = ${fmt(bundle.m2)}; M1 plus eligible money market and time-deposit components.`,
  ].join(' ');

  const explanation =
    'Results are model-based educational calculations for the selected monetary aggregate definition; not official central bank statistics. Definitions of M0–M4 differ by jurisdiction and period; savings enter M1 in the post–May 2020 U.S.-style illustration used here so they are not added again in M2.';

  return {
    definition: input.definition,
    definitionLabel: defLabel,
    currency: cur,
    magnitude: input.magnitude,
    m0: bundle.m0,
    monetaryBase: bundle.monetaryBase,
    m1: bundle.m1,
    m2: bundle.m2,
    mzm: bundle.mzm,
    m3: bundle.m3,
    m4: bundle.m4,
    m3UnavailableReason: bundle.m3UnavailableReason,
    m4UnavailableReason: bundle.m4UnavailableReason,
    currencyFromNotesCoins: bundle.currencyFromNotesCoins,
    formattedM0: fmt(bundle.m0),
    formattedMb: fmt(bundle.monetaryBase),
    formattedM1: fmt(bundle.m1),
    formattedM2: fmt(bundle.m2),
    formattedMzm: bundle.mzm != null ? fmt(bundle.mzm) : '—',
    formattedM3: bundle.m3 != null ? fmt(bundle.m3) : 'Unavailable',
    formattedM4: bundle.m4 != null ? fmt(bundle.m4) : 'Unavailable',
    interpretation,
    explanation,
    formulaBreakdown,
    steps,
    m1Parts,
    m2Parts,
    mbParts,
    chartAggregates,
  };
}
