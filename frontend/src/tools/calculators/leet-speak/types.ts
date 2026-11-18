export type TranslationDirection = 'text-to-leet' | 'leet-to-text';

/** Basic = A/E/O/S/T only. Classic = full default table (tool default). */
export type LeetProfile = 'basic' | 'classic';

export const LEET_SOFT_MAX = 100_000;
export const SHARE_PREVIEW_MAX = 1_500;

export const DIRECTION_OPTIONS: readonly {
  id: TranslationDirection;
  label: string;
}[] = [
  { id: 'text-to-leet', label: 'From normal text to leet' },
  { id: 'leet-to-text', label: 'From leet to normal text' },
];

export const PROFILE_OPTIONS: readonly {
  id: LeetProfile;
  label: string;
  hint: string;
}[] = [
  {
    id: 'classic',
    label: 'Classic leet',
    hint: 'A B E G I L O S T Z → 4 8 3 6 1 1 0 5 7 2',
  },
  {
    id: 'basic',
    label: 'Basic leet',
    hint: 'A E O S T → 4 3 0 5 7 (I and L unchanged)',
  },
];
