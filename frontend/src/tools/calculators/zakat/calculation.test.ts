import assert from 'node:assert/strict';
import { calculateZakat, metalHoldingValue, nisabThreshold, resolveMetalPrice, shareZakatText } from './calculation';
import {
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  ZAKAT_RATE,
  createDefaultInput,
  hasZakatChanges,
  referenceUsdPerGram,
  type ZakatInput,
} from './types';
import { validateZakatInput } from './validation';
import { ZAKAT_FAQS, ZAKAT_TOC_ITEMS } from './content';

const rates = { USD: 1, PKR: 280, GBP: 0.78, EUR: 0.92, AED: 3.6725, SAR: 3.75 };

function run(patch: Partial<ZakatInput>, rateMap: Record<string, number> = { USD: 1 }) {
  const input = { ...createDefaultInput(), ...patch };
  const validation = validateZakatInput(input, rateMap);
  assert.equal(validation.isValid, true, JSON.stringify(validation.errors));
  assert.ok(validation.result);
  return validation.result;
}

assert.equal(createDefaultInput().nisabMethod, 'gold');
assert.equal(createDefaultInput().hawl, 'not-sure');
assert.equal(createDefaultInput().cashInBank, 0);
assert.equal(hasZakatChanges(createDefaultInput()), false);
assert.equal(hasZakatChanges({ ...createDefaultInput(), cashInHand: 1 }), true);

assert.equal(nisabThreshold('gold', 100, 1, 0), GOLD_NISAB_GRAMS * 100);
assert.equal(nisabThreshold('silver', 1, 2, 0), SILVER_NISAB_GRAMS * 2);
assert.equal(nisabThreshold('custom', 1, 1, 150000), 150000);

assert.equal(metalHoldingValue(1000, 100, 100), 100000);
assert.equal(metalHoldingValue(200, 100, 100), 20000);
assert.equal(metalHoldingValue(10, 91.6, 100), 916);

const goldRef = referenceUsdPerGram('gold');
const silverRef = referenceUsdPerGram('silver');
assert.ok(Math.abs(goldRef - 3714.57 / 31.1034768) < 1e-9);
assert.ok(Math.abs(silverRef - 45.32 / 31.1034768) < 1e-9);

const goldNisab = run({});
assert.equal(goldNisab.nisabMethod, 'gold');
assert.equal(goldNisab.goldPriceKind, 'reference');
assert.ok(Math.abs(goldNisab.nisabThreshold - GOLD_NISAB_GRAMS * goldRef) < 1e-6);
assert.equal(goldNisab.meetsNisab, false);
assert.equal(goldNisab.zakatPayable, 0);

const silverNisab = run({ nisabMethod: 'silver' });
assert.ok(Math.abs(silverNisab.nisabThreshold - SILVER_NISAB_GRAMS * silverRef) < 1e-6);

const custom = run({
  nisabMethod: 'custom',
  customNisab: 150000,
  cashInBank: 200000,
  cashInHand: 50000,
  investments: 80000,
  stocks: 0,
  tradeInventory: 50000,
  goldGrams: 1000,
  goldPurityPercent: 100,
  goldPriceMode: 'manual',
  manualGoldPricePerGram: 100,
  silverGrams: 200,
  silverPurityPercent: 100,
  silverPriceMode: 'manual',
  manualSilverPricePerGram: 100,
  loansTaken: 100000,
});
assert.equal(custom.goldValue, 100000);
assert.equal(custom.silverValue, 20000);
assert.equal(custom.totalAssets, 500000);
assert.equal(custom.totalLiabilities, 100000);
assert.equal(custom.netZakatableWealth, 400000);
assert.equal(custom.meetsNisab, true);
assert.equal(custom.zakatRate, ZAKAT_RATE);
assert.equal(custom.zakatPayable, 10000);

const below = run({
  nisabMethod: 'custom',
  customNisab: 150000,
  cashInBank: 1000,
});
assert.equal(below.meetsNisab, false);
assert.equal(below.zakatPayable, 0);
assert.match(below.explanation, /have not met the selected Nisab/);

const zero = run({ nisabMethod: 'custom', customNisab: 150000 });
assert.equal(zero.totalAssets, 0);
assert.equal(zero.zakatPayable, 0);

const clamped = run({
  nisabMethod: 'custom',
  customNisab: 1,
  cashInBank: 50,
  loansTaken: 80,
});
assert.equal(clamped.netZakatableWealth, 0);
assert.equal(clamped.zakatPayable, 0);

const atNisab = run({ nisabMethod: 'custom', customNisab: 200000, savings: 200000 });
assert.equal(atNisab.meetsNisab, true);
assert.equal(atNisab.zakatPayable, 5000);

const hawlNo = run({
  nisabMethod: 'custom',
  customNisab: 100,
  savings: 200000,
  hawl: 'no',
});
assert.equal(hawlNo.zakatPayable, 5000);
assert.match(hawlNo.explanation, /not complete/);

const negative = validateZakatInput({ ...createDefaultInput(), cashInBank: -1 }, { USD: 1 });
assert.equal(negative.isValid, false);
assert.equal(negative.result, null);

const badPurity = validateZakatInput({ ...createDefaultInput(), goldPurityPercent: 120 }, { USD: 1 });
assert.equal(badPurity.isValid, false);

const pkr = run({ currency: 'PKR' }, rates);
assert.ok(Math.abs(pkr.goldPricePerGram - goldRef * 280) < 1e-6);
assert.equal(pkr.goldPriceKind, 'reference');
assert.ok(Math.abs(pkr.nisabThreshold - GOLD_NISAB_GRAMS * goldRef * 280) < 1e-4);

for (const code of ['GBP', 'EUR', 'AED', 'SAR'] as const) {
  const converted = resolveMetalPrice({
    metal: 'gold',
    currency: code,
    mode: 'reference',
    manualPricePerGram: 0,
    rates,
  });
  assert.equal(converted.ok, true);
  if (converted.ok) {
    assert.ok(Math.abs(converted.pricePerGram - goldRef * rates[code]) < 1e-6);
  }
}

const missing = validateZakatInput({ ...createDefaultInput(), currency: 'PKR' }, { USD: 1 });
assert.equal(missing.isValid, false);
assert.match(missing.errors.prices ?? '', /could not be converted/);
assert.equal(missing.result, null);

const manualFallback = run(
  {
    currency: 'PKR',
    goldPriceMode: 'manual',
    manualGoldPricePerGram: 30000,
    silverPriceMode: 'manual',
    manualSilverPricePerGram: 400,
  },
  {},
);
assert.equal(manualFallback.goldPriceKind, 'manual');
assert.equal(manualFallback.nisabThreshold, GOLD_NISAB_GRAMS * 30000);

const cash = run({
  nisabMethod: 'custom',
  customNisab: 1,
  cashInBank: 10,
  cashInHand: 20,
  savings: 30,
  loansReceivable: 40,
  cashForTrade: 50,
  investments: 60,
});
assert.equal(cash.totalAssets, 210);
assert.equal(cash.zakatPayable, 210 * 0.025);

const share = shareZakatText(custom);
assert.match(share, /Custom/);
assert.match(share, /2\.5%/);
assert.match(share, /USD/);
assert.match(share, /10,000/);
assert.match(share, /2026-11-19/);

assert.equal(ZAKAT_TOC_ITEMS.length, 7);
assert.equal(ZAKAT_FAQS.length, 7);
assert.ok(ZAKAT_TOC_ITEMS.some((item) => item.id === 'zakat-calculation-example'));

console.log('zakat calculation.test.ts: all asserts passed');
