export interface NsfrInput {
  availableStableFunding: string;
  requiredStableFunding: string;
  /** ASF helper (optional) */
  regulatoryCapital: string;
  stableDeposits: string;
  lessStableDeposits: string;
  funding50Percent: string;
  funding0Percent: string;
  /** RSF helper (optional) */
  cashAndCentralBankReserves: string;
  unencumberedLevel1Hqla: string;
  shortTermFinancialInstitution: string;
  level2AHqla: string;
  level2BAndShortTerm: string;
  residentialMortgages: string;
  otherPerformingLoans: string;
  highRsfAssets: string;
  offBalanceSheetCommitments: string;
}

export interface AsfHelperLine {
  label: string;
  amount: number;
  factor: number;
  weighted: number;
  formattedAmount: string;
  formattedWeighted: string;
}

export interface AsfHelperResult {
  lines: AsfHelperLine[];
  unweightedTotal: number;
  weightedTotal: number;
  formattedUnweighted: string;
  formattedWeighted: string;
  note: string;
}

export interface RsfHelperResult {
  lines: AsfHelperLine[];
  unweightedTotal: number;
  weightedTotal: number;
  formattedUnweighted: string;
  formattedWeighted: string;
  note: string;
}

export interface FundingSensitivityRow {
  label: string;
  asf: number;
  rsf: number;
  nsfrPercent: number | null;
  formattedNsfr: string;
}

export interface NsfrResult {
  asf: number;
  rsf: number;
  nsfrPercent: number;
  coverageMultiple: number;
  fundingGap: number;
  shortfallTo100: number;
  surplusAbove100: number;
  status: 'above' | 'equal' | 'below';
  formattedAsf: string;
  formattedRsf: string;
  formattedNsfr: string;
  formattedMultiple: string;
  formattedGap: string;
  formattedShortfall: string;
  formattedSurplus: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  steps: string[];
  asfHelper: AsfHelperResult | null;
  rsfHelper: RsfHelperResult | null;
  sensitivity: FundingSensitivityRow[];
}

export type NsfrFieldErrors = {
  form?: string;
  availableStableFunding?: string;
  requiredStableFunding?: string;
  regulatoryCapital?: string;
  stableDeposits?: string;
  lessStableDeposits?: string;
  funding50Percent?: string;
  funding0Percent?: string;
  cashAndCentralBankReserves?: string;
  unencumberedLevel1Hqla?: string;
  shortTermFinancialInstitution?: string;
  level2AHqla?: string;
  level2BAndShortTerm?: string;
  residentialMortgages?: string;
  otherPerformingLoans?: string;
  highRsfAssets?: string;
  offBalanceSheetCommitments?: string;
};

export function createDefaultInput(): NsfrInput {
  return {
    availableStableFunding: '',
    requiredStableFunding: '',
    regulatoryCapital: '',
    stableDeposits: '',
    lessStableDeposits: '',
    funding50Percent: '',
    funding0Percent: '',
    cashAndCentralBankReserves: '',
    unencumberedLevel1Hqla: '',
    shortTermFinancialInstitution: '',
    level2AHqla: '',
    level2BAndShortTerm: '',
    residentialMortgages: '',
    otherPerformingLoans: '',
    highRsfAssets: '',
    offBalanceSheetCommitments: '',
  };
}

export function createEmptyInput(): NsfrInput {
  return createDefaultInput();
}

/** Teaching example — not a regulatory filing. */
export function createExampleInput(): NsfrInput {
  return {
    availableStableFunding: '170000000',
    requiredStableFunding: '150000000',
    regulatoryCapital: '',
    stableDeposits: '',
    lessStableDeposits: '',
    funding50Percent: '',
    funding0Percent: '',
    cashAndCentralBankReserves: '',
    unencumberedLevel1Hqla: '',
    shortTermFinancialInstitution: '',
    level2AHqla: '',
    level2BAndShortTerm: '',
    residentialMortgages: '',
    otherPerformingLoans: '',
    highRsfAssets: '',
    offBalanceSheetCommitments: '',
  };
}

export function createAsfHelperExampleInput(): NsfrInput {
  return {
    availableStableFunding: '',
    requiredStableFunding: '150000000',
    regulatoryCapital: '10000000',
    stableDeposits: '15000000',
    lessStableDeposits: '20000000',
    funding50Percent: '17000000',
    funding0Percent: '5000000',
    cashAndCentralBankReserves: '',
    unencumberedLevel1Hqla: '',
    shortTermFinancialInstitution: '',
    level2AHqla: '',
    level2BAndShortTerm: '',
    residentialMortgages: '',
    otherPerformingLoans: '',
    highRsfAssets: '',
    offBalanceSheetCommitments: '',
  };
}
