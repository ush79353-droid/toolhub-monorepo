import { LEET_SOFT_MAX } from './types';

export function validateLeetInput(raw: string): {
  text: string;
  warning?: string;
} {
  if (raw.length <= LEET_SOFT_MAX) {
    return { text: raw };
  }
  return {
    text: raw,
    warning:
      'Very long text may feel slower in the browser. Translation still runs on the full input.',
  };
}
