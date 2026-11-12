/**
 * Shared display-currency catalog for client calculators.
 * Selection changes denomination/formatting only — never live FX conversion.
 */

export const DEFAULT_CURRENCY = 'USD' as const;

export const CURRENCY_DENOMINATION_NOTE =
  'Currency selection changes the denomination, not the exchange rate.';

export interface CurrencyDefinition {
  readonly code: string;
  readonly name: string;
  /** Compact badge / input-affix symbol (not duplicated with ISO code in UI). */
  readonly symbol: string;
}

/**
 * Canonical list. Keep alphabetical-by-region-ish stable order for selector UX:
 * majors first (existing 8), then remaining ISO codes A–Z.
 */
const CURRENCY_ROWS = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$' },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP' },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COP' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
] as const satisfies readonly CurrencyDefinition[];

export type SupportedCurrency = (typeof CURRENCY_ROWS)[number]['code'];

export interface CurrencyOption {
  code: SupportedCurrency;
  label: string;
}

export const CURRENCY_DEFINITIONS: readonly CurrencyDefinition[] = CURRENCY_ROWS;

const BY_CODE = Object.fromEntries(
  CURRENCY_ROWS.map((row) => [row.code, row])
) as Record<SupportedCurrency, CurrencyDefinition>;

export const SUPPORTED_CURRENCY_CODES: readonly SupportedCurrency[] = CURRENCY_ROWS.map(
  (row) => row.code
);

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return Object.prototype.hasOwnProperty.call(BY_CODE, value);
}

export function getCurrency(code: SupportedCurrency): CurrencyDefinition {
  return BY_CODE[code];
}

export function getCurrencySymbol(code: SupportedCurrency): string {
  return BY_CODE[code].symbol;
}

/** Compact trigger label: `USD ($)` — symbol omitted when it equals the ISO code. */
export function getCurrencyShortLabel(code: SupportedCurrency): string {
  const { symbol } = BY_CODE[code];
  if (symbol === code) return code;
  return `${code} (${symbol})`;
}

/** Full option label for search lists: `USD ($) — US Dollar`. */
export function getCurrencyOptionLabel(code: SupportedCurrency): string {
  const def = BY_CODE[code];
  if (def.symbol === def.code) return `${def.code} — ${def.name}`;
  return `${def.code} (${def.symbol}) — ${def.name}`;
}

export const CURRENCY_OPTIONS: readonly CurrencyOption[] = CURRENCY_ROWS.map((row) => ({
  code: row.code,
  label: getCurrencyOptionLabel(row.code),
}));

/**
 * ISO-4217 fraction digits from Intl (0 for JPY/KRW/VND/…, 3 for KWD/BHD/OMR, else usually 2).
 * Calculation ledgers stay on existing 2-decimal cent math; this only affects display.
 */
export function getCurrencyFractionDigits(currency: SupportedCurrency): number {
  try {
    const digits = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).resolvedOptions().maximumFractionDigits;
    return typeof digits === 'number' ? digits : 2;
  } catch {
    return 2;
  }
}

export function formatCurrencyValue(
  amount: number,
  currency: SupportedCurrency,
  locale = 'en-US'
): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function filterCurrencies(query: string): readonly CurrencyDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return CURRENCY_DEFINITIONS;
  return CURRENCY_DEFINITIONS.filter((def) => {
    const haystack = `${def.code} ${def.name} ${def.symbol}`.toLowerCase();
    return haystack.includes(q);
  });
}
