import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Net Identifiable Assets = Fair Value of Assets − Fair Value of Liabilities. */
export function calculateNetIdentifiableAssets(
  fairValueOfAssets: number,
  fairValueOfLiabilities: number
): number | null {
  if (
    !Number.isFinite(fairValueOfAssets) ||
    fairValueOfAssets < 0 ||
    !Number.isFinite(fairValueOfLiabilities) ||
    fairValueOfLiabilities < 0
  ) {
    return null;
  }
  const net = fairValueOfAssets - fairValueOfLiabilities;
  return Number.isFinite(net) ? net : null;
}

/**
 * Signed acquisition residual = Purchase Price − Net Identifiable Assets.
 * Returns null when purchase price is invalid (< 0) or net assets is null.
 */
export function calculateAcquisitionResidual(
  purchasePrice: number,
  netIdentifiableAssets: number
): number | null {
  if (
    !Number.isFinite(purchasePrice) ||
    purchasePrice < 0 ||
    !Number.isFinite(netIdentifiableAssets)
  ) {
    return null;
  }
  const residual = purchasePrice - netIdentifiableAssets;
  return Number.isFinite(residual) ? residual : null;
}

/** Simplified recognized goodwill = max(0, residual). */
export function calculateGoodwill(residual: number): number | null {
  if (!Number.isFinite(residual)) return null;
  return Math.max(0, residual);
}

/** Bargain purchase difference = |residual| when residual < 0; else 0. */
export function calculateBargainPurchaseDifference(
  residual: number
): number | null {
  if (!Number.isFinite(residual)) return null;
  return residual < 0 ? Math.abs(residual) : 0;
}

export function interpretGoodwill(
  residual: number,
  goodwill: number,
  bargainPurchaseDifference: number,
  status: string
): string {
  if (status === 'potentialBargainPurchase' || residual < 0) {
    return `Consideration is ${formatGwMoneyPlain(bargainPurchaseDifference)} below identifiable net assets. Treat this as a potential bargain purchase indication only; reassess fair values, consideration, and recognition criteria before recognizing any gain.`;
  }
  if (goodwill === 0) {
    return 'Purchase consideration equals the fair value of identifiable net assets under this simplified model; no acquisition residual (zero goodwill).';
  }
  return `Purchase consideration exceeds identifiable net assets by ${formatGwMoneyPlain(goodwill)}. Under the simplified model this residual is goodwill; often reflecting synergies, assembled workforce, or other unidentifiable benefits. Separately identifiable intangibles should be recognized independently when required.`;
}

export function formatGwMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatGwMoneyPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
