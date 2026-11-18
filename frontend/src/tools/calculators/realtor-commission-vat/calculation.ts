import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatRealtorMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * VAT-exclusive realtor commission on house price only:
 * Net Commission = House Price × Commission Rate / 100
 * VAT Amount = Net Commission × VAT Rate / 100
 * Commission Gross = Net Commission + VAT Amount
 * Owner Receives = House Price − Commission Gross
 *
 * House price must be nonnegative. Commission and VAT rates must be >= 0.
 * Owner proceeds may be zero or negative when fees exceed the price.
 */
export function calculateRealtorCommissionVat(input: {
  housePrice: number;
  commissionPercent: number;
  vatRatePercent: number;
}): {
  netCommission: number;
  vatAmount: number;
  commissionGross: number;
  ownerReceives: number;
} | null {
  const { housePrice, commissionPercent, vatRatePercent } = input;

  if (
    ![housePrice, commissionPercent, vatRatePercent].every(Number.isFinite)
  ) {
    return null;
  }
  if (housePrice < 0 || commissionPercent < 0 || vatRatePercent < 0) {
    return null;
  }

  const netCommission = housePrice * (commissionPercent / 100);
  const vatAmount = netCommission * (vatRatePercent / 100);
  const commissionGross = netCommission + vatAmount;
  const ownerReceives = housePrice - commissionGross;

  if (
    ![netCommission, vatAmount, commissionGross, ownerReceives].every(
      Number.isFinite
    )
  ) {
    return null;
  }

  return { netCommission, vatAmount, commissionGross, ownerReceives };
}
