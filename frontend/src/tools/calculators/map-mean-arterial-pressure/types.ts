export interface MapInput {
  sbpMmHg: string;
  dbpMmHg: string;
  displayPulsePressure: boolean;
}

export interface MapResult {
  sbpMmHg: number;
  dbpMmHg: number;
  mapMmHg: number;
  pulsePressureMmHg: number | null;
  formattedMap: string;
  formattedPulsePressure: string;
  formattedSbp: string;
  formattedDbp: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type MapFieldErrors = {
  form?: string;
  sbpMmHg?: string;
  dbpMmHg?: string;
};

export function createEmptyInput(): MapInput {
  return {
    sbpMmHg: '',
    dbpMmHg: '',
    displayPulsePressure: false,
  };
}

/** Prompt fixture: 120/80 → MAP 93.33, PP 40. */
export function createExampleInput(): MapInput {
  return {
    sbpMmHg: '120',
    dbpMmHg: '80',
    displayPulsePressure: true,
  };
}

export function inputsEqual(a: MapInput, b: MapInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}