import assert from 'node:assert/strict';
import {
  CURRENCY_DEFINITIONS,
  CURRENCY_OPTIONS,
  DEFAULT_CURRENCY,
  filterCurrencies,
  formatCurrencyValue,
  getCurrencyFractionDigits,
  getCurrencyShortLabel,
  getCurrencySymbol,
  isSupportedCurrency,
  SUPPORTED_CURRENCY_CODES,
} from './currency';

assert.equal(DEFAULT_CURRENCY, 'USD');
assert.ok(SUPPORTED_CURRENCY_CODES.length >= 40);
assert.equal(CURRENCY_DEFINITIONS.length, CURRENCY_OPTIONS.length);
assert.equal(CURRENCY_DEFINITIONS.length, SUPPORTED_CURRENCY_CODES.length);

const uniqueCodes = new Set(SUPPORTED_CURRENCY_CODES);
assert.equal(uniqueCodes.size, SUPPORTED_CURRENCY_CODES.length, 'currency codes must be unique');

for (const required of [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'NZD',
  'CHF',
  'JPY',
  'CNY',
  'HKD',
  'SGD',
  'INR',
  'PKR',
  'BDT',
  'NPR',
  'LKR',
  'AED',
  'SAR',
  'QAR',
  'KWD',
  'BHD',
  'OMR',
  'TRY',
  'MYR',
  'IDR',
  'THB',
  'PHP',
  'VND',
  'KRW',
  'TWD',
  'RUB',
  'BRL',
  'MXN',
  'ARS',
  'CLP',
  'COP',
  'ZAR',
  'EGP',
  'NGN',
  'KES',
  'GHS',
  'MAD',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'CZK',
  'HUF',
  'ILS',
] as const) {
  assert.equal(isSupportedCurrency(required), true, `missing ${required}`);
}

assert.equal(isSupportedCurrency('XYZ'), false);
assert.equal(getCurrencySymbol('USD'), '$');
assert.equal(getCurrencyShortLabel('USD'), 'USD ($)');
assert.equal(getCurrencyShortLabel('CHF'), 'CHF');

assert.equal(getCurrencyFractionDigits('USD'), 2);
assert.equal(getCurrencyFractionDigits('EUR'), 2);
assert.equal(getCurrencyFractionDigits('JPY'), 0);
assert.equal(getCurrencyFractionDigits('KRW'), 0);
assert.equal(getCurrencyFractionDigits('VND'), 0);
assert.equal(getCurrencyFractionDigits('KWD'), 3);
assert.equal(getCurrencyFractionDigits('BHD'), 3);
assert.equal(getCurrencyFractionDigits('OMR'), 3);

const usd = formatCurrencyValue(1234.56, 'USD');
assert.match(usd, /1,234\.56/);
assert.match(usd, /\$/);

const pkr = formatCurrencyValue(1234.56, 'PKR');
assert.equal(getCurrencyFractionDigits('PKR'), 0);
assert.match(pkr, /1,235/);
assert.match(pkr, /PKR/);

const eur = formatCurrencyValue(1234.56, 'EUR');
assert.match(eur, /1,234\.56/);

const aed = formatCurrencyValue(1234.56, 'AED');
assert.match(aed, /1,234\.56/);
assert.match(aed, /AED/);

const jpy = formatCurrencyValue(1234.56, 'JPY');
assert.match(jpy, /1,235/);
assert.doesNotMatch(jpy, /\.56/);

const kwd = formatCurrencyValue(1234.567, 'KWD');
assert.match(kwd, /1,234\.567/);
assert.match(kwd, /KWD/);

const byCode = filterCurrencies('pkr');
assert.equal(byCode.length, 1);
assert.equal(byCode[0]?.code, 'PKR');

const byName = filterCurrencies('dirham');
assert.ok(byName.some((row) => row.code === 'AED'));
assert.ok(byName.some((row) => row.code === 'MAD'));

const empty = filterCurrencies('zzzz-not-a-currency');
assert.equal(empty.length, 0);

const all = filterCurrencies('');
assert.equal(all.length, CURRENCY_DEFINITIONS.length);

console.log(`currency.test.ts ok (${SUPPORTED_CURRENCY_CODES.length} currencies)`);
