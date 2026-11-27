import { calculateFaceShape, parseNumber } from './calculation';
import type {
  FaceShapeFieldErrors,
  FaceShapeInput,
  FaceShapeResult,
} from './types';

export interface FaceShapeValidation {
  errors: FaceShapeFieldErrors;
  result: FaceShapeResult | null;
}

export function validateFaceShapeInput(
  input: FaceShapeInput,
): FaceShapeValidation {
  const errors: FaceShapeFieldErrors = {};

  const check = (
    key: keyof FaceShapeFieldErrors,
    raw: string,
    label: string,
  ) => {
    if (raw.trim() === '') return;
    const n = parseNumber(raw);
    if (n === null) errors[key] = `Enter a valid ${label}.`;
    else if (!(n > 0)) errors[key] = `${label} must be greater than zero.`;
  };

  check('foreheadText', input.foreheadText, 'forehead width');
  check('cheeksText', input.cheeksText, 'cheeks width');
  check('jawlineText', input.jawlineText, 'jawline length');
  check('faceLengthText', input.faceLengthText, 'face length');

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const allFilled =
    input.foreheadText.trim() !== '' &&
    input.cheeksText.trim() !== '' &&
    input.jawlineText.trim() !== '' &&
    input.faceLengthText.trim() !== '';

  if (!allFilled) {
    return { errors: {}, result: calculateFaceShape(input) };
  }

  const allPositive =
    (parseNumber(input.foreheadText) ?? 0) > 0 &&
    (parseNumber(input.cheeksText) ?? 0) > 0 &&
    (parseNumber(input.jawlineText) ?? 0) > 0 &&
    (parseNumber(input.faceLengthText) ?? 0) > 0;

  return {
    errors: {},
    result: allPositive ? calculateFaceShape(input) : null,
  };
}