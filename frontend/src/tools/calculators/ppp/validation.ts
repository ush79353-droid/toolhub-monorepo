import {
  bilateralMarketFromUsdLegs,
  calculateBilateralPPPRate,
  calculateInternationalDollarValue,
  calculateMarketConvertedSalary,
  calculatePPPSalary,
  calculateRelativePriceLevel,
  formatMoney,
  formatPercent,
  formatPppFactor,
  formatRate,
  fromAnnualToPeriod,
  toAnnualSalary,
} from './calculation';
import {
  PPP_DATA_SOURCE,
  PPP_INDICATOR,
  getPppCountry,
  type PppYear,
} from './ppp-data';
import type { PppFieldErrors, PppInput, PppResult } from './types';

export interface PppValidation {
  isValid: boolean;
  errors: PppFieldErrors;
  result: PppResult | null;
}

function parseNum(
  raw: string,
  opts?: { min?: number; allowNegative?: boolean }
): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  outOfRange: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    return { value: null, blank: true, invalid: false, outOfRange: false };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true, outOfRange: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true, outOfRange: false };
  }
  if (opts?.allowNegative === false && value < 0) {
    return { value: null, blank: false, invalid: false, outOfRange: true };
  }
  if (opts?.min != null && value < opts.min) {
    return { value: null, blank: false, invalid: false, outOfRange: true };
  }
  return { value, blank: false, invalid: false, outOfRange: false };
}

export function validatePppInput(input: PppInput): PppValidation {
  const errors: PppFieldErrors = {};
  const salary = parseNum(input.salary, { allowNegative: false, min: 0 });
  if (salary.blank) errors.salary = 'Enter a salary.';
  else if (salary.invalid || salary.value === null)
    errors.salary = 'Enter a valid salary.';
  else if (salary.outOfRange) errors.salary = 'Salary must be nonnegative.';

  if (input.mode === 'manual') {
    return validateManual(input, errors, salary.value);
  }
  return validateDataset(input, errors, salary.value);
}

function validateDataset(
  input: PppInput,
  errors: PppFieldErrors,
  salaryValue: number | null
): PppValidation {
  const year = input.year as PppYear;
  const source = getPppCountry(input.sourceIso2);
  const target = getPppCountry(input.targetIso2);

  if (!source) errors.sourceIso2 = 'Select a supported source country.';
  if (!target) errors.targetIso2 = 'Select a supported target country.';

  if (source && source.ppp[year] == null) {
    errors.year = `No PPP factor for ${source.name} in ${year}.`;
  }
  if (target && target.ppp[year] == null) {
    errors.year = `No PPP factor for ${target.name} in ${year}.`;
  }

  let marketRate: number | null = null;
  let marketRateLabel = '';

  if (input.marketRateSource === 'manual') {
    const m = parseNum(input.manualMarketRate, { min: Number.MIN_VALUE });
    if (m.blank)
      errors.manualMarketRate =
        'Enter market rate (target currency per 1 source currency).';
    else if (m.invalid || m.value === null || m.outOfRange || m.value! <= 0)
      errors.manualMarketRate = 'Market rate must be a positive finite number.';
    else {
      marketRate = m.value;
      marketRateLabel = `Manual: 1 ${source?.currency ?? 'SRC'} = ${formatRate(marketRate)} ${target?.currency ?? 'TGT'}`;
    }
  } else if (source && target) {
    const sFx = source.officialFxPerUsd[year];
    const tFx = target.officialFxPerUsd[year];
    if (sFx == null || tFx == null) {
      errors.form =
        'Official exchange rates unavailable for this year; use manual market rate.';
    } else {
      marketRate = bilateralMarketFromUsdLegs(sFx, tFx);
      if (marketRate == null) {
        errors.form = 'Could not derive market exchange rate.';
      } else {
        marketRateLabel = `WDI official ${year}: 1 ${source.currency} = ${formatRate(marketRate)} ${target.currency}`;
      }
    }
  }

  if (Object.keys(errors).length > 0 || salaryValue == null) {
    return { isValid: false, errors, result: null };
  }

  const sourcePpp = source!.ppp[year]!;
  const targetPpp = target!.ppp[year]!;
  return buildResult({
    mode: 'dataset',
    year,
    sourceName: source!.name,
    targetName: target!.name,
    sourceCurrency: source!.currency,
    targetCurrency: target!.currency,
    period: input.period,
    salaryInPeriod: salaryValue,
    sourcePpp,
    targetPpp,
    marketRate,
    marketRateLabel,
    dataAttribution: `${PPP_DATA_SOURCE}. ${PPP_INDICATOR}. Reference year ${year}.`,
  });
}

function validateManual(
  input: PppInput,
  errors: PppFieldErrors,
  salaryValue: number | null
): PppValidation {
  const sourcePpp = parseNum(input.manualSourcePpp, { min: Number.MIN_VALUE });
  const targetPpp = parseNum(input.manualTargetPpp, { min: Number.MIN_VALUE });
  if (sourcePpp.blank)
    errors.manualSourcePpp = 'Enter source PPP conversion factor.';
  else if (
    sourcePpp.invalid ||
    sourcePpp.value === null ||
    sourcePpp.outOfRange ||
    sourcePpp.value! <= 0
  )
    errors.manualSourcePpp = 'Source PPP factor must be greater than zero.';

  if (targetPpp.blank)
    errors.manualTargetPpp = 'Enter target PPP conversion factor.';
  else if (
    targetPpp.invalid ||
    targetPpp.value === null ||
    targetPpp.outOfRange ||
    targetPpp.value! <= 0
  )
    errors.manualTargetPpp = 'Target PPP factor must be greater than zero.';

  const srcCur = input.manualSourceCurrency.trim().toUpperCase();
  const tgtCur = input.manualTargetCurrency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(srcCur))
    errors.manualSourceCurrency = 'Enter a 3-letter source currency code.';
  if (!/^[A-Z]{3}$/.test(tgtCur))
    errors.manualTargetCurrency = 'Enter a 3-letter target currency code.';

  let marketRate: number | null = null;
  let marketRateLabel = 'Not provided';
  if (input.manualMarketRate.trim() !== '') {
    const m = parseNum(input.manualMarketRate, { min: Number.MIN_VALUE });
    if (m.invalid || m.value === null || m.outOfRange || m.value! <= 0)
      errors.manualMarketRate = 'Market rate must be a positive finite number.';
    else {
      marketRate = m.value;
      marketRateLabel = `Manual: 1 ${srcCur || 'SRC'} = ${formatRate(marketRate)} ${tgtCur || 'TGT'}`;
    }
  }

  if (Object.keys(errors).length > 0 || salaryValue == null) {
    return { isValid: false, errors, result: null };
  }

  return buildResult({
    mode: 'manual',
    year: null,
    sourceName: 'User-supplied source',
    targetName: 'User-supplied target',
    sourceCurrency: srcCur,
    targetCurrency: tgtCur,
    period: input.period,
    salaryInPeriod: salaryValue,
    sourcePpp: sourcePpp.value!,
    targetPpp: targetPpp.value!,
    marketRate,
    marketRateLabel,
    dataAttribution:
      'User-supplied PPP conversion factors (manual mode). Not World Bank data.',
  });
}

function buildResult(args: {
  mode: 'dataset' | 'manual';
  year: PppYear | null;
  sourceName: string;
  targetName: string;
  sourceCurrency: string;
  targetCurrency: string;
  period: 'yearly' | 'monthly';
  salaryInPeriod: number;
  sourcePpp: number;
  targetPpp: number;
  marketRate: number | null;
  marketRateLabel: string;
  dataAttribution: string;
}): PppValidation {
  const annual = toAnnualSalary(args.salaryInPeriod, args.period)!;
  const intl = calculateInternationalDollarValue(annual, args.sourcePpp)!;
  const pppAnnual = calculatePPPSalary({
    salary: annual,
    sourcePPP: args.sourcePpp,
    targetPPP: args.targetPpp,
  })!;
  const ePpp = calculateBilateralPPPRate({
    sourcePPP: args.sourcePpp,
    targetPPP: args.targetPpp,
  })!;
  const pppInPeriod = fromAnnualToPeriod(pppAnnual, args.period);

  let marketAnnual: number | null = null;
  let relative: number | null = null;
  if (args.marketRate != null) {
    marketAnnual = calculateMarketConvertedSalary({
      salary: annual,
      marketExchangeRate: args.marketRate,
    });
    relative = calculateRelativePriceLevel({
      pppExchangeRate: ePpp,
      marketExchangeRate: args.marketRate,
    });
  }
  const marketInPeriod =
    marketAnnual != null
      ? fromAnnualToPeriod(marketAnnual, args.period)
      : null;

  const periodWord = args.period === 'monthly' ? 'monthly' : 'annual';
  const steps = [
    `Normalize to annual: ${formatMoney(annual, args.sourceCurrency)} (${periodWord} input).`,
    `International $ = salary / PPP_A = ${formatMoney(annual, args.sourceCurrency)} / ${formatPppFactor(args.sourcePpp)} = ${formatRate(intl, 2)} intl $.`,
    `PPP-adjusted annual = intl $ × PPP_B = ${formatRate(intl, 2)} × ${formatPppFactor(args.targetPpp)} = ${formatMoney(pppAnnual, args.targetCurrency)}.`,
    `Shown for ${periodWord} period: ${formatMoney(pppInPeriod, args.targetCurrency)}.`,
    `E_PPP = PPP_B / PPP_A = ${formatRate(ePpp)} ${args.targetCurrency} per 1 ${args.sourceCurrency}.`,
  ];
  if (args.marketRate != null && marketInPeriod != null) {
    steps.push(
      `Market conversion: ${formatMoney(args.salaryInPeriod, args.sourceCurrency)} × ${formatRate(args.marketRate)} = ${formatMoney(marketInPeriod, args.targetCurrency)} (${periodWord}).`
    );
    if (relative != null) {
      steps.push(
        `Relative price level R = E_PPP / E_M = ${formatRate(ePpp)} / ${formatRate(args.marketRate)} = ${formatRate(relative)} (${formatPercent(relative * 100)}).`
      );
    }
  }

  let interpretation = `Under the selected PPP factors, ${formatMoney(pppInPeriod, args.targetCurrency)} ${periodWord} in ${args.targetName} corresponds to approximately the same purchasing power as ${formatMoney(args.salaryInPeriod, args.sourceCurrency)} ${periodWord} in ${args.sourceName}.`;
  if (
    args.sourceName === args.targetName ||
    (args.sourceCurrency === args.targetCurrency &&
      args.sourcePpp === args.targetPpp)
  ) {
    if (Math.abs(pppInPeriod - args.salaryInPeriod) < 1e-6) {
      interpretation =
        'Same PPP definition and factors: PPP-adjusted salary matches the source salary.';
    }
  }

  const explanation =
    'PPP reflects broad average price levels (here: GDP PPP), not your personal cost of living. Housing, taxes, healthcare, city choice, and lifestyle can differ substantially. PPP rates are not tradable FX quotes.';

  const result: PppResult = {
    mode: args.mode,
    year: args.year,
    sourceName: args.sourceName,
    targetName: args.targetName,
    sourceCurrency: args.sourceCurrency,
    targetCurrency: args.targetCurrency,
    period: args.period,
    salaryInPeriod: args.salaryInPeriod,
    annualSalary: annual,
    sourcePpp: args.sourcePpp,
    targetPpp: args.targetPpp,
    internationalDollars: intl,
    pppAdjustedSalary: pppInPeriod,
    bilateralPppRate: ePpp,
    marketRate: args.marketRate,
    marketRateLabel: args.marketRateLabel,
    marketConvertedSalary: marketInPeriod,
    relativePriceLevel: relative,
    relativePriceLevelPercent: relative != null ? relative * 100 : null,
    formattedSalary: formatMoney(args.salaryInPeriod, args.sourceCurrency),
    formattedIntl: `${formatRate(intl, 2)} intl $`,
    formattedPppSalary: formatMoney(pppInPeriod, args.targetCurrency),
    formattedMarketSalary:
      marketInPeriod != null
        ? formatMoney(marketInPeriod, args.targetCurrency)
        : '—',
    formattedPppRate: `1 ${args.sourceCurrency} ≈ ${formatRate(ePpp)} ${args.targetCurrency} at PPP`,
    formattedMarketRate: args.marketRateLabel,
    formattedRelative:
      relative != null ? formatPercent(relative * 100) : '—',
    interpretation,
    explanation,
    formulaBreakdown: 'S_B = S_A × (PPP_B / PPP_A)',
    steps,
    dataAttribution: args.dataAttribution,
    chartMarket: marketInPeriod,
    chartPpp: pppInPeriod,
  };

  return { isValid: true, errors: {}, result };
}
