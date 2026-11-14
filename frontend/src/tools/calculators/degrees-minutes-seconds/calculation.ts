import {
  decimalDegreesToDmsDisplay,
  dmsToDecimalDegrees,
  formatAngle,
  formatDd,
  formatSecondsField,
} from '../coordinates/calculation';
import {
  EXAMPLE_DD_TO_DMS,
  EXAMPLE_DMS_TO_DD,
  type AngleSign,
  type DegreesMinutesSecondsInput,
  type DegreesMinutesSecondsResult,
  type DmsAngleParts,
} from './types';

export {
  EXAMPLE_DD_TO_DMS,
  EXAMPLE_DMS_TO_DD,
  formatDd,
  formatSecondsField,
  dmsToDecimalDegrees,
  decimalDegreesToDmsDisplay,
};

export function formatDdAngle(value: number): string {
  return formatAngle(value, 10);
}

export function angleSignFromNumber(value: number): AngleSign {
  return value < 0 || Object.is(value, -0) ? -1 : 1;
}

/**
 * DMS → signed decimal degrees.
 * `degrees` is nonnegative magnitude; `sign` applies to the whole angle.
 */
export function dmsToDecimal(
  degrees: number,
  minutes: number,
  seconds: number,
  sign: AngleSign
): number {
  if (
    !Number.isFinite(degrees) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds)
  ) {
    throw new Error('Invalid angle');
  }
  if (degrees < 0 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
    throw new Error('Invalid DMS components');
  }
  return dmsToDecimalDegrees(degrees, minutes, seconds, sign);
}

/** Decimal degrees → DMS parts with display rounding carry on seconds. */
export function decimalToDMS(value: number, secondDecimals = 4): DmsAngleParts {
  if (!Number.isFinite(value)) {
    throw new Error('Invalid angle');
  }
  const sign = angleSignFromNumber(value);
  const parts = decimalDegreesToDmsDisplay(value, secondDecimals);
  return {
    sign,
    degrees: parts.degrees,
    minutes: parts.minutes,
    seconds: parts.seconds,
  };
}

export function formatDmsAngleLine(parts: DmsAngleParts): string {
  const body = `${parts.degrees}° ${parts.minutes}′ ${formatSecondsField(parts.seconds)}″`;
  return parts.sign < 0 ? `−${body}` : body;
}

/** Degrees field display: signed whole (or fractional) degrees magnitude with sign. */
export function formatDegreesField(parts: DmsAngleParts): string {
  if (parts.sign < 0 && parts.degrees === 0) {
    return '-0';
  }
  return parts.sign < 0 ? `-${parts.degrees}` : String(parts.degrees);
}

export function calculateDegreesMinutesSeconds(
  input: DegreesMinutesSecondsInput
): DegreesMinutesSecondsResult {
  const decimalDegrees = input.decimalDegrees!;
  const dms = decimalToDMS(decimalDegrees);
  return {
    decimalDegrees,
    dms,
    dmsLine: formatDmsAngleLine(dms),
    ddLine: `${formatDdAngle(decimalDegrees)}°`,
  };
}
