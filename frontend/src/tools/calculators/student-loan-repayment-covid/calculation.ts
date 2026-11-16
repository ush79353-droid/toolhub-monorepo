import type { StudentLoanRepaymentCovidStatus } from './types';

/**
 * Historical metadata for the COVID-era federal student loan payment suspension notice.
 * This tool does not compute loan payments or interest — the referenced relief period has ended.
 */
export function getStudentLoanRepaymentCovidStatus(): StudentLoanRepaymentCovidStatus {
  return {
    isHistorical: true,
    programName: 'COVID-19 federal student loan payment suspension',
    historicalSuspensionEndDate: '2020-12-31',
    legislationName: 'Coronavirus Aid, Relief, and Economic Security (CARES) Act',
  };
}
