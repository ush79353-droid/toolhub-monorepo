export type TrirDriver = 'injuries' | 'hoursWorked' | 'trir';

export type TrirBand = 'low' | 'moderate' | 'high';

export interface TrirInput {
  hoursWorked: string;
  injuries: string;
  trir: string;
  driver: TrirDriver;
}

export interface TrirResult {
  hoursWorked: number;
  injuries: number;
  /** True when injuries were reverse-estimated (may be fractional). */
  injuriesEstimated: boolean;
  trir: number;
  normalizationFactor: number;
  band: TrirBand;
  interpretation: string;
  formattedHoursWorked: string;
  formattedInjuries: string;
  formattedTrir: string;
}

export type TrirFieldErrors = {
  hoursWorked?: string;
  injuries?: string;
  trir?: string;
  form?: string;
};

export function createDefaultInput(): TrirInput {
  return {
    hoursWorked: '',
    injuries: '',
    trir: '',
    driver: 'injuries',
  };
}

/** Spec Example A: 2 cases / 2,000,000 hours → 0.20 */
export function createExampleInput(): TrirInput {
  return {
    hoursWorked: '2000000',
    injuries: '2',
    trir: '',
    driver: 'injuries',
  };
}
