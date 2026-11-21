export type PregnancyMethod =
  | 'dueDate'
  | 'lmp'
  | 'ultrasound'
  | 'conception'
  | 'ivf';

export type IvfEmbryoAge = 'day3' | 'day5';

export interface PregnancyInput {
  method: PregnancyMethod;
  /** Primary date for the selected method (ISO YYYY-MM-DD). */
  primaryDate: string;
  /** Average cycle length (days) for LMP method. */
  cycleDays: string;
  /** Ultrasound gestational age at scan — whole weeks. */
  usWeeks: string;
  /** Ultrasound gestational age at scan — extra days 0–6. */
  usDays: string;
  /** IVF embryo age at transfer. */
  ivfEmbryoAge: IvfEmbryoAge;
  /** Optional “as of” date for gestational age (defaults to today UTC). */
  asOfDate: string;
}

export interface PregnancyMilestone {
  id: string;
  label: string;
  dateIso: string;
  formattedDate: string;
  gestationalLabel: string;
}

export interface PregnancyResult {
  method: PregnancyMethod;
  dueDateIso: string;
  formattedDueDate: string;
  lmpEquivalentIso: string;
  formattedLmpEquivalent: string;
  conceptionApproxIso: string;
  formattedConceptionApprox: string;
  gestationalAgeDays: number;
  gestationalWeeks: number;
  gestationalDaysRemainder: number;
  gestationalLabel: string;
  asOfDateIso: string;
  milestones: PregnancyMilestone[];
  formulaNote: string;
  classificationSource: string;
  disclaimer: string;
}

export type PregnancyFieldErrors = {
  form?: string;
  primaryDate?: string;
  cycleDays?: string;
  usWeeks?: string;
  usDays?: string;
  asOfDate?: string;
};

/** Screenshot sample: Due Date mode · Mar 21, 2027. */
export function createDefaultInput(): PregnancyInput {
  return {
    method: 'dueDate',
    primaryDate: '2027-03-21',
    cycleDays: '28',
    usWeeks: '',
    usDays: '0',
    ivfEmbryoAge: 'day5',
    asOfDate: '',
  };
}

export function createEmptyInput(): PregnancyInput {
  return {
    method: 'dueDate',
    primaryDate: '',
    cycleDays: '28',
    usWeeks: '',
    usDays: '0',
    ivfEmbryoAge: 'day5',
    asOfDate: '',
  };
}

export function inputsEqual(a: PregnancyInput, b: PregnancyInput): boolean {
  return (
    a.method === b.method &&
    a.primaryDate === b.primaryDate &&
    a.cycleDays === b.cycleDays &&
    a.usWeeks === b.usWeeks &&
    a.usDays === b.usDays &&
    a.ivfEmbryoAge === b.ivfEmbryoAge &&
    a.asOfDate === b.asOfDate
  );
}
