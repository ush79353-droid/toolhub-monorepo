import {
  calculateAdditionalHQLANeeded,
  calculateCoverageMultiple,
  calculateEstimatedEligibleHQLA,
  calculateLiquidityCoverageRatio,
  calculateLiquidityDifference,
  calculateNetCashOutflows,
  calculateRequiredHQLA,
  formatMoney,
  formatMultiple,
  formatPercent,
  interpretLcr,
} from './calculation';
import type {
  HqlaHelperResult,
  LcrFieldErrors,
  LcrInput,
  LcrResult,
  NetOutflowsHelperResult,
} from './types';

export interface LcrValidation {
  isValid: boolean;
  errors: LcrFieldErrors;
  result: LcrResult | null;
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

function tryHqlaHelper(input: LcrInput): {
  helper: HqlaHelperResult | null;
  errors: LcrFieldErrors;
  anyFilled: boolean;
} {
  const errors: LcrFieldErrors = {};
  const fields = [
    ['level1Assets', input.level1Assets, 'Level 1 assets'],
    ['level2AAssets', input.level2AAssets, 'Level 2A assets'],
    ['level2B25Assets', input.level2B25Assets, 'Level 2B (25%) assets'],
    ['level2B50Assets', input.level2B50Assets, 'Level 2B (50%) assets'],
  ] as const;

  const anyFilled = fields.some(([, raw]) => raw.trim() !== '');
  if (!anyFilled) return { helper: null, errors, anyFilled: false };

  const parsed = fields.map(([key, raw, label]) => {
    const p = parseMoney(raw === '' ? '0' : raw);
    const err = moneyError(p, label, { allowBlank: false });
    if (raw.trim() !== '' && err) {
      errors[key] = err;
    } else if (raw.trim() === '') {
      // treat blank helper fields as 0 when sibling fields filled
    } else if (p.invalid || p.negative) {
      errors[key] = err;
    }
    return p.value ?? 0;
  });

  if (Object.keys(errors).length > 0) {
    return { helper: null, errors, anyFilled: true };
  }

  const [l1, l2a, l2b25, l2b50] = parsed as [number, number, number, number];
  try {
    const est = calculateEstimatedEligibleHQLA(l1, l2a, l2b25, l2b50);
    const totalAdj = est.afterCaps;
    const level2Share =
      totalAdj > 0 ? ((est.adjustedL2A + est.adjustedL2B) / totalAdj) * 100 : 0;
    const level2BShare =
      totalAdj > 0 ? (est.adjustedL2B / totalAdj) * 100 : 0;

    const helper: HqlaHelperResult = {
      preliminary: est.preliminary,
      afterCaps: est.afterCaps,
      level2ShareOfAdjusted: level2Share,
      level2BShareOfAdjusted: level2BShare,
      cappedByLevel2: est.cappedByLevel2,
      cappedByLevel2B: est.cappedByLevel2B,
      formattedPreliminary: formatMoney(est.preliminary),
      formattedAfterCaps: formatMoney(est.afterCaps),
      note: 'Simplified educational HQLA estimate with illustrative 15%/40% composition caps. Not a full Basel/jurisdictional regulatory calculation (secured funding unwinds, eligibility, and local rules omitted).',
    };
    return { helper, errors, anyFilled: true };
  } catch (e) {
    errors.form =
      e instanceof Error ? e.message : 'Unable to estimate HQLA.';
    return { helper: null, errors, anyFilled: true };
  }
}

function tryNetOutflowsHelper(input: LcrInput): {
  helper: NetOutflowsHelperResult | null;
  errors: LcrFieldErrors;
} {
  const errors: LcrFieldErrors = {};
  const outFilled = input.totalCashOutflows.trim() !== '';
  const inFilled = input.totalCashInflows.trim() !== '';
  if (!outFilled && !inFilled) return { helper: null, errors };

  const out = parseMoney(input.totalCashOutflows);
  const inn = parseMoney(input.totalCashInflows);
  const outErr = moneyError(out, 'total cash outflows', {
    requirePositive: true,
  });
  const inErr = moneyError(inn, 'total cash inflows', { allowBlank: true });
  if (!outFilled) {
    errors.totalCashOutflows = 'Enter total cash outflows to use this helper.';
  } else if (outErr) errors.totalCashOutflows = outErr;
  if (inFilled && inErr) errors.totalCashInflows = inErr;
  if (errors.totalCashOutflows || errors.totalCashInflows) {
    return { helper: null, errors };
  }

  const inflows = inFilled ? inn.value! : 0;
  try {
    const net = calculateNetCashOutflows(out.value!, inflows, 0.75);
    const capped = Math.min(inflows, 0.75 * out.value!);
    return {
      helper: {
        totalOutflows: out.value!,
        totalInflows: inflows,
        cappedInflows: capped,
        netOutflows: net,
        formattedNet: formatMoney(net),
        note: 'Illustrative net outflows = Outflows − min(Inflows, 75% × Outflows). Regulatory inflow caps and exceptions vary by framework.',
      },
      errors,
    };
  } catch (e) {
    errors.form =
      e instanceof Error ? e.message : 'Unable to calculate net outflows.';
    return { helper: null, errors };
  }
}

export function validateLcrInput(input: LcrInput): LcrValidation {
  const errors: LcrFieldErrors = {};

  const hqlaHelper = tryHqlaHelper(input);
  Object.assign(errors, hqlaHelper.errors);

  const netHelper = tryNetOutflowsHelper(input);
  Object.assign(errors, netHelper.errors);

  // Prefer helper-populated values when main fields blank
  let hqlaRaw = input.highQualityLiquidAssets;
  let outRaw = input.netCashOutflows30Days;
  if (
    hqlaRaw.trim() === '' &&
    hqlaHelper.helper &&
    hqlaHelper.helper.afterCaps >= 0
  ) {
    hqlaRaw = String(hqlaHelper.helper.afterCaps);
  }
  if (
    outRaw.trim() === '' &&
    netHelper.helper &&
    netHelper.helper.netOutflows > 0
  ) {
    outRaw = String(netHelper.helper.netOutflows);
  }

  const hqla = parseMoney(hqlaRaw);
  const outflows = parseMoney(outRaw);

  const hqlaErr = moneyError(hqla, 'high-quality liquid assets');
  const outErr = moneyError(outflows, 'expected 30-day net cash outflows', {
    requirePositive: true,
  });
  if (hqlaErr) errors.highQualityLiquidAssets = hqlaErr;
  if (outErr) errors.netCashOutflows30Days = outErr;

  if (
    errors.highQualityLiquidAssets ||
    errors.netCashOutflows30Days ||
    errors.level1Assets ||
    errors.level2AAssets ||
    errors.level2B25Assets ||
    errors.level2B50Assets ||
    errors.totalCashOutflows ||
    errors.totalCashInflows ||
    errors.form
  ) {
    // Still allow returning helper-only if main invalid? Keep simple: invalid.
    return { isValid: false, errors, result: null };
  }

  const lcr = calculateLiquidityCoverageRatio(hqla.value!, outflows.value!);
  if (lcr == null) {
    errors.form = 'Unable to calculate LCR.';
    return { isValid: false, errors, result: null };
  }

  const multiple = calculateCoverageMultiple(hqla.value!, outflows.value!)!;
  const difference = calculateLiquidityDifference(
    hqla.value!,
    outflows.value!
  );
  const required = calculateRequiredHQLA(outflows.value!);
  const additional = calculateAdditionalHQLANeeded(
    hqla.value!,
    outflows.value!
  );
  const status = interpretLcr(lcr);

  const steps = [
    `Determine HQLA = ${formatMoney(hqla.value!)}.`,
    `Determine expected 30-day net cash outflows = ${formatMoney(outflows.value!)}.`,
    'Apply LCR = (HQLA / Net Cash Outflows) × 100.',
    `Substitute: ${formatMoney(hqla.value!)} / ${formatMoney(outflows.value!)} × 100.`,
    `Result: LCR = ${formatPercent(lcr)}.`,
    status.interpretation,
  ];

  const result: LcrResult = {
    hqla: hqla.value!,
    netCashOutflows: outflows.value!,
    lcrPercent: lcr,
    coverageMultiple: multiple,
    liquidityDifference: difference,
    requiredHqla: required,
    additionalHqlaNeeded: additional,
    status: status.status,
    formattedHqla: formatMoney(hqla.value!),
    formattedOutflows: formatMoney(outflows.value!),
    formattedLcr: formatPercent(lcr),
    formattedMultiple: formatMultiple(multiple),
    formattedDifference: formatMoney(difference),
    formattedRequired: formatMoney(required),
    formattedAdditional: formatMoney(additional),
    interpretation: status.interpretation,
    explanation:
      'Basel frameworks often reference a 100% LCR minimum for covered banks, but application varies by jurisdiction, phase-in, and supervisory circumstances. This tool is an educational estimate; not a compliance determination. Banks may be permitted to use HQLA buffers in genuine stress under supervisory expectations.',
    formulaBreakdown: `LCR = ${formatMoney(hqla.value!)} / ${formatMoney(outflows.value!)} × 100 = ${formatPercent(lcr)}`,
    steps,
    hqlaHelper: hqlaHelper.helper,
    netOutflowsHelper: netHelper.helper,
  };

  return { isValid: true, errors, result };
}
