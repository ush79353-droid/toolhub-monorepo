import {
  calculateCurtainSizeResults,
  convertLengthToCm,
} from './calculation';
import type {
  CurtainSizeFieldErrors,
  CurtainSizeInput,
  CurtainSizeResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

function parsePositiveInt(raw: string): number | null {
  const n = parseNumber(raw);
  if (n == null || !Number.isInteger(n)) return null;
  return n;
}

export function validateCurtainSizeInputs(input: CurtainSizeInput): {
  errors: CurtainSizeFieldErrors;
  result: CurtainSizeResult | null;
} {
  const errors: CurtainSizeFieldErrors = {};
  const unit = input.unit;

  const fullness = parseNumber(input.fullnessMultiplier);
  const height = parseNumber(input.windowHeight);
  const width = parseNumber(input.windowWidth);
  const mount = parseNumber(input.rodMountingHeight);
  const ext = parseNumber(input.rodExtension);
  const below = parseNumber(input.extraLengthBelowSill);
  const cafe = parseNumber(input.cafeCoverageRatio);
  const floorH = parseNumber(input.rodHeightAboveFloor);
  const clear = parseNumber(input.floorClearance);
  const puddle = parseNumber(input.puddlingLength);
  const panels = parsePositiveInt(input.numberOfPanels);

  if (fullness == null || fullness <= 0)
    errors.fullnessMultiplier = 'Fullness must be greater than zero.';
  if (height == null) errors.windowHeight = 'Enter window height.';
  else if (height <= 0)
    errors.windowHeight = 'Window height must be greater than zero.';
  if (width == null) errors.windowWidth = 'Enter window width.';
  else if (width <= 0)
    errors.windowWidth = 'Window width must be greater than zero.';
  if (mount == null || mount < 0)
    errors.rodMountingHeight = 'Rod mounting height must be zero or positive.';
  if (ext == null || ext < 0)
    errors.rodExtension = 'Rod extension must be zero or positive.';
  if (below == null || below < 0)
    errors.extraLengthBelowSill =
      'Extra length below sill must be zero or positive.';
  if (cafe == null || cafe <= 0 || cafe > 1)
    errors.cafeCoverageRatio =
      'Café coverage must be greater than 0 and at most 1.';
  if (clear == null || clear < 0)
    errors.floorClearance = 'Floor clearance must be zero or positive.';
  if (puddle == null || puddle < 0)
    errors.puddlingLength = 'Puddling length must be zero or positive.';
  if (panels == null || panels <= 0)
    errors.numberOfPanels = 'Number of panels must be a positive whole number.';

  if (input.curtainType === 'extra-long') {
    if (floorH == null)
      errors.rodHeightAboveFloor =
        'Enter rod height above the floor for extra-long curtains.';
    else if (floorH <= 0)
      errors.rodHeightAboveFloor =
        'Rod height above floor must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateCurtainSizeResults({
    curtainType: input.curtainType,
    fullnessMultiplier: fullness!,
    windowHeightCm: convertLengthToCm(height!, unit),
    windowWidthCm: convertLengthToCm(width!, unit),
    rodMountingHeightCm: convertLengthToCm(mount!, unit),
    rodExtensionCm: convertLengthToCm(ext!, unit),
    extraLengthBelowSillCm: convertLengthToCm(below!, unit),
    cafeCoverageRatio: cafe!,
    rodHeightAboveFloorCm:
      floorH != null ? convertLengthToCm(floorH, unit) : 0,
    floorClearanceCm: convertLengthToCm(clear!, unit),
    puddlingLengthCm: convertLengthToCm(puddle!, unit),
    numberOfPanels: panels!,
  });

  return { errors, result };
}
