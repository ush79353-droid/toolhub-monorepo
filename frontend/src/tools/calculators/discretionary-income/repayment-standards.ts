/**
 * Named calculation standards for student-loan discretionary income.
 * These encode published formula parameters; availability labels are informational
 * and must not be treated as a live ED enrollment API.
 */
export type MaritalStatus =
  | 'single'
  | 'marriedFilingJointly'
  | 'marriedFilingSeparately';

export type PlanAvailability = 'limited' | 'historical' | 'illustrative';

export interface RepaymentStandard {
  id: string;
  name: string;
  shortLabel: string;
  /** Poverty protection multiplier k (e.g. 1.5 = 150%). */
  protectionMultiplier: number;
  /** Share of discretionary income assessed annually (e.g. 0.10 = 10%). */
  assessmentRate: number;
  /** Include spouse AGI when filing separately. */
  includeSpouseIncomeWhenMfs: boolean;
  /** Include spouse in family size when filing separately. */
  includeSpouseInFamilySizeWhenMfs: boolean;
  availability: PlanAvailability;
  regulatoryBasis: string;
  effectiveLabel: string;
  notes: string;
}

export const REPAYMENT_STANDARDS: readonly RepaymentStandard[] = [
  {
    id: 'ibr-new-10',
    name: 'IBR (new borrower) — 10% of DI over 150% FPL',
    shortLabel: 'IBR 10% / 150%',
    protectionMultiplier: 1.5,
    assessmentRate: 0.1,
    includeSpouseIncomeWhenMfs: false,
    includeSpouseInFamilySizeWhenMfs: false,
    availability: 'limited',
    regulatoryBasis: 'Income-Based Repayment (newer borrower cohort formula)',
    effectiveLabel: 'Formula parameters as commonly published for IBR 10%',
    notes:
      'Enrollment and eligibility depend on loan vintage and ED rules. This tool applies the published DI and payment-rate parameters only.',
  },
  {
    id: 'ibr-old-15',
    name: 'IBR (original) — 15% of DI over 150% FPL',
    shortLabel: 'IBR 15% / 150%',
    protectionMultiplier: 1.5,
    assessmentRate: 0.15,
    includeSpouseIncomeWhenMfs: false,
    includeSpouseInFamilySizeWhenMfs: false,
    availability: 'limited',
    regulatoryBasis: 'Original Income-Based Repayment formula',
    effectiveLabel: 'Formula parameters as commonly published for IBR 15%',
    notes:
      'Not all borrowers qualify for every IBR cohort. Verify with your servicer.',
  },
  {
    id: 'paye',
    name: 'PAYE — 10% of DI over 150% FPL',
    shortLabel: 'PAYE 10% / 150%',
    protectionMultiplier: 1.5,
    assessmentRate: 0.1,
    includeSpouseIncomeWhenMfs: false,
    includeSpouseInFamilySizeWhenMfs: false,
    availability: 'limited',
    regulatoryBasis: 'Pay As You Earn (PAYE)',
    effectiveLabel: 'Published PAYE discretionary-income / payment-rate parameters',
    notes:
      'PAYE has specific eligibility rules. New enrollments may be limited; confirm current ED status.',
  },
  {
    id: 'icr',
    name: 'ICR — 20% of DI over 100% FPL',
    shortLabel: 'ICR 20% / 100%',
    protectionMultiplier: 1.0,
    assessmentRate: 0.2,
    includeSpouseIncomeWhenMfs: false,
    includeSpouseInFamilySizeWhenMfs: false,
    availability: 'limited',
    regulatoryBasis: 'Income-Contingent Repayment (ICR)',
    effectiveLabel: 'Published ICR discretionary-income / payment-rate parameters',
    notes:
      'ICR uses 100% of the poverty guideline as the protection threshold in the standard DI definition used here.',
  },
  {
    id: 'save-225',
    name: 'SAVE-style — 10% of DI over 225% FPL (illustrative)',
    shortLabel: 'SAVE-style 10% / 225%',
    protectionMultiplier: 2.25,
    assessmentRate: 0.1,
    includeSpouseIncomeWhenMfs: true,
    includeSpouseInFamilySizeWhenMfs: true,
    availability: 'historical',
    regulatoryBasis:
      'SAVE / REPAYE-family formula parameters (225% protection; spouse income often counted)',
    effectiveLabel: 'Illustrative SAVE-style parameters — verify current ED status',
    notes:
      'SAVE has been subject to litigation and administrative changes. This option shows the published 225% / assessment-rate math only and is labeled historical/illustrative — not a guarantee of current plan availability.',
  },
] as const;

export function getRepaymentStandard(id: string): RepaymentStandard | null {
  return REPAYMENT_STANDARDS.find((p) => p.id === id) ?? null;
}

export function computeFamilySize(
  maritalStatus: MaritalStatus,
  dependents: number,
  standard: RepaymentStandard
): number {
  const dep = Math.max(0, Math.floor(dependents));
  if (maritalStatus === 'single') return 1 + dep;
  if (maritalStatus === 'marriedFilingJointly') return 2 + dep;
  // MFS
  const spouse = standard.includeSpouseInFamilySizeWhenMfs ? 1 : 0;
  return 1 + spouse + dep;
}

export function resolveApplicableAgi(
  maritalStatus: MaritalStatus,
  borrowerAgi: number,
  spouseAgi: number,
  standard: RepaymentStandard
): { applicableAgi: number; includesSpouseIncome: boolean } {
  if (maritalStatus === 'single') {
    return { applicableAgi: borrowerAgi, includesSpouseIncome: false };
  }
  if (maritalStatus === 'marriedFilingJointly') {
    return {
      applicableAgi: borrowerAgi + spouseAgi,
      includesSpouseIncome: true,
    };
  }
  // MFS
  if (standard.includeSpouseIncomeWhenMfs) {
    return {
      applicableAgi: borrowerAgi + spouseAgi,
      includesSpouseIncome: true,
    };
  }
  return { applicableAgi: borrowerAgi, includesSpouseIncome: false };
}
