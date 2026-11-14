export type CalculateAverageMode = 'no' | 'yes';

export interface TurnoverRateInput {
  calculateAverage: CalculateAverageMode;
  employeesAtStart: string;
  employeesAtEnd: string;
  averageEmployees: string;
  employeesWhoLeft: string;
}

export interface TurnoverRateResult {
  averageEmployees: number;
  turnoverRatePercent: number;
  formattedRate: string;
  formattedAverage: string;
}

export type TurnoverRateFieldErrors = {
  employeesAtStart?: string;
  employeesAtEnd?: string;
  averageEmployees?: string;
  employeesWhoLeft?: string;
  general?: string;
};
