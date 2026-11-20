import {
  taxWithPreferentialIncome,
} from '../income-tax/calculation';
import { YEAR_PARAMS } from '../income-tax/tax-parameters';
import type { FilingStatus } from '../income-tax/types';
import type { PreMarriageStatus } from './types';

const TAX_YEAR = 2026 as const;
const SS_WAGE_BASE_2026 = 184_500;
const SE_RATE = 0.153;
const SE_BASE_FACTOR = 0.9235;
const ADDITIONAL_MEDICARE_THRESHOLD_SINGLE = 200_000;
const ADDITIONAL_MEDICARE_THRESHOLD_JOINT = 250_000;
const ADDITIONAL_MEDICARE_RATE = 0.009;

export function formatMarriageTaxUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export interface SpouseAmounts {
  salaryBusiness: number;
  interestDividends: number;
  rentalPassive: number;
  shortTermGain: number;
  longTermGain: number;
  qualifiedDividends: number;
  retirementSavings: number;
  fileStatus: PreMarriageStatus;
  dependents: number;
  useStandardDeduction: boolean;
  stateCityTaxRatePercent: number;
  selfEmployed: boolean;
}

function mapStatus(status: PreMarriageStatus | 'married-joint'): FilingStatus {
  if (status === 'married-joint') return 'married-joint';
  if (status === 'head-of-household') return 'head-of-household';
  return 'single';
}

/**
 * Educational TY 2026 estimate for one filing unit (one spouse alone or MFJ combined).
 * Reuses Income Tax ordinary/LTCG bracket helpers and YEAR_PARAMS[2026].
 * Does not invent Schedule A line items when standard deduction is declined
 * (itemized amounts are not collected on the screenshot) — deduction = 0 then.
 */
export function estimateFilingUnit(input: {
  amounts: readonly SpouseAmounts[];
  status: PreMarriageStatus | 'married-joint';
}): {
  agi: number;
  taxableIncome: number;
  federalTax: number;
  seTax: number;
  stateTax: number;
  totalTax: number;
} | null {
  const params = YEAR_PARAMS[TAX_YEAR];
  const status = mapStatus(input.status);

  let salaryBusiness = 0;
  let interestDividends = 0;
  let rentalPassive = 0;
  let shortTermGain = 0;
  let longTermGain = 0;
  let qualifiedDividends = 0;
  let retirementSavings = 0;
  let dependents = 0;
  let stateRateSumWeighted = 0;
  let stateBase = 0;
  let seIncome = 0;

  for (const s of input.amounts) {
    if (
      ![
        s.salaryBusiness,
        s.interestDividends,
        s.rentalPassive,
        s.shortTermGain,
        s.longTermGain,
        s.qualifiedDividends,
        s.retirementSavings,
        s.dependents,
        s.stateCityTaxRatePercent,
      ].every(Number.isFinite)
    ) {
      return null;
    }
    if (
      s.salaryBusiness < 0 ||
      s.interestDividends < 0 ||
      s.rentalPassive < 0 ||
      s.shortTermGain < 0 ||
      s.longTermGain < 0 ||
      s.qualifiedDividends < 0 ||
      s.retirementSavings < 0 ||
      s.dependents < 0 ||
      s.stateCityTaxRatePercent < 0
    ) {
      return null;
    }

    salaryBusiness += s.salaryBusiness;
    interestDividends += s.interestDividends;
    rentalPassive += s.rentalPassive;
    shortTermGain += s.shortTermGain;
    longTermGain += s.longTermGain;
    qualifiedDividends += s.qualifiedDividends;
    retirementSavings += s.retirementSavings;
    dependents += Math.floor(s.dependents);

    const ordinaryBase =
      s.salaryBusiness +
      s.interestDividends +
      s.rentalPassive +
      s.shortTermGain;
    stateBase += ordinaryBase;
    stateRateSumWeighted += ordinaryBase * (s.stateCityTaxRatePercent / 100);

    if (s.selfEmployed) {
      seIncome += s.salaryBusiness;
    }
  }

  const gross =
    salaryBusiness +
    interestDividends +
    rentalPassive +
    shortTermGain +
    longTermGain +
    qualifiedDividends;
  const agi = Math.max(0, gross - retirementSavings);

  const useStd = input.amounts.every((s) => s.useStandardDeduction);
  const deduction = useStd ? params.standardDeduction[status] : 0;
  const taxableIncome = Math.max(0, agi - deduction);

  const preferential = longTermGain + qualifiedDividends;
  const federalBeforeCredits = taxWithPreferentialIncome({
    taxableIncome,
    qualifiedAndLtcg: Math.min(preferential, taxableIncome),
    brackets: params.ordinaryBrackets[status],
    zeroMax: params.ltcgZeroMax[status],
    fifteenMax: params.ltcgFifteenMax[status],
  });

  // Simplified CTC: $2,200 × dependents, phaseout by filing status (Sch. 8812 style).
  let ctc = dependents * params.childTaxCreditPerChild;
  const over = Math.max(0, agi - params.ctcPhaseoutStart[status]);
  const steps = over > 0 ? Math.ceil(over / 1_000) : 0;
  ctc = Math.max(0, ctc - steps * 50);
  const federalTax = Math.max(0, federalBeforeCredits - ctc);

  // SE tax: Social Security + Medicare on SE base (simplified; employer half not deducted here).
  let seTax = 0;
  if (seIncome > 0) {
    const seBase = seIncome * SE_BASE_FACTOR;
    const ssBase = Math.min(seBase, SS_WAGE_BASE_2026);
    const ss = ssBase * 0.124;
    const medicare = seBase * 0.029;
    const addlThreshold =
      status === 'married-joint'
        ? ADDITIONAL_MEDICARE_THRESHOLD_JOINT
        : ADDITIONAL_MEDICARE_THRESHOLD_SINGLE;
    const addl = Math.max(0, seBase - addlThreshold) * ADDITIONAL_MEDICARE_RATE;
    seTax = ss + medicare + addl;
    void SE_RATE;
  }

  const stateTax =
    stateBase > 0 ? stateRateSumWeighted : 0;

  const totalTax = federalTax + seTax + stateTax;
  if (![agi, taxableIncome, federalTax, seTax, stateTax, totalTax].every(Number.isFinite)) {
    return null;
  }

  return { agi, taxableIncome, federalTax, seTax, stateTax, totalTax };
}

export function calculateMarriageTax(input: {
  spouse1: SpouseAmounts;
  spouse2: SpouseAmounts;
}): {
  before: ReturnType<typeof estimateFilingUnit> & object;
  after: ReturnType<typeof estimateFilingUnit> & object;
  difference: number;
} | null {
  const before1 = estimateFilingUnit({
    amounts: [input.spouse1],
    status: input.spouse1.fileStatus,
  });
  const before2 = estimateFilingUnit({
    amounts: [input.spouse2],
    status: input.spouse2.fileStatus,
  });
  if (!before1 || !before2) return null;

  const before = {
    agi: before1.agi + before2.agi,
    taxableIncome: before1.taxableIncome + before2.taxableIncome,
    federalTax: before1.federalTax + before2.federalTax,
    seTax: before1.seTax + before2.seTax,
    stateTax: before1.stateTax + before2.stateTax,
    totalTax: before1.totalTax + before2.totalTax,
  };

  const after = estimateFilingUnit({
    amounts: [input.spouse1, input.spouse2],
    status: 'married-joint',
  });
  if (!after) return null;

  const difference = after.totalTax - before.totalTax;
  if (!Number.isFinite(difference)) return null;

  return { before, after, difference };
}
