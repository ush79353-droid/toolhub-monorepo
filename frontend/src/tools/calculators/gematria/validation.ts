import { MAX_GEMATRIA_INPUT_LENGTH } from './types';

export function normalizeGematriaInput(raw: string): {
  value: string;
  blank: boolean;
  error?: string;
  truncated: boolean;
} {
  if (raw.trim() === '') {
    return { value: '', blank: true, truncated: false };
  }

  let truncated = false;
  let value = raw;
  if (value.length > MAX_GEMATRIA_INPUT_LENGTH) {
    value = value.slice(0, MAX_GEMATRIA_INPUT_LENGTH);
    truncated = true;
  }

  return {
    value,
    blank: value.trim() === '',
    truncated,
    error: truncated
      ? `Input limited to ${MAX_GEMATRIA_INPUT_LENGTH} characters.`
      : undefined,
  };
}
