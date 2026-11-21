export const INITIAL_CARD_ROWS = 6;
export const SHOW_MORE_ROWS = 3;

export interface CreditCardRowInput {
  name: string;
  balance: string;
  minimumPayment: string;
  aprPercent: string;
}

export interface CreditCardsPayoffInput {
  monthlyBudget: string;
  cards: CreditCardRowInput[];
}

export interface CardScheduleCell {
  id: number;
  name: string;
  openingBalance: number;
  interest: number;
  payment: number;
  closingBalance: number;
  formattedOpeningBalance: string;
  formattedInterest: string;
  formattedPayment: string;
  formattedClosingBalance: string;
}

export interface ScheduleMonth {
  month: number;
  totalPayment: number;
  totalInterest: number;
  formattedTotalPayment: string;
  formattedTotalInterest: string;
  cards: CardScheduleCell[];
}

export interface CardPayoffSummary {
  id: number;
  name: string;
  aprPercent: number;
  payoffMonth: number;
  order: number;
  formattedApr: string;
}

export interface CreditCardsPayoffResult {
  months: number;
  years: number;
  remainingMonths: number;
  formattedDuration: string;
  totalInterest: number;
  formattedTotalInterest: string;
  totalPaid: number;
  formattedTotalPaid: string;
  totalPrincipal: number;
  formattedTotalPrincipal: string;
  optimalOrder: string[];
  formattedOptimalOrder: string;
  cardPayoffs: CardPayoffSummary[];
  schedule: ScheduleMonth[];
  summary: string;
}

export type CreditCardsPayoffFieldErrors = {
  monthlyBudget?: string;
  cards?: Array<{
    name?: string;
    balance?: string;
    minimumPayment?: string;
    aprPercent?: string;
  }>;
  form?: string;
};

export function createBlankCardRow(): CreditCardRowInput {
  return {
    name: '',
    balance: '',
    minimumPayment: '',
    aprPercent: '',
  };
}

export function createDefaultCardRow(index: number): CreditCardRowInput {
  if (index === 0) {
    return {
      name: 'Card 1',
      balance: '4600',
      minimumPayment: '100',
      aprPercent: '18.99',
    };
  }
  if (index === 1) {
    return {
      name: 'Card 2',
      balance: '3900',
      minimumPayment: '90',
      aprPercent: '19.99',
    };
  }
  if (index === 2) {
    return {
      name: 'Card 3',
      balance: '6000',
      minimumPayment: '120',
      aprPercent: '15.99',
    };
  }
  return createBlankCardRow();
}

export function createDefaultInput(): CreditCardsPayoffInput {
  return {
    monthlyBudget: '500',
    cards: Array.from({ length: INITIAL_CARD_ROWS }, (_, i) =>
      createDefaultCardRow(i)
    ),
  };
}

export function isCardRowBlank(row: CreditCardRowInput): boolean {
  return (
    row.name.trim() === '' &&
    row.balance.trim() === '' &&
    row.minimumPayment.trim() === '' &&
    row.aprPercent.trim() === ''
  );
}
