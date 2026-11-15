import assert from 'node:assert/strict';
import { calculateParkingRatio, convertAreaString } from './calculation';
import { validateParkingRatioInput } from './validation';

{
  const res = calculateParkingRatio(5_000, 25, 'm2');
  assert.ok(res);
  assert.equal(res.ratioPerThousand, 5);
  assert.equal(res.formattedRatio, '5');
}

{
  assert.equal(calculateParkingRatio(0, 25, 'm2'), null);
  assert.equal(calculateParkingRatio(5000, 25.5, 'm2'), null);
  assert.equal(calculateParkingRatio(5000, -1, 'm2'), null);
}

{
  const converted = convertAreaString('5000', 'm2', 'm2');
  assert.equal(converted, '5000');
  assert.equal(convertAreaString('', 'm2', 'ft2'), '');
}

{
  const v = validateParkingRatioInput({
    rentableArea: '5000',
    parkingSpots: '25',
    areaUnit: 'm2',
  });
  assert.equal(v.isValid, true);
}

{
  const v = validateParkingRatioInput({
    rentableArea: '',
    parkingSpots: '25',
    areaUnit: 'm2',
  });
  assert.equal(v.isValid, false);
  assert.equal(Object.keys(v.errors).length, 0);
}

console.log('parking-ratio calculation.test ok');
