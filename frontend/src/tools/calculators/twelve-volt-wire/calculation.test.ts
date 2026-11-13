/**
 * Independent checks use the IEC 60228 constants and the two-wire formula
 * written out by hand, not a second call to minimumAreaM2.
 *
 * Copper at 50°C:
 *   1 + 0.00393 × 30 = 1.1179
 *   ρ = 1.7241e-8 × 1.1179 = 1.92737139e-8 Ω·m
 *   A = 2 × ρ × 10 A × 5 m / 0.36 V = 5.353809416666667e-6 m² = 5.353809416666667 mm²
 *   Loop R at that area = 0.36 V / 10 A = 0.036 Ω
 *   Loss = 10² × 0.036 = 3.6 W
 *
 * Aluminum at 50°C:
 *   1 + 0.00403 × 30 = 1.1209
 *   ρ = 2.8264e-8 × 1.1209 = 3.16811176e-8 Ω·m
 *   A = 2 × ρ × 50 / 0.36 = 8.800310444444445 mm²
 *
 * 6 mm² copper at that ρ and 5 m:
 *   R = 2 × 1.92737139e-8 × 5 / 6e-6 = 0.0321228565 Ω
 *   Drop = 0.321228565 V, load = 11.678771435 V, loss = 3.21228565 W
 */
import assert from 'node:assert/strict';
import {
  awgAreaMm2,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  feetToMeters,
  metersToFeet,
} from '../../electrical/conductor';
import { calculateTwelveVolt } from './calculation';
import { createDefaultTwelveVoltInput } from './types';
import { validateTwelveVolt } from './validation';

function close(actual: number, expected: number, epsilon = 1e-9): void {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} !== ${expected}`);
}

const HAND_COPPER_50_MM2 = 5.353809416666667;
const HAND_ALUMINUM_50_MM2 = 8.800310444444445;

const defaults = createDefaultTwelveVoltInput();
assert.equal(defaults.voltage, 12);
assert.equal(defaults.dropPercent, 3);
assert.equal(defaults.material, 'copper');
assert.equal(defaults.current, 10);
assert.equal(defaults.distance, 5);
assert.equal(defaults.distanceUnit, 'm');
assert.equal(defaults.temperature, 50);
assert.equal(defaults.temperatureUnit, 'C');

const result = calculateTwelveVolt(defaults);
close(result.maxDropVolts, 0.36);
close(result.minimumAreaMm2, HAND_COPPER_50_MM2, 1e-9);
close(result.minimumLoopResistanceOhm, 0.036, 1e-12);
close(result.minimumPowerLossWatts, 3.6, 1e-9);
close(result.minimumDiameterMm, Math.sqrt((4 * HAND_COPPER_50_MM2) / Math.PI), 1e-9);
assert.equal(result.metric?.label, '6 mm²');
assert.equal(result.awg?.awg, 9);
assert.equal(result.awg?.label, '9 AWG');
assert.equal(result.ampacityVerified, false);
close(result.metric!.dropVolts, 0.321228565, 1e-8);
close(result.metric!.loadVolts, 11.678771435, 1e-8);
close(result.metric!.powerLossWatts, 3.21228565, 1e-8);
close(result.metric!.loopResistanceOhm, 0.0321228565, 1e-9);
assert.equal(result.metric!.dropExceedsSource, false);
assert.ok(result.metric!.areaMm2 >= result.minimumAreaMm2);
assert.ok(awgAreaMm2(10) < result.minimumAreaMm2);
assert.ok(awgAreaMm2(9) >= result.minimumAreaMm2);

const again = calculateTwelveVolt(createDefaultTwelveVoltInput());
assert.equal(again.minimumAreaMm2, result.minimumAreaMm2);
assert.equal(again.minimumLoopResistanceOhm, result.minimumLoopResistanceOhm);

const aluminum = calculateTwelveVolt({ ...defaults, material: 'aluminum' });
close(aluminum.minimumAreaMm2, HAND_ALUMINUM_50_MM2, 1e-9);
assert.equal(aluminum.metric?.label, '10 mm²');
assert.equal(aluminum.awg?.awg, 7);
assert.ok(aluminum.minimumAreaMm2 > result.minimumAreaMm2);

const at20 = calculateTwelveVolt({ ...defaults, temperature: 20 });
const hand20 = ((2 * 1.7241e-8 * 10 * 5) / 0.36) * 1e6;
close(at20.minimumAreaMm2, hand20, 1e-9);
close(hand20, 4.789166666666667, 1e-12);
assert.equal(at20.awg?.awg, 10);

const customDrop = calculateTwelveVolt({ ...defaults, dropPercent: 10 });
close(customDrop.maxDropVolts, 1.2);
close(customDrop.minimumAreaMm2, HAND_COPPER_50_MM2 * (0.36 / 1.2), 1e-9);

const customVoltage = calculateTwelveVolt({ ...defaults, voltage: 24, dropPercent: 3 });
close(customVoltage.maxDropVolts, 0.72);
close(customVoltage.minimumAreaMm2, HAND_COPPER_50_MM2 / 2, 1e-9);

const zero = calculateTwelveVolt({ ...defaults, distance: 0 });
assert.equal(zero.zeroLength, true);
close(zero.minimumAreaMm2, 0);
close(zero.minimumLoopResistanceOhm, 0);
close(zero.metric!.dropVolts, 0);
close(zero.metric!.loadVolts, 12);

const shortRun = calculateTwelveVolt({ ...defaults, distance: 0.5 });
close(shortRun.minimumAreaMm2, HAND_COPPER_50_MM2 / 10, 1e-9);
const longRun = calculateTwelveVolt({ ...defaults, distance: 100 });
close(longRun.minimumAreaMm2, HAND_COPPER_50_MM2 * 20, 1e-8);
assert.equal(longRun.metric?.label, '120 mm²');

const inFeet = calculateTwelveVolt({ ...defaults, distance: 5 / 0.3048, distanceUnit: 'ft' });
close(inFeet.oneWayMeters, 5, 1e-12);
close(feetToMeters(metersToFeet(5)), 5, 1e-12);
close(inFeet.minimumAreaMm2, result.minimumAreaMm2, 1e-9);

const inF = calculateTwelveVolt({
  ...defaults,
  temperature: celsiusToFahrenheit(50),
  temperatureUnit: 'F',
});
close(inF.tempC, 50, 1e-12);
close(inF.minimumAreaMm2, result.minimumAreaMm2, 1e-9);
close(fahrenheitToCelsius(32), 0);
close(fahrenheitToCelsius(212), 100);
close(celsiusToFahrenheit(50), 122);

const huge = calculateTwelveVolt({ ...defaults, distance: 5000, current: 200 });
assert.equal(huge.metric, null);
assert.equal(huge.awg, null);
assert.equal(huge.ampacityVerified, false);

const overSource = calculateTwelveVolt({ ...defaults, dropPercent: 200, current: 10, distance: 30.5 });
assert.ok(overSource.metric);
assert.equal(overSource.metric!.dropExceedsSource, true);
assert.ok(overSource.metric!.loadVolts < 0);

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
assert.equal(validateTwelveVolt({ ...defaults, voltage: -12 }).isValid, false);
assert.equal(validateTwelveVolt({ ...defaults, current: Number.NaN }).isValid, false);
assert.equal(validateTwelveVolt({ ...defaults, dropPercent: 21 }).isValid, false);
assert.equal(validateTwelveVolt({ ...defaults, dropPercent: 0.1 }).isValid, true);
assert.equal(validateTwelveVolt({ ...defaults, temperature: -60 }).isValid, false);
assert.equal(validateTwelveVolt({ ...defaults, distanceUnit: 'km' } as unknown as typeof defaults).isValid, false);
assert.equal(validateTwelveVolt({ ...defaults, temperatureUnit: 'K' } as unknown as typeof defaults).isValid, false);
assert.equal(validateTwelveVolt({ ...defaults, material: 'iron' } as unknown as typeof defaults).isValid, false);

const reset = createDefaultTwelveVoltInput();
assert.deepEqual(reset, defaults);
assert.deepEqual(calculateTwelveVolt(reset).minimumAreaMm2, result.minimumAreaMm2);

console.log('12 volt wire calculation.test ok');
