import assert from 'node:assert/strict';
import {
  buildCoordinatesResult,
  ddmToDecimalDegrees,
  decimalDegreesToDDM,
  decimalDegreesToDMS,
  decimalDegreesToDdmDisplay,
  decimalDegreesToDmsDisplay,
  dmsToDecimalDegrees,
  formatDd,
  latitudeHemisphereFromSigned,
  longitudeHemisphereFromSigned,
} from './calculation';
import { EXAMPLE_LATITUDE, EXAMPLE_LONGITUDE } from './types';
import { validateAxisComponents } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`
  );
}

// DD ↔ DMS (NYC lat)
{
  const dms = decimalDegreesToDMS(EXAMPLE_LATITUDE);
  assert.equal(dms.degrees, 40);
  assert.equal(dms.minutes, 42);
  assertClose(dms.seconds, 46.08, 1e-8);

  const back = dmsToDecimalDegrees(40, 42, 46.08, 1);
  assertClose(back, EXAMPLE_LATITUDE, 1e-10);
}

// Western longitude DMS
{
  const signed = dmsToDecimalDegrees(74, 0, 21.6, -1);
  assertClose(signed, EXAMPLE_LONGITUDE, 1e-10);
  const parts = decimalDegreesToDMS(EXAMPLE_LONGITUDE);
  assert.equal(parts.degrees, 74);
  assert.equal(parts.minutes, 0);
  assertClose(parts.seconds, 21.6, 1e-8);
}

// Southern latitude
{
  const signed = dmsToDecimalDegrees(33, 55, 12, -1);
  assertClose(signed, -33.92, 1e-12);
}

// DD ↔ DDM
{
  const ddm = decimalDegreesToDDM(EXAMPLE_LATITUDE);
  assert.equal(ddm.degrees, 40);
  assertClose(ddm.decimalMinutes, 42.768, 1e-10);
  assertClose(ddmToDecimalDegrees(40, 42.768, 1), EXAMPLE_LATITUDE, 1e-10);
}

// Round-trips
{
  for (const v of [0, 40.7128, -33.92, 90, -90, 180, -180, 1e-8]) {
    if (Math.abs(v) > 90 && Math.abs(v) !== 180) continue;
    const latSafe = Math.abs(v) <= 90 ? v : 45;
    const dms = decimalDegreesToDMS(latSafe);
    const back = dmsToDecimalDegrees(dms.degrees, dms.minutes, dms.seconds, latSafe < 0 ? -1 : 1);
    assertClose(back, latSafe, 1e-9);

    const ddm = decimalDegreesToDDM(latSafe);
    const back2 = ddmToDecimalDegrees(ddm.degrees, ddm.decimalMinutes, latSafe < 0 ? -1 : 1);
    assertClose(back2, latSafe, 1e-9);
  }
}

// Boundaries
assertClose(dmsToDecimalDegrees(90, 0, 0, 1), 90);
assertClose(dmsToDecimalDegrees(90, 0, 0, -1), -90);
assertClose(dmsToDecimalDegrees(180, 0, 0, 1), 180);
assertClose(dmsToDecimalDegrees(180, 0, 0, -1), -180);

// Seconds rounding carry
{
  // Construct a value that rounds seconds to 60 at 2 decimals then carries.
  const crafted = 10 + 20 / 60 + 59.996 / 3600;
  const display = decimalDegreesToDmsDisplay(crafted, 2);
  assert.ok(display.seconds < 60);
  assert.ok(display.minutes < 60);
}

// Hemisphere helpers
assert.equal(latitudeHemisphereFromSigned(1), 'N');
assert.equal(latitudeHemisphereFromSigned(-1), 'S');
assert.equal(longitudeHemisphereFromSigned(1), 'E');
assert.equal(longitudeHemisphereFromSigned(-1), 'W');

{
  const r = buildCoordinatesResult(EXAMPLE_LATITUDE, EXAMPLE_LONGITUDE);
  assert.equal(r.latitudeHemisphere, 'N');
  assert.equal(r.longitudeHemisphere, 'W');
  assert.equal(r.latitudeDms.degrees, 40);
  assert.equal(r.longitudeDdm.degrees, 74);
}

// Validation
{
  const ok = validateAxisComponents({
    format: 'DD',
    showLetters: true,
    maxAbsDegrees: 90,
    axis: 'latitude',
    draft: { degrees: '40.7128', minutes: '', seconds: '', decimalMinutes: '' },
  });
  assert.equal(ok.isValid, true);
  assertClose(ok.value!, 40.7128);

  const badLat = validateAxisComponents({
    format: 'DD',
    showLetters: false,
    maxAbsDegrees: 90,
    axis: 'latitude',
    draft: { degrees: '91', minutes: '', seconds: '', decimalMinutes: '' },
  });
  assert.equal(badLat.isValid, false);

  const badMin = validateAxisComponents({
    format: 'DMS',
    showLetters: true,
    maxAbsDegrees: 90,
    axis: 'latitude',
    draft: { degrees: '40', minutes: '60', seconds: '0', decimalMinutes: '' },
  });
  assert.equal(badMin.isValid, false);

  const atPole = validateAxisComponents({
    format: 'DMS',
    showLetters: true,
    maxAbsDegrees: 90,
    axis: 'latitude',
    draft: { degrees: '90', minutes: '0', seconds: '1', decimalMinutes: '' },
  });
  assert.equal(atPole.isValid, false);
}

assert.equal(formatDd(0), '0');
assert.ok(decimalDegreesToDdmDisplay(40.7128).decimalMinutes < 60);

console.log('coordinates calculation.test.ts: ok');
