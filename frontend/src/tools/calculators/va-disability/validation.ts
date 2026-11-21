import { calculateVaDisability } from './calculation';
import { DISABILITY_RATINGS } from './types';
import type {
  VaDisabilityFieldErrors,
  VaDisabilityInput,
  VaDisabilityResult,
} from './types';

export function validateVaDisabilityInput(input: VaDisabilityInput): {
  isValid: boolean;
  errors: VaDisabilityFieldErrors;
  result: VaDisabilityResult | null;
} {
  const errors: VaDisabilityFieldErrors = {};
  const ids = new Set<string>();
  for (const condition of input.conditions) {
    if (ids.has(condition.id)) {
      errors.conditions = 'Each condition needs its own id.';
    }
    ids.add(condition.id);
    if (!DISABILITY_RATINGS.includes(condition.rating)) {
      errors.conditions = 'Use a disability percentage from 0 to 100 in steps of 10.';
    }
  }
  const { dependents } = input;
  if (
    dependents.childrenUnder18 < 0 ||
    dependents.childrenOver18InSchool < 0 ||
    dependents.childrenUnder18 > 20 ||
    dependents.childrenOver18InSchool > 20
  ) {
    errors.dependents = 'Dependent counts must be from 0 to 20.';
  }
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateVaDisability(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate a VA rating from these entries.' },
      result: null,
    };
  }
  return { isValid: true, errors, result };
}
