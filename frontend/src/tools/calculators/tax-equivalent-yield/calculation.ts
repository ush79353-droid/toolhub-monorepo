/**
 * Tax Equivalent Yield Calculator — pure engine (ADR-018).
 *
 * TEY = Y_tax-free / (1 − t)
 * Y   = TEY × (1 − t)
 * t%  = (1 − Y / TEY) × 100
 */

import type {
  TaxEquivalentYieldInput,
  TaxEquivalentYieldResult,
} from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateTaxEquivalentYield(inputs: {
  bondYieldPercent: number;
  marginalTaxRatePercent: number;
}): { taxableEquivalentYieldPercent: number; taxRetentionFactor: number } | null {
  const { bondYieldPercent, marginalTaxRatePercent } = inputs;
  if (
    !Number.isFinite(bondYieldPercent) ||
    !Number.isFinite(marginalTaxRatePercent)
  ) {
    return null;
  }
  if (
    bondYieldPercent < 0 ||
    marginalTaxRatePercent < 0 ||
    marginalTaxRatePercent >= 100
  ) {
    return null;
  }
  const taxRate = marginalTaxRatePercent / 100;
  const taxRetentionFactor = 1 - taxRate;
  const taxableEquivalentYieldPercent = bondYieldPercent / taxRetentionFactor;
  if (!Number.isFinite(taxableEquivalentYieldPercent)) return null;
  return { taxableEquivalentYieldPercent, taxRetentionFactor };
}

export function calculateTaxExemptYield(
  taxableEquivalentYieldPercent: number,
  marginalTaxRatePercent: number,
): number | null {
  if (
    !Number.isFinite(taxableEquivalentYieldPercent) ||
    !Number.isFinite(marginalTaxRatePercent) ||
    taxableEquivalentYieldPercent < 0 ||
    marginalTaxRatePercent < 0 ||
    marginalTaxRatePercent >= 100
  ) {
    return null;
  }
  const y =
    taxableEquivalentYieldPercent * (1 - marginalTaxRatePercent / 100);
  return Number.isFinite(y) ? y : null;
}

export function calculateImpliedMarginalTaxRate(
  bondYieldPercent: number,
  taxableEquivalentYieldPercent: number,
): number | null {
  if (
    !Number.isFinite(bondYieldPercent) ||
    !Number.isFinite(taxableEquivalentYieldPercent) ||
    bondYieldPercent < 0 ||
    taxableEquivalentYieldPercent <= 0 ||
    bondYieldPercent > taxableEquivalentYieldPercent
  ) {
    return null;
  }
  const t = (1 - bondYieldPercent / taxableEquivalentYieldPercent) * 100;
  return Number.isFinite(t) ? t : null;
}

export function calculateAfterTaxTaxableYield(
  taxableInvestmentYieldPercent: number,
  marginalTaxRatePercent: number,
): number | null {
  if (
    !Number.isFinite(taxableInvestmentYieldPercent) ||
    !Number.isFinite(marginalTaxRatePercent) ||
    taxableInvestmentYieldPercent < 0 ||
    marginalTaxRatePercent < 0 ||
    marginalTaxRatePercent >= 100
  ) {
    return null;
  }
  const after =
    taxableInvestmentYieldPercent * (1 - marginalTaxRatePercent / 100);
  return Number.isFinite(after) ? after : null;
}

export function formatPercentDisplay(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function calculateTaxEquivalentYieldFromInput(
  input: TaxEquivalentYieldInput,
): TaxEquivalentYieldResult | null {
  const { solveTarget } = input;

  let bondYieldPercent: number;
  let marginalTaxRatePercent: number;
  let taxableEquivalentYieldPercent: number;
  let taxRetentionFactor: number;
  let formulaBreakdown: string;
  let steps: string[];
  let interpretation: string;
  let explanation: string;

  if (solveTarget === 'taxableEquivalentYield') {
    const y = num(input.bondYieldPercent);
    const t = num(input.marginalTaxRatePercent);
    if (y == null || t == null) return null;
    const calc = calculateTaxEquivalentYield({
      bondYieldPercent: y,
      marginalTaxRatePercent: t,
    });
    if (!calc) return null;
    bondYieldPercent = y;
    marginalTaxRatePercent = t;
    taxableEquivalentYieldPercent = calc.taxableEquivalentYieldPercent;
    taxRetentionFactor = calc.taxRetentionFactor;
    formulaBreakdown = [
      'TEY = Tax-Exempt Yield ÷ (1 − t)',
      `TEY = ${y} ÷ (1 − ${t / 100})`,
      `TEY = ${y} ÷ ${taxRetentionFactor}`,
      `TEY = ${formatPercentDisplay(taxableEquivalentYieldPercent)}`,
    ].join('\n');
    steps = [
      `Convert tax rate: ${t}% ÷ 100 = ${t / 100}`,
      `Retention factor: 1 − ${t / 100} = ${taxRetentionFactor}`,
      `TEY = ${y}% ÷ ${taxRetentionFactor} = ${formatPercentDisplay(taxableEquivalentYieldPercent)}`,
    ];
    interpretation = `A tax-exempt investment yielding ${formatPercentDisplay(y)} has a taxable equivalent yield of approximately ${formatPercentDisplay(taxableEquivalentYieldPercent)} for an investor facing a ${formatPercentDisplay(t)} marginal tax rate. A fully taxable investment would need to offer approximately ${formatPercentDisplay(taxableEquivalentYieldPercent)} before tax to provide the same after-tax yield, assuming comparable yield conventions and tax treatment.`;
    explanation = `At a ${formatPercentDisplay(t)} marginal tax rate, you retain approximately ${formatPercentDisplay(taxRetentionFactor * 100)} of taxable interest income under this simplified calculation. Therefore, a taxable investment must yield approximately ${formatPercentDisplay(taxableEquivalentYieldPercent)} to match a tax-exempt yield of ${formatPercentDisplay(y)}.`;
  } else if (solveTarget === 'taxExemptYield') {
    const tey = num(input.taxableEquivalentYieldPercent);
    const t = num(input.marginalTaxRatePercent);
    if (tey == null || t == null) return null;
    const y = calculateTaxExemptYield(tey, t);
    if (y === null) return null;
    bondYieldPercent = y;
    marginalTaxRatePercent = t;
    taxableEquivalentYieldPercent = tey;
    taxRetentionFactor = 1 - t / 100;
    formulaBreakdown = [
      'Y = TEY × (1 − t)',
      `Y = ${tey} × (1 − ${t / 100})`,
      `Y = ${tey} × ${taxRetentionFactor}`,
      `Y = ${formatPercentDisplay(y)}`,
    ].join('\n');
    steps = [
      `Retention factor: 1 − ${t / 100} = ${taxRetentionFactor}`,
      `Tax-exempt yield = ${tey}% × ${taxRetentionFactor} = ${formatPercentDisplay(y)}`,
    ];
    interpretation = `To match a taxable equivalent yield of ${formatPercentDisplay(tey)} at a ${formatPercentDisplay(t)} marginal tax rate, the tax-exempt investment would need to yield approximately ${formatPercentDisplay(y)}.`;
    explanation =
      'This reverse solve finds the tax-exempt yield that equates to the stated taxable equivalent yield under the selected marginal rate. Credit risk, fees, and tax nuances still matter.';
  } else {
    const y = num(input.bondYieldPercent);
    const tey = num(input.taxableEquivalentYieldPercent);
    if (y == null || tey == null) return null;
    const t = calculateImpliedMarginalTaxRate(y, tey);
    if (t === null) return null;
    bondYieldPercent = y;
    marginalTaxRatePercent = t;
    taxableEquivalentYieldPercent = tey;
    taxRetentionFactor = 1 - t / 100;
    formulaBreakdown = [
      't (%) = (1 − Y / TEY) × 100',
      `t (%) = (1 − ${y} / ${tey}) × 100`,
      `t (%) = ${formatPercentDisplay(t)}`,
    ].join('\n');
    steps = [
      `Ratio Y / TEY = ${y} / ${tey} = ${y / tey}`,
      `Implied tax rate = (1 − ${y / tey}) × 100 = ${formatPercentDisplay(t)}`,
    ];
    interpretation = `Matching a ${formatPercentDisplay(y)} tax-exempt yield to a ${formatPercentDisplay(tey)} taxable equivalent yield implies a marginal tax rate of approximately ${formatPercentDisplay(t)}.`;
    explanation =
      'The implied rate is a mathematical breakeven under the standard TEY formula — not a forecast of your actual tax liability or filing status.';
  }

  let comparison: TaxEquivalentYieldResult['comparison'] = null;
  if (input.showComparison) {
    const taxableY = num(input.taxableInvestmentYieldPercent);
    if (
      taxableY != null &&
      Number.isFinite(marginalTaxRatePercent) &&
      marginalTaxRatePercent >= 0 &&
      marginalTaxRatePercent < 100
    ) {
      const after = calculateAfterTaxTaxableYield(
        taxableY,
        marginalTaxRatePercent,
      );
      if (after != null) {
        const differencePp = bondYieldPercent - after;
        comparison = {
          taxableInvestmentYieldPercent: taxableY,
          afterTaxTaxableYieldPercent: after,
          differencePp,
          formattedTaxableYield: formatPercentDisplay(taxableY),
          formattedAfterTax: formatPercentDisplay(after),
          formattedDifference: `${differencePp >= 0 ? '+' : ''}${differencePp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pp`,
          note:
            differencePp === 0
              ? 'Under the specified assumptions, the tax-exempt yield matches the after-tax taxable yield. Default risk, liquidity, duration, call risk, fees, and other tax considerations still affect the decision.'
              : differencePp > 0
                ? `Under the specified assumptions, the tax-exempt investment offers an after-tax yield ${Math.abs(differencePp).toLocaleString('en-US', { maximumFractionDigits: 2 })} percentage points higher than the taxable alternative. That does not automatically make it the better investment — credit, liquidity, duration, call risk, fees, and tax nuances also matter.`
                : `Under the specified assumptions, the taxable alternative's after-tax yield is ${Math.abs(differencePp).toLocaleString('en-US', { maximumFractionDigits: 2 })} percentage points higher than the tax-exempt yield. Still weigh credit risk, liquidity, duration, fees, and applicable taxes before deciding.`,
        };
      }
    }
  }

  return {
    solveTarget,
    bondYieldPercent,
    marginalTaxRatePercent,
    taxableEquivalentYieldPercent,
    taxRetentionFactor,
    formattedBondYield: formatPercentDisplay(bondYieldPercent),
    formattedTaxRate: formatPercentDisplay(marginalTaxRatePercent),
    formattedRetention: formatPercentDisplay(taxRetentionFactor * 100),
    formattedTey: formatPercentDisplay(taxableEquivalentYieldPercent),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
    comparison,
  };
}
