export const DISABILITY_RATINGS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

export type DisabilityRating = (typeof DISABILITY_RATINGS)[number];

export type LimbSide = 'none' | 'left-arm' | 'right-arm' | 'left-leg' | 'right-leg';

export type MaritalStatus = 'single' | 'married';

export interface DisabilityCondition {
  id: string;
  rating: DisabilityRating;
  limb: LimbSide;
}

export interface VaDependents {
  maritalStatus: MaritalStatus;
  childrenUnder18: number;
  childrenOver18InSchool: number;
  dependentParents: 0 | 1 | 2;
}

export interface VaDisabilityInput {
  conditions: DisabilityCondition[];
  dependents: VaDependents;
}

export interface VaDisabilityResult {
  ratingsUsed: number[];
  bilateralApplied: boolean;
  bilateralCombined: number | null;
  combinedBeforeRounding: number;
  combinedRating: number;
  monthlyCompensation: number;
  compensationYear: number;
  effectiveDate: string;
  explanation: string;
}

export type VaDisabilityFieldErrors = Partial<Record<'conditions' | 'dependents' | 'form', string>>;

let conditionSeq = 3;

export function nextConditionId(): string {
  conditionSeq += 1;
  return `condition-${conditionSeq}`;
}

export function createDefaultInput(): VaDisabilityInput {
  return {
    conditions: [
      { id: 'condition-1', rating: 0, limb: 'none' },
      { id: 'condition-2', rating: 0, limb: 'none' },
      { id: 'condition-3', rating: 0, limb: 'none' },
    ],
    dependents: {
      maritalStatus: 'single',
      childrenUnder18: 0,
      childrenOver18InSchool: 0,
      dependentParents: 0,
    },
  };
}

export function hasVaDisabilityChanges(input: VaDisabilityInput): boolean {
  const base = createDefaultInput();
  if (input.conditions.length !== base.conditions.length) return true;
  if (
    input.dependents.maritalStatus !== 'single' ||
    input.dependents.childrenUnder18 !== 0 ||
    input.dependents.childrenOver18InSchool !== 0 ||
    input.dependents.dependentParents !== 0
  ) {
    return true;
  }
  return input.conditions.some(
    (condition, index) =>
      condition.rating !== base.conditions[index]?.rating ||
      condition.limb !== 'none',
  );
}
