import {
  DECIMAL_HEX_DIGITS,
  HEX_TO_NIBBLE,
  NIBBLE_TO_HEX,
  type BinaryHexStep,
  type BinaryToHexResult,
  type DecimalHexStep,
  type DecimalToHexResult,
  type HexPositionalStep,
  type HexToBothResult,
} from './types';

export { NIBBLE_TO_HEX, HEX_TO_NIBBLE };

export function stripNoise(raw: string): string {
  return raw.trim().replace(/[\s_]/g, '');
}

export function stripLeadingZeros(digits: string): string {
  const stripped = digits.replace(/^0+/, '');
  return stripped === '' ? '0' : stripped;
}

export function normalizeInteger(value: string): string {
  return stripLeadingZeros(stripNoise(value));
}

export function isValidDecimal(value: string): boolean {
  const cleaned = stripNoise(value);
  return cleaned.length > 0 && /^[0-9]+$/.test(cleaned);
}

export function isValidBinary(value: string): boolean {
  const cleaned = stripNoise(value);
  return cleaned.length > 0 && /^[01]+$/.test(cleaned);
}

export function isValidHexadecimal(value: string): boolean {
  const cleaned = stripNoise(value);
  return cleaned.length > 0 && /^[0-9A-Fa-f]+$/.test(cleaned);
}

export function padBinaryToNibbles(binary: string): string {
  const rem = binary.length % 4;
  if (rem === 0) return binary;
  return binary.padStart(binary.length + (4 - rem), '0');
}

export function getDecimalToHexSteps(decimal: string): DecimalHexStep[] {
  const cleaned = stripNoise(decimal);
  if (!isValidDecimal(cleaned)) {
    throw new Error('Enter a valid non-negative decimal integer.');
  }
  let value = BigInt(stripLeadingZeros(cleaned));
  if (value === 0n) {
    return [{ dividend: '0', quotient: '0', remainder: '0', hexDigit: '0' }];
  }
  const steps: DecimalHexStep[] = [];
  while (value > 0n) {
    const rem = value % 16n;
    const quotient = value / 16n;
    const remNum = Number(rem);
    steps.push({
      dividend: value.toString(10),
      quotient: quotient.toString(10),
      remainder: rem.toString(10),
      hexDigit: DECIMAL_HEX_DIGITS[remNum]!,
    });
    value = quotient;
  }
  return steps;
}

export function decimalToHexadecimal(decimal: string): string {
  const cleaned = stripNoise(decimal);
  if (!isValidDecimal(cleaned)) {
    throw new Error('Enter a valid non-negative decimal integer.');
  }
  return BigInt(stripLeadingZeros(cleaned)).toString(16).toUpperCase();
}

export function getBinaryToHexSteps(binary: string): BinaryHexStep[] {
  const cleaned = stripNoise(binary);
  if (!isValidBinary(cleaned)) {
    throw new Error('Enter a valid binary number containing only 0 and 1.');
  }
  const padded = padBinaryToNibbles(cleaned);
  const steps: BinaryHexStep[] = [];
  for (let i = 0; i < padded.length; i += 4) {
    const group = padded.slice(i, i + 4);
    const digit = NIBBLE_TO_HEX[group];
    if (!digit) throw new Error('Invalid nibble during conversion.');
    steps.push({ inputGroup: group, outputGroup: digit });
  }
  return steps;
}

export function binaryToHexadecimal(binary: string): string {
  const steps = getBinaryToHexSteps(binary);
  return stripLeadingZeros(steps.map((step) => step.outputGroup).join(''));
}

export function hexadecimalToDecimal(hex: string): string {
  const cleaned = stripNoise(hex).toUpperCase();
  if (!isValidHexadecimal(cleaned)) {
    throw new Error(
      'Enter a valid hexadecimal number containing digits 0–9 and letters A–F.'
    );
  }
  return BigInt(`0x${stripLeadingZeros(cleaned)}`).toString(10);
}

export function hexadecimalToBinary(hex: string): string {
  const cleaned = stripNoise(hex).toUpperCase();
  if (!isValidHexadecimal(cleaned)) {
    throw new Error(
      'Enter a valid hexadecimal number containing digits 0–9 and letters A–F.'
    );
  }
  const binary = [...stripLeadingZeros(cleaned)]
    .map((digit) => {
      const nibble = HEX_TO_NIBBLE[digit];
      if (!nibble) throw new Error(`Invalid hexadecimal digit: ${digit}`);
      return nibble;
    })
    .join('');
  return stripLeadingZeros(binary);
}

export function getHexPositionalSteps(hex: string): HexPositionalStep[] {
  const cleaned = stripNoise(hex).toUpperCase();
  if (!isValidHexadecimal(cleaned)) {
    throw new Error(
      'Enter a valid hexadecimal number containing digits 0–9 and letters A–F.'
    );
  }
  const normalized = stripLeadingZeros(cleaned);
  const steps: HexPositionalStep[] = [];
  const len = normalized.length;
  for (let i = 0; i < len; i++) {
    const digit = normalized[i]!;
    const power = len - 1 - i;
    const placeValue = (16n ** BigInt(power)).toString(10);
    const digitValue = BigInt(`0x${digit}`);
    const contribution = (digitValue * 16n ** BigInt(power)).toString(10);
    steps.push({ digit, power, placeValue, contribution });
  }
  return steps;
}

export function getHexToBinarySteps(hex: string): BinaryHexStep[] {
  const cleaned = stripNoise(hex).toUpperCase();
  if (!isValidHexadecimal(cleaned)) {
    throw new Error(
      'Enter a valid hexadecimal number containing digits 0–9 and letters A–F.'
    );
  }
  return [...stripLeadingZeros(cleaned)].map((digit) => ({
    inputGroup: digit,
    outputGroup: HEX_TO_NIBBLE[digit]!,
  }));
}

export function buildDecimalToHex(decimal: string): DecimalToHexResult {
  const cleaned = stripNoise(decimal);
  if (!isValidDecimal(cleaned)) {
    throw new Error('Enter a valid non-negative decimal integer.');
  }
  const normalized = stripLeadingZeros(cleaned);
  return {
    decimal: normalized,
    hexadecimal: decimalToHexadecimal(normalized),
    divisionSteps: getDecimalToHexSteps(normalized),
  };
}

export function buildBinaryToHex(binary: string): BinaryToHexResult {
  const cleaned = stripNoise(binary);
  if (!isValidBinary(cleaned)) {
    throw new Error('Enter a valid binary number containing only 0 and 1.');
  }
  const steps = getBinaryToHexSteps(cleaned);
  return {
    binary: cleaned,
    binaryNormalized: stripLeadingZeros(cleaned),
    hexadecimal: stripLeadingZeros(steps.map((s) => s.outputGroup).join('')),
    paddedBinary: padBinaryToNibbles(cleaned),
    steps,
  };
}

export function buildHexToBoth(hex: string): HexToBothResult {
  const cleaned = stripNoise(hex).toUpperCase();
  if (!isValidHexadecimal(cleaned)) {
    throw new Error(
      'Enter a valid hexadecimal number containing digits 0–9 and letters A–F.'
    );
  }
  const normalized = stripLeadingZeros(cleaned);
  return {
    hexadecimal: cleaned,
    hexadecimalNormalized: normalized,
    decimal: hexadecimalToDecimal(normalized),
    binary: hexadecimalToBinary(normalized),
    positionalSteps: getHexPositionalSteps(normalized),
    nibbleSteps: getHexToBinarySteps(normalized),
  };
}
