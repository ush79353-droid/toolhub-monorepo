/**
 * Airline miles → dollars — pure math. Canonical value unit: USD per mile.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  airlineLabel,
  type MileValueUnit,
  type MilesToDollarsInput,
  type MilesToDollarsResult,
  type AwardOptionResult,
} from './types';

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatMiles(n: number): string {
  return n.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });
}

export function convertCentsToDollars(cents: number): number {
  return cents / 100;
}

export function convertDollarsToCents(dollars: number): number {
  return dollars * 100;
}

export function toValuePerMileUSD(
  value: number,
  unit: MileValueUnit,
): number {
  return unit === 'cents' ? convertCentsToDollars(value) : value;
}

export function fromValuePerMileUSD(
  usd: number,
  unit: MileValueUnit,
): number {
  return unit === 'cents' ? convertDollarsToCents(usd) : usd;
}

/** Preserve economic value when switching ¢ ↔ $. */
export function convertMileValueUnit(
  value: number,
  from: MileValueUnit,
  to: MileValueUnit,
): number {
  if (from === to) return value;
  return fromValuePerMileUSD(toValuePerMileUSD(value, from), to);
}

export function calculateMilesDollarValue(
  miles: number,
  valuePerMileUSD: number,
): number | null {
  if (!(miles >= 0) || !(valuePerMileUSD >= 0)) return null;
  return miles * valuePerMileUSD;
}

export function calculateAwardEquivalentCost(
  miles: number,
  valuePerMileUSD: number,
  fees: number,
): number | null {
  const milesValue = calculateMilesDollarValue(miles, valuePerMileUSD);
  if (milesValue == null || !(fees >= 0)) return null;
  return milesValue + fees;
}

export function calculatePriceDifference(
  cashPrice: number,
  awardEquivalentCost: number,
): number | null {
  if (!(cashPrice >= 0) || !Number.isFinite(awardEquivalentCost)) return null;
  return cashPrice - awardEquivalentCost;
}

export function calculateSavingsPercentage(
  cashPrice: number,
  awardEquivalentCost: number,
): number | null {
  if (!(cashPrice > 0) || !Number.isFinite(awardEquivalentCost)) return null;
  return ((cashPrice - awardEquivalentCost) / cashPrice) * 100;
}

/** Dollars per mile: (cash − fees) / miles */
export function calculateActualRedemptionValue(
  cashPrice: number,
  fees: number,
  milesRequired: number,
): number | null {
  if (!(milesRequired > 0) || !(cashPrice >= 0) || !(fees >= 0)) return null;
  return (cashPrice - fees) / milesRequired;
}

export function calculateCentsPerMile(
  cashPrice: number,
  fees: number,
  milesRequired: number,
): number | null {
  const usd = calculateActualRedemptionValue(cashPrice, fees, milesRequired);
  if (usd == null) return null;
  return convertDollarsToCents(usd);
}

export function calculateMilesRequiredForTargetValue(
  targetDollars: number,
  valuePerMileUSD: number,
): number | null {
  if (!(targetDollars >= 0) || !(valuePerMileUSD > 0)) return null;
  return Math.ceil(targetDollars / valuePerMileUSD);
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function buildAwardOption(
  miles: number,
  fees: number,
  cash: number,
  valuePerMileUSD: number,
): AwardOptionResult | null {
  const estimatedMilesValue = calculateMilesDollarValue(miles, valuePerMileUSD);
  const awardEquivalentCost = calculateAwardEquivalentCost(
    miles,
    valuePerMileUSD,
    fees,
  );
  if (estimatedMilesValue == null || awardEquivalentCost == null) return null;
  const priceDifference = calculatePriceDifference(cash, awardEquivalentCost);
  if (priceDifference == null) return null;
  return {
    milesRequired: miles,
    additionalFees: fees,
    cashTicketPrice: cash,
    estimatedMilesValue,
    awardEquivalentCost,
    priceDifference,
    savingsPercentage: calculateSavingsPercentage(cash, awardEquivalentCost),
    actualRedemptionCentsPerMile: calculateCentsPerMile(cash, fees, miles),
  };
}

function recommendationText(
  priceDifference: number,
  actualCents: number | null,
  assumedCents: number,
): string {
  if (priceDifference > 0) {
    const base =
      'Using miles provides greater estimated economic value in this scenario.';
    if (actualCents != null && actualCents > assumedCents) {
      return `${base} Actual redemption (${fmt(actualCents)}¢/mi) exceeds the assumed ${fmt(assumedCents)}¢/mi benchmark.`;
    }
    return base;
  }
  if (priceDifference < 0) {
    return 'Paying cash offers a lower estimated economic cost in this scenario.';
  }
  return 'Both options have equal estimated economic cost under these inputs.';
}

export function calculateMilesToDollarsFromInput(
  input: MilesToDollarsInput,
): MilesToDollarsResult | null {
  const valueRaw = parseNum(input.valuePerMile);
  const milesRaw = parseNum(input.milesRequired);
  const feesRaw = parseNum(input.additionalFees);
  const cashRaw = parseNum(input.cashTicketPrice);
  if (valueRaw == null || !(valueRaw > 0)) return null;
  if (milesRaw == null || milesRaw < 0) return null;
  if (feesRaw == null || feesRaw < 0) return null;
  if (cashRaw == null || cashRaw < 0) return null;

  const valuePerMileUSD = toValuePerMileUSD(valueRaw, input.mileValueUnit);
  const valuePerMileCents = convertDollarsToCents(valuePerMileUSD);
  const optionA = buildAwardOption(
    milesRaw,
    feesRaw,
    cashRaw,
    valuePerMileUSD,
  );
  if (!optionA) return null;

  // Redemption value needs miles > 0; zero miles → null cents (safe)
  const actualCents =
    milesRaw > 0
      ? calculateCentsPerMile(cashRaw, feesRaw, milesRaw)
      : null;

  const steps: string[] = [];
  steps.push(`Airline: ${airlineLabel(input.airlineProgram)}`);
  steps.push(
    `Assumed value = ${fmt(valuePerMileCents)}¢/mile ($${fmt(valuePerMileUSD, 4)}/mile) — illustrative`,
  );
  steps.push(
    `Miles value = ${formatMiles(milesRaw)} × $${fmt(valuePerMileUSD, 4)} = ${formatCurrencyValue(optionA.estimatedMilesValue, 'USD')}`,
  );
  steps.push(
    `Award-equivalent cost = ${formatCurrencyValue(optionA.estimatedMilesValue, 'USD')} + ${formatCurrencyValue(feesRaw, 'USD')} = ${formatCurrencyValue(optionA.awardEquivalentCost, 'USD')}`,
  );
  steps.push(
    `Price difference = ${formatCurrencyValue(cashRaw, 'USD')} − ${formatCurrencyValue(optionA.awardEquivalentCost, 'USD')} = ${formatCurrencyValue(optionA.priceDifference, 'USD')}`,
  );
  if (optionA.savingsPercentage != null) {
    steps.push(`Savings % = ${fmt(optionA.savingsPercentage)}%`);
  } else {
    steps.push('Savings % = n/a (cash price is zero)');
  }
  if (actualCents != null) {
    steps.push(
      `Actual redemption = (${formatCurrencyValue(cashRaw, 'USD')} − ${formatCurrencyValue(feesRaw, 'USD')}) / ${formatMiles(milesRaw)} = ${fmt(actualCents)}¢/mi`,
    );
  } else {
    steps.push('Actual redemption = n/a (miles required must be > 0)');
  }

  let convertEstimatedValue: number | null = null;
  if (input.showConvert) {
    const convMiles = parseNum(input.convertMiles);
    if (convMiles == null || convMiles < 0) return null;
    convertEstimatedValue = calculateMilesDollarValue(
      convMiles,
      valuePerMileUSD,
    );
    if (convertEstimatedValue == null) return null;
    steps.push(
      `Convert balance: ${formatMiles(convMiles)} × $${fmt(valuePerMileUSD, 4)} = ${formatCurrencyValue(convertEstimatedValue, 'USD')}`,
    );
  }

  let optionB: AwardOptionResult | null = null;
  let compareNote: string | null = null;
  if (input.showCompare) {
    const bMiles = parseNum(input.optionBMiles);
    const bFees = parseNum(input.optionBFees);
    const bCash = parseNum(input.optionBCash);
    if (bMiles == null || bMiles < 0) return null;
    if (bFees == null || bFees < 0) return null;
    if (bCash == null || bCash < 0) return null;
    optionB = buildAwardOption(bMiles, bFees, bCash, valuePerMileUSD);
    if (!optionB) return null;
    const aCents = optionA.actualRedemptionCentsPerMile;
    const bCents = optionB.actualRedemptionCentsPerMile;
    if (aCents != null && bCents != null) {
      if (aCents > bCents) {
        compareNote = `Option A has higher cents-per-mile (${fmt(aCents)}¢ vs ${fmt(bCents)}¢).`;
      } else if (bCents > aCents) {
        compareNote = `Option B has higher cents-per-mile (${fmt(bCents)}¢ vs ${fmt(aCents)}¢).`;
      } else {
        compareNote = 'Both options deliver the same cents-per-mile.';
      }
      if (optionA.awardEquivalentCost < optionB.awardEquivalentCost) {
        compareNote += ` Option A has lower award-equivalent cost.`;
      } else if (optionB.awardEquivalentCost < optionA.awardEquivalentCost) {
        compareNote += ` Option B has lower award-equivalent cost.`;
      }
    } else {
      compareNote =
        'Compare cents-per-mile only when both options have miles required > 0.';
    }
    steps.push(`Option B award-equivalent = ${formatCurrencyValue(optionB.awardEquivalentCost, 'USD')}`);
  }

  let milesForTarget: number | null = null;
  if (input.showTarget) {
    const target = parseNum(input.targetDollars);
    if (target == null || target < 0) return null;
    milesForTarget = calculateMilesRequiredForTargetValue(
      target,
      valuePerMileUSD,
    );
    if (milesForTarget == null) return null;
    steps.push(
      `Miles for ${formatCurrencyValue(target, 'USD')} ≈ ${formatMiles(milesForTarget)} (ceil)`,
    );
  }

  return {
    airlineLabel: airlineLabel(input.airlineProgram),
    valuePerMileUSD,
    valuePerMileCents,
    estimatedMilesValue: optionA.estimatedMilesValue,
    additionalFees: feesRaw,
    awardEquivalentCost: optionA.awardEquivalentCost,
    cashTicketPrice: cashRaw,
    priceDifference: optionA.priceDifference,
    savingsPercentage: optionA.savingsPercentage,
    actualRedemptionCentsPerMile: actualCents,
    recommendation: recommendationText(
      optionA.priceDifference,
      actualCents,
      valuePerMileCents,
    ),
    convertEstimatedValue,
    optionB,
    compareNote,
    milesForTarget,
    formulaSteps: steps,
    interpretation:
      'Airline miles are loyalty units, not geographic distance. Assumed cents-per-mile is illustrative and editable — not a guaranteed cash rate. Actual award cash outlay is taxes/fees only; award-equivalent cost includes the assumed mile value. Availability, devaluation, and opportunity cost are not modeled.',
  };
}
