export type CoordinateType = 'DD' | 'DMS';

export type LatitudeHemisphere = 'N' | 'S';
export type LongitudeHemisphere = 'E' | 'W';

export type UtmHemisphere = 'N' | 'S';

export interface UtmResult {
  zone: number;
  hemisphere: UtmHemisphere;
  easting: number;
  northing: number;
  epsg: string;
  centralMeridian: number;
}

export interface LatLongToUtmInput {
  coordinateType: CoordinateType;
  /** Canonical signed decimal degrees. */
  latitude: number | null;
  longitude: number | null;
}

export interface LatLongToUtmResult {
  latitude: number;
  longitude: number;
  utm: UtmResult;
}

export type LatLongToUtmFieldErrors = Partial<
  Record<
    | 'latitude'
    | 'longitude'
    | 'latDegrees'
    | 'latMinutes'
    | 'latSeconds'
    | 'lonDegrees'
    | 'lonMinutes'
    | 'lonSeconds'
    | 'coverage',
    string
  >
>;

/** Standard UTM coverage (degrees). */
export const UTM_MIN_LATITUDE = -80;
export const UTM_MAX_LATITUDE = 84;

export const MAX_ABS_LATITUDE = 90;
export const MAX_ABS_LONGITUDE = 180;

export const WGS84 = {
  semiMajorAxis: 6_378_137.0,
  inverseFlattening: 298.257223563,
  scaleFactor: 0.9996,
  falseEasting: 500_000,
  southernFalseNorthing: 10_000_000,
} as const;

export const DEFAULT_LAT_LONG_TO_UTM_INPUT: LatLongToUtmInput = {
  coordinateType: 'DD',
  latitude: null,
  longitude: null,
};

export const EMPTY_LAT_LONG_TO_UTM_INPUT = DEFAULT_LAT_LONG_TO_UTM_INPUT;

/** Guide examples. */
export const EXAMPLE_NYC = { latitude: 40.7128, longitude: -74.006 } as const;
export const EXAMPLE_LONDON = { latitude: 51.5074, longitude: -0.1278 } as const;
export const EXAMPLE_SYDNEY = { latitude: -33.8688, longitude: 151.2093 } as const;
