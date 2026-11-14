import {
  HEX_TO_NIBBLE,
  NIBBLE_TO_HEX,
  type BinaryConversionResult,
  type BinaryConversionStep,
  type HexToBinaryResult,
} from './types';

export { NIBBLE_TO_HEX, HEX_TO_NIBBLE };

/** Strip spaces/underscores; keep digits. */
export function stripBinaryNoise(raw: string): string {
  return raw.trim().replace(/[\s_]/g, '');
}

export function stripHexNoise(raw: string): string {
  return raw.trim().replace(/[\s_]/g, '');
}

/** Remove insignificant leading zeros; keep a single 0. */
export function stripLeadingZeros(digits: string): string {
  const stripped = digits.replace(/^0+/, '');
  return stripped === '' ? '0' : stripped;
}

export function isValidBinary(digits: string): boolean {
  return digits.length > 0 && /^[01]+$/.test(digits);
}

export function isValidHex(digits: string): boolean {
  return digits.length > 0 && /^[0-9A-Fa-f]+$/.test(digits);
}

/** Pad binary on the left so length is a multiple of 4. */
export function padBinaryToNibbles(binary: string): string {
  const rem = binary.length % 4;
  if (rem === 0) return binary;
  return binary.padStart(binary.length + (4 - rem), '0');
}

export function getBinaryToHexSteps(binary: string): BinaryConversionStep[] {
  const cleaned = stripBinaryNoise(binary);
  if (!isValidBinary(cleaned)) {
    throw new Error('Please enter a valid binary number containing only 0 and 1.');
  }
  const padded = padBinaryToNibbles(cleaned);
  const steps: BinaryConversionStep[] = [];
  for (let i = 0; i < padded.length; i += 4) {
    const group = padded.slice(i, i + 4);
    const digit = NIBBLE_TO_HEX[group];
    if (!digit) throw new Error('Invalid nibble during conversion.');
    steps.push({ binaryGroup: group, hexadecimalDigit: digit });
  }
  return steps;
}

export function binaryToHex(binary: string): string {
  const steps = getBinaryToHexSteps(binary);
  return stripLeadingZeros(steps.map((step) => step.hexadecimalDigit).join(''));
}

export function hexToBinary(hex: string): string {
  const cleaned = stripHexNoise(hex).toUpperCase();
  if (!isValidHex(cleaned)) {
    throw new Error('Please enter a valid hexadecimal number (0–9, A–F).');
  }
  const nibbles = [...cleaned].map((digit) => {
    const nibble = HEX_TO_NIBBLE[digit];
    if (!nibble) throw new Error(`Invalid hexadecimal digit: ${digit}`);
    return nibble;
  });
  return stripLeadingZeros(nibbles.join(''));
}

export function binaryToDecimal(binary: string): string {
  const cleaned = stripBinaryNoise(binary);
  if (!isValidBinary(cleaned)) {
    throw new Error('Please enter a valid binary number containing only 0 and 1.');
  }
  return BigInt(`0b${cleaned}`).toString(10);
}

export function binaryToOctal(binary: string): string {
  const cleaned = stripBinaryNoise(binary);
  if (!isValidBinary(cleaned)) {
    throw new Error('Please enter a valid binary number containing only 0 and 1.');
  }
  return BigInt(`0b${cleaned}`).toString(8);
}

export function buildBinaryConversion(binary: string): BinaryConversionResult {
  const cleaned = stripBinaryNoise(binary);
  if (!isValidBinary(cleaned)) {
    throw new Error('Please enter a valid binary number containing only 0 and 1.');
  }
  const steps = getBinaryToHexSteps(cleaned);
  const paddedBinary = padBinaryToNibbles(cleaned);
  const hexadecimal = stripLeadingZeros(steps.map((s) => s.hexadecimalDigit).join(''));
  const value = BigInt(`0b${cleaned}`);
  return {
    binary: cleaned,
    binaryNormalized: stripLeadingZeros(cleaned),
    hexadecimal,
    decimal: value.toString(10),
    octal: value.toString(8),
    steps,
    paddedBinary,
  };
}

export function buildHexToBinary(hex: string): HexToBinaryResult {
  const cleaned = stripHexNoise(hex).toUpperCase();
  if (!isValidHex(cleaned)) {
    throw new Error('Please enter a valid hexadecimal number (0–9, A–F).');
  }
  const normalized = stripLeadingZeros(cleaned);
  const binary = hexToBinary(normalized);
  const nibbles = [...normalized].map((digit) => HEX_TO_NIBBLE[digit]!);
  const binaryGrouped = nibbles.join(' ');
  const value = BigInt(`0x${normalized}`);
  return {
    hexadecimal: cleaned,
    hexadecimalNormalized: normalized,
    binary,
    binaryGrouped,
    decimal: value.toString(10),
    octal: value.toString(8),
  };
}

/** Group binary for display (from the right, spaces every 4). */
export function formatBinaryGrouped(binary: string): string {
  const cleaned = stripBinaryNoise(binary);
  const padded = padBinaryToNibbles(cleaned);
  const parts: string[] = [];
  for (let i = 0; i < padded.length; i += 4) {
    parts.push(padded.slice(i, i + 4));
  }
  return parts.join(' ');
}
