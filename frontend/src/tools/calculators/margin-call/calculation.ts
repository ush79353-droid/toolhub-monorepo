import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatMarginCallMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMarginCallPoints(points: number): string {
  if (!Number.isFinite(points)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(points);
}

/** Point Value = Tick Value × Ticks Per Point (same currency as tick value). */
export function calculatePointValue(input: {
  tickValue: number;
  ticksPerPoint: number;
}): number | null {
  const { tickValue, ticksPerPoint } = input;
  if (![tickValue, ticksPerPoint].every(Number.isFinite)) return null;
  if (tickValue < 0 || ticksPerPoint <= 0) return null;
  const pointValue = tickValue * ticksPerPoint;
  return Number.isFinite(pointValue) ? pointValue : null;
}

/** Points Difference = Selling Price − Buying Price. */
export function calculatePointsDifference(input: {
  buyingPrice: number;
  sellingPrice: number;
}): number | null {
  const { buyingPrice, sellingPrice } = input;
  if (![buyingPrice, sellingPrice].every(Number.isFinite)) return null;
  const points = sellingPrice - buyingPrice;
  return Number.isFinite(points) ? points : null;
}

/**
 * Long P/L = Points × Point Value × Contracts
 * Short P/L = −Long P/L
 * All money amounts must already share one account currency.
 */
export function calculatePositionProfitLoss(input: {
  numberOfPoints: number;
  pointValue: number;
  numberOfContracts: number;
}): { longProfitLoss: number; shortProfitLoss: number } | null {
  const { numberOfPoints, pointValue, numberOfContracts } = input;
  if (![numberOfPoints, pointValue, numberOfContracts].every(Number.isFinite)) {
    return null;
  }
  if (numberOfContracts < 0 || pointValue < 0) return null;

  const longProfitLoss = numberOfPoints * pointValue * numberOfContracts;
  if (!Number.isFinite(longProfitLoss)) return null;
  return {
    longProfitLoss,
    shortProfitLoss: -longProfitLoss,
  };
}

/**
 * Futures margin summary in one account currency.
 * Margin call when account equity falls below total maintenance margin
 * (and at least one contract is open with a positive maintenance requirement).
 */
export function calculateMarginSummary(input: {
  initialDeposit: number;
  initialMarginPerContract: number;
  maintenanceMarginPerContract: number;
  numberOfContracts: number;
  activeProfitLoss: number;
}): {
  totalInitialMargin: number;
  totalMaintenanceMargin: number;
  accountEquity: number;
  marginExcess: number;
  isMarginCall: boolean;
} | null {
  const {
    initialDeposit,
    initialMarginPerContract,
    maintenanceMarginPerContract,
    numberOfContracts,
    activeProfitLoss,
  } = input;

  if (
    ![
      initialDeposit,
      initialMarginPerContract,
      maintenanceMarginPerContract,
      numberOfContracts,
      activeProfitLoss,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (
    initialDeposit < 0 ||
    initialMarginPerContract < 0 ||
    maintenanceMarginPerContract < 0 ||
    numberOfContracts < 0
  ) {
    return null;
  }

  const totalInitialMargin = initialMarginPerContract * numberOfContracts;
  const totalMaintenanceMargin =
    maintenanceMarginPerContract * numberOfContracts;
  const accountEquity = initialDeposit + activeProfitLoss;
  const marginExcess = accountEquity - totalMaintenanceMargin;
  const isMarginCall =
    numberOfContracts > 0 &&
    totalMaintenanceMargin > 0 &&
    accountEquity < totalMaintenanceMargin;

  if (
    ![totalInitialMargin, totalMaintenanceMargin, accountEquity, marginExcess].every(
      Number.isFinite
    )
  ) {
    return null;
  }

  return {
    totalInitialMargin,
    totalMaintenanceMargin,
    accountEquity,
    marginExcess,
    isMarginCall,
  };
}
