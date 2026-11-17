/** India TDS interest / late-fee calculator modes (Omni + IT Act). */
export type TdsInterestMode =
  | 'late_deduction'
  | 'late_payment'
  | 'late_filing';

export type TdsQuarter = 1 | 2 | 3 | 4;

export const TDS_MODE_OPTIONS: readonly {
  value: TdsInterestMode;
  label: string;
}[] = [
  { value: 'late_deduction', label: 'Interest on late deduction' },
  { value: 'late_payment', label: 'Interest on late payment' },
  { value: 'late_filing', label: 'Interest on late filing' },
] as const;

export const TDS_QUARTER_OPTIONS: readonly {
  value: TdsQuarter;
  label: string;
}[] = [
  { value: 1, label: '1st quarter' },
  { value: 2, label: '2nd quarter' },
  { value: 3, label: '3rd quarter' },
  { value: 4, label: '4th quarter' },
] as const;

export interface TdsInterestInput {
  mode: TdsInterestMode;
  /** TDS / tax amount in INR. */
  taxAmount: string;
  /** Late deduction: date tax was deductible (transaction / credit). */
  transactionDate: string;
  /** Late deduction: actual deduction date. Late payment: deduction date. */
  deductionDate: string;
  /** Late payment: actual deposit / payment date. */
  paymentDate: string;
  /** Late filing: quarter of the TDS statement (FY April start). */
  quarter: TdsQuarter;
  /** Late filing: financial-year start calendar year (e.g. 2027 → FY 2027-28). */
  filingYear: string;
  /** Late filing: actual / intended return filing date (YYYY-MM-DD). */
  filingDate: string;
}

export type TdsInterestResultKind =
  | 'late_deduction'
  | 'late_payment'
  | 'late_filing_fee'
  | 'within_deadline';

export interface TdsInterestResult {
  kind: TdsInterestResultKind;
  taxAmount: number;
  /** Interest or 234E fee in INR (0 when within deadline). */
  amount: number;
  formattedAmount: string;
  /** Inclusive calendar months charged (201(1A)). */
  months?: number;
  /** Days of delay for 234E. */
  days?: number;
  /** Deposit due date (late payment) or return due date (late filing). */
  dueDate?: string;
  formattedDueDate?: string;
  /** Human-readable result line for UI / share. */
  message: string;
}

export type TdsInterestFieldErrors = {
  taxAmount?: string;
  transactionDate?: string;
  deductionDate?: string;
  paymentDate?: string;
  filingYear?: string;
  filingDate?: string;
  form?: string;
};

/** Screenshot defaults: late filing, ₹10,000, Q1 / 2027, filing 2026-11-17. */
export function createDefaultInput(): TdsInterestInput {
  return {
    mode: 'late_filing',
    taxAmount: '10000',
    transactionDate: '',
    deductionDate: '',
    paymentDate: '',
    quarter: 1,
    filingYear: '2027',
    filingDate: '2026-11-17',
  };
}
