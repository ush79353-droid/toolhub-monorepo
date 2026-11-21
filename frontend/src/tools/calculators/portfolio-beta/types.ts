export const MAX_PORTFOLIO_STOCKS = 20;
export const MIN_PORTFOLIO_STOCKS = 1;
/** Absolute tolerance (%) for treating total weight as 100%. */
export const WEIGHT_TOLERANCE_PERCENT = 0.01;

export interface PortfolioStockRow {
  id: string;
  beta: string;
  weight: string;
}

export interface PortfolioBetaInput {
  stocks: PortfolioStockRow[];
}

export interface StockBetaContribution {
  id: string;
  label: string;
  beta: number;
  weightPercent: number;
  weightedBeta: number;
}

export interface PortfolioBetaResult {
  totalWeightPercent: number;
  portfolioBeta: number | null;
  contributions: StockBetaContribution[];
  isFullyAllocated: boolean;
  interpretation: string | null;
  weightMessage: string | null;
  warningMessage: string | null;
  formattedTotalWeight: string;
  formattedPortfolioBeta: string | null;
}

export type PortfolioBetaFieldErrors = {
  form?: string;
  stocks?: Record<string, { beta?: string; weight?: string }>;
};

let stockSeq = 0;

export function createStockId(): string {
  stockSeq += 1;
  return `pb-${Date.now().toString(36)}-${stockSeq}`;
}

export function createStockRow(
  beta = '',
  weight = ''
): PortfolioStockRow {
  return { id: createStockId(), beta, weight };
}

/** Reference: 1.20@50% + 0.80@30% + 1.50@20% → βp = 1.14 */
export function createDefaultInput(): PortfolioBetaInput {
  return {
    stocks: [
      createStockRow('1.20', '50'),
      createStockRow('0.80', '30'),
      createStockRow('1.50', '20'),
    ],
  };
}

export function createEmptyInput(): PortfolioBetaInput {
  return {
    stocks: [createStockRow(), createStockRow(), createStockRow()],
  };
}
