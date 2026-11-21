/**
 * Retirement Calculator — pure engine (ADR-018).
 *
 * Accumulation (end-of-year ordinary annuity, annual compounding):
 *   FV_lump = P0 × (1+r)^n
 *   FV_annuity = C × ((1+r)^n − 1) / r   (r = 0 → C×n)
 *   Total at retirement = FV_lump + FV_annuity
 *
 * Withdrawals (level annual draw with continued return through life expectancy):
 *   PMT = PV × r / (1 − (1+r)^(−W))   (r = 0 → PV/W)
 *
 * All money figures are nominal (not inflation-adjusted). Enter cost of living
 * and pension in the same dollar basis you use for savings projections.
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  MoneyPeriod,
  RetirementCountryCode,
  RetirementResult,
  Sex,
} from './types';
import {
  LONGEVITY_SOURCE,
  US_PENSION_SOURCE,
} from './longevity-defaults';

export interface RetirementMathInput {
  sex: Sex;
  country: RetirementCountryCode;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  annualSavings: number;
  alreadySaved: number;
  annualReturnPercent: number;
  governmentPensionAnnual: number;
  costOfLivingAnnual: number;
}

export interface RetirementMathResult {
  yearsToRetirement: number;
  yearsInRetirement: number;
  totalSavingsAtRetirement: number;
  incomeFromSavingsAnnual: number;
  totalRetirementIncomeAnnual: number;
  budgetCoveragePercent: number | null;
  moneyLeftAnnual: number;
  alreadyRetired: boolean;
  insufficientFunds: boolean;
  depletedBeforeLifeExpectancy: boolean;
  summaryMessage: string;
  assumptionNotes: string[];
}

export function periodToAnnual(amount: number, period: MoneyPeriod): number {
  if (!Number.isFinite(amount)) return NaN;
  return period === 'month' ? amount * 12 : amount;
}

export function annualToPeriod(annual: number, period: MoneyPeriod): number {
  if (!Number.isFinite(annual)) return NaN;
  return period === 'month' ? annual / 12 : annual;
}

export function futureValueLumpSum(
  principal: number,
  annualReturnDecimal: number,
  years: number
): number | null {
  if (
    ![principal, annualReturnDecimal, years].every(Number.isFinite) ||
    principal < 0 ||
    years < 0 ||
    annualReturnDecimal <= -1
  ) {
    return null;
  }
  if (years === 0) return principal;
  const fv = principal * Math.pow(1 + annualReturnDecimal, years);
  return Number.isFinite(fv) ? fv : null;
}

export function futureValueOrdinaryAnnuity(
  annualContribution: number,
  annualReturnDecimal: number,
  years: number
): number | null {
  if (
    ![annualContribution, annualReturnDecimal, years].every(Number.isFinite) ||
    annualContribution < 0 ||
    years < 0 ||
    annualReturnDecimal <= -1
  ) {
    return null;
  }
  if (years === 0) return 0;
  if (annualReturnDecimal === 0) return annualContribution * years;
  const growth = Math.pow(1 + annualReturnDecimal, years);
  if (!Number.isFinite(growth)) return null;
  const fv = (annualContribution * (growth - 1)) / annualReturnDecimal;
  return Number.isFinite(fv) ? fv : null;
}

/**
 * Constant annual withdrawal that amortizes PV over W years while the
 * remaining balance earns the same annual return (end-of-year draws).
 */
export function amortizedAnnualWithdrawal(
  balance: number,
  annualReturnDecimal: number,
  withdrawalYears: number
): number | null {
  if (
    ![balance, annualReturnDecimal, withdrawalYears].every(Number.isFinite) ||
    balance < 0 ||
    withdrawalYears <= 0 ||
    annualReturnDecimal <= -1
  ) {
    return null;
  }
  if (annualReturnDecimal === 0) return balance / withdrawalYears;
  const factor = Math.pow(1 + annualReturnDecimal, -withdrawalYears);
  if (!Number.isFinite(factor) || factor === 1) return null;
  const pmt = (balance * annualReturnDecimal) / (1 - factor);
  return Number.isFinite(pmt) ? pmt : null;
}

/**
 * Years until an amortized withdrawal schedule depletes the balance when
 * the requested draw exceeds the sustainable PMT (diagnostic only).
 */
export function yearsUntilDepletion(
  balance: number,
  annualDraw: number,
  annualReturnDecimal: number,
  maxYears: number
): number | null {
  if (
    ![balance, annualDraw, annualReturnDecimal, maxYears].every(Number.isFinite) ||
    balance < 0 ||
    annualDraw < 0 ||
    annualReturnDecimal <= -1 ||
    maxYears <= 0
  ) {
    return null;
  }
  if (annualDraw === 0) return null;
  let bal = balance;
  for (let y = 1; y <= Math.ceil(maxYears) + 1; y++) {
    bal = bal * (1 + annualReturnDecimal) - annualDraw;
    if (bal <= 0) return y;
  }
  return null;
}

export function calculateRetirement(
  input: RetirementMathInput
): RetirementMathResult | null {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    annualSavings,
    alreadySaved,
    annualReturnPercent,
    governmentPensionAnnual,
    costOfLivingAnnual,
  } = input;

  if (
    ![
      currentAge,
      retirementAge,
      lifeExpectancy,
      annualSavings,
      alreadySaved,
      annualReturnPercent,
      governmentPensionAnnual,
      costOfLivingAnnual,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (currentAge < 0 || currentAge > 120) return null;
  if (retirementAge < 0 || retirementAge > 120) return null;
  if (lifeExpectancy <= 0 || lifeExpectancy > 130) return null;
  if (annualSavings < 0 || alreadySaved < 0) return null;
  if (governmentPensionAnnual < 0 || costOfLivingAnnual < 0) return null;
  if (annualReturnPercent <= -100) return null;

  const r = annualReturnPercent / 100;
  const alreadyRetired = currentAge >= retirementAge;
  const yearsToRetirement = alreadyRetired
    ? 0
    : retirementAge - currentAge;

  // Fractional years allowed for life expectancy (e.g. 81.4).
  const yearsInRetirement = lifeExpectancy - Math.max(currentAge, retirementAge);

  if (yearsInRetirement <= 0) {
    return {
      yearsToRetirement,
      yearsInRetirement: 0,
      totalSavingsAtRetirement: alreadySaved,
      incomeFromSavingsAnnual: 0,
      totalRetirementIncomeAnnual: governmentPensionAnnual,
      budgetCoveragePercent:
        costOfLivingAnnual > 0
          ? (governmentPensionAnnual / costOfLivingAnnual) * 100
          : null,
      moneyLeftAnnual: governmentPensionAnnual - costOfLivingAnnual,
      alreadyRetired,
      insufficientFunds: costOfLivingAnnual > governmentPensionAnnual,
      depletedBeforeLifeExpectancy: false,
      summaryMessage:
        'Life expectancy is not after retirement age (or current age if already retired), so no savings-draw horizon remains. Adjust ages to project income from savings.',
      assumptionNotes: baseAssumptions(annualReturnPercent, input.country),
    };
  }

  const fvLump = futureValueLumpSum(alreadySaved, r, yearsToRetirement);
  const fvAnn = futureValueOrdinaryAnnuity(annualSavings, r, yearsToRetirement);
  if (fvLump === null || fvAnn === null) return null;

  const totalSavingsAtRetirement = fvLump + fvAnn;
  if (!Number.isFinite(totalSavingsAtRetirement)) return null;

  const incomeFromSavingsAnnual = amortizedAnnualWithdrawal(
    totalSavingsAtRetirement,
    r,
    yearsInRetirement
  );
  if (incomeFromSavingsAnnual === null) return null;

  const totalRetirementIncomeAnnual =
    governmentPensionAnnual + incomeFromSavingsAnnual;
  const moneyLeftAnnual = totalRetirementIncomeAnnual - costOfLivingAnnual;
  const budgetCoveragePercent =
    costOfLivingAnnual > 0
      ? (totalRetirementIncomeAnnual / costOfLivingAnnual) * 100
      : null;

  const insufficientFunds = moneyLeftAnnual < 0;
  // Level amortized draw is sized to last exactly W years; flag shortfall vs living costs instead.
  const depletedBeforeLifeExpectancy = false;

  const summaryMessage = buildSummary({
    alreadyRetired,
    yearsToRetirement,
    yearsInRetirement,
    totalSavingsAtRetirement,
    incomeFromSavingsAnnual,
    governmentPensionAnnual,
    costOfLivingAnnual,
    moneyLeftAnnual,
    budgetCoveragePercent,
    annualReturnPercent,
  });

  return {
    yearsToRetirement,
    yearsInRetirement,
    totalSavingsAtRetirement,
    incomeFromSavingsAnnual,
    totalRetirementIncomeAnnual,
    budgetCoveragePercent,
    moneyLeftAnnual,
    alreadyRetired,
    insufficientFunds,
    depletedBeforeLifeExpectancy,
    summaryMessage,
    assumptionNotes: baseAssumptions(annualReturnPercent, input.country),
  };
}

function baseAssumptions(
  annualReturnPercent: number,
  country: RetirementCountryCode
): string[] {
  const notes = [
    'All money results are nominal (not inflation-adjusted). Keep savings, pension, and cost of living on the same price basis.',
    'Accumulation: end-of-year ordinary annuity with annual compounding. Ongoing savings are converted to an annual contribution.',
    'Retirement draws: constant annual withdrawal that amortizes the nest egg through life expectancy while the balance keeps earning the same return (not simple division).',
    `Investment return assumption: ${annualReturnPercent}% per year (constant).`,
    `Life-expectancy defaults: ${LONGEVITY_SOURCE}`,
    'Taxes, fees, healthcare, Social Security claiming strategies, and sequence-of-returns risk are omitted.',
    'Informational estimate only — not financial, tax, or retirement advice.',
  ];
  if (country === 'US') {
    notes.splice(5, 0, `US government-pension default: ${US_PENSION_SOURCE}`);
  } else {
    notes.splice(
      5,
      0,
      'Government pension defaults to 0 outside the United States; enter a jurisdiction-specific benefit manually.'
    );
  }
  return notes;
}

function buildSummary(args: {
  alreadyRetired: boolean;
  yearsToRetirement: number;
  yearsInRetirement: number;
  totalSavingsAtRetirement: number;
  incomeFromSavingsAnnual: number;
  governmentPensionAnnual: number;
  costOfLivingAnnual: number;
  moneyLeftAnnual: number;
  budgetCoveragePercent: number | null;
  annualReturnPercent: number;
}): string {
  const horizon = args.alreadyRetired
    ? `Already at or past retirement age; nest egg is the amount already saved (no further accumulation years).`
    : `About ${formatYears(args.yearsToRetirement)} of accumulation remain until retirement.`;
  const draw = `Level savings draw over ${formatYears(args.yearsInRetirement)} at ${args.annualReturnPercent}% covers living costs alongside government pension.`;
  if (args.costOfLivingAnnual <= 0) {
    return `${horizon} ${draw} Enter a cost of living to see budget coverage.`;
  }
  if (args.moneyLeftAnnual >= 0) {
    const pct =
      args.budgetCoveragePercent === null
        ? ''
        : ` Budget coverage ≈ ${args.budgetCoveragePercent.toFixed(0)}%.`;
    return `${horizon} Projected retirement income meets or exceeds cost of living under these nominal assumptions.${pct}`;
  }
  return `${horizon} Projected retirement income falls short of cost of living by a nominal gap under these assumptions. Consider higher savings, a later retirement age, lower spending, or a higher assumed return (returns are not guaranteed).`;
}

function formatYears(years: number): string {
  const rounded = Math.round(years * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded} years` : `${rounded.toFixed(1)} years`;
}

export function roundMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): number {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatRetirementMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function toRetirementResult(
  math: RetirementMathResult,
  input: RetirementMathInput,
  currency: SupportedCurrency,
  symbol: string,
  incomeDisplayPeriod: MoneyPeriod
): RetirementResult {
  const money = (annual: number) => {
    const shown = annualToPeriod(annual, incomeDisplayPeriod);
    return `${symbol}${formatRetirementMoney(roundMoneyAmount(shown, currency), currency)}`;
  };
  const totalShown = roundMoneyAmount(math.totalSavingsAtRetirement, currency);

  const budgetCoverageLabel =
    math.budgetCoveragePercent === null
      ? '—'
      : `${math.budgetCoveragePercent.toFixed(1)}%`;

  return {
    sex: input.sex,
    country: input.country,
    currentAge: input.currentAge,
    retirementAge: input.retirementAge,
    lifeExpectancy: input.lifeExpectancy,
    yearsToRetirement: math.yearsToRetirement,
    yearsInRetirement: math.yearsInRetirement,
    annualReturnPercent: input.annualReturnPercent,
    alreadySaved: input.alreadySaved,
    annualSavings: input.annualSavings,
    totalSavingsAtRetirement: math.totalSavingsAtRetirement,
    governmentPensionAnnual: input.governmentPensionAnnual,
    incomeFromSavingsAnnual: math.incomeFromSavingsAnnual,
    totalRetirementIncomeAnnual: math.totalRetirementIncomeAnnual,
    costOfLivingAnnual: input.costOfLivingAnnual,
    budgetCoveragePercent: math.budgetCoveragePercent,
    moneyLeftAnnual: math.moneyLeftAnnual,
    alreadyRetired: math.alreadyRetired,
    insufficientFunds: math.insufficientFunds,
    depletedBeforeLifeExpectancy: math.depletedBeforeLifeExpectancy,
    currency,
    incomeDisplayPeriod,
    formattedTotalSavings: `${symbol}${formatRetirementMoney(totalShown, currency)}`,
    formattedIncomeFromSavings: money(math.incomeFromSavingsAnnual),
    formattedGovernmentPension: money(input.governmentPensionAnnual),
    formattedTotalIncome: money(math.totalRetirementIncomeAnnual),
    formattedCostOfLiving: money(input.costOfLivingAnnual),
    formattedMoneyLeft: money(math.moneyLeftAnnual),
    budgetCoverageLabel,
    summaryMessage: math.summaryMessage,
    assumptionNotes: math.assumptionNotes,
    figuresAreNominal: true,
  };
}
