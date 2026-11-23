/** Office BP guideline edition used for category tables. */
export type BpGuideline = 'accAha' | 'escEsh2018';

export interface BloodPressureInput {
  guideline: BpGuideline;
  systolic: string;
  diastolic: string;
}

/** ACC/AHA adult office categories (2017/2025 Table 4 + severe band). */
export type AccAhaCategory =
  | 'normal'
  | 'elevated'
  | 'stage1'
  | 'stage2'
  | 'severe';

/** 2018 joint ESC/ESH office categories (Table 3), incl. graded ISH. */
export type EscEshCategory =
  | 'optimal'
  | 'normal'
  | 'highNormal'
  | 'grade1'
  | 'grade2'
  | 'grade3'
  | 'ishGrade1'
  | 'ishGrade2'
  | 'ishGrade3';

export type BloodPressureCategory = AccAhaCategory | EscEshCategory;

export interface BloodPressureResult {
  guideline: BpGuideline;
  guidelineLabel: string;
  systolicMmHg: number;
  diastolicMmHg: number;
  readingLabel: string;
  categoryId: BloodPressureCategory;
  categoryLabel: string;
  explanation: string;
  contextNote: string;
  disclaimer: string;
  sourceLabel: string;
  inconsistentOrder: boolean;
}

export type BloodPressureFieldErrors = {
  form?: string;
  systolic?: string;
  diastolic?: string;
};

export const GUIDELINE_OPTIONS: readonly {
  value: BpGuideline;
  label: string;
}[] = [
  { value: 'accAha', label: 'American (ACC and AHA)' },
  { value: 'escEsh2018', label: 'European (ESC and ESH)' },
];

/**
 * Screenshot defaults: American guideline selected; both readings blank.
 * Results stay inactive until both mmHg values are valid.
 */
export function createDefaultInput(): BloodPressureInput {
  return {
    guideline: 'accAha',
    systolic: '',
    diastolic: '',
  };
}

export function createEmptyInput(): BloodPressureInput {
  return createDefaultInput();
}

/** Educational fixture: 118/76 → ACC/AHA Normal. */
export function createExampleInput(): BloodPressureInput {
  return {
    guideline: 'accAha',
    systolic: '118',
    diastolic: '76',
  };
}

export function inputsEqual(a: BloodPressureInput, b: BloodPressureInput): boolean {
  return (
    a.guideline === b.guideline &&
    a.systolic === b.systolic &&
    a.diastolic === b.diastolic
  );
}
