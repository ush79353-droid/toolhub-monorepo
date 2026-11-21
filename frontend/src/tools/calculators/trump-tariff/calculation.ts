import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  ORIGIN_COUNTRIES,
  PRODUCT_PRESETS,
  type TrumpTariffInput,
  type TrumpTariffResult,
} from './types';

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

function roundRate(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function moneyOrZero(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return 0;
  return num(t);
}

/**
 * Simplified educational tariff estimate for additive ad valorem scenarios.
 * Not a universal customs engine — specific duties, TRQs, and non-stacking
 * measures require separate handling outside this helper.
 */
export function calculateTrumpTariff(
  input: TrumpTariffInput
): TrumpTariffResult | null {
  const unitCustomsValue = num(input.unitCustomsValue);
  const quantity = num(input.quantity);
  const baseTariffRate = num(input.baseTariffRate);
  const additionalTariffRate =
    input.additionalTariffRate.trim() === ''
      ? 0
      : num(input.additionalTariffRate);
  const shippingCost = moneyOrZero(input.shippingCost);
  const insuranceCost = moneyOrZero(input.insuranceCost);
  const otherFees = moneyOrZero(input.otherFees);

  if (
    unitCustomsValue == null ||
    quantity == null ||
    baseTariffRate == null ||
    additionalTariffRate == null ||
    shippingCost == null ||
    insuranceCost == null ||
    otherFees == null
  ) {
    return null;
  }

  if (
    unitCustomsValue < 0 ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    baseTariffRate < 0 ||
    additionalTariffRate < 0 ||
    shippingCost < 0 ||
    insuranceCost < 0 ||
    otherFees < 0
  ) {
    return null;
  }

  if (!input.assumeAdditiveStacking && additionalTariffRate > 0) {
    return null;
  }

  let retailPrice: number | null = null;
  let passThroughPercent: number | null = null;
  if (
    input.retailPrice.trim() !== '' &&
    input.passThroughPercent.trim() !== ''
  ) {
    retailPrice = num(input.retailPrice);
    passThroughPercent = num(input.passThroughPercent);
    if (
      retailPrice == null ||
      passThroughPercent == null ||
      retailPrice < 0 ||
      passThroughPercent < 0
    ) {
      return null;
    }
  }

  const htsusCode = input.htsusCode.trim() || null;

  const totalCustomsValue = roundMoney(unitCustomsValue * quantity);
  const baseDuty = roundMoney(totalCustomsValue * (baseTariffRate / 100));
  const additionalDuty = roundMoney(
    totalCustomsValue * (additionalTariffRate / 100)
  );
  const combinedTariffRate = roundRate(baseTariffRate + additionalTariffRate);
  const totalTariff = roundMoney(baseDuty + additionalDuty);
  const tariffInclusiveValue = roundMoney(totalCustomsValue + totalTariff);
  const estimatedLandedCost = roundMoney(
    tariffInclusiveValue + shippingCost + insuranceCost + otherFees
  );
  const landedCostPerUnit = roundMoney(estimatedLandedCost / quantity);
  const costIncreasePercent =
    totalCustomsValue > 0
      ? roundRate((totalTariff / totalCustomsValue) * 100)
      : 0;

  let consumerPriceIncrease: number | null = null;
  let newRetailPrice: number | null = null;
  if (retailPrice != null && passThroughPercent != null) {
    const tariffPerUnit = roundMoney(totalTariff / quantity);
    consumerPriceIncrease = roundMoney(
      tariffPerUnit * (passThroughPercent / 100)
    );
    newRetailPrice = roundMoney(retailPrice + consumerPriceIncrease);
  }

  const currency = input.currency;
  const country =
    ORIGIN_COUNTRIES.find((c) => c.code === input.countryCode) ??
    ORIGIN_COUNTRIES[ORIGIN_COUNTRIES.length - 1]!;
  const preset =
    PRODUCT_PRESETS.find((p) => p.id === input.productPreset) ??
    PRODUCT_PRESETS[PRODUCT_PRESETS.length - 1]!;

  const fmt = (n: number) => formatCurrencyValue(n, currency);
  const fmtPct = (n: number) =>
    `${n.toLocaleString('en-US', {
      maximumFractionDigits: 4,
      minimumFractionDigits: 0,
    })}%`;

  const chartParts = [
    {
      label: 'Customs value',
      value: totalCustomsValue,
      formatted: fmt(totalCustomsValue),
    },
    { label: 'Base duty', value: baseDuty, formatted: fmt(baseDuty) },
    {
      label: 'Additional duty',
      value: additionalDuty,
      formatted: fmt(additionalDuty),
    },
    {
      label: 'Shipping',
      value: shippingCost,
      formatted: fmt(shippingCost),
    },
    {
      label: 'Insurance',
      value: insuranceCost,
      formatted: fmt(insuranceCost),
    },
    {
      label: 'Other fees',
      value: otherFees,
      formatted: fmt(otherFees),
    },
  ].filter((p) => p.value > 0 || p.label === 'Customs value');

  const steps = [
    `Total customs value V = ${fmt(unitCustomsValue)} × ${quantity} = ${fmt(totalCustomsValue)}.`,
    `Base duty = ${fmt(totalCustomsValue)} × ${fmtPct(baseTariffRate)} = ${fmt(baseDuty)}.`,
    `Additional duty = ${fmt(totalCustomsValue)} × ${fmtPct(additionalTariffRate)} = ${fmt(additionalDuty)}.`,
    `Combined ad valorem rate (additive scenario) = ${fmtPct(baseTariffRate)} + ${fmtPct(additionalTariffRate)} = ${fmtPct(combinedTariffRate)}.`,
    `Total estimated tariff T = ${fmt(baseDuty)} + ${fmt(additionalDuty)} = ${fmt(totalTariff)}.`,
    `Tariff-inclusive value C = ${fmt(totalCustomsValue)} + ${fmt(totalTariff)} = ${fmt(tariffInclusiveValue)}.`,
    `Estimated landed cost L = ${fmt(tariffInclusiveValue)} + shipping ${fmt(shippingCost)} + insurance ${fmt(insuranceCost)} + other ${fmt(otherFees)} = ${fmt(estimatedLandedCost)}.`,
    `Landed cost per unit = ${fmt(estimatedLandedCost)} ÷ ${quantity} = ${fmt(landedCostPerUnit)}.`,
  ];

  if (consumerPriceIncrease != null && newRetailPrice != null) {
    steps.push(
      `Pass-through scenario: tariff per unit ${fmt(totalTariff / quantity)} × ${fmtPct(passThroughPercent!)} = ${fmt(consumerPriceIncrease)}; new retail ≈ ${fmt(newRetailPrice)}.`
    );
  }

  const formulaBreakdown = [
    'V = P × Q',
    'T_base = V × (r_base / 100)',
    'T_add = V × (r_add / 100)',
    'r_combined = r_base + r_add (additive scenario only)',
    'T = T_base + T_add',
    'C = V + T',
    'L = C + S + I + O',
  ].join('\n');

  const scenarioLabel =
    'User-defined tariff scenario (educational — not an official customs determination)';

  const interpretation =
    totalCustomsValue === 0
      ? 'Customs value is zero, so estimated ad valorem duties are zero. Landed cost reflects only shipping, insurance, and other fees you entered.'
      : `Under this simplified additive scenario, estimated duties are ${fmt(totalTariff)} (${fmtPct(combinedTariffRate)} of customs value). Estimated landed cost is ${fmt(estimatedLandedCost)}.`;

  const explanation = [
    `Mode: ${input.mode === 'product' ? 'by product' : 'by country'}. Origin: ${country.label}. Product preset: ${preset.label}.`,
    scenarioLabel + '.',
    htsusCode
      ? `HTSUS entry "${htsusCode}" is format-checked only — it does not confirm the correct classification or legal rate.`
      : 'No HTSUS code entered; results use the rates you typed.',
    'Actual U.S. import charges depend on classification, valuation, origin, effective dates, exemptions, and other measures. Check CBP, USITC HTSUS, and USTR for official information.',
  ].join(' ');

  return {
    mode: input.mode,
    currency,
    countryCode: country.code,
    countryLabel: country.label,
    productLabel: preset.label,
    scenarioLabel,
    unitCustomsValue,
    quantity,
    totalCustomsValue,
    baseTariffRate,
    additionalTariffRate,
    combinedTariffRate,
    baseDuty,
    additionalDuty,
    totalTariff,
    tariffInclusiveValue,
    shippingCost,
    insuranceCost,
    otherFees,
    estimatedLandedCost,
    landedCostPerUnit,
    costIncreasePercent,
    stackingAssumed: input.assumeAdditiveStacking,
    htsusCode,
    retailPrice,
    passThroughPercent,
    consumerPriceIncrease,
    newRetailPrice,
    formattedCustomsValue: fmt(totalCustomsValue),
    formattedBaseDuty: fmt(baseDuty),
    formattedAdditionalDuty: fmt(additionalDuty),
    formattedTotalTariff: fmt(totalTariff),
    formattedCombinedRate: fmtPct(combinedTariffRate),
    formattedTariffInclusive: fmt(tariffInclusiveValue),
    formattedLanded: fmt(estimatedLandedCost),
    formattedPerUnit: fmt(landedCostPerUnit),
    formattedCostIncrease: fmtPct(costIncreasePercent),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
    chartParts,
  };
}

export function calculatePassThrough(input: {
  originalRetailPrice: number;
  addedTariffCost: number;
  passThroughPercent: number;
}): { consumerPriceIncrease: number; newRetailPrice: number } | null {
  const { originalRetailPrice, addedTariffCost, passThroughPercent } = input;
  if (
    ![originalRetailPrice, addedTariffCost, passThroughPercent].every(
      (n) => Number.isFinite(n) && n >= 0
    )
  ) {
    return null;
  }
  const consumerPriceIncrease = roundMoney(
    addedTariffCost * (passThroughPercent / 100)
  );
  return {
    consumerPriceIncrease,
    newRetailPrice: roundMoney(originalRetailPrice + consumerPriceIncrease),
  };
}
