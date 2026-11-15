import type {
  OperatingAssetTurnoverInput,
  OperatingAssetTurnoverResult,
} from './types';

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

/** Round turnover ratio to a sensible display precision. */
export function roundTurnover(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 10000) / 10000;
}

/**
 * Operating Assets = Cash + AR + Inventory + Prepaid + Fixed Assets
 * Operating Asset Turnover = Sales / Operating Assets
 * Turnover is omitted when sales is blank or operating assets is zero.
 */
export function calculateOperatingAssetTurnover(
  input: OperatingAssetTurnoverInput,
): OperatingAssetTurnoverResult | null {
  const {
    cash,
    accountsReceivable,
    inventory,
    prepaidExpenses,
    fixedAssets,
    sales,
  } = input;

  if (
    cash === null ||
    accountsReceivable === null ||
    inventory === null ||
    prepaidExpenses === null ||
    fixedAssets === null
  ) {
    return null;
  }

  if (
    !Number.isFinite(cash) ||
    !Number.isFinite(accountsReceivable) ||
    !Number.isFinite(inventory) ||
    !Number.isFinite(prepaidExpenses) ||
    !Number.isFinite(fixedAssets)
  ) {
    return null;
  }

  const operatingAssets = roundMoney(
    cash + accountsReceivable + inventory + prepaidExpenses + fixedAssets,
  );
  if (!Number.isFinite(operatingAssets)) return null;

  const salesValue = sales !== null && Number.isFinite(sales) ? sales : null;

  let operatingAssetTurnover: number | null = null;
  if (salesValue !== null && operatingAssets !== 0) {
    const ratio = roundTurnover(salesValue / operatingAssets);
    if (Number.isFinite(ratio)) operatingAssetTurnover = ratio;
  }

  return {
    cash,
    accountsReceivable,
    inventory,
    prepaidExpenses,
    fixedAssets,
    sales: salesValue,
    operatingAssets,
    operatingAssetTurnover,
    currency: input.currency,
  };
}
