export type ConceptionMethod = 'dueDate' | 'lmp' | 'ultrasound';

export interface PregnancyConceptionInput {
  method: ConceptionMethod;
  /** ISO YYYY-MM-DD — due date mode. Sample screenshot: 2027-03-21. */
  dueDate: string;
  /** ISO YYYY-MM-DD — LMP first day. */
  lmpDate: string;
  /** Average cycle length (LMP). Default 28. */
  cycleDays: string;
  /** ISO YYYY-MM-DD — ultrasound exam date. */
  ultrasoundDate: string;
  /** Gestational age weeks at ultrasound. */
  ultrasoundWeeks: string;
  /** Gestational age extra days at ultrasound (0–6). */
  ultrasoundDays: string;
}

export interface PregnancyConceptionResult {
  method: ConceptionMethod;
  dueDateIso: string;
  conceptionIso: string;
  intercourseFromIso: string;
  intercourseToIso: string;
  formattedDueDate: string;
  formattedConception: string;
  formattedIntercourseRange: string;
  notes: string[];
  disclaimer: string;
}

export type PregnancyConceptionFieldErrors = {
  form?: string;
  dueDate?: string;
  lmpDate?: string;
  cycleDays?: string;
  ultrasoundDate?: string;
  ultrasoundWeeks?: string;
  ultrasoundDays?: string;
};

export const DEFAULT_CYCLE_DAYS = 28;

/** Screenshot sample due date (Mar 21, 2027). */
export function createDefaultInput(): PregnancyConceptionInput {
  return {
    method: 'dueDate',
    dueDate: '2027-03-21',
    lmpDate: '',
    cycleDays: String(DEFAULT_CYCLE_DAYS),
    ultrasoundDate: '',
    ultrasoundWeeks: '',
    ultrasoundDays: '0',
  };
}

export function createEmptyInput(): PregnancyConceptionInput {
  return {
    method: 'dueDate',
    dueDate: '',
    lmpDate: '',
    cycleDays: String(DEFAULT_CYCLE_DAYS),
    ultrasoundDate: '',
    ultrasoundWeeks: '',
    ultrasoundDays: '0',
  };
}

export function inputsEqual(
  a: PregnancyConceptionInput,
  b: PregnancyConceptionInput,
): boolean {
  return (
    a.method === b.method &&
    a.dueDate === b.dueDate &&
    a.lmpDate === b.lmpDate &&
    a.cycleDays === b.cycleDays &&
    a.ultrasoundDate === b.ultrasoundDate &&
    a.ultrasoundWeeks === b.ultrasoundWeeks &&
    a.ultrasoundDays === b.ultrasoundDays
  );
}
