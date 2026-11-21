import { SHARE_PREVIEW_MAX, type LeetProfile, type TranslationDirection } from './types';

/** Classic forward map (I and L both → 1). */
const CLASSIC_FORWARD: Readonly<Record<string, string>> = {
  A: '4',
  B: '8',
  E: '3',
  G: '6',
  I: '1',
  L: '1',
  O: '0',
  S: '5',
  T: '7',
  Z: '2',
};

/** Basic forward map — only A, E, O, S, T. */
const BASIC_FORWARD: Readonly<Record<string, string>> = {
  A: '4',
  E: '3',
  O: '0',
  S: '5',
  T: '7',
};

/**
 * Reverse map (shared). Digit `1` always becomes `I` — never `L`.
 * Reverse decoding is approximate and not lossless.
 */
const REVERSE_MAP: Readonly<Record<string, string>> = {
  '4': 'A',
  '8': 'B',
  '3': 'E',
  '6': 'G',
  '1': 'I',
  '0': 'O',
  '5': 'S',
  '7': 'T',
  '2': 'Z',
};

function forwardMap(profile: LeetProfile): Readonly<Record<string, string>> {
  return profile === 'basic' ? BASIC_FORWARD : CLASSIC_FORWARD;
}

function toLeetChar(char: string, map: Readonly<Record<string, string>>): string {
  const upper = char.toUpperCase();
  const replacement = map[upper];
  return replacement ?? char;
}

function fromLeetChar(char: string): string {
  return REVERSE_MAP[char] ?? char;
}

export function translateLeetSpeak(
  input: string,
  direction: TranslationDirection,
  profile: LeetProfile = 'classic',
): string {
  if (input === '') return '';

  if (direction === 'text-to-leet') {
    const map = forwardMap(profile);
    let out = '';
    for (const char of input) {
      out += toLeetChar(char, map);
    }
    return out;
  }

  let out = '';
  for (const char of input) {
    out += fromLeetChar(char);
  }
  return out;
}

export function shareResultText(
  input: string,
  output: string,
  direction: TranslationDirection,
  profile: LeetProfile,
): string {
  const preview =
    output.length > SHARE_PREVIEW_MAX
      ? `${output.slice(0, SHARE_PREVIEW_MAX)}\n… [truncated for share]`
      : output;
  return [
    'Leet-Speak Translator | Omega Calculators',
    '',
    `Direction: ${direction === 'text-to-leet' ? 'text → leet' : 'leet → text'}`,
    `Profile: ${profile}`,
    direction === 'leet-to-text'
      ? 'Note: reverse mapping is approximate (1 → I, not L).'
      : '',
    '',
    'Translation:',
    preview,
    '',
    'Converted client-side with Omega Calculators',
  ]
    .filter((line, index, arr) => !(line === '' && arr[index - 1] === ''))
    .join('\n');
}
