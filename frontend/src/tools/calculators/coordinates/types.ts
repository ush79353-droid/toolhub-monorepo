export type CoordinateFormat = 'DD' | 'DMS' | 'DDM';

export type LatitudeHemisphere = 'N' | 'S';
export type LongitudeHemisphere = 'E' | 'W';

export interface DmsParts {
  degrees: number;
  minutes: number;
  seconds: number;
}

export interface DdmParts {
  degrees: number;
  decimalMinutes: number;
}

/** Signed decimal degrees (N/E positive, S/W negative). */
export interface GeographicCoordinates {
  latitude: number | null;
  longitude: number | null;
}

export interface CoordinatesInput {
  format: CoordinateFormat;
  showLetters: boolean;
  latitude: number | null;
  longitude: number | null;
  latitudeHemisphere: LatitudeHemisphere;
  longitudeHemisphere: LongitudeHemisphere;
}

export interface CoordinatesResult {
  latitude: number;
  longitude: number;
  latitudeHemisphere: LatitudeHemisphere;
  longitudeHemisphere: LongitudeHemisphere;
  latitudeDms: DmsParts;
  longitudeDms: DmsParts;
  latitudeDdm: DdmParts;
  longitudeDdm: DdmParts;
}

export type CoordinatesFieldErrors = Partial<
  Record<
    | 'latitude'
    | 'longitude'
    | 'latDegrees'
    | 'latMinutes'
    | 'latSeconds'
    | 'latDecimalMinutes'
    | 'lonDegrees'
    | 'lonMinutes'
    | 'lonSeconds'
    | 'lonDecimalMinutes',
    string
  >
>;

export const MAX_ABS_LATITUDE = 90;
export const MAX_ABS_LONGITUDE = 180;

/** Empty defaults per reload/clear contract. */
export const DEFAULT_COORDINATES_INPUT: CoordinatesInput = {
  format: 'DD',
  showLetters: true,
  latitude: null,
  longitude: null,
  latitudeHemisphere: 'N',
  longitudeHemisphere: 'E',
};

export const EMPTY_COORDINATES_INPUT = DEFAULT_COORDINATES_INPUT;

/** Guide / FAQ example: NYC-ish. */
export const EXAMPLE_LATITUDE = 40.7128;
export const EXAMPLE_LONGITUDE = -74.006;
