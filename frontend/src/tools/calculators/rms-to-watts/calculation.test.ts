import assert from 'node:assert/strict';
import {
  averagePowerFromPeakVoltage,
  calculateApparentPower,
  calculateRealPower,
  peakToRms,
  powerFromCurrentResistance,
  powerFromVoltageResistance,
  rmsToPeak,
  shareWaveformText,
  vRmsFromPeak,
} from './calculation';
import { parseNonNegative, parsePositiveResistance, parsePowerFactor } from './validation';

function close(actual: number, expected: number, digits = 5): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

// Sinusoidal power waveform: P_peak = P_RMS × √2
close(rmsToPeak(100), 141.421356, 5);
close(peakToRms(100), 70.710678, 5);
close(rmsToPeak(45), 63.6396103, 5);
close(peakToRms(500), 353.5533906, 5);
close(peakToRms(1000), 707.1067812, 5);

assert.equal(rmsToPeak(0), 0);
assert.equal(peakToRms(0), 0);

close(calculateRealPower(120, 2, 1), 240);
close(calculateRealPower(120, 2, 0.8), 192);
close(calculateApparentPower(120, 2), 240);
close(powerFromVoltageResistance(120, 60), 240);
close(powerFromCurrentResistance(2, 60), 240);
close(vRmsFromPeak(169.7056275), 120, 4);
close(averagePowerFromPeakVoltage(120, 60), 120);

assert.equal(parseNonNegative('').blank, true);
assert.ok(parseNonNegative('-1').error);
assert.ok(parsePositiveResistance('0').error);
assert.ok(parsePowerFactor('1.2').error);
assert.equal(parsePowerFactor('0.8').value, 0.8);

assert.match(shareWaveformText(100, rmsToPeak(100)), /sinusoidal power waveform/);
assert.match(shareWaveformText(100, rmsToPeak(100)), /Not a universal amplifier/);

console.log('rms-to-watts calculation.test.ts: ok');
