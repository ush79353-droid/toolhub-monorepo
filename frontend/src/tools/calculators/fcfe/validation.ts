import {
  calculateFcfeFromCfo,
  calculateFcfeFromEbit,
  calculateFcfeFromEbitda,
  calculateFcfeFromFcff,
  calculateFcfeFromNetIncome,
  calculateNetBorrowingFromDebtBalances,
  formatFcfeMoney,
  interpretFcfe,
  parseTaxRatePercent,
} from './calculation';
import type {
  FcfeFieldErrors,
  FcfeInput,
  FcfeResult,
} from './types';

export interface FcfeValidation {
  isValid: boolean;
  errors: FcfeFieldErrors;
  result: FcfeResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function requireSigned(
  parsed: ReturnType<typeof parseNumber>,
  label: string
): string | undefined {
  if (parsed.blank) return undefined;
  if (parsed.invalid || parsed.value === null) {
    return `Enter a valid ${label}.`;
  }
  return undefined;
}

function requireNonneg(
  parsed: ReturnType<typeof parseNumber>,
  label: string
): string | undefined {
  if (parsed.blank) return undefined;
  if (parsed.invalid || parsed.value === null) {
    return `Enter a valid ${label}.`;
  }
  if (parsed.value < 0) return `${label} cannot be negative.`;
  return undefined;
}

export function validateFcfeInput(input: FcfeInput): FcfeValidation {
  const errors: FcfeFieldErrors = {};
  const currency = input.currency;
  const method = input.method;

  const ni = parseNumber(input.netIncome);
  const ebitda = parseNumber(input.ebitda);
  const ebit = parseNumber(input.ebit);
  const cfo = parseNumber(input.operatingCashFlow);
  const fcff = parseNumber(input.freeCashFlowToFirm);
  const interest = parseNumber(input.interestExpense);
  const tax = parseTaxRatePercent(input.effectiveTaxRate);
  const beginDebt = parseNumber(input.beginningTotalDebt);
  const endDebt = parseNumber(input.endingTotalDebt);
  const directNb = parseNumber(input.directNetBorrowing);
  const da = parseNumber(input.depreciationAmortization);
  const capex = parseNumber(input.fixedCapitalInvestment);
  const wc = parseNumber(input.workingCapitalInvestment);

  // Method-specific source
  if (method === 'netIncome') {
    const e = requireSigned(ni, 'net income');
    if (e) errors.netIncome = e;
  } else if (method === 'ebitda') {
    const e = requireSigned(ebitda, 'EBITDA');
    if (e) errors.ebitda = e;
  } else if (method === 'ebit') {
    const e = requireSigned(ebit, 'EBIT');
    if (e) errors.ebit = e;
  } else if (method === 'cfo') {
    const e = requireSigned(cfo, 'operating cash flow');
    if (e) errors.operatingCashFlow = e;
  } else if (method === 'fcff') {
    const e = requireSigned(fcff, 'FCFF');
    if (e) errors.freeCashFlowToFirm = e;
  }

  // Interest / tax for ebitda, ebit, fcff
  if (method === 'ebitda' || method === 'ebit' || method === 'fcff') {
    const ie = requireNonneg(interest, 'Interest expense');
    if (ie) errors.interestExpense = ie;
    if (!tax.blank && tax.invalid) {
      errors.effectiveTaxRate = tax.error ?? 'Enter a valid tax rate.';
    }
  }

  // Net borrowing
  if (input.netBorrowingSource === 'debtBalances') {
    const be = requireNonneg(beginDebt, 'Beginning total debt');
    if (be) errors.beginningTotalDebt = be;
    const ee = requireNonneg(endDebt, 'Ending total debt');
    if (ee) errors.endingTotalDebt = ee;
  } else {
    const de = requireSigned(directNb, 'net borrowing');
    if (de) errors.directNetBorrowing = de;
  }

  // Adjustments by method
  if (method === 'netIncome' || method === 'ebitda' || method === 'ebit') {
    const dae = requireNonneg(da, 'Depreciation and amortization');
    if (dae) errors.depreciationAmortization = dae;
    const ce = requireNonneg(capex, 'Fixed capital investment');
    if (ce) errors.fixedCapitalInvestment = ce;
    const we = requireSigned(wc, 'working capital investment');
    if (we) errors.workingCapitalInvestment = we;
  } else if (method === 'cfo') {
    const ce = requireNonneg(capex, 'Fixed capital investment');
    if (ce) errors.fixedCapitalInvestment = ce;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  // Completeness
  let incomplete = false;
  if (method === 'netIncome' && (ni.blank || ni.value === null)) incomplete = true;
  if (method === 'ebitda' && (ebitda.blank || ebitda.value === null)) incomplete = true;
  if (method === 'ebit' && (ebit.blank || ebit.value === null)) incomplete = true;
  if (method === 'cfo' && (cfo.blank || cfo.value === null)) incomplete = true;
  if (method === 'fcff' && (fcff.blank || fcff.value === null)) incomplete = true;

  if (method === 'ebitda' || method === 'ebit' || method === 'fcff') {
    if (interest.blank || interest.value === null || tax.blank || tax.rate === null) {
      incomplete = true;
    }
  }

  if (input.netBorrowingSource === 'debtBalances') {
    if (
      beginDebt.blank ||
      endDebt.blank ||
      beginDebt.value === null ||
      endDebt.value === null
    ) {
      incomplete = true;
    }
  } else if (directNb.blank || directNb.value === null) {
    incomplete = true;
  }

  if (method === 'netIncome' || method === 'ebitda' || method === 'ebit') {
    if (
      da.blank ||
      capex.blank ||
      wc.blank ||
      da.value === null ||
      capex.value === null ||
      wc.value === null
    ) {
      incomplete = true;
    }
  } else if (method === 'cfo') {
    if (capex.blank || capex.value === null) incomplete = true;
  }

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  let netBorrowing: number | null;
  if (input.netBorrowingSource === 'debtBalances') {
    netBorrowing = calculateNetBorrowingFromDebtBalances(
      beginDebt.value!,
      endDebt.value!
    );
  } else {
    netBorrowing = directNb.value;
  }
  if (netBorrowing === null) {
    return { isValid: false, errors, result: null };
  }

  let fcfe: number | null = null;
  let calculatedNetIncome: number | null = null;
  let warningMessage: string | null =
    'Amounts share one currency label (no FX conversion). Simplified effective-tax estimates do not invent refunds for pretax losses.';

  if (method === 'netIncome') {
    fcfe = calculateFcfeFromNetIncome(
      ni.value!,
      da.value!,
      capex.value!,
      wc.value!,
      netBorrowing
    );
    calculatedNetIncome = ni.value!;
    warningMessage =
      'Net income already reflects interest and taxes; do not subtract them again. Enter CapEx as a positive outflow.';
  } else if (method === 'ebitda') {
    const out = calculateFcfeFromEbitda(
      ebitda.value!,
      da.value!,
      interest.value!,
      tax.rate!,
      capex.value!,
      wc.value!,
      netBorrowing
    );
    if (out) {
      fcfe = out.fcfe;
      calculatedNetIncome = out.netIncome;
    }
    warningMessage =
      'EBITDA path estimates NI = (EBITDA − D&A − Interest) × (1 − t) for positive pretax earnings; pretax losses use NI = pretax with no automatic tax refund.';
  } else if (method === 'ebit') {
    const out = calculateFcfeFromEbit(
      ebit.value!,
      interest.value!,
      tax.rate!,
      da.value!,
      capex.value!,
      wc.value!,
      netBorrowing
    );
    if (out) {
      fcfe = out.fcfe;
      calculatedNetIncome = out.netIncome;
    }
    warningMessage =
      'EBIT path estimates NI = (EBIT − Interest) × (1 − t) for positive pretax earnings; pretax losses use NI = pretax with no automatic tax refund.';
  } else if (method === 'cfo') {
    fcfe = calculateFcfeFromCfo(cfo.value!, capex.value!, netBorrowing);
    warningMessage =
      'CFO mode assumes after-interest operating cash flow. D&A and working-capital changes are already in CFO; do not subtract them again.';
  } else if (method === 'fcff') {
    fcfe = calculateFcfeFromFcff(
      fcff.value!,
      interest.value!,
      tax.rate!,
      netBorrowing
    );
    warningMessage =
      'FCFF mode uses FCFE = FCFF − Interest(1 − t) + Net borrowing. CapEx and ΔNWC are already in FCFF.';
  }

  if (fcfe === null) {
    return { isValid: false, errors, result: null };
  }

  const result: FcfeResult = {
    method,
    netBorrowing,
    calculatedNetIncome,
    freeCashFlowToEquity: fcfe,
    status: 'valid',
    interpretation: interpretFcfe(fcfe),
    warningMessage,
    currency,
    formattedNetBorrowing: formatFcfeMoney(netBorrowing, currency),
    formattedCalculatedNetIncome:
      calculatedNetIncome === null
        ? null
        : formatFcfeMoney(calculatedNetIncome, currency),
    formattedFreeCashFlowToEquity: formatFcfeMoney(fcfe, currency),
  };

  return { isValid: true, errors, result };
}
