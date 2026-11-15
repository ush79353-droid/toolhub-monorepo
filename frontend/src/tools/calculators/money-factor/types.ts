export type MoneyFactorSourceField = 'interestRate' | 'moneyFactor';

export interface MoneyFactorInput {
  interestRate: string;
  moneyFactor: string;
  sourceField: MoneyFactorSourceField;
}

export interface MoneyFactorResult {
  interestRatePercent: number;
  moneyFactor: number;
  formattedInterestRate: string;
  formattedMoneyFactor: string;
}

export type MoneyFactorFieldErrors = {
  interestRate?: string;
  moneyFactor?: string;
  form?: string;
};

export function createDefaultInput(): MoneyFactorInput {
  return {
    interestRate: '',
    moneyFactor: '',
    sourceField: 'interestRate',
  };
}
