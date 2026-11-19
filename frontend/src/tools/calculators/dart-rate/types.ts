export type DartDriver = 'incidents' | 'hoursWorked' | 'dartRate';

export interface DartRateInput {
  incidents: string;
  hoursWorked: string;
  dartRate: string;
  driver: DartDriver;
}

export interface DartRateResult {
  incidents: number;
  /** True when incidents were reverse-estimated (may be fractional). */
  incidentsEstimated: boolean;
  hoursWorked: number;
  dartRate: number;
  normalizationFactor: number;
  interpretation: string;
  formattedIncidents: string;
  formattedHoursWorked: string;
  formattedDartRate: string;
}

export type DartRateFieldErrors = {
  incidents?: string;
  hoursWorked?: string;
  dartRate?: string;
  form?: string;
};

export function createDefaultInput(): DartRateInput {
  return {
    incidents: '',
    hoursWorked: '',
    dartRate: '',
    driver: 'incidents',
  };
}

/** Spec example: 5 cases / 400,000 hours → 2.50 */
export function createExampleInput(): DartRateInput {
  return {
    incidents: '5',
    hoursWorked: '400000',
    dartRate: '',
    driver: 'incidents',
  };
}
