/**
 * Validation for the historical COVID student loan repayment notice.
 * No interactive financial inputs exist, so validation trivially succeeds.
 */
export function validateStudentLoanRepaymentCovidInput(): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  return {
    isValid: true,
    errors: {},
  };
}
