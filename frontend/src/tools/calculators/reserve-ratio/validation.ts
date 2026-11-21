import {
  calculateDepositsFromReserves,
  calculateExcessReserves,
  calculateRequiredReserves,
  calculateReserveRatio,
  calculateReservesFromDeposits,
  calculateSimpleMoneyMultiplier,
  calculateSimplifiedUnreservedFunds,
  formatDisplayAmount,
  formatMoneyAmount,
  formatMultiplier,
  formatPercent,
  fromBaseUnits,
  toBaseUnits,
} from './calculation';
import type {
  ReserveRatioFieldErrors,
  ReserveRatioInput,
  ReserveRatioResult,
} from './types';

export interface ReserveRatioValidation {
  isValid: boolean;
  errors: ReserveRatioFieldErrors;
  result: ReserveRatioResult | null;
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

export function validateReserveRatioInput(
  input: ReserveRatioInput
): ReserveRatioValidation {
  const errors: ReserveRatioFieldErrors = {};
  const mag = input.magnitude;
  const dep = parseNumber(input.deposits);
  const res = parseNumber(input.reserves);
  const reqRatio = parseNumber(input.requiredRatio);
  const reqRes = parseNumber(input.requiredReserves);

  let depositsBase: number | null = null;
  let reservesBase: number | null = null;
  let reserveRatioPercent: number | null = null;
  let requiredRatioPercent: number | null = null;
  let requiredReservesBase: number | null = null;
  let excessOrShortfallBase: number | null = null;
  let excessStatus: ReserveRatioResult['excessStatus'] = null;

  if (input.mode === 'ratio') {
    if (dep.blank) errors.deposits = 'Enter total deposits.';
    else if (dep.invalid || dep.value == null)
      errors.deposits = 'Enter a valid deposit amount.';
    else if (dep.value < 0) errors.deposits = 'Deposits cannot be negative.';
    else if (dep.value === 0)
      errors.deposits = 'Deposits must be greater than zero to calculate a ratio.';

    if (res.blank) errors.reserves = 'Enter total reserves.';
    else if (res.invalid || res.value == null)
      errors.reserves = 'Enter a valid reserves amount.';
    else if (res.value < 0) errors.reserves = 'Reserves cannot be negative.';

    if (Object.keys(errors).length === 0) {
      depositsBase = toBaseUnits(dep.value!, mag);
      reservesBase = toBaseUnits(res.value!, mag);
      reserveRatioPercent = calculateReserveRatio(reservesBase, depositsBase);
      if (reserveRatioPercent == null)
        errors.form = 'Unable to calculate the reserve ratio.';
      if (!reqRatio.blank) {
        if (reqRatio.invalid || reqRatio.value == null)
          errors.requiredRatio = 'Enter a valid required reserve ratio.';
        else if (reqRatio.value < 0 || reqRatio.value > 100)
          errors.requiredRatio =
            'Required reserve ratio must be between 0% and 100%.';
        else {
          requiredRatioPercent = reqRatio.value;
          requiredReservesBase = calculateRequiredReserves(
            depositsBase,
            requiredRatioPercent
          );
          if (requiredReservesBase != null) {
            excessOrShortfallBase = calculateExcessReserves(
              reservesBase,
              requiredReservesBase
            );
            if (excessOrShortfallBase != null) {
              excessStatus =
                excessOrShortfallBase > 0
                  ? 'surplus'
                  : excessOrShortfallBase < 0
                    ? 'shortfall'
                    : 'exact';
            }
          }
        }
      }
    }
  } else if (input.mode === 'required') {
    if (dep.blank) errors.deposits = 'Enter total deposits.';
    else if (dep.invalid || dep.value == null)
      errors.deposits = 'Enter a valid deposit amount.';
    else if (dep.value < 0) errors.deposits = 'Deposits cannot be negative.';

    if (reqRatio.blank)
      errors.requiredRatio = 'Enter the required reserve ratio.';
    else if (reqRatio.invalid || reqRatio.value == null)
      errors.requiredRatio = 'Enter a valid required reserve ratio.';
    else if (reqRatio.value < 0 || reqRatio.value > 100)
      errors.requiredRatio =
        'Required reserve ratio must be between 0% and 100%.';

    if (Object.keys(errors).length === 0) {
      depositsBase = toBaseUnits(dep.value!, mag);
      requiredRatioPercent = reqRatio.value!;
      requiredReservesBase = calculateRequiredReserves(
        depositsBase,
        requiredRatioPercent
      );
      reservesBase = requiredReservesBase;
      reserveRatioPercent = requiredRatioPercent;
      if (requiredReservesBase == null)
        errors.form = 'Unable to calculate required reserves.';
    }
  } else if (input.mode === 'excess') {
    if (res.blank) errors.reserves = 'Enter actual (total) reserves.';
    else if (res.invalid || res.value == null)
      errors.reserves = 'Enter a valid reserves amount.';
    else if (res.value < 0) errors.reserves = 'Reserves cannot be negative.';

    if (reqRes.blank) errors.requiredReserves = 'Enter required reserves.';
    else if (reqRes.invalid || reqRes.value == null)
      errors.requiredReserves = 'Enter a valid required reserves amount.';
    else if (reqRes.value < 0)
      errors.requiredReserves = 'Required reserves cannot be negative.';

    if (Object.keys(errors).length === 0) {
      reservesBase = toBaseUnits(res.value!, mag);
      requiredReservesBase = toBaseUnits(reqRes.value!, mag);
      excessOrShortfallBase = calculateExcessReserves(
        reservesBase,
        requiredReservesBase
      );
      if (excessOrShortfallBase == null) {
        errors.form = 'Unable to calculate excess reserves.';
      } else {
        excessStatus =
          excessOrShortfallBase > 0
            ? 'surplus'
            : excessOrShortfallBase < 0
              ? 'shortfall'
              : 'exact';
      }
      depositsBase = Math.max(reservesBase, requiredReservesBase);
    }
  } else if (input.mode === 'deposits') {
    if (res.blank) errors.reserves = 'Enter total reserves.';
    else if (res.invalid || res.value == null)
      errors.reserves = 'Enter a valid reserves amount.';
    else if (res.value < 0) errors.reserves = 'Reserves cannot be negative.';

    if (reqRatio.blank) errors.requiredRatio = 'Enter the reserve ratio.';
    else if (reqRatio.invalid || reqRatio.value == null)
      errors.requiredRatio = 'Enter a valid reserve ratio.';
    else if (reqRatio.value <= 0)
      errors.requiredRatio =
        'Reserve ratio must be greater than zero to solve for deposits.';

    if (Object.keys(errors).length === 0) {
      reservesBase = toBaseUnits(res.value!, mag);
      reserveRatioPercent = reqRatio.value!;
      depositsBase = calculateDepositsFromReserves(
        reservesBase,
        reserveRatioPercent
      );
      if (depositsBase == null) errors.form = 'Unable to calculate deposits.';
    }
  } else {
    // reserves mode
    if (dep.blank) errors.deposits = 'Enter total deposits.';
    else if (dep.invalid || dep.value == null)
      errors.deposits = 'Enter a valid deposit amount.';
    else if (dep.value < 0) errors.deposits = 'Deposits cannot be negative.';

    if (reqRatio.blank) errors.requiredRatio = 'Enter the reserve ratio.';
    else if (reqRatio.invalid || reqRatio.value == null)
      errors.requiredRatio = 'Enter a valid reserve ratio.';
    else if (reqRatio.value < 0)
      errors.requiredRatio = 'Reserve ratio cannot be negative.';

    if (Object.keys(errors).length === 0) {
      depositsBase = toBaseUnits(dep.value!, mag);
      reserveRatioPercent = reqRatio.value!;
      reservesBase = calculateReservesFromDeposits(
        depositsBase,
        reserveRatioPercent
      );
      if (reservesBase == null) errors.form = 'Unable to calculate reserves.';
    }
  }

  if (
    Object.keys(errors).length > 0 ||
    depositsBase == null ||
    reservesBase == null
  ) {
    return { isValid: false, errors, result: null };
  }

  const unreservedFundsBase = calculateSimplifiedUnreservedFunds(
    depositsBase,
    reservesBase
  );
  const unreservedApplicable = unreservedFundsBase != null;

  const ratioForMultiplier =
    reserveRatioPercent != null
      ? reserveRatioPercent
      : calculateReserveRatio(reservesBase, depositsBase);

  const moneyMultiplierUndefined =
    ratioForMultiplier != null && ratioForMultiplier <= 0;
  const moneyMultiplier =
    ratioForMultiplier != null
      ? calculateSimpleMoneyMultiplier(ratioForMultiplier)
      : null;

  const displayDep = formatDisplayAmount(fromBaseUnits(depositsBase, mag));
  const displayRes = formatDisplayAmount(fromBaseUnits(reservesBase, mag));
  const displayRatio =
    reserveRatioPercent != null ? formatPercent(reserveRatioPercent) : '—';

  const steps: string[] = [];
  let formulaBreakdown = '';
  let interpretation = '';

  if (input.mode === 'ratio') {
    formulaBreakdown = 'RR = (Reserves / Deposits) × 100';
    steps.push(
      `Deposits = ${formatMoneyAmount(depositsBase, input.currency, mag)}.`
    );
    steps.push(
      `Reserves = ${formatMoneyAmount(reservesBase, input.currency, mag)}.`
    );
    steps.push(
      `RR = (${formatMoneyAmount(reservesBase, input.currency, mag)} / ${formatMoneyAmount(depositsBase, input.currency, mag)}) × 100 = ${displayRatio}.`
    );
    if (unreservedApplicable) {
      steps.push(
        `Funds not held as reserves = D − R = ${formatMoneyAmount(unreservedFundsBase!, input.currency, mag)} (simplified illustration, not automatic lending capacity).`
      );
    } else {
      steps.push(
        'Reserves exceed deposits, so the simplified deposits-minus-reserves illustration is not applicable.'
      );
    }
    interpretation = `The bank holds reserves equivalent to ${displayRatio} of its deposits.${
      unreservedApplicable
        ? ` Under a simplified balance-sheet calculation, ${formatMoneyAmount(unreservedFundsBase!, input.currency, mag)} of deposits is not matched by reserves. This amount is not automatically the bank's available lending capacity.`
        : ' The simplified unreserved-funds illustration does not apply when reserves exceed deposits.'
    }`;
  } else if (input.mode === 'required') {
    formulaBreakdown = 'Required Reserves = Deposits × (r / 100)';
    steps.push(
      `Required reserves = ${formatMoneyAmount(depositsBase, input.currency, mag)} × ${formatPercent(requiredRatioPercent!)} / 100.`
    );
    steps.push(
      `Required reserves = ${formatMoneyAmount(requiredReservesBase!, input.currency, mag)}.`
    );
    interpretation = `At a required reserve ratio of ${formatPercent(requiredRatioPercent!)}, required reserves are ${formatMoneyAmount(requiredReservesBase!, input.currency, mag)}.`;
  } else if (input.mode === 'excess') {
    formulaBreakdown = 'Excess / Shortfall = Actual Reserves − Required Reserves';
    steps.push(
      `Actual reserves = ${formatMoneyAmount(reservesBase, input.currency, mag)}.`
    );
    steps.push(
      `Required reserves = ${formatMoneyAmount(requiredReservesBase!, input.currency, mag)}.`
    );
    const absDiff = Math.abs(excessOrShortfallBase!);
    if (excessStatus === 'shortfall') {
      steps.push(
        `Reserve shortfall = ${formatMoneyAmount(absDiff, input.currency, mag)}.`
      );
      interpretation = `Actual reserves fall short of required reserves by ${formatMoneyAmount(absDiff, input.currency, mag)}.`;
    } else if (excessStatus === 'surplus') {
      steps.push(
        `Excess reserves = ${formatMoneyAmount(absDiff, input.currency, mag)}.`
      );
      interpretation = `Excess reserves (surplus) = ${formatMoneyAmount(absDiff, input.currency, mag)}.`;
    } else {
      steps.push('Actual reserves exactly equal required reserves.');
      interpretation = 'Actual reserves exactly meet required reserves.';
    }
  } else if (input.mode === 'deposits') {
    formulaBreakdown = 'D = R / (r / 100)';
    steps.push(
      `Deposits = ${formatMoneyAmount(reservesBase, input.currency, mag)} / (${formatPercent(reserveRatioPercent!)} / 100).`
    );
    steps.push(
      `Deposits = ${formatMoneyAmount(depositsBase, input.currency, mag)}.`
    );
    interpretation = `At a ${formatPercent(reserveRatioPercent!)} reserve ratio, ${formatMoneyAmount(reservesBase, input.currency, mag)} of reserves implies ${formatMoneyAmount(depositsBase, input.currency, mag)} of deposits.`;
  } else {
    formulaBreakdown = 'R = D × (r / 100)';
    steps.push(
      `Reserves = ${formatMoneyAmount(depositsBase, input.currency, mag)} × (${formatPercent(reserveRatioPercent!)} / 100).`
    );
    steps.push(
      `Reserves = ${formatMoneyAmount(reservesBase, input.currency, mag)}.`
    );
    interpretation = `At a ${formatPercent(reserveRatioPercent!)} reserve ratio, reserves equal ${formatMoneyAmount(reservesBase, input.currency, mag)}.`;
  }

  const chartReservesShare =
    depositsBase > 0
      ? Math.min((reservesBase / depositsBase) * 100, 100)
      : null;
  const chartRemainderShare =
    chartReservesShare != null && unreservedApplicable
      ? 100 - chartReservesShare
      : chartReservesShare != null && reservesBase > depositsBase
        ? null
        : null;

  const result: ReserveRatioResult = {
    mode: input.mode,
    currency: input.currency,
    magnitude: mag,
    depositsBase,
    reservesBase,
    reserveRatioPercent,
    requiredRatioPercent,
    requiredReservesBase,
    excessOrShortfallBase,
    excessStatus,
    unreservedFundsBase,
    unreservedApplicable,
    moneyMultiplier,
    moneyMultiplierUndefined,
    formattedDeposits: formatMoneyAmount(depositsBase, input.currency, mag),
    formattedReserves: formatMoneyAmount(reservesBase, input.currency, mag),
    formattedRatio: displayRatio,
    formattedRequiredRatio:
      requiredRatioPercent != null ? formatPercent(requiredRatioPercent) : '—',
    formattedRequiredReserves:
      requiredReservesBase != null
        ? formatMoneyAmount(requiredReservesBase, input.currency, mag)
        : '—',
    formattedExcess:
      excessOrShortfallBase != null
        ? formatMoneyAmount(
            Math.abs(excessOrShortfallBase),
            input.currency,
            mag
          )
        : '—',
    formattedUnreserved: unreservedApplicable
      ? formatMoneyAmount(unreservedFundsBase!, input.currency, mag)
      : 'Not applicable',
    formattedMultiplier: moneyMultiplierUndefined
      ? 'Undefined under the simple money multiplier model'
      : moneyMultiplier != null
        ? formatMultiplier(moneyMultiplier)
        : '—',
    displayDeposits: displayDep,
    displayReserves: displayRes,
    displayRatio:
      reserveRatioPercent != null
        ? formatDisplayAmount(reserveRatioPercent)
        : '',
    displayRequiredRatio:
      requiredRatioPercent != null
        ? formatDisplayAmount(requiredRatioPercent)
        : '',
    displayRequiredReserves:
      requiredReservesBase != null
        ? formatDisplayAmount(fromBaseUnits(requiredReservesBase, mag))
        : '',
    formulaBreakdown,
    steps,
    interpretation,
    explanation:
      'Currency selection is denomination only (no FX conversion). The simple money multiplier is a textbook identity, not a forecast of lending. Reserve requirements vary by jurisdiction; some systems (e.g. U.S. Fed since March 2020) set reserve requirement ratios to zero while other liquidity and capital rules still apply.',
    chartReservesShare,
    chartRemainderShare,
  };

  return { isValid: true, errors: {}, result };
}
