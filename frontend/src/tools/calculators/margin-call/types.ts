import type { SupportedCurrency } from '@/tools/shared/currency';

export type TradingDirection = 'long' | 'short';

export type FuturesContractId =
  | 'es'
  | 'mes'
  | 'nq'
  | 'ym'
  | 'cl'
  | 'gc'
  | 'custom';

export const FUTURES_CONTRACT_OPTIONS: readonly {
  id: FuturesContractId;
  label: string;
  /** Contract tick-size semantics only — not a live price or margin schedule. */
  ticksPerPoint: number;
}[] = [
  { id: 'es', label: 'E-Mini S&P 500', ticksPerPoint: 4 },
  { id: 'mes', label: 'Micro E-Mini S&P 500', ticksPerPoint: 4 },
  { id: 'nq', label: 'E-Mini Nasdaq-100', ticksPerPoint: 4 },
  { id: 'ym', label: 'E-Mini Dow', ticksPerPoint: 1 },
  { id: 'cl', label: 'Crude Oil', ticksPerPoint: 100 },
  { id: 'gc', label: 'Gold', ticksPerPoint: 10 },
  { id: 'custom', label: 'Custom contract', ticksPerPoint: 4 },
];

export interface MarginCallInput {
  initialDeposit: string;
  initialDepositCurrency: SupportedCurrency;
  initialMarginPerContract: string;
  initialMarginCurrency: SupportedCurrency;
  maintenanceMarginPerContract: string;
  maintenanceMarginCurrency: SupportedCurrency;
  numberOfContracts: string;
  tradingDirection: TradingDirection;
  futuresContract: FuturesContractId;
  tickValue: string;
  tickValueCurrency: SupportedCurrency;
  ticksPerPoint: string;
  pointValueCurrency: SupportedCurrency;
  buyingPrice: string;
  sellingPrice: string;
  profitLossCurrency: SupportedCurrency;
}

export interface MarginCallResult {
  pointValueInTickCurrency: number;
  pointValueDisplayed: number;
  numberOfPoints: number;
  longProfitLossInAccountCurrency: number;
  shortProfitLossInAccountCurrency: number;
  activeProfitLossInAccountCurrency: number;
  activeProfitLossDisplayed: number;
  totalInitialMarginInAccountCurrency: number;
  totalMaintenanceMarginInAccountCurrency: number;
  accountEquityInAccountCurrency: number;
  marginExcessInAccountCurrency: number;
  isMarginCall: boolean;
  accountCurrency: SupportedCurrency;
  tickCurrency: SupportedCurrency;
  pointValueCurrency: SupportedCurrency;
  profitLossCurrency: SupportedCurrency;
  formattedPointValue: string;
  formattedNumberOfPoints: string;
  formattedProfitLoss: string;
  formattedTotalInitialMargin: string;
  formattedTotalMaintenanceMargin: string;
  formattedAccountEquity: string;
  formattedMarginExcess: string;
}

export type MarginCallFieldErrors = {
  initialDeposit?: string;
  initialMarginPerContract?: string;
  maintenanceMarginPerContract?: string;
  numberOfContracts?: string;
  tickValue?: string;
  ticksPerPoint?: string;
  buyingPrice?: string;
  sellingPrice?: string;
  form?: string;
};

export function createDefaultInput(): MarginCallInput {
  return {
    initialDeposit: '',
    initialDepositCurrency: 'PKR',
    initialMarginPerContract: '',
    initialMarginCurrency: 'PKR',
    maintenanceMarginPerContract: '',
    maintenanceMarginCurrency: 'PKR',
    numberOfContracts: '',
    tradingDirection: 'long',
    futuresContract: 'es',
    tickValue: '3459.70',
    tickValueCurrency: 'PKR',
    ticksPerPoint: '4',
    pointValueCurrency: 'PKR',
    buyingPrice: '',
    sellingPrice: '',
    profitLossCurrency: 'PKR',
  };
}
