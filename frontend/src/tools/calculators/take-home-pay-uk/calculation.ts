import {
  calculateClass1Employee,
  calculateClass4,
  formatGbp,
  roundGbp,
} from '../national-insurance/calculation';
import { NI_YEAR_PARAMS } from '../national-insurance/ni-parameters';
import {
  bandsForLocation,
  personalAllowanceForIncome,
  type UkLocation,
  type UkTaxYearId,
} from './tax-parameters';
import type { TakeHomePayUkResult } from './types';

export interface TakeHomePayUkCanonicalInput {
  location: UkLocation;
  taxYear: UkTaxYearId;
  employmentIncome: number;
  selfEmploymentIncome: number;
  rentalIncome: number;
}

export function taxOnTaxableIncome(
  taxableIncome: number,
  location: UkLocation,
  taxYear: UkTaxYearId
): number {
  if (!(taxableIncome > 0)) return 0;
  const bands = bandsForLocation(location, taxYear);
  let remaining = taxableIncome;
  let lower = 0;
  let tax = 0;
  for (const band of bands) {
    const width = band.upTo - lower;
    const slice = Math.min(remaining, width);
    if (slice > 0) tax += slice * band.rate;
    remaining -= slice;
    lower = band.upTo;
    if (remaining <= 0) break;
  }
  return roundGbp(tax);
}

export function calculateTakeHomePayUk(
  input: TakeHomePayUkCanonicalInput
): TakeHomePayUkResult | null {
  const {
    location,
    taxYear,
    employmentIncome,
    selfEmploymentIncome,
    rentalIncome,
  } = input;

  if (
    ![employmentIncome, selfEmploymentIncome, rentalIncome].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (
    employmentIncome < 0 ||
    selfEmploymentIncome < 0 ||
    rentalIncome < 0
  ) {
    return null;
  }

  const niParams = NI_YEAR_PARAMS[taxYear];
  if (!niParams) return null;

  const totalIncome = roundGbp(
    employmentIncome + selfEmploymentIncome + rentalIncome
  );
  const personalAllowance = personalAllowanceForIncome(totalIncome);
  const taxableIncome = Math.max(0, totalIncome - personalAllowance);
  const incomeTax = taxOnTaxableIncome(taxableIncome, location, taxYear);
  const class1Ni = calculateClass1Employee(employmentIncome, niParams);
  const class4Ni = calculateClass4(selfEmploymentIncome, niParams);
  const totalNi = roundGbp(class1Ni + class4Ni);
  const totalDeductions = roundGbp(incomeTax + totalNi);
  const takeHomePay = roundGbp(totalIncome - totalDeductions);

  const locationLabel =
    location === 'northern_ireland'
      ? 'Northern Ireland'
      : location.charAt(0).toUpperCase() + location.slice(1);

  return {
    location,
    taxYear,
    taxYearLabel: niParams.label,
    employmentIncome,
    selfEmploymentIncome,
    rentalIncome,
    totalIncome,
    personalAllowance,
    taxableIncome,
    incomeTax,
    class1Ni,
    class4Ni,
    totalNi,
    totalDeductions,
    takeHomePay,
    formattedTotalIncome: formatGbp(totalIncome),
    formattedIncomeTax: formatGbp(incomeTax),
    formattedTotalNi: formatGbp(totalNi),
    formattedTakeHome: formatGbp(takeHomePay),
    summaryMessage: `For ${niParams.label} in ${locationLabel}, estimated take-home pay is ${formatGbp(takeHomePay)} after ${formatGbp(incomeTax)} income tax and ${formatGbp(totalNi)} National Insurance.`,
    assumptionNotes: [
      'Income Tax on combined employment + self-employment + rental (non-savings) after Personal Allowance taper.',
      'Employee Class 1 (category A) on employment only; Class 4 on self-employment profits; rental has no NI.',
      'No pension contributions, student loan, Marriage Allowance, Blind Person’s Allowance, or dividend/savings rates.',
      'Scottish rates apply only when location is Scotland; England/Wales/NI use rest-of-UK bands.',
      'Fixed GBP — informational estimate, not a tax return.',
    ],
  };
}
