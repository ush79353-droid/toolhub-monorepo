/**
 * Illustrative Basel III–style NSFR ASF/RSF factors for education.
 * Not a complete regulatory classification; eligibility, maturity,
 * encumbrance, and jurisdiction rules are omitted.
 */

export const ASF_FACTORS = {
  regulatoryCapital: 1,
  stableDeposits: 0.95,
  lessStableDeposits: 0.9,
  funding50Percent: 0.5,
  funding0Percent: 0,
} as const;

export const RSF_FACTORS = {
  cashAndCentralBankReserves: 0,
  unencumberedLevel1Hqla: 0.05,
  shortTermFinancialInstitution: 0.15,
  level2AHqla: 0.15,
  level2BAndShortTerm: 0.5,
  residentialMortgages: 0.65,
  otherPerformingLoans: 0.85,
  highRsfAssets: 1,
  offBalanceSheetCommitments: 0.05,
} as const;

export type AsfCategoryKey = keyof typeof ASF_FACTORS;
export type RsfCategoryKey = keyof typeof RSF_FACTORS;
