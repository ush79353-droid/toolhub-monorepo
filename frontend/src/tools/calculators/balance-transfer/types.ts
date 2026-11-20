import type { SupportedCurrency } from '@/tools/shared/currency';

export type BalanceTransferMode = 'promotional' | 'long-term';

export type TransferFeeType = 'percentage' | 'fixed';

export type FeeTreatment = 'financed' | 'upfront';

export type PaymentStrategy = 'fixed' | 'pay-during-promo';

export type BalanceTransferStatus =
  | 'valid'
  | 'partial'
  | 'incomplete'
  | 'invalid'
  | 'neverPaysOff';

export interface BalanceTransferInput {
  mode: BalanceTransferMode;
  paymentStrategy: PaymentStrategy;
  currentBalance: string;
  oldApr: string;
  monthlyPayment: string;
  transferAmount: string;
  transferFee: string;
  transferFeeType: TransferFeeType;
  promotionalApr: string;
  promotionalMonths: string;
  regularApr: string;
  feeTreatment: FeeTreatment;
  currency: SupportedCurrency;
}

export interface BalanceTransferResult {
  transferFeeAmount: number | null;
  newStartingBalance: number | null;
  upfrontFee: number | null;

  oldCardInterest: number | null;
  oldCardTotalCost: number | null;
  oldCardPayoffMonths: number | null;
  oldCardNeverPaysOff: boolean;

  newCardInterest: number | null;
  newCardTotalCost: number | null;
  newCardPayoffMonths: number | null;
  newCardNeverPaysOff: boolean;

  remainingOnOldCard: number | null;
  remainingBalanceAfterPromotion: number | null;
  promotionalInterest: number | null;
  postPromotionalInterest: number | null;

  requiredPromoPayment: number | null;
  effectiveMonthlyPayment: number | null;

  totalSavings: number | null;
  breakEvenMonth: number | null;

  status: BalanceTransferStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;

  formattedTransferFee: string | null;
  formattedNewStartingBalance: string | null;
  formattedOldInterest: string | null;
  formattedOldTotalCost: string | null;
  formattedNewInterest: string | null;
  formattedNewTotalCost: string | null;
  formattedRemainingAfterPromo: string | null;
  formattedSavings: string | null;
  formattedRequiredPromoPayment: string | null;
  formattedEffectivePayment: string | null;
}

export type BalanceTransferFieldErrors = {
  currentBalance?: string;
  oldApr?: string;
  monthlyPayment?: string;
  transferAmount?: string;
  transferFee?: string;
  promotionalApr?: string;
  promotionalMonths?: string;
  regularApr?: string;
  form?: string;
};

export function createDefaultInput(): BalanceTransferInput {
  return {
    mode: 'promotional',
    paymentStrategy: 'fixed',
    currentBalance: '',
    oldApr: '',
    monthlyPayment: '',
    transferAmount: '',
    transferFee: '',
    transferFeeType: 'percentage',
    promotionalApr: '0',
    promotionalMonths: '',
    regularApr: '',
    feeTreatment: 'financed',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): BalanceTransferInput {
  return {
    ...createDefaultInput(),
    currency,
  };
}
