/**
 * Article-context timing widget for “Positive Pregnancy Test at 3 Weeks…”.
 * Reuses urine-home / blood-pregnancy-hcg educational calendar — no yes/no pregnancy inference.
 */

export {
  createEmptyInput as createUrineEmptyInput,
  type EmbryoAgeDays,
  type TestSensitivityMiu,
  type UrineHomePregnancyTestFieldErrors as PositivePregnancyTestAt3WeeksFieldErrors,
  type UrineHomePregnancyTestInput as PositivePregnancyTestAt3WeeksInput,
  type UrineHomePregnancyTestResult as PositivePregnancyTestAt3WeeksResult,
} from '../urine-home-pregnancy-test/types';

import type { UrineHomePregnancyTestInput } from '../urine-home-pregnancy-test/types';
import { createEmptyInput as createUrineEmptyInput } from '../urine-home-pregnancy-test/types';

/** Screenshot defaults: cycle 28; blank dates; day-5 embryo; sensitivity dropdowns visible. */
export function createEmptyInput(): UrineHomePregnancyTestInput {
  return {
    ...createUrineEmptyInput(),
    showNaturalSensitivity: true,
    naturalSensitivityMiu: '25',
    showIvfSensitivity: true,
    ivfSensitivityMiu: '25',
    embryoAgeDays: 5,
  };
}

export const createDefaultInput = createEmptyInput;
