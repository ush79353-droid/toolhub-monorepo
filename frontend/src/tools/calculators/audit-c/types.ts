/** AUDIT-C (Alcohol Use Disorders Identification Test – Consumption). */

export type AuditCSex = 'female' | 'male' | '';

/** Q1 — drinking frequency (0–4). Empty = unanswered (not zero). */
export type AuditCFrequency =
  | ''
  | 'never'
  | 'monthly_or_less'
  | 'two_to_four_month'
  | 'two_to_three_week'
  | 'four_plus_week';

/** Q2 — typical quantity on a drinking day (0–4). */
export type AuditCQuantity =
  | ''
  | 'one_or_two'
  | 'three_or_four'
  | 'five_or_six'
  | 'seven_to_nine'
  | 'ten_plus';

/** Q3 — frequency of 6+ drinks (0–4). */
export type AuditCBinge =
  | ''
  | 'never'
  | 'less_than_monthly'
  | 'monthly'
  | 'weekly'
  | 'daily_or_almost';

export type AuditCScreenBand = 'negative' | 'positive';

export interface AuditCInput {
  sex: AuditCSex;
  frequency: AuditCFrequency;
  quantity: AuditCQuantity;
  binge: AuditCBinge;
}

export interface AuditCResult {
  score: number | null;
  frequencyPoints: number | null;
  quantityPoints: number | null;
  bingePoints: number | null;
  screenBand: AuditCScreenBand | null;
  threshold: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AuditCFieldErrors = {
  sex?: string;
  frequency?: string;
  quantity?: string;
  binge?: string;
};

export function createDefaultInput(): AuditCInput {
  return {
    sex: '',
    frequency: '',
    quantity: '',
    binge: '',
  };
}

export function createEmptyInput(): AuditCInput {
  return createDefaultInput();
}

export function inputsEqual(a: AuditCInput, b: AuditCInput): boolean {
  return (
    a.sex === b.sex &&
    a.frequency === b.frequency &&
    a.quantity === b.quantity &&
    a.binge === b.binge
  );
}

export const FREQUENCY_OPTIONS: readonly {
  value: Exclude<AuditCFrequency, ''>;
  label: string;
  points: number;
}[] = [
  { value: 'never', label: 'Never', points: 0 },
  { value: 'monthly_or_less', label: 'Monthly or less', points: 1 },
  { value: 'two_to_four_month', label: '2–4 times a month', points: 2 },
  { value: 'two_to_three_week', label: '2–3 times a week', points: 3 },
  { value: 'four_plus_week', label: '4 or more times a week', points: 4 },
];

export const QUANTITY_OPTIONS: readonly {
  value: Exclude<AuditCQuantity, ''>;
  label: string;
  points: number;
}[] = [
  { value: 'one_or_two', label: '1 or 2', points: 0 },
  { value: 'three_or_four', label: '3 or 4', points: 1 },
  { value: 'five_or_six', label: '5 or 6', points: 2 },
  { value: 'seven_to_nine', label: '7 to 9', points: 3 },
  { value: 'ten_plus', label: '10 or more', points: 4 },
];

export const BINGE_OPTIONS: readonly {
  value: Exclude<AuditCBinge, ''>;
  label: string;
  points: number;
}[] = [
  { value: 'never', label: 'Never', points: 0 },
  { value: 'less_than_monthly', label: 'Less than monthly', points: 1 },
  { value: 'monthly', label: 'Monthly', points: 2 },
  { value: 'weekly', label: 'Weekly', points: 3 },
  { value: 'daily_or_almost', label: 'Daily or almost daily', points: 4 },
];
