import {
  OCTAL_TO_TRIAD,
  TRIAD_TO_OCTAL,
  type BinaryOctalResult,
  type ConversionDirection,
  type ConversionStep,
} from './types';

export { TRIAD_TO_OCTAL, OCTAL_TO_TRIAD };

export function stripNoise(raw: string): string {
  return raw.trim().replace(/[\s_]/g, '');
}

export function stripLeadingZeros(digits: string): string {
  const stripped = digits.replace(/^0+/, '');
  return stripped === '' ? '0' : stripped;
}

export function isValidBinary(digits: string): boolean {
  return digits.length > 0 && /^[01]+$/.test(digits);
}

export function isValidOctal(digits: string): boolean {
  return digits.length > 0 && /^[0-7]+$/.test(digits);
}

/** Pad binary on the left so length is a multiple of 3. */
export function padBinaryToTriads(binary: string): string {
  const rem = binary.length % 3;
  if (rem === 0) return binary;
  return binary.padStart(binary.length + (3 - rem), '0');
}

export function binaryToOctal(binary: string): string {
  const cleaned = stripNoise(binary);
  if (!isValidBinary(cleaned)) {
    throw new Error('Please enter a valid binary number containing only 0 and 1.');
  }
  const padded = padBinaryToTriads(cleaned);
  let octal = '';
  for (let i = 0; i < padded.length; i += 3) {
    const group = padded.slice(i, i + 3);
    const digit = TRIAD_TO_OCTAL[group];
    if (!digit) throw new Error('Invalid triad during conversion.');
    octal += digit;
  }
  return stripLeadingZeros(octal);
}

export function octalToBinary(octal: string): string {
  const cleaned = stripNoise(octal);
  if (!isValidOctal(cleaned)) {
    throw new Error('Please enter a valid octal number containing digits from 0 to 7.');
  }
  const binary = [...cleaned]
    .map((digit) => {
      const triad = OCTAL_TO_TRIAD[digit];
      if (!triad) throw new Error(`Invalid octal digit: ${digit}`);
      return triad;
    })
    .join('');
  return stripLeadingZeros(binary);
}

export function getBinaryToOctalSteps(binary: string): ConversionStep[] {
  const cleaned = stripNoise(binary);
  if (!isValidBinary(cleaned)) {
    throw new Error('Please enter a valid binary number containing only 0 and 1.');
  }
  const padded = padBinaryToTriads(cleaned);
  const steps: ConversionStep[] = [];
  for (let i = 0; i < padded.length; i += 3) {
    const group = padded.slice(i, i + 3);
    const digit = TRIAD_TO_OCTAL[group]!;
    steps.push({ inputGroup: group, outputGroup: digit });
  }
  return steps;
}

export function getOctalToBinarySteps(octal: string): ConversionStep[] {
  const cleaned = stripNoise(octal);
  if (!isValidOctal(cleaned)) {
    throw new Error('Please enter a valid octal number containing digits from 0 to 7.');
  }
  return [...cleaned].map((digit) => ({
    inputGroup: digit,
    outputGroup: OCTAL_TO_TRIAD[digit]!,
  }));
}

export function calculateBinaryOctal(
  input: string,
  direction: ConversionDirection
): BinaryOctalResult {
  const cleaned = stripNoise(input);

  if (direction === 'binary-to-octal') {
    if (!isValidBinary(cleaned)) {
      throw new Error('Please enter a valid binary number containing only 0 and 1.');
    }
    const steps = getBinaryToOctalSteps(cleaned);
    const paddedInput = padBinaryToTriads(cleaned);
    return {
      direction,
      input: cleaned,
      inputNormalized: stripLeadingZeros(cleaned),
      output: stripLeadingZeros(steps.map((s) => s.outputGroup).join('')),
      steps,
      paddedInput,
    };
  }

  if (!isValidOctal(cleaned)) {
    throw new Error('Please enter a valid octal number containing digits from 0 to 7.');
  }
  const steps = getOctalToBinarySteps(cleaned);
  const combined = steps.map((s) => s.outputGroup).join('');
  return {
    direction,
    input: cleaned,
    inputNormalized: stripLeadingZeros(cleaned),
    output: stripLeadingZeros(combined),
    steps,
    paddedInput: cleaned,
  };
}
