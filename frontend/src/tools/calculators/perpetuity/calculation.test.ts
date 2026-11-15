import assert from 'node:assert/strict';
import { calculatePerpetuity } from './calculation';
import { createDefaultInput } from './types';
import { validatePerpetuityInput } from './validation';

{
  const noGrowth = calculatePerpetuity({
    dividend: 1_000,
    discountRatePercent: 10,
    growthRatePercent: 0,
    currency: 'PKR',
  });
  assert.ok(noGrowth);
  assert.equal(noGrowth.presentValue, 10_000);
  assert.equal(noGrowth.formattedPresentValue, '10,000.00');
}

{
  const growing = calculatePerpetuity({
    dividend: 1_000,
    discountRatePercent: 10,
    growthRatePercent: 4,
    currency: 'PKR',
  });
  assert.ok(growing);
  assert.equal(growing.presentValue, 16_666.67);
}

{
  const negGrowth = calculatePerpetuity({
    dividend: 1_000,
    discountRatePercent: 10,
    growthRatePercent: -5,
    currency: 'PKR',
  });
  assert.ok(negGrowth);
  assert.equal(negGrowth.presentValue, 6_666.67);
}

{
  assert.equal(
    calculatePerpetuity({
      dividend: 1_000,
      discountRatePercent: 10,
      growthRatePercent: 10,
      currency: 'PKR',
    }),
    null
  );
  assert.equal(
    calculatePerpetuity({
      dividend: -1,
      discountRatePercent: 10,
      growthRatePercent: 0,
      currency: 'PKR',
    }),
    null
  );
}

{
  const defaults = validatePerpetuityInput(createDefaultInput());
  assert.equal(defaults.isValid, true);
  assert.equal(defaults.result?.presentValue, 10_000);
}

{
  const bad = validatePerpetuityInput({
    ...createDefaultInput(),
    discountRatePercent: '4',
    growthRatePercent: '10',
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.discountRatePercent);
}

{
  const blank = validatePerpetuityInput({
    ...createDefaultInput(),
    dividend: '',
  });
  assert.equal(blank.isValid, false);
  assert.equal(blank.result, null);
}

console.log('perpetuity calculation.test ok');
