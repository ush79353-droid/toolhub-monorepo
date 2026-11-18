/**
 * Validation module for the historical EIDL Emergency Advance information tool.
 * Since this tool contains no interactive financial calculation inputs, validation trivially succeeds.
 */
export function validateEidlInput(): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  return {
    isValid: true,
    errors: {},
  };
}
