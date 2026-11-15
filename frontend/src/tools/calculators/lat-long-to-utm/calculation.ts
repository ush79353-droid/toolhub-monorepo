import proj4 from 'proj4';
import {
  dmsToDecimalDegrees,
  decimalDegreesToDmsDisplay,
  formatDd,
  formatSecondsField,
  latitudeHemisphereFromSigned,
  longitudeHemisphereFromSigned,
  signFromLatitudeHemisphere,
  signFromLongitudeHemisphere,
} from '../coordinates/calculation';
import {
  EXAMPLE_LONDON,
  EXAMPLE_NYC,
  EXAMPLE_SYDNEY,
  UTM_MAX_LATITUDE,
  UTM_MIN_LATITUDE,
  WGS84,
  type LatLongToUtmInput,
  type LatLongToUtmResult,
  type UtmHemisphere,
  type UtmResult,
} from './types';

export {
  dmsToDecimalDegrees,
  decimalDegreesToDmsDisplay,
  formatDd,
  formatSecondsField,
  latitudeHemisphereFromSigned,
  longitudeHemisphereFromSigned,
  signFromLatitudeHemisphere,
  signFromLongitudeHemisphere,
  EXAMPLE_NYC,
  EXAMPLE_LONDON,
  EXAMPLE_SYDNEY,
  UTM_MAX_LATITUDE,
  UTM_MIN_LATITUDE,
  WGS84,
};

const WGS84_LONLAT =
  '+proj=longlat +datum=WGS84 +no_defs +type=crs';

/** Format easting/northing for display (meters). */
export function formatUtmMeters(value: number, decimals = 3): string {
  if (!Number.isFinite(value)) return '';
  const fixed = value.toFixed(decimals);
  const [whole, frac] = fixed.split('.');
  const withSep = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac ? `${withSep}.${frac}` : withSep;
}

/**
 * Ordinary UTM zone from longitude, then Norway / Svalbard exceptions.
 * Longitude +180 maps to zone 60 (not 61). Longitude −180 maps to zone 1.
 */
export function getUtmZone(latitude: number, longitude: number): number {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Invalid coordinates for UTM zone');
  }

  const lon = longitude === 180 ? 180 : longitude === -180 ? -180 : longitude;

  // Norway exception (before ordinary formula).
  if (latitude >= 56 && latitude < 64 && lon >= 3 && lon < 12) {
    return 32;
  }

  // Svalbard exceptions.
  if (latitude >= 72 && latitude < 84) {
    if (lon >= 0 && lon < 9) return 31;
    if (lon >= 9 && lon < 21) return 33;
    if (lon >= 21 && lon < 33) return 35;
    if (lon >= 33 && lon < 42) return 37;
  }

  let zone = Math.floor((lon + 180) / 6) + 1;
  if (zone > 60) zone = 60;
  if (zone < 1) zone = 1;
  return zone;
}

export function getUtmHemisphere(latitude: number): UtmHemisphere {
  // Equator (exactly 0) uses northern false northing (0 m).
  return latitude < 0 ? 'S' : 'N';
}

export function getUtmCentralMeridian(zone: number): number {
  return 6 * zone - 183;
}

export function getUtmEpsg(zone: number, hemisphere: UtmHemisphere): string {
  if (!Number.isInteger(zone) || zone < 1 || zone > 60) {
    throw new Error(`Invalid UTM zone ${zone}`);
  }
  const prefix = hemisphere === 'N' ? 32_600 : 32_700;
  return `EPSG:${prefix + zone}`;
}

export function isWithinUtmCoverage(latitude: number): boolean {
  return latitude >= UTM_MIN_LATITUDE && latitude <= UTM_MAX_LATITUDE;
}

function utmProjDefinition(zone: number, hemisphere: UtmHemisphere): string {
  const south = hemisphere === 'S' ? ' +south' : '';
  return `+proj=utm +zone=${zone}${south} +datum=WGS84 +units=m +no_defs +type=crs`;
}

/**
 * Forward WGS84 geographic → UTM (ellipsoidal Transverse Mercator via proj4).
 */
export function latLongToUTM(latitude: number, longitude: number): UtmResult {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Latitude and longitude must be finite');
  }
  if (Math.abs(latitude) > 90) {
    throw new Error('Latitude must be between −90° and 90°');
  }
  if (Math.abs(longitude) > 180) {
    throw new Error('Longitude must be between −180° and 180°');
  }
  if (!isWithinUtmCoverage(latitude)) {
    throw new Error(
      `Latitude ${latitude}° is outside standard UTM coverage (${UTM_MIN_LATITUDE}° to ${UTM_MAX_LATITUDE}°)`
    );
  }

  const zone = getUtmZone(latitude, longitude);
  const hemisphere = getUtmHemisphere(latitude);
  const definition = utmProjDefinition(zone, hemisphere);
  const [easting, northing] = proj4(WGS84_LONLAT, definition, [longitude, latitude]);

  if (!Number.isFinite(easting) || !Number.isFinite(northing)) {
    throw new Error('UTM projection produced a non-finite result');
  }

  return {
    zone,
    hemisphere,
    easting,
    northing,
    epsg: getUtmEpsg(zone, hemisphere),
    centralMeridian: getUtmCentralMeridian(zone),
  };
}

export function calculateLatLongToUtm(
  input: LatLongToUtmInput
): LatLongToUtmResult {
  const latitude = input.latitude!;
  const longitude = input.longitude!;
  return {
    latitude,
    longitude,
    utm: latLongToUTM(latitude, longitude),
  };
}
