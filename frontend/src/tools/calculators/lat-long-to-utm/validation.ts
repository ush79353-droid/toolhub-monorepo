import { parseOptionalNumber as parseShared } from '../coordinates/validation';
import {
  MAX_ABS_LATITUDE,
  MAX_ABS_LONGITUDE,
  UTM_MAX_LATITUDE,
  UTM_MIN_LATITUDE,
  type CoordinateType,
  type LatLongToUtmFieldErrors,
  type LatitudeHemisphere,
  type LongitudeHemisphere,
} from './types';
import {
  dmsToDecimalDegrees,
  isWithinUtmCoverage,
  signFromLatitudeHemisphere,
  signFromLongitudeHemisphere,
} from './calculation';

export { parseOptionalNumber } from '../coordinates/validation';
export { isIncompleteNumber } from '../coordinates/validation';

export interface DmsAxisDraft {
  degrees: string;
  minutes: string;
  seconds: string;
  hemisphere: LatitudeHemisphere | LongitudeHemisphere;
}

export function parseDdAxis(
  raw: string,
  maxAbs: number,
  axis: 'latitude' | 'longitude'
): { value: number | null; errors: LatLongToUtmFieldErrors; blank: boolean } {
  const errors: LatLongToUtmFieldErrors = {};
  const value = parseShared(raw);
  if (value === null) return { value: null, errors, blank: true };
  if (!Number.isFinite(value)) {
    errors[axis] = `Enter a valid ${axis}.`;
    return { value: null, errors, blank: false };
  }
  if (Math.abs(value) > maxAbs) {
    errors[axis] =
      axis === 'latitude'
        ? 'Latitude must be between −90° and 90°.'
        : 'Longitude must be between −180° and 180°.';
    return { value: null, errors, blank: false };
  }
  return { value, errors, blank: false };
}

export function parseDmsAxis(
  draft: DmsAxisDraft,
  maxAbs: number,
  axis: 'latitude' | 'longitude'
): { value: number | null; errors: LatLongToUtmFieldErrors; blank: boolean } {
  const errors: LatLongToUtmFieldErrors = {};
  const degKey = axis === 'latitude' ? 'latDegrees' : 'lonDegrees';
  const minKey = axis === 'latitude' ? 'latMinutes' : 'lonMinutes';
  const secKey = axis === 'latitude' ? 'latSeconds' : 'lonSeconds';

  const degrees = parseShared(draft.degrees);
  const minutes = parseShared(draft.minutes);
  const seconds = parseShared(draft.seconds);

  if (degrees === null && minutes === null && seconds === null) {
    return { value: null, errors, blank: true };
  }
  if (degrees === null || minutes === null || seconds === null) {
    return { value: null, errors, blank: true };
  }
  if (!Number.isFinite(degrees)) errors[degKey] = 'Enter valid degrees.';
  if (!Number.isFinite(minutes)) errors[minKey] = 'Enter valid minutes.';
  if (!Number.isFinite(seconds)) errors[secKey] = 'Enter valid seconds.';
  if (Object.keys(errors).length > 0) {
    return { value: null, errors, blank: false };
  }

  if (degrees < 0) {
    errors[degKey] = 'Use a nonnegative magnitude with the hemisphere selector.';
  }
  if (minutes < 0 || minutes >= 60) {
    errors[minKey] = 'Minutes must be from 0 (inclusive) to 60 (exclusive).';
  }
  if (seconds < 0 || seconds >= 60) {
    errors[secKey] = 'Seconds must be from 0 (inclusive) to 60 (exclusive).';
  }
  const degAbs = Math.abs(degrees);
  if (degAbs > maxAbs || (degAbs === maxAbs && (minutes > 0 || seconds > 0))) {
    errors[axis] =
      axis === 'latitude'
        ? 'Latitude must be between −90° and 90°.'
        : 'Longitude must be between −180° and 180°.';
  }
  if (Object.keys(errors).length > 0) {
    return { value: null, errors, blank: false };
  }

  const sign =
    axis === 'latitude'
      ? signFromLatitudeHemisphere(draft.hemisphere as LatitudeHemisphere)
      : signFromLongitudeHemisphere(draft.hemisphere as LongitudeHemisphere);

  return {
    value: dmsToDecimalDegrees(degAbs, minutes, seconds, sign),
    errors,
    blank: false,
  };
}

export function validateLatLongToUtm(opts: {
  coordinateType: CoordinateType;
  latDd: string;
  lonDd: string;
  latDms: DmsAxisDraft;
  lonDms: DmsAxisDraft;
}): {
  isValid: boolean;
  latitude: number | null;
  longitude: number | null;
  errors: LatLongToUtmFieldErrors;
} {
  const { coordinateType } = opts;
  let latParsed;
  let lonParsed;

  if (coordinateType === 'DD') {
    latParsed = parseDdAxis(opts.latDd, MAX_ABS_LATITUDE, 'latitude');
    lonParsed = parseDdAxis(opts.lonDd, MAX_ABS_LONGITUDE, 'longitude');
  } else {
    latParsed = parseDmsAxis(opts.latDms, MAX_ABS_LATITUDE, 'latitude');
    lonParsed = parseDmsAxis(opts.lonDms, MAX_ABS_LONGITUDE, 'longitude');
  }

  const errors: LatLongToUtmFieldErrors = {
    ...latParsed.errors,
    ...lonParsed.errors,
  };

  const latitude = latParsed.value;
  const longitude = lonParsed.value;

  if (
    latitude !== null &&
    Number.isFinite(latitude) &&
    !isWithinUtmCoverage(latitude)
  ) {
    errors.coverage = `This latitude is outside the standard UTM coverage. UTM normally supports locations from ${Math.abs(UTM_MIN_LATITUDE)}°S to ${UTM_MAX_LATITUDE}°N.`;
  }

  const isValid =
    latitude !== null &&
    longitude !== null &&
    Object.keys(errors).length === 0 &&
    !latParsed.blank &&
    !lonParsed.blank;

  return { isValid, latitude, longitude, errors };
}
