export type FilingStatus =
  | 'single'
  | 'married_jointly'
  | 'married_separately'
  | 'head_of_household'
  | 'qualifying_surviving_spouse';

export type UsStateCode =
  | 'AL'
  | 'AK'
  | 'AZ'
  | 'AR'
  | 'CA'
  | 'CO'
  | 'CT'
  | 'DE'
  | 'DC'
  | 'FL'
  | 'GA'
  | 'HI'
  | 'ID'
  | 'IL'
  | 'IN'
  | 'IA'
  | 'KS'
  | 'KY'
  | 'LA'
  | 'ME'
  | 'MD'
  | 'MA'
  | 'MI'
  | 'MN'
  | 'MS'
  | 'MO'
  | 'MT'
  | 'NE'
  | 'NV'
  | 'NH'
  | 'NJ'
  | 'NM'
  | 'NY'
  | 'NC'
  | 'ND'
  | 'OH'
  | 'OK'
  | 'OR'
  | 'PA'
  | 'RI'
  | 'SC'
  | 'SD'
  | 'TN'
  | 'TX'
  | 'UT'
  | 'VT'
  | 'VA'
  | 'WA'
  | 'WV'
  | 'WI'
  | 'WY';

export interface MegaMillionsPayoutInput {
  jackpot: string;
  annuityRatePercent: string;
  filingStatus: FilingStatus;
  state: UsStateCode | '';
  lumpSumPercent: string;
}

export interface PayoutTaxBreakdown {
  grossPayout: number;
  federalTax: number;
  stateTax: number;
  additionalTax: number;
  totalTax: number;
  netPayout: number;
}

export interface AnnuityPaymentRow {
  paymentNumber: number;
  grossPayment: number;
  federalTax: number;
  stateTax: number;
  netPayment: number;
  cumulativeGross: number;
  cumulativeNet: number;
}

export interface MegaMillionsPayoutResult {
  taxYear: number;
  jackpot: number;
  annuityRatePercent: number;
  lumpSumPercent: number;
  filingStatus: FilingStatus;
  state: UsStateCode;
  stateName: string;
  grossLumpSum: number;
  lumpSum: PayoutTaxBreakdown;
  annuityFirstPayment: number;
  annuityLastPayment: number;
  annuity: PayoutTaxBreakdown;
  annuitySchedule: AnnuityPaymentRow[];
  futureTaxAssumptionNote: string;
  summaryText: string;
}

export type MegaMillionsPayoutFieldErrors = {
  jackpot?: string;
  annuityRatePercent?: string;
  filingStatus?: string;
  state?: string;
  lumpSumPercent?: string;
  form?: string;
};

export const FILING_STATUS_OPTIONS: readonly {
  value: FilingStatus;
  label: string;
}[] = [
  { value: 'single', label: 'Single' },
  { value: 'married_jointly', label: 'Married Filing Jointly' },
  { value: 'married_separately', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
  {
    value: 'qualifying_surviving_spouse',
    label: 'Qualifying Surviving Spouse',
  },
] as const;

export function createDefaultInput(): MegaMillionsPayoutInput {
  return {
    jackpot: '201,000,000',
    annuityRatePercent: '5',
    filingStatus: 'single',
    state: 'CA',
    lumpSumPercent: '52',
  };
}

export function createBlankInput(): MegaMillionsPayoutInput {
  return {
    jackpot: '',
    annuityRatePercent: '',
    filingStatus: 'single',
    state: '',
    lumpSumPercent: '',
  };
}
