import {
  buildSpendingRounds,
  calculateMPC,
  calculateMPS,
  calculateMpcFromMultiplier,
  calculateMpsFromMultiplier,
  calculateOutputChange,
  calculateRequiredSpendingChange,
  calculateSpendingMultiplierFromMPC,
  calculateSpendingMultiplierFromMPS,
  formatDisplayAmount,
  formatMoneyAmount,
  formatMultiplier,
  formatPercent,
  formatPropensity,
  fromBaseUnits,
  toBaseUnits,
} from './calculation';
import type {
  SpendingMultiplierFieldErrors,
  SpendingMultiplierInput,
  SpendingMultiplierResult,
} from './types';

export interface SpendingMultiplierValidation {
  isValid: boolean;
  errors: SpendingMultiplierFieldErrors;
  result: SpendingMultiplierResult | null;
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

export function validateSpendingMultiplierInput(
  input: SpendingMultiplierInput
): SpendingMultiplierValidation {
  const errors: SpendingMultiplierFieldErrors = {};
  const mag = input.magnitude;

  const mpcP = parseNumber(input.mpc);
  const mpsP = parseNumber(input.mps);
  const kP = parseNumber(input.multiplier);
  const aP = parseNumber(input.autonomousSpending);
  const yP = parseNumber(input.targetOutputChange);
  const obsP = parseNumber(input.observedGdpChange);
  const roundsP = parseNumber(input.roundsToShow);

  let mpc: number | null = null;
  let mps: number | null = null;
  let multiplier: number | null = null;
  let multiplierUndefined = false;

  if (input.propensitySource === 'mpc') {
    if (mpcP.blank) errors.mpc = 'Enter the marginal propensity to consume.';
    else if (mpcP.invalid || mpcP.value == null)
      errors.mpc = 'Enter a valid MPC.';
    else if (mpcP.value < 0 || mpcP.value > 1)
      errors.mpc = 'MPC must be between 0 and 1 in the standard model.';
    else {
      mpc = mpcP.value;
      mps = calculateMPS(mpc)!;
      if (mpc >= 1) {
        multiplierUndefined = true;
      } else {
        multiplier = calculateSpendingMultiplierFromMPC(mpc);
      }
    }
  } else if (input.propensitySource === 'mps') {
    if (mpsP.blank) errors.mps = 'Enter the marginal propensity to save.';
    else if (mpsP.invalid || mpsP.value == null)
      errors.mps = 'Enter a valid MPS.';
    else if (mpsP.value < 0 || mpsP.value > 1)
      errors.mps = 'MPS must be between 0 and 1 in the standard model.';
    else {
      mps = mpsP.value;
      mpc = calculateMPC(mps)!;
      if (mps <= 0) {
        multiplierUndefined = true;
      } else {
        multiplier = calculateSpendingMultiplierFromMPS(mps);
      }
    }
  } else {
    if (kP.blank) errors.multiplier = 'Enter the spending multiplier.';
    else if (kP.invalid || kP.value == null)
      errors.multiplier = 'Enter a valid spending multiplier.';
    else if (kP.value < 1)
      errors.multiplier =
        'In the standard model the spending multiplier is at least 1.';
    else {
      multiplier = kP.value;
      mpc = calculateMpcFromMultiplier(multiplier);
      mps = calculateMpsFromMultiplier(multiplier);
      if (mpc == null || mps == null) {
        errors.multiplier = 'Unable to derive MPC/MPS from this multiplier.';
        mpc = null;
        mps = null;
      }
    }
  }

  let autonomousSpendingBase: number | null = null;
  let outputChangeBase: number | null = null;
  let requiredSpendingBase: number | null = null;

  if (input.impactSolve === 'output') {
    if (!aP.blank) {
      if (aP.invalid || aP.value == null) {
        errors.autonomousSpending =
          'Enter a valid autonomous spending change.';
      } else if (multiplierUndefined) {
        errors.autonomousSpending =
          'Output change is undefined while the multiplier is unbounded.';
      } else if (multiplier != null) {
        autonomousSpendingBase = toBaseUnits(aP.value, mag);
        outputChangeBase = calculateOutputChange(
          autonomousSpendingBase,
          multiplier
        );
        if (outputChangeBase == null) {
          errors.form = 'Unable to calculate the output change.';
        }
      }
    }
  } else if (!yP.blank) {
    if (yP.invalid || yP.value == null) {
      errors.targetOutputChange = 'Enter a valid target output change.';
    } else if (multiplierUndefined) {
      errors.targetOutputChange =
        'Required spending is undefined while the multiplier is unbounded.';
    } else if (multiplier != null) {
      outputChangeBase = toBaseUnits(yP.value, mag);
      requiredSpendingBase = calculateRequiredSpendingChange(
        outputChangeBase,
        multiplier
      );
      autonomousSpendingBase = requiredSpendingBase;
      if (requiredSpendingBase == null) {
        errors.form = 'Unable to calculate required autonomous spending.';
      }
    }
  }

  let observedGdpBase: number | null = null;
  let observedDifferenceBase: number | null = null;
  let observedPercentDiff: number | null = null;

  if (!obsP.blank) {
    if (obsP.invalid || obsP.value == null) {
      errors.observedGdpChange = 'Enter a valid observed GDP change.';
    } else {
      observedGdpBase = toBaseUnits(obsP.value, mag);
      if (outputChangeBase != null) {
        observedDifferenceBase = observedGdpBase - outputChangeBase;
        if (outputChangeBase !== 0) {
          observedPercentDiff =
            (observedDifferenceBase / Math.abs(outputChangeBase)) * 100;
        }
      }
    }
  }

  let roundsCount = 5;
  if (!roundsP.blank) {
    if (
      roundsP.invalid ||
      roundsP.value == null ||
      !Number.isInteger(roundsP.value) ||
      roundsP.value < 0 ||
      roundsP.value > 25
    ) {
      errors.roundsToShow = 'Enter an integer rounds count from 0 to 25.';
    } else {
      roundsCount = roundsP.value;
    }
  }

  const propensityBlocking =
    errors.mpc || errors.mps || errors.multiplier || errors.form;
  if (propensityBlocking || mpc == null || mps == null) {
    return { isValid: false, errors, result: null };
  }

  const moneyFmt = (base: number) =>
    formatMoneyAmount(base, input.currency, mag);

  const rounds =
    autonomousSpendingBase != null && mpc < 1 && multiplier != null
      ? buildSpendingRounds(autonomousSpendingBase, mpc, roundsCount, moneyFmt)
      : [];

  const roundsPartialTotal =
    rounds.length > 0 ? rounds[rounds.length - 1]!.cumulative : null;
  const theoretical = outputChangeBase;
  const roundsPartialShare =
    roundsPartialTotal != null && theoretical != null && theoretical !== 0
      ? (roundsPartialTotal / theoretical) * 100
      : null;

  const steps: string[] = [];
  if (input.propensitySource === 'mpc') {
    steps.push(`MPC = ${formatPropensity(mpc)}.`);
    steps.push(`MPS = 1 − MPC = ${formatPropensity(mps)}.`);
    steps.push(
      multiplierUndefined
        ? 'k = 1/(1−MPC) is undefined when MPC = 1 (unbounded under the simple model).'
        : `k = 1/(1−MPC) = ${formatMultiplier(multiplier!)}.`
    );
  } else if (input.propensitySource === 'mps') {
    steps.push(`MPS = ${formatPropensity(mps)}.`);
    steps.push(`MPC = 1 − MPS = ${formatPropensity(mpc)}.`);
    steps.push(
      multiplierUndefined
        ? 'k = 1/MPS is undefined when MPS = 0.'
        : `k = 1/MPS = ${formatMultiplier(multiplier!)}.`
    );
  } else {
    steps.push(`k = ${formatMultiplier(multiplier!)}.`);
    steps.push(`MPS = 1/k = ${formatPropensity(mps)}.`);
    steps.push(`MPC = 1 − 1/k = ${formatPropensity(mpc)}.`);
  }

  if (
    input.impactSolve === 'output' &&
    autonomousSpendingBase != null &&
    multiplier != null &&
    outputChangeBase != null
  ) {
    steps.push(
      `ΔY = k × ΔA = ${formatMultiplier(multiplier)} × ${moneyFmt(autonomousSpendingBase)} = ${moneyFmt(outputChangeBase)}.`
    );
  }
  if (
    input.impactSolve === 'required' &&
    requiredSpendingBase != null &&
    multiplier != null &&
    outputChangeBase != null
  ) {
    steps.push(
      `ΔA = ΔY / k = ${moneyFmt(outputChangeBase)} / ${formatMultiplier(multiplier)} = ${moneyFmt(requiredSpendingBase)}.`
    );
  }

  const interpretation = multiplierUndefined
    ? `With MPC = ${formatPropensity(mpc)} (MPS = ${formatPropensity(mps)}), the simple Keynesian spending multiplier is undefined/unbounded. Do not display Infinity.`
    : autonomousSpendingBase != null && outputChangeBase != null
      ? `With a marginal propensity to consume of ${formatPropensity(mpc)}, the simple Keynesian spending multiplier is ${formatMultiplier(multiplier!)}. Under the model's assumptions, an initial ${moneyFmt(autonomousSpendingBase)} change in autonomous spending produces a total ${moneyFmt(outputChangeBase)} change in equilibrium output.`
      : `With MPC = ${formatPropensity(mpc)} and MPS = ${formatPropensity(mps)}, the simple spending multiplier is ${formatMultiplier(multiplier!)}.`;

  const result: SpendingMultiplierResult = {
    currency: input.currency,
    magnitude: mag,
    mpc,
    mps,
    multiplier,
    multiplierUndefined,
    autonomousSpendingBase,
    outputChangeBase,
    requiredSpendingBase,
    observedGdpBase,
    observedDifferenceBase,
    observedPercentDiff,
    formattedMpc: formatPropensity(mpc),
    formattedMps: formatPropensity(mps),
    formattedMultiplier: multiplierUndefined
      ? 'Undefined / unbounded'
      : multiplier != null
        ? formatMultiplier(multiplier)
        : '—',
    formattedAutonomous:
      autonomousSpendingBase != null ? moneyFmt(autonomousSpendingBase) : '—',
    formattedOutputChange:
      outputChangeBase != null ? moneyFmt(outputChangeBase) : '—',
    formattedRequired:
      requiredSpendingBase != null ? moneyFmt(requiredSpendingBase) : '—',
    formattedObserved:
      observedGdpBase != null ? moneyFmt(observedGdpBase) : '—',
    formattedObservedDiff:
      observedDifferenceBase != null ? moneyFmt(observedDifferenceBase) : '—',
    formattedObservedPct:
      observedPercentDiff != null ? formatPercent(observedPercentDiff) : '—',
    displayMpc: formatPropensity(mpc),
    displayMps: formatPropensity(mps),
    displayMultiplier:
      multiplier != null ? formatDisplayAmount(multiplier) : '',
    displayAutonomous:
      autonomousSpendingBase != null
        ? formatDisplayAmount(fromBaseUnits(autonomousSpendingBase, mag))
        : '',
    displayOutput:
      outputChangeBase != null
        ? formatDisplayAmount(fromBaseUnits(outputChangeBase, mag))
        : '',
    displayRequired:
      requiredSpendingBase != null
        ? formatDisplayAmount(fromBaseUnits(requiredSpendingBase, mag))
        : '',
    rounds,
    roundsPartialTotal,
    roundsPartialShare,
    formulaBreakdown: multiplierUndefined
      ? 'k = 1/(1−MPC) undefined when MPC = 1'
      : input.propensitySource === 'mps'
        ? `k = 1/MPS = ${formatMultiplier(multiplier!)}`
        : input.propensitySource === 'multiplier'
          ? 'MPC = 1 − 1/k · MPS = 1/k'
          : `k = 1/(1−MPC) = ${formatMultiplier(multiplier!)}`,
    steps,
    interpretation,
    explanation:
      'This is a simplified theoretical result. Real-world outcomes depend on taxes, imports, spare productive capacity, interest rates, expectations, and other economic conditions. Currency selection is denomination only (no FX conversion).',
  };

  return { isValid: true, errors, result };
}
