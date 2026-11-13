import assert from 'node:assert/strict';
import {
  ALUMINUM,
  COPPER,
  awgAreaMm2,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  minimumAreaM2,
  resistivityOhmM,
  smallestAwg,
  smallestMetric,
  solidDiameterMm,
  temperatureFactor,
} from './conductor';
import { calculateTwelveVolt } from '../calculators/twelve-volt-wire/calculation';
import { createDefaultTwelveVoltInput } from '../calculators/twelve-volt-wire/types';
import { validateTwelveVolt } from '../calculators/twelve-volt-wire/validation';

function close(actual: number, expected: number, epsilon = 1e-9): void {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} !== ${expected}`);
}

close(COPPER.rho20OhmM, 1.7241e-8);
close(ALUMINUM.rho20OhmM, 2.8264e-8);
close(temperatureFactor(COPPER, 50), 1.1179);
close(resistivityOhmM(COPPER, 20), 1.7241e-8);
close(resistivityOhmM(ALUMINUM, 20) / resistivityOhmM(COPPER, 20), 2.8264 / 1.7241, 1e-12);

const rho50 = 1.7241e-8 * 1.1179;
const areaM2 = minimumAreaM2(rho50, 10, 5, 0.36);
close(areaM2 * 1e6, 5.353809416666667, 1e-9);
close(solidDiameterMm(6), Math.sqrt((4 * 6) / Math.PI), 1e-12);

const defaults = createDefaultTwelveVoltInput();
assert.equal(defaults.voltage, 12);
assert.equal(defaults.dropPercent, 3);
assert.equal(defaults.material, 'copper');
assert.equal(defaults.current, 10);
assert.equal(defaults.distance, 5);
const result = calculateTwelveVolt(defaults);
close(result.maxDropVolts, 0.36);
close(result.minimumAreaMm2, 5.353809416666667, 1e-9);
assert.equal(result.metric?.label, '6 mm²');
assert.ok(awgAreaMm2(10) < result.minimumAreaMm2);
assert.ok(awgAreaMm2(9) >= result.minimumAreaMm2);
assert.equal(result.awg?.awg, 9);
assert.equal(result.ampacityVerified, false);
close(result.metric!.dropVolts, 0.321228565, 1e-8);
close(result.metric!.loadVolts, 11.678771435, 1e-8);
close(result.metric!.powerLossWatts, 3.21228565, 1e-8);
assert.equal(result.metric!.dropExceedsSource, false);

const again = calculateTwelveVolt(createDefaultTwelveVoltInput());
assert.equal(again.minimumAreaMm2, result.minimumAreaMm2);

const aluminum = calculateTwelveVolt({ ...defaults, material: 'aluminum' });
close(aluminum.minimumAreaMm2, 8.800310444444445, 1e-9);
assert.equal(aluminum.metric?.label, '10 mm²');
assert.equal(aluminum.awg?.awg, 7);

const at20 = calculateTwelveVolt({ ...defaults, temperature: 20 });
close(at20.minimumAreaMm2, (2 * 1.7241e-8 * 10 * 5) / 0.36 * 1e6, 1e-9);
assert.equal(at20.awg?.awg, 10);

const customDrop = calculateTwelveVolt({ ...defaults, dropPercent: 10 });
close(customDrop.maxDropVolts, 1.2);
close(customDrop.minimumAreaMm2, result.minimumAreaMm2 * (0.36 / 1.2), 1e-9);

const zero = calculateTwelveVolt({ ...defaults, distance: 0 });
assert.equal(zero.zeroLength, true);
close(zero.minimumAreaMm2, 0);
close(zero.metric!.dropVolts, 0);

const shortRun = calculateTwelveVolt({ ...defaults, distance: 0.5 });
close(shortRun.minimumAreaMm2, result.minimumAreaMm2 / 10, 1e-9);
const longRun = calculateTwelveVolt({ ...defaults, distance: 100 });
close(longRun.minimumAreaMm2, result.minimumAreaMm2 * 20, 1e-8);
assert.equal(longRun.metric?.label, '120 mm²');

const inFeet = calculateTwelveVolt({ ...defaults, distance: 5 / 0.3048, distanceUnit: 'ft' });
close(inFeet.oneWayMeters, 5, 1e-12);
close(inFeet.minimumAreaMm2, result.minimumAreaMm2, 1e-9);

const inF = calculateTwelveVolt({ ...defaults, temperature: celsiusToFahrenheit(50), temperatureUnit: 'F' });
close(inF.tempC, 50, 1e-12);
close(fahrenheitToCelsius(32), 0);
close(fahrenheitToCelsius(212), 100);

assert.equal(smallestMetric(5.353809416666667)?.label, '6 mm²');
assert.equal(smallestAwg(5.353809416666667)?.awg, 9);
close(awgAreaMm2(10), 5.261154954510373, 1e-9);
assert.equal(smallestMetric(1000), null);
assert.equal(smallestAwg(1000), null);

const huge = calculateTwelveVolt({ ...defaults, distance: 5000, current: 200 });
assert.equal(huge.metric, null);
assert.equal(huge.awg, null);

const bad = validateTwelveVolt({
  ...defaults,
  voltage: Number.NaN,
  current: -1,
  distance: -2,
  dropPercent: 0,
  temperature: 1000,
});
assert.equal(bad.isValid, false);
assert.ok(bad.errors.voltage && bad.errors.current && bad.errors.distance && bad.errors.dropPercent && bad.errors.temperature);
assert.equal(validateTwelveVolt({ ...defaults, voltage: Number.POSITIVE_INFINITY }).isValid, false);
assert.equal(validateTwelveVolt({ ...defaults, material: 'iron' } as unknown as typeof defaults).isValid, false);

const reset = createDefaultTwelveVoltInput();
assert.deepEqual(reset, defaults);

console.log('12 volt wire conductor.test ok');
