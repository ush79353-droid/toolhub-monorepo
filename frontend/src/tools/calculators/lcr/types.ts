export interface LcrInput {
  highQualityLiquidAssets: string;
  netCashOutflows30Days: string;
  /** HQLA helper (optional, collapsed by default) */
  level1Assets: string;
  level2AAssets: string;
  level2B25Assets: string;
  level2B50Assets: string;
  totalCashOutflows: string;
  totalCashInflows: string;
}

export interface LcrResult {
  hqla: number;
  netCashOutflows: number;
  lcrPercent: number;
  coverageMultiple: number;
  liquidityDifference: number;
  requiredHqla: number;
  additionalHqlaNeeded: number;
  status: 'above' | 'equal' | 'below';
  formattedHqla: string;
  formattedOutflows: string;
  formattedLcr: string;
  formattedMultiple: string;
  formattedDifference: string;
  formattedRequired: string;
  formattedAdditional: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  steps: string[];
  hqlaHelper: HqlaHelperResult | null;
  netOutflowsHelper: NetOutflowsHelperResult | null;
}

export interface HqlaHelperResult {
  preliminary: number;
  afterCaps: number;
  level2ShareOfAdjusted: number;
  level2BShareOfAdjusted: number;
  cappedByLevel2: boolean;
  cappedByLevel2B: boolean;
  formattedPreliminary: string;
  formattedAfterCaps: string;
  note: string;
}

export interface NetOutflowsHelperResult {
  totalOutflows: number;
  totalInflows: number;
  cappedInflows: number;
  netOutflows: number;
  formattedNet: string;
  note: string;
}

export type LcrFieldErrors = {
  form?: string;
  highQualityLiquidAssets?: string;
  netCashOutflows30Days?: string;
  level1Assets?: string;
  level2AAssets?: string;
  level2B25Assets?: string;
  level2B50Assets?: string;
  totalCashOutflows?: string;
  totalCashInflows?: string;
};

export function createDefaultInput(): LcrInput {
  return {
    highQualityLiquidAssets: '',
    netCashOutflows30Days: '',
    level1Assets: '',
    level2AAssets: '',
    level2B25Assets: '',
    level2B50Assets: '',
    totalCashOutflows: '',
    totalCashInflows: '',
  };
}

export function createEmptyInput(): LcrInput {
  return createDefaultInput();
}

/** Screenshot teaching example — not a regulatory filing. */
export function createExampleInput(): LcrInput {
  return {
    highQualityLiquidAssets: '1750000',
    netCashOutflows30Days: '1500000',
    level1Assets: '',
    level2AAssets: '',
    level2B25Assets: '',
    level2B50Assets: '',
    totalCashOutflows: '',
    totalCashInflows: '',
  };
}

export function createHqlaHelperExampleInput(): LcrInput {
  return {
    highQualityLiquidAssets: '',
    netCashOutflows30Days: '1500000',
    level1Assets: '1000000',
    level2AAssets: '500000',
    level2B25Assets: '200000',
    level2B50Assets: '100000',
    totalCashOutflows: '',
    totalCashInflows: '',
  };
}
