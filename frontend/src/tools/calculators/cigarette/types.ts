/** Cigarette exposure count — screenshot-first (ADR-023). */

export type TimeFrameUnit = 'years' | 'months';

/** Which rate field the user last edited — keeps cigs/day ↔ packs/day in sync. */
export type RateDriver = 'cigarettes' | 'packs';

export interface CigaretteInput {
  cigarettesPerDayText: string;
  cigarettesInPackText: string;
  packsPerDayText: string;
  timeFrameText: string;
  timeFrameUnit: TimeFrameUnit;
  rateDriver: RateDriver;
}

export interface CigaretteResult {
  cigarettesPerDay: number | null;
  packsPerDay: number | null;
  packSize: number | null;
  days: number | null;
  totalCigarettes: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type CigaretteFieldErrors = {
  cigarettesPerDayText?: string;
  cigarettesInPackText?: string;
  packsPerDayText?: string;
  timeFrameText?: string;
};

export function createDefaultInput(): CigaretteInput {
  return {
    cigarettesPerDayText: '',
    cigarettesInPackText: '20',
    packsPerDayText: '',
    timeFrameText: '',
    timeFrameUnit: 'years',
    rateDriver: 'cigarettes',
  };
}

export function createEmptyInput(): CigaretteInput {
  return createDefaultInput();
}

export function inputsEqual(a: CigaretteInput, b: CigaretteInput): boolean {
  return (
    a.cigarettesPerDayText === b.cigarettesPerDayText &&
    a.cigarettesInPackText === b.cigarettesInPackText &&
    a.packsPerDayText === b.packsPerDayText &&
    a.timeFrameText === b.timeFrameText &&
    a.timeFrameUnit === b.timeFrameUnit &&
    a.rateDriver === b.rateDriver
  );
}
