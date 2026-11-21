/**
 * Futures contract P/L helpers.
 * Reuses verified margin-call point/P/L math (same screenshot conventions).
 */
export {
  calculatePointValue,
  calculatePointsDifference,
  calculatePositionProfitLoss,
  formatMarginCallMoney as formatFuturesMoney,
  formatMarginCallPoints as formatFuturesPoints,
} from '../margin-call/calculation';
