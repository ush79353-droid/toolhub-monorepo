import type {
  BinaryToDecimalResult,
  BinaryWidth,
  DecimalToBinaryResult,
  SignedRange,
} from './types';
import { DEFAULT_BINARY_WIDTH } from './types';

export { DEFAULT_BINARY_WIDTH };
export type { BinaryWidth };

export function signedRange(bits: BinaryWidth): SignedRange {
  const width = BigInt(bits);
  const min = -(1n << (width - 1n));
  const max = (1n << (width - 1n)) - 1n;
  return { min, max };
}

export function formatSignedInt(value: bigint): string {
  return value.toString(10);
}

/** Group absolute digits in threes; keep leading minus. */
export function formatGroupedInt(value: bigint): string {
  const negative = value < 0n;
  const digits = (negative ? -value : value).toString(10);
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return negative ? `-${grouped}` : grouped;
}

export function formatRangeLabel(bits: BinaryWidth): string {
  const { min, max } = signedRange(bits);
  return `${formatGroupedInt(min)} to ${formatGroupedInt(max)}`;
}

export function decimalToBinary(value: bigint, bits: BinaryWidth): string {
  const { min, max } = signedRange(bits);
  if (value < min || value > max) {
    throw new RangeError(
      `${bits}-bit signed integers must be between ${formatGroupedInt(min)} and ${formatGroupedInt(max)}.`
    );
  }
  return BigInt.asUintN(bits, value).toString(2).padStart(bits, '0');
}

export function binaryToDecimal(binary: string, bits: BinaryWidth): bigint {
  if (!/^[01]+$/.test(binary)) {
    throw new Error('Invalid binary input. Only 0 and 1 are allowed.');
  }
  if (binary.length !== bits) {
    throw new Error(`Enter exactly ${bits} binary digits.`);
  }
  return BigInt.asIntN(bits, BigInt(`0b${binary}`));
}

export function buildDecimalToBinary(
  value: bigint,
  bits: BinaryWidth
): DecimalToBinaryResult {
  const binary = decimalToBinary(value, bits);
  return {
    bits,
    decimal: value,
    binary,
    decimalDisplay: formatSignedInt(value),
  };
}

export function buildBinaryToDecimal(
  binary: string,
  bits: BinaryWidth
): BinaryToDecimalResult {
  const decimal = binaryToDecimal(binary, bits);
  return {
    bits,
    binary,
    decimal,
    decimalDisplay: formatSignedInt(decimal),
  };
}

/** Unsigned binary without fixed width (for educational tables). */
export function unsignedBinary(value: bigint): string {
  if (value < 0n) throw new RangeError('Unsigned binary requires a nonnegative integer.');
  return value.toString(2);
}
