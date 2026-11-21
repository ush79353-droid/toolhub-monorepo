import {
  calculateASF,
  calculateCoverageMultiple,
  calculateFundingGap,
  calculateFundingSensitivity,
  calculateFundingShortfall,
  calculateFundingSurplus,
  calculateNSFR,
  calculateRSF,
  formatMoney,
  formatMultiple,
  formatPercent,
  interpretNsfr,
} from './calculation';
import type {
  AsfHelperResult,
  NsfrFieldErrors,
  NsfrInput,
  NsfrResult,
  RsfHelperResult,
} from './types';

export interface NsfrValidation {
  isValid: boolean;
  errors: NsfrFieldErrors;
  result: NsfrResult | null;
}

function parseMoney(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  negative: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') {
    return { value: null, blank: true, invalid: false, negative: false };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  if (value < 0) {
    return { value: null, blank: false, invalid: false, negative: true };
  }
  return { value, blank: false, invalid: false, negative: false };
}

function moneyError(
  parsed: ReturnType<typeof parseMoney>,
  label: string,
  opts?: { allowBlank?: boolean; requirePositive?: boolean }
): string | undefined {
  if (parsed.blank) {
    return opts?.allowBlank ? undefined : `Enter ${label}.`;
  }
  if (parsed.invalid) return `Enter a valid ${label}.`;
  if (parsed.negative) return `${label} cannot be negative.`;
  if (opts?.requirePositive && parsed.value === 0) {
    return `${label} must be greater than zero.`;
  }
  return undefined;
}

const ASF_FIELDS = [
  ['regulatoryCapital', 'regulatory capital'],
  ['stableDeposits', 'stable deposits'],
  ['lessStableDeposits', 'less-stable deposits'],
  ['funding50Percent', '50% ASF funding'],
  ['funding0Percent', '0% ASF funding'],
] as const;

const RSF_FIELDS = [
  ['cashAndCentralBankReserves', 'cash / central-bank reserves'],
  ['unencumberedLevel1Hqla', 'Level 1 HQLA'],
  ['shortTermFinancialInstitution', 'short-term FI exposures'],
  ['level2AHqla', 'Level 2A HQLA'],
  ['level2BAndShortTerm', 'Level 2B / short-term assets'],
  ['residentialMortgages', 'residential mortgages'],
  ['otherPerformingLoans', 'other performing loans'],
  ['highRsfAssets', 'high-RSF assets'],
  ['offBalanceSheetCommitments', 'off-balance-sheet commitments'],
] as const;

function tryAsfHelper(input: NsfrInput): {
  helper: AsfHelperResult | null;
  errors: NsfrFieldErrors;
  anyFilled: boolean;
  weighted: number | null;
} {
  const errors: NsfrFieldErrors = {};
  const anyFilled = ASF_FIELDS.some(([key]) => input[key].trim() !== '');
  if (!anyFilled) return { helper: null, errors, anyFilled: false, weighted: null };

  const amounts: Record<string, number> = {};
  for (const [key, label] of ASF_FIELDS) {
    const raw = input[key];
    const p = parseMoney(raw === '' ? '0' : raw);
    if (raw.trim() !== '') {
      const err = moneyError(p, label);
      if (err) errors[key] = err;
    }
    amounts[key] = p.value ?? 0;
  }
  if (Object.keys(errors).length > 0) {
    return { helper: null, errors, anyFilled: true, weighted: null };
  }

  try {
    const calc = calculateASF({
      regulatoryCapital: amounts.regulatoryCapital!,
      stableDeposits: amounts.stableDeposits!,
      lessStableDeposits: amounts.lessStableDeposits!,
      funding50Percent: amounts.funding50Percent!,
      funding0Percent: amounts.funding0Percent!,
    });
    const helper: AsfHelperResult = {
      lines: calc.lines.map((l) => ({
        label: l.label,
        amount: l.amount,
        factor: l.factor,
        weighted: l.weighted,
        formattedAmount: formatMoney(l.amount),
        formattedWeighted: formatMoney(l.weighted),
      })),
      unweightedTotal: calc.unweightedTotal,
      weightedTotal: calc.weightedTotal,
      formattedUnweighted: formatMoney(calc.unweightedTotal),
      formattedWeighted: formatMoney(calc.weightedTotal),
      note: 'Illustrative ASF weights for education. Eligibility, maturity, and jurisdictional rules are simplified — not a regulatory filing.',
    };
    return {
      helper,
      errors,
      anyFilled: true,
      weighted: calc.weightedTotal,
    };
  } catch (e) {
    return {
      helper: null,
      errors: {
        form: e instanceof Error ? e.message : 'Unable to calculate ASF.',
      },
      anyFilled: true,
      weighted: null,
    };
  }
}

function tryRsfHelper(input: NsfrInput): {
  helper: RsfHelperResult | null;
  errors: NsfrFieldErrors;
  anyFilled: boolean;
  weighted: number | null;
} {
  const errors: NsfrFieldErrors = {};
  const anyFilled = RSF_FIELDS.some(([key]) => input[key].trim() !== '');
  if (!anyFilled) return { helper: null, errors, anyFilled: false, weighted: null };

  const amounts: Record<string, number> = {};
  for (const [key, label] of RSF_FIELDS) {
    const raw = input[key];
    const p = parseMoney(raw === '' ? '0' : raw);
    if (raw.trim() !== '') {
      const err = moneyError(p, label);
      if (err) errors[key] = err;
    }
    amounts[key] = p.value ?? 0;
  }
  if (Object.keys(errors).length > 0) {
    return { helper: null, errors, anyFilled: true, weighted: null };
  }

  try {
    const calc = calculateRSF({
      cashAndCentralBankReserves: amounts.cashAndCentralBankReserves!,
      unencumberedLevel1Hqla: amounts.unencumberedLevel1Hqla!,
      shortTermFinancialInstitution: amounts.shortTermFinancialInstitution!,
      level2AHqla: amounts.level2AHqla!,
      level2BAndShortTerm: amounts.level2BAndShortTerm!,
      residentialMortgages: amounts.residentialMortgages!,
      otherPerformingLoans: amounts.otherPerformingLoans!,
      highRsfAssets: amounts.highRsfAssets!,
      offBalanceSheetCommitments: amounts.offBalanceSheetCommitments!,
    });
    const helper: RsfHelperResult = {
      lines: calc.lines.map((l) => ({
        label: l.label,
        amount: l.amount,
        factor: l.factor,
        weighted: l.weighted,
        formattedAmount: formatMoney(l.amount),
        formattedWeighted: formatMoney(l.weighted),
      })),
      unweightedTotal: calc.unweightedTotal,
      weightedTotal: calc.weightedTotal,
      formattedUnweighted: formatMoney(calc.unweightedTotal),
      formattedWeighted: formatMoney(calc.weightedTotal),
      note: 'Illustrative RSF factors only. Asset type, maturity, encumbrance, and local rules omitted — educational estimate.',
    };
    return {
      helper,
      errors,
      anyFilled: true,
      weighted: calc.weightedTotal,
    };
  } catch (e) {
    return {
      helper: null,
      errors: {
        form: e instanceof Error ? e.message : 'Unable to calculate RSF.',
      },
      anyFilled: true,
      weighted: null,
    };
  }
}

export function validateNsfrInput(input: NsfrInput): NsfrValidation {
  const errors: NsfrFieldErrors = {};
  const asfHelper = tryAsfHelper(input);
  const rsfHelper = tryRsfHelper(input);
  Object.assign(errors, asfHelper.errors, rsfHelper.errors);

  const asfDirect = parseMoney(input.availableStableFunding);
  const rsfDirect = parseMoney(input.requiredStableFunding);

  let asf: number | null = null;
  let rsf: number | null = null;

  if (asfHelper.anyFilled && asfHelper.weighted != null) {
    asf = asfHelper.weighted;
  } else {
    const err = moneyError(asfDirect, 'available stable funding');
    if (err) errors.availableStableFunding = err;
    else asf = asfDirect.value;
  }

  if (rsfHelper.anyFilled && rsfHelper.weighted != null) {
    rsf = rsfHelper.weighted;
    if (rsf <= 0) {
      errors.form =
        'Calculated Required Stable Funding must be greater than zero to compute NSFR.';
    }
  } else {
    const err = moneyError(rsfDirect, 'required stable funding', {
      requirePositive: true,
    });
    if (err) {
      errors.requiredStableFunding =
        rsfDirect.value === 0
          ? 'NSFR cannot be calculated because Required Stable Funding must be greater than zero.'
          : err;
    } else rsf = rsfDirect.value;
  }

  if (Object.keys(errors).length > 0 || asf == null || rsf == null || rsf <= 0) {
    return { isValid: false, errors, result: null };
  }

  const nsfr = calculateNSFR(asf, rsf);
  if (nsfr == null) {
    return {
      isValid: false,
      errors: {
        form: 'NSFR cannot be calculated because Required Stable Funding must be greater than zero.',
      },
      result: null,
    };
  }

  const multiple = calculateCoverageMultiple(asf, rsf)!;
  const gap = calculateFundingGap(asf, rsf)!;
  const shortfall = calculateFundingShortfall(asf, rsf)!;
  const surplus = calculateFundingSurplus(asf, rsf)!;
  const { status, interpretation } = interpretNsfr(nsfr);

  const steps = [
    `Determine Available Stable Funding (ASF) = ${formatMoney(asf)}.`,
    `Determine Required Stable Funding (RSF) = ${formatMoney(rsf)}.`,
    'Apply NSFR = (ASF / RSF) × 100.',
    `Substitute: (${formatMoney(asf)} / ${formatMoney(rsf)}) × 100.`,
    `NSFR = ${formatPercent(nsfr)}.`,
    `Funding gap (ASF − RSF) = ${formatMoney(gap)}.`,
    interpretation,
  ];

  const result: NsfrResult = {
    asf,
    rsf,
    nsfrPercent: nsfr,
    coverageMultiple: multiple,
    fundingGap: gap,
    shortfallTo100: shortfall,
    surplusAbove100: surplus,
    status,
    formattedAsf: formatMoney(asf),
    formattedRsf: formatMoney(rsf),
    formattedNsfr: formatPercent(nsfr),
    formattedMultiple: formatMultiple(multiple),
    formattedGap: formatMoney(gap),
    formattedShortfall: formatMoney(shortfall),
    formattedSurplus: formatMoney(surplus),
    interpretation,
    explanation:
      'This calculator provides an educational NSFR estimate. Regulatory reporting requires the applicable supervisory rules, eligibility criteria, classifications, and reporting instructions. An NSFR above 100% does not prove a bank is free of liquidity risk.',
    formulaBreakdown: 'NSFR = (ASF / RSF) × 100',
    steps,
    asfHelper: asfHelper.helper,
    rsfHelper: rsfHelper.helper,
    sensitivity: calculateFundingSensitivity(asf, rsf),
  };

  return { isValid: true, errors: {}, result };
}
