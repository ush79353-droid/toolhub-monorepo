/**
 * LGD Calculator — Loss Given Default (ADR-018).
 *
 * LGD_rate = 1 − RR
 * LGD_amount = EAD × LGD_rate
 * Recovery_amount = EAD × RR
 * EL = PD × LGD_rate × EAD  (optional; distinct from LGD amount)
 *
 * UI percentages convert to decimals before math (80% → 0.80).
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { LgdInput, LgdResult } from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function pctToDecimal(pct: number): number {
  return pct / 100;
}

/** Stabilize 1 − rate complements (e.g. 1 − 0.8 → 0.2). */
function complementRate(rate: number): number {
  return Math.round((1 - rate) * 1e12) / 1e12;
}

export function calculateRecoveryRate(
  lossSeverity: number,
): number | null {
  if (
    !Number.isFinite(lossSeverity) ||
    lossSeverity < 0 ||
    lossSeverity > 1
  ) {
    return null;
  }
  return complementRate(lossSeverity);
}

export function calculateLossSeverity(
  recoveryRate: number,
): number | null {
  if (
    !Number.isFinite(recoveryRate) ||
    recoveryRate < 0 ||
    recoveryRate > 1
  ) {
    return null;
  }
  return complementRate(recoveryRate);
}

export function calculateLGD(
  exposureAtDefault: number,
  recoveryRate: number,
): {
  exposureAtDefault: number;
  recoveryRate: number;
  lossSeverity: number;
  recoveryAmount: number;
  lossGivenDefault: number;
} | null {
  if (
    !Number.isFinite(exposureAtDefault) ||
    !Number.isFinite(recoveryRate)
  ) {
    return null;
  }
  if (
    exposureAtDefault < 0 ||
    recoveryRate < 0 ||
    recoveryRate > 1
  ) {
    return null;
  }
  const lossSeverity = complementRate(recoveryRate);
  const recoveryAmount = exposureAtDefault * recoveryRate;
  const lossGivenDefault = exposureAtDefault * lossSeverity;
  if (
    !Number.isFinite(recoveryAmount) ||
    !Number.isFinite(lossGivenDefault)
  ) {
    return null;
  }
  return {
    exposureAtDefault,
    recoveryRate,
    lossSeverity,
    recoveryAmount,
    lossGivenDefault,
  };
}

export function calculateEAD(
  lossGivenDefault: number,
  lossSeverity: number,
): number | null {
  if (
    !Number.isFinite(lossGivenDefault) ||
    !Number.isFinite(lossSeverity) ||
    lossGivenDefault < 0 ||
    lossSeverity <= 0 ||
    lossSeverity > 1
  ) {
    return null;
  }
  const exposure = lossGivenDefault / lossSeverity;
  return Number.isFinite(exposure) ? exposure : null;
}

export function calculateExpectedLoss(
  probabilityOfDefault: number,
  lossSeverity: number,
  exposureAtDefault: number,
): number | null {
  const values = [
    probabilityOfDefault,
    lossSeverity,
    exposureAtDefault,
  ];
  if (!values.every(Number.isFinite)) return null;
  if (
    probabilityOfDefault < 0 ||
    probabilityOfDefault > 1 ||
    lossSeverity < 0 ||
    lossSeverity > 1 ||
    exposureAtDefault < 0
  ) {
    return null;
  }
  const el =
    probabilityOfDefault * lossSeverity * exposureAtDefault;
  return Number.isFinite(el) ? el : null;
}

function fmtPct(decimalRate: number): string {
  return `${(decimalRate * 100).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })}%`;
}

/**
 * Pure LGD engine from UI input. Never returns Infinity/NaN fields.
 */
export function calculateLgdFromInput(
  input: LgdInput,
): LgdResult | null {
  const { currency, mode, rateSource } = input;

  let recoveryRate: number;
  let lossSeverity: number;

  if (rateSource === 'recoveryRate') {
    const rrPct = num(input.recoveryRatePercent);
    if (rrPct == null) return null;
    recoveryRate = pctToDecimal(rrPct);
    const ls = calculateLossSeverity(recoveryRate);
    if (ls === null) return null;
    lossSeverity = ls;
  } else {
    const lsPct = num(input.lossSeverityPercent);
    if (lsPct == null) return null;
    lossSeverity = pctToDecimal(lsPct);
    const rr = calculateRecoveryRate(lossSeverity);
    if (rr === null) return null;
    recoveryRate = rr;
  }

  let exposureAtDefault: number;
  let recoveryAmount: number;
  let lossGivenDefault: number;

  if (mode === 'advanced' && input.advancedSolve === 'eadFromLgd') {
    const lgdAmt = num(input.lossGivenDefaultAmount);
    if (lgdAmt == null) return null;
    const ead = calculateEAD(lgdAmt, lossSeverity);
    if (ead === null) return null;
    exposureAtDefault = ead;
    lossGivenDefault = lgdAmt;
    recoveryAmount = exposureAtDefault * recoveryRate;
  } else if (
    mode === 'advanced' &&
    input.advancedSolve === 'ratesFromAmounts'
  ) {
    const ead = num(input.expectedExposure);
    const recoveryAmt = num(input.recoveryAmount);
    if (ead == null || recoveryAmt == null) return null;
    if (ead < 0 || recoveryAmt < 0) return null;
    if (ead === 0) {
      if (recoveryAmt !== 0) return null;
      exposureAtDefault = 0;
      recoveryAmount = 0;
      lossGivenDefault = 0;
      recoveryRate = 0;
      lossSeverity = 0;
    } else {
      if (recoveryAmt > ead) return null;
      exposureAtDefault = ead;
      recoveryAmount = recoveryAmt;
      lossGivenDefault = ead - recoveryAmt;
      recoveryRate = recoveryAmt / ead;
      lossSeverity = lossGivenDefault / ead;
      if (
        !Number.isFinite(recoveryRate) ||
        !Number.isFinite(lossSeverity) ||
        recoveryRate < 0 ||
        recoveryRate > 1
      ) {
        return null;
      }
    }
  } else {
    const ead = num(input.expectedExposure);
    if (ead == null) return null;
    const calc = calculateLGD(ead, recoveryRate);
    if (!calc) return null;
    exposureAtDefault = calc.exposureAtDefault;
    recoveryAmount = calc.recoveryAmount;
    lossGivenDefault = calc.lossGivenDefault;
    lossSeverity = calc.lossSeverity;
  }

  let expectedLoss: number | null = null;
  let pdDecimal: number | null = null;
  if (mode === 'advanced') {
    const pdPct = num(input.probabilityOfDefaultPercent);
    if (pdPct != null) {
      pdDecimal = pctToDecimal(pdPct);
      expectedLoss = calculateExpectedLoss(
        pdDecimal,
        lossSeverity,
        exposureAtDefault,
      );
    }
  }

  const formulaBreakdown = [
    'Step 1: Loss severity = 100% − Recovery rate',
    `= ${fmtPct(1)} − ${fmtPct(recoveryRate)} = ${fmtPct(lossSeverity)}`,
    '',
    'Step 2: Convert loss severity to decimal',
    `= ${lossSeverity}`,
    '',
    'Step 3: LGD amount = EAD × LGD rate',
    `= ${formatCurrencyValue(exposureAtDefault, currency)} × ${lossSeverity}`,
    `= ${formatCurrencyValue(lossGivenDefault, currency)}`,
    '',
    'Step 4: Recovery amount = EAD × Recovery rate',
    `= ${formatCurrencyValue(exposureAtDefault, currency)} × ${recoveryRate}`,
    `= ${formatCurrencyValue(recoveryAmount, currency)}`,
    expectedLoss != null && pdDecimal != null
      ? [
          '',
          'Optional Expected Loss (≠ LGD amount):',
          'EL = PD × LGD rate × EAD',
          `= ${pdDecimal} × ${lossSeverity} × ${formatCurrencyValue(exposureAtDefault, currency)}`,
          `= ${formatCurrencyValue(expectedLoss, currency)}`,
        ].join('\n')
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  const steps = [
    `Recovery rate = ${fmtPct(recoveryRate)}; loss severity = ${fmtPct(lossSeverity)}`,
    `EAD = ${formatCurrencyValue(exposureAtDefault, currency)}`,
    `LGD amount = ${formatCurrencyValue(lossGivenDefault, currency)} (loss if default occurs)`,
    `Estimated recovery = ${formatCurrencyValue(recoveryAmount, currency)}`,
  ];
  if (expectedLoss != null) {
    steps.push(
      `Expected loss (PD-weighted) = ${formatCurrencyValue(expectedLoss, currency)} — not the same as LGD amount`,
    );
  }

  return {
    mode,
    currency,
    recoveryRate,
    lossSeverity,
    exposureAtDefault,
    recoveryAmount,
    lossGivenDefault,
    expectedLoss,
    pdDecimal,
    pdHorizonLabel: input.pdHorizonLabel,
    formattedRecoveryRate: fmtPct(recoveryRate),
    formattedLossSeverity: fmtPct(lossSeverity),
    formattedExposure: formatCurrencyValue(exposureAtDefault, currency),
    formattedRecoveryAmount: formatCurrencyValue(
      recoveryAmount,
      currency,
    ),
    formattedLgdAmount: formatCurrencyValue(
      lossGivenDefault,
      currency,
    ),
    formattedExpectedLoss:
      expectedLoss != null
        ? formatCurrencyValue(expectedLoss, currency)
        : null,
    formulaBreakdown,
    steps,
    interpretation: `With an exposure at default of ${formatCurrencyValue(exposureAtDefault, currency)} and a recovery rate of ${fmtPct(recoveryRate)}, the estimated loss severity is ${fmtPct(lossSeverity)}. This produces a loss given default of ${formatCurrencyValue(lossGivenDefault, currency)} if default occurs.`,
    explanation:
      expectedLoss != null
        ? `LGD amount is the loss conditional on default. Expected loss (${formatCurrencyValue(expectedLoss, currency)}) is PD × LGD rate × EAD over the stated horizon (${input.pdHorizonLabel}) and is not the same quantity. This is a simplified credit-risk model.`
        : 'LGD amount is the monetary loss if default occurs. It is not probability-weighted expected loss. Add PD in advanced mode to compute EL = PD × LGD × EAD separately.',
  };
}
