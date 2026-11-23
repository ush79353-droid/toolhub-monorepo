/**
 * Pearl Index Calculator — screenshot UI + classic contraceptive failure rate.
 *
 * Blank women, duration (months default), pregnancies → Pearl index.
 * Equal full follow-up: woman-years = women × months / 12;
 * Pearl = 100 × pregnancies / woman-years (pregnancies per 100 woman-years).
 */

export type DurationUnit = 'months' | 'years';

export interface PearlIndexInput {
  womenText: string;
  durationText: string;
  durationUnit: DurationUnit;
  pregnanciesText: string;
}

export interface PearlIndexResult {
  pearlIndex: number | null;
  womanYears: number | null;
  womanMonths: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type PearlIndexFieldErrors = {
  womenText?: string;
  durationText?: string;
  pregnanciesText?: string;
};

export function createDefaultInput(): PearlIndexInput {
  return {
    womenText: '',
    durationText: '',
    durationUnit: 'months',
    pregnanciesText: '',
  };
}

export function createEmptyInput(): PearlIndexInput {
  return createDefaultInput();
}

export function inputsEqual(a: PearlIndexInput, b: PearlIndexInput): boolean {
  return (
    a.womenText === b.womenText &&
    a.durationText === b.durationText &&
    a.durationUnit === b.durationUnit &&
    a.pregnanciesText === b.pregnanciesText
  );
}
