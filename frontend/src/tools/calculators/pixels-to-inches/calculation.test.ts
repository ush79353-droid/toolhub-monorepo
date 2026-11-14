import assert from 'node:assert/strict';
import {
  calculatePixelsToInches,
  formatMeasure,
  inchesToPixels,
  pixelsToInches,
} from './calculation';
import {
  CM_PER_INCH,
  DEFAULT_PIXELS_TO_INCHES_INPUT,
  DEFAULT_PPI,
  MM_PER_INCH,
} from './types';
import { validatePixelsToInches } from './validation';

const at96: readonly [number, number][] = [
  [0, 0],
  [24, 0.25],
  [48, 0.5],
  [72, 0.75],
  [96, 1],
  [192, 2],
  [300, 3.125],
  [480, 5],
  [960, 10],
  [1080, 11.25],
  [1920, 20],
];

for (const [pixels, inches] of at96) {
  assert.equal(pixelsToInches(pixels, 96), inches);
  assert.equal(inchesToPixels(inches, 96), pixels);
  assert.equal(
    calculatePixelsToInches({ source: 'pixels', inches: null, pixels, ppi: 96 }).inches,
    inches
  );
  assert.equal(
    calculatePixelsToInches({ source: 'inches', inches, pixels: null, ppi: 96 }).pixels,
    pixels
  );
}

const at300: readonly [number, number][] = [
  [150, 0.5],
  [300, 1],
  [600, 2],
  [900, 3],
  [1200, 4],
  [1800, 6],
  [2400, 8],
  [3000, 10],
  [1080, 3.6],
];

for (const [pixels, inches] of at300) {
  assert.ok(Math.abs(pixelsToInches(pixels, 300) - inches) < 1e-12);
  assert.ok(Math.abs(inchesToPixels(inches, 300) - pixels) < 1e-12);
}

{
  // PPI change: source pixels stays 300; inches update.
  const before = calculatePixelsToInches({
    source: 'pixels',
    inches: null,
    pixels: 300,
    ppi: 96,
  });
  assert.equal(before.inches, 3.125);
  const after = calculatePixelsToInches({
    source: 'pixels',
    inches: null,
    pixels: 300,
    ppi: 300,
  });
  assert.equal(after.pixels, 300);
  assert.equal(after.inches, 1);
}

{
  // PPI change: source inches stays 2; pixels update.
  const before = calculatePixelsToInches({
    source: 'inches',
    inches: 2,
    pixels: null,
    ppi: 96,
  });
  assert.equal(before.pixels, 192);
  const after = calculatePixelsToInches({
    source: 'inches',
    inches: 2,
    pixels: null,
    ppi: 300,
  });
  assert.equal(after.inches, 2);
  assert.equal(after.pixels, 600);
}

{
  const result = calculatePixelsToInches(DEFAULT_PIXELS_TO_INCHES_INPUT);
  assert.equal(result.pixels, 192);
  assert.equal(result.inches, 2);
  assert.equal(result.ppi, DEFAULT_PPI);
  const mm = result.otherUnits.find((row) => row.unit === 'mm');
  const cm = result.otherUnits.find((row) => row.unit === 'cm');
  const ft = result.otherUnits.find((row) => row.unit === 'ft');
  assert.equal(mm?.value, 2 * MM_PER_INCH);
  assert.equal(cm?.value, 2 * CM_PER_INCH);
  assert.ok(ft && Math.abs(ft.value - 2 / 12) < 1e-15);
}

{
  // Repeated PPI flips must not drift when source is pixels.
  let ppi = 96;
  const pixels = 1080;
  for (let i = 0; i < 20; i += 1) {
    ppi = ppi === 96 ? 300 : 96;
    const result = calculatePixelsToInches({
      source: 'pixels',
      inches: null,
      pixels,
      ppi,
    });
    assert.equal(result.pixels, pixels);
    assert.ok(Math.abs(result.inches - pixels / ppi) < 1e-12);
  }
}

{
  assert.equal(formatMeasure(11.25), '11.25');
  assert.equal(formatMeasure(0), '0');
  assert.equal(formatMeasure(3.6), '3.6');
}

{
  const ok = validatePixelsToInches({
    source: 'pixels',
    inches: null,
    pixels: 96,
    ppi: 96,
  });
  assert.equal(ok.isValid, true);

  const blank = validatePixelsToInches({
    source: 'pixels',
    inches: null,
    pixels: null,
    ppi: 96,
  });
  assert.equal(blank.isValid, false);

  const zeroPpi = validatePixelsToInches({
    source: 'inches',
    inches: 1,
    pixels: null,
    ppi: 0,
  });
  assert.equal(zeroPpi.isValid, false);
  assert.ok(zeroPpi.errors.ppi);

  const negPpi = validatePixelsToInches({
    source: 'inches',
    inches: 1,
    pixels: null,
    ppi: -96,
  });
  assert.equal(negPpi.isValid, false);

  const negInches = validatePixelsToInches({
    source: 'inches',
    inches: -1,
    pixels: null,
    ppi: 96,
  });
  assert.equal(negInches.isValid, false);
  assert.ok(negInches.errors.inches);

  const negPixels = validatePixelsToInches({
    source: 'pixels',
    inches: null,
    pixels: -10,
    ppi: 96,
  });
  assert.equal(negPixels.isValid, false);
  assert.ok(negPixels.errors.pixels);

  const zeroOk = validatePixelsToInches({
    source: 'pixels',
    inches: null,
    pixels: 0,
    ppi: 96,
  });
  assert.equal(zeroOk.isValid, true);
  assert.equal(
    calculatePixelsToInches({ source: 'pixels', inches: null, pixels: 0, ppi: 96 }).inches,
    0
  );
}

console.log('pixels-to-inches calculation.test.ts: ok');
