import type { SupportedCurrency } from '@/tools/shared/currency';

export const GOLD_NISAB_GRAMS = 87.48;
export const SILVER_NISAB_GRAMS = 612.36;
export const ZAKAT_RATE = 0.025;
export const TROY_OUNCE_GRAMS = 31.1034768;

/**
 * Dated reference closes, not a live feed.
 * Gold: 19 Nov 2026 daily reference, $3,714.57 per troy ounce.
 * Silver: Kitco spot bid quoted 19 Nov 2026, $45.32 per troy ounce.
 */
export const METAL_REFERENCE_AS_OF = '2026-11-19';
export const GOLD_REFERENCE_USD_PER_TROY_OUNCE = 3714.57;
export const SILVER_REFERENCE_USD_PER_TROY_OUNCE = 45.32;
export const GOLD_REFERENCE_SOURCE = 'https://thegoldrates.com/gold-price-on/2026-11-19';
export const SILVER_REFERENCE_SOURCE = 'https://www.kitco.com/charts/silver';

export type NisabMethod = 'gold' | 'silver' | 'custom';
export type HawlStatus = 'yes' | 'no' | 'not-sure';
export type MetalPriceMode = 'reference' | 'manual';

export interface ZakatInput {
  currency: SupportedCurrency;
  nisabMethod: NisabMethod;
  customNisab: number;
  goldPriceMode: MetalPriceMode;
  silverPriceMode: MetalPriceMode;
  manualGoldPricePerGram: number;
  manualSilverPricePerGram: number;
  cashInBank: number;
  cashInHand: number;
  savings: number;
  loansReceivable: number;
  cashForTrade: number;
  investments: number;
  goldGrams: number;
  goldPurityPercent: number;
  silverGrams: number;
  silverPurityPercent: number;
  stocks: number;
  tradeInventory: number;
  otherAssets: number;
  loansTaken: number;
  debtsPayable: number;
  paymentsDue: number;
  hawl: HawlStatus;
}

export interface ZakatResult {
  currency: SupportedCurrency;
  nisabMethod: NisabMethod;
  goldPricePerGram: number;
  silverPricePerGram: number;
  goldPriceKind: 'reference' | 'manual';
  silverPriceKind: 'reference' | 'manual';
  goldValue: number;
  silverValue: number;
  totalAssets: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  nisabThreshold: number;
  meetsNisab: boolean;
  zakatRate: number;
  zakatPayable: number;
  hawl: HawlStatus;
  explanation: string;
}

export type ZakatFieldErrors = Partial<
  Record<'assets' | 'liabilities' | 'nisab' | 'prices' | 'form', string>
>;

export function referenceUsdPerGram(metal: 'gold' | 'silver'): number {
  const ounces =
    metal === 'gold' ? GOLD_REFERENCE_USD_PER_TROY_OUNCE : SILVER_REFERENCE_USD_PER_TROY_OUNCE;
  return ounces / TROY_OUNCE_GRAMS;
}

export function createDefaultInput(): ZakatInput {
  return {
    currency: 'USD',
    nisabMethod: 'gold',
    customNisab: 0,
    goldPriceMode: 'reference',
    silverPriceMode: 'reference',
    manualGoldPricePerGram: referenceUsdPerGram('gold'),
    manualSilverPricePerGram: referenceUsdPerGram('silver'),
    cashInBank: 0,
    cashInHand: 0,
    savings: 0,
    loansReceivable: 0,
    cashForTrade: 0,
    investments: 0,
    goldGrams: 0,
    goldPurityPercent: 100,
    silverGrams: 0,
    silverPurityPercent: 100,
    stocks: 0,
    tradeInventory: 0,
    otherAssets: 0,
    loansTaken: 0,
    debtsPayable: 0,
    paymentsDue: 0,
    hawl: 'not-sure',
  };
}

export function hasZakatChanges(input: ZakatInput): boolean {
  const base = createDefaultInput();
  return (Object.keys(base) as (keyof ZakatInput)[]).some((key) => input[key] !== base[key]);
}
