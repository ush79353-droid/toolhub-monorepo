export {
  createEmptyInput,
  createEmptyInput as createDefaultInput,
  type BloodPregnancyHcgFieldErrors as PositivePregnancyFollowUpFieldErrors,
  type BloodPregnancyHcgInput as PositivePregnancyFollowUpInput,
  type BloodPregnancyHcgResult as PositivePregnancyFollowUpResult,
  type EmbryoAgeDays,
  type TestSensitivityMiu,
} from '../blood-pregnancy-hcg/types';

import type { BloodPregnancyHcgInput } from '../blood-pregnancy-hcg/types';

export function inputsEqual(
  a: BloodPregnancyHcgInput,
  b: BloodPregnancyHcgInput,
): boolean {
  return (
    a.cycleLengthDaysText === b.cycleLengthDaysText &&
    a.lastPeriodIso === b.lastPeriodIso &&
    a.ovulationIso === b.ovulationIso &&
    a.ovulationManual === b.ovulationManual &&
    a.ivfTransferIso === b.ivfTransferIso &&
    a.embryoAgeDays === b.embryoAgeDays &&
    a.selectTestSensitivity === b.selectTestSensitivity &&
    a.testSensitivityMiu === b.testSensitivityMiu
  );
}
