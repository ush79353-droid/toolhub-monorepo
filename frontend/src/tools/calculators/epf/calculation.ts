/**
 * EPF Calculator — Employees' Provident Fund (India, educational model).
 *
 * Contributions:
 *   EPFSalary = Basic + DA
 *   EmployeeEPF = EPFSalary × employeeRate/100 (+ optional VPF)
 *   EmployerTotal = EPFSalary × employerRate/100
 *   EPS (if eligible) = min(EPFSalary, ceiling) × 8.33/100 (capped by employer total)
 *   EmployerEPF = EmployerTotal − EPS
 *
 * Interest convention (projection assumption):
 *   Monthly deposits credited at month-end; interest accrues on end-of-month
 *   EPF balance at annualRate/12; accrued interest credited every 12 months
 *   and at projection end. EPS is never added to the EPF balance.
 *
 * Statutory rates/ceilings change — defaults are educational, not guarantees.
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  DEFAULT_EPS_RATE_PERCENT,
  DEFAULT_EPS_WAGE_CEILING,
  type EpfInput,
  type EpfMonthlySplit,
  type EpfResult,
  type EpfScenarioSnapshot,
  type EpfYearlyProjection,
} from './types';

const MAX_PROJECTION_YEARS = 50;

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function scale(currency: SupportedCurrency): number {
  return 10 ** getCurrencyFractionDigits(currency);
}

function roundMoney(amount: number, currency: SupportedCurrency): number {
  const s = scale(currency);
  return Math.round(amount * s) / s;
}

function money(n: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(roundMoney(n, currency), currency);
}

export function formatPercent(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function calculateEPFSalary(
  basic: number,
  da: number,
): number | null {
  if (![basic, da].every(Number.isFinite) || basic < 0 || da < 0) return null;
  return basic + da;
}

export function calculateEmployeeEPF(
  epfSalary: number,
  employeeRatePercent: number,
): number | null {
  if (
    ![epfSalary, employeeRatePercent].every(Number.isFinite) ||
    epfSalary < 0 ||
    employeeRatePercent < 0
  ) {
    return null;
  }
  return (epfSalary * employeeRatePercent) / 100;
}

export function calculateEmployerContribution(
  epfSalary: number,
  employerRatePercent: number,
): number | null {
  if (
    ![epfSalary, employerRatePercent].every(Number.isFinite) ||
    epfSalary < 0 ||
    employerRatePercent < 0
  ) {
    return null;
  }
  return (epfSalary * employerRatePercent) / 100;
}

export function calculateEPSContribution(input: {
  epfSalary: number;
  eligibleForEPS: boolean;
  epsWageCeiling?: number;
  epsRatePercent?: number;
  employerTotalContribution: number;
}): number | null {
  const {
    epfSalary,
    eligibleForEPS,
    employerTotalContribution,
    epsWageCeiling = DEFAULT_EPS_WAGE_CEILING,
    epsRatePercent = DEFAULT_EPS_RATE_PERCENT,
  } = input;
  if (
    ![epfSalary, employerTotalContribution, epsWageCeiling, epsRatePercent].every(
      Number.isFinite,
    )
  ) {
    return null;
  }
  if (!eligibleForEPS) return 0;
  if (epfSalary < 0 || epsWageCeiling < 0 || epsRatePercent < 0) return null;
  const pensionable = Math.min(epfSalary, epsWageCeiling);
  const raw = (pensionable * epsRatePercent) / 100;
  return Math.min(raw, Math.max(0, employerTotalContribution));
}

export function calculateEmployerEPF(
  employerTotal: number,
  epsContribution: number,
): number | null {
  if (![employerTotal, epsContribution].every(Number.isFinite)) return null;
  if (employerTotal < 0 || epsContribution < 0) return null;
  return Math.max(0, employerTotal - epsContribution);
}

export function calculateMonthlyEPFDeposit(
  employeeEPF: number,
  employerEPF: number,
  vpf = 0,
): number | null {
  if (![employeeEPF, employerEPF, vpf].every(Number.isFinite)) return null;
  if (employeeEPF < 0 || employerEPF < 0 || vpf < 0) return null;
  return employeeEPF + employerEPF + vpf;
}

export function splitMonthlyContributions(input: {
  basic: number;
  da: number;
  employeeRate: number;
  employerRate: number;
  eligibleForEPS: boolean;
  epsWageCeiling: number;
  vpfRate: number;
  currency: SupportedCurrency;
}): EpfMonthlySplit | null {
  const epfSalary = calculateEPFSalary(input.basic, input.da);
  if (epfSalary == null) return null;
  const employee = calculateEmployeeEPF(epfSalary, input.employeeRate);
  const employerTotal = calculateEmployerContribution(
    epfSalary,
    input.employerRate,
  );
  if (employee == null || employerTotal == null) return null;
  const eps = calculateEPSContribution({
    epfSalary,
    eligibleForEPS: input.eligibleForEPS,
    epsWageCeiling: input.epsWageCeiling,
    employerTotalContribution: employerTotal,
  });
  if (eps == null) return null;
  const employerEPF = calculateEmployerEPF(employerTotal, eps);
  if (employerEPF == null) return null;
  const vpf =
    input.vpfRate > 0
      ? calculateEmployeeEPF(epfSalary, input.vpfRate) ?? 0
      : 0;
  const total = calculateMonthlyEPFDeposit(employee, employerEPF, vpf);
  if (total == null) return null;

  const { currency } = input;
  return {
    epfSalary: roundMoney(epfSalary, currency),
    employeeContribution: roundMoney(employee, currency),
    employerTotalContribution: roundMoney(employerTotal, currency),
    epsContribution: roundMoney(eps, currency),
    employerEPFContribution: roundMoney(employerEPF, currency),
    vpfContribution: roundMoney(vpf, currency),
    totalMonthlyEPFDeposit: roundMoney(total, currency),
  };
}

interface NumericEpfParams {
  currency: SupportedCurrency;
  currentAge: number;
  retirementAge: number;
  monthlyBasicSalary: number;
  dearnessAllowance: number;
  annualSalaryGrowthRate: number;
  employeeContributionRate: number;
  employerContributionRate: number;
  annualInterestRate: number;
  existingEPFBalance: number;
  eligibleForEPS: boolean;
  epsWageCeiling: number;
  additionalVPFRate: number;
}

function projectEpf(params: NumericEpfParams): {
  firstMonth: EpfMonthlySplit;
  yearlySchedule: EpfYearlyProjection[];
  totalEmployeeContributions: number;
  totalEmployerEPFContributions: number;
  totalVPFContributions: number;
  totalEPSContributions: number;
  totalInterestEarned: number;
  maturityValue: number;
  yearsToRetirement: number;
} | null {
  const years = params.retirementAge - params.currentAge;
  if (
    !Number.isInteger(params.currentAge) ||
    !Number.isInteger(params.retirementAge) ||
    years <= 0 ||
    years > MAX_PROJECTION_YEARS
  ) {
    return null;
  }
  if (params.annualInterestRate < 0) return null;
  if (params.monthlyBasicSalary < 0 || params.dearnessAllowance < 0) {
    return null;
  }
  if (params.existingEPFBalance < 0) return null;

  const { currency } = params;
  const monthlyRate = params.annualInterestRate / 1200;
  let basic = params.monthlyBasicSalary;
  let da = params.dearnessAllowance;
  let balance = params.existingEPFBalance;
  let accruedInterest = 0;

  let totalEmployee = 0;
  let totalEmployerEPF = 0;
  let totalVPF = 0;
  let totalEPS = 0;
  let totalInterest = 0;

  const yearlySchedule: EpfYearlyProjection[] = [];
  let firstMonth: EpfMonthlySplit | null = null;

  const totalMonths = years * 12;

  for (let month = 1; month <= totalMonths; month++) {
    const split = splitMonthlyContributions({
      basic,
      da,
      employeeRate: params.employeeContributionRate,
      employerRate: params.employerContributionRate,
      eligibleForEPS: params.eligibleForEPS,
      epsWageCeiling: params.epsWageCeiling,
      vpfRate: params.additionalVPFRate,
      currency,
    });
    if (!split) return null;
    if (month === 1) firstMonth = split;

    const yearIndex = Math.ceil(month / 12);
    const isYearStart = month % 12 === 1;
    if (isYearStart) {
      yearlySchedule.push({
        year: yearIndex,
        age: params.currentAge + yearIndex - 1,
        openingBalance: roundMoney(balance, currency),
        employeeContributions: 0,
        employerEPFContributions: 0,
        vpfContributions: 0,
        epsContributions: 0,
        interestEarned: 0,
        closingBalance: 0,
        cumulativeEmployee: 0,
        cumulativeEmployerEPF: 0,
        cumulativeInterest: 0,
      });
    }
    const row = yearlySchedule[yearlySchedule.length - 1]!;

    balance +=
      split.employeeContribution +
      split.employerEPFContribution +
      split.vpfContribution;
    totalEmployee += split.employeeContribution;
    totalEmployerEPF += split.employerEPFContribution;
    totalVPF += split.vpfContribution;
    totalEPS += split.epsContribution;

    row.employeeContributions += split.employeeContribution;
    row.employerEPFContributions += split.employerEPFContribution;
    row.vpfContributions += split.vpfContribution;
    row.epsContributions += split.epsContribution;

    if (monthlyRate > 0) {
      const monthInterest = balance * monthlyRate;
      accruedInterest += monthInterest;
    }

    const isYearEnd = month % 12 === 0;
    const isLast = month === totalMonths;
    if ((isYearEnd || isLast) && accruedInterest !== 0) {
      const credited = roundMoney(accruedInterest, currency);
      balance += credited;
      totalInterest += credited;
      row.interestEarned += credited;
      accruedInterest = 0;
    }

    if (isYearEnd || isLast) {
      row.closingBalance = roundMoney(balance, currency);
      row.employeeContributions = roundMoney(row.employeeContributions, currency);
      row.employerEPFContributions = roundMoney(
        row.employerEPFContributions,
        currency,
      );
      row.vpfContributions = roundMoney(row.vpfContributions, currency);
      row.epsContributions = roundMoney(row.epsContributions, currency);
      row.interestEarned = roundMoney(row.interestEarned, currency);
      row.cumulativeEmployee = roundMoney(totalEmployee, currency);
      row.cumulativeEmployerEPF = roundMoney(totalEmployerEPF, currency);
      row.cumulativeInterest = roundMoney(totalInterest, currency);

      if (isYearEnd && !isLast && params.annualSalaryGrowthRate !== 0) {
        const g = 1 + params.annualSalaryGrowthRate / 100;
        basic = roundMoney(basic * g, currency);
        da = roundMoney(da * g, currency);
      }
    }
  }

  if (!firstMonth) return null;

  return {
    firstMonth,
    yearlySchedule,
    totalEmployeeContributions: roundMoney(totalEmployee, currency),
    totalEmployerEPFContributions: roundMoney(totalEmployerEPF, currency),
    totalVPFContributions: roundMoney(totalVPF, currency),
    totalEPSContributions: roundMoney(totalEPS, currency),
    totalInterestEarned: roundMoney(totalInterest, currency),
    maturityValue: roundMoney(balance, currency),
    yearsToRetirement: years,
  };
}

function parseParams(input: EpfInput): NumericEpfParams | null {
  const currentAge = num(input.currentAge);
  const retirementAge = num(input.retirementAge);
  const monthlyBasicSalary = num(input.monthlyBasicSalary);
  const dearnessAllowance = num(input.dearnessAllowance);
  const annualSalaryGrowthRate = num(input.annualSalaryGrowthRate);
  const employeeContributionRate = num(input.employeeContributionRate);
  const employerContributionRate = num(input.employerContributionRate);
  const annualInterestRate = num(input.annualInterestRate);
  const existingEPFBalance = num(input.existingEPFBalance);
  const epsWageCeiling = num(input.epsWageCeiling);
  if (
    currentAge == null ||
    retirementAge == null ||
    monthlyBasicSalary == null ||
    dearnessAllowance == null ||
    annualSalaryGrowthRate == null ||
    employeeContributionRate == null ||
    employerContributionRate == null ||
    annualInterestRate == null ||
    existingEPFBalance == null ||
    epsWageCeiling == null
  ) {
    return null;
  }

  let additionalVPFRate = 0;
  if (input.enableVPF) {
    const v = num(input.additionalVPFRate);
    if (v == null || v < 0) return null;
    additionalVPFRate = v;
  }

  return {
    currency: input.currency,
    currentAge,
    retirementAge,
    monthlyBasicSalary,
    dearnessAllowance,
    annualSalaryGrowthRate,
    employeeContributionRate,
    employerContributionRate,
    annualInterestRate,
    existingEPFBalance,
    eligibleForEPS: input.eligibleForEPS,
    epsWageCeiling,
    additionalVPFRate,
  };
}

export function calculateEpfFromInput(input: EpfInput): EpfResult | null {
  const params = parseParams(input);
  if (!params) return null;

  const projected = projectEpf(params);
  if (!projected) return null;

  const { currency } = params;
  const {
    firstMonth,
    yearlySchedule,
    totalEmployeeContributions,
    totalEmployerEPFContributions,
    totalVPFContributions,
    totalEPSContributions,
    totalInterestEarned,
    maturityValue,
    yearsToRetirement,
  } = projected;

  const totalProjectedEPFDeposits = roundMoney(
    totalEmployeeContributions +
      totalEmployerEPFContributions +
      totalVPFContributions,
    currency,
  );

  let comparison: EpfResult['comparison'] = null;
  if (input.enableComparison) {
    const g = num(input.compareGrowthRate);
    const r = num(input.compareInterestRate);
    const ret = num(input.compareRetirementAge);
    if (
      g != null &&
      r != null &&
      ret != null &&
      Number.isInteger(ret) &&
      ret > params.currentAge &&
      g >= 0 &&
      r >= 0
    ) {
      const alt = projectEpf({
        ...params,
        annualSalaryGrowthRate: g,
        annualInterestRate: r,
        retirementAge: ret,
      });
      if (alt) {
        const baseSnap: EpfScenarioSnapshot = {
          label: 'Base scenario',
          maturityValue,
          totalInterestEarned,
          totalEmployeeContributions,
          totalEmployerEPFContributions,
          yearsToRetirement,
        };
        const altSnap: EpfScenarioSnapshot = {
          label: 'Alternate scenario',
          maturityValue: alt.maturityValue,
          totalInterestEarned: alt.totalInterestEarned,
          totalEmployeeContributions: alt.totalEmployeeContributions,
          totalEmployerEPFContributions: alt.totalEmployerEPFContributions,
          yearsToRetirement: alt.yearsToRetirement,
        };
        comparison = {
          base: baseSnap,
          alt: altSnap,
          maturityDiff: roundMoney(
            alt.maturityValue - maturityValue,
            currency,
          ),
          interestDiff: roundMoney(
            alt.totalInterestEarned - totalInterestEarned,
            currency,
          ),
        };
      }
    }
  }

  const steps = [
    `EPF salary = Basic + DA = ${money(params.monthlyBasicSalary, currency)} + ${money(params.dearnessAllowance, currency)} = ${money(firstMonth.epfSalary, currency)}`,
    `Employee EPF (${formatPercent(params.employeeContributionRate)}) = ${money(firstMonth.employeeContribution, currency)} / month`,
    `Employer total (${formatPercent(params.employerContributionRate)}) = ${money(firstMonth.employerTotalContribution, currency)} / month`,
    params.eligibleForEPS
      ? `EPS (8.33% of min(EPF salary, ceiling ${money(params.epsWageCeiling, currency)})) = ${money(firstMonth.epsContribution, currency)} / month (not added to EPF)`
      : 'EPS = ₹0 (member marked not EPS-eligible)',
    `Employer EPF = Employer total − EPS = ${money(firstMonth.employerEPFContribution, currency)} / month`,
    params.additionalVPFRate > 0
      ? `VPF (${formatPercent(params.additionalVPFRate)}) = ${money(firstMonth.vpfContribution, currency)} / month`
      : 'VPF = not enabled',
    `First-month EPF deposit = ${money(firstMonth.totalMonthlyEPFDeposit, currency)}`,
    `Horizon = ${yearsToRetirement} years (${params.currentAge} → ${params.retirementAge})`,
    `Salary growth = ${formatPercent(params.annualSalaryGrowthRate)} / year; interest assumption = ${formatPercent(params.annualInterestRate)} / year`,
    `Opening balance = ${money(params.existingEPFBalance, currency)}`,
    `Projected maturity EPF = ${money(maturityValue, currency)} (interest earned ${money(totalInterestEarned, currency)})`,
  ];

  const formulaBreakdown = [
    'EPFSalary = Basic + DA',
    'EmployeeEPF = EPFSalary × employeeRate/100',
    'EmployerTotal = EPFSalary × employerRate/100',
    'EPS = min(EPFSalary, wageCeiling) × 8.33/100 when EPS-eligible (else 0)',
    'EmployerEPF = EmployerTotal − EPS',
    'MonthlyEPFDeposit = EmployeeEPF + EmployerEPF (+ VPF)',
    'Interest: monthly accrual on end-of-month EPF balance at R/12; credited yearly',
    'Maturity = opening + future EPF deposits + credited interest (EPS excluded)',
  ].join('\n');

  const interpretation = `Starting at age ${params.currentAge} with an EPF salary of ${money(firstMonth.epfSalary, currency)}, contributing through age ${params.retirementAge} at an assumed ${formatPercent(params.annualInterestRate)} EPF interest rate and ${formatPercent(params.annualSalaryGrowthRate)} salary growth, the estimated EPF maturity balance is ${money(maturityValue, currency)}.`;

  const explanation =
    'Educational projection for India’s EPF/EPS framework. EPS stays separate from the EPF corpus. Interest rate, wage ceiling, and contribution rules are assumptions and may differ from EPFO announcements, employer policy, and your membership status. Excludes admin charges and tax outcomes.';

  return {
    currency,
    currentAge: params.currentAge,
    retirementAge: params.retirementAge,
    yearsToRetirement,
    monthlyBasicSalary: params.monthlyBasicSalary,
    dearnessAllowance: params.dearnessAllowance,
    epfSalary: firstMonth.epfSalary,
    annualSalaryGrowthRate: params.annualSalaryGrowthRate,
    employeeContributionRate: params.employeeContributionRate,
    employerContributionRate: params.employerContributionRate,
    annualInterestRate: params.annualInterestRate,
    existingEPFBalance: params.existingEPFBalance,
    eligibleForEPS: params.eligibleForEPS,
    epsWageCeiling: params.epsWageCeiling,
    additionalVPFRate: params.additionalVPFRate,
    firstMonth,
    totalEmployeeContributions,
    totalEmployerEPFContributions,
    totalVPFContributions,
    totalEPSContributions,
    totalProjectedEPFDeposits,
    totalInterestEarned,
    maturityValue,
    yearlySchedule,
    comparison,
    formattedMaturity: money(maturityValue, currency),
    formattedInterest: money(totalInterestEarned, currency),
    formattedMonthlyEPF: money(firstMonth.totalMonthlyEPFDeposit, currency),
    steps,
    formulaBreakdown,
    interpretation,
    explanation,
  };
}

export function buildEpfScheduleCsv(
  schedule: EpfYearlyProjection[],
  currency: SupportedCurrency,
): string {
  const digits = getCurrencyFractionDigits(currency);
  const header =
    'Year,Age,OpeningBalance,EmployeeDeposits,EmployerEPF,VPF,EPS,Interest,ClosingBalance';
  const lines = schedule.map((row) =>
    [
      row.year,
      row.age,
      row.openingBalance.toFixed(digits),
      row.employeeContributions.toFixed(digits),
      row.employerEPFContributions.toFixed(digits),
      row.vpfContributions.toFixed(digits),
      row.epsContributions.toFixed(digits),
      row.interestEarned.toFixed(digits),
      row.closingBalance.toFixed(digits),
    ].join(','),
  );
  return [header, ...lines].join('\n');
}
