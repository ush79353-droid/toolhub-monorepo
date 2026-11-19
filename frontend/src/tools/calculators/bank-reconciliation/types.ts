import type { SupportedCurrency } from '@/tools/shared/currency';

export type AdjustmentDirection = 'add' | 'subtract';

export type ReconciliationStatus = 'reconciled' | 'unreconciled' | 'incomplete';

export interface ReconciliationAdjustment {
  id: string;
  description: string;
  amount: string;
  direction: AdjustmentDirection;
}

export interface BankReconciliationInput {
  cashbookBalance: string;
  bankCharges: string;
  nsfChecks: string;
  automaticPayments: string;
  interestEarned: string;
  cashbookExtra: ReconciliationAdjustment[];
  bankStatementBalance: string;
  depositsInTransit: string;
  outstandingChecks: string;
  bankExtra: ReconciliationAdjustment[];
  cashbookOpen: boolean;
  bankOpen: boolean;
  currency: SupportedCurrency;
}

export interface BankReconciliationResult {
  cashbookBalance: number;
  bankStatementBalance: number;
  totalCashbookAdditions: number;
  totalCashbookDeductions: number;
  totalBankAdditions: number;
  totalBankDeductions: number;
  cashbookAdjustmentCount: number;
  bankAdjustmentCount: number;
  adjustedCashbookBalance: number;
  adjustedBankStatementBalance: number;
  reconciliationDifference: number;
  unreconciledAmount: number;
  isReconciled: boolean;
  status: ReconciliationStatus;
  currency: SupportedCurrency;
}

export type BankReconciliationFieldErrors = Partial<
  Record<
    | 'cashbookBalance'
    | 'bankStatementBalance'
    | 'bankCharges'
    | 'nsfChecks'
    | 'automaticPayments'
    | 'interestEarned'
    | 'depositsInTransit'
    | 'outstandingChecks'
    | 'form',
    string
  >
> &
  Partial<Record<string, string>>;

let adjId = 0;

export function createAdjustment(
  partial?: Partial<ReconciliationAdjustment>,
): ReconciliationAdjustment {
  adjId += 1;
  return {
    id: `adj-${adjId}`,
    description: '',
    amount: '',
    direction: 'add',
    ...partial,
  };
}

export function createDefaultInput(): BankReconciliationInput {
  return {
    cashbookBalance: '',
    bankCharges: '',
    nsfChecks: '',
    automaticPayments: '',
    interestEarned: '',
    cashbookExtra: [createAdjustment()],
    bankStatementBalance: '',
    depositsInTransit: '',
    outstandingChecks: '',
    bankExtra: [createAdjustment()],
    cashbookOpen: true,
    bankOpen: true,
    currency: 'USD',
  };
}

export function createExampleInput(): BankReconciliationInput {
  return {
    cashbookBalance: '10000',
    bankCharges: '50',
    nsfChecks: '200',
    automaticPayments: '150',
    interestEarned: '100',
    cashbookExtra: [
      createAdjustment({
        description: 'Additional bank credit',
        amount: '300',
        direction: 'add',
      }),
      createAdjustment({
        description: 'Accounting correction',
        amount: '100',
        direction: 'subtract',
      }),
    ],
    bankStatementBalance: '8500',
    depositsInTransit: '2000',
    outstandingChecks: '600',
    bankExtra: [
      createAdjustment({
        description: 'Bank credit correction',
        amount: '100',
        direction: 'add',
      }),
      createAdjustment({
        description: 'Bank debit correction',
        amount: '100',
        direction: 'subtract',
      }),
    ],
    cashbookOpen: true,
    bankOpen: true,
    currency: 'USD',
  };
}
