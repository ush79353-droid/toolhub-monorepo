export type DurationUnit = 'months' | 'years';

export interface MonthOverMonthInput {
  month1: string;
  month2: string;
  cmgrInitial: string;
  cmgrFinal: string;
  cmgrDuration: string;
  cmgrDurationUnit: DurationUnit;
  qoqPrevious: string;
  qoqCurrent: string;
  yoyPrevious: string;
  yoyCurrent: string;
}

export interface PeriodChangeResult {
  percent: number;
  formatted: string;
  status: 'valid' | 'zeroBaseline' | 'indeterminate' | 'negativeBaseline';
  warning: string | null;
  interpretation: string;
}

export interface CmgrResult {
  cmgrPercent: number;
  months: number;
  formatted: string;
  interpretation: string;
  warning: string | null;
}

export interface MonthOverMonthResult {
  mom: PeriodChangeResult | null;
  cmgr: CmgrResult | null;
  qoq: PeriodChangeResult | null;
  yoy: PeriodChangeResult | null;
}

export type MonthOverMonthFieldErrors = {
  month1?: string;
  month2?: string;
  cmgrInitial?: string;
  cmgrFinal?: string;
  cmgrDuration?: string;
  qoqPrevious?: string;
  qoqCurrent?: string;
  yoyPrevious?: string;
  yoyCurrent?: string;
  form?: string;
};

export function createDefaultInput(): MonthOverMonthInput {
  return {
    month1: '',
    month2: '',
    cmgrInitial: '',
    cmgrFinal: '',
    cmgrDuration: '',
    cmgrDurationUnit: 'months',
    qoqPrevious: '',
    qoqCurrent: '',
    yoyPrevious: '',
    yoyCurrent: '',
  };
}
