import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  magnitudeFactor,
  periodUnit,
  type MoneyMagnitude,
  type VelocityOfMoneyInput,
  type VelocityOfMoneyResult,
  type VelocitySolveTarget,
} from './types';

function roundRatio(n: number): number {
  return Math.round(n * 1e10) / 1e10;
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function toBase(display: number, magnitude: MoneyMagnitude): number {
  return display * magnitudeFactor(magnitude);
}

function fromBase(base: number, magnitude: MoneyMagnitude): number {
  return base / magnitudeFactor(magnitude);
}

function fmtMoney(
  base: number,
  currency: VelocityOfMoneyInput['currency'],
  magnitude: MoneyMagnitude
): string {
  const display = fromBase(base, magnitude);
  return formatCurrencyValue(display, currency);
}

function fmtV(v: number): string {
  return v.toLocaleString('en-US', {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  });
}

/**
 * Pure velocity engine: V = nominalFlow / M (and algebraic rearrangements).
 * Never returns Infinity/NaN. Price index alone is never treated as a currency price.
 */
export function calculateVelocityOfMoney(
  input: VelocityOfMoneyInput
): VelocityOfMoneyResult | null {
  const { mode, solveTarget, transactionSource, currency, magnitude, period } =
    input;
  const unit = periodUnit(period);

  // --- Parse helpers for required inputs by target ---
  const moneyDisplay = num(input.moneySupply);
  const velocityIn = num(input.velocity);
  const txnDisplay = num(input.nominalTransactionValue);
  const gdpDisplay = num(input.nominalGdp);
  const priceIndex = num(input.priceIndex);
  const indexBase = num(input.indexBase);
  const basePrice = num(input.basePrice);
  const volume = num(input.volume);

  let numeratorBase: number | null = null;
  let moneyBase: number | null = null;
  let velocity: number | null = null;
  let impliedPrice: number | null = null;
  let resolvedPriceIndex: number | null = null;
  let resolvedVolume: number | null = null;
  let nominalTxnBase: number | null = null;
  let nominalGdpBase: number | null = null;

  const steps: string[] = [];

  if (mode === 'gdp') {
    if (solveTarget === 'priceIndex' || solveTarget === 'volume') {
      return null;
    }

    if (solveTarget === 'velocity') {
      if (
        moneyDisplay == null ||
        moneyDisplay <= 0 ||
        gdpDisplay == null ||
        gdpDisplay < 0
      ) {
        return null;
      }
      moneyBase = toBase(moneyDisplay, magnitude);
      nominalGdpBase = toBase(gdpDisplay, magnitude);
      numeratorBase = nominalGdpBase;
      velocity = roundRatio(numeratorBase / moneyBase);
      steps.push(
        `GDP-based: V = Nominal GDP / M = ${fmtMoney(numeratorBase, currency, magnitude)} / ${fmtMoney(moneyBase, currency, magnitude)} = ${fmtV(velocity)} ${unit}.`
      );
    } else if (solveTarget === 'moneySupply') {
      if (
        velocityIn == null ||
        velocityIn <= 0 ||
        gdpDisplay == null ||
        gdpDisplay < 0
      ) {
        return null;
      }
      velocity = velocityIn;
      nominalGdpBase = toBase(gdpDisplay, magnitude);
      numeratorBase = nominalGdpBase;
      moneyBase = roundMoney(numeratorBase / velocity);
      steps.push(
        `M = GDP / V = ${fmtMoney(numeratorBase, currency, magnitude)} / ${fmtV(velocity)} = ${fmtMoney(moneyBase, currency, magnitude)}.`
      );
    } else if (solveTarget === 'nominalFlow') {
      if (
        moneyDisplay == null ||
        moneyDisplay <= 0 ||
        velocityIn == null ||
        velocityIn < 0
      ) {
        return null;
      }
      moneyBase = toBase(moneyDisplay, magnitude);
      velocity = velocityIn;
      nominalGdpBase = roundMoney(moneyBase * velocity);
      numeratorBase = nominalGdpBase;
      steps.push(
        `Nominal GDP = M × V = ${fmtMoney(moneyBase, currency, magnitude)} × ${fmtV(velocity)} = ${fmtMoney(nominalGdpBase, currency, magnitude)}.`
      );
    } else {
      return null;
    }
  } else {
    // Transaction mode
    const resolveDerivedTxn = (): number | null => {
      if (
        priceIndex == null ||
        priceIndex < 0 ||
        indexBase == null ||
        indexBase <= 0 ||
        basePrice == null ||
        basePrice < 0 ||
        volume == null ||
        volume < 0
      ) {
        return null;
      }
      impliedPrice = roundMoney(basePrice * (priceIndex / indexBase));
      resolvedPriceIndex = priceIndex;
      resolvedVolume = volume;
      const txn = roundMoney(impliedPrice * volume);
      steps.push(
        `Implied price/basket = basePrice × (P / base) = ${formatCurrencyValue(basePrice, currency)} × (${priceIndex}/${indexBase}) = ${formatCurrencyValue(impliedPrice, currency)}.`
      );
      steps.push(
        `T_nominal = price × N = ${formatCurrencyValue(impliedPrice, currency)} × ${volume.toLocaleString('en-US')} = ${formatCurrencyValue(txn, currency)} (in entered units; magnitude applied to money stock separately when comparing).`
      );
      // Derived basket math uses currency units at "units" scale for the product;
      // money stock still uses magnitude. For consistency, treat derived T as
      // already in the same display units as money (user responsibility).
      return toBase(txn, magnitude);
    };

    if (solveTarget === 'velocity') {
      if (moneyDisplay == null || moneyDisplay <= 0) return null;
      moneyBase = toBase(moneyDisplay, magnitude);

      if (transactionSource === 'derived') {
        numeratorBase = resolveDerivedTxn();
        if (numeratorBase == null) return null;
        nominalTxnBase = numeratorBase;
      } else {
        if (txnDisplay == null || txnDisplay < 0) return null;
        numeratorBase = toBase(txnDisplay, magnitude);
        nominalTxnBase = numeratorBase;
        steps.push(
          `Using direct nominal transaction value T = ${fmtMoney(numeratorBase, currency, magnitude)}.`
        );
      }
      velocity = roundRatio(numeratorBase / moneyBase);
      steps.push(
        `V = T_nominal / M = ${fmtMoney(numeratorBase, currency, magnitude)} / ${fmtMoney(moneyBase, currency, magnitude)} = ${fmtV(velocity)} ${unit}.`
      );
    } else if (solveTarget === 'moneySupply') {
      if (velocityIn == null || velocityIn <= 0) return null;
      velocity = velocityIn;

      if (transactionSource === 'derived') {
        numeratorBase = resolveDerivedTxn();
        if (numeratorBase == null) return null;
        nominalTxnBase = numeratorBase;
      } else {
        if (txnDisplay == null || txnDisplay < 0) return null;
        numeratorBase = toBase(txnDisplay, magnitude);
        nominalTxnBase = numeratorBase;
      }
      moneyBase = roundMoney(numeratorBase / velocity);
      steps.push(
        `M = T_nominal / V = ${fmtMoney(numeratorBase, currency, magnitude)} / ${fmtV(velocity)} = ${fmtMoney(moneyBase, currency, magnitude)}.`
      );
    } else if (solveTarget === 'nominalFlow') {
      if (
        moneyDisplay == null ||
        moneyDisplay <= 0 ||
        velocityIn == null ||
        velocityIn < 0
      ) {
        return null;
      }
      moneyBase = toBase(moneyDisplay, magnitude);
      velocity = velocityIn;
      numeratorBase = roundMoney(moneyBase * velocity);
      nominalTxnBase = numeratorBase;
      steps.push(
        `T_nominal = M × V = ${fmtMoney(moneyBase, currency, magnitude)} × ${fmtV(velocity)} = ${fmtMoney(numeratorBase, currency, magnitude)}.`
      );
    } else if (solveTarget === 'priceIndex') {
      if (transactionSource !== 'derived') return null;
      if (
        moneyDisplay == null ||
        moneyDisplay <= 0 ||
        velocityIn == null ||
        velocityIn < 0 ||
        volume == null ||
        volume <= 0 ||
        basePrice == null ||
        basePrice <= 0 ||
        indexBase == null ||
        indexBase <= 0
      ) {
        return null;
      }
      moneyBase = toBase(moneyDisplay, magnitude);
      velocity = velocityIn;
      numeratorBase = roundMoney(moneyBase * velocity);
      nominalTxnBase = numeratorBase;
      impliedPrice = roundMoney(fromBase(numeratorBase, magnitude) / volume);
      resolvedVolume = volume;
      resolvedPriceIndex = roundRatio(
        (impliedPrice / basePrice) * indexBase
      );
      steps.push(
        `T_nominal = M × V = ${fmtMoney(numeratorBase, currency, magnitude)}.`
      );
      steps.push(
        `Price/basket = T / N = ${formatCurrencyValue(fromBase(numeratorBase, magnitude), currency)} / ${volume} = ${formatCurrencyValue(impliedPrice, currency)}.`
      );
      steps.push(
        `Price index P = (price/basePrice) × indexBase = (${impliedPrice}/${basePrice}) × ${indexBase} = ${fmtV(resolvedPriceIndex)}.`
      );
    } else if (solveTarget === 'volume') {
      if (transactionSource !== 'derived') return null;
      if (
        moneyDisplay == null ||
        moneyDisplay <= 0 ||
        velocityIn == null ||
        velocityIn < 0 ||
        priceIndex == null ||
        priceIndex < 0 ||
        basePrice == null ||
        basePrice <= 0 ||
        indexBase == null ||
        indexBase <= 0
      ) {
        return null;
      }
      moneyBase = toBase(moneyDisplay, magnitude);
      velocity = velocityIn;
      numeratorBase = roundMoney(moneyBase * velocity);
      nominalTxnBase = numeratorBase;
      impliedPrice = roundMoney(basePrice * (priceIndex / indexBase));
      if (impliedPrice <= 0) return null;
      resolvedPriceIndex = priceIndex;
      resolvedVolume = roundRatio(
        fromBase(numeratorBase, magnitude) / impliedPrice
      );
      steps.push(
        `T_nominal = M × V = ${fmtMoney(numeratorBase, currency, magnitude)}.`
      );
      steps.push(
        `Price/basket = ${formatCurrencyValue(basePrice, currency)} × (${priceIndex}/${indexBase}) = ${formatCurrencyValue(impliedPrice, currency)}.`
      );
      steps.push(
        `N = T / price = ${formatCurrencyValue(fromBase(numeratorBase, magnitude), currency)} / ${formatCurrencyValue(impliedPrice, currency)} = ${fmtV(resolvedVolume)}.`
      );
    } else {
      return null;
    }
  }

  if (
    velocity == null ||
    moneyBase == null ||
    numeratorBase == null ||
    !Number.isFinite(velocity) ||
    !Number.isFinite(moneyBase) ||
    !Number.isFinite(numeratorBase)
  ) {
    return null;
  }

  if (moneyBase <= 0 && solveTarget === 'velocity') {
    return null;
  }

  const formulaBreakdown =
    mode === 'gdp'
      ? 'V_GDP = Nominal GDP / M\nM = GDP / V\nGDP = M × V'
      : transactionSource === 'derived'
        ? 'price = basePrice × (P / indexBase)\nT_nominal = price × N\nV = T_nominal / M'
        : 'V = T_nominal / M\nM = T_nominal / V\nT_nominal = M × V';

  const interpretation =
    mode === 'gdp'
      ? `A GDP-based velocity of ${fmtV(velocity)} means annual (or period) nominal GDP equals ${fmtV(velocity)} times the selected ${input.moneyAggregate} money stock: an aggregate ratio, not how many times each banknote changed hands.`
      : `A transaction velocity of ${fmtV(velocity)} means the nominal value of transactions during the selected period was ${fmtV(velocity)} times the money stock used in the calculation.`;

  const explanation = [
    `Mode: ${mode === 'gdp' ? 'GDP-based income velocity' : 'transaction-based velocity'}.`,
    `Money aggregate label: ${input.moneyAggregate} (informational; aggregates are not interchangeable).`,
    `Period: ${unit}.`,
    `Solved for: ${solveTarget}.`,
    'Currency is denomination only (not FX). Magnitude scales money and flow inputs together.',
    mode === 'transactions' && transactionSource === 'direct'
      ? 'Price index was not multiplied into a pre-priced transaction total.'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const chartParts =
    mode === 'gdp' && nominalGdpBase != null
      ? [
          {
            label: 'Nominal GDP',
            value: nominalGdpBase,
            formatted: fmtMoney(nominalGdpBase, currency, magnitude),
          },
          {
            label: 'Money stock',
            value: moneyBase,
            formatted: fmtMoney(moneyBase, currency, magnitude),
          },
        ]
      : [
          {
            label: 'Nominal flow',
            value: numeratorBase,
            formatted: fmtMoney(numeratorBase, currency, magnitude),
          },
          {
            label: 'Money stock',
            value: moneyBase,
            formatted: fmtMoney(moneyBase, currency, magnitude),
          },
        ];

  return {
    mode,
    solveTarget,
    currency,
    magnitude,
    period,
    periodUnit: unit,
    moneyAggregate: input.moneyAggregate,
    velocity,
    moneySupplyBase: moneyBase,
    numeratorBase,
    nominalTransactionValueBase: nominalTxnBase,
    nominalGdpBase,
    priceIndex: resolvedPriceIndex,
    volume: resolvedVolume,
    impliedPricePerBasket: impliedPrice,
    formattedVelocity: `${fmtV(velocity)} ${unit}`,
    formattedMoneySupply: fmtMoney(moneyBase, currency, magnitude),
    formattedNumerator: fmtMoney(numeratorBase, currency, magnitude),
    formattedNominalTxn:
      nominalTxnBase != null
        ? fmtMoney(nominalTxnBase, currency, magnitude)
        : null,
    formattedNominalGdp:
      nominalGdpBase != null
        ? fmtMoney(nominalGdpBase, currency, magnitude)
        : null,
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
    chartParts,
  };
}

export function solveTargetsForMode(
  mode: VelocityOfMoneyInput['mode'],
  transactionSource: VelocityOfMoneyInput['transactionSource']
): VelocitySolveTarget[] {
  if (mode === 'gdp') {
    return ['velocity', 'moneySupply', 'nominalFlow'];
  }
  if (transactionSource === 'derived') {
    return [
      'velocity',
      'moneySupply',
      'nominalFlow',
      'priceIndex',
      'volume',
    ];
  }
  return ['velocity', 'moneySupply', 'nominalFlow'];
}
