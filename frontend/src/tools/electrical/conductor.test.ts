import assert from 'node:assert/strict';
import {
  ALUMINUM,
  COPPER,
  awgAreaMm2,
  awgDiameterMm,
  awgLabel,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  feetToMeters,
  loopResistanceOhm,
  metersToFeet,
  minimumAreaM2,
  resistivityOhmM,
  smallestAwg,
  smallestMetric,
  solidDiameterMm,
  temperatureFactor,
} from './conductor';
import { calculateTwelveVolt } from '../calculators/twelve-volt-wire/calculation';
import { createDefaultTwelveVoltInput } from '../calculators/twelve-volt-wire/types';

function close(actual: number, expected: number, epsilon = 1e-9): void {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} !== ${expected}`);
}

close(COPPER.rho20OhmM, 1.7241e-8);
close(ALUMINUM.rho20OhmM, 2.8264e-8);
close(COPPER.alphaPerC, 0.00393);
close(ALUMINUM.alphaPerC, 0.00403);
close(temperatureFactor(COPPER, 50), 1.1179);
close(temperatureFactor(ALUMINUM, 50), 1.1209);
close(resistivityOhmM(COPPER, 20), 1.7241e-8);
close(resistivityOhmM(ALUMINUM, 20) / resistivityOhmM(COPPER, 20), 2.8264 / 1.7241, 1e-12);
assert.throws(() => resistivityOhmM(COPPER, -300));

const rho50 = 1.7241e-8 * 1.1179;
const areaM2 = minimumAreaM2(rho50, 10, 5, 0.36);
close(areaM2 * 1e6, 5.353809416666667, 1e-9);
close(loopResistanceOhm(rho50, 5, areaM2), 0.036, 1e-12);
close(minimumAreaM2(rho50, 10, 0, 0.36), 0);
close(solidDiameterMm(6), Math.sqrt((4 * 6) / Math.PI), 1e-12);

close(feetToMeters(1), 0.3048);
close(metersToFeet(0.3048), 1);
close(celsiusToFahrenheit(0), 32);
close(fahrenheitToCelsius(32), 0);

assert.equal(smallestMetric(5.353809416666667)?.label, '6 mm²');
assert.equal(smallestAwg(5.353809416666667)?.awg, 9);
assert.equal(awgLabel(-3), '4/0 AWG');
assert.equal(awgLabel(0), '1/0 AWG');
assert.equal(awgLabel(10), '10 AWG');
close(awgDiameterMm(10) / 25.4, 0.1019, 0.00015);
close(awgAreaMm2(10), 5.261, 0.002);
close(awgAreaMm2(16), 1.31, 0.01);
close(awgAreaMm2(14), 2.08, 0.01);
assert.equal(smallestMetric(1000), null);
assert.equal(smallestAwg(1000), null);

const shared = calculateTwelveVolt(createDefaultTwelveVoltInput());
close(shared.minimumAreaMm2, areaM2 * 1e6, 1e-9);
assert.equal(shared.ampacityVerified, false);

console.log('conductor.test ok');
