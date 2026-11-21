import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  FUTURES_CONTRACT_OPTIONS,
  type FuturesContractId,
  type TradingDirection,
} from '../margin-call/types';

export type { FuturesContractId, TradingDirection };
export { FUTURES_CONTRACT_OPTIONS };

export interface FuturesContractsInput {
  tradingDirection: TradingDirection;
  futuresContract: FuturesContractId;
  /** Money value of one minimum tick (editable; contract selector sets ticks/point). */
  tickValue: string;
  tickValueCurrency: SupportedCurrency;
  ticksPerPoint: string;
  pointValueCurrency: SupportedCurrency;
  buyingPrice: string;
  sellingPrice: string;
  numberOfContracts: string;
  profitLossCurrency: SupportedCurrency;
}

export interface FuturesContractsResult {
  tradingDirection: TradingDirection;
  contractLabel: string;
  tickValueCanonical: number;
  ticksPerPoint: number;
  pointValueCanonical: number;
  pointValueDisplayed: number;
  numberOfPoints: number;
  profitLossCanonical: number;
  profitLossDisplayed: number;
  numberOfContracts: number;
  tickValueCurrency: SupportedCurrency;
  pointValueCurrency: SupportedCurrency;
  profitLossCurrency: SupportedCurrency;
  formattedTickValue: string;
  formattedPointValue: string;
  formattedNumberOfPoints: string;
  formattedProfitLoss: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type FuturesContractsFieldErrors = {
  form?: string;
  tickValue?: string;
  ticksPerPoint?: string;
  buyingPrice?: string;
  sellingPrice?: string;
  numberOfContracts?: string;
};

export function createDefaultInput(): FuturesContractsInput {
  const mes = FUTURES_CONTRACT_OPTIONS.find((o) => o.id === 'mes');
  return {
    tradingDirection: 'long',
    futuresContract: 'mes',
    tickValue: '',
    tickValueCurrency: 'PKR',
    ticksPerPoint: String(mes?.ticksPerPoint ?? 4),
    pointValueCurrency: 'PKR',
    buyingPrice: '',
    sellingPrice: '',
    numberOfContracts: '',
    profitLossCurrency: 'PKR',
  };
}

export function createEmptyInput(): FuturesContractsInput {
  return createDefaultInput();
}

/**
 * Worked example (illustrative PKR tick money, not a live CME quote):
 * Long · MES · tick 1.25 · 4 ticks/pt · buy 4500 · sell 4510 · 2 contracts
 * → points 10 · point value 5 · long P/L 100.
 */
export function createExampleInput(): FuturesContractsInput {
  return {
    tradingDirection: 'long',
    futuresContract: 'mes',
    tickValue: '1.25',
    tickValueCurrency: 'PKR',
    ticksPerPoint: '4',
    pointValueCurrency: 'PKR',
    buyingPrice: '4500',
    sellingPrice: '4510',
    numberOfContracts: '2',
    profitLossCurrency: 'PKR',
  };
}
