/**
 * HRA Exemption Calculator — House Rent Allowance (India, educational).
 *
 * Exempt = max(0, min(HRA, R − 0.10S, p×S)) under old regime when claimable.
 * New regime → exemption 0. Partial year scales annual figures by eligible months.
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  getCitySalaryPercentage,
  getHRATaxRules,
  isHraExemptClaimable,
  type InputFrequency,
} from './tax-rules';
import type {
  HraBreakdownRow,
  HraInput,
  HraResult,
  LimitingCondition,
} from './types';

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

export function toMonthly(
  amount: number,
  frequency: InputFrequency,
): number {
  return frequency === 'annual' ? amount / 12 : amount;
}

export function toAnnual(
  monthlyAmount: number,
  eligibleMonths: number,
): number {
  return monthlyAmount * eligibleMonths;
}

export function calculateQualifyingSalary(
  basic: number,
  da: number,
  daEligible: boolean,
): number | null {
  if (![basic, da].every(Number.isFinite) || basic < 0 || da < 0) return null;
  return basic + (daEligible ? da : 0);
}

export function calculateRentAboveTenPercent(
  rent: number,
  qualifyingSalary: number,
): number | null {
  if (![rent, qualifyingSalary].every(Number.isFinite)) return null;
  if (rent < 0 || qualifyingSalary < 0) return null;
  return Math.max(0, rent - 0.1 * qualifyingSalary);
}

export function calculateCitySalaryLimit(
  qualifyingSalary: number,
  cityPercent: number,
): number | null {
  if (![qualifyingSalary, cityPercent].every(Number.isFinite)) return null;
  if (qualifyingSalary < 0 || cityPercent < 0) return null;
  return qualifyingSalary * cityPercent;
}

export function calculateHRAExemption(input: {
  actualHRA: number;
  rentAboveTenPercent: number;
  salaryPercentageLimit: number;
  claimable: boolean;
}): { exempt: number; limiting: LimitingCondition } | null {
  const { actualHRA, rentAboveTenPercent, salaryPercentageLimit, claimable } =
    input;
  if (
    ![actualHRA, rentAboveTenPercent, salaryPercentageLimit].every(
      Number.isFinite,
    )
  ) {
    return null;
  }
  if (actualHRA < 0 || rentAboveTenPercent < 0 || salaryPercentageLimit < 0) {
    return null;
  }
  if (!claimable) {
    return { exempt: 0, limiting: 'new-regime' };
  }
  if (actualHRA === 0 || rentAboveTenPercent === 0) {
    return { exempt: 0, limiting: 'zero' };
  }
  const exempt = Math.max(
    0,
    Math.min(actualHRA, rentAboveTenPercent, salaryPercentageLimit),
  );
  let limiting: LimitingCondition = 'zero';
  if (exempt === 0) {
    limiting = 'zero';
  } else if (exempt === rentAboveTenPercent) {
    limiting = 'rent-minus-10pct';
  } else if (exempt === actualHRA) {
    limiting = 'actual-hra';
  } else if (exempt === salaryPercentageLimit) {
    limiting = 'city-salary-limit';
  }
  // Prefer rent-minus when ties with others for clearer UX when rent caps
  if (
    exempt === rentAboveTenPercent &&
    (exempt === actualHRA || exempt === salaryPercentageLimit)
  ) {
    limiting = 'rent-minus-10pct';
  }
  return { exempt, limiting };
}

export function calculateTaxableHRA(
  actualHRA: number,
  exemptHRA: number,
): number | null {
  if (![actualHRA, exemptHRA].every(Number.isFinite)) return null;
  if (actualHRA < 0 || exemptHRA < 0) return null;
  return Math.max(0, actualHRA - exemptHRA);
}

function limitingLabel(c: LimitingCondition): string {
  switch (c) {
    case 'actual-hra':
      return 'Limited by actual HRA received';
    case 'rent-minus-10pct':
      return 'Limited by rent paid minus 10% of qualifying salary';
    case 'city-salary-limit':
      return 'Limited by city salary percentage (40%/50%)';
    case 'new-regime':
      return 'HRA exemption not available under the new tax regime';
    case 'zero':
      return 'No exemption (check rent, HRA, or eligibility)';
    default:
      return 'Exemption unavailable';
  }
}

export function calculateHraFromInput(input: HraInput): HraResult | null {
  const basic = num(input.basicSalary);
  const da = num(input.dearnessAllowance);
  const hra = num(input.hraReceived);
  const rent = num(input.rentPaid);
  if (basic == null || da == null || hra == null || rent == null) return null;

  const cityInfo = getCitySalaryPercentage(input.taxYear, input.city);
  if (!cityInfo) return null;
  const rules = getHRATaxRules(input.taxYear);
  if (!rules) return null;

  let eligibleMonths = 12;
  if (input.enablePartialYear) {
    const m = num(input.eligibleMonths);
    if (m == null || !Number.isInteger(m) || m < 1 || m > 12) return null;
    eligibleMonths = m;
  }

  const { currency, frequency } = input;
  const basicMonthly = toMonthly(basic, frequency);
  const daMonthly = toMonthly(da, frequency);
  const hraMonthly = toMonthly(hra, frequency);
  const rentMonthly = toMonthly(rent, frequency);

  const qualifyingMonthly = calculateQualifyingSalary(
    basicMonthly,
    daMonthly,
    input.daEligibleForRetirementBenefits,
  );
  if (qualifyingMonthly == null) return null;

  const claimable = isHraExemptClaimable(input.taxYear, input.taxRegime);
  const rentAbove = calculateRentAboveTenPercent(rentMonthly, qualifyingMonthly);
  const cityLimit = calculateCitySalaryLimit(
    qualifyingMonthly,
    cityInfo.percent,
  );
  if (rentAbove == null || cityLimit == null) return null;

  const exemption = calculateHRAExemption({
    actualHRA: hraMonthly,
    rentAboveTenPercent: rentAbove,
    salaryPercentageLimit: cityLimit,
    claimable,
  });
  if (!exemption) return null;

  const taxable = calculateTaxableHRA(hraMonthly, exemption.exempt);
  if (taxable == null) return null;

  const tenPct = qualifyingMonthly * 0.1;
  const annualExempt = toAnnual(exemption.exempt, eligibleMonths);
  const annualTaxable = toAnnual(taxable, eligibleMonths);
  const annualHra = toAnnual(hraMonthly, eligibleMonths);
  const annualQual = toAnnual(qualifyingMonthly, eligibleMonths);
  const annualRent = toAnnual(rentMonthly, eligibleMonths);

  const limiting: LimitingCondition = claimable
    ? exemption.limiting
    : 'new-regime';

  const breakdown: HraBreakdownRow[] = [
    { label: 'Actual HRA (monthly)', amount: roundMoney(hraMonthly, currency) },
    {
      label: 'Qualifying salary (monthly)',
      amount: roundMoney(qualifyingMonthly, currency),
    },
    { label: 'Rent paid (monthly)', amount: roundMoney(rentMonthly, currency) },
    {
      label: '10% of qualifying salary',
      amount: roundMoney(tenPct, currency),
    },
    {
      label: 'Rent above 10% of salary',
      amount: roundMoney(rentAbove, currency),
      isLimit: limiting === 'rent-minus-10pct',
    },
    {
      label: `${(cityInfo.percent * 100).toFixed(0)}% of qualifying salary`,
      amount: roundMoney(cityLimit, currency),
      isLimit: limiting === 'city-salary-limit',
    },
    {
      label: 'Exempt HRA (monthly)',
      amount: roundMoney(exemption.exempt, currency),
      isLimit: limiting === 'actual-hra',
    },
    {
      label: 'Taxable HRA (monthly)',
      amount: roundMoney(taxable, currency),
    },
  ];

  const steps = [
    `Qualifying salary S = Basic${input.daEligibleForRetirementBenefits ? ' + eligible DA' : ' (DA excluded)'} = ${money(qualifyingMonthly, currency)} / month`,
    `Actual HRA = ${money(hraMonthly, currency)} / month`,
    `Rent − 10% of S = ${money(rentMonthly, currency)} − ${money(tenPct, currency)} = ${money(rentAbove, currency)}`,
    `City limit (${(cityInfo.percent * 100).toFixed(0)}%) = ${money(cityLimit, currency)}`,
    claimable
      ? `Exempt HRA = min(HRA, rent−10%S, city limit) = ${money(exemption.exempt, currency)} / month`
      : 'Exempt HRA = ₹0 (new tax regime; HRA exemption not claimable)',
    `Taxable HRA = HRA − exempt = ${money(taxable, currency)} / month`,
    `Eligible months = ${eligibleMonths} → annual exempt ${money(annualExempt, currency)}, annual taxable ${money(annualTaxable, currency)}`,
  ];

  const formulaBreakdown = [
    'S = Basic + eligible DA (DA only if it forms part of salary for retirement benefits)',
    'Exempt = max(0, min(HRA, R − 0.10S, p×S)) under old regime',
    'p = 0.50 or 0.40 from tax-year city rules',
    'Taxable HRA = Actual HRA − Exempt HRA',
    'New regime: Exempt = 0',
  ].join('\n');

  const interpretation = claimable
    ? `For ${money(qualifyingMonthly, currency)} monthly qualifying salary in ${input.city} (${(cityInfo.percent * 100).toFixed(0)}% city limit) under the old tax regime (${rules.label}), estimated monthly HRA exemption is ${money(exemption.exempt, currency)} and annual exemption for ${eligibleMonths} month(s) is ${money(annualExempt, currency)}.`
    : `Under the new tax regime for ${rules.label}, HRA exemption is not claimable. The full HRA of ${money(annualHra, currency)} over ${eligibleMonths} month(s) remains non-exempt for this HRA computation.`;

  const explanation =
    'Educational estimate under Indian HRA rules for the selected tax year. City lists and regime availability are versioned assumptions; confirm official Income-tax Rules and your payroll. Does not compute total income tax liability.';

  return {
    currency,
    taxYear: input.taxYear,
    taxYearLabel: rules.label,
    taxRegime: input.taxRegime,
    frequency,
    city: input.city,
    cityRuleNote: rules.cityRuleNote,
    eligibleMonths,
    claimable,
    qualifyingSalaryMonthly: roundMoney(qualifyingMonthly, currency),
    qualifyingSalaryAnnual: roundMoney(annualQual, currency),
    actualHRAMonthly: roundMoney(hraMonthly, currency),
    actualHRAAnnual: roundMoney(annualHra, currency),
    rentPaidMonthly: roundMoney(rentMonthly, currency),
    rentPaidAnnual: roundMoney(annualRent, currency),
    tenPercentOfSalaryMonthly: roundMoney(tenPct, currency),
    rentAboveTenPercentMonthly: roundMoney(rentAbove, currency),
    applicableCityPercentage: cityInfo.percent * 100,
    salaryPercentageLimitMonthly: roundMoney(cityLimit, currency),
    exemptHRAMonthly: roundMoney(exemption.exempt, currency),
    taxableHRAMonthly: roundMoney(taxable, currency),
    annualExemptHRA: roundMoney(annualExempt, currency),
    annualTaxableHRA: roundMoney(annualTaxable, currency),
    monthlyExemptHRA: roundMoney(exemption.exempt, currency),
    monthlyTaxableHRA: roundMoney(taxable, currency),
    limitingCondition: limiting,
    limitingLabel: limitingLabel(limiting),
    breakdown,
    formattedAnnualExempt: money(annualExempt, currency),
    formattedAnnualTaxable: money(annualTaxable, currency),
    steps,
    formulaBreakdown,
    interpretation,
    explanation,
  };
}
