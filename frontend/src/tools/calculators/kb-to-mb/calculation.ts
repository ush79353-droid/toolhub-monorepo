import type { DecimalValue } from '../billion-to-trillion/types';
import {
  formatPlain,
  isZero,
  normalize,
  parseDecimalString,
} from '../billion-to-trillion/calculation';
import {
  BYTES_PER_KB,
  BYTES_PER_KIB,
  BYTES_PER_MB,
  BYTES_PER_MIB,
  DISPLAY_FRAC_DIGITS,
  type FieldUnit,
  type KiloUnit,
} from './types';

export { parseDecimalString, formatPlain, isZero };

const ZERO: DecimalValue = { sign: 1, digits: '0', exp: 0 };

function multiplyByBigInt(value: DecimalValue, factor: bigint): DecimalValue {
  if (isZero(value) || factor === 0n) return { ...ZERO };
  return normalize({
    sign: value.sign,
    digits: (BigInt(value.digits) * factor).toString(),
    exp: value.exp,
  });
}

function divideByBigInt(value: DecimalValue, divisor: bigint, maxFrac = 48): DecimalValue {
  if (isZero(value)) return { ...ZERO };
  if (divisor === 0n) throw new Error('Division by zero');
  let big = BigInt(value.digits);
  let exp = value.exp;
  let guard = 0;
  while (big % divisor !== 0n && guard < maxFrac) {
    big *= 10n;
    exp -= 1;
    guard += 1;
  }
  return normalize({ sign: value.sign, digits: (big / divisor).toString(), exp });
}

function kiloBytesFactor(unit: KiloUnit): bigint {
  return unit === 'kB' ? BYTES_PER_KB : BYTES_PER_KIB;
}

/** Convert any field value to exact byte DecimalValue. */
export function toBytes(
  value: DecimalValue,
  field: FieldUnit,
  kiloUnit: KiloUnit,
): DecimalValue {
  if (field === 'kilo') return multiplyByBigInt(value, kiloBytesFactor(kiloUnit));
  if (field === 'MB') return multiplyByBigInt(value, BYTES_PER_MB);
  return multiplyByBigInt(value, BYTES_PER_MIB);
}

/** Convert bytes DecimalValue into a display field. */
export function fromBytes(
  bytes: DecimalValue,
  field: FieldUnit,
  kiloUnit: KiloUnit,
): DecimalValue {
  if (field === 'kilo') return divideByBigInt(bytes, kiloBytesFactor(kiloUnit));
  if (field === 'MB') return divideByBigInt(bytes, BYTES_PER_MB);
  return divideByBigInt(bytes, BYTES_PER_MIB);
}

export function formatKbMbDisplay(value: DecimalValue): string {
  return formatPlain(value, DISPLAY_FRAC_DIGITS);
}

export function convertFromField(
  sourceText: string,
  sourceField: FieldUnit,
  kiloUnit: KiloUnit,
): Record<FieldUnit, string> {
  const parsed = parseDecimalString(sourceText);
  if (!parsed || parsed.sign < 0) {
    throw new Error('Please enter a valid non-negative data size.');
  }
  const bytes = toBytes(parsed, sourceField, kiloUnit);
  return {
    kilo:
      sourceField === 'kilo'
        ? formatKbMbDisplay(parsed)
        : formatKbMbDisplay(fromBytes(bytes, 'kilo', kiloUnit)),
    MiB:
      sourceField === 'MiB'
        ? formatKbMbDisplay(parsed)
        : formatKbMbDisplay(fromBytes(bytes, 'MiB', kiloUnit)),
    MB:
      sourceField === 'MB'
        ? formatKbMbDisplay(parsed)
        : formatKbMbDisplay(fromBytes(bytes, 'MB', kiloUnit)),
  };
}

/** Preserve edited source text while filling the other fields. */
export function convertPreserveSource(
  sourceText: string,
  sourceField: FieldUnit,
  kiloUnit: KiloUnit,
): Record<FieldUnit, string> {
  const converted = convertFromField(sourceText, sourceField, kiloUnit);
  return { ...converted, [sourceField]: sourceText };
}

// --- Simple number helpers (tests / documentation) ---

export function kilobytesToMegabytes(kilobytes: number): number {
  return kilobytes / 1000;
}

export function megabytesToKilobytes(megabytes: number): number {
  return megabytes * 1000;
}

export function kibibytesToMebibytes(kibibytes: number): number {
  return kibibytes / 1024;
}

export function mebibytesToKibibytes(mebibytes: number): number {
  return mebibytes * 1024;
}

export function kilobytesToMebibytes(kilobytes: number): number {
  return (kilobytes * 1000) / 1_048_576;
}

export function mebibytesToKilobytes(mebibytes: number): number {
  return (mebibytes * 1_048_576) / 1000;
}
