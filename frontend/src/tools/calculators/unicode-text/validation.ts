/** Soft cap to keep live conversion snappy; input is still accepted beyond this with a notice. */
export const UNICODE_SOFT_MAX = 2000;

export function validateUnicodeInput(raw: string): {
  text: string;
  warning?: string;
} {
  if (raw.length <= UNICODE_SOFT_MAX) {
    return { text: raw };
  }
  return {
    text: raw.slice(0, UNICODE_SOFT_MAX),
    warning: `Input truncated to ${UNICODE_SOFT_MAX} characters for performance.`,
  };
}
