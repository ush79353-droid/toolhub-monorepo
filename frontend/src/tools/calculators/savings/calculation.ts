import type {
  CompoundFrequency,
  DepositFrequency,
  DepositTiming,
  KnownRateKind,
  SavingsResult,
} from './types';
import { COMPOUNDING_OPTIONS, DEPOSIT_FREQUENCY_OPTIONS } from './types';
import type { SupportedCurrency } from '@/tools/shared/currency';

export function compoundPeriodsPerYear(freq: CompoundFrequency): number {
  return COMPOUNDING_OPTIONS.find((o) => o.value === freq)?.periodsPerYear ?? 12;
}

export function depositPeriodsPerYear(freq: DepositFrequency): number {
  return DEPOSIT_FREQUENCY_OPTIONS.find((o) => o.value === freq)?.periodsPerYear ?? 12;
}

/** APY = (1 + r/m)^m − 1 */
export function nominalToApy(nominalRateDecimal: number, compoundsPerYear: number): number {
  if (!Number.isFinite(nominalRateDecimal) || !Number.isFinite(compoundsPerYear)) {
    return Number.NaN;
  }
  if (compoundsPerYear <= 0) return Number.NaN;
  if (nominalRateDecimal === 0) return 0;
  return (1 + nominalRateDecimal / compoundsPerYear) ** compoundsPerYear - 1;
}

/** r = m × ((1 + APY)^(1/m) − 1) */
export function apyToNominal(apyDecimal: number, compoundsPerYear: number): number {
  if (!Number.isFinite(apyDecimal) || !Number.isFinite(compoundsPerYear)) {
    return Number.NaN;
  }
  if (compoundsPerYear <= 0) return Number.NaN;
  if (apyDecimal === 0) return 0;
  return compoundsPerYear * ((1 + apyDecimal) ** (1 / compoundsPerYear) - 1);
}

function resolveRates(
  knownRate: KnownRateKind,
  ratePercent: number,
  compoundN: number
): { nominalDecimal: number; apyDecimal: number } | null {
  const entered = ratePercent / 100;
  if (!Number.isFinite(entered) || entered < 0) return null;
  if (knownRate === 'interest-rate') {
    const apyDecimal = nominalToApy(entered, compoundN);
    if (!Number.isFinite(apyDecimal)) return null;
    return { nominalDecimal: entered, apyDecimal };
  }
  const nominalDecimal = apyToNominal(entered, compoundN);
  if (!Number.isFinite(nominalDecimal)) return null;
  return { nominalDecimal, apyDecimal: entered };
}

/**
 * Compounding-grid ledger. Recurring deposits are prorated onto each compound
 * step when frequencies differ: stepDeposit = amount × (depositN / compoundN)
 * × (1 + growth)^yearsElapsed. Begin deposits earn interest in the same step.
 */
export function simulateSavings(params: {
  principal: number;
  nominalRateDecimal: number;
  years: number;
  compoundN: number;
  depositAmount: number;
  depositN: number;
  timing: DepositTiming;
  depositGrowthDecimal: number;
}): { finalBalance: number; totalAdditionalDeposits: number } | null {
  const {
    principal,
    nominalRateDecimal,
    years,
    compoundN,
    depositAmount,
    depositN,
    timing,
    depositGrowthDecimal,
  } = params;

  if (
    ![
      principal,
      nominalRateDecimal,
      years,
      compoundN,
      depositAmount,
      depositN,
      depositGrowthDecimal,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (principal < 0 || years <= 0 || compoundN <= 0 || nominalRateDecimal < 0) return null;
  if (depositAmount < 0 || depositN < 0 || depositGrowthDecimal < 0) return null;

  const totalPeriods = Math.round(compoundN * years);
  if (!Number.isFinite(totalPeriods) || totalPeriods <= 0) return null;

  const ratePer = nominalRateDecimal / compoundN;
  if (!Number.isFinite(ratePer) || 1 + ratePer <= 0) return null;

  let balance = principal;
  let totalAdditionalDeposits = 0;

  for (let i = 1; i <= totalPeriods; i++) {
    const yearsElapsedBefore = (i - 1) / compoundN;
    const growthFactor =
      depositGrowthDecimal === 0 ? 1 : (1 + depositGrowthDecimal) ** yearsElapsedBefore;
    const stepDeposit =
      depositN > 0 ? depositAmount * (depositN / compoundN) * growthFactor : 0;
    if (!Number.isFinite(stepDeposit) || stepDeposit < 0) return null;

    if (timing === 'beginning' && stepDeposit > 0) {
      balance += stepDeposit;
      totalAdditionalDeposits += stepDeposit;
    }

    balance *= 1 + ratePer;
    if (!Number.isFinite(balance) || !Number.isFinite(balance) || balance < 0) return null;

    if (timing === 'end' && stepDeposit > 0) {
      balance += stepDeposit;
      totalAdditionalDeposits += stepDeposit;
    }
  }

  if (!Number.isFinite(balance) || !Number.isFinite(totalAdditionalDeposits)) return null;
  return { finalBalance: balance, totalAdditionalDeposits };
}

function shares(initial: number, deposits: number, interest: number) {
  const total = initial + deposits + interest;
  if (!(total > 0)) {
    return { initialShare: 0, depositsShare: 0, interestShare: 0 };
  }
  return {
    initialShare: (initial / total) * 100,
    depositsShare: (deposits / total) * 100,
    interestShare: (interest / total) * 100,
  };
}

export function calculateSavings(input: {
  knownRate: KnownRateKind;
  ratePercent: number;
  initialSavings: number;
  termYears: number;
  termMonths: number;
  compounding: CompoundFrequency;
  depositAmount: number;
  depositFrequency: DepositFrequency;
  depositTiming: DepositTiming;
  adjustInflation: boolean;
  inflationPercent: number;
  depositGrowthPercent: number;
  resultCurrency: SupportedCurrency;
}): SavingsResult | null {
  const {
    knownRate,
    ratePercent,
    initialSavings,
    termYears,
    termMonths,
    compounding,
    depositAmount,
    depositFrequency,
    depositTiming,
    adjustInflation,
    inflationPercent,
    depositGrowthPercent,
    resultCurrency,
  } = input;

  if (
    ![
      ratePercent,
      initialSavings,
      termYears,
      termMonths,
      depositAmount,
      inflationPercent,
      depositGrowthPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (initialSavings < 0 || ratePercent < 0 || depositAmount < 0) return null;
  if (inflationPercent < 0 || depositGrowthPercent < 0) return null;

  const years = termYears + termMonths / 12;
  if (!Number.isFinite(years) || years <= 0) return null;

  const compoundN = compoundPeriodsPerYear(compounding);
  const depositN = depositPeriodsPerYear(depositFrequency);
  const rates = resolveRates(knownRate, ratePercent, compoundN);
  if (!rates) return null;

  const growthDecimal = adjustInflation ? depositGrowthPercent / 100 : 0;
  const inflationDecimal = adjustInflation ? inflationPercent / 100 : 0;

  const sim = simulateSavings({
    principal: initialSavings,
    nominalRateDecimal: rates.nominalDecimal,
    years,
    compoundN,
    depositAmount,
    depositN,
    timing: depositTiming,
    depositGrowthDecimal: growthDecimal,
  });
  if (!sim) return null;

  const totalAdditionalDeposits = sim.totalAdditionalDeposits;
  const totalPrincipal = initialSavings + totalAdditionalDeposits;
  const totalInterest = sim.finalBalance - totalPrincipal;
  if (!Number.isFinite(totalInterest) || sim.finalBalance < -1e-9) return null;

  let realFinalBalance: number | null = null;
  if (adjustInflation) {
    const denom = (1 + inflationDecimal) ** years;
    if (!Number.isFinite(denom) || denom <= 0) return null;
    realFinalBalance = sim.finalBalance / denom;
    if (!Number.isFinite(realFinalBalance)) return null;
  }

  const pie = shares(
    Math.max(0, initialSavings),
    Math.max(0, totalAdditionalDeposits),
    Math.max(0, totalInterest)
  );

  return {
    apyPercent: rates.apyDecimal * 100,
    nominalRatePercent: rates.nominalDecimal * 100,
    finalBalance: sim.finalBalance,
    totalAdditionalDeposits,
    totalPrincipal,
    totalInterest,
    realFinalBalance,
    inflationPercent: adjustInflation ? inflationPercent : null,
    years,
    compoundPeriodsPerYear: compoundN,
    resultCurrency,
    ...pie,
  };
}
