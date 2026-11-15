import {
  MAX_DISPLAYED_STEPS,
  type ConversionDirection,
  type DecimalOctalResult,
  type DivisionStep,
  type PositionalStep,
} from './types';

export function normalizeNumericInput(value: string): string {
  return value.trim().replace(/[\s_]/g, '');
}

export function stripLeadingZeros(digits: string): string {
  const stripped = digits.replace(/^0+/, '');
  return stripped === '' ? '0' : stripped;
}

export function isValidDecimalInteger(value: string): boolean {
  const cleaned = normalizeNumericInput(value);
  return cleaned.length > 0 && /^\d+$/.test(cleaned);
}

export function isValidOctalInteger(value: string): boolean {
  const cleaned = normalizeNumericInput(value);
  return cleaned.length > 0 && /^[0-7]+$/.test(cleaned);
}

export function decimalToOctal(value: string): string {
  const cleaned = normalizeNumericInput(value);
  if (!isValidDecimalInteger(cleaned)) {
    throw new Error('Please enter a valid non-negative whole number.');
  }
  return BigInt(stripLeadingZeros(cleaned)).toString(8);
}

export function octalToDecimal(value: string): string {
  const cleaned = normalizeNumericInput(value);
  if (!isValidOctalInteger(cleaned)) {
    throw new Error('Enter a valid octal number using digits from 0 to 7 only.');
  }
  return BigInt(`0o${stripLeadingZeros(cleaned)}`).toString(10);
}

export function getDecimalToOctalSteps(value: string): {
  steps: DivisionStep[];
  truncated: boolean;
} {
  const cleaned = normalizeNumericInput(value);
  if (!isValidDecimalInteger(cleaned)) {
    throw new Error('Please enter a valid non-negative whole number.');
  }
  let current = BigInt(stripLeadingZeros(cleaned));
  if (current === 0n) {
    return {
      steps: [{ dividend: '0', quotient: '0', remainder: '0' }],
      truncated: false,
    };
  }
  const steps: DivisionStep[] = [];
  let truncated = false;
  while (current > 0n) {
    if (steps.length >= MAX_DISPLAYED_STEPS) {
      truncated = true;
      break;
    }
    const rem = current % 8n;
    const quotient = current / 8n;
    steps.push({
      dividend: current.toString(10),
      quotient: quotient.toString(10),
      remainder: rem.toString(10),
    });
    current = quotient;
  }
  return { steps, truncated };
}

export function getOctalToDecimalSteps(value: string): {
  steps: PositionalStep[];
  truncated: boolean;
} {
  const cleaned = normalizeNumericInput(value);
  if (!isValidOctalInteger(cleaned)) {
    throw new Error('Enter a valid octal number using digits from 0 to 7 only.');
  }
  const normalized = stripLeadingZeros(cleaned);
  const len = normalized.length;
  const steps: PositionalStep[] = [];
  let truncated = false;
  const start = Math.max(0, len - MAX_DISPLAYED_STEPS);
  if (start > 0) truncated = true;
  for (let i = start; i < len; i++) {
    const digit = normalized[i]!;
    const power = len - 1 - i;
    const contribution = (BigInt(digit) * 8n ** BigInt(power)).toString(10);
    steps.push({ digit, power, contribution });
  }
  return { steps, truncated };
}

export function calculateDecimalOctal(
  input: string,
  direction: ConversionDirection
): DecimalOctalResult {
  const cleaned = normalizeNumericInput(input);

  if (direction === 'decimal-to-octal') {
    if (!isValidDecimalInteger(cleaned)) {
      throw new Error('Please enter a valid non-negative whole number.');
    }
    const normalized = stripLeadingZeros(cleaned);
    const output = decimalToOctal(normalized);
    const { steps, truncated } = getDecimalToOctalSteps(normalized);
    return {
      direction,
      input: cleaned,
      inputNormalized: normalized,
      output,
      formula: `${normalized}₁₀ = ${output}₈`,
      divisionSteps: steps,
      stepsTruncated: truncated,
    };
  }

  if (!isValidOctalInteger(cleaned)) {
    throw new Error('Enter a valid octal number using digits from 0 to 7 only.');
  }
  const normalized = stripLeadingZeros(cleaned);
  const output = octalToDecimal(normalized);
  const { steps, truncated } = getOctalToDecimalSteps(normalized);
  return {
    direction,
    input: cleaned,
    inputNormalized: normalized,
    output,
    formula: `${normalized}₈ = ${output}₁₀`,
    positionalSteps: steps,
    stepsTruncated: truncated,
  };
}
