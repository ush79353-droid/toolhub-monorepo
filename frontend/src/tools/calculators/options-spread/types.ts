import type { SupportedCurrency } from '@/tools/shared/currency';
import { EQUITY_OPTION_CONTRACT_MULTIPLIER } from '../call-option/types';

export { EQUITY_OPTION_CONTRACT_MULTIPLIER };

export type OptionsSpreadStrategy =
  | 'bull-call'
  | 'bull-put'
  | 'bear-call'
  | 'bear-put';

export interface OptionsSpreadInput {
  strategy: OptionsSpreadStrategy;
  targetPrice: string;
  targetCurrency: SupportedCurrency;
  contracts: string;
  longStrike: string;
  longStrikeCurrency: SupportedCurrency;
  longPremium: string;
  longPremiumCurrency: SupportedCurrency;
  shortStrike: string;
  shortStrikeCurrency: SupportedCurrency;
  shortPremium: string;
  shortPremiumCurrency: SupportedCurrency;
  netSpreadCurrency: SupportedCurrency;
  maxLossCurrency: SupportedCurrency;
  maxProfitCurrency: SupportedCurrency;
  breakevenCurrency: SupportedCurrency;
  potentialProfitCurrency: SupportedCurrency;
}

export type OptionsSpreadNetKind = 'debit' | 'credit';

export interface OptionsSpreadResult {
  strategy: OptionsSpreadStrategy;
  contracts: number;
  contractMultiplier: number;
  /** Canonical calc currency = target currency. */
  calcCurrency: SupportedCurrency;
  targetPrice: number;
  longStrike: number;
  shortStrike: number;
  longPremium: number;
  shortPremium: number;
  /** Signed net per share: debit positive cost, credit positive proceeds. */
  netPerShare: number;
  netKind: OptionsSpreadNetKind;
  netSpreadTotal: number;
  maxLoss: number;
  maxProfit: number;
  breakevenPrice: number;
  potentialProfit: number;
  strikeWidth: number;
  formattedNetSpread: string;
  formattedMaxLoss: string;
  formattedMaxProfit: string;
  formattedBreakeven: string;
  formattedPotentialProfit: string;
  strategyNote: string;
  netSpreadLabel: string;
}

export type OptionsSpreadFieldErrors = {
  form?: string;
  targetPrice?: string;
  contracts?: string;
  longStrike?: string;
  longPremium?: string;
  shortStrike?: string;
  shortPremium?: string;
};

export function strategyNote(strategy: OptionsSpreadStrategy): string {
  switch (strategy) {
    case 'bull-call':
      return 'Purchasing a call with a lower strike price than the short call provides a bullish strategy.';
    case 'bull-put':
      return 'Selling a put with a higher strike than the long put provides a bullish credit spread.';
    case 'bear-call':
      return 'Selling a call with a lower strike than the long call provides a bearish credit spread.';
    case 'bear-put':
      return 'Purchasing a put with a higher strike than the short put provides a bearish debit spread.';
  }
}

export function longLegTitle(strategy: OptionsSpreadStrategy): string {
  switch (strategy) {
    case 'bull-call':
      return 'The call you buy (long call)';
    case 'bull-put':
      return 'The put you buy (long put)';
    case 'bear-call':
      return 'The call you buy (long call)';
    case 'bear-put':
      return 'The put you buy (long put)';
  }
}

export function shortLegTitle(strategy: OptionsSpreadStrategy): string {
  switch (strategy) {
    case 'bull-call':
      return 'The call you sell (short call)';
    case 'bull-put':
      return 'The put you sell (short put)';
    case 'bear-call':
      return 'The call you sell (short call)';
    case 'bear-put':
      return 'The put you sell (short put)';
  }
}

export function longStrikeLabel(strategy: OptionsSpreadStrategy): string {
  switch (strategy) {
    case 'bull-call':
    case 'bear-call':
      return 'Strike price of the call you buy';
    case 'bull-put':
    case 'bear-put':
      return 'Strike price of the put you buy';
  }
}

export function longPremiumLabel(strategy: OptionsSpreadStrategy): string {
  switch (strategy) {
    case 'bull-call':
    case 'bear-call':
      return 'Premium spent for buying the call';
    case 'bull-put':
    case 'bear-put':
      return 'Premium spent for buying the put';
  }
}

export function shortStrikeLabel(strategy: OptionsSpreadStrategy): string {
  switch (strategy) {
    case 'bull-call':
    case 'bear-call':
      return 'Strike price of the call you sell';
    case 'bull-put':
    case 'bear-put':
      return 'Strike price of the put you sell';
  }
}

export function shortPremiumLabel(strategy: OptionsSpreadStrategy): string {
  switch (strategy) {
    case 'bull-call':
    case 'bear-call':
      return 'Premium received for selling the call';
    case 'bull-put':
    case 'bear-put':
      return 'Premium received for selling the put';
  }
}

export function resultsTitle(strategy: OptionsSpreadStrategy): string {
  switch (strategy) {
    case 'bull-call':
      return 'Bull call estimated returns';
    case 'bull-put':
      return 'Bull put estimated returns';
    case 'bear-call':
      return 'Bear call estimated returns';
    case 'bear-put':
      return 'Bear put estimated returns';
  }
}

export function createDefaultInput(): OptionsSpreadInput {
  return {
    strategy: 'bull-call',
    targetPrice: '',
    targetCurrency: 'PKR',
    contracts: '1',
    longStrike: '',
    longStrikeCurrency: 'PKR',
    longPremium: '',
    longPremiumCurrency: 'PKR',
    shortStrike: '',
    shortStrikeCurrency: 'PKR',
    shortPremium: '',
    shortPremiumCurrency: 'PKR',
    netSpreadCurrency: 'PKR',
    maxLossCurrency: 'PKR',
    maxProfitCurrency: 'PKR',
    breakevenCurrency: 'PKR',
    potentialProfitCurrency: 'PKR',
  };
}

export function inputsEqual(a: OptionsSpreadInput, b: OptionsSpreadInput): boolean {
  return (
    a.strategy === b.strategy &&
    a.targetPrice === b.targetPrice &&
    a.targetCurrency === b.targetCurrency &&
    a.contracts === b.contracts &&
    a.longStrike === b.longStrike &&
    a.longStrikeCurrency === b.longStrikeCurrency &&
    a.longPremium === b.longPremium &&
    a.longPremiumCurrency === b.longPremiumCurrency &&
    a.shortStrike === b.shortStrike &&
    a.shortStrikeCurrency === b.shortStrikeCurrency &&
    a.shortPremium === b.shortPremium &&
    a.shortPremiumCurrency === b.shortPremiumCurrency &&
    a.netSpreadCurrency === b.netSpreadCurrency &&
    a.maxLossCurrency === b.maxLossCurrency &&
    a.maxProfitCurrency === b.maxProfitCurrency &&
    a.breakevenCurrency === b.breakevenCurrency &&
    a.potentialProfitCurrency === b.potentialProfitCurrency
  );
}
