import type {
  EmbryoAgeDays,
  TestSensitivityMiu,
} from '../blood-pregnancy-hcg/types';

export type { EmbryoAgeDays, TestSensitivityMiu };

export interface UrineHomePregnancyTestInput {
  cycleLengthDaysText: string;
  lastPeriodIso: string;
  ovulationIso: string;
  /** When true, ovulationIso is user-authored and not overwritten from LMP. */
  ovulationManual: boolean;
  showNaturalSensitivity: boolean;
  naturalSensitivityMiu: TestSensitivityMiu;
  ivfTransferIso: string;
  embryoAgeDays: EmbryoAgeDays;
  showIvfSensitivity: boolean;
  ivfSensitivityMiu: TestSensitivityMiu;
}

export interface UrineHomePregnancyTestFieldErrors {
  cycleLengthDaysText?: string;
  lastPeriodIso?: string;
  ovulationIso?: string;
  ivfTransferIso?: string;
}

export interface UrineHomePregnancyTestResult {
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

export function createEmptyInput(): UrineHomePregnancyTestInput {
  return {
    cycleLengthDaysText: '28',
    lastPeriodIso: '',
    ovulationIso: '',
    ovulationManual: false,
    showNaturalSensitivity: false,
    naturalSensitivityMiu: '25',
    ivfTransferIso: '',
    embryoAgeDays: 5,
    showIvfSensitivity: false,
    ivfSensitivityMiu: '25',
  };
}

export const createDefaultInput = createEmptyInput;
