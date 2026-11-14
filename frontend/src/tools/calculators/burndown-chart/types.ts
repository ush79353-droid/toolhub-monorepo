export interface BurndownChartInput {
  sprintDuration: number;
  totalStoryPoints: number;
  /** Points burned on each working day, length === sprintDuration */
  dailyBurn: number[];
}

export interface BurndownPoint {
  day: number;
  idealRemaining: number;
  /** null when this day is not yet on the actual series */
  actualRemaining: number | null;
}

export interface BurndownChartResult {
  totalBurned: number;
  remainingPoints: number;
  points: BurndownPoint[];
  /** Last day included on the actual burndown line (0 = start only) */
  actualThroughDay: number;
}

export type BurndownChartFieldErrors = {
  sprintDuration?: string;
  totalStoryPoints?: string;
  dailyBurn?: string;
  form?: string;
};

/** ponytail: 60-day ceiling keeps the day list usable; raise if longer sprints are needed */
export const MAX_SPRINT_DAYS = 60;
export const DEFAULT_SPRINT_DAYS = 10;
