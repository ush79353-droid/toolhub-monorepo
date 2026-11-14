import assert from 'node:assert/strict';
import {
  EXAMPLE_LONDON,
  EXAMPLE_NYC,
  EXAMPLE_SYDNEY,
  getUtmCentralMeridian,
  getUtmEpsg,
  getUtmHemisphere,
  getUtmZone,
  isWithinUtmCoverage,
  latLongToUTM,
} from './calculation';
import { dmsToDecimalDegrees } from '../coordinates/calculation';

function assertClose(actual: number, expected: number, eps: number): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected} ± ${eps}, got ${actual}`
  );
}

// Zone selection
assert.equal(getUtmZone(40.7128, -74.006), 18);
assert.equal(getUtmZone(51.5074, -0.1278), 30);
assert.equal(getUtmZone(-33.8688, 151.2093), 56);
assert.equal(getUtmZone(0, 3), 31);
assert.equal(getUtmZone(60, 6), 32); // Norway
assert.equal(getUtmZone(78, 20), 33); // Svalbard
assert.equal(getUtmZone(0, 180), 60);
assert.equal(getUtmZone(0, -180), 1);

assert.equal(getUtmHemisphere(1), 'N');
assert.equal(getUtmHemisphere(0), 'N');
assert.equal(getUtmHemisphere(-0.0001), 'S');

assert.equal(getUtmCentralMeridian(18), -75);
assert.equal(getUtmEpsg(18, 'N'), 'EPSG:32618');
assert.equal(getUtmEpsg(56, 'S'), 'EPSG:32756');
assert.equal(getUtmEpsg(30, 'N'), 'EPSG:32630');

assert.equal(isWithinUtmCoverage(-80), true);
assert.equal(isWithinUtmCoverage(84), true);
assert.equal(isWithinUtmCoverage(-80.1), false);
assert.equal(isWithinUtmCoverage(84.1), false);

// NYC
{
  const r = latLongToUTM(EXAMPLE_NYC.latitude, EXAMPLE_NYC.longitude);
  assert.equal(r.zone, 18);
  assert.equal(r.hemisphere, 'N');
  assert.equal(r.epsg, 'EPSG:32618');
  // Independent proj4/WGS84 UTM reference (meter tolerance).
  assertClose(r.easting, 583_959.372, 0.01);
  assertClose(r.northing, 4_507_350.998, 0.01);
}

// London
{
  const r = latLongToUTM(EXAMPLE_LONDON.latitude, EXAMPLE_LONDON.longitude);
  assert.equal(r.zone, 30);
  assert.equal(r.hemisphere, 'N');
  assert.equal(r.epsg, 'EPSG:32630');
  assertClose(r.easting, 699_316.234, 0.01);
  assertClose(r.northing, 5_710_163.758, 0.01);
}

// Sydney
{
  const r = latLongToUTM(EXAMPLE_SYDNEY.latitude, EXAMPLE_SYDNEY.longitude);
  assert.equal(r.zone, 56);
  assert.equal(r.hemisphere, 'S');
  assert.equal(r.epsg, 'EPSG:32756');
  assertClose(r.easting, 334_368.634, 0.01);
  assertClose(r.northing, 6_250_948.345, 0.01);
}

// Equator, central meridian of zone 31 (3°E) → false easting / zero northing
{
  const r = latLongToUTM(0, 3);
  assert.equal(r.zone, 31);
  assert.equal(r.hemisphere, 'N');
  assertClose(r.easting, 500_000, 0.01);
  assertClose(r.northing, 0, 0.01);
}

// Southern near equator uses false northing
{
  const r = latLongToUTM(-0.01, 3);
  assert.equal(r.hemisphere, 'S');
  assert.ok(r.northing > 9_000_000);
}

// Outside coverage
assert.throws(() => latLongToUTM(85, 0));
assert.throws(() => latLongToUTM(-81, 0));

// DMS parity with Coordinates Converter
{
  const lat = dmsToDecimalDegrees(40, 42, 46.08, 1);
  const lon = dmsToDecimalDegrees(74, 0, 21.6, -1);
  assertClose(lat, 40.7128, 1e-10);
  assertClose(lon, -74.006, 1e-10);
  const r = latLongToUTM(lat, lon);
  assert.equal(r.zone, 18);
}

console.log('lat-long-to-utm calculation.test.ts: ok');
