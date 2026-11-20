import {
  calculateMarriageTax,
  formatMarriageTaxUsd,
  type SpouseAmounts,
} from './calculation';
import type {
  MarriageTaxFieldErrors,
  MarriageTaxInput,
  MarriageTaxResult,
  SpouseInput,
} from './types';

export interface MarriageTaxValidation {
  isValid: boolean;
  errors: MarriageTaxFieldErrors;
  result: MarriageTaxResult | null;
}

function parseMoney(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') return null;
  if (/infinity|nan/i.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function parseCount(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  if (!/^\d+$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function parseSpouse(s: SpouseInput): SpouseAmounts | null {
  const salaryBusiness = parseMoney(s.salaryBusiness);
  const interestDividends = parseMoney(s.interestDividends);
  const rentalPassive = parseMoney(s.rentalPassive);
  const shortTermGain = parseMoney(s.shortTermGain);
  const longTermGain = parseMoney(s.longTermGain);
  const qualifiedDividends = parseMoney(s.qualifiedDividends);
  const retirementSavings = parseMoney(s.retirementSavings);
  const dependents = parseCount(s.dependents);
  const stateCityTaxRatePercent = parseMoney(s.stateCityTaxRatePercent);

  if (
    salaryBusiness === null ||
    interestDividends === null ||
    rentalPassive === null ||
    shortTermGain === null ||
    longTermGain === null ||
    qualifiedDividends === null ||
    retirementSavings === null ||
    dependents === null ||
    stateCityTaxRatePercent === null
  ) {
    return null;
  }

  return {
    salaryBusiness,
    interestDividends,
    rentalPassive,
    shortTermGain,
    longTermGain,
    qualifiedDividends,
    retirementSavings,
    fileStatus: s.fileStatus,
    dependents,
    useStandardDeduction: s.useStandardDeduction === 'yes',
    stateCityTaxRatePercent,
    selfEmployed: s.selfEmployed === 'yes',
  };
}

export function validateMarriageTaxInput(
  input: MarriageTaxInput
): MarriageTaxValidation {
  const errors: MarriageTaxFieldErrors = {};
  const spouse1 = parseSpouse(input.spouse1);
  const spouse2 = parseSpouse(input.spouse2);

  if (!spouse1) errors.spouse1 = 'Check Spouse 1 amounts, dependents, and tax rate.';
  if (!spouse2) errors.spouse2 = 'Check Spouse 2 amounts, dependents, and tax rate.';

  if (!spouse1 || !spouse2) {
    return { isValid: false, errors, result: null };
  }

  if (
    spouse1.salaryBusiness < 0 ||
    spouse2.salaryBusiness < 0 ||
    spouse1.stateCityTaxRatePercent < 0 ||
    spouse2.stateCityTaxRatePercent < 0
  ) {
    errors.form = 'Amounts and tax rates must be zero or greater.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateMarriageTax({ spouse1, spouse2 });
  if (!computed) {
    errors.form = 'This combination does not produce a finite tax comparison.';
    return { isValid: false, errors, result: null };
  }

  const { before, after, difference } = computed;
  const verdict =
    Math.abs(difference) < 0.5 ? 'neutral' : difference > 0 ? 'penalty' : 'bonus';

  const result: MarriageTaxResult = {
    taxYear: 2026,
    beforeMarriage: {
      label: 'Combined tax if filing as before marriage',
      agi: before.agi,
      taxableIncome: before.taxableIncome,
      federalTax: before.federalTax,
      seTax: before.seTax,
      stateTax: before.stateTax,
      totalTax: before.totalTax,
      formattedTotalTax: formatMarriageTaxUsd(before.totalTax),
    },
    afterMarriage: {
      label: 'Tax if married filing jointly',
      agi: after.agi,
      taxableIncome: after.taxableIncome,
      federalTax: after.federalTax,
      seTax: after.seTax,
      stateTax: after.stateTax,
      totalTax: after.totalTax,
      formattedTotalTax: formatMarriageTaxUsd(after.totalTax),
    },
    difference,
    formattedDifference: formatMarriageTaxUsd(Math.abs(difference)),
    verdict,
    assumptionsNote:
      'Educational TY 2026 estimate using IRS Rev. Proc. 2025-32 brackets and OBBBA standard deductions from the Income Tax Calculator parameters. Itemized amounts are not collected ($0 if standard deduction declined). SE tax omits the SE½ AGI deduction. Dependents use simplified CTC only. Not tax advice.',
  };

  return { isValid: true, errors, result };
}
