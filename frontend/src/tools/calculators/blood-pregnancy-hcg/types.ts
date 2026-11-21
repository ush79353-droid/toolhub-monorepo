export type EmbryoAgeDays = 1 | 2 | 3 | 4 | 5 | 6;

export type TestSensitivityMiu =
  | '10'
  | '15'
  | '20'
  | '25';

export interface BloodPregnancyHcgInput {
  cycleLengthDaysText: string;
  lastPeriodIso: string;
  ovulationIso: string;
  /** When true, ovulationIso is user-authored and not overwritten from LMP. */
  ovulationManual: boolean;
  ivfTransferIso: string;
  embryoAgeDays: EmbryoAgeDays;
  selectTestSensitivity: boolean;
  testSensitivityMiu: TestSensitivityMiu;
}

export interface BloodPregnancyHcgFieldErrors {
  cycleLengthDaysText?: string;
  lastPeriodIso?: string;
  ovulationIso?: string;
  ivfTransferIso?: string;
}

export interface BloodPregnancyHcgResult {
  naturalReady: boolean;
  ivfReady: boolean;
  cycleLengthDays: number | null;
  lastPeriodIso: string | null;
  ovulationIso: string | null;
  naturalUrineIso: string | null;
  naturalBloodIso: string | null;
  ivfTransferIso: string | null;
  embryoAgeDays: EmbryoAgeDays;
  ivfUrineIso: string | null;
  ivfBloodIso: string | null;
  sensitivityNote: string | null;
  interpretation: string;
  disclaimer: string;
}

export function createEmptyInput(): BloodPregnancyHcgInput {
  return {
    cycleLengthDaysText: '28',
    lastPeriodIso: '',
    ovulationIso: '',
    ovulationManual: false,
    ivfTransferIso: '',
    embryoAgeDays: 5,
    selectTestSensitivity: false,
    testSensitivityMiu: '25',
  };
}
