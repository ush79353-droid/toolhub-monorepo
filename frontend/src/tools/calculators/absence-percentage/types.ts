export interface AbsencePercentageInput {
  totalEmployees: number;
  totalWorkdays: number;
  totalDaysAbsent: number;
}

export interface AbsencePercentageResult {
  totalEmployees: number;
  totalWorkdays: number;
  totalDaysAbsent: number;
  availableEmployeeWorkdays: number;
  absenteeismRate: number;
  rateDisplay: string;
  summaryLine: string;
}

export type AbsencePercentageField =
  | 'totalEmployees'
  | 'totalWorkdays'
  | 'totalDaysAbsent';

export type AbsencePercentageFieldErrors = Partial<Record<AbsencePercentageField, string>>;
