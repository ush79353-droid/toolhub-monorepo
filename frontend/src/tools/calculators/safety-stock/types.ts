export interface SafetyStockInput {
  maxDailyUsage: string;
  maxLeadTime: string;
  averageDailyUsage: string;
  averageLeadTime: string;
}

export interface SafetyStockResult {
  maxDailyUsage: number;
  maxLeadTime: number;
  averageDailyUsage: number;
  averageLeadTime: number;
  safetyStock: number;
  reorderPoint: number;
  formattedSafetyStock: string;
  formattedReorderPoint: string;
}

export type SafetyStockFieldErrors = {
  maxDailyUsage?: string;
  maxLeadTime?: string;
  averageDailyUsage?: string;
  averageLeadTime?: string;
  form?: string;
};

export function createDefaultInput(): SafetyStockInput {
  return {
    maxDailyUsage: '',
    maxLeadTime: '',
    averageDailyUsage: '',
    averageLeadTime: '',
  };
}
