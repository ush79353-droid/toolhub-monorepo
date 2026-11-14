import { resolvePowerWatts } from './calculation';
import {
  MAX_ABS,
  type IndependentKind,
  type TorqueToHpFieldErrors,
  type TorqueToHpInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete. */
export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    /e[+-]?$/i.test(cleaned)
  );
}

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function checkFinite(
  value: number | null,
  field: keyof TorqueToHpFieldErrors,
  label: string,
  errors: TorqueToHpFieldErrors,
  required: boolean
): boolean {
  if (value === null) {
    if (required) {
      // blank — not ready, no hard error
    }
    return false;
  }
  if (!Number.isFinite(value)) {
    errors[field] = `Enter a valid ${label}.`;
    return false;
  }
  if (Math.abs(value) > MAX_ABS) {
    errors[field] = `Enter a smaller absolute ${label}.`;
    return false;
  }
  return true;
}

function needs(input: TorqueToHpInput, kind: IndependentKind): boolean {
  return input.primary === kind || input.secondary === kind;
}

export function validateTorqueToHp(input: TorqueToHpInput): {
  isValid: boolean;
  errors: TorqueToHpFieldErrors;
} {
  const errors: TorqueToHpFieldErrors = {};

  if (input.primary === input.secondary) {
    errors.pair = 'Choose two independent measurements (torque, speed, or power).';
    return { isValid: false, errors };
  }

  const needTorque = needs(input, 'torque');
  const needSpeed = needs(input, 'speed');
  const needPower = needs(input, 'power');

  const torqueOk = checkFinite(
    input.torque,
    'torque',
    'torque',
    errors,
    needTorque
  );
  const speedOk = checkFinite(input.speed, 'speed', 'rotational speed', errors, needSpeed);

  let powerOk = true;
  if (needPower) {
    if (input.powerVia === 'horsepower') {
      powerOk = checkFinite(
        input.horsepower,
        'horsepower',
        'horsepower',
        errors,
        true
      );
    } else {
      powerOk = checkFinite(input.power, 'power', 'power', errors, true);
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  if (needTorque && !torqueOk) return { isValid: false, errors };
  if (needSpeed && !speedOk) return { isValid: false, errors };
  if (needPower && !powerOk) return { isValid: false, errors };

  // Division / consistency guards after values are present.
  if (needPower && needSpeed && speedOk) {
    const speed = input.speed!;
    // speed display can be any unit; zero in any unit is zero rad/s
    if (speed === 0) {
      const powerW = resolvePowerWatts(input);
      if (powerW !== null && powerW !== 0) {
        errors.speed =
          'Speed cannot be zero when mechanical power (or horsepower) is nonzero.';
      } else if (powerW === 0) {
        errors.pair =
          'Zero speed and zero power do not uniquely determine torque.';
      } else {
        errors.speed = 'A nonzero speed is required to solve for torque.';
      }
    }
  }

  if (needTorque && needPower && torqueOk) {
    if (input.torque === 0) {
      const powerW = resolvePowerWatts(input);
      if (powerW !== null && powerW !== 0) {
        errors.torque =
          'Torque cannot be zero when mechanical power (or horsepower) is nonzero.';
      } else if (powerW === 0) {
        errors.pair =
          'Zero torque and zero power do not uniquely determine speed.';
      } else {
        errors.torque = 'A nonzero torque is required to solve for speed.';
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return { isValid: true, errors };
}
