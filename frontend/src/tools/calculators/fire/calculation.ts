import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  FireInput,
  FireMethod,
  FireProjectionPoint,
  FireResult,
  FireScenario,
  FireStatus,
} from './types';

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function yearsUntilRetirement(
  currentAge: number,
  retirementAge: number,
): number {
  return retirementAge - currentAge;
}

export function retirementDuration(
  lifeExpectancy: number,
  retirementAge: number,
): number {
  return lifeExpectancy - retirementAge;
}

export function inflateExpenses(
  currentAnnualExpenses: number,
  inflationPercent: number,
  years: number,
): number {
  return currentAnnualExpenses * Math.pow(1 + inflationPercent / 100, years);
}

export function calculateFireNumber(
  annualExpensesAtRetirement: number,
  withdrawalRatePercent: number,
): number | null {
  if (!(annualExpensesAtRetirement >= 0)) return null;
  if (!(withdrawalRatePercent > 0)) return null;
  const fire = annualExpensesAtRetirement / (withdrawalRatePercent / 100);
  return Number.isFinite(fire) ? fire : null;
}

/** PV of T end-of-year withdrawals of E growing? For constant E at real rate r. */
export function fireNumberFromDuration(
  annualExpensesAtRetirement: number,
  realReturnPercent: number,
  yearsInRetirement: number,
): number | null {
  if (!(annualExpensesAtRetirement >= 0) || !(yearsInRetirement > 0)) return null;
  const r = realReturnPercent / 100;
  if (Math.abs(r) < 1e-12) {
    return annualExpensesAtRetirement * yearsInRetirement;
  }
  if (r <= -1) return null;
  const factor = (1 - Math.pow(1 + r, -yearsInRetirement)) / r;
  const fire = annualExpensesAtRetirement * factor;
  return Number.isFinite(fire) ? fire : null;
}

export function futureValueLumpSum(
  principal: number,
  annualReturnPercent: number,
  years: number,
): number {
  return principal * Math.pow(1 + annualReturnPercent / 100, years);
}

/**
 * Constant end-of-year contribution C to reach target:
 * target = S0(1+r)^n + C*((1+r)^n−1)/r
 */
export function requiredAnnualContribution(
  target: number,
  currentSavings: number,
  annualReturnPercent: number,
  years: number,
): number | null {
  if (!(years > 0) || !Number.isFinite(target) || !Number.isFinite(currentSavings)) {
    return null;
  }
  const r = annualReturnPercent / 100;
  const grown = futureValueLumpSum(currentSavings, annualReturnPercent, years);
  const need = target - grown;
  if (need <= 0) return 0;
  if (Math.abs(r) < 1e-12) return need / years;
  const denom = (Math.pow(1 + r, years) - 1) / r;
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const c = need / denom;
  return Number.isFinite(c) ? c : null;
}

/** Monthly end-of-month contributions with monthly equivalent rate. */
export function requiredMonthlyContribution(
  target: number,
  currentSavings: number,
  annualReturnPercent: number,
  years: number,
): number | null {
  if (!(years > 0)) return null;
  const r = annualReturnPercent / 100;
  const grown = futureValueLumpSum(currentSavings, annualReturnPercent, years);
  const need = target - grown;
  if (need <= 0) return 0;
  const months = Math.round(years * 12);
  if (!(months > 0)) return null;
  if (Math.abs(r) < 1e-12) return need / months;
  const rm = Math.pow(1 + r, 1 / 12) - 1;
  if (!(rm > -1) || !Number.isFinite(rm)) return null;
  if (Math.abs(rm) < 1e-15) return need / months;
  const denom = (Math.pow(1 + rm, months) - 1) / rm;
  if (!(denom > 0)) return null;
  const m = need / denom;
  return Number.isFinite(m) ? m : null;
}

/**
 * Required first-year savings rate (%) when contributions grow with salary at g.
 * FV of growing annuity: C*((1+r)^n − (1+g)^n)/(r−g) with C = rate/100 * income.
 */
export function requiredSavingsRatePercent(
  target: number,
  currentSavings: number,
  annualReturnPercent: number,
  salaryGrowthPercent: number,
  annualIncome: number,
  years: number,
): number | null {
  if (!(annualIncome > 0) || !(years > 0)) return null;
  const annual = requiredAnnualContribution(
    target,
    currentSavings,
    annualReturnPercent,
    years,
  );
  if (annual === null) return null;
  if (annual === 0) return 0;

  const r = annualReturnPercent / 100;
  const g = salaryGrowthPercent / 100;
  const grown = futureValueLumpSum(currentSavings, annualReturnPercent, years);
  const need = target - grown;
  if (need <= 0) return 0;

  if (Math.abs(r - g) < 1e-12) {
    // FV = C * n * (1+r)^(n-1) approximately when r≈g: C * n * (1+r)^{n-1}
    const factor = years * Math.pow(1 + r, years - 1);
    if (!(factor > 0)) return null;
    const c0 = need / factor;
    return (c0 / annualIncome) * 100;
  }

  const factor =
    (Math.pow(1 + r, years) - Math.pow(1 + g, years)) / (r - g);
  if (!(factor > 0) || !Number.isFinite(factor)) {
    return (annual / annualIncome) * 100;
  }
  const c0 = need / factor;
  const rate = (c0 / annualIncome) * 100;
  return Number.isFinite(rate) ? rate : null;
}

export function resolveFireNumber(input: {
  method: FireMethod;
  annualExpensesAtRetirement: number;
  withdrawalRatePercent: number;
  investmentReturnPercent: number;
  expenseInflationPercent: number;
  retirementYears: number;
}): number | null {
  const {
    method,
    annualExpensesAtRetirement,
    withdrawalRatePercent,
    investmentReturnPercent,
    expenseInflationPercent,
    retirementYears,
  } = input;

  if (method === 'retirement-duration') {
    // Real return ≈ nominal − inflation (Fisher approximation for planning)
    const real =
      ((1 + investmentReturnPercent / 100) /
        (1 + expenseInflationPercent / 100) -
        1) *
      100;
    return fireNumberFromDuration(
      annualExpensesAtRetirement,
      real,
      retirementYears,
    );
  }

  const swr =
    method === 'traditional-fire' ? 4 : withdrawalRatePercent;
  return calculateFireNumber(annualExpensesAtRetirement, swr);
}

function statusFrom(input: {
  requiredRate: number;
  surplus: number;
  fireNumber: number;
  alreadyFunded: boolean;
  currentSavings: number;
}): { status: FireStatus; label: string } {
  if (input.alreadyFunded || input.currentSavings >= input.fireNumber) {
    return {
      status: 'financially-independent',
      label: 'Financially Independent',
    };
  }
  if (input.requiredRate > 100) {
    return {
      status: 'not-achievable',
      label: 'Target Not Achievable Under Current Assumptions',
    };
  }
  if (input.surplus >= 0) {
    return { status: 'on-track', label: 'On Track' };
  }
  const shortfallRatio = Math.abs(input.surplus) / Math.max(1, input.fireNumber);
  if (shortfallRatio <= 0.1) {
    return { status: 'almost-there', label: 'Almost There' };
  }
  return { status: 'below-target', label: 'Below Target' };
}

export function generateProjection(input: {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualContribution: number;
  annualReturnPercent: number;
  fireNumber: number;
  annualExpenses: number;
  expenseInflationPercent: number;
}): FireProjectionPoint[] {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    annualContribution,
    annualReturnPercent,
    fireNumber,
    annualExpenses,
    expenseInflationPercent,
  } = input;
  const years = Math.max(0, Math.ceil(retirementAge - currentAge));
  const r = annualReturnPercent / 100;
  const g = expenseInflationPercent / 100;
  const points: FireProjectionPoint[] = [];
  let portfolio = currentSavings;
  let expenses = annualExpenses;

  for (let y = 0; y <= years; y += 1) {
    points.push({
      age: currentAge + y,
      year: y,
      portfolioValue: portfolio,
      fireTarget: fireNumber,
      annualExpenses: expenses,
      contributions: y === 0 ? 0 : annualContribution,
    });
    if (y === years) break;
    portfolio = portfolio * (1 + r) + annualContribution;
    expenses *= 1 + g;
  }
  return points;
}

export function estimateFiAge(
  projection: FireProjectionPoint[],
  fireNumber: number,
): number | null {
  for (const pt of projection) {
    if (pt.portfolioValue >= fireNumber) return pt.age;
  }
  return null;
}

export function calculateScenarios(base: {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  annualIncome: number;
  annualExpenses: number;
  currentSavings: number;
  expenseInflationPercent: number;
  salaryGrowthPercent: number;
  method: FireMethod;
  safeWithdrawalRatePercent: number;
}): FireScenario[] {
  const rates = [
    { name: 'Conservative', annualReturnPercent: 3 },
    { name: 'Moderate', annualReturnPercent: 5 },
    { name: 'Aggressive', annualReturnPercent: 8 },
  ];

  return rates.map((scenario) => {
    const n = yearsUntilRetirement(base.currentAge, base.retirementAge);
    const t = retirementDuration(base.lifeExpectancy, base.retirementAge);
    const eR = inflateExpenses(
      base.annualExpenses,
      base.expenseInflationPercent,
      n,
    );
    const fire =
      resolveFireNumber({
        method: base.method,
        annualExpensesAtRetirement: eR,
        withdrawalRatePercent: base.safeWithdrawalRatePercent,
        investmentReturnPercent: scenario.annualReturnPercent,
        expenseInflationPercent: base.expenseInflationPercent,
        retirementYears: t,
      }) ?? 0;
    const annual =
      requiredAnnualContribution(
        fire,
        base.currentSavings,
        scenario.annualReturnPercent,
        n,
      ) ?? 0;
    const projected =
      futureValueLumpSum(base.currentSavings, scenario.annualReturnPercent, n) +
      (Math.abs(scenario.annualReturnPercent) < 1e-12
        ? annual * n
        : annual *
          ((Math.pow(1 + scenario.annualReturnPercent / 100, n) - 1) /
            (scenario.annualReturnPercent / 100)));
    const projection = generateProjection({
      currentAge: base.currentAge,
      retirementAge: base.retirementAge,
      currentSavings: base.currentSavings,
      annualContribution: annual,
      annualReturnPercent: scenario.annualReturnPercent,
      fireNumber: fire,
      annualExpenses: base.annualExpenses,
      expenseInflationPercent: base.expenseInflationPercent,
    });
    return {
      name: scenario.name,
      annualReturnPercent: scenario.annualReturnPercent,
      projectedSavings: projected,
      fireNumber: fire,
      requiredAnnualSavings: annual,
      estimatedFiAge: estimateFiAge(projection, fire),
      surplusOrShortfall: projected - fire,
    };
  });
}

export function formatFireMoney(
  amount: number,
  currency: SupportedCurrency,
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(amount));
}

export function formatFirePercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent);
}

export interface FireEngineValues {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  annualIncome: number;
  annualExpenses: number;
  currentSavings: number;
  investmentReturnPercent: number;
  expenseInflationPercent: number;
  salaryGrowthPercent: number;
  safeWithdrawalRatePercent: number;
  method: FireMethod;
  currency: SupportedCurrency;
}

export function calculateFirePlan(values: FireEngineValues): FireResult | null {
  const n = yearsUntilRetirement(values.currentAge, values.retirementAge);
  const t = retirementDuration(values.lifeExpectancy, values.retirementAge);
  if (!(n > 0) || !(t > 0)) return null;

  const eR = inflateExpenses(
    values.annualExpenses,
    values.expenseInflationPercent,
    n,
  );
  const fireNumber = resolveFireNumber({
    method: values.method,
    annualExpensesAtRetirement: eR,
    withdrawalRatePercent: values.safeWithdrawalRatePercent,
    investmentReturnPercent: values.investmentReturnPercent,
    expenseInflationPercent: values.expenseInflationPercent,
    retirementYears: t,
  });
  if (fireNumber === null) return null;

  const fvSavings = futureValueLumpSum(
    values.currentSavings,
    values.investmentReturnPercent,
    n,
  );
  const alreadyFundedByExistingSavings = fvSavings >= fireNumber;

  const requiredAnnual =
    requiredAnnualContribution(
      fireNumber,
      values.currentSavings,
      values.investmentReturnPercent,
      n,
    ) ?? 0;
  const requiredMonthly =
    requiredMonthlyContribution(
      fireNumber,
      values.currentSavings,
      values.investmentReturnPercent,
      n,
    ) ?? 0;
  const requiredRate =
    requiredSavingsRatePercent(
      fireNumber,
      values.currentSavings,
      values.investmentReturnPercent,
      values.salaryGrowthPercent,
      values.annualIncome,
      n,
    ) ?? 0;

  const projected =
    fvSavings +
    (Math.abs(values.investmentReturnPercent) < 1e-12
      ? requiredAnnual * n
      : requiredAnnual *
        ((Math.pow(1 + values.investmentReturnPercent / 100, n) - 1) /
          (values.investmentReturnPercent / 100)));

  // If already funded, projected path with $0 contributions
  const contributionForProjection = alreadyFundedByExistingSavings
    ? 0
    : requiredAnnual;
  const projectedAtRetirement = alreadyFundedByExistingSavings
    ? fvSavings
    : projected;

  const surplus = projectedAtRetirement - fireNumber;
  const { status, label } = statusFrom({
    requiredRate,
    surplus,
    fireNumber,
    alreadyFunded: alreadyFundedByExistingSavings,
    currentSavings: values.currentSavings,
  });

  const projection = generateProjection({
    currentAge: values.currentAge,
    retirementAge: values.retirementAge,
    currentSavings: values.currentSavings,
    annualContribution: contributionForProjection,
    annualReturnPercent: values.investmentReturnPercent,
    fireNumber,
    annualExpenses: values.annualExpenses,
    expenseInflationPercent: values.expenseInflationPercent,
  });
  const fiAge = estimateFiAge(projection, fireNumber);

  const scenarios = calculateScenarios({
    currentAge: values.currentAge,
    retirementAge: values.retirementAge,
    lifeExpectancy: values.lifeExpectancy,
    annualIncome: values.annualIncome,
    annualExpenses: values.annualExpenses,
    currentSavings: values.currentSavings,
    expenseInflationPercent: values.expenseInflationPercent,
    salaryGrowthPercent: values.salaryGrowthPercent,
    method: values.method,
    safeWithdrawalRatePercent: values.safeWithdrawalRatePercent,
  });

  const symbol = getCurrencySymbol(values.currency);
  const money = (v: number) =>
    `${symbol}${formatFireMoney(v, values.currency)}`;

  const summaryText = alreadyFundedByExistingSavings
    ? `Based on these assumptions, your current savings are projected to reach about ${money(fvSavings)} by age ${values.retirementAge}, which meets or exceeds your FIRE number of ${money(fireNumber)}. No additional annual savings are required.`
    : `Based on your current age, expenses, savings, and expected investment return, you need approximately ${money(fireNumber)} to achieve financial independence at age ${values.retirementAge}. That implies about ${money(requiredAnnual)} saved each year (${formatFirePercent(requiredRate)}% of current income).`;

  return {
    yearsUntilRetirement: n,
    retirementDuration: t,
    annualExpenses: values.annualExpenses,
    annualExpensesAtRetirement: eR,
    fireNumber,
    futureValueOfCurrentSavings: fvSavings,
    requiredAnnualSavings: requiredAnnual,
    requiredMonthlySavings: requiredMonthly,
    requiredSavingsRatePercent: requiredRate,
    projectedSavingsAtRetirement: projectedAtRetirement,
    portfolioSurplusOrShortfall: surplus,
    estimatedFiAge: fiAge,
    isFinanciallyIndependent:
      status === 'financially-independent' || alreadyFundedByExistingSavings,
    alreadyFundedByExistingSavings,
    status,
    statusLabel: label,
    method: values.method,
    safeWithdrawalRatePercent:
      values.method === 'traditional-fire' ? 4 : values.safeWithdrawalRatePercent,
    currency: values.currency,
    projection,
    scenarios,
    summaryText,
  };
}

export function shareFireText(result: FireResult, input: FireInput): string {
  const symbol = getCurrencySymbol(result.currency);
  const money = (v: number) => `${symbol}${formatFireMoney(v, result.currency)}`;
  return [
    'FIRE Calculator – Financial Independence, Retire Early',
    `Current age: ${input.currentAge}`,
    `Retirement age: ${input.retirementAge}`,
    `Life expectancy: ${input.lifeExpectancy}`,
    `Income: ${money(parseOptionalNumber(input.annualIncome) ?? 0)}`,
    `Expenses: ${money(result.annualExpenses)}`,
    `Current savings: ${money(parseOptionalNumber(input.currentSavings) ?? 0)}`,
    `Investment return: ${input.investmentReturnPercent}%`,
    `Expense inflation: ${input.expenseInflationPercent}%`,
    `FIRE number: ${money(result.fireNumber)}`,
    `Required annual savings: ${money(result.requiredAnnualSavings)}`,
    `Required monthly savings: ${money(result.requiredMonthlySavings)}`,
    `Required savings rate: ${formatFirePercent(result.requiredSavingsRatePercent)}%`,
    `Estimated FI age: ${result.estimatedFiAge ?? 'n/a'}`,
    `Status: ${result.statusLabel}`,
    result.summaryText,
  ].join('\n');
}

export function isFireInputBlank(input: FireInput): boolean {
  return (
    !input.currentAge.trim() &&
    !input.retirementAge.trim() &&
    !input.annualIncome.trim() &&
    !input.expenses.trim() &&
    !input.currentSavings.trim()
  );
}
