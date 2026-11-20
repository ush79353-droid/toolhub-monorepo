export type TrendDirection = 'uptrend' | 'downtrend';
export type FibonacciLevelType = 'retracement' | 'extension';

export interface FibonacciInput {
  lowPrice: string;
  highPrice: string;
  trend: TrendDirection;
  levelType: FibonacciLevelType;
}

export interface FibonacciLevel {
  ratio: number;
  percentageLabel: string;
  price: number;
  formattedPrice: string;
}

export interface FibonacciResult {
  priceDifference: number;
  formattedDifference: string;
  levels: FibonacciLevel[];
  hasNegativeLevel: boolean;
  interpretation: string;
  warningMessage: string | null;
}

export type FibonacciFieldErrors = {
  form?: string;
  lowPrice?: string;
  highPrice?: string;
};

/** Defaults: 100 → 200 uptrend retracement */
export function createDefaultInput(): FibonacciInput {
  return {
    lowPrice: '100',
    highPrice: '200',
    trend: 'uptrend',
    levelType: 'retracement',
  };
}

export function createEmptyInput(): FibonacciInput {
  return {
    lowPrice: '',
    highPrice: '',
    trend: 'uptrend',
    levelType: 'retracement',
  };
}
