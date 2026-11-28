/**
 * Crosswind / headwind / tailwind components for a runway.
 * Wind direction = direction FROM which the wind blows (meteorological).
 * Signed crosswind: + = from the right, − = from the left.
 * Signed headwind: + = headwind, − = tailwind.
 */

export type WindSpeedUnit = 'kt' | 'km/h' | 'mph' | 'm/s';
export type CrosswindDirection = 'left' | 'right' | 'none';
export type LongitudinalWindType = 'headwind' | 'tailwind' | 'none';
export type WindReference = 'magnetic' | 'true';

export const WIND_SPEED_UNIT_LABELS: Record<WindSpeedUnit, string> = {
  kt: 'kt',
  'km/h': 'km/h',
  mph: 'mph',
  'm/s': 'm/s',
};

export const RUNWAY_NUMBERS = Array.from({ length: 36 }, (_, i) => {
  const n = i + 1;
  return n.toString().padStart(2, '0');
});

export interface CrosswindInput {
  runwayNumber: string;
  useCustomHeading: boolean;
  customRunwayHeading: string;
  windDirection: string;
  windReference: WindReference;
  magneticVariation: string;
  windSpeed: string;
  windSpeedUnit: WindSpeedUnit;
}

export interface CrosswindResult {
  runwayNumber: string;
  runwayHeadingDegrees: number;
  windDirectionMagneticDegrees: number;
  windSpeedKnots: number;
  relativeWindAngleDegrees: number;
  signedCrosswindKnots: number;
  crosswindMagnitudeKnots: number;
  crosswindDirection: CrosswindDirection;
  signedHeadwindKnots: number;
  headwindMagnitudeKnots: number;
  tailwindMagnitudeKnots: number;
  longitudinalWindType: LongitudinalWindType;
  formulaSteps: string[];
  interpretation: string;
  displayUnit: WindSpeedUnit;
  chartPoints: { angleDeg: number; crosswindKt: number }[];
}

export type CrosswindFieldErrors = {
  runwayNumber?: string;
  customRunwayHeading?: string;
  windDirection?: string;
  magneticVariation?: string;
  windSpeed?: string;
  form?: string;
};

export function createEmptyInput(): CrosswindInput {
  return {
    runwayNumber: '36',
    useCustomHeading: false,
    customRunwayHeading: '',
    windDirection: '90',
    windReference: 'magnetic',
    magneticVariation: '0',
    windSpeed: '20',
    windSpeedUnit: 'kt',
  };
}

export function createExamplePureCrosswind(): CrosswindInput {
  return createEmptyInput();
}

export function createExampleHeadAndCross(): CrosswindInput {
  return {
    ...createEmptyInput(),
    runwayNumber: '27',
    windDirection: '300',
    windSpeed: '20',
  };
}

export function createExampleTailwind(): CrosswindInput {
  return {
    ...createEmptyInput(),
    runwayNumber: '18',
    windDirection: '0',
    windSpeed: '15',
  };
}

export function createExampleLeftCrosswind(): CrosswindInput {
  return {
    ...createEmptyInput(),
    runwayNumber: '09',
    windDirection: '30',
    windSpeed: '20',
  };
}
