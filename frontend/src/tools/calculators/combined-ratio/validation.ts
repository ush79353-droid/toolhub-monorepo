import {
  buildFromComponents,
  buildFromLossExpense,
  solveLossExpenseFromRatio,
  solvePremiums,
  solveUnderwritingExpense,
  toCombinedRatioResult,
} from './calculation';
import type {
  CombinedRatioFieldErrors,
  CombinedRatioInput,
  CombinedRatioResult,
} from './types';

function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return value;
}

function requireNonNegative(
  value: number | null,
  emptyMsg: string,
  negMsg: string,
): string | undefined {
  if (value === null) return emptyMsg;
  if (value < 0) return negMsg;
  return undefined;
}

export function validateCombinedRatioInput(input: CombinedRatioInput): {
  isValid: boolean;
  errors: CombinedRatioFieldErrors;
  result: CombinedRatioResult | null;
} {
  const errors: CombinedRatioFieldErrors = {};
  const cl = parseNumber(input.claimLoss);
  const la = parseNumber(input.lossAdjustments);
  const le = parseNumber(input.lossExpense);
  const p = parseNumber(input.premiums);
  const ue = parseNumber(input.underwritingExpense);
  const cr = parseNumber(input.combinedRatio);

  const driver = input.driver;

  if (driver === 'combinedRatio') {
    const crErr = requireNonNegative(
      cr,
      'Enter a combined ratio.',
      'Combined ratio cannot be negative in standard mode.',
    );
    if (crErr) errors.combinedRatio = crErr;

    if (input.ratioSolveTarget === 'underwritingExpense') {
      const pErr =
        p === null
          ? 'Enter premiums.'
          : !(p > 0)
            ? 'Premiums must be greater than zero to calculate the combined ratio.'
            : undefined;
      if (pErr) errors.premiums = pErr;

      // Need LE: from LE field or CL+LA
      let lossExpense = le;
      let claimLoss = cl;
      let lossAdjustments = la;

      if (lossExpense === null && cl !== null && la !== null && cl >= 0 && la >= 0) {
        lossExpense = cl + la;
      }
      if (lossExpense === null) {
        if (cl === null) errors.claimLoss = 'Enter claim loss (or total loss expense).';
        if (la === null) errors.lossAdjustments = 'Enter loss adjustments (or total loss expense).';
        if (!errors.claimLoss && !errors.lossAdjustments && le === null) {
          errors.lossExpense = 'Enter loss expense or both claim loss and loss adjustments.';
        }
      } else if (lossExpense < 0) {
        errors.lossExpense = 'Loss expense cannot be negative.';
      } else {
        if (claimLoss === null && lossAdjustments !== null && lossAdjustments >= 0) {
          claimLoss = lossExpense - lossAdjustments;
        } else if (lossAdjustments === null && claimLoss !== null && claimLoss >= 0) {
          lossAdjustments = lossExpense - claimLoss;
        } else if (claimLoss === null && lossAdjustments === null) {
          // Default: treat all LE as claim loss, adjustments 0
          claimLoss = lossExpense;
          lossAdjustments = 0;
        }
        if (
          claimLoss === null ||
          lossAdjustments === null ||
          claimLoss < 0 ||
          lossAdjustments < 0
        ) {
          errors.lossExpense =
            'Cannot split loss expense with the current claim / adjustment values.';
        }
      }

      if (Object.keys(errors).length > 0 || cr === null || p === null || lossExpense === null) {
        return { isValid: false, errors, result: null };
      }

      const breakdown = solveUnderwritingExpense(
        cr,
        p,
        lossExpense,
        claimLoss!,
        lossAdjustments!,
      );
      if (!breakdown) {
        return {
          isValid: false,
          errors: {
            form: 'Unable to solve underwriting expense. Check that (CR% × premiums) ≥ loss expense.',
          },
          result: null,
        };
      }
      return {
        isValid: true,
        errors: {},
        result: toCombinedRatioResult(breakdown, input.currency),
      };
    }

    if (input.ratioSolveTarget === 'premiums') {
      if (ue === null) errors.underwritingExpense = 'Enter underwriting expense.';
      else if (ue < 0) errors.underwritingExpense = 'Underwriting expense cannot be negative.';

      let lossExpense = le;
      let claimLoss = cl;
      let lossAdjustments = la;
      if (lossExpense === null && cl !== null && la !== null && cl >= 0 && la >= 0) {
        lossExpense = cl + la;
      }
      if (lossExpense === null) {
        errors.lossExpense = 'Enter loss expense or both claim loss and loss adjustments.';
      } else if (lossExpense < 0) {
        errors.lossExpense = 'Loss expense cannot be negative.';
      } else {
        if (claimLoss === null && lossAdjustments !== null && lossAdjustments >= 0) {
          claimLoss = lossExpense - lossAdjustments;
        } else if (lossAdjustments === null && claimLoss !== null && claimLoss >= 0) {
          lossAdjustments = lossExpense - claimLoss;
        } else if (claimLoss === null && lossAdjustments === null) {
          claimLoss = lossExpense;
          lossAdjustments = 0;
        }
        if (
          claimLoss === null ||
          lossAdjustments === null ||
          claimLoss < 0 ||
          lossAdjustments < 0
        ) {
          errors.lossExpense =
            'Cannot split loss expense with the current claim / adjustment values.';
        }
      }

      if (cr !== null && !(cr > 0)) {
        errors.combinedRatio = 'Combined ratio must be greater than zero to solve premiums.';
      }

      if (
        Object.keys(errors).length > 0 ||
        cr === null ||
        ue === null ||
        lossExpense === null ||
        claimLoss === null ||
        lossAdjustments === null
      ) {
        return { isValid: false, errors, result: null };
      }

      const breakdown = solvePremiums(cr, lossExpense, ue, claimLoss, lossAdjustments);
      if (!breakdown) {
        return {
          isValid: false,
          errors: { form: 'Unable to solve premiums with the current inputs.' },
          result: null,
        };
      }
      return {
        isValid: true,
        errors: {},
        result: toCombinedRatioResult(breakdown, input.currency),
      };
    }

    // solve lossExpense from CR, P, UE
    const pErr =
      p === null
        ? 'Enter premiums.'
        : !(p > 0)
          ? 'Premiums must be greater than zero to calculate the combined ratio.'
          : undefined;
    if (pErr) errors.premiums = pErr;
    if (ue === null) errors.underwritingExpense = 'Enter underwriting expense.';
    else if (ue < 0) errors.underwritingExpense = 'Underwriting expense cannot be negative.';

    const fixed = input.fixedLossComponent;
    if (fixed === 'lossAdjustments') {
      if (la === null) errors.lossAdjustments = 'Enter loss adjustments to split loss expense.';
      else if (la < 0) errors.lossAdjustments = 'Loss adjustments cannot be negative.';
    } else {
      if (cl === null) errors.claimLoss = 'Enter claim loss to split loss expense.';
      else if (cl < 0) errors.claimLoss = 'Claim loss cannot be negative.';
    }

    if (Object.keys(errors).length > 0 || cr === null || p === null || ue === null) {
      return { isValid: false, errors, result: null };
    }

    const breakdown = solveLossExpenseFromRatio(
      cr,
      p,
      ue,
      cl,
      la,
      fixed,
    );
    if (!breakdown) {
      return {
        isValid: false,
        errors: {
          form: 'Unable to solve loss expense. Check that (CR% × premiums) ≥ underwriting expense and the fixed loss component fits.',
        },
        result: null,
      };
    }
    return {
      isValid: true,
      errors: {},
      result: toCombinedRatioResult(breakdown, input.currency),
    };
  }

  if (driver === 'lossExpense') {
    const leErr = requireNonNegative(
      le,
      'Enter loss expense.',
      'Loss expense cannot be negative.',
    );
    if (leErr) errors.lossExpense = leErr;

    const fixed = input.fixedLossComponent;
    let claimLoss = cl;
    let lossAdjustments = la;

    if (fixed === 'lossAdjustments') {
      const laErr = requireNonNegative(
        la,
        'Enter loss adjustments.',
        'Loss adjustments cannot be negative.',
      );
      if (laErr) errors.lossAdjustments = laErr;
      else if (le !== null && la !== null) {
        claimLoss = le - la;
        if (claimLoss < 0) {
          errors.lossExpense = 'Loss expense must be at least as large as loss adjustments.';
        }
      }
    } else {
      const clErr = requireNonNegative(
        cl,
        'Enter claim loss.',
        'Claim loss cannot be negative.',
      );
      if (clErr) errors.claimLoss = clErr;
      else if (le !== null && cl !== null) {
        lossAdjustments = le - cl;
        if (lossAdjustments < 0) {
          errors.lossExpense = 'Loss expense must be at least as large as claim loss.';
        }
      }
    }

    const pErr =
      p === null
        ? 'Enter premiums.'
        : !(p > 0)
          ? 'Premiums must be greater than zero to calculate the combined ratio.'
          : undefined;
    if (pErr) errors.premiums = pErr;

    const ueErr = requireNonNegative(
      ue,
      'Enter underwriting expense.',
      'Underwriting expense cannot be negative.',
    );
    if (ueErr) errors.underwritingExpense = ueErr;

    if (
      Object.keys(errors).length > 0 ||
      le === null ||
      claimLoss === null ||
      lossAdjustments === null ||
      p === null ||
      ue === null
    ) {
      return { isValid: false, errors, result: null };
    }

    const breakdown = buildFromLossExpense(le, claimLoss, lossAdjustments, p, ue);
    if (!breakdown) {
      return {
        isValid: false,
        errors: { form: 'Unable to calculate combined ratio with the current inputs.' },
        result: null,
      };
    }
    return {
      isValid: true,
      errors: {},
      result: toCombinedRatioResult(breakdown, input.currency),
    };
  }

  // Standard / component drivers: CL + LA + P + UE
  const clErr = requireNonNegative(
    cl,
    'Enter claim loss.',
    'Claim loss cannot be negative.',
  );
  if (clErr) errors.claimLoss = clErr;

  const laErr = requireNonNegative(
    la,
    'Enter loss adjustments.',
    'Loss adjustments cannot be negative.',
  );
  if (laErr) errors.lossAdjustments = laErr;

  const pErr =
    p === null
      ? 'Enter premiums.'
      : !(p > 0)
        ? 'Premiums must be greater than zero to calculate the combined ratio.'
        : undefined;
  if (pErr) errors.premiums = pErr;

  const ueErr = requireNonNegative(
    ue,
    'Enter underwriting expense.',
    'Underwriting expense cannot be negative.',
  );
  if (ueErr) errors.underwritingExpense = ueErr;

  if (Object.keys(errors).length > 0 || cl === null || la === null || p === null || ue === null) {
    return { isValid: false, errors, result: null };
  }

  const breakdown = buildFromComponents(cl, la, p, ue);
  if (!breakdown) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate combined ratio with the current inputs.' },
      result: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    result: toCombinedRatioResult(breakdown, input.currency),
  };
}
