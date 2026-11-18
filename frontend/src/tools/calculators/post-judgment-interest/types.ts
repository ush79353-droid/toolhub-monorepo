export interface PostJudgmentInterestInput {
  judgmentAmount: string;
  interestRatePercent: string;
  judgmentDate: string;
  writDate: string;
}

export interface PostJudgmentInterestResult {
  elapsedDays: number;
  weeks: number;
  leftoverDays: number;
  accumulatedInterest: number;
  formattedAccumulatedInterest: string;
  formattedWeeks: string;
  formattedLeftoverDays: string;
}

export type PostJudgmentInterestFieldErrors = {
  judgmentAmount?: string;
  interestRatePercent?: string;
  judgmentDate?: string;
  writDate?: string;
  form?: string;
};

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): PostJudgmentInterestInput {
  const today = todayIsoDate();
  return {
    judgmentAmount: '10000',
    interestRatePercent: '5',
    judgmentDate: today,
    writDate: today,
  };
}
