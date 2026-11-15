export interface WeekOverWeekInput {
  initialWeek: string;
  followingWeek: string;
}

export interface WeekOverWeekResult {
  initialWeek: number;
  followingWeek: number;
  wowGrowthPercent: number;
  formattedWowGrowth: string;
}

export type WeekOverWeekFieldErrors = {
  initialWeek?: string;
  followingWeek?: string;
  form?: string;
};

export function createDefaultInput(): WeekOverWeekInput {
  return {
    initialWeek: '',
    followingWeek: '',
  };
}
