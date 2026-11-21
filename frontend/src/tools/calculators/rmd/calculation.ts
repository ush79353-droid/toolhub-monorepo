import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { uniformLifetimeFactor } from './uniform-lifetime-table';

/**
 * Required Minimum Distribution (owner lifetime, Uniform Lifetime Table):
 *   RMD = Account Balance (Dec 31 prior year) / Life Expectancy Factor
 *
 * Factor from IRS Uniform Lifetime Table (2022+) when the spouse is not both
 * sole beneficiary and more than 10 years younger. Joint-life Table II is not
 * computed here without spouse age (not collected on the screenshot).
 */
export function calculateRmd(input: {
  age: number;
  accountBalance: number;
  spouseYoungerSoleBeneficiary: boolean;
}): {
  lifeExpectancyFactor: number | null;
  rmd: number | null;
  jointLifeUnavailable: boolean;
} | null {
  const { age, accountBalance, spouseYoungerSoleBeneficiary } = input;
  if (!Number.isInteger(age) || age < 72 || age > 120) return null;
  if (!Number.isFinite(accountBalance) || accountBalance < 0) return null;

  if (spouseYoungerSoleBeneficiary) {
    return {
      lifeExpectancyFactor: null,
      rmd: null,
      jointLifeUnavailable: true,
    };
  }

  const factor = uniformLifetimeFactor(age);
  if (factor === null || !(factor > 0)) return null;

  const rmd = accountBalance / factor;
  if (!Number.isFinite(rmd)) return null;

  return {
    lifeExpectancyFactor: factor,
    rmd,
    jointLifeUnavailable: false,
  };
}

export function formatRmdMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatLifeFactor(factor: number): string {
  return factor.toFixed(1);
}
