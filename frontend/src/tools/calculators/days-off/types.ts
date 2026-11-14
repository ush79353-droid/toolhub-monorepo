export type DaysOffCountry = 'us' | 'uk' | 'poland';
export type DaysOffContract = 'full-time' | 'part-time' | 'freelance';

export interface DaysOffInput {
  country: DaysOffCountry;
  contract: DaysOffContract;
}

export interface DaysOffSegment {
  text: string;
  emphasis?: boolean;
}

export interface DaysOffResult {
  segments: readonly DaysOffSegment[];
  disclaimer: string;
}

export const DEFAULT_INPUT: DaysOffInput = {
  country: 'us',
  contract: 'full-time',
};

export const COUNTRY_OPTIONS: readonly { value: DaysOffCountry; label: string }[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'poland', label: 'Poland' },
];

export const CONTRACT_OPTIONS: readonly { value: DaysOffContract; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'freelance', label: 'Freelance / Contract' },
];
