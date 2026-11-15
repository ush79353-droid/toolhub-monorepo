export type UnicodeStyle =
  | 'circled'
  | 'negativeCircled'
  | 'squared'
  | 'negativeSquared'
  | 'inverted'
  | 'invertedReversed'
  | 'monospaced';

export type UnicodeConversionResult = Record<UnicodeStyle, string>;

export interface UnicodeStyleMeta {
  id: UnicodeStyle;
  label: string;
  note?: string;
}

export const UNICODE_STYLES: readonly UnicodeStyleMeta[] = [
  { id: 'circled', label: 'Circled' },
  {
    id: 'negativeCircled',
    label: 'Circled (negative)',
    note: 'Uses negative circled Latin capitals; letter case is not preserved visually.',
  },
  {
    id: 'squared',
    label: 'Squared',
    note: 'Uses squared Latin capital letters where Unicode defines them.',
  },
  {
    id: 'negativeSquared',
    label: 'Squared (negative)',
    note: 'Uses negative squared Latin capitals where available.',
  },
  { id: 'inverted', label: 'Inverted' },
  {
    id: 'invertedReversed',
    label: 'Inverted (reversed)',
    note: 'Upside-down substitutions plus grapheme-cluster reversal.',
  },
  { id: 'monospaced', label: 'Monospaced' },
];

export const DEFAULT_INPUT = 'unicode';
