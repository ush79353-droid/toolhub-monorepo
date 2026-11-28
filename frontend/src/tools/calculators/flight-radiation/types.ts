/**
 * Flight radiation estimate (educational).
 * Dose = DoseRate × FlightTime (optional × number of flights).
 * Default dose rate is illustrative — not a universal flight exposure rate.
 */

export type TimeUnit = 's' | 'min' | 'h' | 'd';
export type DoseRateUnit = 'µSv/h' | 'mSv/h' | 'Sv/h' | 'mrem/h' | 'rem/h';
export type RadiationDoseUnit = 'µSv' | 'mSv' | 'Sv' | 'mrem' | 'rem';

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  s: 's',
  min: 'min',
  h: 'h',
  d: 'd',
};

export const DOSE_RATE_UNIT_LABELS: Record<DoseRateUnit, string> = {
  'µSv/h': 'µSv/h',
  'mSv/h': 'mSv/h',
  'Sv/h': 'Sv/h',
  'mrem/h': 'mrem/h',
  'rem/h': 'rem/h',
};

export const DOSE_UNIT_LABELS: Record<RadiationDoseUnit, string> = {
  'µSv': 'µSv',
  mSv: 'mSv',
  Sv: 'Sv',
  mrem: 'mrem',
  rem: 'rem',
};

/** Illustrative cruise-average estimate only — user-editable. */
export const DEFAULT_DOSE_RATE_MSV_PER_H = 0.003;

export interface FlightRadiationInput {
  flightDuration: string;
  flightDurationUnit: TimeUnit;
  doseRate: string;
  doseRateUnit: DoseRateUnit;
  doseUnit: RadiationDoseUnit;
  numberOfFlights: string;
}

export interface FlightRadiationResult {
  doseMicrosieverts: number;
  dosePerFlightMicrosieverts: number;
  numberOfFlights: number;
  flightHours: number;
  doseRateUSvPerH: number;
  formattedDose: string;
  formattedPerFlight: string;
  formulaSteps: string[];
  interpretation: string;
}

export type FlightRadiationFieldErrors = {
  flightDuration?: string;
  doseRate?: string;
  numberOfFlights?: string;
  form?: string;
};

export function createEmptyInput(): FlightRadiationInput {
  return {
    flightDuration: '8',
    flightDurationUnit: 'h',
    doseRate: String(DEFAULT_DOSE_RATE_MSV_PER_H),
    doseRateUnit: 'mSv/h',
    doseUnit: 'mSv',
    numberOfFlights: '1',
  };
}

export function createExampleShortFlight(): FlightRadiationInput {
  return {
    ...createEmptyInput(),
    flightDuration: '3',
  };
}

export function createExampleLongHaul(): FlightRadiationInput {
  return {
    ...createEmptyInput(),
    flightDuration: '12',
  };
}
