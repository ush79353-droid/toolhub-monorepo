import type {
  DdmParts,
  DmsParts,
  LatitudeHemisphere,
  LongitudeHemisphere,
} from './types';
import { EXAMPLE_LATITUDE, EXAMPLE_LONGITUDE } from './types';

export { EXAMPLE_LATITUDE, EXAMPLE_LONGITUDE };

/** Readable angular display without ugly trailing zeros. */
export function formatAngle(value: number, maxDecimals = 8): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-8)) {
    return value
      .toExponential(8)
      .replace(/(\.\d*?[1-9])0+e/, '$1e')
      .replace(/\.0+e/, 'e')
      .replace(/e\+?/, 'e');
  }

  const rounded = Number(value.toFixed(maxDecimals));
  if (Math.abs(rounded) >= 1) {
    const nearest = Math.round(rounded);
    if (Math.abs(rounded - nearest) < 1e-10 * Math.max(1, Math.abs(nearest))) {
      return String(nearest);
    }
  }
  return String(rounded);
}

export function formatDd(value: number): string {
  return formatAngle(value, 8);
}

export function formatMinutesField(value: number): string {
  return formatAngle(value, 6);
}

export function formatSecondsField(value: number): string {
  return formatAngle(value, 4);
}

export function signFromLatitudeHemisphere(h: LatitudeHemisphere): 1 | -1 {
  return h === 'N' ? 1 : -1;
}

export function signFromLongitudeHemisphere(h: LongitudeHemisphere): 1 | -1 {
  return h === 'E' ? 1 : -1;
}

export function latitudeHemisphereFromSigned(value: number): LatitudeHemisphere {
  return value < 0 ? 'S' : 'N';
}

export function longitudeHemisphereFromSigned(value: number): LongitudeHemisphere {
  return value < 0 ? 'W' : 'E';
}

/**
 * Convert DMS magnitude + hemisphere sign to signed decimal degrees.
 * Sign applies to the whole magnitude — never only to whole degrees.
 */
export function dmsToDecimalDegrees(
  degrees: number,
  minutes: number,
  seconds: number,
  sign: 1 | -1
): number {
  const magnitude = Math.abs(degrees) + minutes / 60 + seconds / 3600;
  return sign * magnitude;
}

export function ddmToDecimalDegrees(
  degrees: number,
  decimalMinutes: number,
  sign: 1 | -1
): number {
  const magnitude = Math.abs(degrees) + decimalMinutes / 60;
  return sign * magnitude;
}

/** Internal DMS without display rounding carry. */
export function decimalDegreesToDMS(decimalDegrees: number): DmsParts {
  if (!Number.isFinite(decimalDegrees)) {
    throw new Error('Invalid coordinate');
  }

  const absolute = Math.abs(decimalDegrees);
  let degrees = Math.floor(absolute);
  let totalMinutes = (absolute - degrees) * 60;
  let minutes = Math.floor(totalMinutes);
  let seconds = (totalMinutes - minutes) * 60;

  // Float noise near the next minute.
  if (seconds >= 60 - 1e-10) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    degrees += 1;
  }

  return { degrees, minutes, seconds };
}

export function decimalDegreesToDDM(decimalDegrees: number): DdmParts {
  if (!Number.isFinite(decimalDegrees)) {
    throw new Error('Invalid coordinate');
  }

  const absolute = Math.abs(decimalDegrees);
  let degrees = Math.floor(absolute);
  let decimalMinutes = (absolute - degrees) * 60;

  if (decimalMinutes >= 60 - 1e-10) {
    decimalMinutes = 0;
    degrees += 1;
  }

  return { degrees, decimalMinutes };
}

/**
 * Display-safe DMS: round seconds, then carry 60″ → +1′ and 60′ → +1°.
 */
export function decimalDegreesToDmsDisplay(
  decimalDegrees: number,
  secondDecimals = 4
): DmsParts {
  const raw = decimalDegreesToDMS(decimalDegrees);
  let { degrees, minutes } = raw;
  let seconds = Number(raw.seconds.toFixed(secondDecimals));

  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    degrees += 1;
  }

  return { degrees, minutes, seconds };
}

/**
 * Display-safe DDM: round decimal minutes, then carry 60′ → +1°.
 */
export function decimalDegreesToDdmDisplay(
  decimalDegrees: number,
  minuteDecimals = 6
): DdmParts {
  const raw = decimalDegreesToDDM(decimalDegrees);
  let { degrees } = raw;
  let decimalMinutes = Number(raw.decimalMinutes.toFixed(minuteDecimals));

  if (decimalMinutes >= 60) {
    decimalMinutes = 0;
    degrees += 1;
  }

  return { degrees, decimalMinutes };
}

export function formatDmsLine(
  parts: DmsParts,
  hemisphere: string | null
): string {
  const body = `${parts.degrees}° ${parts.minutes}′ ${formatSecondsField(parts.seconds)}″`;
  return hemisphere ? `${body} ${hemisphere}` : body;
}

export function formatDdmLine(
  parts: DdmParts,
  hemisphere: string | null
): string {
  const body = `${parts.degrees}° ${formatMinutesField(parts.decimalMinutes)}′`;
  return hemisphere ? `${body} ${hemisphere}` : body;
}

export function formatDdLine(
  signed: number,
  showLetters: boolean,
  hemisphere: string
): string {
  if (showLetters) {
    return `${formatDd(Math.abs(signed))}° ${hemisphere}`;
  }
  return `${formatDd(signed)}°`;
}

export function buildCoordinatesResult(
  latitude: number,
  longitude: number
): {
  latitude: number;
  longitude: number;
  latitudeHemisphere: LatitudeHemisphere;
  longitudeHemisphere: LongitudeHemisphere;
  latitudeDms: DmsParts;
  longitudeDms: DmsParts;
  latitudeDdm: DdmParts;
  longitudeDdm: DdmParts;
} {
  return {
    latitude,
    longitude,
    latitudeHemisphere: latitudeHemisphereFromSigned(latitude),
    longitudeHemisphere: longitudeHemisphereFromSigned(longitude),
    latitudeDms: decimalDegreesToDmsDisplay(latitude),
    longitudeDms: decimalDegreesToDmsDisplay(longitude),
    latitudeDdm: decimalDegreesToDdmDisplay(latitude),
    longitudeDdm: decimalDegreesToDdmDisplay(longitude),
  };
}
