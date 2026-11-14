import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateBusinessBudget } from './calculation';
import {
  PERIODS,
  type BusinessBudgetFieldErrors,
  type BusinessBudgetInput,
  type BusinessBudgetResult,
  type MoneyLine,
  type Period,
} from './types';

function isPeriod(value: string): value is Period {
  return (PERIODS as readonly string[]).includes(value);
}

function validateLine(
  line: MoneyLine,
  key: string,
  errors: BusinessBudgetFieldErrors
): void {
  if (!isPeriod(line.period)) errors[`${key}Period`] = 'Choose a valid period';
  if (!Number.isFinite(line.amount)) {
    errors[key] = 'Enter a valid number';
  } else if (line.amount < 0) {
    errors[key] = 'Cannot be negative';
  }
}

function validateLump(
  value: number,
  key: string,
  errors: BusinessBudgetFieldErrors
): void {
  if (!Number.isFinite(value)) errors[key] = 'Enter a valid number';
  else if (value < 0) errors[key] = 'Cannot be negative';
}

export function validateBusinessBudget(input: BusinessBudgetInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: BusinessBudgetFieldErrors;
  result: BusinessBudgetResult | null;
} {
  const errors: BusinessBudgetFieldErrors = {};

  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';

  const lines: [keyof BusinessBudgetInput, MoneyLine][] = [
    ['income1', input.income1],
    ['income2', input.income2],
    ['income3', input.income3],
    ['income4', input.income4],
    ['interestIncome', input.interestIncome],
    ['dividends', input.dividends],
    ['gifts', input.gifts],
    ['grants', input.grants],
    ['otherIncome', input.otherIncome],
    ['managerSalary', input.managerSalary],
    ['salaries', input.salaries],
    ['commissions', input.commissions],
    ['benefits', input.benefits],
    ['rent', input.rent],
    ['advertisingMarketing', input.advertisingMarketing],
    ['healthInsurance', input.healthInsurance],
    ['businessInsurance', input.businessInsurance],
    ['inventory', input.inventory],
    ['leases', input.leases],
    ['travel', input.travel],
    ['utilities', input.utilities],
    ['officeSupplies', input.officeSupplies],
  ];
  for (const [key, line] of lines) validateLine(line, key, errors);

  validateLump(input.furniture, 'furniture', errors);
  validateLump(input.startingInventory, 'startingInventory', errors);
  validateLump(input.advertisingPromotion, 'advertisingPromotion', errors);
  validateLump(input.operatingCash, 'operatingCash', errors);
  validateLump(input.otherOneTimeCosts, 'otherOneTimeCosts', errors);

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateBusinessBudget(input);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
