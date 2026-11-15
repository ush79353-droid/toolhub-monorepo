import {
  DECIMAL_HEX_DIGITS,
  INT16_MAX,
  INT16_MIN,
  UINT16_MOD,
  type ConversionDirection,
  type DecimalHexResult,
  type DecimalHexStep,
  type HexPositionalStep,
  type HexRepresentation,
} from './types';

export function stripNoise(raw: string): string {
  return raw.trim().replace(/[\s_]/g, '');
}

export function stripLeadingZeros(digits: string): string {
  const stripped = digits.replace(/^0+/, '');
  return stripped === '' ? '0' : stripped;
}

export function normalizeHexadecimal(value: string): string {
  return stripLeadingZeros(stripNoise(value).toUpperCase());
}

/** Signed or unsigned integer string (optional leading minus). */
export function isValidDecimal(value: string): boolean {
  const cleaned = stripNoise(value);
  return cleaned.length > 0 && /^-?[0-9]+$/.test(cleaned) && cleaned !== '-';
}

export function isValidHexadecimal(value: string): boolean {
  const cleaned = stripNoise(value);
  return cleaned.length > 0 && /^[0-9A-Fa-f]+$/.test(cleaned);
}

function parseDecimalBigInt(cleaned: string): bigint {
  if (!isValidDecimal(cleaned)) {
    throw new Error('Enter a valid integer between -32768 and 32767.');
  }
  return BigInt(cleaned);
}

export function getUnsignedDivisionSteps(magnitude: bigint): DecimalHexStep[] {
  let value = magnitude < 0n ? -magnitude : magnitude;
  if (value === 0n) {
    return [{ dividend: '0', quotient: '0', remainder: '0', hexDigit: '0' }];
  }
  const steps: DecimalHexStep[] = [];
  while (value > 0n) {
    const rem = value % 16n;
    const quotient = value / 16n;
    steps.push({
      dividend: value.toString(10),
      quotient: quotient.toString(10),
      remainder: rem.toString(10),
      hexDigit: DECIMAL_HEX_DIGITS[Number(rem)]!,
    });
    value = quotient;
  }
  return steps;
}

/** Minimal uppercase hex for a non-negative BigInt. */
export function unsignedBigIntToHex(value: bigint): string {
  if (value < 0n) throw new Error('Unsigned conversion requires a non-negative value.');
  return value.toString(16).toUpperCase();
}

export function toSigned16BitHex(value: number): string {
  if (!Number.isInteger(value) || value < INT16_MIN || value > INT16_MAX) {
    throw new Error('Enter a valid integer between -32768 and 32767.');
  }
  const unsigned = value < 0 ? UINT16_MOD + value : value;
  return unsigned.toString(16).toUpperCase().padStart(4, '0');
}

export function fromSigned16BitHex(value: string): number {
  const cleaned = stripNoise(value).toUpperCase();
  if (!isValidHexadecimal(cleaned)) {
    throw new Error(
      'Enter a valid hexadecimal number using digits 0–9 and letters A–F.'
    );
  }
  const normalized = stripLeadingZeros(cleaned);
  if (normalized.length > 4) {
    throw new Error('Signed 16-bit hexadecimal values use at most 4 digits.');
  }
  const padded = normalized.padStart(4, '0');
  const unsigned = Number.parseInt(padded, 16);
  if (unsigned >= 0x8000) return unsigned - UINT16_MOD;
  return unsigned;
}

export function decimalToHexadecimal(
  value: string,
  options?: { signed16Bit?: boolean; fixedWidth?: boolean }
): string {
  const cleaned = stripNoise(value);
  if (!isValidDecimal(cleaned)) {
    throw new Error('Enter a valid integer between -32768 and 32767.');
  }
  const n = parseDecimalBigInt(cleaned);
  const signed16Bit = options?.signed16Bit !== false;
  const fixedWidth = Boolean(options?.fixedWidth);

  if (signed16Bit) {
    if (n < BigInt(INT16_MIN) || n > BigInt(INT16_MAX)) {
      throw new Error('Enter a valid integer between -32768 and 32767.');
    }
    const asNumber = Number(n);
    if (n < 0n || fixedWidth) {
      return toSigned16BitHex(asNumber);
    }
    return unsignedBigIntToHex(n);
  }

  if (n < 0n) {
    throw new Error('Unsigned decimal-to-hex requires a non-negative integer.');
  }
  const hex = unsignedBigIntToHex(n);
  return fixedWidth ? hex.padStart(4, '0') : hex;
}

export function hexadecimalToDecimal(
  value: string,
  options?: { signed16Bit?: boolean }
): string {
  const cleaned = stripNoise(value).toUpperCase();
  if (!isValidHexadecimal(cleaned)) {
    throw new Error(
      'Enter a valid hexadecimal number using digits 0–9 and letters A–F.'
    );
  }
  if (options?.signed16Bit) {
    return String(fromSigned16BitHex(cleaned));
  }
  return BigInt(`0x${stripLeadingZeros(cleaned)}`).toString(10);
}

export function getHexPositionalSteps(hex: string): HexPositionalStep[] {
  const normalized = normalizeHexadecimal(hex);
  const steps: HexPositionalStep[] = [];
  const len = normalized.length;
  for (let i = 0; i < len; i++) {
    const digit = normalized[i]!;
    const power = len - 1 - i;
    const contribution = (BigInt(`0x${digit}`) * 16n ** BigInt(power)).toString(10);
    steps.push({ digit, power, contribution });
  }
  return steps;
}

export function calculateDecimalHex(
  input: string,
  direction: ConversionDirection,
  representation: HexRepresentation,
  fixedWidth: boolean
): DecimalHexResult {
  const cleaned = stripNoise(input);

  if (direction === 'decimal-to-hex') {
    const hex = decimalToHexadecimal(cleaned, {
      signed16Bit: true,
      fixedWidth,
    });
    const n = parseDecimalBigInt(cleaned);
    const magnitude = n < 0n ? -n : n;
    const divisionSteps = getUnsignedDivisionSteps(magnitude);
    let signedNote: string | undefined;
    if (n < 0n) {
      const unsigned = UINT16_MOD + Number(n);
      signedNote = `Two's complement (16-bit): ${UINT16_MOD} + (${n}) = ${unsigned} → ${hex}`;
    }
    return {
      direction,
      representation: n < 0n || fixedWidth ? 'signed-16' : 'unsigned',
      input: cleaned,
      output: hex,
      formula: `${cleaned}₁₀ = ${hex}₁₆`,
      divisionSteps,
      signedNote,
      fixedWidth,
    };
  }

  const signed16Bit = representation === 'signed-16';
  const decimal = hexadecimalToDecimal(cleaned, { signed16Bit });
  const normalized = normalizeHexadecimal(cleaned);
  return {
    direction,
    representation,
    input: cleaned.toUpperCase(),
    output: decimal,
    formula: `${normalized}₁₆ = ${decimal}₁₀`,
    positionalSteps: getHexPositionalSteps(normalized),
    signedNote: signed16Bit
      ? 'Interpreted as signed 16-bit two\'s complement.'
      : 'Interpreted as unsigned hexadecimal.',
    fixedWidth: false,
  };
}
