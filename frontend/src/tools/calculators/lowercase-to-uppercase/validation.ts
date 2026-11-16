import { UPPERCASE_SOFT_MAX } from './types';

export function validateUppercaseInput(raw: string): {
  text: string;
  warning?: string;
} {
  if (raw.length <= UPPERCASE_SOFT_MAX) {
    return { text: raw };
  }
  return {
    text: raw,
    warning:
      'Very long text may feel slower in the browser. Conversion still runs on the full input.',
  };
}
