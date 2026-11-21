/**
 * PayPal Fee Calculator — pure engine (ADR-018).
 *
 * Fee = Gross × (P + I) / 100 + F
 * Net = Gross − Fee
 * Reverse: Gross = (Net + F) / (1 − (P+I)/100), then snap to currency minor units
 * so rounded Net ≥ desired net.
 *
 * Currency conversion fees are excluded.
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  PayPalComparisonRow,
  PayPalFeeConfig,
  PayPalFeeInput,
  PayPalFeeResult,
} from './types';
import {
  findPreset,
  resolveFixedFee,
  resolveInternationalRate,
  type PayPalFeePreset,
} from './presets';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function roundMoney(
  amount: number,
  currency: SupportedCurrency,
): number {
  const digits = getCurrencyFractionDigits(currency);
  const f = 10 ** digits;
  return Math.round(amount * f) / f;
}

function money(n: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(roundMoney(n, currency), currency);
}

export function formatPercent(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function calculateEffectiveFeeRate(
  grossAmount: number,
  feeAmount: number,
): number | null {
  if (!Number.isFinite(grossAmount) || !Number.isFinite(feeAmount)) return null;
  if (grossAmount <= 0) return null;
  const rate = (feeAmount / grossAmount) * 100;
  return Number.isFinite(rate) ? rate : null;
}

export function calculatePayPalFee(
  amount: number,
  config: PayPalFeeConfig,
): {
  grossAmount: number;
  percentageFeeAmount: number;
  additionalFeeAmount: number;
  fixedFeeAmount: number;
  totalFee: number;
  netAmount: number;
  effectiveFeePercentage: number | null;
} | null {
  const { percentageFee, fixedFee, additionalPercentageFee, currency } =
    config;
  if (![amount, percentageFee, fixedFee, additionalPercentageFee].every(Number.isFinite)) {
    return null;
  }
  if (amount < 0 || fixedFee < 0) return null;
  if (percentageFee < 0 || additionalPercentageFee < 0) return null;
  const totalPct = percentageFee + additionalPercentageFee;
  if (totalPct < 0) return null;

  const gross = roundMoney(amount, currency);
  const percentageFeeAmount = roundMoney((gross * percentageFee) / 100, currency);
  const additionalFeeAmount = roundMoney(
    (gross * additionalPercentageFee) / 100,
    currency,
  );
  const fixedFeeAmount = roundMoney(fixedFee, currency);
  const totalFee = roundMoney(
    percentageFeeAmount + additionalFeeAmount + fixedFeeAmount,
    currency,
  );
  const netAmount = roundMoney(gross - totalFee, currency);

  if (![gross, totalFee, netAmount].every(Number.isFinite)) return null;

  return {
    grossAmount: gross,
    percentageFeeAmount,
    additionalFeeAmount,
    fixedFeeAmount,
    totalFee,
    netAmount,
    effectiveFeePercentage: calculateEffectiveFeeRate(gross, totalFee),
  };
}

export function calculateNetAmount(
  grossAmount: number,
  config: PayPalFeeConfig,
): number | null {
  const result = calculatePayPalFee(grossAmount, config);
  return result?.netAmount ?? null;
}

/**
 * Algebraic reverse, then walk up by one minor unit until rounded net ≥ target
 * (handles fee rounding that can leave net slightly short).
 */
export function calculateRequiredGross(
  desiredNetAmount: number,
  config: PayPalFeeConfig,
): number | null {
  const { percentageFee, fixedFee, additionalPercentageFee, currency } =
    config;
  if (
    ![desiredNetAmount, percentageFee, fixedFee, additionalPercentageFee].every(
      Number.isFinite,
    )
  ) {
    return null;
  }
  if (desiredNetAmount < 0 || fixedFee < 0) return null;
  if (percentageFee < 0 || additionalPercentageFee < 0) return null;

  const totalPct = percentageFee + additionalPercentageFee;
  if (totalPct >= 100) return null;

  const denom = 1 - totalPct / 100;
  if (!(denom > 0) || !Number.isFinite(denom)) return null;

  const algebraic = (desiredNetAmount + fixedFee) / denom;
  if (!Number.isFinite(algebraic) || algebraic < 0) return null;

  const digits = getCurrencyFractionDigits(currency);
  const step = 10 ** -digits;
  let gross = roundMoney(algebraic, currency);

  // Ensure after rounding fees, net meets or exceeds desired
  for (let i = 0; i < 50; i++) {
    const fwd = calculatePayPalFee(gross, config);
    if (!fwd) return null;
    if (fwd.netAmount + 1e-9 >= desiredNetAmount) return gross;
    gross = roundMoney(gross + step, currency);
  }
  return null;
}

export function resolveConfigFromInput(
  input: PayPalFeeInput,
): {
  config: PayPalFeeConfig;
  preset: PayPalFeePreset | null;
  scheduleLabel: string;
} | null {
  const isCustom =
    input.region === 'CUSTOM' ||
    input.transactionType === 'custom' ||
    input.presetId === 'custom';
  const preset = isCustom ? null : (findPreset(input.presetId) ?? null);

  let percentageFee: number;
  let fixedFee: number;
  let additionalPercentageFee: number;

  if (isCustom || !preset) {
    const p = num(input.customPercentage);
    const f = num(input.customFixed);
    const a = num(input.customAdditional);
    if (p == null || f == null || a == null) return null;
    percentageFee = p;
    fixedFee = f;
    additionalPercentageFee =
      input.location === 'international' ? a : 0;
  } else {
    percentageFee = preset.percentageFee;
    fixedFee = resolveFixedFee(preset, input.currency, null);
    additionalPercentageFee = resolveInternationalRate(
      preset,
      input.location,
      input.internationalMarket,
      null,
    );
  }

  return {
    config: {
      percentageFee,
      fixedFee,
      additionalPercentageFee,
      currency: input.currency,
    },
    preset,
    scheduleLabel: isCustom
      ? 'Custom user-supplied rates'
      : `${preset!.label} (${preset!.region})`,
  };
}

const COMPARISON_AMOUNTS = [10, 50, 100, 500, 1000];

function buildComparison(
  config: PayPalFeeConfig,
): PayPalComparisonRow[] {
  const rows: PayPalComparisonRow[] = [];
  for (const g of COMPARISON_AMOUNTS) {
    const r = calculatePayPalFee(g, config);
    if (!r) continue;
    rows.push({
      gross: r.grossAmount,
      fee: r.totalFee,
      net: r.netAmount,
      formattedGross: money(r.grossAmount, config.currency),
      formattedFee: money(r.totalFee, config.currency),
      formattedNet: money(r.netAmount, config.currency),
    });
  }
  return rows;
}

export function calculatePayPalFeeFromInput(
  input: PayPalFeeInput,
): PayPalFeeResult | null {
  const resolved = resolveConfigFromInput(input);
  if (!resolved) return null;
  const { config, preset, scheduleLabel } = resolved;
  const { currency } = config;

  let solved:
    | NonNullable<ReturnType<typeof calculatePayPalFee>>
    | null = null;

  if (input.solveMode === 'fromGross') {
    const gross = num(input.grossAmount);
    if (gross == null) return null;
    solved = calculatePayPalFee(gross, config);
  } else {
    const desired = num(input.desiredNet);
    if (desired == null) return null;
    const required = calculateRequiredGross(desired, config);
    if (required == null) return null;
    solved = calculatePayPalFee(required, config);
  }

  if (!solved) return null;

  const {
    grossAmount,
    percentageFeeAmount,
    additionalFeeAmount,
    fixedFeeAmount,
    totalFee,
    netAmount,
    effectiveFeePercentage,
  } = solved;

  const steps =
    input.solveMode === 'fromGross'
      ? [
          `Gross amount = ${money(grossAmount, currency)}`,
          `Percentage fee (${formatPercent(config.percentageFee)}) = ${money(percentageFeeAmount, currency)}`,
          config.additionalPercentageFee > 0
            ? `International add-on (${formatPercent(config.additionalPercentageFee)}) = ${money(additionalFeeAmount, currency)}`
            : 'International add-on = 0 (domestic or none)',
          `Fixed fee = ${money(fixedFeeAmount, currency)}`,
          `Total fee = ${money(totalFee, currency)}`,
          `Net received = ${money(netAmount, currency)}`,
        ]
      : [
          `Desired net = ${money(num(input.desiredNet) ?? netAmount, currency)}`,
          `Required gross ≈ (Net + Fixed) ÷ (1 − total%)`,
          `Gross charged = ${money(grossAmount, currency)}`,
          `Total fee = ${money(totalFee, currency)}`,
          `Net after fees = ${money(netAmount, currency)}`,
        ];

  const formulaBreakdown = [
    'Fee = Gross × (P + I) / 100 + F',
    `P = ${formatPercent(config.percentageFee)}, I = ${formatPercent(config.additionalPercentageFee)}, F = ${money(config.fixedFee, currency)}`,
    `Fee = ${money(grossAmount, currency)} × (${formatPercent(config.percentageFee)} + ${formatPercent(config.additionalPercentageFee)}) / 100 + ${money(config.fixedFee, currency)} = ${money(totalFee, currency)}`,
    `Net = Gross − Fee = ${money(netAmount, currency)}`,
  ].join('\n');

  const interpretation = `With a ${money(grossAmount, currency)} payment and the selected fee of ${formatPercent(config.percentageFee)}${config.additionalPercentageFee > 0 ? ` + ${formatPercent(config.additionalPercentageFee)} international` : ''} plus ${money(config.fixedFee, currency)}, the estimated fee is ${money(totalFee, currency)}, leaving ${money(netAmount, currency)}.`;

  const explanation =
    'Estimates use the selected schedule or custom rates. Actual PayPal fees vary by account, payment method, and policy. Currency conversion fees are excluded from this calculator.';

  return {
    currency,
    solveMode: input.solveMode,
    region: input.region,
    presetId: input.presetId,
    location: input.location,
    percentageFee: config.percentageFee,
    additionalPercentageFee: config.additionalPercentageFee,
    fixedFee: config.fixedFee,
    grossAmount,
    percentageFeeAmount,
    additionalFeeAmount,
    fixedFeeAmount,
    totalFee,
    netAmount,
    effectiveFeePercentage,
    formattedGross: money(grossAmount, currency),
    formattedPercentageFeeAmount: money(percentageFeeAmount, currency),
    formattedAdditionalFeeAmount: money(additionalFeeAmount, currency),
    formattedFixedFeeAmount: money(fixedFeeAmount, currency),
    formattedTotalFee: money(totalFee, currency),
    formattedNet: money(netAmount, currency),
    formattedEffectiveRate:
      effectiveFeePercentage == null
        ? 'N/A'
        : formatPercent(effectiveFeePercentage),
    formattedPercentageRate: formatPercent(config.percentageFee),
    formattedAdditionalRate: formatPercent(config.additionalPercentageFee),
    formattedFixedFee: money(config.fixedFee, currency),
    scheduleLabel,
    scheduleSourceUrl: preset?.sourceUrl ?? null,
    scheduleEffectiveDate: preset?.effectiveDate ?? null,
    verified: preset?.verified ?? false,
    excludesCurrencyConversion: true,
    comparison: buildComparison(config),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}
