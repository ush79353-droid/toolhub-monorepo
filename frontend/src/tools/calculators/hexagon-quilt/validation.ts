import {
  calculateHexagonQuiltResults,
  convertHexagonMeasurement,
  convertLengthToCm,
} from './calculation';
import type {
  HexagonQuiltFieldErrors,
  HexagonQuiltInput,
  HexagonQuiltResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateQuiltInputs(input: HexagonQuiltInput): {
  errors: HexagonQuiltFieldErrors;
  result: HexagonQuiltResult | null;
} {
  const errors: HexagonQuiltFieldErrors = {};
  const w = parseNumber(input.quiltWidth);
  const l = parseNumber(input.quiltLength);
  const hex = parseNumber(input.hexagonSize);
  const seam = parseNumber(input.seamAllowance);
  const fw = parseNumber(input.fabricWidth);
  const waste = parseNumber(input.wastePercent);

  if (w == null) errors.quiltWidth = 'Enter quilt width.';
  else if (w <= 0) errors.quiltWidth = 'Width must be greater than zero.';

  if (l == null) errors.quiltLength = 'Enter quilt length.';
  else if (l <= 0) errors.quiltLength = 'Length must be greater than zero.';

  if (hex == null) errors.hexagonSize = 'Enter hexagon size.';
  else if (hex <= 0) errors.hexagonSize = 'Hexagon size must be greater than zero.';

  if (seam == null || seam < 0)
    errors.seamAllowance = 'Seam allowance must be zero or positive.';

  if (input.showFabric) {
    if (fw == null || fw <= 0)
      errors.fabricWidth = 'Enter a positive fabric width.';
    if (waste == null || waste < 0)
      errors.wastePercent = 'Waste percent must be zero or positive.';
    else if (waste > 100)
      errors.wastePercent = 'Waste percent looks too high.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const measurementCm = convertLengthToCm(hex!, input.hexagonUnit);
  const sideCm = convertHexagonMeasurement(
    measurementCm,
    input.measurementType,
  );

  if (sideCm < 0.1) {
    return {
      errors: { hexagonSize: 'Hexagon is too small for a practical layout.' },
      result: null,
    };
  }

  const desiredWidthCm = convertLengthToCm(w!, input.quiltUnit);
  const desiredLengthCm = convertLengthToCm(l!, input.quiltUnit);

  if (desiredWidthCm / sideCm > 400 || desiredLengthCm / sideCm > 400) {
    return {
      errors: {
        form: 'Quilt is too large relative to hexagon size (browser safety limit).',
      },
      result: null,
    };
  }

  const fabricWidthCm =
    input.showFabric && fw != null
      ? convertLengthToCm(fw, input.fabricWidthUnit)
      : null;

  const result = calculateHexagonQuiltResults({
    desiredWidthCm,
    desiredLengthCm,
    sideCm,
    seamAllowanceCm: convertLengthToCm(seam!, input.seamUnit),
    fabricWidthCm,
    wastePercent: waste ?? 10,
  });

  return { errors, result };
}
