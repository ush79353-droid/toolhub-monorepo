/**
 * Quick Ratio (Acid-Test) Calculator — pure engine (ADR-018).
 *
 * Direct:  QR = (C + MS + AR) / CL
 * Adjusted: QR = (CA − I − PE − O) / CL
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { QuickRatioInput, QuickRatioResult } from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateQuickRatio(inputs: {
  cashAndCashEquivalents: number;
  marketableSecurities: number;
  accountsReceivable: number;
  currentLiabilities: number;
}): { quickAssets: number; currentLiabilities: number; quickRatio: number } | null {
  const {
    cashAndCashEquivalents,
    marketableSecurities,
    accountsReceivable,
    currentLiabilities,
  } = inputs;
  const values = [
    cashAndCashEquivalents,
    marketableSecurities,
    accountsReceivable,
    currentLiabilities,
  ];
  if (!values.every(Number.isFinite)) return null;
  if (values.some((v) => v < 0)) return null;
  if (currentLiabilities <= 0) return null;

  const quickAssets =
    cashAndCashEquivalents + marketableSecurities + accountsReceivable;
  const quickRatio = quickAssets / currentLiabilities;
  if (!Number.isFinite(quickAssets) || !Number.isFinite(quickRatio)) {
    return null;
  }
  return { quickAssets, currentLiabilities, quickRatio };
}

export function calculateAdjustedQuickRatio(inputs: {
  currentAssets: number;
  inventory: number;
  prepaidExpenses: number;
  otherNonQuickAssets: number;
  currentLiabilities: number;
}): { quickAssets: number; quickRatio: number } | null {
  const {
    currentAssets,
    inventory,
    prepaidExpenses,
    otherNonQuickAssets,
    currentLiabilities,
  } = inputs;
  const values = [
    currentAssets,
    inventory,
    prepaidExpenses,
    otherNonQuickAssets,
    currentLiabilities,
  ];
  if (!values.every(Number.isFinite)) return null;
  if (values.some((v) => v < 0) || currentLiabilities <= 0) return null;

  const excluded = inventory + prepaidExpenses + otherNonQuickAssets;
  if (excluded > currentAssets) return null;

  const quickAssets = currentAssets - excluded;
  const quickRatio = quickAssets / currentLiabilities;
  if (!Number.isFinite(quickAssets) || !Number.isFinite(quickRatio)) {
    return null;
  }
  return { quickAssets, quickRatio };
}

export function calculateRequiredQuickAssets(
  targetQr: number,
  currentLiabilities: number,
): number | null {
  if (
    !Number.isFinite(targetQr) ||
    !Number.isFinite(currentLiabilities) ||
    targetQr < 0 ||
    currentLiabilities <= 0
  ) {
    return null;
  }
  const qa = targetQr * currentLiabilities;
  return Number.isFinite(qa) ? qa : null;
}

export function calculateCurrentLiabilitiesFromQr(
  quickAssets: number,
  targetQr: number,
): number | null {
  if (
    !Number.isFinite(quickAssets) ||
    !Number.isFinite(targetQr) ||
    quickAssets < 0 ||
    targetQr <= 0
  ) {
    return null;
  }
  const cl = quickAssets / targetQr;
  return Number.isFinite(cl) ? cl : null;
}

export function calculateRequiredCash(
  targetQr: number,
  currentLiabilities: number,
  marketableSecurities: number,
  accountsReceivable: number,
): number | null {
  if (
    !Number.isFinite(targetQr) ||
    !Number.isFinite(currentLiabilities) ||
    !Number.isFinite(marketableSecurities) ||
    !Number.isFinite(accountsReceivable) ||
    targetQr < 0 ||
    currentLiabilities <= 0 ||
    marketableSecurities < 0 ||
    accountsReceivable < 0
  ) {
    return null;
  }
  const required = targetQr * currentLiabilities - marketableSecurities - accountsReceivable;
  return Number.isFinite(required) ? required : null;
}

function fmtRatio(n: number): string {
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}x`;
}

function band(qr: number): QuickRatioResult['band'] {
  if (qr < 1) return 'below';
  if (Math.abs(qr - 1) < 1e-9) return 'equal';
  return 'above';
}

export function calculateQuickRatioFromInput(
  input: QuickRatioInput,
): QuickRatioResult | null {
  const { currency, method, solveTarget } = input;

  if (solveTarget === 'requiredQuickAssets') {
    const target = num(input.targetQuickRatio);
    const cl = num(input.currentLiabilities);
    if (target == null || cl == null) return null;
    const qa = calculateRequiredQuickAssets(target, cl);
    if (qa === null) return null;
    return build({
      method,
      solveTarget,
      currency,
      cash: 0,
      ms: 0,
      ar: 0,
      quickAssets: qa,
      currentLiabilities: cl,
      quickRatio: target,
      requiredCash: null,
      note: 'reverse-qa',
    });
  }

  if (solveTarget === 'currentLiabilities') {
    const target = num(input.targetQuickRatio);
    let qa: number;
    if (method === 'direct') {
      const cash = num(input.cashAndCashEquivalents);
      const ms = num(input.marketableSecurities);
      const ar = num(input.accountsReceivable);
      if (cash == null || ms == null || ar == null || target == null) return null;
      if (cash < 0 || ms < 0 || ar < 0) return null;
      qa = cash + ms + ar;
    } else {
      const ca = num(input.currentAssets);
      const inv = num(input.inventory);
      const pe = num(input.prepaidExpenses);
      const oth = num(input.otherNonQuickAssets);
      if (
        ca == null ||
        inv == null ||
        pe == null ||
        oth == null ||
        target == null
      ) {
        return null;
      }
      if (ca < 0 || inv < 0 || pe < 0 || oth < 0) return null;
      const excluded = inv + pe + oth;
      if (excluded > ca) return null;
      qa = ca - excluded;
    }
    const cl = calculateCurrentLiabilitiesFromQr(qa, target);
    if (cl === null) return null;
    return build({
      method,
      solveTarget,
      currency,
      cash: num(input.cashAndCashEquivalents) ?? 0,
      ms: num(input.marketableSecurities) ?? 0,
      ar: num(input.accountsReceivable) ?? 0,
      quickAssets: qa,
      currentLiabilities: cl,
      quickRatio: target,
      requiredCash: null,
      note: 'reverse-cl',
    });
  }

  if (solveTarget === 'requiredCash') {
    const target = num(input.targetQuickRatio);
    const cl = num(input.currentLiabilities);
    const ms = num(input.marketableSecurities);
    const ar = num(input.accountsReceivable);
    if (target == null || cl == null || ms == null || ar == null) return null;
    const cashNeeded = calculateRequiredCash(target, cl, ms, ar);
    if (cashNeeded === null) return null;
    const qa = target * cl;
    return build({
      method: 'direct',
      solveTarget,
      currency,
      cash: Math.max(0, cashNeeded),
      ms,
      ar,
      quickAssets: qa,
      currentLiabilities: cl,
      quickRatio: target,
      requiredCash: cashNeeded,
      note: 'reverse-cash',
    });
  }

  // Forward: calculate quick ratio
  if (method === 'adjusted') {
    const ca = num(input.currentAssets);
    const inv = num(input.inventory);
    const pe = num(input.prepaidExpenses);
    const oth = num(input.otherNonQuickAssets);
    const cl = num(input.currentLiabilities);
    if (
      ca == null ||
      inv == null ||
      pe == null ||
      oth == null ||
      cl == null
    ) {
      return null;
    }
    const adj = calculateAdjustedQuickRatio({
      currentAssets: ca,
      inventory: inv,
      prepaidExpenses: pe,
      otherNonQuickAssets: oth,
      currentLiabilities: cl,
    });
    if (!adj) return null;
    return build({
      method,
      solveTarget: 'quickRatio',
      currency,
      cash: 0,
      ms: 0,
      ar: 0,
      quickAssets: adj.quickAssets,
      currentLiabilities: cl,
      quickRatio: adj.quickRatio,
      requiredCash: null,
      note: 'adjusted',
      adjustedParts: { ca, inv, pe, oth },
    });
  }

  const cash = num(input.cashAndCashEquivalents);
  const ms = num(input.marketableSecurities);
  const ar = num(input.accountsReceivable);
  const cl = num(input.currentLiabilities);
  if (cash == null || ms == null || ar == null || cl == null) return null;
  const calc = calculateQuickRatio({
    cashAndCashEquivalents: cash,
    marketableSecurities: ms,
    accountsReceivable: ar,
    currentLiabilities: cl,
  });
  if (!calc) return null;
  return build({
    method: 'direct',
    solveTarget: 'quickRatio',
    currency,
    cash,
    ms,
    ar,
    quickAssets: calc.quickAssets,
    currentLiabilities: calc.currentLiabilities,
    quickRatio: calc.quickRatio,
    requiredCash: null,
    note: 'direct',
  });
}

function build(args: {
  method: QuickRatioResult['method'];
  solveTarget: QuickRatioResult['solveTarget'];
  currency: QuickRatioInput['currency'];
  cash: number;
  ms: number;
  ar: number;
  quickAssets: number;
  currentLiabilities: number;
  quickRatio: number;
  requiredCash: number | null;
  note: string;
  adjustedParts?: {
    ca: number;
    inv: number;
    pe: number;
    oth: number;
  };
}): QuickRatioResult {
  const {
    method,
    solveTarget,
    currency,
    cash,
    ms,
    ar,
    quickAssets,
    currentLiabilities,
    quickRatio,
    requiredCash,
    note,
    adjustedParts,
  } = args;

  let formulaBreakdown: string;
  let steps: string[];

  if (note === 'adjusted' && adjustedParts) {
    formulaBreakdown = [
      'Quick Assets = Current Assets − Inventory − Prepaid − Other non-quick',
      `= ${formatCurrencyValue(adjustedParts.ca, currency)} − ${formatCurrencyValue(adjustedParts.inv, currency)} − ${formatCurrencyValue(adjustedParts.pe, currency)} − ${formatCurrencyValue(adjustedParts.oth, currency)}`,
      `= ${formatCurrencyValue(quickAssets, currency)}`,
      '',
      `Quick Ratio = Quick Assets ÷ Current Liabilities`,
      `= ${formatCurrencyValue(quickAssets, currency)} ÷ ${formatCurrencyValue(currentLiabilities, currency)}`,
      `= ${fmtRatio(quickRatio)}`,
    ].join('\n');
    steps = [
      `Quick assets (adjusted) = ${formatCurrencyValue(quickAssets, currency)}`,
      `Current liabilities = ${formatCurrencyValue(currentLiabilities, currency)}`,
      `QR = ${fmtRatio(quickRatio)}`,
    ];
  } else if (note === 'reverse-cash') {
    formulaBreakdown = [
      'Required Cash = (Target QR × CL) − MS − AR',
      `= (${quickRatio} × ${formatCurrencyValue(currentLiabilities, currency)}) − ${formatCurrencyValue(ms, currency)} − ${formatCurrencyValue(ar, currency)}`,
      requiredCash != null && requiredCash < 0
        ? `= ${formatCurrencyValue(requiredCash, currency)} (negative means MS+AR already exceed the target quick-asset need — no additional cash required)`
        : `= ${formatCurrencyValue(Math.max(0, requiredCash ?? 0), currency)}`,
    ].join('\n');
    steps = [
      `Target QR = ${fmtRatio(quickRatio)}`,
      `Required quick assets = ${formatCurrencyValue(quickAssets, currency)}`,
      requiredCash != null && requiredCash < 0
        ? 'Existing securities and receivables already cover the target; required cash holding is not negative cash.'
        : `Required cash = ${formatCurrencyValue(Math.max(0, requiredCash ?? 0), currency)}`,
    ];
  } else if (note === 'reverse-qa') {
    formulaBreakdown = [
      'Required Quick Assets = Target QR × Current Liabilities',
      `= ${quickRatio} × ${formatCurrencyValue(currentLiabilities, currency)}`,
      `= ${formatCurrencyValue(quickAssets, currency)}`,
    ].join('\n');
    steps = [
      `Target QR = ${fmtRatio(quickRatio)}`,
      `CL = ${formatCurrencyValue(currentLiabilities, currency)}`,
      `Required QA = ${formatCurrencyValue(quickAssets, currency)}`,
    ];
  } else if (note === 'reverse-cl') {
    formulaBreakdown = [
      'Current Liabilities = Quick Assets ÷ Target QR',
      `= ${formatCurrencyValue(quickAssets, currency)} ÷ ${quickRatio}`,
      `= ${formatCurrencyValue(currentLiabilities, currency)}`,
    ].join('\n');
    steps = [
      `QA = ${formatCurrencyValue(quickAssets, currency)}`,
      `Target QR = ${fmtRatio(quickRatio)}`,
      `CL = ${formatCurrencyValue(currentLiabilities, currency)}`,
    ];
  } else {
    formulaBreakdown = [
      'Quick Assets = Cash + Marketable Securities + Accounts Receivable',
      `= ${formatCurrencyValue(cash, currency)} + ${formatCurrencyValue(ms, currency)} + ${formatCurrencyValue(ar, currency)}`,
      `= ${formatCurrencyValue(quickAssets, currency)}`,
      '',
      'Quick Ratio = Quick Assets ÷ Current Liabilities',
      `= ${formatCurrencyValue(quickAssets, currency)} ÷ ${formatCurrencyValue(currentLiabilities, currency)}`,
      `= ${fmtRatio(quickRatio)}`,
    ].join('\n');
    steps = [
      `Quick assets = ${formatCurrencyValue(quickAssets, currency)}`,
      `Current liabilities = ${formatCurrencyValue(currentLiabilities, currency)}`,
      `QR = ${fmtRatio(quickRatio)}`,
    ];
  }

  const b = band(quickRatio);
  const interpretation = `Your company's quick ratio is ${fmtRatio(quickRatio)}. This means it has ${quickRatio.toLocaleString('en-US', { maximumFractionDigits: 2 })} units of quick assets for every 1 unit of current liabilities. A ratio above 1 generally indicates that qualifying quick assets exceed current liabilities, although overall liquidity also depends on asset quality, cash-flow timing, and industry conditions.`;

  return {
    method,
    solveTarget,
    currency,
    cashAndCashEquivalents: cash,
    marketableSecurities: ms,
    accountsReceivable: ar,
    quickAssets,
    currentLiabilities,
    quickRatio,
    requiredCash,
    band: b,
    formattedCash: formatCurrencyValue(cash, currency),
    formattedSecurities: formatCurrencyValue(ms, currency),
    formattedReceivables: formatCurrencyValue(ar, currency),
    formattedQuickAssets: formatCurrencyValue(quickAssets, currency),
    formattedLiabilities: formatCurrencyValue(currentLiabilities, currency),
    formattedQuickRatio: fmtRatio(quickRatio),
    formulaBreakdown,
    steps,
    interpretation,
    explanation:
      'The acid-test (quick) ratio excludes inventory and prepaid expenses from liquidity coverage. It is a point-in-time measure — not a guarantee of solvency — and suitable levels vary by industry and cash-conversion cycle.',
  };
}
