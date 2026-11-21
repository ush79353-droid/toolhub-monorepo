/**
 * MPC = ΔC / ΔYd
 * C = a + b·Yd
 * MPS = 1 − MPC
 * k = 1 / (1 − MPC)
 * Break-even Yd = a / (1 − b) when C = Yd
 */

import type { SupportedCurrency } from '@/tools/shared/currency';
import { getCurrencyFractionDigits } from '@/tools/shared/currency';
import type { ConsumptionCurvePoint } from './types';

export function calculateMPC(
  changeInConsumption: number,
  changeInIncome: number
): number | null {
  if (
    !Number.isFinite(changeInConsumption) ||
    !Number.isFinite(changeInIncome) ||
    changeInIncome === 0
  ) {
    return null;
  }
  return changeInConsumption / changeInIncome;
}

export function calculateConsumption(
  autonomousConsumption: number,
  mpc: number,
  disposableIncome: number
): number | null {
  if (
    !Number.isFinite(autonomousConsumption) ||
    !Number.isFinite(mpc) ||
    !Number.isFinite(disposableIncome)
  ) {
    return null;
  }
  return autonomousConsumption + mpc * disposableIncome;
}

export function calculateMPS(mpc: number): number | null {
  return Number.isFinite(mpc) ? 1 - mpc : null;
}

export function calculateSpendingMultiplier(mpc: number): number | null {
  if (!Number.isFinite(mpc) || mpc === 1) return null;
  return 1 / (1 - mpc);
}

export function calculateBreakEvenIncome(
  autonomousConsumption: number,
  mpc: number
): number | null {
  if (!Number.isFinite(autonomousConsumption) || !Number.isFinite(mpc)) {
    return null;
  }
  if (mpc === 1) return null;
  return autonomousConsumption / (1 - mpc);
}

export function generateConsumptionCurve(
  autonomousConsumption: number,
  mpc: number,
  disposableIncome: number
): ConsumptionCurvePoint[] {
  if (
    !Number.isFinite(autonomousConsumption) ||
    !Number.isFinite(mpc) ||
    !Number.isFinite(disposableIncome)
  ) {
    return [];
  }
  const maxY = Math.max(disposableIncome * 1.25, disposableIncome + 10_000, 50_000);
  const step = Math.max(maxY / 8, 1);
  const points: ConsumptionCurvePoint[] = [];
  for (let y = 0; y <= maxY + 1e-9; y += step) {
    const yd = Math.round(y * 100) / 100;
    points.push({
      disposableIncome: yd,
      consumerSpending: autonomousConsumption + mpc * yd,
    });
  }
  // Ensure current income is represented
  const hasCurrent = points.some(
    (p) => Math.abs(p.disposableIncome - disposableIncome) < 1e-6
  );
  if (!hasCurrent) {
    points.push({
      disposableIncome,
      consumerSpending: autonomousConsumption + mpc * disposableIncome,
    });
    points.sort((a, b) => a.disposableIncome - b.disposableIncome);
  }
  return points;
}

export function mpcWarningMessage(mpc: number): string | null {
  if (!Number.isFinite(mpc)) return null;
  if (mpc < 0) {
    return 'Observed MPC is negative: consumption and disposable income moved in opposite directions over this interval. That can occur empirically but sits outside the usual textbook 0–1 assumption.';
  }
  if (mpc > 1) {
    return 'Observed MPC is greater than 1: spending rose more than the measured income change. This is possible over short intervals (credit, wealth effects, timing) but is outside the standard 0–1 textbook range.';
  }
  return null;
}

export function formatMoneyAmount(
  value: number,
  currency: SupportedCurrency
): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatDecimal(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercentFromRatio(value: number, digits = 0): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: Math.max(digits, 2),
  }).format(value * 100)}%`;
}

export interface MpcBundleInput {
  currency: SupportedCurrency;
  changeInDisposableIncome: number | null;
  changeInConsumption: number | null;
  mpc: number;
  autonomousConsumption: number;
  disposableIncome: number;
  mpcFromChanges: boolean;
}

export function buildMpcPresentation(input: MpcBundleInput) {
  const cur = input.currency;
  const mpc = input.mpc;
  const warning = mpcWarningMessage(mpc);
  const spending = calculateConsumption(
    input.autonomousConsumption,
    mpc,
    input.disposableIncome
  );
  const mps = calculateMPS(mpc);
  const multiplier = calculateSpendingMultiplier(mpc);
  const breakEven = calculateBreakEvenIncome(
    input.autonomousConsumption,
    mpc
  );
  const curvePoints = generateConsumptionCurve(
    input.autonomousConsumption,
    mpc,
    input.disposableIncome
  );
  const currentPoint =
    spending != null
      ? {
          disposableIncome: input.disposableIncome,
          consumerSpending: spending,
        }
      : null;

  let multiplierUndefinedReason: string | null = null;
  if (mpc === 1) {
    multiplierUndefinedReason =
      'The simplified spending multiplier is undefined (unbounded) when MPC = 1.';
  } else if (mpc > 1 || mpc < 0) {
    multiplierUndefinedReason =
      multiplier == null
        ? null
        : 'Multiplier formula applied outside the usual 0≤MPC<1 teaching range — interpret cautiously.';
  }

  let breakEvenUndefinedReason: string | null = null;
  if (mpc === 1) {
    breakEvenUndefinedReason =
      input.autonomousConsumption === 0
        ? 'When MPC = 1 and autonomous consumption is 0, C = Yd for all incomes (no unique break-even).'
        : 'When MPC = 1, C = a + Yd never equals Yd for a ≠ 0; no finite break-even.';
  }

  const interpretation =
    `An MPC of ${formatDecimal(mpc)} means that consumer spending changes by approximately ${formatMoneyAmount(mpc, cur)} for each ${formatMoneyAmount(1, cur)} change in disposable income over the interval measured.`;

  const explanation =
    'Linear consumption function C = a + b·Yd is a teaching model. Autonomous consumption is the intercept when Yd = 0 — not a claim that every household spends that amount with zero income. The Keynesian multiplier k = 1/(1−MPC) ignores taxes, imports, crowding out, and other leakages.';

  const steps: string[] = [];
  if (
    input.mpcFromChanges &&
    input.changeInDisposableIncome != null &&
    input.changeInConsumption != null
  ) {
    steps.push(
      `Identify income change ΔYd = ${formatMoneyAmount(input.changeInDisposableIncome, cur)}.`
    );
    steps.push(
      `Identify consumption change ΔC = ${formatMoneyAmount(input.changeInConsumption, cur)}.`
    );
    steps.push(
      `MPC = ΔC / ΔYd = ${formatMoneyAmount(input.changeInConsumption, cur)} / ${formatMoneyAmount(input.changeInDisposableIncome, cur)} = ${formatDecimal(mpc)}.`
    );
  } else {
    steps.push(`MPC entered directly as ${formatDecimal(mpc)}.`);
  }
  steps.push(
    `Autonomous consumption a = ${formatMoneyAmount(input.autonomousConsumption, cur)}.`
  );
  if (spending != null) {
    steps.push(
      `Consumer spending C = a + MPC×Yd = ${formatMoneyAmount(input.autonomousConsumption, cur)} + (${formatDecimal(mpc)} × ${formatMoneyAmount(input.disposableIncome, cur)}) = ${formatMoneyAmount(spending, cur)}.`
    );
  }
  if (mps != null) {
    steps.push(`MPS = 1 − MPC = ${formatDecimal(mps)}.`);
  }
  if (multiplier != null) {
    steps.push(
      `Theoretical spending multiplier k = 1/(1−MPC) = ${formatDecimal(multiplier)}.`
    );
  } else if (multiplierUndefinedReason) {
    steps.push(multiplierUndefinedReason);
  }
  if (breakEven != null) {
    steps.push(
      `Break-even disposable income (C = Yd) = a/(1−MPC) = ${formatMoneyAmount(breakEven, cur)}.`
    );
  } else if (breakEvenUndefinedReason) {
    steps.push(breakEvenUndefinedReason);
  }

  return {
    mpc,
    mpcPercent: mpc * 100,
    mpcWarning: warning,
    consumerSpending: spending,
    mps,
    mpsPercent: mps != null ? mps * 100 : null,
    spendingMultiplier: multiplier,
    multiplierUndefinedReason,
    breakEvenIncome: breakEven,
    breakEvenUndefinedReason,
    formattedDeltaYd:
      input.changeInDisposableIncome != null
        ? formatMoneyAmount(input.changeInDisposableIncome, cur)
        : '—',
    formattedDeltaC:
      input.changeInConsumption != null
        ? formatMoneyAmount(input.changeInConsumption, cur)
        : '—',
    formattedMpc: formatDecimal(mpc),
    formattedMpcPercent: formatPercentFromRatio(mpc),
    formattedAutonomous: formatMoneyAmount(input.autonomousConsumption, cur),
    formattedDisposableIncome: formatMoneyAmount(input.disposableIncome, cur),
    formattedConsumerSpending:
      spending != null ? formatMoneyAmount(spending, cur) : '—',
    formattedMps: mps != null ? formatDecimal(mps) : '—',
    formattedMultiplier:
      multiplier != null ? formatDecimal(multiplier) : 'Undefined',
    formattedBreakEven:
      breakEven != null ? formatMoneyAmount(breakEven, cur) : '—',
    interpretation,
    explanation,
    formulaBreakdown:
      'MPC = ΔC/ΔYd · C = a + MPC×Yd · MPS = 1−MPC · k = 1/(1−MPC)',
    steps,
    curvePoints,
    currentPoint,
  };
}
