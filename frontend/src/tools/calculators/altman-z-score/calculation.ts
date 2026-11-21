import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  MODEL_DISCLAIMER,
  RISK_ZONE_LABELS,
  RISK_ZONE_MESSAGES,
  type AltmanRiskZone,
  type AltmanZScoreInput,
  type AltmanZScoreResult,
} from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function roundDisplay(n: number, digits = 3): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function roundRatioDisplay(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export function classifyAltmanZone(zScore: number): AltmanRiskZone {
  if (zScore < 1.81) return 'distress';
  if (zScore <= 2.99) return 'grey';
  return 'safer';
}

export function calculateNetWorkingCapital(input: {
  source: AltmanZScoreInput['workingCapitalSource'];
  currentAssets: number | null;
  currentLiabilities: number | null;
  accountsReceivable: number | null;
  inventory: number | null;
  accountsPayable: number | null;
  workingCapital: number | null;
}): number | null {
  const {
    source,
    currentAssets,
    currentLiabilities,
    accountsReceivable,
    inventory,
    accountsPayable,
    workingCapital,
  } = input;

  if (source === 'direct') {
    return workingCapital;
  }
  if (source === 'balance-sheet') {
    if (currentAssets == null || currentLiabilities == null) return null;
    return currentAssets - currentLiabilities;
  }
  if (
    accountsReceivable == null ||
    inventory == null ||
    accountsPayable == null
  ) {
    return null;
  }
  return accountsReceivable + inventory - accountsPayable;
}

export function calculateMarketValueOfEquity(input: {
  source: AltmanZScoreInput['marketEquitySource'];
  sharesOutstanding: number | null;
  sharePrice: number | null;
  marketValueOfEquity: number | null;
}): number | null {
  if (input.source === 'direct') return input.marketValueOfEquity;
  if (input.sharesOutstanding == null || input.sharePrice == null) return null;
  return input.sharesOutstanding * input.sharePrice;
}

export function calculateRetainedEarnings(input: {
  source: AltmanZScoreInput['retainedEarningsSource'];
  beginningRetainedEarnings: number | null;
  netIncome: number | null;
  dividendPerShare: number | null;
  sharesOutstanding: number | null;
  otherDividends: number | null;
  retainedEarnings: number | null;
}): { retainedEarnings: number | null; totalDividends: number | null } {
  if (input.source === 'direct') {
    return {
      retainedEarnings: input.retainedEarnings,
      totalDividends: null,
    };
  }
  if (
    input.beginningRetainedEarnings == null ||
    input.netIncome == null
  ) {
    return { retainedEarnings: null, totalDividends: null };
  }
  const dps = input.dividendPerShare ?? 0;
  const shares = input.sharesOutstanding ?? 0;
  const other = input.otherDividends ?? 0;
  const totalDividends = dps * shares + other;
  return {
    retainedEarnings:
      input.beginningRetainedEarnings + input.netIncome - totalDividends,
    totalDividends,
  };
}

/**
 * Original Altman Z-Score for publicly traded manufacturing firms:
 * Z = 1.2X1 + 1.4X2 + 3.3X3 + 0.6X4 + 1.0X5
 */
export function calculateAltmanZScoreCore(input: {
  workingCapital: number;
  retainedEarnings: number;
  ebit: number;
  marketValueOfEquity: number;
  totalAssets: number;
  totalLiabilities: number;
  sales: number;
}): {
  zScore: number;
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  x5: number;
  contributions: AltmanZScoreResult['contributions'];
  riskZone: AltmanRiskZone;
} | null {
  const values = Object.values(input);
  if (!values.every(Number.isFinite)) return null;
  if (input.totalAssets <= 0 || input.totalLiabilities <= 0) return null;
  if (input.sales < 0) return null;

  const x1 = input.workingCapital / input.totalAssets;
  const x2 = input.retainedEarnings / input.totalAssets;
  const x3 = input.ebit / input.totalAssets;
  const x4 = input.marketValueOfEquity / input.totalLiabilities;
  const x5 = input.sales / input.totalAssets;

  const contributions = {
    workingCapital: 1.2 * x1,
    retainedEarnings: 1.4 * x2,
    profitability: 3.3 * x3,
    leverage: 0.6 * x4,
    assetTurnover: 1.0 * x5,
  };

  const zScore =
    contributions.workingCapital +
    contributions.retainedEarnings +
    contributions.profitability +
    contributions.leverage +
    contributions.assetTurnover;

  if (!Number.isFinite(zScore)) return null;

  return {
    zScore,
    x1,
    x2,
    x3,
    x4,
    x5,
    contributions,
    riskZone: classifyAltmanZone(zScore),
  };
}

export function calculateAltmanZScore(
  input: AltmanZScoreInput
): AltmanZScoreResult | null {
  const currentAssets = num(input.currentAssets);
  const currentLiabilities = num(input.currentLiabilities);
  const accountsReceivable = num(input.accountsReceivable);
  const inventory = num(input.inventory);
  const accountsPayable = num(input.accountsPayable);
  const workingCapitalDirect = num(input.workingCapital);
  const sharesOutstanding = num(input.sharesOutstanding);
  const sharePrice = num(input.sharePrice);
  const marketValueDirect = num(input.marketValueOfEquity);
  const beginningRetainedEarnings = num(input.beginningRetainedEarnings);
  const netIncome = num(input.netIncome);
  const dividendPerShare = num(input.dividendPerShare);
  const otherDividends = num(input.otherDividends);
  const retainedEarningsDirect = num(input.retainedEarnings);
  const ebit = num(input.ebit);
  const totalAssets = num(input.totalAssets);
  const totalLiabilities = num(input.totalLiabilities);
  const sales = num(input.sales);

  const workingCapital = calculateNetWorkingCapital({
    source: input.workingCapitalSource,
    currentAssets,
    currentLiabilities,
    accountsReceivable,
    inventory,
    accountsPayable,
    workingCapital: workingCapitalDirect,
  });

  const marketValueOfEquity = calculateMarketValueOfEquity({
    source: input.marketEquitySource,
    sharesOutstanding,
    sharePrice,
    marketValueOfEquity: marketValueDirect,
  });

  const reShares =
    input.retainedEarningsSource === 'rollforward'
      ? sharesOutstanding ??
        (input.marketEquitySource === 'shares' ? sharesOutstanding : null)
      : sharesOutstanding;

  const { retainedEarnings, totalDividends } = calculateRetainedEarnings({
    source: input.retainedEarningsSource,
    beginningRetainedEarnings,
    netIncome,
    dividendPerShare,
    sharesOutstanding:
      input.retainedEarningsSource === 'rollforward'
        ? num(input.sharesOutstanding)
        : reShares,
    otherDividends: otherDividends ?? 0,
    retainedEarnings: retainedEarningsDirect,
  });

  if (
    workingCapital == null ||
    marketValueOfEquity == null ||
    retainedEarnings == null ||
    ebit == null ||
    totalAssets == null ||
    totalLiabilities == null ||
    sales == null
  ) {
    return null;
  }

  const core = calculateAltmanZScoreCore({
    workingCapital,
    retainedEarnings,
    ebit,
    marketValueOfEquity,
    totalAssets,
    totalLiabilities,
    sales,
  });
  if (!core) return null;

  const { zScore, x1, x2, x3, x4, x5, contributions, riskZone } = core;
  const currency = input.currency;
  const fmt = (n: number) => formatCurrencyValue(n, currency);

  const steps: string[] = [];
  if (input.workingCapitalSource === 'balance-sheet') {
    steps.push(
      `NWC = Current assets − Current liabilities = ${fmt(workingCapital)}.`
    );
  } else if (input.workingCapitalSource === 'simplified') {
    steps.push(
      `Simplified NWC estimate = AR + Inventory − AP = ${fmt(workingCapital)} (not full CA − CL).`
    );
  } else {
    steps.push(`Working capital (entered) = ${fmt(workingCapital)}.`);
  }

  if (input.marketEquitySource === 'shares') {
    steps.push(
      `MVE = Shares × Price = ${fmt(marketValueOfEquity)} (market capitalization, not book equity).`
    );
  } else {
    steps.push(`Market value of equity (entered) = ${fmt(marketValueOfEquity)}.`);
  }

  if (input.retainedEarningsSource === 'rollforward' && totalDividends != null) {
    steps.push(
      `RE_end = RE_begin + NI − Dividends = ${fmt(retainedEarnings)} (dividends ${fmt(totalDividends)}).`
    );
  } else {
    steps.push(`Retained earnings (entered) = ${fmt(retainedEarnings)}.`);
  }

  steps.push(`X1 = WC / TA = ${roundRatioDisplay(x1)}`);
  steps.push(`X2 = RE / TA = ${roundRatioDisplay(x2)}`);
  steps.push(`X3 = EBIT / TA = ${roundRatioDisplay(x3)}`);
  steps.push(`X4 = MVE / TL = ${roundRatioDisplay(x4)}`);
  steps.push(`X5 = Sales / TA = ${roundRatioDisplay(x5)}`);
  steps.push(
    `Z = 1.2(${roundRatioDisplay(x1)}) + 1.4(${roundRatioDisplay(x2)}) + 3.3(${roundRatioDisplay(x3)}) + 0.6(${roundRatioDisplay(x4)}) + 1.0(${roundRatioDisplay(x5)}) = ${roundDisplay(zScore)}`
  );

  return {
    currency,
    workingCapital,
    marketValueOfEquity,
    retainedEarnings,
    ebit,
    totalAssets,
    totalLiabilities,
    sales,
    totalDividends,
    workingCapitalSource: input.workingCapitalSource,
    marketEquitySource: input.marketEquitySource,
    retainedEarningsSource: input.retainedEarningsSource,
    x1,
    x2,
    x3,
    x4,
    x5,
    contributions,
    zScore,
    riskZone,
    riskLabel: RISK_ZONE_LABELS[riskZone],
    riskMessage: RISK_ZONE_MESSAGES[riskZone],
    formattedZScore: roundDisplay(zScore),
    formattedWorkingCapital: fmt(workingCapital),
    formattedMve: fmt(marketValueOfEquity),
    formattedRetainedEarnings: fmt(retainedEarnings),
    formattedX1: roundRatioDisplay(x1),
    formattedX2: roundRatioDisplay(x2),
    formattedX3: roundRatioDisplay(x3),
    formattedX4: roundRatioDisplay(x4),
    formattedX5: roundRatioDisplay(x5),
    formulaBreakdown:
      'Z = 1.2X1 + 1.4X2 + 3.3X3 + 0.6X4 + 1.0X5\nX1=WC/TA  X2=RE/TA  X3=EBIT/TA  X4=MVE/TL  X5=Sales/TA',
    steps,
    interpretation: RISK_ZONE_MESSAGES[riskZone],
    explanation:
      'Original five-factor Altman Z-Score for publicly traded manufacturing firms. Do not apply these coefficients silently to private or nonmanufacturing firms without an alternative model. Keep sales and EBIT on the same reporting period as the balance-sheet date used for assets and liabilities.',
    disclaimer: MODEL_DISCLAIMER,
  };
}
